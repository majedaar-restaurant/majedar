import { Rider } from '../models/Rider.js';
import { UnauthorizedError } from '../utils/errors.js';
import { verifyToken } from '../utils/token.js';
import { config } from '../config/env.js';

export const authenticateRider = async (req, res, next) => {
    try {
        const token = req.cookies?.[config.riderCookie.name];
        if (!token) throw new UnauthorizedError('Rider authentication required.');
        let decoded;
        try {
            decoded = verifyToken(token);
        } catch {
            throw new UnauthorizedError('Rider session expired or invalid. Please log in again.');
        }
        if (decoded?.type !== 'rider' || !decoded.id) {
            throw new UnauthorizedError('Rider authentication required.');
        }
        const rider = await Rider.findById(decoded.id);
        if (!rider || !rider.isActive || (decoded.tokenVersion ?? 0) !== (rider.tokenVersion ?? 0)) {
            throw new UnauthorizedError('Rider account is inactive or the session has expired.');
        }
        req.rider = rider;
        next();
    } catch (error) {
        next(error);
    }
};
