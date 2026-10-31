import * as bannerService from '../services/banner/banner.service.js';
import { sendSuccess } from '../utils/response.js';

/**
 * Public: Get active promotional banners.
 */
export const getActiveBanners = async (req, res, next) => {
    try {
        const banners = await bannerService.getActiveBanners();
        return sendSuccess(res, {
            statusCode: 200,
            message: 'Active banners retrieved successfully',
            data: { banners },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Admin: Get all promotional banners.
 */
export const getAdminBanners = async (req, res, next) => {
    try {
        const banners = await bannerService.getAdminBanners();
        return sendSuccess(res, {
            statusCode: 200,
            message: 'All banners retrieved successfully',
            data: { banners },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Admin: Get single banner by ID.
 */
export const getAdminBannerById = async (req, res, next) => {
    try {
        const banner = await bannerService.getBannerById(req.params.id);
        return sendSuccess(res, {
            statusCode: 200,
            message: 'Banner details retrieved',
            data: { banner },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Admin: Create promotional banner (with image upload).
 */
export const createBanner = async (req, res, next) => {
    try {
        const imageBuffer = req.file?.buffer;
        const banner = await bannerService.createBanner(req.body, imageBuffer);
        return sendSuccess(res, {
            statusCode: 201,
            message: 'Promotional banner created successfully',
            data: { banner },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Admin: Update promotional banner (optional image replace).
 */
export const updateBanner = async (req, res, next) => {
    try {
        const imageBuffer = req.file?.buffer || null;
        const banner = await bannerService.updateBanner(req.params.id, req.body, imageBuffer);
        return sendSuccess(res, {
            statusCode: 200,
            message: 'Promotional banner updated successfully',
            data: { banner },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Admin: Toggle banner active state.
 */
export const toggleBannerStatus = async (req, res, next) => {
    try {
        const banner = await bannerService.toggleBannerStatus(req.params.id);
        return sendSuccess(res, {
            statusCode: 200,
            message: `Banner is now ${banner.isActive ? 'active' : 'inactive'}`,
            data: { banner },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Admin: Delete promotional banner.
 */
export const deleteBanner = async (req, res, next) => {
    try {
        const banner = await bannerService.deleteBanner(req.params.id);
        return sendSuccess(res, {
            statusCode: 200,
            message: 'Promotional banner deleted successfully',
            data: { banner },
        });
    } catch (error) {
        next(error);
    }
};

