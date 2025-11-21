const Assignment = require('../models/assignment');
const User = require('../models/user');
const Progress = require('../models/progress');
const { notifyParentOfCompletion } = require('../routes/notifications');

// Get all assignments for a student
async function getStudentAssignments(req, res) {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    let assignments;
    if (user.role === 'Student') {
      assignments = await Assignment.find({ student: userId })
        .populate('tutor', 'username email')
        .sort({ dueDate: 1 })
        .lean();
    } else if (user.role === 'Tutor') {
      assignments = await Assignment.find({ tutor: userId })
        .populate('student', 'username email grade')
        .sort({ dueDate: 1 })
        .lean();
    } else {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    res.json(assignments);
  } catch (err) {
    console.error('Error fetching assignments:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

// Create a new assignment (tutor only)
async function createAssignment(req, res) {
  try {
    const { title, description, dueDate, studentId } = req.body;
    const tutorId = req.user.id;
    
    if (!title || !description || !dueDate || !studentId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    const assignment = new Assignment({
      title,
      description,
      dueDate: new Date(dueDate),
      student: studentId,
      tutor: tutorId,
      status: 'pending'
    });
    
    await assignment.save();
    
    // Populate and return
    const populated = await Assignment.findById(assignment._id)
      .populate('student', 'username email')
      .populate('tutor', 'username email')
      .lean();
    
    res.status(201).json(populated);
  } catch (err) {
    console.error('Error creating assignment:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

// Update assignment status (submit, complete, etc.)
async function updateAssignment(req, res) {
  try {
    const { id } = req.params;
    const { status, score, feedback, timeSpent } = req.body;
    
    const assignment = await Assignment.findById(id);
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
    
    if (status) assignment.status = status;
    if (score !== undefined) assignment.score = score;
    if (feedback) assignment.feedback = feedback;
    if (timeSpent !== undefined) assignment.timeSpent = timeSpent;
    
    if (status === 'completed') {
      assignment.completedAt = new Date();
      await assignment.save();
      
      // Update progress
      await Progress.findOneAndUpdate(
        { student: assignment.student },
        { $inc: { 'metrics.assignmentsCompleted': 1 } },
        { upsert: true }
      );
      
      // Notify parents
      await notifyParentOfCompletion(assignment.student, assignment.title);
    }
    
    await assignment.save();
    
    const updated = await Assignment.findById(id)
      .populate('student', 'username email')
      .populate('tutor', 'username email')
      .lean();
    
    res.json(updated);
  } catch (err) {
    console.error('Error updating assignment:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

// Get assignment by ID
async function getAssignment(req, res) {
  try {
    const { id } = req.params;
    const assignment = await Assignment.findById(id)
      .populate('student', 'username email grade')
      .populate('tutor', 'username email')
      .lean();
    
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
    
    res.json(assignment);
  } catch (err) {
    console.error('Error fetching assignment:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = {
  getStudentAssignments,
  createAssignment,
  updateAssignment,
  getAssignment
};

