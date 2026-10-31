import mongoose from 'mongoose';

const discountSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Discount name is required'],
            trim: true,
            minlength: [2, 'Name must be at least 2 characters long'],
            maxlength: [120, 'Name cannot exceed 120 characters'],
            index: true,
        },
        description: {
            type: String,
            trim: true,
            maxlength: [500, 'Description cannot exceed 500 characters'],
            default: null,
        },
        discountType: {
            type: String,
            enum: ['percentage', 'flat'],
            required: [true, 'Discount type is required (percentage or flat)'],
        },
        discountValue: {
            type: Number,
            required: [true, 'Discount value is required'],
            min: [0.01, 'Discount value must be greater than zero'],
        },
        method: {
            type: String,
            enum: ['automatic', 'coupon'],
            required: [true, 'Application method is required (automatic or coupon)'],
            index: true,
        },
        couponCode: {
            type: String,
            trim: true,
            uppercase: true,
            default: null,
            sparse: true,
            index: true,
        },
        applicability: {
            type: String,
            enum: ['entire_menu', 'categories', 'products'],
            required: [true, 'Applicability is required (entire_menu, categories, or products)'],
            index: true,
        },
        categoryIds: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Category',
            },
        ],
        productIds: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'MenuItem',
            },
        ],
        minOrderAmount: {
            type: Number,
            min: [0, 'Minimum order amount cannot be negative'],
            default: 0,
        },
        maxDiscountLimit: {
            type: Number,
            min: [0.01, 'Maximum discount limit must be greater than zero'],
            default: null,
        },
        startDate: {
            type: Date,
            default: null,
        },
        expiryDate: {
            type: Date,
            default: null,
            index: true,
        },
        totalUsageLimit: {
            type: Number,
            min: [1, 'Total usage limit must be at least 1'],
            default: null,
        },
        usageCount: {
            type: Number,
            min: [0, 'Usage count cannot be negative'],
            default: 0,
        },
        perCustomerUsageLimit: {
            type: Number,
            min: [1, 'Per customer usage limit must be at least 1'],
            default: null,
        },
        customerUsage: [
            {
                customer: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Customer',
                    required: true,
                },
                count: {
                    type: Number,
                    default: 0,
                    min: 0,
                },
            },
        ],
        isActive: {
            type: Boolean,
            default: true,
            index: true,
        },
        totalDiscountGiven: {
            type: Number,
            default: 0,
            min: 0,
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

discountSchema.index({ method: 1, isActive: 1 });
discountSchema.index({ applicability: 1, isActive: 1 });

export const Discount = mongoose.model('Discount', discountSchema);

