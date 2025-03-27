import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Button,
  makeStyles,
  Box,
  Card,
  CardContent,
  CardMedia,
  CardActions
} from '@material-ui/core';
import {
  School as SchoolIcon,
  Person as PersonIcon,
  People as PeopleIcon,
  SupervisorAccount as AdminIcon,
  PlayCircleOutline as DemoIcon
} from '@material-ui/icons';
import { useAuth } from '../auth/AuthContext';

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
    padding: theme.spacing(2),
  },
  header: {
    textAlign: 'center',
    marginBottom: theme.spacing(4),
  },
  title: {
    color: 'white',
    fontWeight: 'bold',
    marginBottom: theme.spacing(1),
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  roleCard: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    '&:hover': {
      transform: 'translateY(-8px)',
      boxShadow: '0 12px 20px rgba(0, 0, 0, 0.1)',
    },
  },
  cardMedia: {
    height: 140,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: theme.palette.primary.main,
    color: 'white',
  },
  iconLarge: {
    fontSize: 60,
  },
  cardContent: {
    flexGrow: 1,
  },
  roleButton: {
    marginTop: theme.spacing(1),
  },
  footer: {
    textAlign: 'center',
    marginTop: theme.spacing(6),
    color: 'white',
  },
  demoButton: {
    marginBottom: theme.spacing(4),
    backgroundColor: '#4caf50',
    color: 'white',
    fontWeight: 'bold',
    padding: theme.spacing(1.5),
    '&:hover': {
      backgroundColor: '#388e3c',
    },
  },
  demoIcon: {
    marginRight: theme.spacing(1),
  },
}));

const RoleSelection = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { setDemoMode, currentUser, userRole } = useAuth();

  // If already in demo mode with role, redirect to dashboard
  useEffect(() => {
    const demoMode = localStorage.getItem('demoMode') === 'true';
    const demoRole = localStorage.getItem('demoRole');
    
    if (demoMode && demoRole) {
      console.log('Already in demo mode, redirecting to dashboard');
      
      if (demoRole === 'faculty') {
        navigate('/faculty-dashboard');
      } else if (demoRole === 'student') {
        navigate('/student-dashboard');
      } else if (demoRole === 'parent') {
        navigate('/parent-dashboard');
      } else if (demoRole === 'admin') {
        navigate('/admin-dashboard');
      }
    }
    
    // If authenticated already, redirect to appropriate dashboard
    if (currentUser && userRole) {
      if (userRole === 'faculty') {
        navigate('/faculty-dashboard');
      } else if (userRole === 'student') {
        navigate('/student-dashboard');
      } else if (userRole === 'parent') {
        navigate('/parent-dashboard');
      } else if (userRole === 'admin') {
        navigate('/admin-dashboard');
      }
    }
  }, [navigate, currentUser, userRole]);

  const roles = [
    {
      title: 'Faculty',
      description: 'Login as a teacher to create quizzes, grade assignments, and track student progress.',
      icon: <SchoolIcon className={classes.iconLarge} />,
      path: '/faculty-login',
      color: '#1976d2',
      demoRole: 'faculty',
    },
    {
      title: 'Student',
      description: 'Login as a student to access courses, take quizzes, and view your performance.',
      icon: <PersonIcon className={classes.iconLarge} />,
      path: '/student-login',
      color: '#2e7d32',
      demoRole: 'student',
    },
    {
      title: 'Parent',
      description: 'Login as a parent to monitor your child\'s academic performance and communicate with teachers.',
      icon: <PeopleIcon className={classes.iconLarge} />,
      path: '/parent-login',
      color: '#ff9800',
      demoRole: 'parent',
    },
    {
      title: 'Administrator',
      description: 'Login as an administrator to manage users, courses, and system settings.',
      icon: <AdminIcon className={classes.iconLarge} />,
      path: '/admin-login',
      color: '#673ab7',
      demoRole: 'admin',
    },
  ];

  const handleDemoLogin = async (role = 'faculty') => {
    try {
      // Set demo mode to true and store in localStorage for persistence
      setDemoMode(true);
      localStorage.setItem('demoMode', 'true');
      localStorage.setItem('demoRole', role);
      
      // Navigate to appropriate dashboard based on role
      if (role === 'faculty') {
        navigate('/faculty-dashboard');
      } else if (role === 'student') {
        navigate('/student-dashboard');
      } else if (role === 'parent') {
        navigate('/parent-dashboard');
      } else if (role === 'admin') {
        navigate('/admin-dashboard');
      }
    } catch (error) {
      console.error('Demo login error:', error);
      // Force demo mode even on error and navigate
      localStorage.setItem('demoMode', 'true');
      localStorage.setItem('demoRole', role);
      
      // Fallback navigation
      navigate(`/${role}-dashboard`);
    }
  };

  return (
    <div className={classes.root}>
      <Container maxWidth="lg">
        <div className={classes.header}>
          <Typography variant="h3" component="h1" className={classes.title}>
            AI Teacher Assistant
          </Typography>
          <Typography variant="h6" className={classes.subtitle}>
            Select your role to continue
          </Typography>
        </div>
        
        <Box display="flex" justifyContent="center">
          <Button
            variant="contained"
            size="large"
            className={classes.demoButton}
            onClick={() => handleDemoLogin('faculty')}
            startIcon={<DemoIcon />}
          >
            Enter Demo Mode - No Login Required
          </Button>
        </Box>

        <Grid container spacing={4} justifyContent="center">
          {roles.map((role, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card className={classes.roleCard}>
                <CardMedia 
                  className={classes.cardMedia}
                  style={{ backgroundColor: role.color }}
                >
                  {role.icon}
                </CardMedia>
                <CardContent className={classes.cardContent}>
                  <Typography variant="h5" component="h2" gutterBottom>
                    {role.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {role.description}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button 
                    component={Link} 
                    to={role.path}
                    variant="contained" 
                    color="primary" 
                    fullWidth
                    className={classes.roleButton}
                  >
                    Login as {role.title}
                  </Button>
                  <Button 
                    variant="outlined" 
                    color="secondary" 
                    fullWidth
                    className={classes.roleButton}
                    onClick={() => handleDemoLogin(role.demoRole)}
                  >
                    Demo as {role.title}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box className={classes.footer}>
          <Typography variant="body2">
            Powered by AI to enhance the educational experience for everyone
          </Typography>
        </Box>
      </Container>
    </div>
  );
};

export default RoleSelection; 