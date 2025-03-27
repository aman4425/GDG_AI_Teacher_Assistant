const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EnrollmentSchema = new Schema({
  studentId: {
    type: Schema.Types.ObjectId,
    ref: 'Student',
    required: [true, 'Student is required']
  },
  courseId: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
    required: [true, 'Course is required']
  },
  enrollmentDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['active', 'dropped', 'completed'],
    default: 'active'
  },
  grade: {
    type: String,
    enum: ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'F', 'I', 'W', ''],
    default: ''
  },
  remarks: String
}, { 
  timestamps: true
});

// Compound index to ensure a student can't be enrolled in the same course twice
EnrollmentSchema.index({ studentId: 1, courseId: 1 }, { unique: true });

module.exports = mongoose.model('Enrollment', EnrollmentSchema); 