import { Server as SocketServer } from 'socket.io';

export function setupNotifications(httpServer) {
  const io = new SocketServer(httpServer, {
    cors: {
      origin: process.env.NODE_ENV === 'development' 
        ? 'http://localhost:5173' 
        : '*',
      methods: ['GET', 'POST']
    }
  });

  // Store active connections
  const activeUsers = new Map();

  io.on('connection', (socket) => {
    console.log('Client connected');

    socket.on('authenticate', (userId) => {
      if (userId) {
        activeUsers.set(userId, socket.id);
        socket.userId = userId;
        
        // Join user-specific room
        socket.join(`user:${userId}`);
        
        // Broadcast user online status
        socket.broadcast.emit('userStatus', {
          userId,
          status: 'online'
        });
      }
    });

    socket.on('disconnect', () => {
      if (socket.userId) {
        activeUsers.delete(socket.userId);
        
        // Broadcast user offline status
        socket.broadcast.emit('userStatus', {
          userId: socket.userId,
          status: 'offline'
        });
      }
      console.log('Client disconnected');
    });
  });

  return io;
}

export function emitNotification(io, userId, notification) {
  io.to(`user:${userId}`).emit('notification', notification);
}

export function emitActivity(io, studentId, activity) {
  io.to(`user:${studentId}`).emit('activity', activity);
}