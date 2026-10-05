import {
    createZone,
    getActiveZones,
    getAllZonesAdmin,
    getZoneById,
    updateZone,
    deleteZone,
} from '../services/delivery-zone/delivery-zone.service.js';
import { sendSuccess } from '../utils/response.js';

export const createDeliveryZone = async (req, res, next) => {
    try {
        const zone = await createZone(req.body);
        return sendSuccess(res, {
            statusCode: 201,
            message: 'Delivery zone created successfully',
            data: { zone },
        });
    } catch (error) {
        next(error);
    }
};

export const getPublicDeliveryZones = async (req, res, next) => {
    try {
        const zones = await getActiveZones();
        return sendSuccess(res, {
            statusCode: 200,
            message: 'Active delivery zones retrieved successfully',
            data: { zones },
        });
    } catch (error) {
        next(error);
    }
};

export const getAdminDeliveryZones = async (req, res, next) => {
    try {
        const zones = await getAllZonesAdmin();
        return sendSuccess(res, {
            statusCode: 200,
            message: 'All delivery zones retrieved successfully',
            data: { zones },
        });
    } catch (error) {
        next(error);
    }
};

export const getAdminDeliveryZoneById = async (req, res, next) => {
    try {
        const zone = await getZoneById(req.params.id);
        return sendSuccess(res, {
            statusCode: 200,
            message: 'Delivery zone retrieved successfully',
            data: { zone },
        });
    } catch (error) {
        next(error);
    }
};

export const updateAdminDeliveryZone = async (req, res, next) => {
    try {
        const zone = await updateZone(req.params.id, req.body);
        return sendSuccess(res, {
            statusCode: 200,
            message: 'Delivery zone updated successfully',
            data: { zone },
        });
    } catch (error) {
        next(error);
    }
};

export const deleteAdminDeliveryZone = async (req, res, next) => {
    try {
        const result = await deleteZone(req.params.id);
        return sendSuccess(res, {
            statusCode: 200,
            message: result.message,
            data: result.zone ? { zone: result.zone, softDeleted: result.softDeleted } : undefined,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Public: Calculate Google driving-route distance from restaurant to customer coordinates
 * and verify delivery eligibility (7 km / 7,000 m limit).
 */
export const checkDeliveryDistance = async (req, res, next) => {
    try {
        const lat = req.method === 'GET' ? parseFloat(req.query.lat ?? req.query.latitude) : parseFloat(req.body.lat ?? req.body.latitude);
        const lng = req.method === 'GET' ? parseFloat(req.query.lng ?? req.query.longitude) : parseFloat(req.body.lng ?? req.body.longitude);

        if (isNaN(lat) || isNaN(lng)) {
            return res.status(400).json({
                success: false,
                message: 'Both latitude and longitude are required as numeric values',
            });
        }

        const { calculateRouteDistance } = await import('../services/delivery/distance.service.js');
        const result = await calculateRouteDistance(lat, lng);

        return sendSuccess(res, {
            statusCode: 200,
            message: result.isEligible ? 'Location is within delivery radius' : 'Location is beyond delivery radius',
            data: result,
        });
    } catch (error) {
        next(error);
    }
};
