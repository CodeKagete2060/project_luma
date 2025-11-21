const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const authRoutes = require('./routes/auth.js');
const progressRoutes = require('./routes/progress.js');
const notificationsModule = require('./routes/notifications.js');
const userRoutes = require('./routes/userRoutes.js');
const learningRoutes = require('./routes/learning.js');
const sessionsRoutes = require('./routes/sessions.js');
const assignmentsRoutes = require('./routes/assignments.js');
const liveRoutes = require('./routes/live.js');
const discussionsRoutes = require('./routes/discussions.js');
const adminRoutes = require('./routes/admin.js');
const searchRoutes = require('./routes/search.js');
const path = require('path');
const { validateEnv } = require('./utils/validateEnv');
const { setNotificationEmitter } = require('./utils/notificationEmitter');

dotenv.config();
validateEnv();
const app = express();
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${req.method}] ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
  });
  next();
});

// Make io available to routes
app.set('io', io);

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/notifications", notificationsModule.router || notificationsModule);
app.use("/api/users", userRoutes);
app.use("/api/assignments", assignmentsRoutes);
app.use("/api/live", liveRoutes);
app.use("/api/discussions", discussionsRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/search", searchRoutes);

// serve uploaded files statically (local storage). In production replace with S3/Cloud fronted URLs.
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Learning & Sessions
app.use('/api/learning', learningRoutes);
app.use('/api/sessions', sessionsRoutes);

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  socket.on('join-room', (userId) => {
    socket.join(`user-${userId}`);
    console.log(`User ${userId} joined their room`);
  });

  socket.on('join-session-room', ({ sessionId, user }) => {
    if (!sessionId) return;
    socket.join(`session-${sessionId}`);
    io.to(`session-${sessionId}`).emit('session-message', {
      sessionId,
      system: true,
      message: `${user?.name || 'Someone'} joined the room.`,
      timestamp: Date.now()
    });
  });

  socket.on('session-message', ({ sessionId, message, user }) => {
    if (!sessionId || !message) return;
    io.to(`session-${sessionId}`).emit('session-message', {
      sessionId,
      message,
      user,
      timestamp: Date.now()
    });
  });
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Helper function to emit notifications
const emitNotification = (userId, notification) => {
  io.to(`user-${userId}`).emit('notification', notification);
};

// Make emitNotification available globally
app.set('emitNotification', emitNotification);
setNotificationEmitter(emitNotification);

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const BASE_PORT = Number(process.env.PORT) || 5000;

    const attemptListen = (port, attempts = 0) => {
      const maxAttempts = 5;
      const targetPort = port + attempts;

      const listener = server.listen(targetPort, () => {
        console.log(`Server running on port ${targetPort}`);
      });

      listener.on('error', (err) => {
        if (err.code === 'EADDRINUSE' && attempts < maxAttempts) {
          console.warn(`Port ${targetPort} in use, trying ${targetPort + 1}...`);
          attemptListen(port, attempts + 1);
        } else {
          console.error(`Failed to bind server: ${err.message}`);
          process.exit(1);
        }
      });
    };

    attemptListen(BASE_PORT);
  } catch (err) {
    console.error('Server startup error:', err);
    process.exit(1);
  }
};

startServer();
