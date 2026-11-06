import * as authService from '../services/rider/rider-auth.service.js';
import { sendSuccess } from '../utils/response.js';
import { setRiderAuthCookie, clearRiderAuthCookie } from '../utils/cookie.js';

export const login = async (req, res, next) => {
    try {
        const session = await authService.loginRider(req.body);
        setRiderAuthCookie(res, session.token);
        return sendSuccess(res, { message: 'Signed in successfully', data: { rider: session.rider } });
    } catch (error) {
        next(error);
    }
};

export const googleLogin = async (req, res, next) => {
    try {
        const session = await authService.loginRiderWithGoogle(req.body.idToken);
        setRiderAuthCookie(res, session.token);
        return sendSuccess(res, { message: 'Signed in successfully', data: { rider: session.rider } });
    } catch (error) {
        next(error);
    }
};

export const logout = (req, res) => {
    clearRiderAuthCookie(res);
    return sendSuccess(res, { message: 'Signed out successfully' });
};

export const getMe = async (req, res, next) => {
    try {
        return sendSuccess(res, {
            data: {
                rider: {
                    _id: req.rider._id,
                    name: req.rider.name,
                    phone: req.rider.phone,
                    email: req.rider.email,
                    isActive: req.rider.isActive,
                    availability: req.rider.availability,
                    authProvider: req.rider.authProvider,
                },
            },
        });
    } catch (error) {
        next(error);
    }
};

export const updateProfile = async (req, res, next) => {
    try {
        const rider = await authService.updateRiderProfile(req.rider._id, req.body);
        return sendSuccess(res, { data: { rider } });
    } catch (error) {
        next(error);
    }
};

export const changePassword = async (req, res, next) => {
    try {
        await authService.changeRiderPassword(req.rider._id, req.body);
        clearRiderAuthCookie(res);
        return sendSuccess(res, { message: 'Password changed. Please sign in again.' });
    } catch (error) {
        next(error);
    }
};

export const requestEmailChange = async (req, res, next) => {
    try {
        await authService.requestRiderEmailChange(req.rider._id, req.body.email);
        return sendSuccess(res, { message: 'Verification code sent to the new email address.' });
    } catch (error) {
        next(error);
    }
};

export const verifyEmailChange = async (req, res, next) => {
    try {
        const rider = await authService.verifyRiderEmailChange(req.rider._id, req.body.code);
        clearRiderAuthCookie(res);
        return sendSuccess(res, { message: 'Email updated. Please sign in again.', data: { rider } });
    } catch (error) {
        next(error);
    }
};
