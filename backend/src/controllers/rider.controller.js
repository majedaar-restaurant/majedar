import * as riderService from '../services/rider/rider.service.js';
import { sendSuccess } from '../utils/response.js';

export const getRiders = async (req, res, next) => {
    try {
        const riders = await riderService.getAllRiders(req.query);
        return sendSuccess(res, {
            statusCode: 200,
            message: 'Riders retrieved successfully',
            data: { riders },
        });
    } catch (error) {
        next(error);
    }
};

export const getRiderById = async (req, res, next) => {
    try {
        const rider = await riderService.getRiderById(req.params.id);
        return sendSuccess(res, {
            statusCode: 200,
            message: 'Rider retrieved successfully',
            data: { rider },
        });
    } catch (error) {
        next(error);
    }
};

export const createRider = async (req, res, next) => {
    try {
        const rider = await riderService.createRider(req.body);
        return sendSuccess(res, {
            statusCode: 201,
            message: 'Rider created successfully',
            data: { rider },
        });
    } catch (error) {
        next(error);
    }
};

export const updateRider = async (req, res, next) => {
    try {
        const rider = await riderService.updateRider(req.params.id, req.body);
        return sendSuccess(res, {
            statusCode: 200,
            message: 'Rider updated successfully',
            data: { rider },
        });
    } catch (error) {
        next(error);
    }
};

export const deleteRider = async (req, res, next) => {
    try {
        const result = await riderService.deleteRider(req.params.id);
        return sendSuccess(res, {
            statusCode: 200,
            message: 'Rider deleted successfully',
            data: result,
        });
    } catch (error) {
        next(error);
    }
};
