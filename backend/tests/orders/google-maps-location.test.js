import test from 'node:test';
import assert from 'node:assert/strict';
import {
    createOrderSchema,
    locationInputSchema,
} from '../../src/validators/order.validator.js';
import { Order } from '../../src/models/Order.js';
import {
    calculateRouteDistance,
    setMockDistanceCalculator,
} from '../../src/services/delivery/distance.service.js';
import {
    RESTAURANT_CONFIG,
    calculateDeliveryFee,
} from '../../src/config/restaurant.config.js';

test('Google Maps Location & Delivery Coordinates Validation Suite', async (t) => {
    await t.test('1. locationInputSchema validates coordinates and constraints', async (t) => {
        await t.test('accepts valid latitude and longitude pair with google_places source', () => {
            const valid = {
                latitude: 26.782142,
                longitude: 82.145678,
                placeId: 'ChIJVX1234567890',
                formattedAddress: 'Civil Lines, Ayodhya, Uttar Pradesh 224001, India',
                source: 'google_places',
            };
            const result = locationInputSchema.safeParse(valid);
            assert.equal(result.success, true);
            assert.equal(result.data.latitude, 26.782142);
            assert.equal(result.data.longitude, 82.145678);
            assert.equal(result.data.source, 'google_places');
        });

        await t.test('accepts valid coordinates with current_location source', () => {
            const valid = {
                latitude: 26.765432,
                longitude: 82.123456,
                source: 'current_location',
                formattedAddress: 'Niyawan, Faizabad, Uttar Pradesh, India',
            };
            const result = locationInputSchema.safeParse(valid);
            assert.equal(result.success, true);
            assert.equal(result.data.source, 'current_location');
        });

        await t.test('accepts null or undefined coordinates for manual address entry', () => {
            const resultNull = locationInputSchema.safeParse(null);
            assert.equal(resultNull.success, true);

            const resultUndefined = locationInputSchema.safeParse(undefined);
            assert.equal(resultUndefined.success, true);

            const resultEmptyObject = locationInputSchema.safeParse({
                latitude: null,
                longitude: null,
                source: 'manual',
            });
            assert.equal(resultEmptyObject.success, true);
        });

        await t.test('rejects latitude outside valid range (-90 to 90)', () => {
            const invalidTooHigh = locationInputSchema.safeParse({
                latitude: 91.5,
                longitude: 82.1456,
            });
            assert.equal(invalidTooHigh.success, false);

            const invalidTooLow = locationInputSchema.safeParse({
                latitude: -95.0,
                longitude: 82.1456,
            });
            assert.equal(invalidTooLow.success, false);
        });

        await t.test('rejects longitude outside valid range (-180 to 180)', () => {
            const invalidTooHigh = locationInputSchema.safeParse({
                latitude: 26.78,
                longitude: 181.0,
            });
            assert.equal(invalidTooHigh.success, false);

            const invalidTooLow = locationInputSchema.safeParse({
                latitude: 26.78,
                longitude: -185.0,
            });
            assert.equal(invalidTooLow.success, false);
        });

        await t.test('rejects incomplete coordinate pair (latitude provided without longitude)', () => {
            const onlyLat = locationInputSchema.safeParse({
                latitude: 26.78,
                longitude: null,
            });
            assert.equal(onlyLat.success, false);
            assert.match(
                onlyLat.error.issues[0].message,
                /Latitude and longitude must either both be present or both be absent/
            );
        });

        await t.test('rejects incomplete coordinate pair (longitude provided without latitude)', () => {
            const onlyLng = locationInputSchema.safeParse({
                latitude: null,
                longitude: 82.14,
            });
            assert.equal(onlyLng.success, false);
            assert.match(
                onlyLng.error.issues[0].message,
                /Latitude and longitude must either both be present or both be absent/
            );
        });

        await t.test('rejects non-numeric string coordinates', () => {
            const stringCoords = locationInputSchema.safeParse({
                latitude: '26.78',
                longitude: '82.14',
            });
            assert.equal(stringCoords.success, false);
        });
    });

    await t.test('2. createOrderSchema integration with location', async (t) => {
        const baseOrder = {
            items: [
                {
                    menuItem: '507f1f77bcf86cd799439011',
                    variant: 'single',
                    quantity: 2,
                },
            ],
            deliveryZoneId: '507f1f77bcf86cd799439022',
            orderType: 'delivery',
            paymentMethod: 'cod',
            deliveryAddress: {
                firstName: 'Mohd',
                lastName: 'Zaid',
                phone: '9876543210',
                email: 'zaid@example.com',
                address: '123 Civil Lines Road',
                area: 'Civil Lines',
                landmark: 'Near SBI Bank',
                deliveryInstructions: 'Call on arrival',
            },
        };

        await t.test('accepts full order payload with verified Google Places location', () => {
            const payload = {
                ...baseOrder,
                deliveryAddress: {
                    ...baseOrder.deliveryAddress,
                    location: {
                        latitude: 26.782142,
                        longitude: 82.145678,
                        placeId: 'ChIJTestPlace123',
                        formattedAddress: '123 Civil Lines, Ayodhya, UP 224001, India',
                        source: 'google_places',
                    },
                },
            };
            const result = createOrderSchema.safeParse(payload);
            assert.equal(result.success, true);
            assert.equal(result.data.deliveryAddress.location.latitude, 26.782142);
            assert.equal(result.data.deliveryAddress.location.longitude, 82.145678);
            assert.equal(result.data.deliveryAddress.location.source, 'google_places');
        });

        await t.test('accepts full order payload without location (backward compatibility / manual entry)', () => {
            const result = createOrderSchema.safeParse(baseOrder);
            assert.equal(result.success, true);
            assert.equal(result.data.deliveryAddress.location, undefined);
        });

        await t.test('rejects order payload when location coordinates are malformed', () => {
            const invalidPayload = {
                ...baseOrder,
                deliveryAddress: {
                    ...baseOrder.deliveryAddress,
                    location: {
                        latitude: 95.0, // Invalid latitude > 90
                        longitude: 82.14,
                        source: 'google_places',
                    },
                },
            };
            const result = createOrderSchema.safeParse(invalidPayload);
            assert.equal(result.success, false);
        });
    });

    await t.test('3. Order Mongoose Model Schema supports location', () => {
        const order = new Order({
            orderNumber: 'MD-TEST-LOC001',
            customer: '507f1f77bcf86cd799439033',
            items: [
                {
                    menuItem: '507f1f77bcf86cd799439011',
                    name: 'Chicken Biryani',
                    variant: 'single',
                    unitPrice: 250,
                    price: 250,
                    quantity: 1,
                    subtotal: 250,
                },
            ],
            deliveryAddress: {
                firstName: 'Test',
                lastName: 'Customer',
                phone: '9876543210',
                email: 'test@example.com',
                address: 'Main Market',
                location: {
                    latitude: 26.782,
                    longitude: 82.145,
                    placeId: 'ChIJtest',
                    formattedAddress: 'Main Market, Faizabad',
                    source: 'google_places',
                },
            },
            orderType: 'delivery',
            subtotal: 250,
            deliveryFee: 15,
            total: 265,
        });

        assert.equal(order.deliveryAddress.location.latitude, 26.782);
        assert.equal(order.deliveryAddress.location.longitude, 82.145);
        assert.equal(order.deliveryAddress.location.source, 'google_places');
        assert.equal(order.deliveryAddress.location.placeId, 'ChIJtest');
    });

    await t.test('4. Delivery fee rules & 7 km boundary enforcement', async (t) => {
        await t.test('0–3 km (including exactly 3,000 m) returns ₹15', () => {
            assert.equal(calculateDeliveryFee({ distanceKm: 2.5 }), 15);
            assert.equal(calculateDeliveryFee({ distanceKm: 3.0 }), 15);
            assert.equal(calculateDeliveryFee({ distanceMetres: 2500 }), 15);
            assert.equal(calculateDeliveryFee({ distanceMetres: 3000 }), 15);
        });

        await t.test('Above 3 km up to 7 km (including exactly 7,000 m) returns ₹30', () => {
            assert.equal(calculateDeliveryFee({ distanceKm: 3.1 }), 30);
            assert.equal(calculateDeliveryFee({ distanceKm: 6.8 }), 30);
            assert.equal(calculateDeliveryFee({ distanceKm: 7.0 }), 30);
            assert.equal(calculateDeliveryFee({ distanceMetres: 3001 }), 30);
            assert.equal(calculateDeliveryFee({ distanceMetres: 6800 }), 30);
            assert.equal(calculateDeliveryFee({ distanceMetres: 7000 }), 30);
        });

        await t.test('Above 7 km (even 7.01 km or 7,001 m) throws BadRequestError (delivery unavailable)', () => {
            assert.throws(() => calculateDeliveryFee({ distanceKm: 7.01 }), /beyond our 7 km/);
            assert.throws(() => calculateDeliveryFee({ distanceKm: 8.5 }), /beyond our 7 km/);
            assert.throws(() => calculateDeliveryFee({ distanceMetres: 7001 }), /beyond our 7 km/);
            assert.throws(() => calculateDeliveryFee({ distanceMetres: 7050 }), /beyond our 7 km/);
        });

        await t.test('Restaurant coordinates match verified Google Maps listing in Ayodhya', () => {
            assert.equal(RESTAURANT_CONFIG.location.latitude, 26.7828564);
            assert.equal(RESTAURANT_CONFIG.location.longitude, 82.1624034);
            assert.equal(RESTAURANT_CONFIG.delivery.maxDeliveryDistanceMetres, 7000);
            assert.equal(RESTAURANT_CONFIG.delivery.maxDeliveryDistanceKm, 7.0);
        });
    });

    await t.test('5. Authoritative Route Distance Service with 7 km boundary and failure handling', async (t) => {
        // Customer coordinates in Faizabad / Ayodhya
        const sampleCoords = { latitude: 26.7845, longitude: 82.1520 };

        await t.test('Route distance exactly 3,000 m produces ₹15 fee and is eligible', async () => {
            setMockDistanceCalculator(async () => ({
                distanceMeters: 3000,
                durationSeconds: 420,
                provider: 'routes_api_v2',
            }));

            const result = await calculateRouteDistance(sampleCoords);
            assert.equal(result.isEligible, true);
            assert.equal(result.fee, 15);
            assert.equal(result.tier, '0–3 km');
            assert.equal(result.distanceMeters, 3000);
            assert.equal(result.distanceKm, 3.0);
            assert.equal(result.formattedDistance, '3.0 km');
        });

        await t.test('Route distance 3,001 m produces ₹30 fee and is eligible', async () => {
            setMockDistanceCalculator(async () => ({
                distanceMeters: 3001,
                durationSeconds: 430,
                provider: 'routes_api_v2',
            }));

            const result = await calculateRouteDistance(sampleCoords);
            assert.equal(result.isEligible, true);
            assert.equal(result.fee, 30);
            assert.equal(result.tier, '3–7 km');
            assert.equal(result.distanceMeters, 3001);
            assert.equal(result.distanceKm, 3.0);
        });

        await t.test('Route distance exactly 7,000 m produces ₹30 fee and is eligible', async () => {
            setMockDistanceCalculator(async () => ({
                distanceMeters: 7000,
                durationSeconds: 900,
                provider: 'routes_api_v2',
            }));

            const result = await calculateRouteDistance(sampleCoords);
            assert.equal(result.isEligible, true);
            assert.equal(result.fee, 30);
            assert.equal(result.tier, '3–7 km');
            assert.equal(result.distanceMeters, 7000);
            assert.equal(result.distanceKm, 7.0);
            assert.equal(result.formattedDistance, '7.0 km');
        });

        await t.test('Route distance 7,001 m is marked ineligible and fee is null', async () => {
            setMockDistanceCalculator(async () => ({
                distanceMeters: 7001,
                durationSeconds: 910,
                provider: 'routes_api_v2',
            }));

            const result = await calculateRouteDistance(sampleCoords);
            assert.equal(result.isEligible, false);
            assert.equal(result.fee, null);
            assert.equal(result.distanceMeters, 7001);
            assert.match(result.message, /deliver only within 7 km/);

            // Reset mock calculator
            setMockDistanceCalculator(null);
        });

        await t.test('Routing failure returns isEligible: false and does NOT silently approve delivery', async () => {
            setMockDistanceCalculator(async () => {
                throw new Error('Google Routes API route not found');
            });

            const result = await calculateRouteDistance(sampleCoords);
            assert.equal(result.isEligible, false);
            assert.equal(result.fee, null);
            assert.equal(result.distanceMeters, null);
            assert.match(result.message, /Unable to calculate driving route distance/);

            // Reset mock calculator
            setMockDistanceCalculator(null);
        });

        await t.test('Missing GOOGLE_MAPS_API_KEY throws ServiceUnavailableError (503, not 400)', async () => {
            setMockDistanceCalculator(null);
            const originalKey = process.env.GOOGLE_MAPS_API_KEY;
            delete process.env.GOOGLE_MAPS_API_KEY;

            try {
                await assert.rejects(
                    async () => {
                        await calculateRouteDistance(sampleCoords);
                    },
                    (err) => {
                        assert.equal(err.statusCode, 503);
                        assert.match(err.message, /unavailable/i);
                        return true;
                    }
                );
            } finally {
                process.env.GOOGLE_MAPS_API_KEY = originalKey;
            }
        });
    });

    await t.test('6. Checkout without deliveryZoneId is fully valid when coordinates are provided', () => {
        const payloadWithoutZone = {
            items: [
                {
                    menuItem: '507f1f77bcf86cd799439011',
                    variant: 'single',
                    quantity: 2,
                },
            ],
            orderType: 'delivery',
            paymentMethod: 'cod',
            deliveryAddress: {
                firstName: 'Mohan',
                lastName: 'Kumar',
                phone: '9876543210',
                email: 'mohan@example.com',
                address: 'Near Ram Janmabhoomi, Ayodhya',
                location: {
                    latitude: 26.792,
                    longitude: 82.172,
                    placeId: 'ChIJtestPlaceId',
                    formattedAddress: 'Near Ram Janmabhoomi, Ayodhya, Uttar Pradesh',
                    source: 'google_places',
                },
            },
        };

        const result = createOrderSchema.safeParse(payloadWithoutZone);
        assert.equal(result.success, true);
        assert.equal(result.data.deliveryZoneId, undefined);
        assert.equal(result.data.deliveryAddress.location.latitude, 26.792);
        assert.equal(result.data.deliveryAddress.location.longitude, 82.172);
    });
});

