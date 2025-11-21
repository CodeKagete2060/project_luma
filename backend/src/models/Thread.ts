import { Schema, model, Document, Types } from 'mongoose';

interface Reply {
  author: Types.ObjectId;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
  isEdited: boolean;
  likes: Types.ObjectId[];
  reports: Array<{
    user: Types.ObjectId;
    reason: string;
    createdAt: Date;
  }>;
  isResolved: boolean;
}

interface ThreadDocument extends Document {
  title: string;
  content: string;
  author: Types.ObjectId;
  category: string;
  tags: string[];
  isAnnouncement: boolean;
  isPinned: boolean;
  isLocked: boolean;
  views: number;
  likes: Types.ObjectId[];
  replies: Reply[];
  reports: Array<{
    user: Types.ObjectId;
    reason: string;
    createdAt: Date;
  }>;
  isResolved: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastActivityAt: Date;
}

const ReplySchema = new Schema<Reply>({
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date,
  isEdited: { type: Boolean, default: false },
  likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  reports: [{
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    reason: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  }],
  isResolved: { type: Boolean, default: false }
});

const ThreadSchema = new Schema<ThreadDocument>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, required: true },
  tags: [String],
  isAnnouncement: { type: Boolean, default: false },
  isPinned: { type: Boolean, default: false },
  isLocked: { type: Boolean, default: false },
  views: { type: Number, default: 0 },
  likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  replies: [ReplySchema],
  reports: [{
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    reason: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  }],
  isResolved: { type: Boolean, default: false },
  lastActivityAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Add text index for search
ThreadSchema.index({
  title: 'text',
  content: 'text',
  tags: 'text'
});

// Update lastActivityAt on new replies
ThreadSchema.pre('save', function(next) {
  if (this.isModified('replies')) {
    this.lastActivityAt = new Date();
  }
  next();
});

const Thread = model<ThreadDocument>('Thread', ThreadSchema);
export default Thread;