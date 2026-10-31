import mongoose from 'mongoose';
import { Discount } from '../../models/Discount.js';
import { MenuItem } from '../../models/MenuItem.js';
import { Category } from '../../models/Category.js';
import { BadRequestError, NotFoundError } from '../../utils/errors.js';

/**
 * Checks whether a discount is currently active based on date range and total usage limit.
 */
export const isDiscountActiveAndValid = (discount, subtotal = null) => {
    if (!discount || !discount.isActive) {
        return { valid: false, reason: 'This offer is currently inactive or disabled.' };
    }

    const now = new Date();
    if (discount.startDate && new Date(discount.startDate) > now) {
        return { valid: false, reason: 'This offer has not started yet.' };
    }

    if (discount.expiryDate && new Date(discount.expiryDate) < now) {
        return { valid: false, reason: 'This offer has expired.' };
    }

    if (
        typeof discount.totalUsageLimit === 'number' &&
        discount.totalUsageLimit > 0 &&
        (discount.usageCount || 0) >= discount.totalUsageLimit
    ) {
        return { valid: false, reason: 'This coupon usage limit has been reached.' };
    }

    if (typeof subtotal === 'number' && discount.minOrderAmount > 0 && subtotal < discount.minOrderAmount) {
        return { valid: false, reason: `Minimum order amount of ₹${discount.minOrderAmount} required.` };
    }

    return { valid: true };
};

/**
 * Checks customer specific usage limit.
 */
export const checkCustomerUsageLimit = (discount, customerId) => {
    if (!discount.perCustomerUsageLimit || !customerId) {
        return { allowed: true };
    }

    const customerRecord = discount.customerUsage?.find(
        (u) => u.customer && u.customer.toString() === customerId.toString()
    );

    const currentCount = customerRecord ? customerRecord.count : 0;
    if (currentCount >= discount.perCustomerUsageLimit) {
        return {
            allowed: false,
            reason: `You have reached the maximum allowed usage limit (${discount.perCustomerUsageLimit} times) for this coupon.`,
        };
    }

    return { allowed: true, currentCount };
};

/**
 * Checks if a specific item is eligible under a discount's applicability rules.
 */
export const isItemEligible = (discount, menuItem, categoryId = null) => {
    if (!discount || !menuItem) return false;

    if (discount.applicability === 'entire_menu') {
        return menuItem.isAvailable !== false;
    }

    const itemCatId = (categoryId || menuItem.category?._id || menuItem.category)?.toString();
    const itemId = (menuItem._id || menuItem).toString();

    if (discount.applicability === 'categories') {
        if (!itemCatId || !Array.isArray(discount.categoryIds)) return false;
        return discount.categoryIds.some((catId) => catId.toString() === itemCatId);
    }

    if (discount.applicability === 'products') {
        if (!Array.isArray(discount.productIds)) return false;
        return discount.productIds.some((pId) => pId.toString() === itemId);
    }

    return false;
};

/**
 * Computes discount amount from eligible subtotal based on percentage or flat value and max limit.
 */
export const calculateDiscountAmount = (discount, eligibleSubtotal) => {
    if (!discount || eligibleSubtotal <= 0) return 0;

    let discountAmount = 0;
    if (discount.discountType === 'percentage') {
        discountAmount = (eligibleSubtotal * discount.discountValue) / 100;
        if (typeof discount.maxDiscountLimit === 'number' && discount.maxDiscountLimit > 0) {
            discountAmount = Math.min(discountAmount, discount.maxDiscountLimit);
        }
    } else if (discount.discountType === 'flat') {
        discountAmount = Math.min(discount.discountValue, eligibleSubtotal);
    }

    // Round to 2 decimal places
    return Math.round(discountAmount * 100) / 100;
};

/**
 * Central Cart and Order Pricing Calculator.
 * Authoritative backend calculation for food subtotal, eligible subtotal, discount, GST, and final total.
 */
export const calculateCartPricing = async ({
    items,
    couponCode = null,
    customerId = null,
    deliveryFee = 0,
}) => {
    if (!Array.isArray(items) || items.length === 0) {
        throw new BadRequestError('Cart is empty');
    }

    // 1. Group & consolidate items
    const itemVariantMap = new Map();
    const uniqueItemIdsSet = new Set();

    for (const item of items) {
        const id = (item.menuItem?._id || item.menuItem || item.itemId || item._id).toString();
        const variant = item.variant || 'single';
        const key = `${id}__${variant}`;

        uniqueItemIdsSet.add(id);
        const existing = itemVariantMap.get(key) || {
            menuItemId: id,
            variant,
            quantity: 0,
        };
        existing.quantity += Number(item.quantity) || 1;
        itemVariantMap.set(key, existing);
    }

    const uniqueItemIds = Array.from(uniqueItemIdsSet);
    const menuItems = await MenuItem.find({ _id: { $in: uniqueItemIds } }).populate('category');
    const menuItemMap = new Map(menuItems.map((m) => [m._id.toString(), m]));

    if (menuItems.length !== uniqueItemIds.length) {
        const foundIds = new Set(menuItems.map((item) => item._id.toString()));
        const missingIds = uniqueItemIds.filter((id) => !foundIds.has(id));
        throw new NotFoundError(`Menu item(s) not found: ${missingIds.join(', ')}`);
    }

    // Verify all items are available
    for (const menuItem of menuItems) {
        if (menuItem.isAvailable === false) {
            throw new BadRequestError(`Menu item "${menuItem.name}" is currently unavailable`);
        }
    }

    // 2. Compute base line items and subtotal
    let foodSubtotal = 0;
    const computedItems = [];

    for (const { menuItemId, variant, quantity } of itemVariantMap.values()) {
        const menuItem = menuItemMap.get(menuItemId);
        const pricingType = menuItem.pricingType || 'single';

        let unitPrice;
        if (pricingType === 'single') {
            unitPrice = menuItem.price;
        } else if (pricingType === 'half-full') {
            unitPrice = variant === 'half' ? menuItem.halfPrice : menuItem.fullPrice;
        }

        if (unitPrice === undefined || unitPrice === null || unitPrice <= 0) {
            throw new BadRequestError(
                `Invalid pricing for item "${menuItem.name}" (variant: ${variant})`
            );
        }

        const itemSubtotal = Math.round(unitPrice * quantity * 100) / 100;
        foodSubtotal += itemSubtotal;

        computedItems.push({
            menuItem: menuItem._id,
            name: menuItem.name,
            variant,
            unitPrice,
            price: unitPrice,
            quantity,
            image: menuItem.image?.url || null,
            subtotal: itemSubtotal,
            menuItemDoc: menuItem,
        });
    }

    foodSubtotal = Math.round(foodSubtotal * 100) / 100;

    // 3. Discount Evaluation
    let appliedDiscountObj = null;
    let discountAmount = 0;
    let eligibleSubtotal = 0;
    let isCoupon = false;

    const normalizedCode = couponCode ? couponCode.trim().toUpperCase() : null;

    if (normalizedCode) {
        // Customer manually applied a coupon code
        const coupon = await Discount.findOne({
            couponCode: normalizedCode,
            method: 'coupon',
        });

        if (!coupon) {
            throw new BadRequestError(`Coupon code "${normalizedCode}" is invalid.`);
        }

        const statusCheck = isDiscountActiveAndValid(coupon);
        if (!statusCheck.valid) {
            throw new BadRequestError(statusCheck.reason);
        }

        if (customerId) {
            const usageCheck = checkCustomerUsageLimit(coupon, customerId);
            if (!usageCheck.allowed) {
                throw new BadRequestError(usageCheck.reason);
            }
        }

        if (coupon.minOrderAmount > 0 && foodSubtotal < coupon.minOrderAmount) {
            throw new BadRequestError(
                `Coupon "${normalizedCode}" requires a minimum order amount of ₹${coupon.minOrderAmount}. Current subtotal is ₹${foodSubtotal}.`
            );
        }

        // Determine eligible items in cart
        let couponEligibleSubtotal = 0;
        for (const item of computedItems) {
            if (isItemEligible(coupon, item.menuItemDoc)) {
                couponEligibleSubtotal += item.subtotal;
            }
        }

        couponEligibleSubtotal = Math.round(couponEligibleSubtotal * 100) / 100;

        if (couponEligibleSubtotal <= 0) {
            throw new BadRequestError(
                `Coupon "${normalizedCode}" is not applicable to any items currently in your cart.`
            );
        }

        discountAmount = calculateDiscountAmount(coupon, couponEligibleSubtotal);
        eligibleSubtotal = couponEligibleSubtotal;
        appliedDiscountObj = coupon;
        isCoupon = true;
    } else {
        // Evaluate active automatic discounts
        const now = new Date();
        const automaticDiscounts = await Discount.find({
            method: 'automatic',
            isActive: true,
            $and: [
                { $or: [{ startDate: null }, { startDate: { $lte: now } }] },
                { $or: [{ expiryDate: null }, { expiryDate: { $gte: now } }] },
            ],
        });

        let bestDiscount = null;
        let bestDiscountAmount = 0;
        let bestEligibleSubtotal = 0;

        for (const autoDisc of automaticDiscounts) {
            // Check total usage limit
            if (
                typeof autoDisc.totalUsageLimit === 'number' &&
                autoDisc.totalUsageLimit > 0 &&
                (autoDisc.usageCount || 0) >= autoDisc.totalUsageLimit
            ) {
                continue;
            }

            // Check per-customer limit if customer logged in
            if (customerId) {
                const userCheck = checkCustomerUsageLimit(autoDisc, customerId);
                if (!userCheck.allowed) continue;
            }

            // Check minimum order amount
            if (autoDisc.minOrderAmount > 0 && foodSubtotal < autoDisc.minOrderAmount) {
                continue;
            }

            // Calculate eligible subtotal
            let currentEligibleSubtotal = 0;
            for (const item of computedItems) {
                if (isItemEligible(autoDisc, item.menuItemDoc)) {
                    currentEligibleSubtotal += item.subtotal;
                }
            }

            if (currentEligibleSubtotal <= 0) continue;

            const currentDiscountAmount = calculateDiscountAmount(autoDisc, currentEligibleSubtotal);
            if (currentDiscountAmount > bestDiscountAmount) {
                bestDiscountAmount = currentDiscountAmount;
                bestDiscount = autoDisc;
                bestEligibleSubtotal = currentEligibleSubtotal;
            }
        }

        if (bestDiscount && bestDiscountAmount > 0) {
            appliedDiscountObj = bestDiscount;
            discountAmount = bestDiscountAmount;
            eligibleSubtotal = Math.round(bestEligibleSubtotal * 100) / 100;
        }
    }

    // 4. Return complete pricing breakdown using pure calculator
    return computePricingBreakdown({
        computedItems,
        appliedDiscount: appliedDiscountObj,
        deliveryFee,
        isCoupon,
    });
};

/**
 * Pure calculation function for pricing breakdown without DB calls.
 */
export const computePricingBreakdown = ({
    computedItems = [],
    appliedDiscount = null,
    deliveryFee = 0,
    isCoupon = false,
}) => {
    let foodSubtotal = 0;
    for (const it of computedItems) {
        foodSubtotal += it.subtotal;
    }
    foodSubtotal = Math.round(foodSubtotal * 100) / 100;

    let eligibleSubtotal = 0;
    let discountAmount = 0;

    if (appliedDiscount) {
        for (const item of computedItems) {
            const doc = item.menuItemDoc || { _id: item.menuItem, category: item.category };
            if (isItemEligible(appliedDiscount, doc)) {
                eligibleSubtotal += item.subtotal;
            }
        }
        eligibleSubtotal = Math.round(eligibleSubtotal * 100) / 100;
        discountAmount = calculateDiscountAmount(appliedDiscount, eligibleSubtotal);
    }

    const itemSnapshots = [];
    let distributedDiscountSum = 0;

    for (let i = 0; i < computedItems.length; i++) {
        const item = computedItems[i];
        const doc = item.menuItemDoc || { _id: item.menuItem, category: item.category };
        const isEligible = appliedDiscount ? isItemEligible(appliedDiscount, doc) : false;

        let itemDiscount = 0;
        if (isEligible && eligibleSubtotal > 0 && discountAmount > 0) {
            if (i === computedItems.length - 1) {
                itemDiscount = Math.round((discountAmount - distributedDiscountSum) * 100) / 100;
            } else {
                itemDiscount = Math.round(((item.subtotal / eligibleSubtotal) * discountAmount) * 100) / 100;
                distributedDiscountSum += itemDiscount;
            }
        }

        const discountedSubtotal = Math.max(0, Math.round((item.subtotal - itemDiscount) * 100) / 100);
        const discountedUnitPrice = Math.round((discountedSubtotal / (item.quantity || 1)) * 100) / 100;

        itemSnapshots.push({
            menuItem: item.menuItem,
            name: item.name,
            variant: item.variant || 'single',
            unitPrice: item.unitPrice || item.price,
            price: item.unitPrice || item.price,
            quantity: item.quantity,
            image: item.image,
            subtotal: item.subtotal,
            originalUnitPrice: item.unitPrice || item.price,
            discountAmount: itemDiscount,
            discountedUnitPrice,
            discountedSubtotal,
            isEligibleForDiscount: isEligible,
        });
    }

    const finalFoodAmount = Math.max(0, Math.round((foodSubtotal - discountAmount) * 100) / 100);
    const gst = Math.round(finalFoodAmount * 0.05 * 100) / 100;
    const effectiveDeliveryFee = Number(deliveryFee) || 0;
    const finalTotal = Math.round((finalFoodAmount + gst + effectiveDeliveryFee) * 100) / 100;

    const discountSnapshot = appliedDiscount
        ? {
              discountId: appliedDiscount._id,
              name: appliedDiscount.name,
              code: appliedDiscount.couponCode || null,
              method: appliedDiscount.method,
              discountType: appliedDiscount.discountType,
              discountValue: appliedDiscount.discountValue,
              amount: discountAmount,
              eligibleSubtotal,
          }
        : {
              discountId: null,
              name: null,
              code: null,
              method: null,
              discountType: null,
              discountValue: 0,
              amount: 0,
              eligibleSubtotal: 0,
          };

    return {
        items: itemSnapshots,
        foodSubtotal,
        eligibleSubtotal,
        discountAmount,
        finalFoodAmount,
        gst,
        deliveryFee: effectiveDeliveryFee,
        total: finalTotal,
        totalSavings: discountAmount,
        discount: discountSnapshot,
        isCoupon,
    };
};

/**
 * Atomically records discount redemption and per-customer usage.
 */
export const recordDiscountUsage = async (discountId, customerId, discountAmount = 0) => {
    if (!discountId) return;

    try {
        const update = {
            $inc: {
                usageCount: 1,
                totalDiscountGiven: discountAmount,
            },
        };

        if (customerId) {
            // Check if customer already exists in customerUsage
            const discount = await Discount.findById(discountId);
            if (discount) {
                const customerIndex = discount.customerUsage?.findIndex(
                    (u) => u.customer && u.customer.toString() === customerId.toString()
                );

                if (customerIndex !== -1 && customerIndex !== undefined) {
                    await Discount.updateOne(
                        { _id: discountId, 'customerUsage.customer': customerId },
                        {
                            $inc: {
                                usageCount: 1,
                                totalDiscountGiven: discountAmount,
                                'customerUsage.$.count': 1,
                            },
                        }
                    );
                    return;
                } else {
                    await Discount.updateOne(
                        { _id: discountId },
                        {
                            $inc: {
                                usageCount: 1,
                                totalDiscountGiven: discountAmount,
                            },
                            $push: {
                                customerUsage: { customer: customerId, count: 1 },
                            },
                        }
                    );
                    return;
                }
            }
        }

        await Discount.findByIdAndUpdate(discountId, update);
    } catch (err) {
        console.error('[recordDiscountUsage Error]:', err.message);
    }
};

/**
 * Rollback discount usage if online payment fails or order expires before payment.
 */
export const rollbackDiscountUsage = async (discountId, customerId, discountAmount = 0) => {
    if (!discountId) return;

    try {
        if (customerId) {
            await Discount.updateOne(
                { _id: discountId, 'customerUsage.customer': customerId },
                {
                    $inc: {
                        usageCount: -1,
                        totalDiscountGiven: -discountAmount,
                        'customerUsage.$.count': -1,
                    },
                }
            );
        } else {
            await Discount.findByIdAndUpdate(discountId, {
                $inc: {
                    usageCount: -1,
                    totalDiscountGiven: -discountAmount,
                },
            });
        }
    } catch (err) {
        console.error('[rollbackDiscountUsage Error]:', err.message);
    }
};

/**
 * Fetches active automatic offers so frontend product cards can display discount badges & discounted prices.
 */
export const getActiveAutomaticDiscounts = async () => {
    const now = new Date();
    return await Discount.find({
        method: 'automatic',
        isActive: true,
        $and: [
            { $or: [{ startDate: null }, { startDate: { $lte: now } }] },
            { $or: [{ expiryDate: null }, { expiryDate: { $gte: now } }] },
        ],
    }).populate('categoryIds productIds');
};

/**
 * Admin: Get all discounts with pagination and filtering.
 */
export const getAdminDiscounts = async (query = {}) => {
    const { status, method, search, page = 1, limit = 20 } = query;
    const filter = {};

    const now = new Date();

    if (status === 'active') {
        filter.isActive = true;
        filter.$and = [
            { $or: [{ startDate: null }, { startDate: { $lte: now } }] },
            { $or: [{ expiryDate: null }, { expiryDate: { $gte: now } }] },
        ];
    } else if (status === 'inactive') {
        filter.isActive = false;
    } else if (status === 'expired') {
        filter.expiryDate = { $lt: now };
    }

    if (method === 'automatic' || method === 'coupon') {
        filter.method = method;
    }

    if (search && search.trim() !== '') {
        const s = search.trim();
        filter.$or = [
            { name: { $regex: s, $options: 'i' } },
            { couponCode: { $regex: s, $options: 'i' } },
            { description: { $regex: s, $options: 'i' } },
        ];
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    const [discounts, total] = await Promise.all([
        Discount.find(filter)
            .populate('categoryIds', 'name')
            .populate('productIds', 'name price image')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNum),
        Discount.countDocuments(filter),
    ]);

    return {
        discounts,
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
    };
};

/**
 * Admin: Create a new discount.
 */
export const createDiscount = async (data) => {
    // Validate uniqueness of coupon code if provided
    if (data.method === 'coupon') {
        if (!data.couponCode || !data.couponCode.trim()) {
            throw new BadRequestError('Coupon code is required for coupon-based discounts');
        }
        const existing = await Discount.findOne({
            couponCode: data.couponCode.trim().toUpperCase(),
        });
        if (existing) {
            throw new BadRequestError(`Coupon code "${data.couponCode.trim().toUpperCase()}" already exists`);
        }
        data.couponCode = data.couponCode.trim().toUpperCase();
    } else {
        data.couponCode = null;
    }

    // Applicability validation
    if (data.applicability === 'categories') {
        if (!Array.isArray(data.categoryIds) || data.categoryIds.length === 0) {
            throw new BadRequestError('Please select at least one category for category-based discount');
        }
    } else if (data.applicability === 'products') {
        if (!Array.isArray(data.productIds) || data.productIds.length === 0) {
            throw new BadRequestError('Please select at least one product for product-based discount');
        }
    }

    const discount = new Discount(data);
    await discount.save();
    return discount;
};

/**
 * Admin: Update discount.
 */
export const updateDiscount = async (id, data) => {
    const discount = await Discount.findById(id);
    if (!discount) {
        throw new NotFoundError('Discount not found');
    }

    if (data.method === 'coupon' || (discount.method === 'coupon' && data.couponCode)) {
        const code = (data.couponCode || discount.couponCode || '').trim().toUpperCase();
        if (!code) {
            throw new BadRequestError('Coupon code is required for coupon-based discounts');
        }
        const existing = await Discount.findOne({
            couponCode: code,
            _id: { $ne: id },
        });
        if (existing) {
            throw new BadRequestError(`Coupon code "${code}" is already in use by another discount`);
        }
        data.couponCode = code;
    }

    Object.assign(discount, data);
    await discount.save();
    return discount;
};

/**
 * Admin: Toggle discount active status.
 */
export const toggleDiscountStatus = async (id) => {
    const discount = await Discount.findById(id);
    if (!discount) {
        throw new NotFoundError('Discount not found');
    }
    discount.isActive = !discount.isActive;
    await discount.save();
    return discount;
};

/**
 * Admin: Delete discount.
 */
export const deleteDiscount = async (id) => {
    const discount = await Discount.findByIdAndDelete(id);
    if (!discount) {
        throw new NotFoundError('Discount not found');
    }
    return discount;
};

/**
 * Admin: Summary statistics for overview dashboard.
 */
export const getDiscountOverviewStats = async () => {
    const now = new Date();

    const [
        totalDiscounts,
        activeDiscounts,
        activeCoupons,
        activeAutomatic,
        aggregates,
    ] = await Promise.all([
        Discount.countDocuments(),
        Discount.countDocuments({
            isActive: true,
            $and: [
                { $or: [{ startDate: null }, { startDate: { $lte: now } }] },
                { $or: [{ expiryDate: null }, { expiryDate: { $gte: now } }] },
            ],
        }),
        Discount.countDocuments({
            method: 'coupon',
            isActive: true,
            $and: [
                { $or: [{ startDate: null }, { startDate: { $lte: now } }] },
                { $or: [{ expiryDate: null }, { expiryDate: { $gte: now } }] },
            ],
        }),
        Discount.countDocuments({
            method: 'automatic',
            isActive: true,
            $and: [
                { $or: [{ startDate: null }, { startDate: { $lte: now } }] },
                { $or: [{ expiryDate: null }, { expiryDate: { $gte: now } }] },
            ],
        }),
        Discount.aggregate([
            {
                $group: {
                    _id: null,
                    totalRedemptions: { $sum: '$usageCount' },
                    totalDiscountGiven: { $sum: '$totalDiscountGiven' },
                },
            },
        ]),
    ]);

    const stats = aggregates[0] || { totalRedemptions: 0, totalDiscountGiven: 0 };

    return {
        totalDiscounts,
        activeDiscounts,
        activeCoupons,
        activeAutomatic,
        totalRedemptions: stats.totalRedemptions,
        totalDiscountGiven: Math.round(stats.totalDiscountGiven * 100) / 100,
    };
};

/**
 * Decorates an array of menu item objects with active discount pricing, badges, and savings.
 */
export const decorateMenuItemsWithDiscounts = async (items, preloadedDiscounts = null) => {
    if (!Array.isArray(items) || items.length === 0) return items;

    const now = new Date();
    const activeDiscounts = preloadedDiscounts || await Discount.find({
        isActive: true,
        $and: [
            { $or: [{ startDate: null }, { startDate: { $lte: now } }] },
            { $or: [{ expiryDate: null }, { expiryDate: { $gte: now } }] },
        ],
    });

    const activeAutomatic = activeDiscounts.filter(
        (d) =>
            d.method === 'automatic' &&
            !(typeof d.totalUsageLimit === 'number' && d.totalUsageLimit > 0 && d.usageCount >= d.totalUsageLimit)
    );

    const activeCoupons = activeDiscounts.filter(
        (d) =>
            d.method === 'coupon' &&
            !(typeof d.totalUsageLimit === 'number' && d.totalUsageLimit > 0 && d.usageCount >= d.totalUsageLimit)
    );

    return items.map((rawItem) => {
        const item = rawItem.toJSON ? rawItem.toJSON() : { ...rawItem };

        let bestAuto = null;
        let maxSavings = 0;
        let discountedPrice = null;
        let discountedHalfPrice = null;
        let discountedFullPrice = null;
        let halfSavings = 0;
        let fullSavings = 0;

        for (const autoDisc of activeAutomatic) {
            if (isItemEligible(autoDisc, item)) {
                if (item.pricingType === 'half-full') {
                    const hs = calculateDiscountAmount(autoDisc, item.halfPrice || 0);
                    const fs = calculateDiscountAmount(autoDisc, item.fullPrice || 0);
                    if (fs > maxSavings) {
                        maxSavings = fs;
                        bestAuto = autoDisc;
                        halfSavings = hs;
                        fullSavings = fs;
                        discountedHalfPrice = Math.max(0, Math.round(((item.halfPrice || 0) - hs) * 100) / 100);
                        discountedFullPrice = Math.max(0, Math.round(((item.fullPrice || 0) - fs) * 100) / 100);
                    }
                } else {
                    const s = calculateDiscountAmount(autoDisc, item.price || 0);
                    if (s > maxSavings) {
                        maxSavings = s;
                        bestAuto = autoDisc;
                        discountedPrice = Math.max(0, Math.round(((item.price || 0) - s) * 100) / 100);
                    }
                }
            }
        }

        const isCouponEligible = activeCoupons.some((c) => isItemEligible(c, item));

        if (bestAuto) {
            const badge =
                bestAuto.discountType === 'percentage'
                    ? `${bestAuto.discountValue}% OFF`
                    : `₹${bestAuto.discountValue} OFF`;

            item.activeDiscount = {
                discountId: bestAuto._id,
                name: bestAuto.name,
                discountType: bestAuto.discountType,
                discountValue: bestAuto.discountValue,
                badge,
                savings: maxSavings,
                savingsAmount: maxSavings,
                halfSavings,
                fullSavings,
                discountedPrice,
                discountedHalfPrice,
                discountedFullPrice,
            };
            item.discountBadge = badge;
            item.discountedPrice = discountedPrice;
            item.discountedHalfPrice = discountedHalfPrice;
            item.discountedFullPrice = discountedFullPrice;
            item.savings = maxSavings;
            item.savingsAmount = maxSavings;
            item.onOffer = true;
        } else if (isCouponEligible) {
            item.activeDiscount = null;
            item.discountBadge = 'Coupon Offer';
            item.onOffer = true;
        } else {
            item.activeDiscount = null;
            item.discountBadge = null;
            item.discountedPrice = null;
            item.discountedHalfPrice = null;
            item.discountedFullPrice = null;
            item.savings = 0;
            item.onOffer = false;
        }

        return item;
    });
};
