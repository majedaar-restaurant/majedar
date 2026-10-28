import { Router } from 'express';
import {
    getAdminSettings,
    updateSettings,
    toggleShopStatus,
    toggleOverOrder,
    getDashboardStats,
} from '../controllers/settings.controller.js';
import { authenticateAdmin } from '../middleware/auth.middleware.js';
import { requireAdmin } from '../middleware/admin.middleware.js';

const router = Router();

// Protect all admin settings routes
router.use(authenticateAdmin, requireAdmin);

// Dashboard metrics in restaurant local timezone
router.get('/dashboard-stats', getDashboardStats);

// Settings management
router.get('/', getAdminSettings);
router.put('/', updateSettings);
router.post('/toggle-shop', toggleShopStatus);
router.post('/over-order', toggleOverOrder);

export default router;
