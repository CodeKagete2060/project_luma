const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subject: { type: String, required: false },
  tags: [String],
  summary: { type: String },
  fileUrl: { type: String },
  filename: { type: String },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  size: { type: Number },
}, { timestamps: true });

resourceSchema.index({ title: 'text', summary: 'text', tags: 'text' });

module.exports = mongoose.model('Resource', resourceSchema);
