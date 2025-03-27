import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
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
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@material-ui/core';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  ExitToApp as LogoutIcon,
  Notifications as NotificationsIcon,
  AccountCircle,
  Settings as SettingsIcon,
  VpnKey as VpnKeyIcon,
  Storage as StorageIcon,
  School as SchoolIcon,
  BarChart as BarChartIcon,
  NoteAdd as NoteAddIcon,
  PersonAdd as PersonAddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon
} from '@material-ui/icons';

import { useAuth } from '../auth/AuthContext';
import { useDatabase } from '../hooks/useDatabase';
import DatabaseDemo from '../components/DatabaseDemo';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    backgroundColor: '#343a40',
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
    backgroundColor: '#f8f9fa',
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
    backgroundColor: '#343a40',
    color: 'white',
  },
  avatar: {
    width: theme.spacing(7),
    height: theme.spacing(7),
    marginBottom: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  userName: {
    fontWeight: 'bold',
    color: 'white',
  },
  userRole: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  paper: {
    padding: theme.spacing(3),
    borderRadius: 10,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)',
  },
  statCard: {
    padding: theme.spacing(2),
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  statIcon: {
    fontSize: 48,
    marginBottom: theme.spacing(2),
    color: theme.palette.primary.main,
  },
  statValue: {
    fontSize: '2rem',
    fontWeight: 'bold',
    marginBottom: theme.spacing(1),
  },
  statLabel: {
    fontSize: '1rem',
    color: theme.palette.text.secondary,
  },
  buttonSpacing: {
    marginRight: theme.spacing(1),
  },
  tableContainer: {
    marginTop: theme.spacing(3),
  },
  deleteButton: {
    color: theme.palette.error.main,
  },
  editButton: {
    color: theme.palette.info.main,
  },
  toolbar: theme.mixins.toolbar,
}));

function AdminDashboard() {
  const classes = useStyles();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const { logout, currentUser } = useAuth();
  
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

  // Mock data
  const adminName = "System Administrator";
  const systemStats = {
    users: 342,
    faculty: 25,
    students: 308,
    parents: 9,
    courses: 18,
    quizzes: 47,
  };

  const drawer = (
    <div>
      <div className={classes.userSection}>
        <Avatar className={classes.avatar}>
          <VpnKeyIcon />
        </Avatar>
        <Typography className={classes.userName}>{adminName}</Typography>
        <Typography variant="body2" className={classes.userRole}>System Administrator</Typography>
      </div>
      <Divider />
      <List className={classes.drawerContainer}>
        <ListItem button component={Link} to="/admin-dashboard">
          <ListItemIcon><DashboardIcon /></ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button component={Link} to="/admin-dashboard/users">
          <ListItemIcon><PeopleIcon /></ListItemIcon>
          <ListItemText primary="User Management" />
        </ListItem>
        <ListItem button component={Link} to="/admin-dashboard/courses">
          <ListItemIcon><SchoolIcon /></ListItemIcon>
          <ListItemText primary="Courses" />
        </ListItem>
        <ListItem button component={Link} to="/admin-dashboard/data">
          <ListItemIcon><StorageIcon /></ListItemIcon>
          <ListItemText primary="Data Management" />
        </ListItem>
        <ListItem button component={Link} to="/admin-dashboard/settings">
          <ListItemIcon><SettingsIcon /></ListItemIcon>
          <ListItemText primary="System Settings" />
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
            Admin Control Panel
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
        
        <Routes>
          <Route path="/" element={<AdminDashboardHome systemStats={systemStats} classes={classes} />} />
          <Route path="/users" element={<UserManagement classes={classes} />} />
          <Route path="/courses" element={<CourseManagement classes={classes} />} />
          <Route path="/data" element={<DataManagement classes={classes} />} />
          <Route path="/settings" element={<SystemSettings classes={classes} />} />
        </Routes>
      </main>
    </div>
  );
}

// Dashboard home component
function AdminDashboardHome({ systemStats, classes }) {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        System Overview
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <Card className={classes.statCard}>
            <PeopleIcon className={classes.statIcon} />
            <div>
              <Typography variant="h3" className={classes.statValue}>
                {systemStats.users}
              </Typography>
              <Typography className={classes.statLabel}>
                Total Users
              </Typography>
            </div>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <Card className={classes.statCard}>
            <SchoolIcon className={classes.statIcon} />
            <div>
              <Typography variant="h3" className={classes.statValue}>
                {systemStats.courses}
              </Typography>
              <Typography className={classes.statLabel}>
                Active Courses
              </Typography>
            </div>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <Card className={classes.statCard}>
            <NoteAddIcon className={classes.statIcon} />
            <div>
              <Typography variant="h3" className={classes.statValue}>
                {systemStats.quizzes}
              </Typography>
              <Typography className={classes.statLabel}>
                Quizzes Created
              </Typography>
            </div>
          </Card>
        </Grid>
      </Grid>
      
      <Grid container spacing={3} style={{ marginTop: 16 }}>
        <Grid item xs={12} md={8}>
          <Paper className={classes.paper}>
            <Typography variant="h6" gutterBottom>
              User Distribution
            </Typography>
            <Divider style={{ marginBottom: 16 }} />
            <Box height={300} display="flex" alignItems="center" justifyContent="center">
              <Typography variant="body1" color="textSecondary">
                [Chart visualization would be displayed here]
              </Typography>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper className={classes.paper}>
            <Typography variant="h6" gutterBottom>
              System Status
            </Typography>
            <Divider style={{ marginBottom: 16 }} />
            <Box mt={2}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">Database:</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" style={{ color: 'green' }}>Online</Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">API Services:</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" style={{ color: 'green' }}>Online</Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">Auth Server:</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" style={{ color: 'green' }}>Online</Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">Storage:</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" style={{ color: 'green' }}>Online</Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">Usage:</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">42% of 10GB</Typography>
                </Grid>
              </Grid>
            </Box>
            <Button variant="outlined" color="primary" fullWidth style={{ marginTop: 16 }}>
              View Full System Report
            </Button>
          </Paper>
        </Grid>
      </Grid>
      
      <Paper className={classes.paper} style={{ marginTop: 24 }}>
        <Typography variant="h6" gutterBottom>
          Recent Activities
        </Typography>
        <Divider style={{ marginBottom: 16 }} />
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Action</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>New student account created</TableCell>
                <TableCell>admin@example.com</TableCell>
                <TableCell>Today, 10:30 AM</TableCell>
                <TableCell>Success</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Course added</TableCell>
                <TableCell>admin@example.com</TableCell>
                <TableCell>Today, 09:45 AM</TableCell>
                <TableCell>Success</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>System backup</TableCell>
                <TableCell>system</TableCell>
                <TableCell>Today, 03:00 AM</TableCell>
                <TableCell>Success</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Failed login attempt</TableCell>
                <TableCell>unknown</TableCell>
                <TableCell>Yesterday, 11:52 PM</TableCell>
                <TableCell>Failed</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Quiz created</TableCell>
                <TableCell>faculty@example.com</TableCell>
                <TableCell>Yesterday, 04:23 PM</TableCell>
                <TableCell>Success</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
}

// User Management component
function UserManagement({ classes }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getAllUsers, createUser, deleteUser, createStudentProfile } = useDatabase();
  
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  
  // Add New User Dialog
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'Student',
    status: 'Active'
  });

  // Load users from database
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        const result = await getAllUsers();
        if (result.success) {
          setUsers(result.data || []);
        }
      } catch (error) {
        console.error("Error loading users:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [getAllUsers]);
  
  const handleDeleteUser = (userId) => {
    setSelectedUser(users.find(user => user.id === userId));
    setOpenDialog(true);
  };
  
  const handleConfirmDelete = async () => {
    try {
      const result = await deleteUser(selectedUser.id);
      if (result.success) {
        setUsers(users.filter(user => user.id !== selectedUser.id));
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    } finally {
      setOpenDialog(false);
    }
  };

  const handleOpenAddDialog = () => {
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
    // Reset the form
    setNewUser({
      name: '',
      email: '',
      role: 'Student',
      status: 'Active'
    });
  };

  const handleNewUserInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser({
      ...newUser,
      [name]: value
    });
  };

  const handleAddUser = async () => {
    try {
      // Basic validation
      if (!newUser.name || !newUser.email) {
        return; // Don't submit if required fields are empty
      }

      const result = await createUser(newUser);
      if (result.success) {
        // If the user is a student, also create a student profile
        if (newUser.role === 'Student') {
          // Extract first and last name from full name
          const nameParts = newUser.name.split(' ');
          const firstName = nameParts[0];
          const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
          
          // Generate a student ID (S + random 4 digits)
          const studentId = 'S' + Math.floor(1000 + Math.random() * 9000);
          
          // Create student profile
          await createStudentProfile({
            firstName,
            lastName,
            email: newUser.email,
            rollNumber: studentId,
            classId: '10', // Default class
            section: 'A',  // Default section
            gender: 'Not Specified'
          });
        }
        
        // Reload all users from the database to ensure we have the latest data
        const usersResult = await getAllUsers();
        if (usersResult.success) {
          setUsers(usersResult.data || []);
        } else {
          // Fallback to adding the user to existing state if reload fails
          setUsers([...users, { id: result.data.id, ...newUser }]);
        }
        handleCloseAddDialog();
      }
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };
  
  return (
    <Container>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">
          User Management
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<PersonAddIcon />}
          onClick={handleOpenAddDialog}
        >
          Add New User
        </Button>
      </Box>
      
      <Paper className={classes.paper}>
        <Box display="flex" justifyContent="space-between" mb={3}>
          <TextField
            label="Search Users"
            variant="outlined"
            size="small"
            style={{ width: 300 }}
          />
          <Box>
            <Button variant="outlined" className={classes.buttonSpacing}>Filter</Button>
            <Button variant="outlined">Export</Button>
          </Box>
        </Box>
        
        <TableContainer className={classes.tableContainer}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    Loading users...
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>{user.status}</TableCell>
                    <TableCell>
                      <IconButton size="small" className={classes.editButton}>
                        <EditIcon />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        className={classes.deleteButton}
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      
      {/* Delete User Confirmation Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the user {selectedUser?.name}? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="primary" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add New User Dialog */}
      <Dialog
        open={openAddDialog}
        onClose={handleCloseAddDialog}
        aria-labelledby="add-user-dialog-title"
      >
        <DialogTitle id="add-user-dialog-title">Add New User</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please fill in the user details to add a new user to the system.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Full Name"
            type="text"
            fullWidth
            variant="outlined"
            value={newUser.name}
            onChange={handleNewUserInputChange}
            required
          />
          <TextField
            margin="dense"
            name="email"
            label="Email Address"
            type="email"
            fullWidth
            variant="outlined"
            value={newUser.email}
            onChange={handleNewUserInputChange}
            required
          />
          <TextField
            select
            margin="dense"
            name="role"
            label="Role"
            fullWidth
            variant="outlined"
            value={newUser.role}
            onChange={handleNewUserInputChange}
          >
            <MenuItem value="Admin">Admin</MenuItem>
            <MenuItem value="Faculty">Faculty</MenuItem>
            <MenuItem value="Student">Student</MenuItem>
            <MenuItem value="Parent">Parent</MenuItem>
          </TextField>
          <TextField
            select
            margin="dense"
            name="status"
            label="Status"
            fullWidth
            variant="outlined"
            value={newUser.status}
            onChange={handleNewUserInputChange}
          >
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Inactive">Inactive</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddUser} color="primary" variant="contained">
            Add User
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

// Course Management component
function CourseManagement({ classes }) {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Course Management
      </Typography>
      <Paper className={classes.paper}>
        <Typography variant="body1">
          Course management interface would be implemented here.
        </Typography>
      </Paper>
    </Container>
  );
}

// Data Management component
function DataManagement({ classes }) {
  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Data Management
      </Typography>
      <Typography variant="body1" paragraph>
        Manage your database and data operations from here.
      </Typography>
      
      <DatabaseDemo />
    </Container>
  );
}

// System Settings component
function SystemSettings({ classes }) {
  const [emailSettings, setEmailSettings] = useState({
    smtpServer: 'smtp.example.com',
    smtpPort: '587',
    smtpUsername: 'admin@example.com',
    smtpPassword: '********',
    fromEmail: 'noreply@example.com',
    enableSSL: true
  });

  const [backupSettings, setBackupSettings] = useState({
    autoBackup: true,
    backupFrequency: 'daily',
    backupTime: '02:00',
    keepBackups: '7',
    backupLocation: 'cloud'
  });

  const [securitySettings, setSecuritySettings] = useState({
    passwordExpiry: '90',
    minPasswordLength: '8',
    requireSpecialChar: true,
    maxLoginAttempts: '5',
    sessionTimeout: '30'
  });

  const [notificationSettings, setNotificationSettings] = useState({
    enableEmailNotifications: true,
    enableSystemAlerts: true,
    alertOnFailedLogins: true,
    dailySummary: false,
    notifyNewUsers: true
  });

  const [maintenanceSettings, setMaintenanceSettings] = useState({
    enableMaintenance: false,
    maintenanceMessage: 'System is currently under maintenance. Please try again later.',
    scheduledStart: '',
    scheduledEnd: '',
    allowAdminAccess: true
  });

  const [activeTab, setActiveTab] = useState(0);

  const handleEmailChange = (event) => {
    const { name, value, checked } = event.target;
    setEmailSettings(prev => ({
      ...prev,
      [name]: name === 'enableSSL' ? checked : value
    }));
  };

  const handleBackupChange = (event) => {
    const { name, value, checked } = event.target;
    setBackupSettings(prev => ({
      ...prev,
      [name]: name === 'autoBackup' ? checked : value
    }));
  };

  const handleSecurityChange = (event) => {
    const { name, value, checked } = event.target;
    setSecuritySettings(prev => ({
      ...prev,
      [name]: ['requireSpecialChar'].includes(name) ? checked : value
    }));
  };

  const handleNotificationChange = (event) => {
    const { name, checked } = event.target;
    setNotificationSettings(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleMaintenanceChange = (event) => {
    const { name, value, checked } = event.target;
    setMaintenanceSettings(prev => ({
      ...prev,
      [name]: ['enableMaintenance', 'allowAdminAccess'].includes(name) ? checked : value
    }));
  };

  const saveSettings = (section) => {
    // This would save the settings to the backend
    console.log(`Saving ${section} settings`);
    // Show success message
    alert(`${section} settings saved successfully!`);
  };

  const runBackup = () => {
    // This would trigger a manual backup
    console.log('Initiating manual backup...');
    setTimeout(() => {
      alert('Backup completed successfully!');
    }, 2000);
  };

  const toggleMaintenanceMode = () => {
    setMaintenanceSettings(prev => ({
      ...prev,
      enableMaintenance: !prev.enableMaintenance
    }));
    
    // This would toggle maintenance mode on the server
    if (!maintenanceSettings.enableMaintenance) {
      alert('Maintenance mode enabled. Regular users will see the maintenance message.');
    } else {
      alert('Maintenance mode disabled. The system is now accessible to all users.');
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        System Settings
      </Typography>
      
      <Paper className={classes.paper}>
        <Box mb={3}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box display="flex" mb={2}>
                <Button 
                  variant={activeTab === 0 ? "contained" : "outlined"} 
                  color="primary" 
                  onClick={() => setActiveTab(0)}
                  className={classes.buttonSpacing}
                >
                  Email Configuration
                </Button>
                <Button 
                  variant={activeTab === 1 ? "contained" : "outlined"} 
                  color="primary" 
                  onClick={() => setActiveTab(1)}
                  className={classes.buttonSpacing}
                >
                  Backup & Restore
                </Button>
                <Button 
                  variant={activeTab === 2 ? "contained" : "outlined"} 
                  color="primary" 
                  onClick={() => setActiveTab(2)}
                  className={classes.buttonSpacing}
                >
                  Security Settings
                </Button>
                <Button 
                  variant={activeTab === 3 ? "contained" : "outlined"} 
                  color="primary" 
                  onClick={() => setActiveTab(3)}
                  className={classes.buttonSpacing}
                >
                  Notifications
                </Button>
                <Button 
                  variant={activeTab === 4 ? "contained" : "outlined"} 
                  color="primary" 
                  onClick={() => setActiveTab(4)}
                >
                  Maintenance
                </Button>
              </Box>
            </Grid>
          </Grid>

          {/* Email Configuration */}
          {activeTab === 0 && (
            <Box>
              <Typography variant="h6" gutterBottom>Email Server Configuration</Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="SMTP Server"
                    name="smtpServer"
                    value={emailSettings.smtpServer}
                    onChange={handleEmailChange}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="SMTP Port"
                    name="smtpPort"
                    value={emailSettings.smtpPort}
                    onChange={handleEmailChange}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="SMTP Username"
                    name="smtpUsername"
                    value={emailSettings.smtpUsername}
                    onChange={handleEmailChange}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="SMTP Password"
                    name="smtpPassword"
                    type="password"
                    value={emailSettings.smtpPassword}
                    onChange={handleEmailChange}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="From Email Address"
                    name="fromEmail"
                    value={emailSettings.fromEmail}
                    onChange={handleEmailChange}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box mt={3} display="flex" alignItems="center">
                    <input
                      type="checkbox"
                      id="enableSSL"
                      name="enableSSL"
                      checked={emailSettings.enableSSL}
                      onChange={handleEmailChange}
                    />
                    <label htmlFor="enableSSL" style={{ marginLeft: '10px' }}>Enable SSL/TLS</label>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box mt={2} display="flex" justifyContent="flex-end">
                    <Button 
                      variant="contained" 
                      color="primary"
                      onClick={() => saveSettings('email')}
                    >
                      Save Email Settings
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* Backup & Restore */}
          {activeTab === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom>Backup & Restore Settings</Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Box display="flex" alignItems="center" mb={2}>
                    <input
                      type="checkbox"
                      id="autoBackup"
                      name="autoBackup"
                      checked={backupSettings.autoBackup}
                      onChange={handleBackupChange}
                    />
                    <label htmlFor="autoBackup" style={{ marginLeft: '10px' }}>Enable Automatic Backups</label>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    select
                    label="Backup Frequency"
                    name="backupFrequency"
                    value={backupSettings.backupFrequency}
                    onChange={handleBackupChange}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    SelectProps={{
                      native: true,
                    }}
                  >
                    <option value="hourly">Hourly</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </TextField>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Backup Time (24h format)"
                    name="backupTime"
                    type="time"
                    value={backupSettings.backupTime}
                    onChange={handleBackupChange}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Keep Backups (days)"
                    name="keepBackups"
                    value={backupSettings.keepBackups}
                    onChange={handleBackupChange}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    select
                    label="Backup Storage Location"
                    name="backupLocation"
                    value={backupSettings.backupLocation}
                    onChange={handleBackupChange}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    SelectProps={{
                      native: true,
                    }}
                  >
                    <option value="local">Local Storage</option>
                    <option value="cloud">Cloud Storage</option>
                    <option value="ftp">Remote FTP Server</option>
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <Box mt={2} display="flex" justifyContent="space-between">
                    <Button 
                      variant="contained" 
                      color="secondary"
                      onClick={runBackup}
                    >
                      Run Backup Now
                    </Button>
                    <Button 
                      variant="contained" 
                      color="primary"
                      onClick={() => saveSettings('backup')}
                    >
                      Save Backup Settings
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* Security Settings */}
          {activeTab === 2 && (
            <Box>
              <Typography variant="h6" gutterBottom>Security Settings</Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Password Expiry (days)"
                    name="passwordExpiry"
                    value={securitySettings.passwordExpiry}
                    onChange={handleSecurityChange}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Minimum Password Length"
                    name="minPasswordLength"
                    value={securitySettings.minPasswordLength}
                    onChange={handleSecurityChange}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box display="flex" alignItems="center" mb={2}>
                    <input
                      type="checkbox"
                      id="requireSpecialChar"
                      name="requireSpecialChar"
                      checked={securitySettings.requireSpecialChar}
                      onChange={handleSecurityChange}
                    />
                    <label htmlFor="requireSpecialChar" style={{ marginLeft: '10px' }}>Require Special Characters</label>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Max Failed Login Attempts"
                    name="maxLoginAttempts"
                    value={securitySettings.maxLoginAttempts}
                    onChange={handleSecurityChange}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Session Timeout (minutes)"
                    name="sessionTimeout"
                    value={securitySettings.sessionTimeout}
                    onChange={handleSecurityChange}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box mt={2} display="flex" justifyContent="flex-end">
                    <Button 
                      variant="contained" 
                      color="primary"
                      onClick={() => saveSettings('security')}
                    >
                      Save Security Settings
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* Notification Settings */}
          {activeTab === 3 && (
            <Box>
              <Typography variant="h6" gutterBottom>Notification Settings</Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Box display="flex" alignItems="center" mb={2}>
                    <input
                      type="checkbox"
                      id="enableEmailNotifications"
                      name="enableEmailNotifications"
                      checked={notificationSettings.enableEmailNotifications}
                      onChange={handleNotificationChange}
                    />
                    <label htmlFor="enableEmailNotifications" style={{ marginLeft: '10px' }}>Enable Email Notifications</label>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box display="flex" alignItems="center" mb={2}>
                    <input
                      type="checkbox"
                      id="enableSystemAlerts"
                      name="enableSystemAlerts"
                      checked={notificationSettings.enableSystemAlerts}
                      onChange={handleNotificationChange}
                    />
                    <label htmlFor="enableSystemAlerts" style={{ marginLeft: '10px' }}>Enable System Alerts</label>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box display="flex" alignItems="center" mb={2}>
                    <input
                      type="checkbox"
                      id="alertOnFailedLogins"
                      name="alertOnFailedLogins"
                      checked={notificationSettings.alertOnFailedLogins}
                      onChange={handleNotificationChange}
                    />
                    <label htmlFor="alertOnFailedLogins" style={{ marginLeft: '10px' }}>Alert on Failed Login Attempts</label>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box display="flex" alignItems="center" mb={2}>
                    <input
                      type="checkbox"
                      id="dailySummary"
                      name="dailySummary"
                      checked={notificationSettings.dailySummary}
                      onChange={handleNotificationChange}
                    />
                    <label htmlFor="dailySummary" style={{ marginLeft: '10px' }}>Send Daily System Summary</label>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box display="flex" alignItems="center" mb={2}>
                    <input
                      type="checkbox"
                      id="notifyNewUsers"
                      name="notifyNewUsers"
                      checked={notificationSettings.notifyNewUsers}
                      onChange={handleNotificationChange}
                    />
                    <label htmlFor="notifyNewUsers" style={{ marginLeft: '10px' }}>Notify when New Users Register</label>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box mt={2} display="flex" justifyContent="flex-end">
                    <Button 
                      variant="contained" 
                      color="primary"
                      onClick={() => saveSettings('notification')}
                    >
                      Save Notification Settings
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* Maintenance Mode */}
          {activeTab === 4 && (
            <Box>
              <Typography variant="h6" gutterBottom>System Maintenance</Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Box display="flex" alignItems="center" mb={2}>
                    <input
                      type="checkbox"
                      id="enableMaintenance"
                      name="enableMaintenance"
                      checked={maintenanceSettings.enableMaintenance}
                      onChange={handleMaintenanceChange}
                    />
                    <label htmlFor="enableMaintenance" style={{ marginLeft: '10px' }}>
                      <Typography color={maintenanceSettings.enableMaintenance ? "error" : "inherit"}>
                        Enable Maintenance Mode
                      </Typography>
                    </label>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box display="flex" alignItems="center" mb={2}>
                    <input
                      type="checkbox"
                      id="allowAdminAccess"
                      name="allowAdminAccess"
                      checked={maintenanceSettings.allowAdminAccess}
                      onChange={handleMaintenanceChange}
                    />
                    <label htmlFor="allowAdminAccess" style={{ marginLeft: '10px' }}>Allow Admin Access During Maintenance</label>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Maintenance Message"
                    name="maintenanceMessage"
                    value={maintenanceSettings.maintenanceMessage}
                    onChange={handleMaintenanceChange}
                    fullWidth
                    multiline
                    rows={4}
                    margin="normal"
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Scheduled Start"
                    name="scheduledStart"
                    type="datetime-local"
                    value={maintenanceSettings.scheduledStart}
                    onChange={handleMaintenanceChange}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Scheduled End"
                    name="scheduledEnd"
                    type="datetime-local"
                    value={maintenanceSettings.scheduledEnd}
                    onChange={handleMaintenanceChange}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box mt={2} display="flex" justifyContent="space-between">
                    <Button 
                      variant="contained" 
                      color={maintenanceSettings.enableMaintenance ? "secondary" : "primary"}
                      onClick={toggleMaintenanceMode}
                    >
                      {maintenanceSettings.enableMaintenance ? 'Disable' : 'Enable'} Maintenance Mode
                    </Button>
                    <Button 
                      variant="contained" 
                      color="primary"
                      onClick={() => saveSettings('maintenance')}
                    >
                      Save Maintenance Settings
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}
        </Box>
      </Paper>
    </Container>
  );
}

export default AdminDashboard; 