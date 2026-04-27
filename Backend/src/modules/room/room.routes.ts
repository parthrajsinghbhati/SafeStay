import { Router } from 'express';
import { RoomController } from './room.controller.js';
import { authenticate, authorizeRoles } from '../../core/middleware/auth.js';

const router = Router();

// Public routes (or Student routes)
router.get('/', RoomController.getAllRooms);
router.get('/:id', RoomController.getRoomById);

// Protected routes (Admin / Owner only)
router.post('/', authenticate, authorizeRoles('ADMIN', 'OWNER'), RoomController.createRoom);
router.put('/:id', authenticate, authorizeRoles('ADMIN', 'OWNER'), RoomController.updateRoom);
router.delete('/:id', authenticate, authorizeRoles('ADMIN', 'OWNER'), RoomController.deleteRoom);

export default router;
