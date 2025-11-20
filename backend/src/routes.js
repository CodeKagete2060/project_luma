import { createServer } from "http";
import { setupSocket } from "./socket/notifications";
import { authenticate, requireRole } from "./middlewares/auth";
import { 
  requireModerator,
  requireTutorOrAdmin,
  validateThreadContent,
  validateReplyContent,
  validateReport
} from "./middlewares/forum";
import * as authController from "./controllers/authController";
import * as assignmentController from "./controllers/assignmentController";
import * as resourceController from "./controllers/resourceController";
import * as discussionController from "./controllers/discussionController";
import * as notificationController from "./controllers/notificationController";
import * as aiController from "./controllers/aiController";
import * as forumController from "./controllers/forumController";

export async function registerRoutes(app) {
  const httpServer = createServer(app);
  
  setupSocket(httpServer);

  // Auth Routes
  app.post('/api/auth/register', authController.registerValidation, authController.register);
  app.post('/api/auth/login', authController.loginValidation, authController.login);
  app.get('/api/auth/me', authenticate, authController.getMe);
  app.post('/api/auth/logout', authenticate, authController.logout);
  app.post('/api/auth/refresh-token', authController.refreshToken);

  app.get('/api/assignments', authenticate, assignmentController.getAssignments);
  app.post('/api/assignments', authenticate, requireRole('tutor', 'admin'), assignmentController.createAssignment);
  app.patch('/api/assignments/:id', authenticate, assignmentController.updateAssignment);
  app.get('/api/students/stats', authenticate, requireRole('student', 'parent'), assignmentController.getStudentStats);

  app.get('/api/resources', authenticate, resourceController.getResources);
  app.post('/api/resources', authenticate, requireRole('tutor', 'admin'), resourceController.createResource);
  app.get('/api/resources/:id', authenticate, resourceController.viewResource);
  app.post('/api/resources/:id/rate', authenticate, resourceController.rateResource);
  app.post('/api/resources/:id/toggle-like', authenticate, resourceController.toggleLike);

  // Forum Routes
  app.get('/api/forum/threads', authenticate, forumController.getThreads);
  app.get('/api/forum/threads/:id', authenticate, forumController.getThread);
  app.post('/api/forum/threads', authenticate, validateThreadContent, forumController.createThread);
  app.post('/api/forum/threads/:id/replies', authenticate, validateReplyContent, forumController.addReply);
  app.post('/api/forum/threads/:id/report', authenticate, validateReport, forumController.reportThread);
  app.post('/api/forum/threads/:id/moderate', authenticate, requireModerator, forumController.moderateThread);

  // Legacy Discussion Routes (to be removed)
  app.get('/api/discussions', authenticate, discussionController.getDiscussions);
  app.post('/api/discussions', authenticate, discussionController.createDiscussion);
  app.post('/api/discussions/:id/like', authenticate, discussionController.likeDiscussion);
  app.post('/api/discussions/:id/reply', authenticate, discussionController.replyToDiscussion);

  app.get('/api/notifications', authenticate, notificationController.getNotifications);
  app.patch('/api/notifications/:id/read', authenticate, notificationController.markAsRead);
  app.post('/api/notifications/read-all', authenticate, notificationController.markAllAsRead);

  app.post('/api/ai/chat', authenticate, aiController.chatWithAI);

  return httpServer;
}
