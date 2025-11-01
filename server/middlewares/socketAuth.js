const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (socket, next) => {
  try {
    const token = socket.handshake.auth.token || socket.handshake.headers.authorization;
    
    if (!token) {
      return next(new Error('Authentication error: Token not provided'));
    }

    // Verify token
    const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
    
    // Get user
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return next(new Error('Authentication error: User not found'));
    }

    // Attach user to socket
    socket.user = user;
    next();
  } catch (error) {
    return next(new Error('Authentication error: Invalid token'));
  }
};