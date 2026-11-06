import { RiderNotification } from '../../models/RiderNotification.js';
import { Rider } from '../../models/Rider.js';
import { getIO } from '../../socket/socket.server.js';
import { sendRiderPushNotification } from './rider-push.service.js';

export const createRiderNotification = async ({
    recipientType,
    rider,
    order = null,
    event,
    message,
    dedupeKey,
    expiresAt = null,
}) => {
    const riderId = rider?._id || rider;
    if (!riderId) throw new Error('Rider notifications require a rider ID.');
    const riderDetails = typeof rider === 'object' && rider.name
        ? rider
        : await Rider.findById(riderId).select('name').lean();
    if (!riderDetails) throw new Error('Cannot create a notification for a missing rider.');

    let notification;
    let created = true;
    try {
        notification = await RiderNotification.create({
            recipientType,
            rider: riderId,
            riderName: riderDetails.name,
            order,
            expiresAt,
            event,
            message,
            dedupeKey,
        });
    } catch (error) {
        if (error.code !== 11000 || !dedupeKey) throw error;
        notification = await RiderNotification.findOne({ dedupeKey });
        if (!notification) throw error;
        created = false;
    }

    if (!created) return notification;

    const payload = {
        _id: notification._id,
        riderId: riderId.toString(),
        riderName: riderDetails.name,
        orderId: order?.toString?.() || null,
        eventType: event,
        event,
        message,
        timestamp: notification.createdAt,
        createdAt: notification.createdAt,
        expiresAt: notification.expiresAt,
        readAt: notification.readAt,
        unread: true,
    };
    const io = getIO();
    if (io) {
        if (recipientType === 'rider') {
            io.to(`rider:${riderId}`).emit('rider:notification', payload);
        } else {
            io.to('admin:orders').emit('rider:notification', payload);
        }
    }
    if (recipientType === 'rider') {
        sendRiderPushNotification({
            riderId,
            title: 'Majedaar Rider',
            body: message,
            url: order ? `/rider/dashboard?order=${order}` : '/rider/dashboard',
            data: {
                event,
                orderId: order?.toString?.() || null,
                notificationId: notification._id.toString(),
                expiresAt: notification.expiresAt,
            },
        }).catch((error) => console.error('[RiderNotification] Unable to send browser push:', error.message));
    }
    return notification;
};
