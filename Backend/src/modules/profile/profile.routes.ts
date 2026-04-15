import { Router } from 'express';
import { ProfileController } from './profile.controller.js';
import { authenticate } from '../../core/middleware/auth.js';

const router = Router();

// Ensure all profile routes require authentication
router.use(authenticate);

// We use `/me` instead of `/:id` since we rely on the JWT token userId (more secure)
router.get('/me', ProfileController.getMyProfile);
router.put('/me', ProfileController.updateMyProfile);

export default router;
