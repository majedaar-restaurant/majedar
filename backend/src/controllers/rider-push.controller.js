import { BadRequestError } from '../utils/errors.js';
import { sendSuccess } from '../utils/response.js';
import {
    deleteRiderPushSubscription,
    getRiderVapidPublicKey,
    saveRiderPushSubscription,
} from '../services/rider/rider-push.service.js';

const parseSubscription = (body) => {
    const endpoint = body?.endpoint;
    const keys = body?.keys;
    try {
        if (new URL(endpoint).protocol !== 'https:') {
            throw new Error('Push endpoints must use HTTPS.');
        }
    } catch {
        throw new BadRequestError('A valid HTTPS push endpoint URL is required.');
    }
    if (!keys?.p256dh || !keys?.auth) {
        throw new BadRequestError('Push encryption keys are required.');
    }
    return { endpoint, keys };
};

const parseEndpoint = (value) => {
    try {
        const endpoint = new URL(value);
        if (endpoint.protocol !== 'https:') throw new Error('Push endpoints must use HTTPS.');
        return endpoint.toString();
    } catch {
        throw new BadRequestError('A valid HTTPS push endpoint URL is required.');
    }
};

export const getRiderPushPublicKey = (req, res) => sendSuccess(res, {
    data: { publicKey: getRiderVapidPublicKey() },
});

export const subscribeRiderPush = async (req, res, next) => {
    try {
        const subscription = parseSubscription(req.body);
        await saveRiderPushSubscription({
            riderId: req.rider._id,
            subscription,
            userAgent: req.headers['user-agent'] || null,
        });
        return sendSuccess(res, { message: 'Browser push notifications enabled.' });
    } catch (error) {
        next(error);
    }
};

export const unsubscribeRiderPush = async (req, res, next) => {
    try {
        const endpoint = parseEndpoint(req.body?.endpoint);
        await deleteRiderPushSubscription({ riderId: req.rider._id, endpoint });
        return sendSuccess(res, { message: 'Browser push notifications disabled.' });
    } catch (error) {
        next(error);
    }
};
