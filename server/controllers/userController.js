const User = require('../models/user');

// Get children for parent
async function getParentChildren(req, res) {
  try {
    const parentId = req.params.parentId || req.user.id;
    const parent = await User.findById(parentId).lean();
    
    if (!parent) {
      return res.status(404).json({ message: 'Parent not found' });
    }

    // If parent has studentIds return those users, otherwise return empty array
    const children = parent.studentIds && parent.studentIds.length > 0
      ? await User.find({ _id: { $in: parent.studentIds } })
          .select('username email grade role subjects')
          .lean()
      : [];

    // Get progress for each child
    const Progress = require('../models/progress');
    const childrenWithProgress = await Promise.all(
      children.map(async (child) => {
        const progress = await Progress.findOne({ student: child._id }).lean();
        return {
          ...child,
          progress: progress ? {
            completed: progress.metrics?.assignmentsCompleted || 0,
            averageScore: progress.metrics?.averageScore || 0,
            totalTimeSpent: progress.metrics?.totalTimeSpent || 0,
          } : null,
        };
      })
    );

    res.json(childrenWithProgress);
  } catch (err) {
    console.error('Error fetching children:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

// Get students for tutor
async function getTutorStudents(req, res) {
  try {
    const tutorId = req.user.id;
    const tutor = await User.findById(tutorId).lean();
    
    if (!tutor) {
      return res.status(404).json({ message: 'Tutor not found' });
    }

    // If tutor has studentIds return those users, otherwise return empty array
    const students = tutor.studentIds && tutor.studentIds.length > 0
      ? await User.find({ _id: { $in: tutor.studentIds } })
          .select('username email grade role subjects')
          .lean()
      : [];

    // Get progress for each student
    const Progress = require('../models/progress');
    const studentsWithProgress = await Promise.all(
      students.map(async (student) => {
        const progress = await Progress.findOne({ student: student._id }).lean();
        const Assignment = require('../models/assignment');
        const pendingCount = await Assignment.countDocuments({
          student: student._id,
          status: { $in: ['pending', 'in_progress'] }
        });
        
        return {
          ...student,
          progress: progress ? {
            completed: progress.metrics?.assignmentsCompleted || 0,
            averageScore: progress.metrics?.averageScore || 0,
            totalTimeSpent: progress.metrics?.totalTimeSpent || 0,
            pending: pendingCount,
          } : { completed: 0, averageScore: 0, totalTimeSpent: 0, pending: 0 },
        };
      })
    );

    res.json(studentsWithProgress);
  } catch (err) {
    console.error('Error fetching students:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

// Link student to parent/tutor
async function linkStudent(req, res) {
  try {
    const { studentId, parentId, tutorId } = req.body;
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // If user is parent, link student
    if (user.role === 'Parent' && studentId) {
      if (!user.studentIds.includes(studentId)) {
        user.studentIds.push(studentId);
        await user.save();

        // Also update student's parentIds
        const student = await User.findById(studentId);
        if (student && !student.parentIds.includes(userId)) {
          student.parentIds.push(userId);
          await student.save();
        }
      }
      return res.json({ message: 'Student linked successfully' });
    }

    // If user is tutor, link student
    if (user.role === 'Tutor' && studentId) {
      if (!user.studentIds.includes(studentId)) {
        user.studentIds.push(studentId);
        await user.save();

        // Also update student's tutorIds
        const student = await User.findById(studentId);
        if (student && !student.tutorIds.includes(userId)) {
          student.tutorIds.push(userId);
          await student.save();
        }
      }
      return res.json({ message: 'Student linked successfully' });
    }

    res.status(400).json({ message: 'Invalid request' });
  } catch (err) {
    console.error('Error linking student:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = {
  getParentChildren,
  getTutorStudents,
  linkStudent,
};
