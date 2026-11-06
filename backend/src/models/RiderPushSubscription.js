import mongoose from 'mongoose';

const riderPushSubscriptionSchema = new mongoose.Schema(
    {
        rider: { type: mongoose.Schema.Types.ObjectId, ref: 'Rider', required: true, index: true },
        endpoint: { type: String, required: true, unique: true, trim: true },
        p256dh: { type: String, required: true, trim: true },
        auth: { type: String, required: true, trim: true },
        userAgent: { type: String, default: null, trim: true },
    },
    { timestamps: true }
);

export const RiderPushSubscription = mongoose.model('RiderPushSubscription', riderPushSubscriptionSchema);
