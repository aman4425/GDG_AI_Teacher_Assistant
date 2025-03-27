import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CssBaseline,
  Divider,
  makeStyles,
  IconButton,
  Avatar,
  Container,
  Grid,
  Paper,
  Box,
  Hidden,
  Menu,
  MenuItem,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip
} from '@material-ui/core';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Assignment as AssignmentIcon,
  AssessmentOutlined as GradeIcon,
  ExitToApp as LogoutIcon,
  Notifications as NotificationsIcon,
  AccountCircle,
  Book as CourseIcon,
  Feedback as FeedbackIcon,
  Timeline as ProgressIcon,
  School as SchoolIcon,
  Chat as ChatIcon,
  Settings as SettingsIcon,
  QuestionAnswer as QuizIcon,
  DateRange as AttendanceIcon
} from '@material-ui/icons';

import { useAuth } from '../auth/AuthContext';
import StudentCourses from '../components/student/Courses';
import StudentAssignments from '../components/student/Assignments';
import StudentGrades from '../components/student/Grades';
import StudentFeedback from '../components/student/Feedback';
import StudentQuizzes from '../components/student/Quizzes';
import StudentAttendance from '../components/student/StudentAttendance';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  title: {
    flexGrow: 1,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerContainer: {
    overflow: 'auto',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    backgroundColor: '#f5f5f5',
    minHeight: '100vh',
  },
  userSection: {
    padding: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  avatar: {
    width: theme.spacing(7),
    height: theme.spacing(7),
    marginBottom: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
  },
  userName: {
    fontWeight: 'bold',
  },
  paper: {
    padding: theme.spacing(3),
    borderRadius: 10,
    height: '100%',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)',
  },
  greeting: {
    marginBottom: theme.spacing(3),
  },
  welcomeText: {
    fontWeight: 'normal',
    color: theme.palette.text.secondary,
    marginTop: theme.spacing(1),
  },
  statsContainer: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
  quizCard: {
    marginBottom: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    transition: 'transform 0.2s ease-in-out',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
    },
  },
  quizCardContent: {
    padding: theme.spacing(3),
  },
  pendingChip: {
    backgroundColor: theme.palette.warning.light,
    marginRight: theme.spacing(1),
  },
  completedChip: {
    backgroundColor: theme.palette.success.light,
    marginRight: theme.spacing(1),
  },
  upcomingChip: {
    backgroundColor: theme.palette.info.light,
    marginRight: theme.spacing(1),
  },
  courseCard: {
    marginBottom: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    display: 'flex',
    transition: 'transform 0.2s ease-in-out',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
    },
  },
  courseIcon: {
    display: 'flex',
    padding: theme.spacing(3),
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.contrastText,
    borderTopLeftRadius: theme.shape.borderRadius,
    borderBottomLeftRadius: theme.shape.borderRadius,
    alignItems: 'center',
    justifyContent: 'center',
  },
  courseInfo: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    padding: theme.spacing(2),
  },
  feedbackCard: {
    marginBottom: theme.spacing(2),
    padding: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    borderLeft: `4px solid ${theme.palette.primary.main}`,
  },
  toolbar: theme.mixins.toolbar,
}));

function StudentDashboard() {
  const classes = useStyles();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [greeting, setGreeting] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const { logout, currentUser } = useAuth();
  
  useEffect(() => {
    // Set greeting based on time of day
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting('Good Morning');
    } else if (hour < 18) {
      setGreeting('Good Afternoon');
    } else {
      setGreeting('Good Evening');
    }
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Mock data for dashboard
  const studentName = "Alex Johnson";
  const studentID = "S1001";
  const overallGrade = "A-";
  const pendingAssignments = 2;
  
  // Mock courses
  const courses = [
    { id: 1, name: 'Introduction to Computer Science', instructor: 'Dr. Smith', code: 'CS101', grade: 'A' },
    { id: 2, name: 'Calculus I', instructor: 'Dr. Williams', code: 'MATH201', grade: 'B+' },
    { id: 3, name: 'World History', instructor: 'Prof. Johnson', code: 'HIST101', grade: 'A-' },
  ];
  
  // Mock upcoming quizzes
  const quizzes = [
    { id: 1, title: 'Algorithms Quiz', course: 'CS101', dueDate: '2023-06-20', status: 'upcoming' },
    { id: 2, title: 'Calculus Exam', course: 'MATH201', dueDate: '2023-06-18', status: 'upcoming' },
    { id: 3, title: 'Programming Assignment', course: 'CS101', dueDate: '2023-06-15', status: 'pending' },
    { id: 4, title: 'World War II Quiz', course: 'HIST101', dueDate: '2023-06-10', status: 'completed', score: 85 },
  ];
  
  // Mock feedback
  const feedbacks = [
    {
      id: 1,
      course: 'CS101',
      assignment: 'Data Structures Quiz',
      date: '2023-06-05',
      feedback: "Excellent work on algorithm complexity analysis! Your explanation of Big O notation was very clear and accurate. To improve further, practice more on dynamic programming concepts."
    },
    {
      id: 2,
      course: 'MATH201',
      assignment: 'Differential Equations Test',
      date: '2023-05-28',
      feedback: "Good effort on integration problems. You demonstrated a solid understanding of basic techniques. Work on chain rule applications and more complex substitution problems."
    }
  ];

  const drawer = (
    <div>
      <div className={classes.userSection}>
        <Avatar className={classes.avatar}>AJ</Avatar>
        <Typography className={classes.userName}>{studentName}</Typography>
        <Typography variant="body2" color="textSecondary">Student ID: {studentID}</Typography>
      </div>
      <Divider />
      <List className={classes.drawerContainer}>
        <ListItem button component={Link} to="/student-dashboard">
          <ListItemIcon><DashboardIcon /></ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button component={Link} to="/student-dashboard/courses">
          <ListItemIcon><CourseIcon /></ListItemIcon>
          <ListItemText primary="Courses" />
        </ListItem>
        <ListItem button component={Link} to="/student-dashboard/assignments">
          <ListItemIcon><AssignmentIcon /></ListItemIcon>
          <ListItemText primary="Assignments" />
        </ListItem>
        <ListItem button component={Link} to="/student-dashboard/quizzes">
          <ListItemIcon><QuizIcon /></ListItemIcon>
          <ListItemText primary="Quizzes" />
        </ListItem>
        <ListItem button component={Link} to="/student-dashboard/grades">
          <ListItemIcon><GradeIcon /></ListItemIcon>
          <ListItemText primary="Grades" />
        </ListItem>
        <ListItem button component={Link} to="/student-dashboard/attendance">
          <ListItemIcon><AttendanceIcon /></ListItemIcon>
          <ListItemText primary="Attendance" />
        </ListItem>
        <ListItem button component={Link} to="/student-dashboard/feedback">
          <ListItemIcon><FeedbackIcon /></ListItemIcon>
          <ListItemText primary="Feedback" />
        </ListItem>
        <Divider />
        <ListItem button onClick={handleLogout}>
          <ListItemIcon><LogoutIcon /></ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </div>
  );

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Student Learning Portal
          </Typography>
          <IconButton color="inherit">
            <NotificationsIcon />
          </IconButton>
          <IconButton
            edge="end"
            color="inherit"
            aria-label="account"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenuOpen}
          >
            <AccountCircle />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
            <MenuItem onClick={handleMenuClose}>Settings</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      
      <Hidden mdUp>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          classes={{
            paper: classes.drawerPaper,
          }}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile
          }}
        >
          {drawer}
        </Drawer>
      </Hidden>
      
      <Hidden smDown>
        <Drawer
          className={classes.drawer}
          variant="permanent"
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          <div className={classes.toolbar} />
          {drawer}
        </Drawer>
      </Hidden>
      
      <main className={classes.content}>
        <div className={classes.toolbar} />
        
        <Routes>
          <Route path="/" element={
            <StudentDashboardHome 
              greeting={greeting} 
              studentName={studentName}
              overallGrade={overallGrade}
              pendingAssignments={pendingAssignments}
              courses={courses}
              quizzes={quizzes}
              feedbacks={feedbacks}
              classes={classes}
            />
          } />
          <Route path="/courses" element={<StudentCourses />} />
          <Route path="/assignments" element={<StudentAssignments />} />
          <Route path="/quizzes" element={<StudentQuizzes />} />
          <Route path="/grades" element={<StudentGrades />} />
          <Route path="/attendance" element={<StudentAttendance />} />
          <Route path="/feedback" element={<StudentFeedback />} />
          <Route path="*" element={<Navigate to="/student-dashboard" replace />} />
        </Routes>
      </main>
    </div>
  );
}

// Dashboard home component
function StudentDashboardHome({ 
  greeting, 
  studentName, 
  overallGrade, 
  pendingAssignments,
  courses,
  quizzes,
  feedbacks,
  classes 
}) {
  return (
    <Container>
      <div className={classes.greeting}>
        <Typography variant="h4">{greeting}, {studentName}</Typography>
        <Typography variant="subtitle1" className={classes.welcomeText}>
          Welcome to your learning dashboard
        </Typography>
      </div>
      
      <Grid container spacing={3}>
        {/* Overview Section */}
        <Grid item xs={12} md={8}>
          <Paper className={classes.paper}>
            <Typography variant="h6" gutterBottom>
              Academic Overview
            </Typography>
            <Divider style={{ marginBottom: 16 }} />
            
            <Grid container spacing={3}>
              <Grid item xs={4}>
                <Box textAlign="center">
                  <Typography variant="h3" color="primary" style={{ fontWeight: 'bold' }}>
                    {overallGrade}
                  </Typography>
                  <Typography variant="body2">Overall Grade</Typography>
                </Box>
              </Grid>
              
              <Grid item xs={4}>
                <Box textAlign="center">
                  <Typography variant="h3" color="primary" style={{ fontWeight: 'bold' }}>
                    {courses.length}
                  </Typography>
                  <Typography variant="body2">Active Courses</Typography>
                </Box>
              </Grid>
              
              <Grid item xs={4}>
                <Box textAlign="center">
                  <Typography variant="h3" color="primary" style={{ fontWeight: 'bold' }}>
                    {pendingAssignments}
                  </Typography>
                  <Typography variant="body2">Pending Tasks</Typography>
                </Box>
              </Grid>
            </Grid>
            
            <Box mt={3}>
              <Typography variant="h6" gutterBottom>
                My Courses
              </Typography>
              <Divider style={{ marginBottom: 16 }} />
              
              {courses.map(course => (
                <Card key={course.id} className={classes.courseCard}>
                  <div className={classes.courseIcon}>
                    <SchoolIcon fontSize="large" />
                  </div>
                  <div className={classes.courseInfo}>
                    <Typography variant="h6">{course.name}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {course.instructor} • {course.code}
                    </Typography>
                    <Box mt={1} display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="body2">
                        Current Grade: <strong>{course.grade}</strong>
                      </Typography>
                      <Button size="small" color="primary">
                        View Course
                      </Button>
                    </Box>
                  </div>
                </Card>
              ))}
            </Box>
          </Paper>
        </Grid>
        
        {/* Quizzes & Assignments */}
        <Grid item xs={12} md={4}>
          <Paper className={classes.paper}>
            <Typography variant="h6" gutterBottom>
              Upcoming Quizzes & Assignments
            </Typography>
            <Divider style={{ marginBottom: 16 }} />
            
            {quizzes.map(quiz => (
              <Card key={quiz.id} className={classes.quizCard}>
                <CardContent className={classes.quizCardContent}>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                    <Typography variant="h6" gutterBottom>
                      {quiz.title}
                    </Typography>
                    {quiz.status === 'pending' && (
                      <Chip label="Pending" size="small" className={classes.pendingChip} />
                    )}
                    {quiz.status === 'completed' && (
                      <Chip label="Completed" size="small" className={classes.completedChip} />
                    )}
                    {quiz.status === 'upcoming' && (
                      <Chip label="Upcoming" size="small" className={classes.upcomingChip} />
                    )}
                  </Box>
                  
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Course: {quiz.course}
                  </Typography>
                  
                  <Typography variant="body2" gutterBottom>
                    Due: {quiz.dueDate}
                  </Typography>
                  
                  {quiz.status === 'completed' && (
                    <Typography variant="body2" gutterBottom>
                      Score: <strong>{quiz.score}%</strong>
                    </Typography>
                  )}
                </CardContent>
                <CardActions>
                  <Button size="small" color="primary">
                    {quiz.status === 'completed' ? 'View Results' : 'Start Quiz'}
                  </Button>
                </CardActions>
              </Card>
            ))}
            
            <Box mt={2} display="flex" justifyContent="center">
              <Button color="primary">View All Assignments</Button>
            </Box>
          </Paper>
        </Grid>
        
        {/* Recent Feedback */}
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <Typography variant="h6" gutterBottom>
              Recent Feedback from Instructors
            </Typography>
            <Divider style={{ marginBottom: 16 }} />
            
            {feedbacks.map(feedback => (
              <Paper key={feedback.id} className={classes.feedbackCard}>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>{feedback.course}:</strong> {feedback.assignment}
                </Typography>
                <Typography variant="body2" gutterBottom color="textSecondary">
                  Received on {feedback.date}
                </Typography>
                <Typography variant="body1" style={{ marginTop: 8 }}>
                  {feedback.feedback}
                </Typography>
              </Paper>
            ))}
            
            <Box mt={2} display="flex" justifyContent="center">
              <Button color="primary">View All Feedback</Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default StudentDashboard; 