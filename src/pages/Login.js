import React from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  makeStyles,
  Box
} from '@material-ui/core';
import {
  School as SchoolIcon,
  Person as PersonIcon,
  People as PeopleIcon,
  SupervisorAccount as AdminIcon
} from '@material-ui/icons';

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
  },
  title: {
    marginBottom: theme.spacing(4),
    color: theme.palette.primary.main,
    textAlign: 'center',
  },
  subtitle: {
    marginBottom: theme.spacing(3),
    textAlign: 'center',
  },
  userTypeButton: {
    padding: theme.spacing(2),
    height: '180px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.1)',
    },
  },
  icon: {
    fontSize: 64,
    marginBottom: theme.spacing(2),
  },
  link: {
    textDecoration: 'none',
  },
}));

function Login() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Container maxWidth="md">
        <Paper className={classes.paper} elevation={3}>
          <Typography variant="h4" component="h1" className={classes.title}>
            AI Teacher Assistant
          </Typography>
          <Typography variant="h6" component="h2" className={classes.subtitle}>
            Select your role to login
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Link to="/faculty-login" className={classes.link}>
                <Button
                  variant="outlined"
                  color="primary"
                  fullWidth
                  className={classes.userTypeButton}
                >
                  <SchoolIcon className={classes.icon} />
                  <Typography variant="h6">Faculty</Typography>
                </Button>
              </Link>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Link to="/student-login" className={classes.link}>
                <Button
                  variant="outlined"
                  color="primary"
                  fullWidth
                  className={classes.userTypeButton}
                >
                  <PersonIcon className={classes.icon} />
                  <Typography variant="h6">Student</Typography>
                </Button>
              </Link>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Link to="/parent-login" className={classes.link}>
                <Button
                  variant="outlined"
                  color="primary"
                  fullWidth
                  className={classes.userTypeButton}
                >
                  <PeopleIcon className={classes.icon} />
                  <Typography variant="h6">Parent</Typography>
                </Button>
              </Link>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Link to="/admin-login" className={classes.link}>
                <Button
                  variant="outlined"
                  color="primary"
                  fullWidth
                  className={classes.userTypeButton}
                >
                  <AdminIcon className={classes.icon} />
                  <Typography variant="h6">Admin</Typography>
                </Button>
              </Link>
            </Grid>
          </Grid>

          <Box mt={4} textAlign="center">
            <Typography variant="body2" color="textSecondary">
              AI-powered platform for personalized educational feedback
            </Typography>
          </Box>
        </Paper>
      </Container>
    </div>
  );
}

export default Login; 