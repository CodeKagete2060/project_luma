import Assignment from '../models/Assignment.js';
import { emitNotification } from '../socket/notifications.js';

export const assignmentController = {
  // Get all assignments
  getAssignments: async (req, res) => {
    try {
      const assignments = await Assignment.find()
        .populate('studentId', 'username profile.name')
        .sort({ dueDate: 1 });
      res.json(assignments);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Create new assignment
  createAssignment: async (req, res) => {
    try {
      const { title, description, dueDate, studentId } = req.body;
      
      const assignment = new Assignment({
        title,
        description,
        dueDate,
        studentId,
        status: 'pending'
      });

      const savedAssignment = await assignment.save();
      
      // Emit notification to student
      emitNotification(req.io, studentId, {
        type: 'NEW_ASSIGNMENT',
        message: `New assignment: ${title}`,
        data: savedAssignment
      });

      res.status(201).json(savedAssignment);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Update assignment status
  updateAssignment: async (req, res) => {
    try {
      const { id } = req.params;
      const { status, submission } = req.body;

      const assignment = await Assignment.findByIdAndUpdate(
        id,
        { status, submission, updatedAt: new Date() },
        { new: true }
      );

      if (!assignment) {
        return res.status(404).json({ message: 'Assignment not found' });
      }

      // Emit notification about status change
      emitNotification(req.io, assignment.studentId, {
        type: 'ASSIGNMENT_UPDATE',
        message: `Assignment "${assignment.title}" status updated to ${status}`,
        data: assignment
      });

      res.json(assignment);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Delete assignment
  deleteAssignment: async (req, res) => {
    try {
      const { id } = req.params;
      const assignment = await Assignment.findByIdAndDelete(id);
      
      if (!assignment) {
        return res.status(404).json({ message: 'Assignment not found' });
      }

      res.json({ message: 'Assignment deleted' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};