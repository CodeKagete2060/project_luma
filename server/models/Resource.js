import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['document', 'video', 'link', 'other'],
    required: true
  },
  url: {
    type: String,
    required: true
  },
  tags: [String],
  subject: String,
  duration: Number,
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  views: { type: Number, default: 0 },
  averageRating: { type: Number, default: 0 },
  ratings: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number, min: 1, max: 5 },
    review: String,
    createdAt: { type: Date, default: Date.now }
  }],
  metadata: {
    fileSize: Number,
    duration: Number,
    format: String
  },
  prerequisites: [String],
  learningOutcomes: [String],
  isPublic: { type: Boolean, default: true },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

resourceSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Methods for ratings, views and likes
resourceSchema.methods.addRating = async function(userId, rating, review) {
  const existingIndex = this.ratings.findIndex(r => r.user && r.user.toString() === userId.toString());
  if (existingIndex > -1) {
    this.ratings[existingIndex].rating = rating;
    this.ratings[existingIndex].review = review;
    this.ratings[existingIndex].createdAt = new Date();
  } else {
    this.ratings.push({ user: userId, rating, review });
  }

  // recalc average
  const total = this.ratings.reduce((s, r) => s + (r.rating || 0), 0);
  this.averageRating = total / this.ratings.length;
  await this.save();
  return this;
};

resourceSchema.methods.incrementViews = async function() {
  this.views = (this.views || 0) + 1;
  await this.save();
  return this;
};

resourceSchema.methods.toggleLike = async function(userId) {
  const uid = userId.toString();
  const idx = (this.likedBy || []).findIndex(id => id.toString() === uid);
  if (idx > -1) this.likedBy.splice(idx, 1);
  else this.likedBy.push(userId);
  await this.save();
  return this;
};

export default mongoose.model('Resource', resourceSchema);