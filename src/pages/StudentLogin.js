import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  makeStyles,
  Box,
  CircularProgress,
  FormControlLabel,
  Checkbox,
  InputAdornment,
  IconButton,
  Divider
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { 
  Person as PersonIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  PlayCircleOutline as DemoIcon
} from '@material-ui/icons';

import { useAuth } from '../auth/AuthContext';

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(2),
    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
  },
  paper: {
    padding: theme.spacing(4),
    borderRadius: 10,
    boxShadow: '0px 10px 25px rgba(0, 0, 0, 0.1)',
    maxWidth: 500,
    width: '100%',
  },
  title: {
    marginBottom: theme.spacing(3),
    color: theme.palette.primary.main,
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 30,
    marginRight: theme.spacing(1),
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
    marginTop: theme.spacing(2),
  },
  submitButton: {
    marginTop: theme.spacing(2),
    padding: theme.spacing(1.5),
  },
  backLink: {
    textAlign: 'center',
    marginTop: theme.spacing(2),
  },
  helperText: {
    textAlign: 'center',
    marginTop: theme.spacing(2),
  },
  demoButton: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(3),
    backgroundColor: '#4caf50',
    color: 'white',
    padding: theme.spacing(1.5),
    fontWeight: 'bold',
    fontSize: '1rem',
    '&:hover': {
      backgroundColor: '#388e3c',
    },
  },
  demoSection: {
    border: '2px dashed #4caf50',
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(2),
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    backgroundColor: 'rgba(76, 175, 80, 0.05)',
  },
  demoIcon: {
    marginRight: theme.spacing(1),
  },
  divider: {
    margin: theme.spacing(3, 0),
  }
}));

function StudentLogin() {
  const classes = useStyles();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const { login, setDemoMode, demoMode } = useAuth();
  const navigate = useNavigate();

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!email || !password) {
      setError('Please enter both student ID and password');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      
      // Here we would normally check the user role from the database
      // and redirect accordingly, but for simplicity we'll just redirect to student dashboard
      navigate('/student-dashboard');
    } catch (error) {
      setError('Failed to login. Please check your credentials.');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    setError('');

    try {
      // Set demo mode to true
      setDemoMode(true);
      await login('student@demo.com', 'demo123');
      navigate('/student-dashboard');
    } catch (error) {
      setError('Failed to start demo mode.');
      console.error('Demo login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={classes.root}>
      <Container maxWidth="sm">
        <Paper className={classes.paper} elevation={3}>
          <Typography variant="h5" component="h1" className={classes.title}>
            <PersonIcon className={classes.icon} />
            Student Login
          </Typography>
          
          <div className={classes.demoSection}>
            <Typography variant="h6" align="center" gutterBottom>
              Quick Access Demo
            </Typography>
            <Typography variant="body2" align="center" paragraph>
              Skip login and explore the student features:
            </Typography>
            <Button
              variant="contained"
              fullWidth
              className={classes.demoButton}
              onClick={handleDemoLogin}
              disabled={loading}
              startIcon={<DemoIcon />}
            >
              ENTER STUDENT DEMO MODE
            </Button>
          </div>
          
          <Divider className={classes.divider} />
          
          {error && <Alert severity="error">{error}</Alert>}
          
          <form className={classes.form} onSubmit={handleSubmit}>
            <TextField
              label="Student ID / Email"
              variant="outlined"
              type="text"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
              placeholder="Enter your student ID or email"
            />
            
            <TextField
              label="Password"
              variant="outlined"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleTogglePasswordVisibility}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            
            <FormControlLabel
              control={
                <Checkbox
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  color="primary"
                />
              }
              label="Remember me"
            />
            
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              className={classes.submitButton}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Login'}
            </Button>
          </form>
          
          <Box mt={2} textAlign="center">
            <Typography variant="body2">
              <Link to="/forgot-password">Forgot Password?</Link>
            </Typography>
          </Box>
          
          <Typography variant="body2" className={classes.helperText}>
            If you're having trouble logging in, please contact your teacher or school administrator for assistance.
          </Typography>
          
          <div className={classes.backLink}>
            <Link to="/">Back to Role Selection</Link>
          </div>
        </Paper>
      </Container>
    </div>
  );
}

export default StudentLogin; 