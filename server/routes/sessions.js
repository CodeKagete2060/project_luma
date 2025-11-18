const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { createSession, uploadRecording } = require('../controllers/sessionsController');

const { listSessions } = require('../controllers/sessionsController');

router.post('/create', auth, createSession);
router.post('/upload', auth, uploadRecording);
router.get('/list', auth, listSessions);

module.exports = router;
