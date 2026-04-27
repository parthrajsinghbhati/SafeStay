import { Router } from 'express';
import { authenticate, authorizeRoles } from '../../core/middleware/auth.js';
import { PropertyController } from './property.controller.js';

const router = Router();

// Public list for students to explore properties
router.get('/', PropertyController.getPublicProperties);

// Owner/admin scoped endpoints
router.get('/owner', authenticate, authorizeRoles('OWNER', 'ADMIN'), PropertyController.getOwnerProperties);
router.get('/owner/:id', authenticate, authorizeRoles('OWNER', 'ADMIN'), PropertyController.getOwnerPropertyById);
router.post('/', authenticate, authorizeRoles('OWNER', 'ADMIN'), PropertyController.createProperty);
router.put('/:id', authenticate, authorizeRoles('OWNER', 'ADMIN'), PropertyController.updateProperty);
router.delete('/:id', authenticate, authorizeRoles('OWNER', 'ADMIN'), PropertyController.deleteProperty);

export default router;
