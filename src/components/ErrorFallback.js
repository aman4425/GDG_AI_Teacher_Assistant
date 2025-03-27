import React from 'react';
import { Button, Typography, Container, Paper, Box } from '@material-ui/core';
import { useAuth } from '../auth/AuthContext';

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  const auth = useAuth() || {};
  const forceDemo = auth.forceDemo || (() => {
    console.warn('forceDemo function not available in auth context');
  });
  
  const handleForceDemoMode = () => {
    // Enable demo mode to bypass Firebase errors
    forceDemo();
    
    // Then reset the error boundary to try again
    if (resetErrorBoundary) {
      resetErrorBoundary();
    }
  };
  
  return (
    <Container maxWidth="md" style={{ marginTop: '3rem' }}>
      <Paper style={{ padding: '2rem', textAlign: 'center' }}>
        <Typography variant="h4" color="error" gutterBottom>
          Application Error
        </Typography>
        
        <Typography variant="body1" paragraph>
          The application encountered an error while loading. This may be due to:
        </Typography>
        
        <Box textAlign="left" mb={3} bgcolor="#f5f5f5" p={2} borderRadius={4}>
          <Typography component="ul">
            <li>Missing environment variables</li>
            <li>Firebase configuration issues</li>
            <li>Network connectivity problems</li>
            <li>Authentication errors</li>
          </Typography>
        </Box>
        
        {error && (
          <Box textAlign="left" mb={3} bgcolor="#ffebee" p={2} borderRadius={4} overflow="auto">
            <Typography variant="body2" component="pre" style={{ whiteSpace: 'pre-wrap' }}>
              {error.message}
              {error.stack ? `\n\n${error.stack}` : ''}
            </Typography>
          </Box>
        )}
        
        <Box mt={3}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={resetErrorBoundary}
            style={{ marginRight: '1rem' }}
          >
            Try Again
          </Button>
          
          <Button 
            variant="outlined" 
            color="secondary" 
            onClick={handleForceDemoMode}
          >
            Continue in Demo Mode
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default ErrorFallback; 