import { Router } from 'express';
import { getActiveBanners } from '../controllers/banner.controller.js';

const router = Router();

// Public: Get all active banners for customer side
router.get('/', getActiveBanners);

export default router;

