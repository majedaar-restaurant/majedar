import { Router } from 'express';
import {
    login,
    googleLogin,
    logout,
    getMe,
    updateProfile,
    changePassword,
    requestEmailChange,
    verifyEmailChange,
} from '../controllers/rider-auth.controller.js';
import { authenticateRider } from '../middleware/rider-auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import { authLimiter } from '../middleware/rate-limit.middleware.js';
import {
    riderLoginSchema,
    riderGoogleLoginSchema,
    riderProfileSchema,
    riderPasswordSchema,
    riderEmailChangeSchema,
    riderEmailVerificationSchema,
} from '../validators/rider.validator.js';

const router = Router();

router.post('/login', authLimiter, validate(riderLoginSchema), login);
router.post('/google/login', authLimiter, validate(riderGoogleLoginSchema), googleLogin);
router.post('/logout', logout);
router.get('/me', authenticateRider, getMe);
router.patch('/profile', authenticateRider, validate(riderProfileSchema), updateProfile);
router.post('/password', authenticateRider, validate(riderPasswordSchema), changePassword);
router.post('/email/change', authenticateRider, validate(riderEmailChangeSchema), requestEmailChange);
router.post('/email/verify', authLimiter, authenticateRider, validate(riderEmailVerificationSchema), verifyEmailChange);

export default router;
