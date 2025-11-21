import Resource from '../models/Resource.js';
import { emitNotification } from '../socket/notifications.js';

export const resourceController = {
  async getResources(req, res) {
    try {
      const resources = await Resource.find()
        .populate('uploadedBy', 'username profile.name')
        .sort({ createdAt: -1 });
      res.json(resources);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async createResource(req, res) {
    try {
      const { title, description, type, url, tags, metadata } = req.body;
      const uploadedBy = req.user.id;

      const resource = new Resource({
        title,
        description,
        type,
        url,
        tags: tags || [],
        uploadedBy,
        metadata
      });

      const savedResource = await resource.save();
      await savedResource.populate('uploadedBy', 'username profile.name');

      // Notify relevant users about new resource
      emitNotification(req.io, uploadedBy, {
        type: 'resource',
        message: `New resource added: ${title}`,
        data: savedResource
      });

      res.status(201).json(savedResource);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  async updateResource(req, res) {
    try {
      const { id } = req.params;
      const { title, description, type, url, tags, metadata } = req.body;

      const resource = await Resource.findOneAndUpdate(
        { _id: id, uploadedBy: req.user.id },
        {
          title,
          description,
          type,
          url,
          tags,
          metadata,
          updatedAt: new Date()
        },
        { new: true }
      ).populate('uploadedBy', 'username profile.name');

      if (!resource) {
        return res.status(404).json({ message: 'Resource not found or unauthorized' });
      }

      res.json(resource);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  async deleteResource(req, res) {
    try {
      const { id } = req.params;
      const resource = await Resource.findOneAndDelete({
        _id: id,
        uploadedBy: req.user.id
      });

      if (!resource) {
        return res.status(404).json({ message: 'Resource not found or unauthorized' });
      }

      res.json({ message: 'Resource deleted' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async searchResources(req, res) {
    try {
      const { query, type, tags } = req.query;
      let searchQuery = {};

      if (query) {
        searchQuery.$or = [
          { title: new RegExp(query, 'i') },
          { description: new RegExp(query, 'i') }
        ];
      }

      if (type) {
        searchQuery.type = type;
      }

      if (tags) {
        searchQuery.tags = { $in: tags.split(',') };
      }

      const resources = await Resource.find(searchQuery)
        .populate('uploadedBy', 'username profile.name')
        .sort({ createdAt: -1 });

      res.json(resources);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
,

  // View a single resource
  async viewResource(req, res) {
    try {
      const { id } = req.params;
      const resource = await Resource.findById(id).populate('uploadedBy', 'username profile.name');

      if (!resource) {
        return res.status(404).json({ message: 'Resource not found' });
      }

      // Optionally increment views if the model supports metadata
      if (typeof resource.views === 'number') {
        resource.views = (resource.views || 0) + 1;
        await resource.save();
      }

      res.json(resource);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
,

  async rateResource(req, res) {
    try {
      const { id } = req.params;
      const { rating, review } = req.body;
      const userId = req.user && (req.user.id || req.user._id);

      if (!userId) return res.status(401).json({ message: 'Authentication required' });

      const resource = await Resource.findById(id);
      if (!resource) return res.status(404).json({ message: 'Resource not found' });

      if (typeof resource.addRating === 'function') {
        await resource.addRating(userId, rating, review);
      } else {
        // fallback: push into ratings array
        resource.ratings = resource.ratings || [];
        resource.ratings.push({ user: userId, rating, review, createdAt: new Date() });
        const total = resource.ratings.reduce((s, r) => s + (r.rating || 0), 0);
        resource.averageRating = total / resource.ratings.length;
        await resource.save();
      }

      res.json(resource);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async toggleLike(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user && (req.user.id || req.user._id);
      if (!userId) return res.status(401).json({ message: 'Authentication required' });

      const resource = await Resource.findById(id);
      if (!resource) return res.status(404).json({ message: 'Resource not found' });

      if (typeof resource.toggleLike === 'function') {
        await resource.toggleLike(userId);
      } else {
        resource.likedBy = resource.likedBy || [];
        const idx = resource.likedBy.findIndex(x => x.toString() === userId.toString());
        if (idx > -1) resource.likedBy.splice(idx, 1);
        else resource.likedBy.push(userId);
        await resource.save();
      }

      res.json(resource);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};