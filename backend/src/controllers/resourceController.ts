import { Router } from 'express';
import { checkAuth } from '../middlewares/auth';
import Resource from '../models/Resource';

export const resourceController = Router();

// Get all resources with filtering and pagination
resourceController.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      subject,
      type,
      difficulty,
      sort = '-createdAt',
      search,
    } = req.query;

    const query: any = {};

    // Apply filters
    if (subject) query.subject = subject;
    if (type) query.type = type;
    if (difficulty) query.difficulty = difficulty;

    // Apply text search if provided
    if (search) {
      query.$text = { $search: search };
    }

    // Calculate skip value for pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Get resources with pagination
    const resources = await Resource.find(query)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))
      .populate('createdBy', 'firstName lastName');

    // Get total count for pagination
    const total = await Resource.countDocuments(query);

    res.json({
      resources,
      total,
      pages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
    });
  } catch (error) {
    console.error('Error fetching resources:', error);
    res.status(500).json({ error: 'Failed to fetch resources' });
  }
});

// Get a single resource by ID
resourceController.get('/:id', async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id)
      .populate('createdBy', 'firstName lastName')
      .populate('ratings.user', 'firstName lastName');

    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    // Increment view count
    await resource.incrementViews();

    res.json(resource);
  } catch (error) {
    console.error('Error fetching resource:', error);
    res.status(500).json({ error: 'Failed to fetch resource' });
  }
});

// Create a new resource
resourceController.post('/', checkAuth, async (req, res) => {
  try {
    const {
      title,
      description,
      subject,
      type,
      url,
      thumbnailUrl,
      duration,
      difficulty,
      tags,
      prerequisites,
      learningOutcomes,
      isPublic,
    } = req.body;

    const resource = new Resource({
      title,
      description,
      subject,
      type,
      url,
      thumbnailUrl,
      duration,
      difficulty,
      tags,
      prerequisites,
      learningOutcomes,
      isPublic,
      createdBy: req.user._id,
    });

    await resource.save();

    res.status(201).json(resource);
  } catch (error) {
    console.error('Error creating resource:', error);
    res.status(500).json({ error: 'Failed to create resource' });
  }
});

// Update a resource
resourceController.put('/:id', checkAuth, async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    // Check if user is the creator
    if (resource.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to update this resource' });
    }

    const updates = req.body;
    Object.keys(updates).forEach(key => {
      if (key !== 'createdBy' && key !== 'likedBy' && key !== 'views' && key !== 'ratings') {
        resource[key] = updates[key];
      }
    });

    await resource.save();

    res.json(resource);
  } catch (error) {
    console.error('Error updating resource:', error);
    res.status(500).json({ error: 'Failed to update resource' });
  }
});

// Delete a resource
resourceController.delete('/:id', checkAuth, async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    // Check if user is the creator
    if (resource.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to delete this resource' });
    }

    await resource.remove();

    res.json({ message: 'Resource deleted successfully' });
  } catch (error) {
    console.error('Error deleting resource:', error);
    res.status(500).json({ error: 'Failed to delete resource' });
  }
});

// Rate a resource
resourceController.post('/:id/rate', checkAuth, async (req, res) => {
  try {
    const { rating, review } = req.body;
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    await resource.addRating(req.user._id, rating, review);

    res.json(resource);
  } catch (error) {
    console.error('Error rating resource:', error);
    res.status(500).json({ error: 'Failed to rate resource' });
  }
});

// Toggle like on a resource
resourceController.post('/:id/toggle-like', checkAuth, async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    await resource.toggleLike(req.user._id);

    res.json(resource);
  } catch (error) {
    console.error('Error toggling like:', error);
    res.status(500).json({ error: 'Failed to toggle like' });
  }
});