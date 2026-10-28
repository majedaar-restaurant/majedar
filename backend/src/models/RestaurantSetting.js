import mongoose from 'mongoose';

const restaurantSettingSchema = new mongoose.Schema(
    {
        // Shop Availability
        isManuallyClosed: {
            type: Boolean,
            default: false,
        },
        manualClosedAt: {
            type: Date,
            default: null,
        },
        // Timings in 24h format HH:mm (e.g. "10:00" and "22:30")
        openingTime: {
            type: String,
            default: '10:00',
            trim: true,
        },
        closingTime: {
            type: String,
            default: '22:30',
            trim: true,
        },
        timezone: {
            type: String,
            default: 'Asia/Kolkata',
            trim: true,
        },
        // Over Order Feature
        overOrder: {
            isActive: {
                type: Boolean,
                default: false,
            },
            activatedAt: {
                type: Date,
                default: null,
            },
            expiresAt: {
                type: Date,
                default: null,
            },
            durationMinutes: {
                type: Number,
                default: 30,
            },
        },
        // Minimum Order Amount
        minimumOrderAmount: {
            type: Number,
            default: 100,
            min: 0,
        },
    },
    {
        timestamps: true,
    }
);

export const RestaurantSetting = mongoose.model('RestaurantSetting', restaurantSettingSchema);
