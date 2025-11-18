const User = require('../models/user');
const Resource = require('../models/Resource');
const Discussion = require('../models/Discussion');
const Assignment = require('../models/assignment');
const Session = require('../models/Session');
const Progress = require('../models/progress');

// Get dashboard analytics
async function getAnalytics(req, res) {
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
      activeUsers
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'Student' }),
      User.countDocuments({ role: 'Tutor' }),
      User.countDocuments({ role: 'Parent' }),
      Resource.countDocuments(),
      Discussion.countDocuments(),
      Assignment.countDocuments(),
      Session.countDocuments(),
      User.countDocuments({ updatedAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } })
    ]);
    
    // Get most active users
    const mostActiveUsers = await User.find()
      .sort({ updatedAt: -1 })
      .limit(10)
      .select('username email role createdAt')
      .lean();
    
    // Get common subjects/topics
    const resourcesBySubject = await Resource.aggregate([
      { $group: { _id: '$subject', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);
    
    const discussionsBySubject = await Discussion.aggregate([
      { $group: { _id: '$subject', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);
    
    res.json({
      users: {
        total: totalUsers,
        students: totalStudents,
        tutors: totalTutors,
        parents: totalParents,
        active: activeUsers
      },
      content: {
        resources: totalResources,
        discussions: totalDiscussions,
        assignments: totalAssignments,
        sessions: totalSessions
      },
      mostActiveUsers,
      popularSubjects: {
        resources: resourcesBySubject,
        discussions: discussionsBySubject
      }
    });
  } catch (err) {
    console.error('Error fetching analytics:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

// Get all users with pagination
async function getUsers(req, res) {
  try {
    const { page = 1, limit = 20, role, search } = req.query;
    const filter = {};
    
    if (role) filter.role = role;
    if (search) {
      filter.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    const skip = (Number(page) - 1) * Number(limit);
    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean();
    
    const total = await User.countDocuments(filter);
    
    res.json({
      users,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit))
    });
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

// Update user (role, status, etc.)
async function updateUser(req, res) {
  try {
    const { id } = req.params;
    const { role, studentIds, parentIds, tutorIds } = req.body;
    
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (role) user.role = role;
    if (studentIds) user.studentIds = studentIds;
    if (parentIds) user.parentIds = parentIds;
    if (tutorIds) user.tutorIds = tutorIds;
    
    await user.save();
    
    const updated = await User.findById(id).select('-password').lean();
    res.json(updated);
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

// Delete user
async function deleteUser(req, res) {
  try {
    const { id } = req.params;
    
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    await User.findByIdAndDelete(id);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

// Get all resources for management
async function getResources(req, res) {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const filter = {};
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } }
      ];
    }
    
    const skip = (Number(page) - 1) * Number(limit);
    const resources = await Resource.find(filter)
      .populate('uploadedBy', 'username email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean();
    
    const total = await Resource.countDocuments(filter);
    
    res.json({
      resources,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit))
    });
  } catch (err) {
    console.error('Error fetching resources:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

// Delete resource
async function deleteResource(req, res) {
  try {
    const { id } = req.params;
    
    const resource = await Resource.findById(id);
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    
    await Resource.findByIdAndDelete(id);
    res.json({ message: 'Resource deleted successfully' });
  } catch (err) {
    console.error('Error deleting resource:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = {
  getAnalytics,
  getUsers,
  updateUser,
  deleteUser,
  getResources,
  deleteResource
};

