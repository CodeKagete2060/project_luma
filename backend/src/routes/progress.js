const express = require('express');
const Progress = require('../models/progress');
const Assignment = require('../models/assignment');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

// Get progress for current user (student) or specific student
router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const studentId = req.query.studentId || userId;
    
    const progress = await Progress.findOne({ student: studentId })
      .populate('student', 'username email grade')
      .lean();
    
    if (!progress) {
      // Return default progress if none exists
      return res.json({
        student: studentId,
        metrics: {
          assignmentsCompleted: 0,
          averageScore: 0,
          totalTimeSpent: 0
        },
        weeklyProgress: [],
        milestones: [],
        completed: 0,
        pending: 0,
        score: 0
      });
    }
    
    // Calculate pending assignments count
    const Assignment = require('../models/assignment');
    const pendingCount = await Assignment.countDocuments({
      student: studentId,
      status: { $in: ['pending', 'in_progress'] }
    });
    
    res.json({
      ...progress,
      completed: progress.metrics.assignmentsCompleted || 0,
      pending: pendingCount,
      score: progress.metrics.averageScore || 0
    });
  } catch (err) {
    console.error('Error fetching progress:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get progress for a specific student (by ID)
router.get('/:studentId', auth, async (req, res) => {
  try {
    const progress = await Progress.findOne({ student: req.params.studentId })
      .populate('student', 'username email grade')
      .lean();
    
    if (!progress) {
      return res.status(404).json({ message: 'Progress not found' });
    }
    
    res.json(progress);
  } catch (err) {
    console.error('Error fetching progress:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update progress metrics (called when assignments are completed/updated)
router.post('/update/:studentId', auth, async (req, res) => {
  try {
    // Get all completed assignments for the student
    const assignments = await Assignment.find({
      student: req.params.studentId,
      status: 'completed'
    });

    // Calculate metrics
    const metrics = {
      assignmentsCompleted: assignments.length,
      averageScore: assignments.reduce((acc, curr) => acc + (curr.score || 0), 0) / assignments.length || 0,
      totalTimeSpent: assignments.reduce((acc, curr) => acc + (curr.timeSpent || 0), 0)
    };

    // Calculate weekly progress
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const recentAssignments = assignments.filter(a => 
      new Date(a.completedAt) >= oneWeekAgo
    );

    const weeklyProgress = {
      week: new Date(),
      assignmentsCompleted: recentAssignments.length,
      averageScore: recentAssignments.reduce((acc, curr) => acc + (curr.score || 0), 0) / recentAssignments.length || 0,
      timeSpent: recentAssignments.reduce((acc, curr) => acc + (curr.timeSpent || 0), 0)
    };

    // Update or create progress document
    const progress = await Progress.findOneAndUpdate(
      { student: req.params.studentId },
      {
        $set: { metrics },
        $push: { weeklyProgress },
        $currentDate: { lastUpdated: true }
      },
      { upsert: true, new: true }
    );

    res.json(progress);
  } catch (err) {
    console.error('Error updating progress:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a new milestone
router.post('/milestone/:studentId', auth, async (req, res) => {
  try {
    const { title, description } = req.body;
    
    const progress = await Progress.findOneAndUpdate(
      { student: req.params.studentId },
      {
        $push: {
          milestones: {
            title,
            description,
            achievedAt: new Date()
          }
        }
      },
      { new: true }
    );

    res.json(progress);
  } catch (err) {
    console.error('Error adding milestone:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;