const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const Discussion = require('../models/Discussion');

// Get all discussions with pagination and search
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 20, q, subject, sort = 'newest' } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    
    const filter = {};
    if (q) {
      filter.$text = { $search: q };
    }
    if (subject) {
      filter.subject = subject;
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'popular') {
      sortOption = { upvotes: -1, createdAt: -1 };
    } else if (sort === 'recent') {
      sortOption = { createdAt: -1 };
    }

    const discussions = await Discussion.find(filter)
      .populate('author', 'username role')
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit))
      .lean();

    // Add upvote count
    const discussionsWithCounts = discussions.map(d => {
      const upvotes = d.upvotes || [];
      const replies = d.replies || [];
      return {
        ...d,
        upvoteCount: upvotes.length,
        replyCount: replies.length,
        isUpvoted: upvotes.some(id => String(id) === req.user.id),
      };
    });

    const total = await Discussion.countDocuments(filter);

    res.json({
      discussions: discussionsWithCounts,
      total,
      page: Number(page),
      limit: Number(limit),
    });
  } catch (err) {
    console.error('Error fetching discussions:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single discussion
router.get('/:id', auth, async (req, res) => {
  try {
    const discussion = await Discussion.findById(req.params.id)
      .populate('author', 'username role')
      .populate('replies.author', 'username role')
      .populate('upvotes', 'username')
      .lean();

    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }

    const upvotes = discussion.upvotes || [];
    discussion.upvoteCount = upvotes.length;
    discussion.replyCount = discussion.replies?.length || 0;
    discussion.isUpvoted = upvotes.some(id => id._id ? String(id._id) === req.user.id : String(id) === req.user.id);
    discussion.replies = (discussion.replies || []).map(reply => ({
      ...reply,
      upvoteCount: reply.upvotes?.length || 0,
      isUpvoted: (reply.upvotes || []).some(id => String(id) === req.user.id),
    }));

    res.json(discussion);
  } catch (err) {
    console.error('Error fetching discussion:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create discussion
router.post('/', auth, async (req, res) => {
  try {
    const { title, content, subject, tags } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    const discussion = new Discussion({
      title,
      content,
      subject: subject || 'General',
      tags: tags || [],
      author: req.user.id,
    });

    await discussion.save();
    await discussion.populate('author', 'username role');

    res.status(201).json(discussion);
  } catch (err) {
    console.error('Error creating discussion:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add reply to discussion
router.post('/:id/replies', auth, async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: 'Content is required' });
    }

    const discussion = await Discussion.findById(req.params.id);
    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }

    discussion.replies.push({
      author: req.user.id,
      content,
    });

    await discussion.save();
    await discussion.populate('replies.author', 'username role');

    res.json(discussion);
  } catch (err) {
    console.error('Error adding reply:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Upvote discussion
router.post('/:id/upvote', auth, async (req, res) => {
  try {
    const discussion = await Discussion.findById(req.params.id);
    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }

    const userId = req.user.id;
    const upvoteIndex = discussion.upvotes.indexOf(userId);

    if (upvoteIndex > -1) {
      // Remove upvote
      discussion.upvotes.splice(upvoteIndex, 1);
    } else {
      // Add upvote
      discussion.upvotes.push(userId);
    }

    await discussion.save();

    res.json({
      upvoteCount: discussion.upvotes.length,
      isUpvoted: discussion.upvotes.includes(userId),
    });
  } catch (err) {
    console.error('Error upvoting discussion:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Upvote reply
router.post('/:id/replies/:replyId/upvote', auth, async (req, res) => {
  try {
    const discussion = await Discussion.findById(req.params.id);
    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }

    const reply = discussion.replies.id(req.params.replyId);
    if (!reply) {
      return res.status(404).json({ message: 'Reply not found' });
    }

    const userId = req.user.id;
    const upvoteIndex = reply.upvotes.indexOf(userId);

    if (upvoteIndex > -1) {
      reply.upvotes.splice(upvoteIndex, 1);
    } else {
      reply.upvotes.push(userId);
    }

    await discussion.save();

    res.json({
      upvoteCount: reply.upvotes.length,
      isUpvoted: reply.upvotes.includes(userId),
    });
  } catch (err) {
    console.error('Error upvoting reply:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark discussion as resolved
router.patch('/:id/resolve', auth, async (req, res) => {
  try {
    const discussion = await Discussion.findById(req.params.id);
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
    console.error('Error resolving discussion:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
