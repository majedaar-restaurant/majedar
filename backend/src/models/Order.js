import mongoose from 'mongoose';

const orderItemSnapshotSchema = new mongoose.Schema(
    {
        menuItem: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'MenuItem',
            required: [true, 'Menu item reference is required'],
        },
        name: {
            type: String,
            required: [true, 'Item name snapshot is required'],
            trim: true,
        },
        variant: {
            type: String,
            enum: ['single', 'half', 'full'],
            default: 'single',
            required: [true, 'Selected variant snapshot is required'],
        },
        unitPrice: {
            type: Number,
            required: [true, 'Item unit price snapshot is required'],
            min: [0, 'Unit price cannot be negative'],
        },
        price: {
            type: Number,
            required: [true, 'Item price snapshot is required'],
            min: [0, 'Price cannot be negative'],
        },
        quantity: {
            type: Number,
            required: [true, 'Quantity is required'],
            min: [1, 'Quantity must be at least 1'],
        },
        image: {
            type: String,
            default: null,
        },
        subtotal: {
            type: Number,
            required: [true, 'Item subtotal is required'],
            min: [0, 'Subtotal cannot be negative'],
        },
        originalUnitPrice: {
            type: Number,
            default: null,
        },
        discountAmount: {
            type: Number,
            default: 0,
            min: [0, 'Discount amount cannot be negative'],
        },
        discountedUnitPrice: {
            type: Number,
            default: null,
        },
        discountedSubtotal: {
            type: Number,
            default: null,
        },
    },
    { _id: false }
);

const locationSchema = new mongoose.Schema(
    {
        latitude: {
            type: Number,
            min: [-90, 'Latitude must be between -90 and 90'],
            max: [90, 'Latitude must be between -90 and 90'],
            default: null,
        },
        longitude: {
            type: Number,
            min: [-180, 'Longitude must be between -180 and 180'],
            max: [180, 'Longitude must be between -180 and 180'],
            default: null,
        },
        placeId: {
            type: String,
            trim: true,
            default: null,
        },
        formattedAddress: {
            type: String,
            trim: true,
            default: null,
        },
        source: {
            type: String,
            enum: ['google_places', 'current_location', 'manual'],
            default: 'manual',
        },
        distanceMeters: {
            type: Number,
            default: null,
        },
        distanceKm: {
            type: Number,
            default: null,
        },
        formattedDistance: {
            type: String,
            trim: true,
            default: null,
        },
    },
    { _id: false }
);

const deliveryAddressSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: [true, 'First name is required'],
            trim: true,
        },
        area: {
            type: String,
            trim: true,
            default: null,
        },
        deliveryZoneId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'DeliveryZone',
            default: null,
        },
        lastName: {
            type: String,
            required: [true, 'Last name is required'],
            trim: true,
        },
        phone: {
            type: String,
            required: [true, 'Phone number is required'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Email address is required'],
            lowercase: true,
            trim: true,
        },
        address: {
            type: String,
            required: [true, 'Delivery street address is required'],
            trim: true,
        },
        landmark: {
            type: String,
            trim: true,
            default: null,
        },
        deliveryInstructions: {
            type: String,
            enum: ['Call on arrival', 'Leave at the gate', "Don't ring the bell", 'Other'],
            default: null,
        },
        deliveryInstructionOther: {
            type: String,
            trim: true,
            default: null,
        },
        location: {
            type: locationSchema,
            default: null,
        },
    },
    { _id: false }
);

const riderAssignmentHistorySchema = new mongoose.Schema(
    {
        rider: { type: mongoose.Schema.Types.ObjectId, ref: 'Rider', required: true },
        assignedBy: { type: String, enum: ['admin', 'rider'], required: true },
        assignedById: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', default: null },
        assignedAt: { type: Date, required: true, default: Date.now },
        responseDeadline: { type: Date, default: null },
        acceptedAt: { type: Date, default: null },
        rejectedAt: { type: Date, default: null },
        timedOutAt: { type: Date, default: null },
        rejectionReason: { type: String, trim: true, default: null },
        unassignedAt: { type: Date, default: null },
    },
    { _id: false }
);

const riderDeliveryHistorySchema = new mongoose.Schema(
    {
        rider: { type: mongoose.Schema.Types.ObjectId, ref: 'Rider', required: true },
        status: {
            type: String,
            enum: ['accepted', 'rejected', 'picked_up', 'out_for_delivery', 'delivered', 'failed'],
            required: true,
        },
        reason: { type: String, trim: true, default: null },
        remarks: { type: String, trim: true, default: null },
        timestamp: { type: Date, required: true, default: Date.now },
    },
    { _id: false }
);

const codCollectionSchema = new mongoose.Schema(
    {
        amount: { type: Number, required: true, min: 0 },
        method: { type: String, enum: ['cash', 'upi'], required: true },
        rider: { type: mongoose.Schema.Types.ObjectId, ref: 'Rider', required: true },
        collectedAt: { type: Date, required: true, default: Date.now },
        verifiedAt: { type: Date, default: null },
        verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', default: null },
    },
    { _id: false }
);

const deliveryRecoveryHistorySchema = new mongoose.Schema(
    {
        action: {
            type: String,
            enum: ['contact_rider', 'contact_customer', 'reassign_rider', 'mark_delivered', 'cancel_order'],
            required: true,
        },
        actor: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
        note: { type: String, trim: true, required: true },
        rider: { type: mongoose.Schema.Types.ObjectId, ref: 'Rider', default: null },
        previousRiderStatus: { type: String, default: null },
        previousOrderStatus: { type: String, default: null },
        timestamp: { type: Date, required: true, default: Date.now },
    },
    { _id: false }
);

const statusHistorySchema = new mongoose.Schema(
    {
        domain: { type: String, enum: ['order', 'rider', 'recovery', 'assignment'], required: true },
        status: { type: String, required: true, trim: true },
        previousStatus: { type: String, trim: true, default: null },
        actorType: { type: String, enum: ['admin', 'rider', 'customer', 'system'], required: true },
        actor: { type: mongoose.Schema.Types.ObjectId, default: null },
        note: { type: String, trim: true, default: null },
        timestamp: { type: Date, required: true, default: Date.now },
    },
    { _id: false }
);

const orderSchema = new mongoose.Schema(
    {
        orderNumber: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Customer',
            required: [true, 'Customer reference is required'],
            index: true,
        },
        items: {
            type: [orderItemSnapshotSchema],
            required: [true, 'Order must contain at least one item'],
            validate: {
                validator: (items) => Array.isArray(items) && items.length > 0,
                message: 'Order items array cannot be empty',
            },
        },
        deliveryAddress: {
            type: deliveryAddressSchema,
            required: [true, 'Delivery address is required'],
        },
        orderType: {
            type: String,
            enum: ['delivery', 'pickup', 'dine_in'],
            default: 'delivery',
            index: true,
        },
        subtotal: {
            type: Number,
            required: [true, 'Subtotal is required'],
            min: [0, 'Subtotal cannot be negative'],
        },
        discount: {
            discountId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Discount',
                default: null,
            },
            name: {
                type: String,
                default: null,
            },
            code: {
                type: String,
                default: null,
            },
            method: {
                type: String,
                enum: ['automatic', 'coupon', null],
                default: null,
            },
            discountType: {
                type: String,
                enum: ['percentage', 'flat', null],
                default: null,
            },
            discountValue: {
                type: Number,
                default: 0,
            },
            amount: {
                type: Number,
                default: 0,
                min: 0,
            },
            eligibleSubtotal: {
                type: Number,
                default: 0,
                min: 0,
            },
        },
        totalSavings: {
            type: Number,
            default: 0,
            min: 0,
        },
        gst: {
            type: Number,
            min: [0, 'GST cannot be negative'],
            default: 0,
        },
        deliveryFee: {
            type: Number,
            required: [true, 'Delivery fee is required'],
            min: [0, 'Delivery fee cannot be negative'],
            default: 0,
        },
        total: {
            type: Number,
            required: [true, 'Total amount is required'],
            min: [0, 'Total cannot be negative'],
        },
        paymentMethod: {
            type: String,
            enum: ['cod', 'razorpay'],
            default: 'cod',
            index: true,
        },
        paymentStatus: {
            type: String,
            enum: ['pending', 'paid', 'failed', 'refunded'],
            default: 'pending',
            index: true,
        },
        paymentPaidAt: { type: Date, default: null, index: true },
        orderStatus: {
            type: String,
            enum: [
                'placed',
                'confirmed',
                'preparing',
                'ready_for_pickup',
                'out_for_delivery',
                'completed',
                'cancelled',
                'expired',
            ],
            default: 'placed',
            index: true,
        },
        rider: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Rider',
            default: null,
            index: true,
        },
        riderStatus: {
            type: String,
            enum: ['pending', 'accepted', 'picked_up', 'out_for_delivery', 'delivered', 'failed', 'rejected'],
            default: 'pending',
            index: true,
        },
        riderAssignmentHistory: {
            type: [riderAssignmentHistorySchema],
            default: [],
        },
        riderDeliveryHistory: {
            type: [riderDeliveryHistorySchema],
            default: [],
        },
        codCollections: {
            type: [codCollectionSchema],
            default: [],
        },
        riderLocation: {
            latitude: { type: Number, min: -90, max: 90, default: null },
            longitude: { type: Number, min: -180, max: 180, default: null },
            updatedAt: { type: Date, default: null },
        },
        deliveryStartedAt: { type: Date, default: null, index: true },
        riderHandoffRequired: { type: Boolean, default: false },
        deliveryRecoveryHistory: {
            type: [deliveryRecoveryHistorySchema],
            default: [],
        },
        statusHistory: {
            type: [statusHistorySchema],
            default: [],
        },
        routeEta: {
            durationSeconds: { type: Number, min: 0, default: null },
            calculatedAt: { type: Date, default: null },
        },
        acceptedAt: {
            type: Date,
            default: null,
        },
        confirmedAt: {
            type: Date,
            default: null,
        },
        acceptanceDeadline: {
            type: Date,
            default: null,
            index: true,
        },
        expiredAt: {
            type: Date,
            default: null,
        },
        expiryReason: {
            type: String,
            default: null,
        },
        pushNotificationSent: {
            type: Boolean,
            default: false,
            index: true,
        },
    },
    {
        timestamps: true,
        toJSON: {
            transform: (doc, ret) => {
                delete ret.__v;
                return ret;
            },
        },
        toObject: {
            transform: (doc, ret) => {
                delete ret.__v;
                return ret;
            },
        },
    }
);

// Indexes for fast lookup
orderSchema.index({ customer: 1, createdAt: -1 });
orderSchema.index({ orderStatus: 1, createdAt: -1 });
orderSchema.index({ orderStatus: 1, acceptanceDeadline: 1 });

export const Order = mongoose.model('Order', orderSchema);