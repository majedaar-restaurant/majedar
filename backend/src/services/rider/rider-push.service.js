import webpush from 'web-push';
import { RiderPushSubscription } from '../../models/RiderPushSubscription.js';
import { config } from '../../config/env.js';

let vapidConfigured = false;

const configureVapid = () => {
    if (vapidConfigured) return true;
    if (!config.vapid?.publicKey || !config.vapid?.privateKey) return false;
    webpush.setVapidDetails(config.vapid.subject, config.vapid.publicKey, config.vapid.privateKey);
    vapidConfigured = true;
    return true;
};

export const getRiderVapidPublicKey = () => {
    try {
        return configureVapid() ? config.vapid.publicKey : '';
    } catch (error) {
        console.error('[RiderPush] VAPID configuration is invalid:', error.message);
        return '';
    }
};

export const saveRiderPushSubscription = async ({ riderId, subscription, userAgent }) => {
    const { endpoint, keys } = subscription || {};
    if (!endpoint || !keys?.p256dh || !keys?.auth) {
        throw new Error('Invalid rider push subscription: endpoint and encryption keys are required.');
    }
    return RiderPushSubscription.findOneAndUpdate(
        { endpoint },
        {
            rider: riderId,
            endpoint,
            p256dh: keys.p256dh,
            auth: keys.auth,
            userAgent: userAgent || null,
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
    );
};

export const deleteRiderPushSubscription = async ({ riderId, endpoint }) => {
    const result = await RiderPushSubscription.deleteOne({ rider: riderId, endpoint });
    return result.deletedCount > 0;
};

export const sendRiderPushNotification = async ({ riderId, title, body, url = '/rider/dashboard', data = {} }) => {
    if (!configureVapid()) {
        console.warn('[RiderPush] VAPID keys are not configured; browser push was not sent.');
        return { sent: 0, failed: 0, purged: 0 };
    }
    const subscriptions = await RiderPushSubscription.find({ rider: riderId });
    const payload = JSON.stringify({
        title: title || 'Majedaar Rider',
        body: body || '',
        icon: '/brand/logo-full.png',
        badge: '/brand/logo-mark.svg',
        data: { url, ...data },
    });
    const results = await Promise.allSettled(subscriptions.map(async (subscription) => {
        try {
            await webpush.sendNotification({
                endpoint: subscription.endpoint,
                keys: { p256dh: subscription.p256dh, auth: subscription.auth },
            }, payload, { TTL: 86400, urgency: 'high' });
            return { sent: true };
        } catch (error) {
            console.error('[RiderPush] Delivery failed:', error.statusCode || 'unknown status', error.message);
            if (error.statusCode === 404 || error.statusCode === 410) {
                await RiderPushSubscription.deleteOne({ _id: subscription._id });
                return { sent: false, purged: true };
            }
            return { sent: false, purged: false };
        }
    }));
    return results.reduce((summary, result) => {
        if (result.status === 'fulfilled' && result.value.sent) summary.sent += 1;
        else {
            summary.failed += 1;
            if (result.status === 'fulfilled' && result.value.purged) summary.purged += 1;
        }
        return summary;
    }, { sent: 0, failed: 0, purged: 0 });
};
