import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  makeStyles,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  CircularProgress,
  Snackbar,
  IconButton,
  Box,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@material-ui/core';
import {
  Save as SaveIcon,
  Close as CloseIcon,
  Event as CalendarIcon,
  History as HistoryIcon
} from '@material-ui/icons';
import { Alert } from '@material-ui/lab';
import { useDatabase } from '../../hooks/useDatabase';
import { format } from 'date-fns';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  paper: {
    padding: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 200,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  tableContainer: {
    marginTop: theme.spacing(3),
  },
  headerRow: {
    backgroundColor: theme.palette.primary.light,
    '& .MuiTableCell-head': {
      color: 'white',
      fontWeight: 'bold',
    },
  },
  statusCell: {
    minWidth: 120,
  },
  presentChip: {
    backgroundColor: theme.palette.success.light,
    color: theme.palette.success.dark,
  },
  absentChip: {
    backgroundColor: theme.palette.error.light,
    color: theme.palette.error.dark,
  },
  lateChip: {
    backgroundColor: theme.palette.warning.light,
    color: theme.palette.warning.dark,
  },
  actionButton: {
    marginRight: theme.spacing(1),
  },
  dateField: {
    marginRight: theme.spacing(2),
    width: 200,
  },
  historyTable: {
    margin: theme.spacing(2, 0),
  },
  percentageGood: {
    color: theme.palette.success.dark,
    fontWeight: 'bold',
  },
  percentageWarning: {
    color: theme.palette.warning.dark,
    fontWeight: 'bold',
  },
  percentageBad: {
    color: theme.palette.error.dark,
    fontWeight: 'bold',
  },
}));

const AttendanceManagement = () => {
  const classes = useStyles();
  const { 
    loading, error, 
    getAllCourses, getMyTeachingCourses, getStudentsByClass,
    recordAttendance, updateAttendance, getAttendance, getCourseAttendance,
    getStudentAttendancePercentage
  } = useDatabase();

  // State
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [students, setStudents] = useState([]);
  const [attendanceDate, setAttendanceDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [attendance, setAttendance] = useState({});
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [attendanceStats, setAttendanceStats] = useState({});
  
  // Fetch courses taught by faculty
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const result = await getMyTeachingCourses();
        if (result.success) {
          setCourses(result.data);
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };
    
    fetchCourses();
  }, [getMyTeachingCourses]);
  
  // Fetch students when course changes
  useEffect(() => {
    if (!selectedCourse) return;
    
    const fetchStudents = async () => {
      try {
        const course = courses.find(c => c.id === selectedCourse);
        if (!course) return;
        
        // Get students by class and section
        const result = await getStudentsByClass(course.classId, course.section);
        if (result.success) {
          setStudents(result.data);
          
          // Initialize empty attendance object
          const newAttendance = {};
          result.data.forEach(student => {
            newAttendance[student.id] = 'present'; // Default to present
          });
          setAttendance(newAttendance);
          
          // Check if attendance already exists for this date and course
          const existingAttendance = await getAttendance(selectedCourse, attendanceDate);
          if (existingAttendance.success && existingAttendance.data) {
            setAttendance(existingAttendance.data.studentRecords);
          }
        }
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };
    
    fetchStudents();
  }, [selectedCourse, courses, attendanceDate, getStudentsByClass, getAttendance]);
  
  // Handle course change
  const handleCourseChange = (event) => {
    setSelectedCourse(event.target.value);
  };
  
  // Handle date change
  const handleDateChange = (event) => {
    setAttendanceDate(event.target.value);
  };
  
  // Handle attendance status change
  const handleAttendanceChange = (studentId, status) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: status
    }));
  };
  
  // Save attendance
  const handleSaveAttendance = async () => {
    if (!selectedCourse || !attendanceDate) {
      setSnackbar({
        open: true,
        message: 'Please select a course and date',
        severity: 'error'
      });
      return;
    }
    
    setSaving(true);
    
    try {
      // Check if attendance already exists for this date and course
      const existingAttendance = await getAttendance(selectedCourse, attendanceDate);
      
      let result;
      if (existingAttendance.success && existingAttendance.data) {
        // Update existing attendance
        result = await updateAttendance(selectedCourse, attendanceDate, attendance);
      } else {
        // Record new attendance
        result = await recordAttendance({
          courseId: selectedCourse,
          date: attendanceDate,
          facultyId: 'current-faculty-id', // In a real app, use logged-in faculty ID
          studentRecords: attendance
        });
      }
      
      if (result.success) {
        setSnackbar({
          open: true,
          message: 'Attendance saved successfully',
          severity: 'success'
        });
      } else {
        setSnackbar({
          open: true,
          message: 'Failed to save attendance: ' + (result.error || 'Unknown error'),
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Error saving attendance:', error);
      setSnackbar({
        open: true,
        message: 'Error saving attendance: ' + error.message,
        severity: 'error'
      });
    } finally {
      setSaving(false);
    }
  };
  
  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };
  
  // Open attendance history dialog
  const handleOpenHistory = async () => {
    if (!selectedCourse) {
      setSnackbar({
        open: true,
        message: 'Please select a course first',
        severity: 'warning'
      });
      return;
    }
    
    try {
      const result = await getCourseAttendance(selectedCourse);
      if (result.success) {
        setAttendanceHistory(result.data.sort((a, b) => new Date(b.date) - new Date(a.date)));
        
        // Calculate student attendance statistics
        const stats = {};
        for (const student of students) {
          const percentageResult = await getStudentAttendancePercentage(student.id, selectedCourse);
          if (percentageResult.success) {
            stats[student.id] = percentageResult.data;
          }
        }
        setAttendanceStats(stats);
        
        setHistoryDialogOpen(true);
      } else {
        setSnackbar({
          open: true,
          message: 'Failed to fetch attendance history',
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Error fetching attendance history:', error);
      setSnackbar({
        open: true,
        message: 'Error fetching attendance history: ' + error.message,
        severity: 'error'
      });
    }
  };
  
  // Get attendance percentage color
  const getPercentageColor = (percentage) => {
    if (percentage >= 75) return classes.percentageGood;
    if (percentage >= 60) return classes.percentageWarning;
    return classes.percentageBad;
  };

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Typography variant="h5" gutterBottom>
          Attendance Management
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <FormControl className={classes.formControl} fullWidth>
              <InputLabel id="course-select-label">Select Course</InputLabel>
              <Select
                labelId="course-select-label"
                id="course-select"
                value={selectedCourse}
                onChange={handleCourseChange}
                disabled={loading}
              >
                <MenuItem value=""><em>None</em></MenuItem>
                {courses.map((course) => (
                  <MenuItem key={course.id} value={course.id}>
                    {course.name} ({course.code}) - {course.classId}{course.section}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box display="flex" alignItems="center">
              <TextField
                id="attendance-date"
                label="Attendance Date"
                type="date"
                value={attendanceDate}
                onChange={handleDateChange}
                className={classes.dateField}
                InputLabelProps={{
                  shrink: true,
                }}
                disabled={loading || !selectedCourse}
              />
              
              <Button
                variant="outlined"
                color="primary"
                startIcon={<HistoryIcon />}
                onClick={handleOpenHistory}
                disabled={loading || !selectedCourse}
              >
                View History
              </Button>
            </Box>
          </Grid>
        </Grid>
        
        {error && (
          <Alert severity="error" style={{ marginTop: 16 }}>
            {error}
          </Alert>
        )}
        
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 24 }}>
            <CircularProgress />
          </div>
        ) : selectedCourse && students.length > 0 ? (
          <>
            <TableContainer component={Paper} className={classes.tableContainer}>
              <Table>
                <TableHead className={classes.headerRow}>
                  <TableRow>
                    <TableCell>Student ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Attendance Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {students.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>{student.rollNumber || student.id}</TableCell>
                      <TableCell>{student.firstName} {student.lastName}</TableCell>
                      <TableCell className={classes.statusCell}>
                        <FormControl fullWidth>
                          <Select
                            value={attendance[student.id] || 'present'}
                            onChange={(e) => handleAttendanceChange(student.id, e.target.value)}
                          >
                            <MenuItem value="present">Present</MenuItem>
                            <MenuItem value="absent">Absent</MenuItem>
                            <MenuItem value="late">Late</MenuItem>
                          </Select>
                        </FormControl>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            
            <Box display="flex" justifyContent="flex-end" mt={2}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
                onClick={handleSaveAttendance}
                disabled={saving}
              >
                {saving ? <CircularProgress size={24} /> : 'Save Attendance'}
              </Button>
            </Box>
          </>
        ) : selectedCourse ? (
          <Typography variant="body1" style={{ padding: '24px', textAlign: 'center' }}>
            No students found for this course.
          </Typography>
        ) : (
          <Typography variant="body1" style={{ padding: '24px', textAlign: 'center' }}>
            Please select a course to manage attendance.
          </Typography>
        )}
      </Paper>
      
      {/* Attendance History Dialog */}
      <Dialog
        open={historyDialogOpen}
        onClose={() => setHistoryDialogOpen(false)}
        aria-labelledby="attendance-history-dialog-title"
        maxWidth="md"
        fullWidth
      >
        <DialogTitle id="attendance-history-dialog-title">
          Attendance History
        </DialogTitle>
        <DialogContent dividers>
          {attendanceHistory.length > 0 ? (
            <>
              <Typography variant="h6" gutterBottom>
                Daily Attendance Records
              </Typography>
              <TableContainer component={Paper} className={classes.historyTable}>
                <Table size="small">
                  <TableHead className={classes.headerRow}>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Present</TableCell>
                      <TableCell>Absent</TableCell>
                      <TableCell>Late</TableCell>
                      <TableCell>Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {attendanceHistory.map((record) => {
                      const studentRecords = record.studentRecords || {};
                      const present = Object.values(studentRecords).filter(s => s === 'present').length;
                      const absent = Object.values(studentRecords).filter(s => s === 'absent').length;
                      const late = Object.values(studentRecords).filter(s => s === 'late').length;
                      const total = Object.keys(studentRecords).length;
                      
                      return (
                        <TableRow key={record.date}>
                          <TableCell>{record.date}</TableCell>
                          <TableCell>{present}</TableCell>
                          <TableCell>{absent}</TableCell>
                          <TableCell>{late}</TableCell>
                          <TableCell>{total}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
              
              <Typography variant="h6" gutterBottom style={{ marginTop: 16 }}>
                Student Attendance Summary
              </Typography>
              <TableContainer component={Paper} className={classes.historyTable}>
                <Table size="small">
                  <TableHead className={classes.headerRow}>
                    <TableRow>
                      <TableCell>Student</TableCell>
                      <TableCell>Present</TableCell>
                      <TableCell>Absent</TableCell>
                      <TableCell>Late</TableCell>
                      <TableCell>Total Classes</TableCell>
                      <TableCell>Attendance %</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {students.map((student) => {
                      const stats = attendanceStats[student.id] || { 
                        present: 0, absent: 0, late: 0, totalClasses: 0, percentage: 0 
                      };
                      
                      return (
                        <TableRow key={student.id}>
                          <TableCell>{student.firstName} {student.lastName}</TableCell>
                          <TableCell>{stats.present}</TableCell>
                          <TableCell>{stats.absent}</TableCell>
                          <TableCell>{stats.late}</TableCell>
                          <TableCell>{stats.totalClasses}</TableCell>
                          <TableCell className={getPercentageColor(stats.percentage)}>
                            {stats.percentage}%
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          ) : (
            <Typography variant="body1" style={{ padding: 16, textAlign: 'center' }}>
              No attendance records found for this course.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setHistoryDialogOpen(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        action={
          <IconButton size="small" color="inherit" onClick={handleCloseSnackbar}>
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default AttendanceManagement; 