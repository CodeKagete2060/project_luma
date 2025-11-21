const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { assistant, uploadResource, listResources, getResource, summarizeResource, ensureTutor } = require('../controllers/learningController');
const { uploadMiddleware } = require('../middleware/uploadMiddleware');

const upload = uploadMiddleware({ subfolder: 'resources' });

// Assistant (rate-limited inside controller)
router.post('/assistant', auth, assistant);

// Resources
router.get('/resources', auth, listResources);
router.get('/resources/:id', auth, getResource);
router.post('/resources', auth, ensureTutor, upload.single('file'), uploadResource);
router.post('/resources/:id/summarize', auth, summarizeResource);

module.exports = router;
