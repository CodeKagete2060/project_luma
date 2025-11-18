const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const User = require('../models/user');
const Resource = require('../models/Resource');
const Discussion = require('../models/Discussion');
const Assignment = require('../models/assignment');
const Session = require('../models/Session');

// Middleware to check admin role
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'Admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

// Apply admin check to all routes
router.use(auth, requireAdmin);

// Get analytics overview
router.get('/analytics', async (req, res) => {
  try {
    const [
      totalUsers,
      totalStudents,
      totalTutors,
      totalParents,
      totalResources,
      totalDiscussions,
      totalAssignments,
      totalSessions,
      recentUsers,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'Student' }),
      User.countDocuments({ role: 'Tutor' }),
      User.countDocuments({ role: 'Parent' }),
      Resource.countDocuments(),
      Discussion.countDocuments(),
      Assignment.countDocuments(),
      Session.countDocuments(),
      User.find().sort({ createdAt: -1 }).limit(10).select('username email role createdAt'),
    ]);

    // Get most active users (by assignments completed)
    const activeStudents = await Assignment.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: '$student', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
      { $unwind: '$user' },
      { $project: { username: '$user.username', email: '$user.email', completedCount: '$count' } },
    ]);

    // Get common subjects
    const commonSubjects = await Assignment.aggregate([
      { $group: { _id: '$subject', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    res.json({
      overview: {
        totalUsers,
        totalStudents,
        totalTutors,
        totalParents,
        totalResources,
        totalDiscussions,
        totalAssignments,
        totalSessions,
      },
      recentUsers,
      activeStudents,
      commonSubjects,
    });
  } catch (err) {
    console.error('Error fetching analytics:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all users with pagination
router.get('/users', async (req, res) => {
  try {
    const { page = 1, limit = 20, role, search } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const filter = {};
    if (role) filter.role = role;
    if (search) {
      filter.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await User.countDocuments(filter);

    res.json({
      users,
      total,
      page: Number(page),
      limit: Number(limit),
    });
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single user
router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user
router.patch('/users/:id', async (req, res) => {
  try {
    const { role, studentIds, parentIds, tutorIds } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (role) user.role = role;
    if (studentIds) user.studentIds = studentIds;
    if (parentIds) user.parentIds = parentIds;
    if (tutorIds) user.tutorIds = tutorIds;

    await user.save();

    res.json(user);
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete user
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all resources
router.get('/resources', async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const filter = {};
    if (search) {
      filter.title = { $regex: search, $options: 'i' };
    }

    const [resources, total] = await Promise.all([
      Resource.find(filter)
        .populate('uploadedBy', 'username email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Resource.countDocuments(filter),
    ]);

    res.json({
      resources,
      total,
      page: Number(page),
      limit: Number(limit),
    });
  } catch (err) {
    console.error('Error fetching resources:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete resource
router.delete('/resources/:id', async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    await Resource.findByIdAndDelete(req.params.id);
    res.json({ message: 'Resource deleted successfully' });
  } catch (err) {
    console.error('Error deleting resource:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get discussions (moderation)
router.get('/discussions', async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const filter = {};
    if (search) {
      filter.title = { $regex: search, $options: 'i' };
    }

    const [discussions, total] = await Promise.all([
      Discussion.find(filter)
        .populate('author', 'username email role')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Discussion.countDocuments(filter),
    ]);

    res.json({
      discussions,
      total,
      page: Number(page),
      limit: Number(limit),
    });
  } catch (err) {
    console.error('Error fetching discussions:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/discussions/:id', async (req, res) => {
  try {
    const discussion = await Discussion.findById(req.params.id);
    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }
    await Discussion.findByIdAndDelete(req.params.id);
    res.json({ message: 'Discussion removed successfully' });
  } catch (err) {
    console.error('Error deleting discussion:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
