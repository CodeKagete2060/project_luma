const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    metrics: {
        assignmentsCompleted: {
            type: Number,
            default: 0,
        },
        averageScore: {
            type: Number,
            default: 0,
        },
        totalTimeSpent: {
            type: Number, // in minutes
            default: 0,
        },
    },
    weeklyProgress: [{
        week: Date,
        assignmentsCompleted: Number,
        averageScore: Number,
        timeSpent: Number,
    }],
    milestones: [{
        title: String,
        achievedAt: Date,
        description: String,
    }],
    lastUpdated: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });

// Index to improve lookup performance
progressSchema.index({ student: 1 });

const Progress = mongoose.model('Progress', progressSchema);

module.exports = Progress;