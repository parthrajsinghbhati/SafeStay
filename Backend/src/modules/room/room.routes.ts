import { Router } from 'express';
import { RoomController } from './room.controller.js';
import { authenticate, authorizeRoles } from '../../core/middleware/auth.js';

const router = Router();

// Public routes (or Student routes)
router.get('/', RoomController.getAllRooms);
router.get('/:id', RoomController.getRoomById);

// Protected routes (Admin / Warden only)
router.post('/', authenticate, authorizeRoles('ADMIN', 'WARDEN'), RoomController.createRoom);
router.put('/:id', authenticate, authorizeRoles('ADMIN', 'WARDEN'), RoomController.updateRoom);
router.delete('/:id', authenticate, authorizeRoles('ADMIN', 'WARDEN'), RoomController.deleteRoom);

export default router;
