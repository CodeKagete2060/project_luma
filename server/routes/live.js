const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const Session = require('../models/Session');
const { v4: uuidv4 } = require('uuid');

// Create a live session
router.post('/', auth, async (req, res) => {
  try {
    const { mode = 'video' } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Only tutors can create live sessions
    if (userRole !== 'Tutor') {
      return res.status(403).json({ message: 'Only tutors can create live sessions' });
    }

    const sessionId = uuidv4();
    const session = new Session({
      title: `Live Session - ${new Date().toLocaleString()}`,
      tutorId: userId,
      sessionId,
      metadata: { mode, status: 'active' }
    });

    await session.save();

    const io = req.app.get('io');
    if (io) {
      // Notify connected students/parents about new session
      io.emit('live-session-created', {
        sessionId,
        tutorId: userId,
        link: `/learning/sessions/join/${sessionId}`
      });
    }

    res.json({
      session: {
        id: session._id,
        sessionId,
        hostId: userId,
        mode,
        link: `/learning/sessions/join/${sessionId}`,
        status: 'active'
      }
    });
  } catch (err) {
    console.error('Error creating live session:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get active live sessions
router.get('/active', auth, async (req, res) => {
  try {
    const sessions = await Session.find({
      'metadata.status': 'active',
      scheduledAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } // Last 24 hours
    })
      .populate('tutorId', 'username email')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({ sessions });
  } catch (err) {
    console.error('Error fetching active sessions:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
