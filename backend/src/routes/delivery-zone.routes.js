import { Router } from 'express';
import {
    getPublicDeliveryZones,
    checkDeliveryDistance,
} from '../controllers/delivery-zone.controller.js';

const router = Router();

// GET /api/delivery-zones - Public endpoint to retrieve active delivery zones
router.get('/', getPublicDeliveryZones);

// Public route distance verification & fee calculation (7 km limit)
router.get('/check-distance', checkDeliveryDistance);
router.post('/check-distance', checkDeliveryDistance);

export default router;
