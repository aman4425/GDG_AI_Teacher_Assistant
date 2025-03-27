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
  Stepper,
  Step,
  StepLabel,
  FormHelperText,
  Divider
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { People as PeopleIcon, PlayCircleOutline as DemoIcon } from '@material-ui/icons';

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
  otpContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  otpInput: {
    width: '3rem',
    textAlign: 'center',
    fontSize: '1.5rem',
  },
  stepper: {
    padding: theme.spacing(2, 0, 3),
    backgroundColor: 'transparent',
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

function ParentLogin() {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  const [phone, setPhone] = useState('');
  const [studentId, setStudentId] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);
  
  const { setupRecaptcha, verifyOtp, login, setDemoMode } = useAuth();
  const navigate = useNavigate();
  const otpRefs = [useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null)];
  const recaptchaRef = useRef(null);

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setPhone(value);
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!phone || phone.length < 10) {
      setError('Please enter a valid phone number');
      return;
    }
    
    if (!studentId) {
      setError('Please enter your child\'s student ID');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      // In a real app, we would first validate if the phone number is associated with the student ID
      // For demo purposes, we'll skip that step
      
      // Format phone number for E.164 format
      const formattedPhone = `+1${phone}`; // Assuming US number, adjust as needed
      
      // Set up recaptcha verification
      const confirmation = await setupRecaptcha(formattedPhone);
      setConfirmationResult(confirmation);
      
      // Move to OTP verification step
      setActiveStep(1);
      
      // Focus on first OTP input
      setTimeout(() => {
        if (otpRefs[0].current) {
          otpRefs[0].current.focus();
        }
      }, 100);
    } catch (error) {
      setError('Failed to send OTP. Please try again.');
      console.error('OTP send error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    // Only allow digits
    if (!/^\d*$/.test(value)) return;
    
    // Update OTP array
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto-focus to next input
    if (value && index < 5) {
      otpRefs[index + 1].current.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace for deleting and moving to previous input
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        otpRefs[index - 1].current.focus();
      }
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    
    // Join OTP digits
    const otpValue = otp.join('');
    
    // Validation
    if (otpValue.length !== 6) {
      setError('Please enter the complete 6-digit OTP');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      // In a real app, we would verify the OTP with the confirmation result
      // For demo purposes, we'll just accept any 6-digit code
      if (confirmationResult) {
        await verifyOtp(confirmationResult, otpValue);
      }
      
      // Navigate to parent dashboard
      navigate('/parent-dashboard');
    } catch (error) {
      setError('Invalid OTP. Please try again.');
      console.error('OTP verification error:', error);
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
      await login('parent@demo.com', 'demo123');
      navigate('/parent-dashboard');
    } catch (error) {
      setError('Failed to start demo mode.');
      console.error('Demo login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const steps = ['Phone Verification', 'OTP Verification'];

  return (
    <div className={classes.root}>
      <Container maxWidth="sm">
        <Paper className={classes.paper} elevation={3}>
          <Typography variant="h5" component="h1" className={classes.title}>
            <PeopleIcon className={classes.icon} />
            Parent Login
          </Typography>

          <div className={classes.demoSection}>
            <Typography variant="h6" align="center" gutterBottom>
              Parent Portal Demo
            </Typography>
            <Typography variant="body2" align="center" paragraph>
              Skip phone verification and explore the parent features:
            </Typography>
            <Button
              variant="contained"
              fullWidth
              className={classes.demoButton}
              onClick={handleDemoLogin}
              disabled={loading}
              startIcon={<DemoIcon />}
            >
              ENTER PARENT DEMO MODE
            </Button>
          </div>
          
          <Divider className={classes.divider} />
          
          <Stepper activeStep={activeStep} className={classes.stepper} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          
          {error && <Alert severity="error">{error}</Alert>}
          
          {activeStep === 0 ? (
            // Phone verification step
            <form className={classes.form} onSubmit={handleSendOtp}>
              <TextField
                label="Student ID"
                variant="outlined"
                fullWidth
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                required
                autoFocus
              />
              
              <TextField
                label="Phone Number"
                variant="outlined"
                type="tel"
                fullWidth
                value={phone}
                onChange={handlePhoneChange}
                required
                placeholder="10-digit mobile number"
                helperText="Enter the phone number registered with the school"
              />
              
              {/* Invisible reCAPTCHA container */}
              <div id="recaptcha-container" ref={recaptchaRef}></div>
              
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                className={classes.submitButton}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Send Verification Code'}
              </Button>
            </form>
          ) : (
            // OTP verification step
            <form className={classes.form} onSubmit={handleVerifyOtp}>
              <Typography variant="body1" align="center" gutterBottom>
                Enter the 6-digit code sent to your phone
              </Typography>
              
              <div className={classes.otpContainer}>
                {otp.map((digit, index) => (
                  <TextField
                    key={index}
                    variant="outlined"
                    className={classes.otpInput}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    inputRef={otpRefs[index]}
                    inputProps={{
                      maxLength: 1,
                      style: { textAlign: 'center' }
                    }}
                  />
                ))}
              </div>
              
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                className={classes.submitButton}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Verify & Login'}
              </Button>
              
              <Button
                variant="text"
                color="primary"
                fullWidth
                onClick={() => setActiveStep(0)}
                disabled={loading}
              >
                Back to Phone Number
              </Button>
            </form>
          )}
          
          <div className={classes.backLink}>
            <Link to="/">Back to Role Selection</Link>
          </div>
        </Paper>
      </Container>
    </div>
  );
}

export default ParentLogin; 