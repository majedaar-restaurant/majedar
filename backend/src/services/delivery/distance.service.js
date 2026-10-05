import { restaurantConfig } from '../../config/restaurant.config.js';
import { BadRequestError, ServiceUnavailableError } from '../../utils/errors.js';

/**
 * Mock hook for automated testing.
 * When set, calculateRouteDistance delegates to this function.
 */
let mockDistanceCalculator = null;

export const setMockDistanceCalculator = (fn) => {
    mockDistanceCalculator = fn;
};

export const clearMockDistanceCalculator = () => {
    mockDistanceCalculator = null;
};

/**
 * Calculates authoritative driving-route distance and delivery fee
 * from Majedaar Restaurant & Cafe to the customer's coordinates.
 *
 * @param {number|Object} customerLatOrObj - Customer latitude or { latitude, longitude }
 * @param {number} [customerLngArg] - Customer longitude
 * @returns {Promise<{
 *   isEligible: boolean,
 *   distanceMeters: number,
 *   distanceKm: number,
 *   formattedDistance: string,
 *   fee: number|null,
 *   tier: string|null,
 *   durationSeconds: number|null,
 *   message?: string
 * }>}
 */
export const calculateRouteDistance = async (customerLatOrObj, customerLngArg) => {
    let customerLat;
    let customerLng;

    if (customerLatOrObj && typeof customerLatOrObj === 'object') {
        customerLat = Number(customerLatOrObj.latitude ?? customerLatOrObj.lat);
        customerLng = Number(customerLatOrObj.longitude ?? customerLatOrObj.lng);
    } else {
        customerLat = Number(customerLatOrObj);
        customerLng = Number(customerLngArg);
    }

    if (typeof customerLat !== 'number' || typeof customerLng !== 'number' || isNaN(customerLat) || isNaN(customerLng)) {
        throw new BadRequestError('Invalid latitude or longitude provided for route calculation');
    }

    if (customerLat < -90 || customerLat > 90 || customerLng < -180 || customerLng > 180) {
        throw new BadRequestError('Coordinates are outside valid geographic range');
    }

    // 1. Check if mock calculator is registered (e.g. in test suite)
    if (typeof mockDistanceCalculator === 'function') {
        try {
            const mockResult = await mockDistanceCalculator(customerLat, customerLng);
            return formatRouteResult(mockResult);
        } catch (err) {
            return {
                isEligible: false,
                distanceMeters: null,
                distanceKm: null,
                formattedDistance: null,
                fee: null,
                tier: null,
                durationSeconds: null,
                message: `Unable to calculate driving route distance: ${err.message}`,
            };
        }
    }

    const originLat = restaurantConfig.location.latitude;
    const originLng = restaurantConfig.location.longitude;
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
        console.error('[DistanceService] GOOGLE_MAPS_API_KEY is not configured in backend/.env');
        throw new ServiceUnavailableError(
            'Delivery distance calculation is currently unavailable. Please contact the restaurant.'
        );
    }

    let distanceMeters = null;
    let durationSeconds = null;

    // 2. Authoritative Google Routes API (Directions v2:computeRoutes)
    try {
        const routesResponse = await fetch('https://routes.googleapis.com/directions/v2:computeRoutes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Goog-Api-Key': apiKey,
                'X-Goog-FieldMask': 'routes.distanceMeters,routes.duration',
            },
            body: JSON.stringify({
                origin: {
                    location: {
                        latLng: {
                            latitude: originLat,
                            longitude: originLng,
                        },
                    },
                },
                destination: {
                    location: {
                        latLng: {
                            latitude: customerLat,
                            longitude: customerLng,
                        },
                    },
                },
                travelMode: 'DRIVE',
                routingPreference: 'TRAFFIC_UNAWARE',
            }),
        });

        if (routesResponse.ok) {
            const data = await routesResponse.json();
            if (Array.isArray(data.routes) && data.routes.length > 0 && typeof data.routes[0].distanceMeters === 'number') {
                distanceMeters = data.routes[0].distanceMeters;
                const durStr = data.routes[0].duration; // e.g. "540s"
                durationSeconds = durStr ? parseInt(durStr.replace('s', ''), 10) : null;
            } else {
                console.warn('[DistanceService] Google Routes API returned no routes for destination:', { customerLat, customerLng });
            }
        } else {
            const errData = await routesResponse.json().catch(() => ({}));
            console.error('[DistanceService] Google Routes API error response:', routesResponse.status, errData?.error?.message || '');
            throw new ServiceUnavailableError(
                'Unable to calculate driving route distance at this time. Please try again.'
            );
        }
    } catch (err) {
        if (err instanceof ServiceUnavailableError || err instanceof BadRequestError) {
            throw err;
        }
        console.error('[DistanceService] Google Routes API call failed:', err.message);
        throw new ServiceUnavailableError(
            'Unable to calculate driving route distance at this time. Please try again.'
        );
    }

    if (distanceMeters === null) {
        throw new BadRequestError(
            'Unable to find a valid driving route to the selected location. Please verify your delivery address.'
        );
    }

    return formatRouteResult({ distanceMeters, durationSeconds });
};

/**
 * Format raw metres into authoritative eligibility, fee, and display values.
 * Strictly checks unrounded boundaries against 3,000 m and 7,000 m.
 */
export const formatRouteResult = ({ distanceMeters, durationSeconds = null }) => {
    const distanceKm = Math.round((distanceMeters / 1000) * 100) / 100;
    const formattedDistance = `${(distanceMeters / 1000).toFixed(1)} km`;

    // Strictly compare unrounded distance in metres against 3,000 m and 7,000 m
    if (distanceMeters <= restaurantConfig.deliveryTiers.tier1.maxDistanceMetres) {
        // 0–3 km inclusive (<= 3000 m) -> ₹15
        return {
            isEligible: true,
            distanceMeters,
            distanceKm,
            formattedDistance,
            durationSeconds,
            fee: restaurantConfig.deliveryTiers.tier1.fee,
            tier: restaurantConfig.deliveryTiers.tier1.label, // '0–3 km'
            restaurantLocation: {
                latitude: restaurantConfig.location.latitude,
                longitude: restaurantConfig.location.longitude,
            },
        };
    }

    if (distanceMeters <= restaurantConfig.deliveryTiers.tier2.maxDistanceMetres) {
        // Above 3 km up to 7 km inclusive (> 3000 m and <= 7000 m) -> ₹30
        return {
            isEligible: true,
            distanceMeters,
            distanceKm,
            formattedDistance,
            durationSeconds,
            fee: restaurantConfig.deliveryTiers.tier2.fee,
            tier: restaurantConfig.deliveryTiers.tier2.label, // '3–7 km'
            restaurantLocation: {
                latitude: restaurantConfig.location.latitude,
                longitude: restaurantConfig.location.longitude,
            },
        };
    }

    // Above 7,000 m (> 7 km) -> Ineligible
    return {
        isEligible: false,
        distanceMeters,
        distanceKm,
        formattedDistance,
        durationSeconds,
        fee: null,
        tier: null,
        message: 'Sorry, we currently deliver only within 7 km of our restaurant. Please choose another delivery address.',
        restaurantLocation: {
            latitude: restaurantConfig.location.latitude,
            longitude: restaurantConfig.location.longitude,
        },
    };
};
