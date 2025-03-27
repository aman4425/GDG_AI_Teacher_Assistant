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
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField
} from '@material-ui/core';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People,
  ExitToApp as LogoutIcon,
  Notifications as NotificationIcon,
  AccountCircle,
  Assessment as GradeIcon,
  Assignment as AssignmentIcon,
  Feedback as FeedbackIcon,
  Message as MessageIcon,
  ChildCare as ChildrenIcon,
  QuestionAnswer as QuizIcon,
  Event as CalendarIcon,
  Chat as ChatIcon
} from '@material-ui/icons';

import { useAuth } from '../auth/AuthContext';
import StudentQuizzes from '../components/parent/StudentQuizzes';
import { useDatabase } from '../hooks/useDatabase';
import ChildrenGrades from '../components/parent/ChildrenGrades';
import ChildAssignments from '../components/parent/ChildAssignments';
import TeacherCommunication from '../components/parent/TeacherCommunication';
import ChildAttendance from '../components/parent/ChildAttendance';

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
    backgroundColor: theme.palette.secondary.main,
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
  childInfoCard: {
    marginBottom: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    display: 'flex',
    transition: 'transform 0.2s ease-in-out',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
    },
  },
  childIcon: {
    display: 'flex',
    padding: theme.spacing(3),
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.contrastText,
    borderTopLeftRadius: theme.shape.borderRadius,
    borderBottomLeftRadius: theme.shape.borderRadius,
    alignItems: 'center',
    justifyContent: 'center',
  },
  childInfo: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    padding: theme.spacing(2),
  },
  attendanceChip: {
    margin: theme.spacing(0.5),
  },
  presentChip: {
    backgroundColor: theme.palette.success.light,
  },
  absentChip: {
    backgroundColor: theme.palette.error.light,
  },
  tableContainer: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  gradeCard: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    borderLeft: `4px solid ${theme.palette.primary.main}`,
  },
  feedbackCard: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
  },
  feedbackForm: {
    marginTop: theme.spacing(2),
  },
  feedbackTextField: {
    marginBottom: theme.spacing(2),
  },
  toolbar: theme.mixins.toolbar,
}));

function ParentDashboard() {
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

  // Mock data for parent dashboard
  const parentName = "Maria Johnson";
  const children = [
    { 
      id: 1, 
      name: 'Alex Johnson', 
      grade: '10th', 
      school: 'Lincoln High School',
      studentId: 'S1001' 
    }
  ];
  
  // Mock grade data
  const gradesData = [
    { id: 1, subject: 'Mathematics', assignment: 'Calculus Exam', date: '2023-06-10', score: 92, maxScore: 100, letterGrade: 'A-' },
    { id: 2, subject: 'English', assignment: 'Literary Analysis Essay', date: '2023-06-05', score: 88, maxScore: 100, letterGrade: 'B+' },
    { id: 3, subject: 'Science', assignment: 'Chemistry Lab Report', date: '2023-06-02', score: 95, maxScore: 100, letterGrade: 'A' },
    { id: 4, subject: 'History', assignment: 'World War II Quiz', date: '2023-05-28', score: 85, maxScore: 100, letterGrade: 'B' },
  ];
  
  // Mock teacher feedback
  const teacherFeedback = [
    {
      id: 1,
      teacherName: 'Dr. Smith',
      subject: 'Mathematics',
      date: '2023-06-12',
      feedback: 'Alex has shown significant improvement in calculus concepts. His problem-solving approach is methodical and well-organized. He should continue practicing complex integration problems to further strengthen his skills.'
    },
    {
      id: 2,
      teacherName: 'Ms. Williams',
      subject: 'English',
      date: '2023-06-07',
      feedback: 'Alex\'s essay demonstrated good analytical skills, but he needs to work on his thesis statements and conclusion paragraphs. His grammar and vocabulary usage are excellent.'
    }
  ];
  
  // Mock upcoming events
  const upcomingEvents = [
    { id: 1, title: 'Parent-Teacher Conference', date: '2023-06-25', time: '4:00 PM - 6:00 PM' },
    { id: 2, title: 'Science Fair', date: '2023-07-05', time: '9:00 AM - 3:00 PM' },
    { id: 3, title: 'End of Semester Exams', date: '2023-06-28', time: 'All Day' },
  ];

  const drawer = (
    <div>
      <div className={classes.userSection}>
        <Avatar className={classes.avatar}>PS</Avatar>
        <Typography className={classes.userName}>Parent Smith</Typography>
        <Typography variant="body2" color="textSecondary">Parent</Typography>
      </div>
      <Divider />
      <List className={classes.drawerContainer}>
        <ListItem button component={Link} to="/parent-dashboard">
          <ListItemIcon><DashboardIcon /></ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button component={Link} to="/parent-dashboard/children">
          <ListItemIcon><ChildrenIcon /></ListItemIcon>
          <ListItemText primary="My Children" />
        </ListItem>
        <ListItem button component={Link} to="/parent-dashboard/grades">
          <ListItemIcon><GradeIcon /></ListItemIcon>
          <ListItemText primary="Grades" />
        </ListItem>
        <ListItem button component={Link} to="/parent-dashboard/assignments">
          <ListItemIcon><AssignmentIcon /></ListItemIcon>
          <ListItemText primary="Assignments" />
        </ListItem>
        <ListItem button component={Link} to="/parent-dashboard/attendance">
          <ListItemIcon><CalendarIcon /></ListItemIcon>
          <ListItemText primary="Attendance" />
        </ListItem>
        <ListItem button component={Link} to="/parent-dashboard/communicate">
          <ListItemIcon><ChatIcon /></ListItemIcon>
          <ListItemText primary="Communicate" />
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
            Parent Portal
          </Typography>
          <IconButton color="inherit">
            <NotificationIcon />
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
            <ParentDashboardHome 
              greeting={greeting} 
              parentName="Parent Smith"
              children={children}
              gradesData={gradesData}
              teacherFeedback={teacherFeedback}
              upcomingEvents={upcomingEvents}
              classes={classes}
            />
          } />
          <Route path="/children" element={<div>Children Profiles</div>} />
          <Route path="/grades" element={<ChildrenGrades />} />
          <Route path="/assignments" element={<ChildAssignments />} />
          <Route path="/attendance" element={<ChildAttendance />} />
          <Route path="/communicate" element={<TeacherCommunication />} />
          <Route path="*" element={<Navigate to="/parent-dashboard" replace />} />
        </Routes>
      </main>
    </div>
  );
}

// Dashboard home component
function ParentDashboardHome({ 
  greeting, 
  parentName, 
  children,
  gradesData,
  teacherFeedback,
  upcomingEvents,
  classes 
}) {
  const selectedChild = children[0]; // For simplicity, using the first child
  
  // Calculate average grade
  const totalScore = gradesData.reduce((sum, grade) => sum + grade.score, 0);
  const averageScore = Math.round(totalScore / gradesData.length);

  return (
    <Container>
      <div className={classes.greeting}>
        <Typography variant="h4">{greeting}, {parentName}</Typography>
        <Typography variant="subtitle1" className={classes.welcomeText}>
          Stay up-to-date with your child's academic journey
        </Typography>
      </div>
      
      <Grid container spacing={3}>
        {/* Child Information */}
        <Grid item xs={12} md={6}>
          <Paper className={classes.paper}>
            <Typography variant="h6" gutterBottom>
              Child Information
            </Typography>
            <Divider style={{ marginBottom: 16 }} />
            
            <Card className={classes.childInfoCard}>
              <div className={classes.childIcon}>
                <ChildrenIcon fontSize="large" />
              </div>
              <div className={classes.childInfo}>
                <Typography variant="h6">{selectedChild.name}</Typography>
                <Typography variant="body2" color="textSecondary">
                  Student ID: {selectedChild.studentId}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Grade: {selectedChild.grade} • {selectedChild.school}
                </Typography>
                <Box mt={1} display="flex" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="body2">
                      Average Grade: <strong>{averageScore}%</strong>
                    </Typography>
                  </Box>
                  <Button size="small" color="primary" component={Link} to="/parent-dashboard/grades">
                    View Details
                  </Button>
                </Box>
              </div>
            </Card>
          </Paper>
        </Grid>
        
        {/* Recent Grades */}
        <Grid item xs={12} md={6}>
          <Paper className={classes.paper}>
            <Typography variant="h6" gutterBottom>
              Recent Grades
            </Typography>
            <Divider style={{ marginBottom: 16 }} />
            
            {gradesData.slice(0, 3).map((grade) => (
              <Paper key={grade.id} className={classes.gradeCard} elevation={1}>
                <Grid container spacing={2}>
                  <Grid item xs={8}>
                    <Typography variant="subtitle1" gutterBottom>
                      <strong>{grade.subject}:</strong> {grade.assignment}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Date: {grade.date}
                    </Typography>
                  </Grid>
                  <Grid item xs={4} style={{ textAlign: 'center' }}>
                    <Typography variant="h5" style={{ fontWeight: 'bold', color: '#1976d2' }}>
                      {grade.letterGrade}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {grade.score}/{grade.maxScore}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            ))}
            
            <Box mt={2} display="flex" justifyContent="center">
              <Button color="primary" component={Link} to="/parent-dashboard/grades">
                View All Grades
              </Button>
            </Box>
          </Paper>
        </Grid>
        
        {/* Teacher Feedback */}
        <Grid item xs={12} md={8}>
          <Paper className={classes.paper}>
            <Typography variant="h6" gutterBottom>
              Recent Teacher Feedback
            </Typography>
            <Divider style={{ marginBottom: 16 }} />
            
            {teacherFeedback.map((feedback) => (
              <Paper key={feedback.id} className={classes.feedbackCard} elevation={1}>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>{feedback.subject}</strong> - {feedback.teacherName}
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Date: {feedback.date}
                </Typography>
                <Typography variant="body1">
                  {feedback.feedback}
                </Typography>
              </Paper>
            ))}
            
            <Box mt={2} display="flex" justifyContent="space-between">
              <Button color="primary" component={Link} to="/parent-dashboard/communicate">
                View All Feedback
              </Button>
            </Box>
          </Paper>
        </Grid>
        
        {/* Upcoming Events */}
        <Grid item xs={12} md={4}>
          <Paper className={classes.paper}>
            <Typography variant="h6" gutterBottom>
              Upcoming Events
            </Typography>
            <Divider style={{ marginBottom: 16 }} />
            
            {upcomingEvents.map((event) => (
              <Card key={event.id} style={{ marginBottom: 12 }}>
                <CardContent>
                  <Typography variant="subtitle1">{event.title}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    Date: {event.date}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Time: {event.time}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" color="primary">
                    Add to Calendar
                  </Button>
                </CardActions>
              </Card>
            ))}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

// Academic Performance component
function AcademicPerformance({ gradesData, classes }) {
  return (
    <Container>
      <Paper className={classes.paper}>
        <Typography variant="h5" gutterBottom>
          Academic Performance
        </Typography>
        <Divider style={{ marginBottom: 16 }} />
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Subject</TableCell>
                <TableCell>Assignment</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Score</TableCell>
                <TableCell>Grade</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {gradesData.map((grade) => (
                <TableRow key={grade.id}>
                  <TableCell>{grade.subject}</TableCell>
                  <TableCell>{grade.assignment}</TableCell>
                  <TableCell>{grade.date}</TableCell>
                  <TableCell>{grade.score}/{grade.maxScore}</TableCell>
                  <TableCell>{grade.letterGrade}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
}

// Feedback View component
function FeedbackView({ teacherFeedback, classes }) {
  return (
    <Container>
      <Paper className={classes.paper}>
        <Typography variant="h5" gutterBottom>
          Teacher Feedback
        </Typography>
        <Divider style={{ marginBottom: 16 }} />
        
        {teacherFeedback.map((feedback) => (
          <Paper key={feedback.id} className={classes.feedbackCard} elevation={1}>
            <Typography variant="h6" gutterBottom>
              {feedback.subject} - {feedback.teacherName}
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Date: {feedback.date}
            </Typography>
            <Typography variant="body1" paragraph>
              {feedback.feedback}
            </Typography>
            <Button size="small" color="primary">
              Reply to Feedback
            </Button>
          </Paper>
        ))}
      </Paper>
    </Container>
  );
}

// Message Teachers component
function MessageTeachers({ classes }) {
  const [message, setMessage] = useState('');
  const [subject, setSubject] = useState('');
  const [teacher, setTeacher] = useState('');
  const [sentMessages, setSentMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { sendMessage, getParentMessages } = useDatabase();
  
  // Load sent messages
  useEffect(() => {
    const loadMessages = async () => {
      setLoading(true);
      try {
        const result = await getParentMessages();
        if (result.success) {
          setSentMessages(result.data || []);
        } else {
          setErrorMessage('Failed to load message history');
        }
      } catch (error) {
        console.error('Error loading messages:', error);
        setErrorMessage('Error loading messages: ' + error.message);
      } finally {
        setLoading(false);
      }
    };
    
    loadMessages();
  }, [getParentMessages]);
  
  // Mock list of teachers
  const teachers = [
    { id: 1, name: 'Dr. Smith', subject: 'Mathematics' },
    { id: 2, name: 'Ms. Williams', subject: 'English' },
    { id: 3, name: 'Mr. Johnson', subject: 'Science' },
    { id: 4, name: 'Mrs. Davis', subject: 'History' },
  ];
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');
    
    try {
      setLoading(true);
      
      const messageData = {
        message,
        subject
      };
      
      const result = await sendMessage(teacher, messageData);
      
      if (result.success) {
        setSuccessMessage('Message sent successfully!');
        
        // Add the new message to the list
        const teacherInfo = teachers.find(t => t.id === parseInt(teacher));
        const newMessage = {
          id: result.data.id,
          subject,
          message,
          teacherId: teacher,
          teacherName: teacherInfo ? teacherInfo.name : 'Unknown',
          timestamp: new Date(),
          read: false
        };
        
        setSentMessages([newMessage, ...sentMessages]);
        
        // Clear the form
        setMessage('');
        setSubject('');
        setTeacher('');
      } else {
        setErrorMessage('Failed to send message: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setErrorMessage('Error sending message: ' + error.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Format date for display
  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Messages
      </Typography>
      
      <Paper className={classes.paper} style={{ marginBottom: '24px' }}>
        <Typography variant="h5" gutterBottom>
          Send New Message
        </Typography>
        <Divider style={{ marginBottom: 16 }} />
        
        {successMessage && (
          <Box mb={2} p={1} bgcolor="success.light" borderRadius={1}>
            <Typography>{successMessage}</Typography>
          </Box>
        )}
        
        {errorMessage && (
          <Box mb={2} p={1} bgcolor="error.light" borderRadius={1}>
            <Typography>{errorMessage}</Typography>
          </Box>
        )}
        
        <form onSubmit={handleSubmit} className={classes.feedbackForm}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Teacher"
                value={teacher}
                onChange={(e) => setTeacher(e.target.value)}
                variant="outlined"
                fullWidth
                required
                className={classes.feedbackTextField}
              >
                {teachers.map((t) => (
                  <MenuItem key={t.id} value={t.id}>
                    {t.name} ({t.subject})
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                label="Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                variant="outlined"
                fullWidth
                required
                className={classes.feedbackTextField}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                label="Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                variant="outlined"
                multiline
                rows={5}
                fullWidth
                required
                className={classes.feedbackTextField}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={!message || !subject || !teacher || loading}
              >
                {loading ? 'Sending...' : 'Send Message'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
      
      <Paper className={classes.paper}>
        <Typography variant="h5" gutterBottom>
          Message History
        </Typography>
        <Divider style={{ marginBottom: 16 }} />
        
        {loading && sentMessages.length === 0 ? (
          <Typography variant="body1">Loading messages...</Typography>
        ) : sentMessages.length === 0 ? (
          <Typography variant="body1">No messages sent yet.</Typography>
        ) : (
          <Box>
            {sentMessages.map((msg) => (
              <Box 
                key={msg.id} 
                mb={2} 
                p={2} 
                border={1} 
                borderColor="divider" 
                borderRadius={1}
              >
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {msg.subject}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {formatDate(msg.timestamp)}
                  </Typography>
                </Box>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  To: {msg.teacherName || 'Unknown Teacher'}
                </Typography>
                <Divider style={{ margin: '8px 0' }} />
                <Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }}>
                  {msg.message}
                </Typography>
                <Box display="flex" justifyContent="flex-end" mt={1}>
                  <Typography variant="caption" color={msg.read ? "textSecondary" : "primary"}>
                    {msg.read ? "Read" : "Unread"}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </Paper>
    </Container>
  );
}

export default ParentDashboard; 