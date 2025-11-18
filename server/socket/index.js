const socketAuth = require('./middlewares/socketAuth');

module.exports = (io) => {
  // Apply authentication middleware
  io.use(socketAuth);

  const connectedUsers = new Map();
  const userSockets = new Map();

  io.on('connection', (socket) => {
    const userId = socket.user._id;
    
    // Store user connection
    if (!connectedUsers.has(userId)) {
      connectedUsers.set(userId, new Set());
    }
    connectedUsers.get(userId).add(socket.id);
    userSockets.set(socket.id, userId);

    // Send online status
    socket.emit('connection_success', { userId });
    io.emit('user_online', { userId });

    // Handle user presence
    socket.on('get_online_users', () => {
      const onlineUsers = Array.from(connectedUsers.keys());
      socket.emit('online_users', onlineUsers);
    });

    // Handle notifications
    socket.on('send_notification', (data) => {
      const { recipientId, notification } = data;
      const recipientSockets = connectedUsers.get(recipientId);
      if (recipientSockets) {
        recipientSockets.forEach(socketId => {
          io.to(socketId).emit('new_notification', {
            ...notification,
            senderId: userId
          });
        });
      }
    });

    // Handle live tutoring
    socket.on('join_room', (roomId) => {
      socket.join(roomId);
      socket.to(roomId).emit('user_joined', { userId });
    });

    socket.on('leave_room', (roomId) => {
      socket.leave(roomId);
      socket.to(roomId).emit('user_left', { userId });
    });

    socket.on('send_message', (data) => {
      const { roomId, message } = data;
      socket.to(roomId).emit('new_message', {
        ...message,
        senderId: userId
      });
    });

    // Handle WebRTC signaling
    socket.on('signal', (data) => {
      const { recipientId, signal } = data;
      const recipientSockets = connectedUsers.get(recipientId);
      if (recipientSockets) {
        recipientSockets.forEach(socketId => {
          io.to(socketId).emit('signal', {
            signal,
            senderId: userId
          });
        });
      }
    });

    // Handle typing indicators
    socket.on('typing_start', (data) => {
      const { roomId } = data;
      socket.to(roomId).emit('user_typing', { userId });
    });

    socket.on('typing_stop', (data) => {
      const { roomId } = data;
      socket.to(roomId).emit('user_stopped_typing', { userId });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      const userSockets = connectedUsers.get(userId);
      if (userSockets) {
        userSockets.delete(socket.id);
        if (userSockets.size === 0) {
          connectedUsers.delete(userId);
          io.emit('user_offline', { userId });
        }
      }
    });
  });

  // Utility functions for external use
  return {
    sendNotificationToUser: (userId, notification) => {
      const userSockets = connectedUsers.get(userId);
      if (userSockets) {
        userSockets.forEach(socketId => {
          io.to(socketId).emit('new_notification', notification);
        });
      }
    },
    
    broadcastToRoom: (roomId, event, data) => {
      io.to(roomId).emit(event, data);
    },
    
    isUserOnline: (userId) => {
      return connectedUsers.has(userId);
    }
  };
};