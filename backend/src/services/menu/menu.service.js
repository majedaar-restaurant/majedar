import { MenuItem } from '../../models/MenuItem.js';
import { Category, slugify } from '../../models/Category.js';
import { Review } from '../../models/Review.js';
import { NotFoundError, BadRequestError } from '../../utils/errors.js';
import { uploadImageBuffer, deleteCloudinaryImage } from '../uploads/image.service.js';
import mongoose from 'mongoose';

/**
 * Resolve a category input (ID, slug, or name) to a Category document.
 */
const resolveCategory = async (categoryIdentifier) => {
    if (!categoryIdentifier) return null;

    if (mongoose.Types.ObjectId.isValid(categoryIdentifier)) {
        return Category.findById(categoryIdentifier);
    }

    const slug = slugify(categoryIdentifier);
    return Category.findOne({
        $or: [
            { slug },
            { name: new RegExp(`^${categoryIdentifier.trim()}$`, 'i') },
        ],
    });
};

/**
 * Create a new menu item.
 */
export const createMenuItem = async (data, file = null) => {
    // Verify that the referenced category exists
    const categoryDoc = await Category.findById(data.category);
    if (!categoryDoc) {
        throw new BadRequestError('Referenced category does not exist');
    }

    let image = data.image || { url: null, publicId: null };
    if (file && file.buffer) {
        image = await uploadImageBuffer(file.buffer, 'majedar/menu');
    }

    const pricingType = data.pricingType || 'single';
    const itemData = {
        name: data.name ? data.name.trim() : '',
        description: data.description ? data.description.trim() : '',
        pricingType,
        category: categoryDoc._id,
        image,
        isVeg: data.isVeg !== undefined ? data.isVeg : (data.isVegetarian !== undefined ? data.isVegetarian : true),
        isBestseller: data.isBestseller !== undefined ? data.isBestseller : false,
        isAvailable: data.isAvailable !== undefined ? data.isAvailable : true,
    };

    if (pricingType === 'single') {
        itemData.price = data.price;
        itemData.halfPrice = null;
        itemData.fullPrice = null;
    } else {
        itemData.price = null;
        itemData.halfPrice = data.halfPrice;
        itemData.fullPrice = data.fullPrice;
    }

    const menuItem = new MenuItem(itemData);

    await menuItem.save();
    return menuItem.populate('category', 'name slug isActive');
};

export const getMenuItems = async ({
    category,
    search,
    isBestseller,
    isVeg,
    isAvailable,
    sort,
    isPublic = false,
} = {}) => {
    const filter = {};

    // For public customer queries, strictly only show available items
    if (isPublic) {
        filter.isAvailable = true;
    } else if (isAvailable !== undefined) {
        filter.isAvailable = isAvailable;
    }

    // Category filter: support category ID, slug, or name
    if (category) {
        const catDoc = await resolveCategory(category);
        if (catDoc) {
            filter.category = catDoc._id;
        } else {
            // Category not found; return empty array immediately
            return [];
        }
    }

    // Keyword search over name and description
    if (search && search.trim()) {
        const searchRegex = new RegExp(search.trim(), 'i');
        filter.$or = [{ name: searchRegex }, { description: searchRegex }];
    }

    if (isBestseller !== undefined) {
        filter.isBestseller = isBestseller;
    }

    if (isVeg !== undefined) {
        filter.isVeg = isVeg;
    }

    // Sorting
    let sortOptions = { isBestseller: -1, createdAt: -1 };
    if (sort === 'price_asc') {
        sortOptions = { price: 1 };
    } else if (sort === 'price_desc') {
        sortOptions = { price: -1 };
    } else if (sort === 'name_asc') {
        sortOptions = { name: 1 };
    } else if (sort === 'name_desc') {
        sortOptions = { name: -1 };
    } else if (sort === 'newest') {
        sortOptions = { createdAt: -1 };
    }

    let query = MenuItem.find(filter)
        .populate('category', 'name slug isActive')
        .sort(sortOptions);

    const items = await query.exec();

    // If public, filter out any items whose category is inactive
    let finalItems = isPublic
        ? items.filter((item) => item.category && item.category.isActive !== false)
        : items;

    // Attach review ratings summary
    try {
        const itemIds = finalItems.map((i) => i._id);
        const ratingAgg = await Review.aggregate([
            { $match: { menuItem: { $in: itemIds } } },
            {
                $group: {
                    _id: '$menuItem',
                    averageRating: { $avg: '$rating' },
                    reviewCount: { $sum: 1 },
                },
            },
        ]);

        const ratingMap = new Map();
        if (Array.isArray(ratingAgg)) {
            ratingAgg.forEach((r) => {
                const key = r._id ? r._id.toString() : '';
                ratingMap.set(key, {
                    averageRating: Math.round(r.averageRating * 10) / 10,
                    reviewCount: r.reviewCount,
                });
            });
        }

        finalItems = finalItems.map((item) => {
            const doc = item.toJSON ? item.toJSON() : { ...item };
            const key = doc._id ? doc._id.toString() : '';
            const summary = ratingMap.get(key) || { averageRating: 0, reviewCount: 0 };
            doc.ratingSummary = summary;
            doc.averageRating = summary.averageRating;
            doc.reviewCount = summary.reviewCount;
            return doc;
        });
    } catch (_) { }

    return finalItems;
};

/**
 * Get a single menu item by ID.
 */
export const getMenuItemById = async (id, { isPublic = false } = {}) => {
    const item = await MenuItem.findById(id).populate('category', 'name slug isActive');
    if (!item) {
        throw new NotFoundError('Menu item not found');
    }

    if (isPublic && (!item.isAvailable || (item.category && item.category.isActive === false))) {
        throw new NotFoundError('Menu item is currently unavailable');
    }

    try {
        const stats = await Review.aggregate([
            { $match: { menuItem: item._id } },
            {
                $group: {
                    _id: '$menuItem',
                    averageRating: { $avg: '$rating' },
                    reviewCount: { $sum: 1 },
                },
            },
        ]);
        const summary = stats && stats[0]
            ? { averageRating: Math.round(stats[0].averageRating * 10) / 10, reviewCount: stats[0].reviewCount }
            : { averageRating: 0, reviewCount: 0 };
        const doc = item.toJSON ? item.toJSON() : { ...item };
        doc.ratingSummary = summary;
        doc.averageRating = summary.averageRating;
        doc.reviewCount = summary.reviewCount;
        return doc;
    } catch (_) { }

    return item.toJSON ? item.toJSON() : item;
};

/**
 * Update an existing menu item.
 */
export const updateMenuItem = async (id, updates, file = null) => {
    const item = await MenuItem.findById(id);
    if (!item) {
        throw new NotFoundError('Menu item not found');
    }

    if (updates.category) {
        const categoryDoc = await Category.findById(updates.category);
        if (!categoryDoc) {
            throw new BadRequestError('Referenced category does not exist');
        }
        item.category = categoryDoc._id;
    }

    if (updates.name !== undefined) item.name = updates.name.trim();
    if (updates.description !== undefined) item.description = updates.description.trim();
    if (updates.isVeg !== undefined) item.isVeg = updates.isVeg;
    if (updates.isBestseller !== undefined) item.isBestseller = updates.isBestseller;
    if (updates.isAvailable !== undefined) item.isAvailable = updates.isAvailable;

    if (updates.pricingType !== undefined) {
        item.pricingType = updates.pricingType;
    }

    if (item.pricingType === 'single') {
        if (updates.price !== undefined) item.price = updates.price;
        if (updates.pricingType === 'single') {
            item.halfPrice = null;
            item.fullPrice = null;
        }
    } else if (item.pricingType === 'half-full') {
        if (updates.halfPrice !== undefined) item.halfPrice = updates.halfPrice;
        if (updates.fullPrice !== undefined) item.fullPrice = updates.fullPrice;
        if (updates.pricingType === 'half-full') {
            item.price = null;
        }
    }

    // Handle image update
    if (file && file.buffer) {
        const newImage = await uploadImageBuffer(file.buffer, 'majedar/menu');
        if (item.image?.publicId) {
            await deleteCloudinaryImage(item.image.publicId);
        }
        item.image = newImage;
    } else if (updates.image !== undefined) {
        if (item.image?.publicId && item.image.publicId !== updates.image?.publicId) {
            await deleteCloudinaryImage(item.image.publicId);
        }
        item.image = updates.image;
    }

    await item.save();
    return item.populate('category', 'name slug isActive');
};

/**
 * Delete a menu item.
 */
export const deleteMenuItem = async (id) => {
    const item = await MenuItem.findById(id);
    if (!item) {
        throw new NotFoundError('Menu item not found');
    }

    if (item.image?.publicId) {
        await deleteCloudinaryImage(item.image.publicId);
    }

    await MenuItem.findByIdAndDelete(id);
    return { id, name: item.name };
};

export const getPublicMenuItems = (options = {}) => getMenuItems({ ...options, isPublic: true });
