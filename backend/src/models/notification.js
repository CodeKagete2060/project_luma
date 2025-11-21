const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    type: {
        type: String,
        enum: ['assignment_completed', 'milestone_achieved', 'tutor_feedback', 'new_assignment'],
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    read: {
        type: Boolean,
        default: false,
    },
    relatedStudent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    relatedAssignment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Assignment',
    },
}, { timestamps: true });

// Index to improve query performance for unread notifications
notificationSchema.index({ recipient: 1, read: 1 });

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;