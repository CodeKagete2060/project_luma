const mongoose = require ('mongoose');
const userSchema = new mongoose.Schema ({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['Student', 'Admin', 'Parent', 'Tutor'],
        default: 'Student' 
    },
    // For Parent and Tutor roles: IDs of linked students
    studentIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    // For Student role: IDs of linked parents and tutors
    parentIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    tutorIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    // Student-specific fields
    grade: {
        type: String,
        enum: ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th'],
        default: null
    },
    subjects: [{
        type: String,
        enum: ['Math', 'Science', 'English', 'History', 'Art', 'Music', 'Physical Education', 'Other']
    }]
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;