import api from './api';

export const NotificationTypes = {
  ASSIGNMENT: 'assignment',
  DISCUSSION: 'discussion',
  RESOURCE: 'resource',
  SESSION: 'session',
  SYSTEM: 'system',
  ACHIEVEMENT: 'achievement'
};

class NotificationService {
  static async create(recipientId, { title, message, type, data }) {
    try {
      const response = await api.post('/notifications', {
        recipientId,
        title,
        message,
        type,
        data
      });
      return response.data;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  // Assignment notifications
  static async assignmentCreated(recipientId, assignment) {
    return this.create(recipientId, {
      title: 'New Assignment',
      message: `You have a new assignment: ${assignment.title}`,
      type: NotificationTypes.ASSIGNMENT,
      data: { assignmentId: assignment._id }
    });
  }

  static async assignmentGraded(recipientId, assignment) {
    return this.create(recipientId, {
      title: 'Assignment Graded',
      message: `Your assignment "${assignment.title}" has been graded`,
      type: NotificationTypes.ASSIGNMENT,
      data: { assignmentId: assignment._id }
    });
  }

  // Discussion notifications
  static async newDiscussionReply(recipientId, discussion) {
    return this.create(recipientId, {
      title: 'New Reply',
      message: `Someone replied to your discussion: ${discussion.title}`,
      type: NotificationTypes.DISCUSSION,
      data: { discussionId: discussion._id }
    });
  }

  static async discussionMentioned(recipientId, discussion) {
    return this.create(recipientId, {
      title: 'Mentioned in Discussion',
      message: `You were mentioned in a discussion: ${discussion.title}`,
      type: NotificationTypes.DISCUSSION,
      data: { discussionId: discussion._id }
    });
  }

  // Resource notifications
  static async newResource(recipientId, resource) {
    return this.create(recipientId, {
      title: 'New Learning Resource',
      message: `A new resource has been added: ${resource.title}`,
      type: NotificationTypes.RESOURCE,
      data: { resourceId: resource._id }
    });
  }

  // Session notifications
  static async sessionScheduled(recipientId, session) {
    return this.create(recipientId, {
      title: 'New Tutoring Session',
      message: `A tutoring session has been scheduled for ${session.scheduledTime}`,
      type: NotificationTypes.SESSION,
      data: { sessionId: session._id }
    });
  }

  static async sessionReminder(recipientId, session) {
    return this.create(recipientId, {
      title: 'Session Reminder',
      message: `Your tutoring session starts in 15 minutes`,
      type: NotificationTypes.SESSION,
      data: { sessionId: session._id }
    });
  }

  // Achievement notifications
  static async achievementUnlocked(recipientId, achievement) {
    return this.create(recipientId, {
      title: 'Achievement Unlocked! 🎉',
      message: `Congratulations! You've earned: ${achievement.title}`,
      type: NotificationTypes.ACHIEVEMENT,
      data: { achievementId: achievement._id }
    });
  }

  // System notifications
  static async systemAnnouncement(recipientId, announcement) {
    return this.create(recipientId, {
      title: 'System Announcement',
      message: announcement,
      type: NotificationTypes.SYSTEM,
      data: {}
    });
  }
}

export default NotificationService;