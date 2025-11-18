const express = require('express');
const Notification = require('../models/notification');
const User = require('../models/user');
const auth = require('../middleware/authMiddleware');
const router = express.Router();
const { emitNotificationToUser } = require('../utils/notificationEmitter');

// Get notifications for a user
router.get('/:userId', auth, async (req, res) => {
  try {
    const notifications = await Notification.find({ 
      recipient: req.params.userId 
    })
    .sort({ createdAt: -1 })
    .limit(50);
    
    res.json(notifications);
  } catch (err) {
    console.error('Error fetching notifications:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark a notification as read
router.patch('/:notificationId/read', auth, async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.notificationId,
      { $set: { read: true } },
      { new: true }
    );
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    
    res.json(notification);
  } catch (err) {
    console.error('Error marking notification as read:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new notification (internal function)
async function createNotification(recipientId, type, title, message, relatedData = {}, io = null) {
  try {
    const notification = new Notification({
      recipient: recipientId,
      type,
      title,
      message,
      ...relatedData
    });
    
    await notification.save();
    
    // Emit real-time notification if Socket.io is available
    if (io) {
      io.to(`user-${recipientId}`).emit('notification', notification);
    } else {
      emitNotificationToUser(recipientId, notification);
    }
    
    return notification;
  } catch (err) {
    console.error('Error creating notification:', err);
    throw err;
  }
}

// Helper function to notify parent when student completes an assignment
async function notifyParentOfCompletion(studentId, assignmentTitle) {
  try {
    // Find the student
    const student = await User.findById(studentId);
    if (!student) return;

    // Find parent(s) linked to this student
    const parents = await User.find({
      role: 'parent',
      'studentIds': studentId
    });

    // Create notification for each parent
    const notifications = parents.map(parent => 
      createNotification(
        parent._id,
        'assignment_completed',
        'Assignment Completed',
        `${student.username} has completed the assignment: ${assignmentTitle}`,
        { relatedStudent: studentId }
      )
    );

    await Promise.all(notifications);
  } catch (err) {
    console.error('Error notifying parents:', err);
  }
}

// Helper function to notify about new milestone
async function notifyMilestoneAchieved(studentId, milestoneTitle) {
  try {
    // Find the student
    const student = await User.findById(studentId);
    if (!student) return;

    // Find parent(s) and tutor(s)
    const [parents, tutors] = await Promise.all([
      User.find({ role: 'parent', 'studentIds': studentId }),
      User.find({ role: 'tutor', 'studentIds': studentId })
    ]);

    // Create notifications for parents and tutors
    const notifications = [...parents, ...tutors].map(user => 
      createNotification(
        user._id,
        'milestone_achieved',
        'Learning Milestone Achieved',
        `${student.username} has achieved a new milestone: ${milestoneTitle}`,
        { relatedStudent: studentId }
      )
    );

    await Promise.all(notifications);
  } catch (err) {
    console.error('Error notifying about milestone:', err);
  }
}

module.exports = {
  router,
  createNotification,
  notifyParentOfCompletion,
  notifyMilestoneAchieved
};