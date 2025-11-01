import Discussion from '../models/Discussion.js';
import { emitNotification } from '../socket/notifications.js';

export const discussionController = {
  async getDiscussions(req, res) {
    try {
      const discussions = await Discussion.find()
        .populate('author', 'username profile.name')
        .populate('replies.author', 'username profile.name')
        .sort({ createdAt: -1 });
      res.json(discussions);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async createDiscussion(req, res) {
    try {
      const { topic, content, tags } = req.body;
      const author = req.user.id;

      const discussion = new Discussion({
        topic,
        content,
        author,
        tags: tags || []
      });

      const savedDiscussion = await discussion.save();
      await savedDiscussion.populate('author', 'username profile.name');

      // Notify relevant users
      emitNotification(req.io, author, {
        type: 'discussion',
        message: `New discussion created: ${topic}`,
        data: savedDiscussion
      });

      res.status(201).json(savedDiscussion);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  async addReply(req, res) {
    try {
      const { id } = req.params;
      const { content } = req.body;
      const author = req.user.id;

      const discussion = await Discussion.findById(id);
      if (!discussion) {
        return res.status(404).json({ message: 'Discussion not found' });
      }

      discussion.replies.push({ content, author });
      const updatedDiscussion = await discussion.save();
      await updatedDiscussion.populate('replies.author', 'username profile.name');

      // Notify discussion author
      emitNotification(req.io, discussion.author, {
        type: 'discussion',
        message: `New reply on your discussion: ${discussion.topic}`,
        data: updatedDiscussion
      });

      res.json(updatedDiscussion);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  async deleteDiscussion(req, res) {
    try {
      const { id } = req.params;
      const discussion = await Discussion.findOneAndDelete({
        _id: id,
        author: req.user.id
      });

      if (!discussion) {
        return res.status(404).json({ message: 'Discussion not found or unauthorized' });
      }

      res.json({ message: 'Discussion deleted' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};