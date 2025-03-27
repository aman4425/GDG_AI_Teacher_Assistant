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
  Button,
  Badge
} from '@material-ui/core';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Assignment as AssignmentIcon,
  PeopleAlt as PeopleIcon,
  Assessment as AssessmentIcon,
  ExitToApp as LogoutIcon,
  Notifications as NotificationsIcon,
  AccountCircle,
  Create as CreateIcon,
  Feedback as FeedbackIcon,
  DateRange as AttendanceIcon,
  Email as MessageIcon
} from '@material-ui/icons';

import { useAuth } from '../auth/AuthContext';
import { useDatabase } from '../hooks/useDatabase';
import QuizCreation from '../components/faculty/QuizCreation';
import StudentList from '../components/faculty/StudentList';
import GradeAssignments from '../components/faculty/GradeAssignments';
import FacultyFeedback from '../components/faculty/FacultyFeedback';
import CourseAttendance from '../components/faculty/CourseAttendance';

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
  },
  userName: {
    fontWeight: 'bold',
  },
  paper: {
    padding: theme.spacing(3),
    borderRadius: 10,
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
  statPaper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  statValue: {
    fontSize: '2rem',
    fontWeight: 'bold',
    marginBottom: theme.spacing(1),
    color: theme.palette.primary.main,
  },
  toolbar: theme.mixins.toolbar,
}));

function FacultyDashboard() {
  const classes = useStyles();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [greeting, setGreeting] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const { logout, currentUser } = useAuth();
  const { unreadMessages } = useDatabase();
  
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
  const facultyName = "Dr. John Smith";
  const studentCount = 125;
  const submissionsPending = 15;
  const activeQuizzes = 3;

  const drawer = (
    <div>
      <div className={classes.userSection}>
        <Avatar className={classes.avatar}>JS</Avatar>
        <Typography className={classes.userName}>{facultyName}</Typography>
        <Typography variant="body2" color="textSecondary">Faculty</Typography>
      </div>
      <Divider />
      <List className={classes.drawerContainer}>
        <ListItem button component={Link} to="/faculty-dashboard">
          <ListItemIcon><DashboardIcon /></ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button component={Link} to="/faculty-dashboard/students">
          <ListItemIcon><PeopleIcon /></ListItemIcon>
          <ListItemText primary="Students" />
        </ListItem>
        <ListItem button component={Link} to="/faculty-dashboard/create-quiz">
          <ListItemIcon><CreateIcon /></ListItemIcon>
          <ListItemText primary="Create Quiz" />
        </ListItem>
        <ListItem button component={Link} to="/faculty-dashboard/grade">
          <ListItemIcon><AssessmentIcon /></ListItemIcon>
          <ListItemText primary="Grade Assignments" />
        </ListItem>
        <ListItem button component={Link} to="/faculty-dashboard/attendance">
          <ListItemIcon><AttendanceIcon /></ListItemIcon>
          <ListItemText primary="Attendance" />
        </ListItem>
        <ListItem button component={Link} to="/faculty-dashboard/feedback">
          <ListItemIcon><FeedbackIcon /></ListItemIcon>
          <ListItemText primary="Feedback" />
        </ListItem>
        <ListItem button component={Link} to="/faculty-dashboard/messages">
          <ListItemIcon>
            <Badge color="secondary" badgeContent={unreadMessages} showZero={false}>
              <MessageIcon />
            </Badge>
          </ListItemIcon>
          <ListItemText primary="Messages" />
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
            AI Teacher Assistant
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
        
        <Container maxWidth="lg">
          <Routes>
            <Route path="/" element={
              <DashboardHome 
                greeting={greeting} 
                facultyName={facultyName}
                studentCount={studentCount}
                submissionsPending={submissionsPending}
                activeQuizzes={activeQuizzes}
                classes={classes}
              />
            } />
            <Route path="/students" element={<StudentList />} />
            <Route path="/create-quiz" element={<QuizCreation />} />
            <Route path="/grade" element={<GradeAssignments />} />
            <Route path="/attendance" element={<CourseAttendance />} />
            <Route path="/feedback" element={<FacultyFeedback />} />
            <Route path="/messages" element={<FacultyMessages classes={classes} />} />
            <Route path="*" element={<Navigate to="/faculty-dashboard" replace />} />
          </Routes>
        </Container>
      </main>
    </div>
  );
}

// Dashboard home component
function DashboardHome({ greeting, facultyName, studentCount, submissionsPending, activeQuizzes, classes }) {
  return (
    <Container>
      <Paper className={classes.paper}>
        <div className={classes.greeting}>
          <Typography variant="h4">{greeting}, {facultyName}</Typography>
          <Typography variant="subtitle1" className={classes.welcomeText}>
            Welcome to your AI-powered teaching assistant dashboard
          </Typography>
        </div>
        
        <Grid container spacing={3} className={classes.statsContainer}>
          <Grid item xs={12} sm={4}>
            <Paper className={classes.statPaper} elevation={2}>
              <Typography variant="h3" className={classes.statValue}>{studentCount}</Typography>
              <Typography variant="subtitle1">Enrolled Students</Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <Paper className={classes.statPaper} elevation={2}>
              <Typography variant="h3" className={classes.statValue}>{submissionsPending}</Typography>
              <Typography variant="subtitle1">Pending Assignments</Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <Paper className={classes.statPaper} elevation={2}>
              <Typography variant="h3" className={classes.statValue}>{activeQuizzes}</Typography>
              <Typography variant="subtitle1">Active Quizzes</Typography>
            </Paper>
          </Grid>
        </Grid>
        
        <Box mt={4}>
          <Typography variant="h6">Recent Activities</Typography>
          <Divider style={{ marginTop: 8, marginBottom: 16 }} />
          
          {/* Activity list would go here */}
          <Typography variant="body1" color="textSecondary">
            No recent activities to display.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

// Faculty Messages component
function FacultyMessages({ classes }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getFacultyMessages, markMessageAsRead } = useDatabase();
  
  // Load messages
  useEffect(() => {
    const loadMessages = async () => {
      setLoading(true);
      try {
        const result = await getFacultyMessages();
        if (result.success) {
          setMessages(result.data || []);
        } else {
          setError('Failed to load messages');
        }
      } catch (err) {
        console.error('Error loading messages:', err);
        setError('Error loading messages: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    
    loadMessages();
  }, [getFacultyMessages]);
  
  // Mark message as read when opened
  const handleMarkAsRead = async (messageId) => {
    try {
      const result = await markMessageAsRead(messageId);
      if (result.success) {
        // Update local state to show the message as read
        setMessages(messages.map(msg => 
          msg.id === messageId ? { ...msg, read: true } : msg
        ));
      }
    } catch (error) {
      console.error('Error marking message as read:', error);
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
        Messages from Parents
      </Typography>
      
      <Paper className={classes.paper}>
        {loading ? (
          <Typography variant="body1">Loading messages...</Typography>
        ) : error ? (
          <Typography variant="body1" color="error">{error}</Typography>
        ) : messages.length === 0 ? (
          <Typography variant="body1">No messages received yet.</Typography>
        ) : (
          <Box>
            {messages.map((message) => (
              <Box 
                key={message.id} 
                mb={3} 
                p={2} 
                border={1} 
                borderColor="divider" 
                borderRadius={1}
                bgcolor={message.read ? 'transparent' : 'rgba(63, 81, 181, 0.08)'}
                onClick={() => !message.read && handleMarkAsRead(message.id)}
                style={{ cursor: !message.read ? 'pointer' : 'default' }}
              >
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {message.subject}
                    {!message.read && (
                      <Box
                        component="span"
                        ml={1}
                        px={1}
                        py={0.5}
                        bgcolor="primary.main"
                        color="white"
                        borderRadius={4}
                        fontSize="0.75rem"
                      >
                        New
                      </Box>
                    )}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {formatDate(message.timestamp)}
                  </Typography>
                </Box>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  From: {message.parentName || 'Parent'}
                </Typography>
                <Divider style={{ margin: '8px 0' }} />
                <Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }}>
                  {message.message}
                </Typography>
                {!message.read && (
                  <Box mt={2} display="flex" justifyContent="flex-end">
                    <Button 
                      variant="outlined" 
                      color="primary" 
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMarkAsRead(message.id);
                      }}
                    >
                      Mark as Read
                    </Button>
                  </Box>
                )}
              </Box>
            ))}
          </Box>
        )}
      </Paper>
    </Container>
  );
}

export default FacultyDashboard; 