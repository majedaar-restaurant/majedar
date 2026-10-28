import { Router } from 'express';
import { getPublicSettings } from '../controllers/settings.controller.js';

const router = Router();

// Public: Get current shop status, timings, announcement, chef & owner info
router.get('/', getPublicSettings);

export default router;
