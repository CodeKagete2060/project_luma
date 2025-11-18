import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['video', 'document', 'quiz', 'interactive'],
    required: true
  },
  url: {
    type: String,
    required: true
  },
  thumbnailUrl: {
    type: String
  },
  duration: {
    type: Number, // Duration in minutes for videos
    default: 0
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  likedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  views: {
    type: Number,
    default: 0
  },
  averageRating: {
    type: Number,
    default: 0
  },
  ratings: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    review: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  prerequisites: [{
    type: String
  }],
  learningOutcomes: [{
    type: String
  }],
  isPublic: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Add text index for search functionality
resourceSchema.index({ 
  title: 'text', 
  description: 'text', 
  subject: 'text',
  tags: 'text' 
});

// Method to add a new rating
resourceSchema.methods.addRating = async function(userId, rating, review) {
  const existingRatingIndex = this.ratings.findIndex(r => 
    r.user.toString() === userId.toString()
  );

  if (existingRatingIndex > -1) {
    this.ratings[existingRatingIndex] = { user: userId, rating, review };
  } else {
    this.ratings.push({ user: userId, rating, review });
  }

  // Update average rating
  const totalRating = this.ratings.reduce((sum, r) => sum + r.rating, 0);
  this.averageRating = totalRating / this.ratings.length;

  await this.save();
  return this;
};

// Method to increment view count
resourceSchema.methods.incrementViews = async function() {
  this.views += 1;
  await this.save();
  return this;
};

// Method to toggle like
resourceSchema.methods.toggleLike = async function(userId) {
  const userIdStr = userId.toString();
  const likedIndex = this.likedBy.findIndex(id => 
    id.toString() === userIdStr
  );

  if (likedIndex > -1) {
    this.likedBy.splice(likedIndex, 1);
  } else {
    this.likedBy.push(userId);
  }

  await this.save();
  return this;
};

const Resource = mongoose.model('Resource', resourceSchema);

export default Resource;
