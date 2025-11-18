require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 5000,
  mongoURI: process.env.MONGODB_URI || 'mongodb://localhost:27017/lumaDB',
  JWTSecret: process.env.JWTSECRET || ''
};