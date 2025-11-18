const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const Assignment = require('../models/assignment');
const User = require('../models/user');
const { createNotification } = require('./notifications');
const Progress = require('../models/progress');

async function recalcStudentProgress(studentId) {
  if (!studentId) return;
  const assignments = await Assignment.find({ student: studentId }).lean();
  if (!assignments) return;

  const completedAssignments = assignments.filter(a => a.status === 'completed');
  const metrics = {
    assignmentsCompleted: completedAssignments.length,
    averageScore:
      completedAssignments.reduce((acc, curr) => acc + (curr.score || 0), 0) /
        (completedAssignments.length || 1),
    totalTimeSpent: completedAssignments.reduce((acc, curr) => acc + (curr.timeSpent || 0), 0),
  };
  if (!completedAssignments.length) {
    metrics.averageScore = 0;
  }

  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const recent = completedAssignments.filter(
    (a) => a.completedAt && new Date(a.completedAt) >= oneWeekAgo
  );
  const weeklyEntry = {
    week: new Date(),
    assignmentsCompleted: recent.length,
    averageScore:
      recent.reduce((acc, curr) => acc + (curr.score || 0), 0) / (recent.length || 1),
    timeSpent: recent.reduce((acc, curr) => acc + (curr.timeSpent || 0), 0),
  };
  if (!recent.length) {
    weeklyEntry.averageScore = 0;
  }

  await Progress.findOneAndUpdate(
    { student: studentId },
    {
      $set: { metrics },
      ...(recent.length
        ? {
            $push: {
              weeklyProgress: {
                $each: [weeklyEntry],
                $slice: -8,
              },
            },
          }
        : {}),
      $currentDate: { lastUpdated: true },
    },
    { upsert: true }
  );
}

// Get all assignments for a student
router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let assignments;
    if (user.role === 'Student') {
      assignments = await Assignment.find({ student: userId })
        .populate('tutor', 'username email')
        .sort({ dueDate: 1 });
    } else if (user.role === 'Tutor') {
      assignments = await Assignment.find({ tutor: userId })
        .populate('student', 'username email grade')
        .sort({ createdAt: -1 });
    } else {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(assignments);
  } catch (err) {
    console.error('Error fetching assignments:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single assignment
router.get('/:id', auth, async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id)
      .populate('student', 'username email grade')
      .populate('tutor', 'username email');
    
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // Check access
    const userId = req.user.id;
    if (assignment.student._id.toString() !== userId && assignment.tutor._id.toString() !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(assignment);
  } catch (err) {
    console.error('Error fetching assignment:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create assignment (Tutor only)
router.post('/', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    
    if (user.role !== 'Tutor') {
      return res.status(403).json({ message: 'Only tutors can create assignments' });
    }

    const { title, description, dueDate, studentId } = req.body;

    if (!title || !description || !dueDate || !studentId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const assignment = new Assignment({
      title,
      description,
      dueDate: new Date(dueDate),
      student: studentId,
      tutor: userId,
      status: 'pending'
    });

    await assignment.save();
    
    // Notify student
    const io = req.app.get('io');
    if (io) {
      io.to(`user-${studentId}`).emit('notification', {
        type: 'new_assignment',
        title: 'New Assignment',
        message: `You have a new assignment: ${title}`,
        assignmentId: assignment._id
      });
    }

    // Create notification in DB
    try {
      await createNotification(
        studentId,
        'new_assignment',
        'New Assignment',
        `You have a new assignment: ${title}`,
        { relatedAssignment: assignment._id }
      );
    } catch (notifErr) {
      console.error('Error creating notification:', notifErr);
    }

    res.status(201).json(assignment);
  } catch (err) {
    console.error('Error creating assignment:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update assignment status (Student)
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const assignment = await Assignment.findById(req.params.id);
    
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    if (assignment.student.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    assignment.status = status;
    if (status === 'completed') {
      assignment.completedAt = new Date();
    }
    await assignment.save();
    await recalcStudentProgress(assignment.student);

    // Notify parent and tutor
    const { notifyParentOfCompletion } = require('./notifications');
    if (status === 'completed') {
      await notifyParentOfCompletion(assignment.student, assignment.title);
    }

    res.json(assignment);
  } catch (err) {
    console.error('Error updating assignment:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Submit assignment (Student)
router.post('/:id/submit', auth, async (req, res) => {
  try {
    const { submission, timeSpent } = req.body;
    const assignment = await Assignment.findById(req.params.id);
    
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    if (assignment.student.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    assignment.status = 'completed';
    assignment.completedAt = new Date();
    if (timeSpent) assignment.timeSpent = timeSpent;
    if (submission) assignment.submission = submission;

    await assignment.save();
    await recalcStudentProgress(assignment.student);

    // Notify parent
    const { notifyParentOfCompletion } = require('./notifications');
    await notifyParentOfCompletion(assignment.student, assignment.title);

    res.json(assignment);
  } catch (err) {
    console.error('Error submitting assignment:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Grade assignment (Tutor)
router.patch('/:id/grade', auth, async (req, res) => {
  try {
    const { score, feedback } = req.body;
    const assignment = await Assignment.findById(req.params.id);
    
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    if (assignment.tutor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    assignment.score = score;
    assignment.feedback = feedback;
    await assignment.save();
    await recalcStudentProgress(assignment.student);

    // Update progress
    const Progress = require('../models/progress');
    const progressUpdate = await Progress.findOne({ student: assignment.student });
    if (progressUpdate) {
      // Trigger progress update
      const progressRoutes = require('./progress');
      // This will be handled by the progress update endpoint
    }

    // Notify student
    const io = req.app.get('io');
    if (io) {
      io.to(`user-${assignment.student}`).emit('notification', {
        type: 'tutor_feedback',
        title: 'Assignment Graded',
        message: `Your assignment "${assignment.title}" has been graded`,
        assignmentId: assignment._id
      });
    }

    res.json(assignment);
  } catch (err) {
    console.error('Error grading assignment:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
