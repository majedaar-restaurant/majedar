import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            trim: true,
            maxlength: [150, 'Title cannot exceed 150 characters'],
            default: null,
        },
        description: {
            type: String,
            trim: true,
            maxlength: [300, 'Description cannot exceed 300 characters'],
            default: null,
        },
        image: {
            url: {
                type: String,
                required: [true, 'Banner image URL is required'],
            },
            publicId: {
                type: String,
                required: [true, 'Banner image public ID is required'],
            },
        },
        isActive: {
            type: Boolean,
            default: true,
            index: true,
        },
        priority: {
            type: Number,
            default: 0,
            index: true,
        },
        discount: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Discount',
            default: null,
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            default: null,
        },
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'MenuItem',
            default: null,
        },
        menuSection: {
            type: String,
            trim: true,
            default: 'all', // 'all', 'menu', 'bestsellers', etc.
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

bannerSchema.index({ isActive: 1, priority: -1, createdAt: -1 });

export const Banner = mongoose.model('Banner', bannerSchema);

