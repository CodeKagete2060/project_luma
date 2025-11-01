const express = require('express');
const router = express.Router();
const NotificationController = require('../controllers/notificationController');
const { protect } = require('../middlewares/auth');

// Protect all notification routes
router.use(protect);

// Get notifications for current user
router.get('/', NotificationController.getForUser);

// Get unread notification count
router.get('/unread/count', NotificationController.getUnreadCount);

// Create a new notification
router.post('/', NotificationController.create);

// Mark notification as read
router.patch('/:id/read', NotificationController.markAsRead);

// Mark all notifications as read
router.patch('/read/all', NotificationController.markAllAsRead);

// Delete a notification
router.delete('/:id', NotificationController.delete);

module.exports = router;