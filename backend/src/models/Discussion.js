const mongoose = require('mongoose');

const discussionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  subject: {
    type: String,
    enum: ['Math', 'Science', 'English', 'History', 'Art', 'Music', 'Physical Education', 'Other', 'General'],
    default: 'General',
  },
  tags: [String],
  upvotes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  replies: [{
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    upvotes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }],
  isResolved: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

// Index for search
discussionSchema.index({ title: 'text', content: 'text', tags: 'text' });

const Discussion = mongoose.model('Discussion', discussionSchema);

module.exports = Discussion;
