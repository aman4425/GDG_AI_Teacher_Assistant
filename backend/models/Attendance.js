const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Attendance status for a single student on a specific day
const AttendanceRecordSchema = new Schema({
  studentId: {
    type: Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  status: {
    type: String,
    enum: ['present', 'absent', 'late', 'excused'],
    default: 'absent'
  },
  remarks: String
});

// Attendance session for a course on a specific date
const AttendanceSchema = new Schema({
  courseId: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
    required: [true, 'Course is required']
  },
  date: {
    type: Date,
    required: [true, 'Date is required']
  },
  records: [AttendanceRecordSchema],
  markedBy: {
    type: Schema.Types.ObjectId,
    ref: 'Faculty'
  },
  topic: String, // Topic covered in this session
  notes: String
}, { 
  timestamps: true
});

// Compound index to ensure one attendance record per course per date
AttendanceSchema.index({ courseId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', AttendanceSchema); 