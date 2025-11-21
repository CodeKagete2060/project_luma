const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const Resource = require('../models/Resource');
const Discussion = require('../models/Discussion');

router.get('/', auth, async (req, res) => {
  try {
    const { q = '', limit = 5 } = req.query;
    const trimmed = String(q).trim();
    if (!trimmed) {
      return res.json({ resources: [], discussions: [] });
    }

    const textQuery = { $text: { $search: trimmed } };
    const options = { score: { $meta: 'textScore' } };
    const sort = { score: { $meta: 'textScore' }, createdAt: -1 };

    const [resources, discussions] = await Promise.all([
      Resource.find(textQuery, options)
        .sort(sort)
        .limit(Number(limit))
        .select('title subject tags summary fileUrl createdAt')
        .lean(),
      Discussion.find(textQuery, options)
        .sort(sort)
        .limit(Number(limit))
        .select('title subject tags isResolved createdAt')
        .lean(),
    ]);

    res.json({ resources, discussions });
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ message: 'Search failed' });
  }
});

module.exports = router;

