import React, { useState, useEffect } from 'react';
import { Button, Typography, Container, Paper, TextField, Grid, CircularProgress, Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { useDatabase } from '../hooks/useDatabase';
import { useAuth } from '../auth/AuthContext';

const DatabaseDemo = () => {
  const { currentUser, userRole } = useAuth();
  const { 
    loading, error,
    getAllFaculty, getAllStudents, getAllCourses,
    createCourse, createFacultyProfile, createStudentProfile
  } = useDatabase();
  
  const [faculty, setFaculty] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('info');
  
  // Form data for creating new entities
  const [newCourseData, setNewCourseData] = useState({
    name: '',
    code: '',
    description: '',
    classId: '',
    section: '',
    facultyId: '',
    academicYear: '2023-2024',
    semester: '1'
  });
  
  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        // Get faculty
        const facultyResult = await getAllFaculty();
        if (facultyResult.success) {
          setFaculty(facultyResult.data || []);
        }
        
        // Get students
        const studentsResult = await getAllStudents();
        if (studentsResult.success) {
          setStudents(studentsResult.data || []);
        }
        
        // Get courses
        const coursesResult = await getAllCourses();
        if (coursesResult.success) {
          setCourses(coursesResult.data || []);
        }
      } catch (error) {
        console.error('Error loading data:', error);
        showNotification('Failed to load data', 'error');
      }
    };
    
    loadData();
  }, [getAllFaculty, getAllStudents, getAllCourses]);
  
  // Handle form input changes
  const handleCourseInputChange = (e) => {
    const { name, value } = e.target;
    setNewCourseData({
      ...newCourseData,
      [name]: value
    });
  };
  
  // Handle creating a new course
  const handleCreateCourse = async () => {
    try {
      const result = await createCourse(newCourseData);
      if (result.success) {
        // Refresh courses list
        const coursesResult = await getAllCourses();
        if (coursesResult.success) {
          setCourses(coursesResult.data || []);
        }
        
        // Reset form
        setNewCourseData({
          name: '',
          code: '',
          description: '',
          classId: '',
          section: '',
          facultyId: '',
          academicYear: '2023-2024',
          semester: '1'
        });
        
        showNotification('Course created successfully', 'success');
      } else {
        showNotification(`Failed to create course: ${result.error}`, 'error');
      }
    } catch (error) {
      console.error('Error creating course:', error);
      showNotification('Failed to create course', 'error');
    }
  };
  
  // Sample data for demo accounts
  const createSampleData = async () => {
    try {
      // Create sample faculty profile
      await createFacultyProfile({
        firstName: 'John',
        lastName: 'Doe',
        email: currentUser?.email || 'faculty@example.com',
        department: 'Computer Science',
        position: 'Professor',
        employeeId: 'FACULTY001',
        contactNumber: '123-456-7890'
      });
      
      // Create sample student profile
      await createStudentProfile({
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'student@example.com',
        rollNumber: 'STU001',
        classId: '10',
        section: 'A',
        gender: 'Female',
        contactNumber: '987-654-3210'
      });
      
      // Refresh data
      const facultyResult = await getAllFaculty();
      if (facultyResult.success) {
        setFaculty(facultyResult.data || []);
      }
      
      const studentsResult = await getAllStudents();
      if (studentsResult.success) {
        setStudents(studentsResult.data || []);
      }
      
      showNotification('Sample data created successfully', 'success');
    } catch (error) {
      console.error('Error creating sample data:', error);
      showNotification('Failed to create sample data', 'error');
    }
  };
  
  // Show notification
  const showNotification = (message, severity = 'info') => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setShowAlert(true);
  };
  
  // Handle closing notification
  const handleCloseAlert = () => {
    setShowAlert(false);
  };
  
  return (
    <Container maxWidth="md" style={{ marginTop: '2rem' }}>
      <Paper style={{ padding: '2rem' }}>
        <Typography variant="h4" gutterBottom>
          Database Integration Demo
        </Typography>
        
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'center', margin: '1rem' }}>
            <CircularProgress />
          </div>
        )}
        
        {error && (
          <Alert severity="error" style={{ margin: '1rem 0' }}>
            {error}
          </Alert>
        )}
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper style={{ padding: '1rem', height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Faculty ({faculty.length})
              </Typography>
              {faculty.length > 0 ? (
                faculty.map((f) => (
                  <div key={f.id} style={{ marginBottom: '0.5rem' }}>
                    <Typography variant="body1">
                      {f.firstName} {f.lastName}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {f.department} - {f.position}
                    </Typography>
                  </div>
                ))
              ) : (
                <Typography variant="body2" color="textSecondary">
                  No faculty found
                </Typography>
              )}
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Paper style={{ padding: '1rem', height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Students ({students.length})
              </Typography>
              {students.length > 0 ? (
                students.map((s) => (
                  <div key={s.id} style={{ marginBottom: '0.5rem' }}>
                    <Typography variant="body1">
                      {s.firstName} {s.lastName}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Class {s.classId}{s.section ? `-${s.section}` : ''} - {s.rollNumber}
                    </Typography>
                  </div>
                ))
              ) : (
                <Typography variant="body2" color="textSecondary">
                  No students found
                </Typography>
              )}
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Paper style={{ padding: '1rem', height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Courses ({courses.length})
              </Typography>
              {courses.length > 0 ? (
                courses.map((c) => (
                  <div key={c.id} style={{ marginBottom: '0.5rem' }}>
                    <Typography variant="body1">
                      {c.name} ({c.code})
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Class {c.classId}{c.section ? `-${c.section}` : ''} - {c.semester}
                    </Typography>
                  </div>
                ))
              ) : (
                <Typography variant="body2" color="textSecondary">
                  No courses found
                </Typography>
              )}
            </Paper>
          </Grid>
          
          {userRole === 'admin' || userRole === 'faculty' ? (
            <Grid item xs={12}>
              <Paper style={{ padding: '1rem', marginTop: '1rem' }}>
                <Typography variant="h6" gutterBottom>
                  Create New Course
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Course Name"
                      name="name"
                      value={newCourseData.name}
                      onChange={handleCourseInputChange}
                      margin="normal"
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Course Code"
                      name="code"
                      value={newCourseData.code}
                      onChange={handleCourseInputChange}
                      margin="normal"
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Description"
                      name="description"
                      value={newCourseData.description}
                      onChange={handleCourseInputChange}
                      margin="normal"
                      variant="outlined"
                      multiline
                      rows={2}
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField
                      fullWidth
                      label="Class ID"
                      name="classId"
                      value={newCourseData.classId}
                      onChange={handleCourseInputChange}
                      margin="normal"
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField
                      fullWidth
                      label="Section"
                      name="section"
                      value={newCourseData.section}
                      onChange={handleCourseInputChange}
                      margin="normal"
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Faculty ID"
                      name="facultyId"
                      value={newCourseData.facultyId}
                      onChange={handleCourseInputChange}
                      margin="normal"
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleCreateCourse}
                      disabled={loading || !newCourseData.name || !newCourseData.code}
                    >
                      Create Course
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          ) : null}
          
          <Grid item xs={12} style={{ marginTop: '1rem', textAlign: 'center' }}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={createSampleData}
              disabled={loading}
            >
              Create Sample Data
            </Button>
          </Grid>
        </Grid>
      </Paper>
      
      <Snackbar open={showAlert} autoHideDuration={6000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity={alertSeverity}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default DatabaseDemo; 