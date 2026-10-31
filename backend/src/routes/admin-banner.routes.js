import { Router } from 'express';
import {
    getAdminBanners,
    getAdminBannerById,
    createBanner,
    updateBanner,
    toggleBannerStatus,
    deleteBanner,
} from '../controllers/banner.controller.js';
import { authenticateAdmin } from '../middleware/auth.middleware.js';
import { requireAdmin } from '../middleware/admin.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import { uploadSingleImage } from '../middleware/upload.middleware.js';
import {
    createBannerSchema,
    updateBannerSchema,
    bannerIdParamSchema,
} from '../validators/banner.validator.js';

const router = Router();

router.use(authenticateAdmin, requireAdmin);

router.get('/', getAdminBanners);
router.post('/', uploadSingleImage('image'), validate(createBannerSchema, 'body'), createBanner);
router.get('/:id', validate(bannerIdParamSchema, 'params'), getAdminBannerById);
router.patch(
    '/:id',
    uploadSingleImage('image'),
    validate(bannerIdParamSchema, 'params'),
    validate(updateBannerSchema, 'body'),
    updateBanner
);
router.patch('/:id/toggle', validate(bannerIdParamSchema, 'params'), toggleBannerStatus);
router.delete('/:id', validate(bannerIdParamSchema, 'params'), deleteBanner);

export default router;

