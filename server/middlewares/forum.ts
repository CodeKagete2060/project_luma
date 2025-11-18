import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../types/auth';

// Extend Express Request to include user property
declare module 'express' {
  interface Request {
    user?: {
      _id: string;
      role: UserRole;
    };
  }
}

export const requireModerator = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  if (!['admin', 'moderator'].includes(req.user.role)) {
    return res.status(403).json({ error: 'Moderator access required' });
  }

  next();
};

export const requireTutorOrAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  if (!['admin', 'tutor'].includes(req.user.role)) {
    return res.status(403).json({ error: 'Tutor or admin access required' });
  }

  next();
};

interface ThreadRequestBody {
  title?: string;
  content?: string;
  category?: string;
}

export const validateThreadContent = (
  req: Request<any, any, ThreadRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const { title, content, category } = req.body;
  const errors: string[] = [];

  if (!title || title.trim().length < 5) {
    errors.push('Title must be at least 5 characters long');
  }

  if (!content || content.trim().length < 20) {
    errors.push('Content must be at least 20 characters long');
  }

  if (!category) {
    errors.push('Category is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

interface ReplyRequestBody {
  content?: string;
}

export const validateReplyContent = (
  req: Request<any, any, ReplyRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const { content } = req.body;

  if (!content || content.trim().length < 5) {
    return res.status(400).json({ error: 'Reply content must be at least 5 characters long' });
  }

  next();
};

interface ReportRequestBody {
  reason?: string;
}

export const validateReport = (
  req: Request<any, any, ReportRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const { reason } = req.body;

  if (!reason || reason.trim().length < 10) {
    return res.status(400).json({ error: 'Report reason must be at least 10 characters long' });
  }

  next();
};