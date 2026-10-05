import { BadRequestError } from '../utils/errors.js';

/**
 * Centralized restaurant business configuration.
 * Controls store operational status, minimum order thresholds, and tiered delivery fee calculations.
 */
export const restaurantConfig = {
    isOpen: process.env.RESTAURANT_IS_OPEN !== 'false',
    // Verified location from Google Maps listing: https://maps.app.goo.gl/SbpB8kBUHZnyjfku9
    location: {
        latitude: parseFloat(process.env.RESTAURANT_LATITUDE) || 26.7828564,
        longitude: parseFloat(process.env.RESTAURANT_LONGITUDE) || 82.1624034,
        name: 'Majedaar Restaurant & Cafe',
        address: 'Majedaar Restaurant & Cafe, Ayodhya, Uttar Pradesh',
    },
    maxDeliveryDistanceMetres: 7000,
    maxDeliveryDistanceKm: 7,
    delivery: {
        maxDeliveryDistanceMetres: 7000,
        maxDeliveryDistanceKm: 7,
    },
    deliveryTiers: {
        tier1: {
            id: 'tier1',
            label: '0–3 km',
            maxDistanceKm: 3,
            maxDistanceMetres: 3000,
            fee: parseInt(process.env.DELIVERY_FEE_TIER1, 10) || 15,
        },
        tier2: {
            id: 'tier2',
            label: '3–7 km',
            maxDistanceKm: 7,
            maxDistanceMetres: 7000,
            fee: parseInt(process.env.DELIVERY_FEE_TIER2, 10) || 30,
        },
    },
    minimumOrderAmount: parseInt(process.env.MINIMUM_ORDER_AMOUNT, 10) || 150,
    city: 'Ayodhya',
    onlinePaymentEnabled: process.env.ONLINE_PAYMENT_ENABLED === 'true',
};

export const RESTAURANT_CONFIG = restaurantConfig;

export const isOnlinePaymentEnabled = () => {
    return Boolean(restaurantConfig.onlinePaymentEnabled);
};

export const setOnlinePaymentEnabled = (enabled) => {
    restaurantConfig.onlinePaymentEnabled = Boolean(enabled);
};

export const isRestaurantOpen = () => {
    return restaurantConfig.isOpen;
};

export const getDeliveryTiers = () => {
    return [
        { ...restaurantConfig.deliveryTiers.tier1 },
        { ...restaurantConfig.deliveryTiers.tier2 },
    ];
};

export const getAllowedDeliveryFees = () => {
    return [
        restaurantConfig.deliveryTiers.tier1.fee,
        restaurantConfig.deliveryTiers.tier2.fee,
    ];
};

/**
 * Calculate or validate the delivery fee.
 * Authoritative enforcement for 0–3 km (₹15), 3–7 km (₹30), and rejection above 7 km.
 */
export const calculateDeliveryFee = ({
    orderType = 'delivery',
    subtotal = 0,
    address = null,
    selectedDeliveryFee = null,
    distanceKm = null,
    distanceMetres = null,
} = {}) => {
    if (orderType === 'pickup' || orderType === 'dine_in') {
        return 0;
    }

    // Authoritative check based on route distance in metres
    if (typeof distanceMetres === 'number') {
        if (distanceMetres <= restaurantConfig.deliveryTiers.tier1.maxDistanceMetres) {
            return restaurantConfig.deliveryTiers.tier1.fee;
        }
        if (distanceMetres <= restaurantConfig.deliveryTiers.tier2.maxDistanceMetres) {
            return restaurantConfig.deliveryTiers.tier2.fee;
        }
        throw new BadRequestError('Delivery address is beyond our 7 km delivery service radius.');
    }

    // Fallback distance in kilometres
    if (typeof distanceKm === 'number') {
        if (distanceKm <= restaurantConfig.deliveryTiers.tier1.maxDistanceKm) {
            return restaurantConfig.deliveryTiers.tier1.fee;
        }
        if (distanceKm <= restaurantConfig.deliveryTiers.tier2.maxDistanceKm) {
            return restaurantConfig.deliveryTiers.tier2.fee;
        }
        throw new BadRequestError('Delivery address is beyond our 7 km delivery service radius.');
    }

    const allowedFees = getAllowedDeliveryFees();

    // If client provided a selected delivery fee, validate it strictly against allowed tiers
    if (selectedDeliveryFee !== undefined && selectedDeliveryFee !== null) {
        const feeNum = Number(selectedDeliveryFee);
        if (!allowedFees.includes(feeNum)) {
            throw new BadRequestError(
                `Invalid delivery fee. Allowed fees are ₹${allowedFees.join(' (0–3 km) and ₹')} (3–7 km).`
            );
        }
        return feeNum;
    }

    // Default fallback: Tier 1 fee (0–3 km)
    return restaurantConfig.deliveryTiers.tier1.fee;
};

export const setRestaurantOpen = (status) => {
    restaurantConfig.isOpen = Boolean(status);
};

export const setDeliveryFeeTier1 = (fee) => {
    restaurantConfig.deliveryTiers.tier1.fee = Number(fee);
};

export const setDeliveryFeeTier2 = (fee) => {
    restaurantConfig.deliveryTiers.tier2.fee = Number(fee);
};

// Setter helper for testing
export const setDeliveryFee = (fee) => {
    setDeliveryFeeTier1(fee);
};

export const setMinimumOrderAmount = (amount) => {
    restaurantConfig.minimumOrderAmount = Number(amount);
};
