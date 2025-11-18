const Discussion = require('../models/Discussion');
const User = require('../models/user');

// Get all discussions with pagination and filtering
async function getDiscussions(req, res) {
  try {
    const { page = 1, limit = 20, subject, tag, search } = req.query;
    const filter = {};
    
    if (subject) filter.subject = subject;
    if (tag) filter.tags = tag;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }
    
    const skip = (Number(page) - 1) * Number(limit);
    const discussions = await Discussion.find(filter)
      .populate('author', 'username email role')
      .populate('upvotes', 'username')
      .populate('replies.author', 'username email role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean();
    
    const total = await Discussion.countDocuments(filter);
    
    res.json({
      discussions,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit))
    });
  } catch (err) {
    console.error('Error fetching discussions:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

// Get single discussion
async function getDiscussion(req, res) {
  try {
    const { id } = req.params;
    const discussion = await Discussion.findById(id)
      .populate('author', 'username email role')
      .populate('upvotes', 'username')
      .populate('replies.author', 'username email role')
      .populate('replies.upvotes', 'username')
      .lean();
    
    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }
    
    res.json(discussion);
  } catch (err) {
    console.error('Error fetching discussion:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

// Create new discussion
async function createDiscussion(req, res) {
  try {
    const { title, content, subject, tags } = req.body;
    const authorId = req.user.id;
    
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }
    
    const discussion = new Discussion({
      title,
      content,
      author: authorId,
      subject: subject || 'General',
      tags: tags ? (Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim())) : []
    });
    
    await discussion.save();
    
    const populated = await Discussion.findById(discussion._id)
      .populate('author', 'username email role')
      .lean();
    
    res.status(201).json(populated);
  } catch (err) {
    console.error('Error creating discussion:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

// Add reply to discussion
async function addReply(req, res) {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const authorId = req.user.id;
    
    if (!content) {
      return res.status(400).json({ message: 'Reply content is required' });
    }
    
    const discussion = await Discussion.findById(id);
    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }
    
    discussion.replies.push({
      author: authorId,
      content
    });
    
    await discussion.save();
    
    const updated = await Discussion.findById(id)
      .populate('author', 'username email role')
      .populate('replies.author', 'username email role')
      .lean();
    
    res.json(updated);
  } catch (err) {
    console.error('Error adding reply:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

// Upvote discussion or reply
async function upvote(req, res) {
  try {
    const { id } = req.params;
    const { replyId } = req.query;
    const userId = req.user.id;
    
    const discussion = await Discussion.findById(id);
    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }
    
    if (replyId) {
      // Upvote reply
      const reply = discussion.replies.id(replyId);
      if (!reply) {
        return res.status(404).json({ message: 'Reply not found' });
      }
      
      const index = reply.upvotes.indexOf(userId);
      if (index > -1) {
        reply.upvotes.splice(index, 1);
      } else {
        reply.upvotes.push(userId);
      }
    } else {
      // Upvote discussion
      const index = discussion.upvotes.indexOf(userId);
      if (index > -1) {
        discussion.upvotes.splice(index, 1);
      } else {
        discussion.upvotes.push(userId);
      }
    }
    
    await discussion.save();
    
    const updated = await Discussion.findById(id)
      .populate('author', 'username email role')
      .populate('upvotes', 'username')
      .populate('replies.author', 'username email role')
      .populate('replies.upvotes', 'username')
      .lean();
    
    res.json(updated);
  } catch (err) {
    console.error('Error upvoting:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

// Mark discussion as resolved
async function markResolved(req, res) {
  try {
    const { id } = req.params;
    const discussion = await Discussion.findById(id);
    
    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }
    
    // Only author or admin can mark as resolved
    if (discussion.author.toString() !== req.user.id && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    discussion.isResolved = !discussion.isResolved;
    await discussion.save();
    
    res.json(discussion);
  } catch (err) {
    console.error('Error marking resolved:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = {
  getDiscussions,
  getDiscussion,
  createDiscussion,
  addReply,
  upvote,
  markResolved
};

