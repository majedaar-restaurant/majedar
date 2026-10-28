import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
    {
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Customer',
            required: [true, 'Customer is required'],
            index: true,
        },
        menuItem: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'MenuItem',
            required: [true, 'Menu item is required'],
            index: true,
        },
        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order',
            required: false,
            default: null,
        },
        rating: {
            type: Number,
            required: [true, 'Rating is required'],
            min: [1, 'Rating must be at least 1'],
            max: [5, 'Rating cannot exceed 5'],
            validate: {
                validator: Number.isInteger,
                message: 'Rating must be an integer between 1 and 5',
            },
        },
        comment: {
            type: String,
            trim: true,
            maxlength: [1000, 'Comment cannot exceed 1000 characters'],
            default: '',
        },
    },
    {
        timestamps: true,
    }
);

// Optimize query performance for menu item review lookups & aggregations
reviewSchema.index({ menuItem: 1, createdAt: -1 });
reviewSchema.index({ customer: 1, menuItem: 1 });

export const Review = mongoose.model('Review', reviewSchema);
