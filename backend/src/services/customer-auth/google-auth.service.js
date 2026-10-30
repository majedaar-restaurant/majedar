import { OAuth2Client } from 'google-auth-library';
import { Customer } from '../../models/Customer.js';
import { config } from '../../config/env.js';
import { signToken, verifyToken } from '../../utils/token.js';
import {
    UnauthorizedError,
    BadRequestError,
    ConflictError,
    NotFoundError,
} from '../../utils/errors.js';

const client = new OAuth2Client(config.google.clientId);

/**
 * Verify a Google ID token and return its payload.
 * Validates audience, issuer, expiry, and email verification.
 *
 * @param {string} idToken
 * @returns {Promise<{sub: string, email: string, name?: string, picture?: string}>}
 */
export async function verifyGoogleToken(idToken) {
    if (!config.google.clientId) {
        throw new BadRequestError('Google authentication is not configured on the server.');
    }

    if (!idToken || typeof idToken !== 'string' || idToken.trim().length === 0) {
        throw new BadRequestError('Google ID token is required.');
    }

    let ticket;
    try {
        ticket = await client.verifyIdToken({
            idToken: idToken.trim(),
            audience: config.google.clientId,
        });
    } catch {
        throw new UnauthorizedError('Invalid or expired Google token. Please try again.');
    }

    const payload = ticket.getPayload();

    // Validate issuer
    if (!['accounts.google.com', 'https://accounts.google.com'].includes(payload.iss)) {
        throw new UnauthorizedError('Invalid Google token issuer.');
    }

    // Require verified email from Google
    if (!payload.email_verified) {
        throw new UnauthorizedError(
            'Google account email is not verified. Please verify your Google account first.'
        );
    }

    if (!payload.email) {
        throw new UnauthorizedError('No email address associated with this Google account.');
    }

    return payload;
}

/**
 * Generate a short-lived signed token preserving verified Google identity for signup.
 * Valid for 15 minutes.
 */
export const generateSignupToken = (googlePayload) => {
    return signToken(
        {
            googleId: googlePayload.sub,
            email: googlePayload.email.trim().toLowerCase(),
            name: googlePayload.name || '',
            picture: googlePayload.picture || null,
            type: 'google_signup',
        },
        '15m'
    );
};

/**
 * Verify a short-lived signup token.
 */
export const verifySignupToken = (signupToken) => {
    try {
        const decoded = verifyToken(signupToken);
        if (!decoded || decoded.type !== 'google_signup' || !decoded.email || !decoded.googleId) {
            throw new UnauthorizedError('Invalid signup token.');
        }
        return decoded;
    } catch {
        throw new UnauthorizedError('Signup session expired or invalid. Please try signing up again.');
    }
};

/**
 * GOOGLE LOGIN INTENT:
 * Authenticate an EXISTING customer using Google identity.
 *
 * Requirements:
 * - If customer exists: authenticates, updates Google ID/picture if needed, returns customer.
 * - If customer does NOT exist: DO NOT CREATE ACCOUNT. Return notRegistered status with signupToken.
 *
 * @param {string} idToken - Google ID token
 * @returns {Promise<{customer?: Object, needsPhone?: boolean, notRegistered?: boolean, signupToken?: string, email?: string, name?: string}>}
 */
export const googleLoginService = async (idToken) => {
    const payload = await verifyGoogleToken(idToken);

    const {
        sub: googleId,
        email,
        name,
        picture: profilePicture,
    } = payload;

    const normalizedEmail = email.trim().toLowerCase();
    const displayName = (name || normalizedEmail.split('@')[0]).trim().substring(0, 100);

    // 1. Check for existing customer by googleId
    let customer = await Customer.findOne({ googleId });
    if (customer) {
        if (profilePicture && customer.profilePicture !== profilePicture) {
            customer.profilePicture = profilePicture;
            await customer.save();
        }
        return {
            customer: customer.toJSON(),
            needsPhone: !customer.phone || customer.phone.trim().length < 7,
        };
    }

    // 2. Check for existing customer by email (linking email/password account)
    customer = await Customer.findOne({ email: normalizedEmail });
    if (customer) {
        customer.googleId = googleId;
        if (profilePicture && !customer.profilePicture) {
            customer.profilePicture = profilePicture;
        }
        customer.emailVerified = true;
        await customer.save();

        return {
            customer: customer.toJSON(),
            needsPhone: !customer.phone || customer.phone.trim().length < 7,
        };
    }

    // 3. Customer DOES NOT exist — DO NOT CREATE ACCOUNT.
    // Issue a short-lived signed token holding verified Google details for signup.
    const signupToken = generateSignupToken({
        sub: googleId,
        email: normalizedEmail,
        name: displayName,
        picture: profilePicture,
    });

    return {
        notRegistered: true,
        signupToken,
        email: normalizedEmail,
        name: displayName,
    };
};

/**
 * GOOGLE SIGNUP INTENT:
 * Explicitly create a new customer account using verified Google identity.
 *
 * Requirements:
 * - If account already exists: REJECT with ConflictError (must not create duplicate or silent login).
 * - If account is new: CREATE new Customer with emailVerified = true, phone = null.
 *
 * @param {Object} params
 * @param {string} [params.idToken] - Fresh Google ID token
 * @param {string} [params.signupToken] - Short-lived verified signup token from prior login attempt
 * @returns {Promise<{customer: Object, isNewUser: boolean, needsPhone: boolean}>}
 */
export const googleSignupService = async ({ idToken, signupToken }) => {
    let googleId;
    let normalizedEmail;
    let displayName;
    let profilePicture;

    if (signupToken) {
        const decoded = verifySignupToken(signupToken);
        googleId = decoded.googleId;
        normalizedEmail = decoded.email;
        displayName = decoded.name;
        profilePicture = decoded.picture;
    } else if (idToken) {
        const payload = await verifyGoogleToken(idToken);
        googleId = payload.sub;
        normalizedEmail = payload.email.trim().toLowerCase();
        displayName = (payload.name || normalizedEmail.split('@')[0]).trim().substring(0, 100);
        profilePicture = payload.picture || null;
    } else {
        throw new BadRequestError('Google credential or signup token is required for registration.');
    }

    // Check if account already exists
    const existingCustomer = await Customer.findOne({
        $or: [{ googleId }, { email: normalizedEmail }],
    });

    if (existingCustomer) {
        throw new ConflictError(
            'This Google account is already registered. Please sign in instead.'
        );
    }

    // Create new customer account
    const newCustomer = new Customer({
        name: displayName || 'Customer',
        email: normalizedEmail,
        phone: null,
        passwordHash: null,
        emailVerified: true, // Google email is verified
        tokenVersion: 0,
        googleId,
        authProvider: 'google',
        profilePicture: profilePicture || null,
    });

    try {
        await newCustomer.save();
    } catch (error) {
        if (error.code === 11000) {
            throw new ConflictError(
                'This Google account is already registered. Please sign in instead.'
            );
        }
        throw error;
    }

    return {
        customer: newCustomer.toJSON(),
        isNewUser: true,
        needsPhone: true,
    };
};

/**
 * Update phone number for an authenticated customer.
 * Required after Google registration; no OTP required, validated strictly for 10-digit Indian numbers.
 *
 * @param {string} customerId
 * @param {string} phone - Indian mobile number (e.g. "9876543210" or "+919876543210")
 * @returns {Promise<{customer: Object}>}
 */
export const updateGoogleCustomerPhone = async (customerId, phone) => {
    const raw = (phone || '').toString().trim();
    // Extract digits and remove potential leading +91 or 91
    const digits = raw.replace(/[^\d]/g, '').replace(/^91(?=\d{10}$)/, '');

    if (!digits || !/^\d{10}$/.test(digits)) {
        throw new BadRequestError('Please enter a valid 10-digit Indian mobile number.');
    }

    const formattedPhone = `+91${digits}`;

    const customer = await Customer.findById(customerId);
    if (!customer) {
        throw new UnauthorizedError('Customer account not found.');
    }

    customer.phone = formattedPhone;
    await customer.save();

    return { customer: customer.toJSON() };
};

/**
 * Backward compatibility helper for /api/customer-auth/google
 */
export const authenticateWithGoogle = async (idToken, intent = 'login') => {
    if (intent === 'signup') {
        return googleSignupService({ idToken });
    }
    return googleLoginService(idToken);
};
