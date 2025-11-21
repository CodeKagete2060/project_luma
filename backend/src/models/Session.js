const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  tutorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  scheduledAt: { type: Date },
  sessionId: { type: String, unique: true },
  status: {
    type: String,
    enum: ['active', 'ended', 'archived'],
    default: 'active'
  },
  recordingUrl: { type: String },
  recordingFilename: { type: String },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  metadata: { type: Object }
}, { timestamps: true });

module.exports = mongoose.model('Session', sessionSchema);
