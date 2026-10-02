import { Router } from 'express';
import {
    createRider,
    getRiders,
    getRiderById,
    updateRider,
    deleteRider,
} from '../controllers/rider.controller.js';
import { authenticateAdmin } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import {
    createRiderSchema,
    updateRiderSchema,
    riderIdParamSchema,
    riderQuerySchema,
} from '../validators/rider.validator.js';

const router = Router();

// All admin rider endpoints require admin authentication
router.use(authenticateAdmin);

router.post('/', validate(createRiderSchema), createRider);
router.get('/', validate(riderQuerySchema, 'query'), getRiders);
router.get('/:id', validate(riderIdParamSchema, 'params'), getRiderById);
router.patch(
    '/:id',
    validate(riderIdParamSchema, 'params'),
    validate(updateRiderSchema),
    updateRider
);
router.delete('/:id', validate(riderIdParamSchema, 'params'), deleteRider);

export default router;
