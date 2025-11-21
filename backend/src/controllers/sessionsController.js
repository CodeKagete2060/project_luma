const Session = require('../models/Session');
const { uploadMiddleware } = require('../middleware/uploadMiddleware');
const { v4: uuidv4 } = require('uuid');

async function createSession(req, res) {
  try {
    const { title, tutorId, scheduledAt } = req.body;
    if (!title || !tutorId) return res.status(400).json({ message: 'title and tutorId required' });
    const sessionId = uuidv4();
    const s = new Session({ title, tutorId, scheduledAt: scheduledAt ? new Date(scheduledAt) : null, sessionId, status: 'active' });
    await s.save();
    res.json({ sessionId, id: s._id });
  } catch (err) {
    console.error('createSession error', err);
    res.status(500).json({ message: 'Create failed' });
  }
}

// Upload recorded MP4
const upload = uploadMiddleware({ subfolder: 'sessions', maxSize: 200 * 1024 * 1024 });
async function uploadRecording(req, res) {
  upload.single('file')(req, res, async function (err) {
    if (err) return res.status(400).json({ message: 'Upload error', detail: err.message });
    try {
      const file = req.file;
      const { sessionId } = req.body;
      if (!file) return res.status(400).json({ message: 'file required' });
      const session = await Session.findOne({ sessionId });
      if (!session) return res.status(404).json({ message: 'Session not found' });
      session.recordingUrl = `/uploads/sessions/${file.filename}`;
      session.recordingFilename = file.filename;
      session.status = 'ended';
      await session.save();
      res.json(session);
    } catch (err) {
      console.error('uploadRecording error', err);
      res.status(500).json({ message: 'Recording upload failed' });
    }
  });
}

async function cleanupSessions() {
  const cutoff = new Date(Date.now() - 4 * 60 * 60 * 1000); // 4 hours ago
  await Session.updateMany(
    { status: 'active', createdAt: { $lt: cutoff } },
    { $set: { status: 'ended' } }
  );
}

async function listSessions(req, res) {
  try {
    await cleanupSessions();
    const items = await Session.find({}).sort({ createdAt: -1 }).lean();
    res.json({ items });
  } catch (err) {
    console.error('listSessions error', err);
    res.status(500).json({ message: 'Failed to list sessions' });
  }
}

module.exports = { createSession, uploadRecording, listSessions };
