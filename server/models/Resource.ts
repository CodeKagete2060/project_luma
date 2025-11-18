import { Schema, model, Document, Types } from 'mongoose';

interface Rating {
  user: Types.ObjectId;
  rating: number;
  review?: string;
  createdAt: Date;
}

interface ResourceDocument extends Document {
  title: string;
  description: string;
  subject: string;
  type: string;
  url: string;
  thumbnailUrl?: string;
  duration?: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  prerequisites?: string[];
  learningOutcomes?: string[];
  isPublic: boolean;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  views: number;
  likedBy: Types.ObjectId[];
  ratings: Rating[];
  incrementViews: () => Promise<void>;
  addRating: (userId: Types.ObjectId, rating: number, review?: string) => Promise<void>;
  toggleLike: (userId: Types.ObjectId) => Promise<void>;
  averageRating: () => number;
}

const ResourceSchema = new Schema<ResourceDocument>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  subject: { type: String, required: true },
  type: { type: String, required: true },
  url: { type: String, required: true },
  thumbnailUrl: String,
  duration: Number,
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true,
  },
  tags: [String],
  prerequisites: [String],
  learningOutcomes: [String],
  isPublic: { type: Boolean, default: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  views: { type: Number, default: 0 },
  likedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  ratings: [{
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    review: String,
    createdAt: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

// Add text index for search
ResourceSchema.index({
  title: 'text',
  description: 'text',
  tags: 'text'
});

// Instance methods
ResourceSchema.methods.incrementViews = async function() {
  this.views += 1;
  await this.save();
};

ResourceSchema.methods.addRating = async function(userId: Types.ObjectId, rating: number, review?: string) {
  // Remove existing rating by this user if it exists
  const existingRatingIndex = this.ratings.findIndex(r => r.user.toString() === userId.toString());
  if (existingRatingIndex !== -1) {
    this.ratings.splice(existingRatingIndex, 1);
  }

  // Add new rating
  this.ratings.push({
    user: userId,
    rating,
    review,
    createdAt: new Date()
  });

  await this.save();
};

ResourceSchema.methods.toggleLike = async function(userId: Types.ObjectId) {
  const userIdString = userId.toString();
  const likedIndex = this.likedBy.findIndex(id => id.toString() === userIdString);

  if (likedIndex === -1) {
    this.likedBy.push(userId);
  } else {
    this.likedBy.splice(likedIndex, 1);
  }

  await this.save();
};

ResourceSchema.methods.averageRating = function() {
  if (this.ratings.length === 0) return 0;
  const sum = this.ratings.reduce((acc, curr) => acc + curr.rating, 0);
  return sum / this.ratings.length;
};

// Create and export the model
const Resource = model<ResourceDocument>('Resource', ResourceSchema);
export default Resource;