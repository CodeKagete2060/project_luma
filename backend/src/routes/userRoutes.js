const express = require('express');
const auth = require('../middleware/authMiddleware');
const router = express.Router();
const { getTutorStudents, getParentChildren, linkStudent } = require('../controllers/userController');

// Get children for parent (uses authenticated user)
router.get('/children', auth, getParentChildren);

// Get students for tutor (uses authenticated user)
router.get('/tutor/students', auth, getTutorStudents);

// Link student to parent/tutor
router.post('/link-student', auth, linkStudent);

// Legacy route for backward compatibility
router.get('/:parentId/children', auth, getParentChildren);

module.exports = router;

