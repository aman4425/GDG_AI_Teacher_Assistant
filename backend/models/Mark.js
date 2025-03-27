const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Individual student mark in an assessment
const MarkRecordSchema = new Schema({
  studentId: {
    type: Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  marks: {
    type: Number,
    required: true,
    min: 0
  },
  remarks: String
});

// Assessment with student marks
const MarkSchema = new Schema({
  courseId: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
    required: [true, 'Course is required']
  },
  assessmentName: {
    type: String,
    required: [true, 'Assessment name is required'],
    trim: true
  },
  assessmentType: {
    type: String,
    enum: ['quiz', 'assignment', 'project', 'mid_term', 'final_exam', 'lab', 'other'],
    required: [true, 'Assessment type is required']
  },
  totalMarks: {
    type: Number,
    required: [true, 'Total marks is required'],
    min: 1
  },
  weightage: {
    type: Number,
    default: 0, // Percentage contribution to final grade
    min: 0,
    max: 100
  },
  date: {
    type: Date,
    required: [true, 'Assessment date is required']
  },
  records: [MarkRecordSchema],
  gradedBy: {
    type: Schema.Types.ObjectId,
    ref: 'Faculty'
  },
  description: String, // Description of the assessment
  attachmentUrl: String // URL to assignment or exam paper
}, { 
  timestamps: true
});

// Compound index to ensure unique assessment name per course per type
MarkSchema.index({ courseId: 1, assessmentType: 1, assessmentName: 1 }, { unique: true });

module.exports = mongoose.model('Mark', MarkSchema); 