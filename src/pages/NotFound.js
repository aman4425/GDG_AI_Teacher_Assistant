import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Typography, Button, makeStyles, Box } from '@material-ui/core';
import { Error as ErrorIcon } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(2),
    background: '#f5f5f5',
    textAlign: 'center',
  },
  icon: {
    fontSize: 80,
    color: theme.palette.error.main,
    marginBottom: theme.spacing(2),
  },
  title: {
    marginBottom: theme.spacing(1),
  },
  subtitle: {
    marginBottom: theme.spacing(4),
    color: theme.palette.text.secondary,
  },
  button: {
    marginTop: theme.spacing(2),
  },
}));

const NotFound = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Container maxWidth="md">
        <ErrorIcon className={classes.icon} />
        <Typography variant="h2" component="h1" className={classes.title}>
          404
        </Typography>
        <Typography variant="h4" gutterBottom>
          Page Not Found
        </Typography>
        <Typography variant="body1" className={classes.subtitle}>
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </Typography>
        
        <Box mt={4}>
          <Button 
            component={Link} 
            to="/"
            variant="contained" 
            color="primary" 
            className={classes.button}
          >
            Go to Home Page
          </Button>
        </Box>
      </Container>
    </div>
  );
};

export default NotFound; 