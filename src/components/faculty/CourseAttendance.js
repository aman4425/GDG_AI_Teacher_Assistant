import React, { useState, useEffect } from 'react';
import {
  Typography,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  IconButton,
  Snackbar,
  Box,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  makeStyles
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import {
  Add as AddIcon,
  Save as SaveIcon,
  History as HistoryIcon,
  CalendarToday as CalendarIcon
} from '@material-ui/icons';
import { useAuth } from '../../auth/AuthContext';
import { useDatabase } from '../../hooks/useDatabase';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3)
  },
  title: {
    marginBottom: theme.spacing(3)
  },
  paper: {
    padding: theme.spacing(3),
    marginBottom: theme.spacing(3)
  },
  formControl: {
    minWidth: 200,
    marginRight: theme.spacing(2),
    marginBottom: theme.spacing(2)
  },
  actionButton: {
    marginRight: theme.spacing(1),
    marginBottom: theme.spacing(2)
  },
  tableContainer: {
    marginTop: theme.spacing(3)
  },
  attendancePresent: {
    color: theme.palette.success.main,
    fontWeight: 'bold'
  },
  attendanceAbsent: {
    color: theme.palette.error.main,
    fontWeight: 'bold'
  },
  attendanceExcused: {
    color: theme.palette.warning.main,
    fontWeight: 'bold'
  },
  headerActions: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(3)
  },
  courseTitle: {
    fontWeight: 'bold'
  },
  historyButton: {
    marginLeft: theme.spacing(1)
  }
}));

function CourseAttendance() {
  const classes = useStyles();
  const { currentUser, demoMode } = useAuth();
  const { getCollection, addDocument, updateDocument } = useDatabase();
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [loading, setLoading] = useState(false);
  const [addCourseDialogOpen, setAddCourseDialogOpen] = useState(false);
  const [newCourse, setNewCourse] = useState({
    name: '',
    code: '',
    semester: '',
    academicYear: new Date().getFullYear().toString() + '-' + (new Date().getFullYear() + 1).toString()
  });
  const [viewingHistory, setViewingHistory] = useState(false);
  const [attendanceHistory, setAttendanceHistory] = useState([]);

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      fetchStudents();
      fetchAttendance();
    }
  }, [selectedCourse, selectedDate]);

  // Fetch available courses
  const fetchCourses = async () => {
    setLoading(true);
    try {
      // In demo mode, use mock data
      if (demoMode) {
        const mockCourses = getMockCourses();
        setCourses(mockCourses);
      } else {
        // In real application, fetch from Firestore
        const data = await getCollection('courses', {
          where: ['facultyId', '==', currentUser.uid]
        });
        setCourses(data);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      showSnackbar('Error fetching courses', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Fetch students enrolled in the selected course
  const fetchStudents = async () => {
    setLoading(true);
    try {
      // In demo mode, use mock data
      if (demoMode) {
        const mockStudents = getMockStudents();
        setStudents(mockStudents);
      } else {
        // In real application, fetch from Firestore
        const data = await getCollection('enrollments', {
          where: ['courseId', '==', selectedCourse]
        });
        setStudents(data);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      showSnackbar('Error fetching enrolled students', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Fetch attendance records for the selected date and course
  const fetchAttendance = async () => {
    setLoading(true);
    try {
      // In demo mode, use mock data
      if (demoMode) {
        const mockAttendance = getMockAttendance(selectedCourse, selectedDate);
        setAttendance(mockAttendance);
      } else {
        // In real application, fetch from Firestore
        const data = await getCollection('attendance', {
          where: [
            ['courseId', '==', selectedCourse],
            ['date', '==', selectedDate]
          ]
        });
        setAttendance(data);
      }
    } catch (error) {
      console.error('Error fetching attendance:', error);
      showSnackbar('Error fetching attendance records', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Handle course selection change
  const handleCourseChange = (event) => {
    setSelectedCourse(event.target.value);
    setViewingHistory(false);
  };

  // Handle date change
  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
    setViewingHistory(false);
  };

  // Handle attendance status change
  const handleAttendanceChange = (studentId, status) => {
    setAttendance(prevAttendance => {
      // Find if record already exists
      const existingIndex = prevAttendance.findIndex(
        record => record.studentId === studentId
      );

      if (existingIndex >= 0) {
        // Update existing record
        const updatedAttendance = [...prevAttendance];
        updatedAttendance[existingIndex] = {
          ...updatedAttendance[existingIndex],
          status
        };
        return updatedAttendance;
      } else {
        // Create new record
        return [
          ...prevAttendance,
          {
            id: `attendance_${Date.now()}_${studentId}`,
            courseId: selectedCourse,
            studentId,
            date: selectedDate,
            status,
            timestamp: new Date().toISOString()
          }
        ];
      }
    });
  };

  // Save attendance records
  const saveAttendance = async () => {
    if (!selectedCourse || !selectedDate) {
      showSnackbar('Please select a course and date', 'error');
      return;
    }

    if (attendance.length === 0) {
      showSnackbar('No attendance records to save', 'error');
      return;
    }

    setLoading(true);
    try {
      // In demo mode, just show success message
      if (demoMode) {
        showSnackbar('Attendance saved successfully', 'success');
      } else {
        // In real application, save to Firestore
        for (const record of attendance) {
          if (record.id.startsWith('attendance_')) {
            // New record, add document
            await addDocument('attendance', record);
          } else {
            // Existing record, update document
            await updateDocument('attendance', record.id, record);
          }
        }
        showSnackbar('Attendance saved successfully', 'success');
      }
    } catch (error) {
      console.error('Error saving attendance:', error);
      showSnackbar('Error saving attendance records', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Show snackbar message
  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  // Handle snackbar close
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  // Handle add course dialog
  const handleAddCourseDialogOpen = () => {
    setAddCourseDialogOpen(true);
  };

  const handleAddCourseDialogClose = () => {
    setAddCourseDialogOpen(false);
  };

  const handleNewCourseChange = (field) => (event) => {
    setNewCourse({
      ...newCourse,
      [field]: event.target.value
    });
  };

  const handleAddCourse = async () => {
    if (!newCourse.name || !newCourse.code) {
      showSnackbar('Course name and code are required', 'error');
      return;
    }

    setLoading(true);
    try {
      const courseData = {
        id: `course_${Date.now()}`,
        name: newCourse.name,
        code: newCourse.code,
        semester: newCourse.semester,
        academicYear: newCourse.academicYear,
        facultyId: currentUser.uid,
        facultyName: currentUser.displayName || 'Faculty',
        createdAt: new Date().toISOString()
      };

      // In demo mode, just add to local state
      if (demoMode) {
        setCourses([...courses, courseData]);
        showSnackbar('Course added successfully', 'success');
      } else {
        // In real application, save to Firestore
        await addDocument('courses', courseData);
        // Refresh courses
        await fetchCourses();
        showSnackbar('Course added successfully', 'success');
      }

      // Reset form and close dialog
      setNewCourse({
        name: '',
        code: '',
        semester: '',
        academicYear: new Date().getFullYear().toString() + '-' + (new Date().getFullYear() + 1).toString()
      });
      handleAddCourseDialogClose();
    } catch (error) {
      console.error('Error adding course:', error);
      showSnackbar('Error adding course', 'error');
    } finally {
      setLoading(false);
    }
  };

  // View attendance history
  const viewAttendanceHistory = async () => {
    if (!selectedCourse) {
      showSnackbar('Please select a course', 'error');
      return;
    }

    setLoading(true);
    try {
      // In demo mode, use mock data
      if (demoMode) {
        const mockHistory = getMockAttendanceHistory(selectedCourse);
        setAttendanceHistory(mockHistory);
        setViewingHistory(true);
      } else {
        // In real application, fetch from Firestore
        const data = await getCollection('attendance', {
          where: ['courseId', '==', selectedCourse],
          orderBy: ['date', 'desc']
        });
        setAttendanceHistory(data);
        setViewingHistory(true);
      }
    } catch (error) {
      console.error('Error fetching attendance history:', error);
      showSnackbar('Error fetching attendance history', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Return to attendance taking
  const returnToAttendance = () => {
    setViewingHistory(false);
  };

  // Get attendance status for a student
  const getAttendanceStatus = (studentId) => {
    const record = attendance.find(a => a.studentId === studentId);
    return record ? record.status : 'absent';
  };

  // Get student name by ID
  const getStudentName = (studentId) => {
    const student = students.find(s => s.id === studentId);
    return student ? student.name : 'Unknown Student';
  };

  // Mock data generators
  const getMockCourses = () => {
    return [
      { id: 'course1', name: 'Introduction to Computer Science', code: 'CS101', semester: 'Fall', academicYear: '2023-2024', facultyId: 'faculty1', facultyName: 'Dr. John Smith' },
      { id: 'course2', name: 'Data Structures and Algorithms', code: 'CS201', semester: 'Fall', academicYear: '2023-2024', facultyId: 'faculty1', facultyName: 'Dr. John Smith' },
      { id: 'course3', name: 'Database Systems', code: 'CS301', semester: 'Fall', academicYear: '2023-2024', facultyId: 'faculty1', facultyName: 'Dr. John Smith' }
    ];
  };

  const getMockStudents = () => {
    return [
      { id: 'student1', name: 'Emma Johnson', email: 'emma.j@example.com', studentId: 'S1001' },
      { id: 'student2', name: 'Ethan Williams', email: 'ethan.w@example.com', studentId: 'S1002' },
      { id: 'student3', name: 'Olivia Davis', email: 'olivia.d@example.com', studentId: 'S1003' },
      { id: 'student4', name: 'Noah Martin', email: 'noah.m@example.com', studentId: 'S1004' },
      { id: 'student5', name: 'Sophia Wilson', email: 'sophia.w@example.com', studentId: 'S1005' }
    ];
  };

  const getMockAttendance = (courseId, date) => {
    // For demo, generate random attendance or use predefined one
    const today = new Date().toISOString().split('T')[0];
    
    // For today, show empty attendance to allow entry
    if (date === today) {
      return [];
    }
    
    // For other dates, show mock attendance
    return [
      { id: 'att1', courseId, studentId: 'student1', date, status: 'present', timestamp: '2023-05-10T09:00:00Z' },
      { id: 'att2', courseId, studentId: 'student2', date, status: 'present', timestamp: '2023-05-10T09:00:00Z' },
      { id: 'att3', courseId, studentId: 'student3', date, status: 'absent', timestamp: '2023-05-10T09:00:00Z' },
      { id: 'att4', courseId, studentId: 'student4', date, status: 'excused', timestamp: '2023-05-10T09:00:00Z' },
      { id: 'att5', courseId, studentId: 'student5', date, status: 'present', timestamp: '2023-05-10T09:00:00Z' }
    ];
  };

  const getMockAttendanceHistory = (courseId) => {
    return [
      ...getMockAttendance(courseId, '2023-05-15'),
      ...getMockAttendance(courseId, '2023-05-14'),
      ...getMockAttendance(courseId, '2023-05-13'),
      ...getMockAttendance(courseId, '2023-05-12'),
      ...getMockAttendance(courseId, '2023-05-11'),
      ...getMockAttendance(courseId, '2023-05-10')
    ];
  };

  return (
    <div className={classes.root}>
      <div className={classes.headerActions}>
        <Typography variant="h4" className={classes.title}>
          Attendance Management
        </Typography>

        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAddCourseDialogOpen}
        >
          Add Course
        </Button>
      </div>

      <Paper className={classes.paper}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <FormControl variant="outlined" className={classes.formControl} fullWidth>
              <InputLabel>Select Course</InputLabel>
              <Select
                value={selectedCourse}
                onChange={handleCourseChange}
                label="Select Course"
              >
                <MenuItem value="">
                  <em>Select a course</em>
                </MenuItem>
                {courses.map((course) => (
                  <MenuItem key={course.id} value={course.id}>
                    {course.code} - {course.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {selectedCourse && !viewingHistory && (
            <Grid item xs={12} md={4}>
              <TextField
                label="Date"
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
                variant="outlined"
                fullWidth
                className={classes.formControl}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
          )}

          {selectedCourse && (
            <Grid item xs={12} md={4}>
              {viewingHistory ? (
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={returnToAttendance}
                  className={classes.actionButton}
                >
                  Return to Attendance
                </Button>
              ) : (
                <>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<SaveIcon />}
                    onClick={saveAttendance}
                    className={classes.actionButton}
                    disabled={loading}
                  >
                    Save Attendance
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<HistoryIcon />}
                    onClick={viewAttendanceHistory}
                    className={classes.historyButton}
                    disabled={loading}
                  >
                    View History
                  </Button>
                </>
              )}
            </Grid>
          )}
        </Grid>

        {selectedCourse ? (
          viewingHistory ? (
            // Attendance History View
            <div className={classes.tableContainer}>
              <Typography variant="h6" gutterBottom>
                Attendance History for {courses.find(c => c.id === selectedCourse)?.name}
              </Typography>
              
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Student</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {attendanceHistory.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>{record.date}</TableCell>
                        <TableCell>{getStudentName(record.studentId)}</TableCell>
                        <TableCell>
                          <span
                            className={
                              record.status === 'present'
                                ? classes.attendancePresent
                                : record.status === 'excused'
                                ? classes.attendanceExcused
                                : classes.attendanceAbsent
                            }
                          >
                            {record.status.toUpperCase()}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          ) : (
            // Attendance Taking View
            <div className={classes.tableContainer}>
              <Typography variant="h6" gutterBottom>
                Attendance for {selectedDate}
              </Typography>
              
              {students.length > 0 ? (
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Student ID</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Present</TableCell>
                        <TableCell>Absent</TableCell>
                        <TableCell>Excused</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {students.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell>{student.studentId}</TableCell>
                          <TableCell>{student.name}</TableCell>
                          <TableCell>
                            <Checkbox
                              checked={getAttendanceStatus(student.id) === 'present'}
                              onChange={() => handleAttendanceChange(student.id, 'present')}
                              color="primary"
                            />
                          </TableCell>
                          <TableCell>
                            <Checkbox
                              checked={getAttendanceStatus(student.id) === 'absent'}
                              onChange={() => handleAttendanceChange(student.id, 'absent')}
                              color="secondary"
                            />
                          </TableCell>
                          <TableCell>
                            <Checkbox
                              checked={getAttendanceStatus(student.id) === 'excused'}
                              onChange={() => handleAttendanceChange(student.id, 'excused')}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography variant="body1">
                  No students enrolled in this course.
                </Typography>
              )}
            </div>
          )
        ) : (
          // No course selected
          <Box mt={4} textAlign="center">
            <Typography variant="h6" color="textSecondary">
              Please select a course to manage attendance.
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Add Course Dialog */}
      <Dialog open={addCourseDialogOpen} onClose={handleAddCourseDialogClose}>
        <DialogTitle>Add New Course</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Course Name"
                value={newCourse.name}
                onChange={handleNewCourseChange('name')}
                fullWidth
                margin="normal"
                variant="outlined"
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Course Code"
                value={newCourse.code}
                onChange={handleNewCourseChange('code')}
                fullWidth
                margin="normal"
                variant="outlined"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Semester"
                value={newCourse.semester}
                onChange={handleNewCourseChange('semester')}
                fullWidth
                margin="normal"
                variant="outlined"
                select
              >
                <MenuItem value="">Select Semester</MenuItem>
                <MenuItem value="Fall">Fall</MenuItem>
                <MenuItem value="Spring">Spring</MenuItem>
                <MenuItem value="Summer">Summer</MenuItem>
                <MenuItem value="Winter">Winter</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Academic Year"
                value={newCourse.academicYear}
                onChange={handleNewCourseChange('academicYear')}
                fullWidth
                margin="normal"
                variant="outlined"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddCourseDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddCourse} color="primary" variant="contained" disabled={loading}>
            Add Course
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for messages */}
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default CourseAttendance; 