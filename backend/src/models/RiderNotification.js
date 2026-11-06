import mongoose from 'mongoose';

const riderNotificationSchema = new mongoose.Schema(
    {
        recipientType: { type: String, enum: ['rider', 'admin'], required: true, index: true },
        rider: { type: mongoose.Schema.Types.ObjectId, ref: 'Rider', default: null, index: true },
        riderName: { type: String, trim: true, default: null },
        order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', default: null, index: true },
        expiresAt: { type: Date, default: null },
        event: { type: String, required: true, trim: true },
        message: { type: String, required: true, trim: true },
        dedupeKey: { type: String, default: undefined },
        readAt: { type: Date, default: null, index: true },
    },
    { timestamps: true }
);

riderNotificationSchema.index({ recipientType: 1, rider: 1, createdAt: -1 });
riderNotificationSchema.index(
    { dedupeKey: 1 },
    { unique: true, partialFilterExpression: { dedupeKey: { $type: 'string' } } }
);

export const RiderNotification = mongoose.model('RiderNotification', riderNotificationSchema);
