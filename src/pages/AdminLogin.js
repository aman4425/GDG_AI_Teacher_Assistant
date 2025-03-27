import React, { useState, useRef } from 'react';
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
  SupervisorAccount as AdminIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  VpnKey as VpnKeyIcon,
  PlayCircleOutline as DemoIcon
} from '@material-ui/icons';
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
  helperText: {
    textAlign: 'center',
    marginTop: theme.spacing(2),
    color: theme.palette.text.secondary,
  },
  securityNote: {
    marginTop: theme.spacing(2),
    padding: theme.spacing(2),
    backgroundColor: theme.palette.warning.light,
    borderRadius: theme.shape.borderRadius,
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

function AdminLogin() {
  const classes = useStyles();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminKey, setAdminKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  
  const { login, demoMode, setDemoMode } = useAuth();
  const navigate = useNavigate();
  const recaptchaRef = useRef(null);

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleCaptchaChange = (value) => {
    setCaptchaVerified(!!value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!email || !password || !adminKey) {
      setError('Please enter all required fields');
      return;
    }
    
    if (!demoMode && !captchaVerified) {
      setError('Please verify that you are not a robot');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      
      // In a real app, we would validate the admin key on the server
      // For demo purposes, we'll just assume it's valid
      
      // Here we would normally check the user role from the database
      // and redirect accordingly, but for simplicity we'll just redirect to admin dashboard
      navigate('/admin-dashboard');
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
      await login('admin@demo.com', 'demo123');
      navigate('/admin-dashboard');
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
            <AdminIcon className={classes.icon} />
            Administrator Login
          </Typography>
          
          <div className={classes.demoSection}>
            <Typography variant="h6" align="center" gutterBottom>
              Administrative Demo Access
            </Typography>
            <Typography variant="body2" align="center" paragraph>
              Try the administrator dashboard features without authentication:
            </Typography>
            <Button
              variant="contained"
              fullWidth
              className={classes.demoButton}
              onClick={handleDemoLogin}
              disabled={loading}
              startIcon={<DemoIcon />}
            >
              ENTER ADMIN DEMO MODE
            </Button>
          </div>
          
          <Divider className={classes.divider} />
          
          <Box className={classes.securityNote}>
            <Typography variant="body2">
              <strong>Security Notice:</strong> This area is restricted to authorized personnel only. 
              All login attempts are logged and monitored.
            </Typography>
          </Box>
          
          {error && <Alert severity="error">{error}</Alert>}
          
          <form className={classes.form} onSubmit={handleSubmit}>
            <TextField
              label="Admin Email"
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
            
            <TextField
              label="Admin Security Key"
              variant="outlined"
              type="password"
              fullWidth
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <VpnKeyIcon />
                  </InputAdornment>
                ),
              }}
              helperText="Enter your administrator security key"
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
              disabled={loading || (!demoMode && !captchaVerified)}
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

export default AdminLogin; 