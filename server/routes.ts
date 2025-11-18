import { Router } from 'express';
import { authController } from './controllers/authController';
import { assignmentController } from './controllers/assignmentController';
import { resourceController } from './controllers/resourceController';
import { discussionController } from './controllers/discussionController';
import { notificationController } from './controllers/notificationController';
import { aiController } from './controllers/aiController';
import { analyticsController } from './controllers/analyticsController';

const router = Router();

// Auth routes
router.use('/auth', authController);

// Assignment routes
router.use('/assignments', assignmentController);

// Resource routes
router.use('/resources', resourceController);

// Discussion routes
router.use('/discussions', discussionController);

// Notification routes
router.use('/notifications', notificationController);

// AI Assistant routes
router.use('/ai', aiController);

// Analytics routes
router.use('/analytics', analyticsController);

export default router;