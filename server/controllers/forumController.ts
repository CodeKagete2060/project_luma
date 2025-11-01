import { Request, Response } from 'express';
import Thread from '../models/Thread';

// Get all threads with filtering and pagination
export const getThreads = async (req: Request, res: Response) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      tag,
      sort = '-lastActivityAt',
      search,
      onlyAnnouncements,
      onlyPinned
    } = req.query;

    const query: any = {};

    // Apply filters
    if (category) query.category = category;
    if (tag) query.tags = tag;
    if (onlyAnnouncements === 'true') query.isAnnouncement = true;
    if (onlyPinned === 'true') query.isPinned = true;

    // Apply text search if provided
    if (search) {
      query.$text = { $search: search as string };
    }

    // Calculate skip value for pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Get threads with pagination
    const threads = await Thread.find(query)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))
      .populate('author', 'firstName lastName role')
      .populate('replies.author', 'firstName lastName role')
      .lean();

    // Get total count for pagination
    const total = await Thread.countDocuments(query);

    res.json({
      threads,
      total,
      pages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
    });
  } catch (error) {
    console.error('Error fetching threads:', error);
    res.status(500).json({ error: 'Failed to fetch threads' });
  }
};

// Get a single thread by ID
export const getThread = async (req: Request, res: Response) => {
  try {
    const thread = await Thread.findById(req.params.id)
      .populate('author', 'firstName lastName role')
      .populate('replies.author', 'firstName lastName role')
      .lean();

    if (!thread) {
      return res.status(404).json({ error: 'Thread not found' });
    }

    // Increment view count
    await Thread.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });

    res.json(thread);
  } catch (error) {
    console.error('Error fetching thread:', error);
    res.status(500).json({ error: 'Failed to fetch thread' });
  }
};

// Create a new thread
export const createThread = async (req: Request, res: Response) => {
  try {
    const { title, content, category, tags, isAnnouncement } = req.body;

    // Only admins and tutors can create announcements
    if (isAnnouncement && !['admin', 'tutor'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Not authorized to create announcements' });
    }

    const thread = new Thread({
      title,
      content,
      category,
      tags,
      author: req.user._id,
      isAnnouncement
    });

    await thread.save();

    const populatedThread = await Thread.findById(thread._id)
      .populate('author', 'firstName lastName role')
      .lean();

    res.status(201).json(populatedThread);
  } catch (error) {
    console.error('Error creating thread:', error);
    res.status(500).json({ error: 'Failed to create thread' });
  }
};

// Add a reply to a thread
export const addReply = async (req: Request, res: Response) => {
  try {
    const { content } = req.body;
    const thread = await Thread.findById(req.params.id);

    if (!thread) {
      return res.status(404).json({ error: 'Thread not found' });
    }

    if (thread.isLocked) {
      return res.status(403).json({ error: 'Thread is locked' });
    }

    thread.replies.push({
      content,
      author: req.user._id,
      createdAt: new Date(),
      isEdited: false,
      likes: [],
      reports: [],
      isResolved: false
    });

    await thread.save();

    const updatedThread = await Thread.findById(req.params.id)
      .populate('author', 'firstName lastName role')
      .populate('replies.author', 'firstName lastName role')
      .lean();

    res.json(updatedThread);
  } catch (error) {
    console.error('Error adding reply:', error);
    res.status(500).json({ error: 'Failed to add reply' });
  }
};

// Report a thread
export const reportThread = async (req: Request, res: Response) => {
  try {
    const { reason } = req.body;
    const thread = await Thread.findById(req.params.id);

    if (!thread) {
      return res.status(404).json({ error: 'Thread not found' });
    }

    // Check if user has already reported this thread
    const existingReport = thread.reports.find(
      report => report.user.toString() === req.user._id.toString()
    );

    if (existingReport) {
      return res.status(400).json({ error: 'You have already reported this thread' });
    }

    thread.reports.push({
      user: req.user._id,
      reason,
      createdAt: new Date()
    });

    await thread.save();

    // If thread has received multiple reports, notify moderators (implement notification later)

    res.json({ message: 'Thread reported successfully' });
  } catch (error) {
    console.error('Error reporting thread:', error);
    res.status(500).json({ error: 'Failed to report thread' });
  }
};

// Moderate a thread (admin/moderator only)
export const moderateThread = async (req: Request, res: Response) => {
  try {
    const { action, reason } = req.body;
    const thread = await Thread.findById(req.params.id);

    if (!thread) {
      return res.status(404).json({ error: 'Thread not found' });
    }

    // Check if user is admin or moderator
    if (!['admin', 'moderator'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Not authorized to moderate threads' });
    }

    switch (action) {
      case 'lock':
        thread.isLocked = true;
        break;
      case 'unlock':
        thread.isLocked = false;
        break;
      case 'pin':
        thread.isPinned = true;
        break;
      case 'unpin':
        thread.isPinned = false;
        break;
      case 'resolve':
        thread.isResolved = true;
        break;
      case 'delete':
        await Thread.findByIdAndDelete(req.params.id);
        return res.json({ message: 'Thread deleted successfully' });
      default:
        return res.status(400).json({ error: 'Invalid moderation action' });
    }

    await thread.save();

    // Notify thread author of moderation action (implement notification later)

    res.json(thread);
  } catch (error) {
    console.error('Error moderating thread:', error);
    res.status(500).json({ error: 'Failed to moderate thread' });
  }
};