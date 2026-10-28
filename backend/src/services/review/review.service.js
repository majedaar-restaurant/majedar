import mongoose from 'mongoose';
import { Review } from '../../models/Review.js';
import { Order } from '../../models/Order.js';
import { MenuItem } from '../../models/MenuItem.js';
import { Customer } from '../../models/Customer.js';
import {
    BadRequestError,
    NotFoundError,
    ForbiddenError,
} from '../../utils/errors.js';
import { getDateRangeFilter } from '../../utils/date-filter.js';

/**
 * Create a new customer review for a menu item (either linked to a completed order or direct product review).
 */
export const createReview = async (customerId, { orderId, menuItemId, rating, comment = '', allowUpdate = false }) => {
    if (orderId) {
        // 1. Fetch order
        const order = await Order.findById(orderId);
        if (!order) {
            throw new NotFoundError('Order not found');
        }

        // 2. Verify order belongs to customer
        if (order.customer.toString() !== customerId.toString()) {
            throw new ForbiddenError('You can only review items from your own orders');
        }

        // 3. Verify order completed
        if (order.orderStatus !== 'completed') {
            throw new BadRequestError('You can only review items after your order is completed');
        }

        // 4. Verify menu item exists in database
        const menuItem = await MenuItem.findById(menuItemId);
        if (!menuItem) {
            throw new NotFoundError('Menu item not found');
        }

        // 5. Verify menu item is present in order
        const hasItem = order.items && order.items.some(
            (item) => item.menuItem && item.menuItem.toString() === menuItemId.toString()
        );
        if (!hasItem) {
            throw new BadRequestError('This menu item is not part of the specified order');
        }

        // 6. Check duplicate / update
        const existingReview = await Review.findOne({
            customer: customerId,
            order: orderId,
            menuItem: menuItemId,
        });
        if (existingReview) {
            if (allowUpdate) {
                existingReview.rating = Number(rating);
                if (comment !== undefined) {
                    existingReview.comment = comment ? comment.trim() : '';
                }
                await existingReview.save();
                if (existingReview.populate) {
                    await existingReview.populate([
                        { path: 'customer', select: 'firstName lastName name avatar' },
                        { path: 'menuItem', select: 'name price image' },
                    ]);
                }
                return existingReview;
            }
            throw new BadRequestError('You have already reviewed this menu item for this order');
        }

        const review = new Review({
            customer: customerId,
            menuItem: menuItemId,
            order: orderId,
            rating: Number(rating),
            comment: comment ? comment.trim() : '',
        });

        try {
            await review.save();
        } catch (err) {
            if (err.code === 11000) {
                throw new BadRequestError('You have already reviewed this menu item for this order');
            }
            throw err;
        }

        if (review.populate) {
            await review.populate([
                { path: 'customer', select: 'firstName lastName name avatar' },
                { path: 'menuItem', select: 'name price image' },
            ]);
        }
        return review;
    }

    // Direct item review on product page without orderId
    const menuItem = await MenuItem.findById(menuItemId);
    if (!menuItem) {
        throw new NotFoundError('Menu item not found');
    }

    const existingReview = await Review.findOne({
        customer: customerId,
        menuItem: menuItemId,
    });

    let review;
    if (existingReview) {
        existingReview.rating = Number(rating);
        if (comment !== undefined) {
            existingReview.comment = comment.trim();
        }
        review = existingReview;
    } else {
        review = new Review({
            customer: customerId,
            menuItem: menuItemId,
            rating: Number(rating),
            comment: comment ? comment.trim() : '',
        });
    }

    try {
        await review.save();
    } catch (err) {
        if (err.code === 11000) {
            throw new BadRequestError('You have already reviewed this menu item');
        }
        throw err;
    }

    if (review.populate) {
        await review.populate([
            { path: 'customer', select: 'firstName lastName name avatar' },
            { path: 'menuItem', select: 'name price image' },
        ]);
    }

    return review;
};

/**
 * Get reviews for a specific menu item with public-safe customer info.
 */
export const getMenuItemReviews = async (menuItemId, { page = 1, limit = 20 } = {}) => {
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    const filter = { menuItem: menuItemId };

    const [reviews, totalReviews, ratingSummary] = await Promise.all([
        Review.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNum)
            .populate('customer', 'firstName lastName name avatar')
            .lean(),
        Review.countDocuments(filter),
        getMenuItemRatingSummary(menuItemId),
    ]);

    return {
        reviews,
        ratingSummary,
        pagination: {
            page: pageNum,
            limit: limitNum,
            totalReviews,
            totalPages: Math.ceil(totalReviews / limitNum),
        },
    };
};

/**
 * Calculate rating summary (averageRating and reviewCount) for a menu item.
 */
export const getMenuItemRatingSummary = async (menuItemId) => {
    const objectId = mongoose.Types.ObjectId.isValid(menuItemId)
        ? new mongoose.Types.ObjectId(menuItemId)
        : menuItemId;

    const stats = await Review.aggregate([
        { $match: { menuItem: objectId } },
        {
            $group: {
                _id: '$menuItem',
                averageRating: { $avg: '$rating' },
                reviewCount: { $sum: 1 },
            },
        },
    ]);

    if (!stats || stats.length === 0) {
        return {
            averageRating: 0,
            reviewCount: 0,
        };
    }

    return {
        averageRating: Math.round(stats[0].averageRating * 10) / 10,
        reviewCount: stats[0].reviewCount,
    };
};

/**
 * Admin: View reviews across the platform.
 */
export const getAdminReviews = async ({ page = 1, limit = 20, rating, search, datePreset, dateFrom, dateTo } = {}) => {
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    const filter = {};
    if (rating !== undefined) {
        filter.rating = Number(rating);
    }

    // Apply server-side date filter (Today, This Week, or Custom Range in IST)
    const dateFilter = getDateRangeFilter({
        datePreset,
        dateFrom,
        dateTo,
        fieldName: 'createdAt',
    });
    Object.assign(filter, dateFilter);

    // Apply search on Customer and Menu Item
    if (search && search.trim()) {
        const s = search.trim();
        const escaped = s.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
        const regex = new RegExp(escaped, 'i');

        let customerIds = [];
        let menuItemIds = [];
        try {
            const [matchingCusts, matchingItems] = await Promise.all([
                Customer.find({
                    $or: [
                        { name: regex },
                        { email: regex },
                        { phone: regex },
                        { firstName: regex },
                        { lastName: regex },
                    ],
                }).select('_id').lean(),
                MenuItem.find({ name: regex }).select('_id').lean(),
            ]);
            customerIds = (matchingCusts || []).map((c) => c._id);
            menuItemIds = (matchingItems || []).map((m) => m._id);
        } catch (_) {}

        filter.$and = filter.$and || [];
        filter.$and.push({
            $or: [
                ...(customerIds.length > 0 ? [{ customer: { $in: customerIds } }] : []),
                ...(menuItemIds.length > 0 ? [{ menuItem: { $in: menuItemIds } }] : []),
            ],
        });
    }

    const [reviews, totalReviews] = await Promise.all([
        Review.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNum)
            .populate('customer', 'firstName lastName name email phone')
            .populate('menuItem', 'name price')
            .populate('order', 'orderNumber orderStatus')
            .lean(),
        Review.countDocuments(filter),
    ]);

    return {
        reviews,
        total: totalReviews,
        page: pageNum,
        limit: limitNum,
        pagination: {
            page: pageNum,
            limit: limitNum,
            totalReviews,
            totalPages: Math.ceil(totalReviews / limitNum),
        },
    };
};

/**
 * Admin: Delete an inappropriate review.
 */
export const deleteReviewByAdmin = async (reviewId) => {
    const review = await Review.findByIdAndDelete(reviewId);
    if (!review) {
        throw new NotFoundError('Review not found');
    }
    return { id: review._id, message: 'Review deleted successfully' };
};

/**
 * Customer: Get all reviews submitted for a specific order.
 */
export const getOrderReviews = async (customerId, orderId) => {
    return Review.find({ customer: customerId, order: orderId })
        .populate('menuItem', 'name price image')
        .sort({ createdAt: -1 })
        .lean();
};
