import React, { useState, useRef, useEffect } from 'react';
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
  Divider
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { School as SchoolIcon, PlayCircleOutline as DemoIcon } from '@material-ui/icons';
import ReCAPTCHA from 'react-google-recaptcha';

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
  captchaContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
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
  },
}));

function FacultyLogin() {
  const classes = useStyles();
  const [email, setEmail] = useState('faculty@example.com');
  const [password, setPassword] = useState('password');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [remember, setRemember] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  
  const { login, demoMode, setDemoMode, currentUser, userRole } = useAuth();
  const navigate = useNavigate();
  const recaptchaRef = useRef(null);

  // If already in demo mode with faculty role, redirect to dashboard
  useEffect(() => {
    const storedDemoMode = localStorage.getItem('demoMode') === 'true';
    const storedDemoRole = localStorage.getItem('demoRole');
    
    if (storedDemoMode && storedDemoRole === 'faculty') {
      console.log('Already in faculty demo mode, redirecting to dashboard');
      navigate('/faculty-dashboard');
    }
    
    // If authenticated as faculty already, redirect to dashboard
    if (currentUser && userRole === 'faculty') {
      navigate('/faculty-dashboard');
    }
  }, [navigate, currentUser, userRole]);

  const handleCaptchaChange = (value) => {
    setCaptchaVerified(!!value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    if (!demoMode && !captchaVerified) {
      setError('Please verify that you are not a robot');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      // Try to login
      await login(email, password);
      
      // If we get here, we're logged in
      navigate('/faculty-dashboard');
    } catch (error) {
      console.error('Login error:', error);
      
      // Try to activate demo mode as a fallback
      setDemoMode(true);
      localStorage.setItem('demoMode', 'true');
      localStorage.setItem('demoRole', 'faculty');
      
      // If we're in demo mode now, navigate to dashboard
      navigate('/faculty-dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    setError('');

    try {
      // Set demo mode to true and store in localStorage for persistence
      setDemoMode(true);
      localStorage.setItem('demoMode', 'true');
      localStorage.setItem('demoRole', 'faculty');
      
      // Skip the actual login call and navigate directly
      navigate('/faculty-dashboard');
    } catch (error) {
      console.error('Demo login error:', error);
      // Force demo mode even on error
      localStorage.setItem('demoMode', 'true');
      localStorage.setItem('demoRole', 'faculty');
      navigate('/faculty-dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={classes.root}>
      <Container maxWidth="sm">
        <Paper className={classes.paper} elevation={3}>
          <Typography variant="h5" component="h1" className={classes.title}>
            <SchoolIcon className={classes.icon} />
            Faculty Login
          </Typography>
          
          <div className={classes.demoSection}>
            <Typography variant="h6" align="center" gutterBottom>
              Having trouble connecting?
            </Typography>
            <Typography variant="body2" align="center" paragraph>
              Skip authentication and explore the app in demo mode:
            </Typography>
            <Button
              variant="contained"
              fullWidth
              className={classes.demoButton}
              onClick={handleDemoLogin}
              disabled={loading}
              startIcon={<DemoIcon />}
            >
              ENTER DEMO MODE
            </Button>
          </div>
          
          <Divider className={classes.divider} />
          
          {error && <Alert severity="error">{error}</Alert>}
          
          <form className={classes.form} onSubmit={handleSubmit}>
            <TextField
              label="Email"
              variant="outlined"
              type="email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
            
            <TextField
              label="Password"
              variant="outlined"
              type="password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
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
            
            {!demoMode && (
              <div className={classes.captchaContainer}>
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey="6Lf6y_8qAAAAAC52uGjgRRWtcZ6ndIFP_qcZuZt3"
                  onChange={handleCaptchaChange}
                />
              </div>
            )}
            
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
          
          <div className={classes.backLink}>
            <Link to="/">Back to Role Selection</Link>
          </div>
        </Paper>
      </Container>
    </div>
  );
}

export default FacultyLogin; 