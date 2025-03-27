/**
 * Mock Database Service
 * For local development without Firebase dependencies
 */

// Mock data storage (in-memory)
const mockDatabase = {
  faculty: {},
  students: {},
  courses: {},
  enrollments: {},
  marks: {},
  users: {},
  messages: {},
  attendance: {}
};

// Helper function to generate random IDs
const generateId = () => Math.random().toString(36).substring(2, 15);

// Helper to create timestamp
const timestamp = () => new Date().toISOString();

// Faculty-related operations
export const facultyOperations = {
  // Create a new faculty profile
  createFaculty: async (userId, facultyData) => {
    try {
      const id = userId || generateId();
      mockDatabase.faculty[id] = {
        ...facultyData,
        createdAt: timestamp(),
        updatedAt: timestamp()
      };
      return { success: true, data: { id } };
    } catch (error) {
      console.error("Error creating faculty:", error);
      return { success: false, error };
    }
  },

  // Get faculty profile by ID
  getFacultyById: async (facultyId) => {
    try {
      const faculty = mockDatabase.faculty[facultyId];
      if (faculty) {
        return { success: true, data: { id: facultyId, ...faculty } };
      } else {
        return { success: false, error: 'Faculty not found' };
      }
    } catch (error) {
      console.error("Error getting faculty:", error);
      return { success: false, error };
    }
  },

  // Update faculty profile
  updateFaculty: async (facultyId, facultyData) => {
    try {
      if (!mockDatabase.faculty[facultyId]) {
        return { success: false, error: 'Faculty not found' };
      }
      
      mockDatabase.faculty[facultyId] = {
        ...mockDatabase.faculty[facultyId],
        ...facultyData,
        updatedAt: timestamp()
      };
      return { success: true };
    } catch (error) {
      console.error("Error updating faculty:", error);
      return { success: false, error };
    }
  },

  // Get all faculty
  getAllFaculty: async () => {
    try {
      const faculty = Object.entries(mockDatabase.faculty).map(([id, data]) => ({
        id,
        ...data
      }));
      return { success: true, data: faculty };
    } catch (error) {
      console.error("Error getting all faculty:", error);
      return { success: false, error };
    }
  }
};

// User-related operations
export const userOperations = {
  // Initialize users collection if not exists
  init: () => {
    if (!mockDatabase.users) {
      mockDatabase.users = {};
    }
  },

  // Create a new user
  createUser: async (userData) => {
    try {
      userOperations.init();
      const id = generateId();
      mockDatabase.users[id] = {
        ...userData,
        createdAt: timestamp(),
        updatedAt: timestamp()
      };
      return { success: true, data: { id } };
    } catch (error) {
      console.error("Error creating user:", error);
      return { success: false, error };
    }
  },

  // Get user by ID
  getUserById: async (userId) => {
    try {
      userOperations.init();
      const user = mockDatabase.users[userId];
      if (user) {
        return { success: true, data: { id: userId, ...user } };
      } else {
        return { success: false, error: 'User not found' };
      }
    } catch (error) {
      console.error("Error getting user:", error);
      return { success: false, error };
    }
  },

  // Update user
  updateUser: async (userId, userData) => {
    try {
      userOperations.init();
      if (!mockDatabase.users[userId]) {
        return { success: false, error: 'User not found' };
      }
      
      mockDatabase.users[userId] = {
        ...mockDatabase.users[userId],
        ...userData,
        updatedAt: timestamp()
      };
      return { success: true };
    } catch (error) {
      console.error("Error updating user:", error);
      return { success: false, error };
    }
  },

  // Delete user
  deleteUser: async (userId) => {
    try {
      userOperations.init();
      if (!mockDatabase.users[userId]) {
        return { success: false, error: 'User not found' };
      }
      
      delete mockDatabase.users[userId];
      return { success: true };
    } catch (error) {
      console.error("Error deleting user:", error);
      return { success: false, error };
    }
  },

  // Get all users
  getAllUsers: async () => {
    try {
      userOperations.init();
      const users = Object.entries(mockDatabase.users).map(([id, data]) => ({
        id,
        ...data
      }));
      return { success: true, data: users };
    } catch (error) {
      console.error("Error getting all users:", error);
      return { success: false, error };
    }
  }
};

// Student-related operations
export const studentOperations = {
  // Create a new student profile
  createStudent: async (userId, studentData) => {
    try {
      const id = userId || generateId();
      mockDatabase.students[id] = {
        ...studentData,
        createdAt: timestamp(),
        updatedAt: timestamp()
      };
      return { success: true, data: { id } };
    } catch (error) {
      console.error("Error creating student:", error);
      return { success: false, error };
    }
  },

  // Get student profile by ID
  getStudentById: async (studentId) => {
    try {
      const student = mockDatabase.students[studentId];
      if (student) {
        return { success: true, data: { id: studentId, ...student } };
      } else {
        return { success: false, error: 'Student not found' };
      }
    } catch (error) {
      console.error("Error getting student:", error);
      return { success: false, error };
    }
  },

  // Update student profile
  updateStudent: async (studentId, studentData) => {
    try {
      if (!mockDatabase.students[studentId]) {
        return { success: false, error: 'Student not found' };
      }
      
      mockDatabase.students[studentId] = {
        ...mockDatabase.students[studentId],
        ...studentData,
        updatedAt: timestamp()
      };
      return { success: true };
    } catch (error) {
      console.error("Error updating student:", error);
      return { success: false, error };
    }
  },

  // Get all students
  getAllStudents: async () => {
    try {
      const students = Object.entries(mockDatabase.students).map(([id, data]) => ({
        id,
        ...data
      }));
      return { success: true, data: students };
    } catch (error) {
      console.error("Error getting all students:", error);
      return { success: false, error };
    }
  },

  // Get students by class/section
  getStudentsByClass: async (classId, section) => {
    try {
      const students = Object.entries(mockDatabase.students)
        .filter(([_, student]) => {
          if (section) {
            return student.classId === classId && student.section === section;
          }
          return student.classId === classId;
        })
        .map(([id, data]) => ({
          id,
          ...data
        }));
      
      return { success: true, data: students };
    } catch (error) {
      console.error("Error getting students by class:", error);
      return { success: false, error };
    }
  },

  // Get courses for a student
  getStudentCourses: async (studentId) => {
    try {
      // Find enrollments for this student
      const enrollments = Object.values(mockDatabase.enrollments || {})
        .filter(enrollment => enrollment.studentId === studentId);
      
      // Get course details for each enrollment
      const courses = enrollments.map(enrollment => {
        const courseId = enrollment.courseId;
        const courseData = mockDatabase.courses[courseId];
        
        if (courseData) {
          return {
            id: courseId,
            ...courseData
          };
        }
        return null;
      }).filter(Boolean); // Filter out null values
      
      return { success: true, data: courses };
    } catch (error) {
      console.error("Error getting student courses:", error);
      return { success: false, error };
    }
  }
};

// Course-related operations
export const courseOperations = {
  // Create a new course
  createCourse: async (courseData) => {
    try {
      const id = generateId();
      mockDatabase.courses[id] = {
        ...courseData,
        createdAt: timestamp(),
        updatedAt: timestamp()
      };
      return { success: true, data: { id } };
    } catch (error) {
      console.error("Error creating course:", error);
      return { success: false, error };
    }
  },

  // Get course by ID
  getCourseById: async (courseId) => {
    try {
      const course = mockDatabase.courses[courseId];
      if (course) {
        return { success: true, data: { id: courseId, ...course } };
      } else {
        return { success: false, error: 'Course not found' };
      }
    } catch (error) {
      console.error("Error getting course:", error);
      return { success: false, error };
    }
  },

  // Update course
  updateCourse: async (courseId, courseData) => {
    try {
      if (!mockDatabase.courses[courseId]) {
        return { success: false, error: 'Course not found' };
      }
      
      mockDatabase.courses[courseId] = {
        ...mockDatabase.courses[courseId],
        ...courseData,
        updatedAt: timestamp()
      };
      return { success: true };
    } catch (error) {
      console.error("Error updating course:", error);
      return { success: false, error };
    }
  },

  // Delete course
  deleteCourse: async (courseId) => {
    try {
      if (!mockDatabase.courses[courseId]) {
        return { success: false, error: 'Course not found' };
      }
      
      delete mockDatabase.courses[courseId];
      return { success: true };
    } catch (error) {
      console.error("Error deleting course:", error);
      return { success: false, error };
    }
  },

  // Get all courses
  getAllCourses: async () => {
    try {
      const courses = Object.entries(mockDatabase.courses).map(([id, data]) => ({
        id,
        ...data
      }));
      return { success: true, data: courses };
    } catch (error) {
      console.error("Error getting all courses:", error);
      return { success: false, error };
    }
  },

  // Get courses by faculty
  getCoursesByFaculty: async (facultyId) => {
    try {
      const courses = Object.entries(mockDatabase.courses)
        .filter(([_, course]) => course.facultyId === facultyId)
        .map(([id, data]) => ({
          id,
          ...data
        }));
      
      return { success: true, data: courses };
    } catch (error) {
      console.error("Error getting courses by faculty:", error);
      return { success: false, error };
    }
  },

  // Assign faculty to course
  assignFacultyToCourse: async (courseId, facultyId) => {
    try {
      if (!mockDatabase.courses[courseId]) {
        return { success: false, error: 'Course not found' };
      }
      
      mockDatabase.courses[courseId].facultyId = facultyId;
      mockDatabase.courses[courseId].updatedAt = timestamp();
      
      return { success: true };
    } catch (error) {
      console.error("Error assigning faculty to course:", error);
      return { success: false, error };
    }
  },

  // Enroll students in course
  enrollStudentsInCourse: async (courseId, studentIds) => {
    try {
      if (!mockDatabase.courses[courseId]) {
        return { success: false, error: 'Course not found' };
      }
      
      // Initialize studentIds array if it doesn't exist
      if (!mockDatabase.courses[courseId].studentIds) {
        mockDatabase.courses[courseId].studentIds = [];
      }
      
      // Add student IDs to the course
      studentIds.forEach(studentId => {
        if (!mockDatabase.courses[courseId].studentIds.includes(studentId)) {
          mockDatabase.courses[courseId].studentIds.push(studentId);
        }
      });
      
      mockDatabase.courses[courseId].updatedAt = timestamp();
      
      // Create enrollment records
      studentIds.forEach(studentId => {
        const enrollmentId = generateId();
        mockDatabase.enrollments[enrollmentId] = {
          courseId,
          studentId,
          enrollmentDate: timestamp(),
          status: 'active',
          createdAt: timestamp(),
          updatedAt: timestamp()
        };
      });
      
      return { success: true };
    } catch (error) {
      console.error("Error enrolling students in course:", error);
      return { success: false, error };
    }
  },

  // Remove student from course
  removeStudentFromCourse: async (courseId, studentId) => {
    try {
      if (!mockDatabase.courses[courseId]) {
        return { success: false, error: 'Course not found' };
      }
      
      if (!mockDatabase.courses[courseId].studentIds) {
        return { success: true }; // Nothing to remove
      }
      
      // Remove student ID from course
      mockDatabase.courses[courseId].studentIds = 
        mockDatabase.courses[courseId].studentIds.filter(id => id !== studentId);
      
      mockDatabase.courses[courseId].updatedAt = timestamp();
      
      // Remove enrollment records
      Object.entries(mockDatabase.enrollments).forEach(([id, enrollment]) => {
        if (enrollment.courseId === courseId && enrollment.studentId === studentId) {
          delete mockDatabase.enrollments[id];
        }
      });
      
      return { success: true };
    } catch (error) {
      console.error("Error removing student from course:", error);
      return { success: false, error };
    }
  }
};

// Marks/Grades-related operations
export const marksOperations = {
  // Create/update marks for an assessment
  recordMarks: async (marksData) => {
    try {
      const { courseId, assessmentName, assessmentType, studentMarks, totalMarks, date } = marksData;
      
      // Create a unique ID for the assessment
      const assessmentId = `${courseId}_${assessmentType}_${assessmentName.replace(/\s+/g, '_')}`;
      
      mockDatabase.marks[assessmentId] = {
        courseId,
        assessmentName,
        assessmentType,
        totalMarks,
        date: date || new Date().toISOString().split('T')[0],
        studentMarks,
        createdAt: timestamp(),
        updatedAt: timestamp()
      };
      
      return { success: true };
    } catch (error) {
      console.error("Error recording marks:", error);
      return { success: false, error };
    }
  },

  // Get marks for a specific assessment
  getAssessmentMarks: async (courseId, assessmentType, assessmentName) => {
    try {
      // Create the assessment ID
      const assessmentId = `${courseId}_${assessmentType}_${assessmentName.replace(/\s+/g, '_')}`;
      
      const marks = mockDatabase.marks[assessmentId];
      if (marks) {
        return { success: true, data: { id: assessmentId, ...marks } };
      } else {
        return { success: false, error: 'Assessment marks not found' };
      }
    } catch (error) {
      console.error("Error getting assessment marks:", error);
      return { success: false, error };
    }
  },

  // Get all marks for a course
  getCourseMarks: async (courseId) => {
    try {
      const marksRecords = Object.entries(mockDatabase.marks)
        .filter(([_, record]) => record.courseId === courseId)
        .map(([id, data]) => ({
          id,
          ...data
        }));
      
      return { success: true, data: marksRecords };
    } catch (error) {
      console.error("Error getting course marks:", error);
      return { success: false, error };
    }
  },

  // Get marks for a specific student
  getStudentMarks: async (studentId) => {
    try {
      const marksRecords = [];
      
      Object.entries(mockDatabase.marks).forEach(([id, record]) => {
        if (record.studentMarks && record.studentMarks[studentId] !== undefined) {
          marksRecords.push({
            id,
            courseId: record.courseId,
            assessmentName: record.assessmentName,
            assessmentType: record.assessmentType,
            totalMarks: record.totalMarks,
            marks: record.studentMarks[studentId],
            date: record.date
          });
        }
      });
      
      return { success: true, data: marksRecords };
    } catch (error) {
      console.error("Error getting student marks:", error);
      return { success: false, error };
    }
  },

  // Get student marks for a specific course
  getStudentCourseMarks: async (studentId, courseId) => {
    try {
      const marksRecords = [];
      
      Object.entries(mockDatabase.marks).forEach(([id, record]) => {
        if (
          record.courseId === courseId && 
          record.studentMarks && 
          record.studentMarks[studentId] !== undefined
        ) {
          marksRecords.push({
            id,
            assessmentName: record.assessmentName,
            assessmentType: record.assessmentType,
            totalMarks: record.totalMarks,
            marks: record.studentMarks[studentId],
            date: record.date
          });
        }
      });
      
      return { success: true, data: marksRecords };
    } catch (error) {
      console.error("Error getting student course marks:", error);
      return { success: false, error };
    }
  }
};

// Module for message operations
const messages = {
  // Send a message from parent to faculty
  sendMessage: async (parentId, teacherId, messageData) => {
    try {
      const messageId = generateId();
      mockDatabase.messages[messageId] = {
        parentId,
        teacherId,
        message: messageData.message,
        subject: messageData.subject,
        timestamp: new Date(),
        read: false,
        createdAt: timestamp(),
        updatedAt: timestamp()
      };
      
      return { success: true, data: { id: messageId } };
    } catch (error) {
      console.error('Error sending message:', error);
      return { success: false, error: error.message };
    }
  },
  
  // Get messages sent to a faculty member
  getFacultyMessages: async (facultyId) => {
    try {
      const messages = Object.entries(mockDatabase.messages)
        .filter(([_, msg]) => msg.teacherId === facultyId)
        .map(([id, data]) => ({
          id,
          ...data,
        }))
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      
      return { success: true, data: messages };
    } catch (error) {
      console.error('Error getting faculty messages:', error);
      return { success: false, error: error.message };
    }
  },
  
  // Get messages sent by a parent
  getParentMessages: async (parentId) => {
    try {
      const messages = Object.entries(mockDatabase.messages)
        .filter(([_, msg]) => msg.parentId === parentId)
        .map(([id, data]) => ({
          id,
          ...data,
        }))
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      
      return { success: true, data: messages };
    } catch (error) {
      console.error('Error getting parent messages:', error);
      return { success: false, error: error.message };
    }
  },
  
  // Mark a message as read
  markMessageAsRead: async (messageId) => {
    try {
      if (!mockDatabase.messages[messageId]) {
        return { success: false, error: 'Message not found' };
      }
      
      mockDatabase.messages[messageId].read = true;
      mockDatabase.messages[messageId].updatedAt = timestamp();
      
      return { success: true };
    } catch (error) {
      console.error('Error marking message as read:', error);
      return { success: false, error: error.message };
    }
  }
};

// Attendance-related operations
export const attendanceOperations = {
  // Record attendance for a course on a specific date
  recordAttendance: async (attendanceData) => {
    try {
      const { courseId, date, facultyId, studentRecords } = attendanceData;
      const id = `${courseId}_${date}`;
      
      mockDatabase.attendance[id] = {
        courseId,
        date,
        facultyId,
        studentRecords,
        createdAt: timestamp(),
        updatedAt: timestamp()
      };
      
      return { success: true, data: { id } };
    } catch (error) {
      console.error("Error recording attendance:", error);
      return { success: false, error };
    }
  },
  
  // Update attendance for a course on a specific date
  updateAttendance: async (courseId, date, studentRecords) => {
    try {
      const id = `${courseId}_${date}`;
      
      if (!mockDatabase.attendance[id]) {
        return { success: false, error: 'Attendance record not found' };
      }
      
      mockDatabase.attendance[id] = {
        ...mockDatabase.attendance[id],
        studentRecords,
        updatedAt: timestamp()
      };
      
      return { success: true };
    } catch (error) {
      console.error("Error updating attendance:", error);
      return { success: false, error };
    }
  },
  
  // Get attendance for a specific course on a specific date
  getAttendance: async (courseId, date) => {
    try {
      const id = `${courseId}_${date}`;
      const attendance = mockDatabase.attendance[id];
      
      if (attendance) {
        return { success: true, data: { id, ...attendance } };
      } else {
        return { success: false, error: 'Attendance record not found' };
      }
    } catch (error) {
      console.error("Error getting attendance:", error);
      return { success: false, error };
    }
  },
  
  // Get all attendance records for a course
  getCourseAttendance: async (courseId) => {
    try {
      const attendance = Object.entries(mockDatabase.attendance)
        .filter(([id, data]) => data.courseId === courseId)
        .map(([id, data]) => ({
          id,
          ...data
        }));
      
      return { success: true, data: attendance };
    } catch (error) {
      console.error("Error getting course attendance:", error);
      return { success: false, error };
    }
  },
  
  // Get attendance records for a student across all courses
  getStudentAttendance: async (studentId) => {
    try {
      const attendance = Object.entries(mockDatabase.attendance)
        .filter(([id, data]) => data.studentRecords && data.studentRecords[studentId])
        .map(([id, data]) => ({
          id,
          courseId: data.courseId,
          date: data.date,
          status: data.studentRecords[studentId]
        }));
      
      return { success: true, data: attendance };
    } catch (error) {
      console.error("Error getting student attendance:", error);
      return { success: false, error };
    }
  },
  
  // Get attendance percentage for a student in a specific course
  getStudentAttendancePercentage: async (studentId, courseId) => {
    try {
      const attendance = Object.entries(mockDatabase.attendance)
        .filter(([id, data]) => 
          data.courseId === courseId && 
          data.studentRecords && 
          data.studentRecords[studentId]
        )
        .map(([id, data]) => ({
          date: data.date,
          status: data.studentRecords[studentId]
        }));
      
      if (attendance.length === 0) {
        return { success: true, data: { percentage: 0 } };
      }
      
      const present = attendance.filter(record => record.status === 'present').length;
      const percentage = (present / attendance.length) * 100;
      
      return { success: true, data: { 
        percentage: Math.round(percentage * 10) / 10,
        totalClasses: attendance.length,
        present: present,
        absent: attendance.filter(record => record.status === 'absent').length,
        late: attendance.filter(record => record.status === 'late').length
      }};
    } catch (error) {
      console.error("Error calculating attendance percentage:", error);
      return { success: false, error };
    }
  }
};

// Add some sample data for demo mode
// Sample faculty
const setupSampleData = () => {
  try {
    // Sample users
    userOperations.createUser({
      name: 'John Smith',
      email: 'john.smith@example.com',
      role: 'Faculty',
      status: 'Active'
    });
    
    userOperations.createUser({
      name: 'Emily Johnson',
      email: 'emily.j@example.com',
      role: 'Student',
      status: 'Active'
    });
    
    userOperations.createUser({
      name: 'Robert Davis',
      email: 'robert.d@example.com',
      role: 'Student',
      status: 'Active'
    });
    
    userOperations.createUser({
      name: 'Sarah Miller',
      email: 'sarah.m@example.com',
      role: 'Parent',
      status: 'Active'
    });
    
    userOperations.createUser({
      name: 'James Wilson',
      email: 'james.w@example.com',
      role: 'Faculty',
      status: 'Inactive'
    });

    // Sample faculty
    facultyOperations.createFaculty('faculty1', {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      department: 'Computer Science',
      position: 'Professor',
      specialization: 'Machine Learning',
      employeeId: 'F001'
    });

    // Sample students
    studentOperations.createStudent('student1', {
      firstName: 'Alice',
      lastName: 'Johnson',
      email: 'alice@example.com',
      rollNumber: 'S001',
      classId: '10',
      section: 'A',
      gender: 'Female'
    });

    studentOperations.createStudent('student2', {
      firstName: 'Bob',
      lastName: 'Smith',
      email: 'bob@example.com',
      rollNumber: 'S002',
      classId: '10',
      section: 'A',
      gender: 'Male'
    });

    // Sample course
    courseOperations.createCourse({
      name: 'Introduction to Programming',
      code: 'CS101',
      description: 'Basic programming concepts using Python',
      classId: '10',
      section: 'A',
      facultyId: 'faculty1',
      academicYear: '2023-2024',
      semester: '1',
      studentIds: ['student1', 'student2']
    }).then(result => {
      const courseId = result.data.id;

      // Sample enrollments
      const enrollment1Id = generateId();
      mockDatabase.enrollments[enrollment1Id] = {
        courseId,
        studentId: 'student1',
        enrollmentDate: '2023-08-15',
        status: 'active',
        createdAt: timestamp(),
        updatedAt: timestamp()
      };

      const enrollment2Id = generateId();
      mockDatabase.enrollments[enrollment2Id] = {
        courseId,
        studentId: 'student2',
        enrollmentDate: '2023-08-15',
        status: 'active',
        createdAt: timestamp(),
        updatedAt: timestamp()
      };

      // Sample marks
      marksOperations.recordMarks({
        courseId,
        assessmentName: 'Midterm Exam',
        assessmentType: 'exam',
        totalMarks: 100,
        date: '2023-10-15',
        studentMarks: {
          student1: 85,
          student2: 72
        }
      });
    });

    // Sample messages
    const message1Id = generateId();
    mockDatabase.messages[message1Id] = {
      parentId: 'parent1',
      teacherId: 'faculty1',
      message: 'Hello Dr. Doe, I wanted to discuss Alex\'s progress in your Computer Science class. He mentioned having difficulty with the recent programming assignment. Could we schedule a meeting next week?',
      subject: 'Alex\'s Progress',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      read: true,
      parentName: 'Maria Johnson',
      createdAt: timestamp(),
      updatedAt: timestamp()
    };

    const message2Id = generateId();
    mockDatabase.messages[message2Id] = {
      parentId: 'parent1',
      teacherId: 'faculty1',
      message: 'Dr. Doe, Alex will be absent for tomorrow\'s class due to a doctor\'s appointment. Could you please let me know what material will be covered so he can catch up?',
      subject: 'Absence Notification',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      read: false,
      parentName: 'Maria Johnson',
      createdAt: timestamp(),
      updatedAt: timestamp()
    };

    const message3Id = generateId();
    mockDatabase.messages[message3Id] = {
      parentId: 'parent2',
      teacherId: 'faculty1',
      message: 'I would like to discuss Sarah\'s recent quiz results. Her grade was much lower than expected, and I want to understand how we can help her improve.',
      subject: 'Quiz Results Discussion',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
      read: false,
      parentName: 'Robert Smith',
      createdAt: timestamp(),
      updatedAt: timestamp()
    };

    console.log('Sample data created for demo mode');
  } catch (error) {
    console.error('Error creating sample data:', error);
  }
};

// Initialize sample data
setupSampleData();

// Export all operations as a single object
export default {
  faculty: facultyOperations,
  student: studentOperations,
  course: courseOperations,
  marks: marksOperations,
  user: userOperations,
  messages: messages,
  attendance: attendanceOperations
}; 