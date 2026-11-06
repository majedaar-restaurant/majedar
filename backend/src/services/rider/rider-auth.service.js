import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';
import { Rider } from '../../models/Rider.js';
import { BadRequestError, ConflictError, UnauthorizedError } from '../../utils/errors.js';
import { signToken } from '../../utils/token.js';
import { verifyGoogleToken } from '../customer-auth/google-auth.service.js';
import { sendEmail } from '../email/resend.service.js';

const saltRounds = 12;

const safeProfile = (rider) => ({
    _id: rider._id,
    name: rider.name,
    phone: rider.phone,
    email: rider.email,
    isActive: rider.isActive,
    availability: rider.availability,
    authProvider: rider.authProvider,
});

const issueSession = (rider) => ({
    token: signToken({ id: rider._id.toString(), type: 'rider', tokenVersion: rider.tokenVersion || 0 }),
    rider: safeProfile(rider),
});

export const loginRider = async ({ email, password }) => {
    const rider = await Rider.findOne({ email: email.trim().toLowerCase() }).select('+passwordHash');
    if (!rider || !rider.passwordHash || !rider.isActive || !(await rider.comparePassword(password))) {
        throw new UnauthorizedError('Invalid email or password, or rider account is inactive.');
    }
    return issueSession(rider);
};

export const loginRiderWithGoogle = async (idToken) => {
    const google = await verifyGoogleToken(idToken);
    const email = google.email.trim().toLowerCase();
    const rider = await Rider.findOne({ $or: [{ email }, { googleId: google.sub }] });
    if (!rider || !rider.isActive) {
        throw new UnauthorizedError('No active rider account is registered for this Google email.');
    }
    if (rider.email !== email) {
        throw new UnauthorizedError('This Google account does not match the rider email on file.');
    }
    if (rider.googleId !== google.sub) {
        rider.googleId = google.sub;
        rider.authProvider = 'google';
        await rider.save();
    }
    return issueSession(rider);
};

export const updateRiderProfile = async (riderId, { name, phone }) => {
    const rider = await Rider.findById(riderId);
    if (!rider) throw new UnauthorizedError('Rider account is unavailable.');
    if (name !== undefined) rider.name = name.trim();
    if (phone !== undefined) rider.phone = phone.trim();
    await rider.save();
    return safeProfile(rider);
};

export const changeRiderPassword = async (riderId, { currentPassword, newPassword }) => {
    const rider = await Rider.findById(riderId).select('+passwordHash');
    if (!rider?.passwordHash || !(await rider.comparePassword(currentPassword))) {
        throw new UnauthorizedError('Current password is incorrect.');
    }
    rider.passwordHash = await bcrypt.hash(newPassword, saltRounds);
    rider.tokenVersion = (rider.tokenVersion || 0) + 1;
    await rider.save();
};

export const requestRiderEmailChange = async (riderId, email) => {
    const normalizedEmail = email.trim().toLowerCase();
    const existing = await Rider.findOne({ email: normalizedEmail, _id: { $ne: riderId } });
    if (existing) throw new ConflictError('An account with this email already exists.');

    const rider = await Rider.findById(riderId);
    if (!rider) throw new UnauthorizedError('Rider account is unavailable.');
    if (rider.email === normalizedEmail) throw new BadRequestError('This is already your current email.');

    const code = crypto.randomInt(100000, 1000000).toString();
    rider.emailChange = {
        email: normalizedEmail,
        codeHash: crypto.createHash('sha256').update(code).digest('hex'),
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    };
    await rider.save();
    await sendEmail({
        to: normalizedEmail,
        subject: 'Verify your new Majedaar rider email',
        text: `Your rider email verification code is ${code}. It expires in 10 minutes.`,
        html: `<p>Your Majedaar rider email verification code is <strong>${code}</strong>.</p><p>It expires in 10 minutes.</p>`,
    });
};

export const verifyRiderEmailChange = async (riderId, code) => {
    const rider = await Rider.findById(riderId).select('+emailChange.codeHash');
    const change = rider?.emailChange;
    if (!change?.email || !change.codeHash || !change.expiresAt || change.expiresAt <= new Date()) {
        throw new BadRequestError('Email verification code is invalid or expired.');
    }
    const submittedHash = crypto.createHash('sha256').update(code).digest();
    const expectedHash = Buffer.from(change.codeHash, 'hex');
    if (submittedHash.length !== expectedHash.length || !crypto.timingSafeEqual(submittedHash, expectedHash)) {
        throw new BadRequestError('Email verification code is invalid or expired.');
    }
    const duplicate = await Rider.findOne({ email: change.email, _id: { $ne: riderId } });
    if (duplicate) throw new ConflictError('An account with this email already exists.');

    rider.email = change.email;
    rider.emailChange = { email: null, codeHash: null, expiresAt: null };
    rider.tokenVersion = (rider.tokenVersion || 0) + 1;
    await rider.save();
    return safeProfile(rider);
};
