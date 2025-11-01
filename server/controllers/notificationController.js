import Notification from '../models/Notification.js';
import { emitNotification } from '../socket/notifications.js';

export const notificationController = {
  async getNotifications(req, res) {
    try {
      const userId = req.user.id;
      const notifications = await Notification.find({ userId })
        .sort({ createdAt: -1 })
        .limit(50);
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async markAsRead(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const notification = await Notification.findOneAndUpdate(
        { _id: id, userId },
        { read: true },
        { new: true }
      );

      if (!notification) {
        return res.status(404).json({ message: 'Notification not found' });
      }

      res.json(notification);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  async markAllAsRead(req, res) {
    try {
      const userId = req.user.id;
      await Notification.updateMany(
        { userId, read: false },
        { read: true }
      );

      res.json({ message: 'All notifications marked as read' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async deleteNotification(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const notification = await Notification.findOneAndDelete({
        _id: id,
        userId
      });

      if (!notification) {
        return res.status(404).json({ message: 'Notification not found' });
      }

      res.json({ message: 'Notification deleted' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async createNotification(req, res) {
    try {
      const { userId, type, title, message, link, metadata } = req.body;

      const notification = new Notification({
        userId,
        type,
        title,
        message,
        link,
        metadata
      });

      const savedNotification = await notification.save();

      // Emit real-time notification
      emitNotification(req.io, userId, savedNotification);

      res.status(201).json(savedNotification);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
};