const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    dueDate: {
        type: Date,
        required: true,
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    tutor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'in_progress', 'completed', 'overdue'],
        default: 'pending',
    },
    score: {
        type: Number,
        min: 0,
        max: 100,
    },
    timeSpent: {
        type: Number, // in minutes
        default: 0,
    },
    feedback: {
        type: String,
    },
    completedAt: {
        type: Date,
    },
    submission: {
        type: String,
    },
}, { timestamps: true });

assignmentSchema.index({ student: 1, status: 1 });
assignmentSchema.index({ tutor: 1, dueDate: 1 });

const Assignment = mongoose.model('Assignment', assignmentSchema);

module.exports = Assignment;