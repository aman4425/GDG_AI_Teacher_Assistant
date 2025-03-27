import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  CircularProgress,
  Chip,
  IconButton,
  Divider,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  makeStyles
} from '@material-ui/core';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Send as SendIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Refresh as RefreshIcon,
  Save as SaveIcon,
  AutorenewRounded as AIIcon
} from '@material-ui/icons';

// Import AI service for generating feedback
import { generatePersonalizedFeedback } from '../../services/aiService';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    padding: theme.spacing(2),
  },
  paper: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 200,
  },
  tableHeader: {
    backgroundColor: theme.palette.primary.light,
    '& .MuiTableCell-head': {
      color: theme.palette.common.white,
      fontWeight: 'bold',
    },
  },
  searchField: {
    marginBottom: theme.spacing(2),
  },
  actionButtons: {
    '& > *': {
      marginRight: theme.spacing(1),
    },
  },
  sentChip: {
    backgroundColor: theme.palette.success.light,
    color: theme.palette.success.dark,
  },
  draftChip: {
    backgroundColor: theme.palette.warning.light,
    color: theme.palette.warning.dark,
  },
  feedbackForm: {
    marginTop: theme.spacing(2),
  },
  aiButton: {
    backgroundColor: '#a142f4',
    color: 'white',
    '&:hover': {
      backgroundColor: '#8a36d1',
    },
  },
  tabPanel: {
    padding: theme.spacing(2),
  },
  chip: {
    margin: theme.spacing(0.5),
  },
  divider: {
    margin: theme.spacing(2, 0),
  },
  title: {
    fontWeight: 'bold',
  },
  studentSelector: {
    marginBottom: theme.spacing(2),
  },
  feedbackCard: {
    marginBottom: theme.spacing(2),
    borderLeft: `4px solid ${theme.palette.primary.main}`,
  },
}));

// TabPanel component for the tabs
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`feedback-tabpanel-${index}`}
      aria-labelledby={`feedback-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
}

const FacultyFeedback = () => {
  const classes = useStyles();
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [feedbackTitle, setFeedbackTitle] = useState('');
  const [feedbackContent, setFeedbackContent] = useState('');
  const [feedbackList, setFeedbackList] = useState([]);
  const [filteredFeedback, setFilteredFeedback] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState(null);

  // Mock data for students
  const students = [
    { id: 'S1001', name: 'Alex Johnson', grade: '10th', class: 'C1' },
    { id: 'S1002', name: 'Emma Wilson', grade: '10th', class: 'C1' },
    { id: 'S1003', name: 'Michael Brown', grade: '9th', class: 'C2' },
    { id: 'S1004', name: 'Sophia Davis', grade: '11th', class: 'C3' },
    { id: 'S1005', name: 'Daniel Miller', grade: '9th', class: 'C2' },
  ];

  // Mock data for classes
  const classes_ = [
    { id: 'C1', name: 'Mathematics - 10th Grade' },
    { id: 'C2', name: 'Science - 9th Grade' },
    { id: 'C3', name: 'English - 11th Grade' },
    { id: 'C4', name: 'History - 10th Grade' },
  ];

  // Mock feedback data
  useEffect(() => {
    const mockFeedback = [
      {
        id: 'F1',
        studentId: 'S1001',
        studentName: 'Alex Johnson',
        title: 'Math Test Performance',
        content: 'Alex has shown significant improvement in algebra concepts. The work on equations was especially impressive. Continue working on graphing skills.',
        date: '2023-06-15',
        status: 'sent',
        class: 'C1'
      },
      {
        id: 'F2',
        studentId: 'S1002',
        studentName: 'Emma Wilson',
        title: 'Project Feedback',
        content: 'Emma\'s project on polynomials was excellent. Well-researched and presented. Next step is to focus more on practical applications.',
        date: '2023-06-14',
        status: 'sent',
        class: 'C1'
      },
      {
        id: 'F3',
        studentId: 'S1003',
        studentName: 'Michael Brown',
        title: 'Science Lab Report',
        content: 'The lab report needs improvement in methodology section. Results are well-documented but conclusions need to be more clearly stated.',
        date: '2023-06-10',
        status: 'draft',
        class: 'C2'
      },
      {
        id: 'F4',
        studentId: 'S1004',
        studentName: 'Sophia Davis',
        title: 'Literature Analysis',
        content: 'Sophia demonstrates excellent critical thinking in her analysis of Shakespeare. Work on citation format for future assignments.',
        date: '2023-06-08',
        status: 'sent',
        class: 'C3'
      },
      {
        id: 'F5',
        studentId: 'S1005',
        studentName: 'Daniel Miller',
        title: 'Quarterly Progress',
        content: 'Daniel needs to focus more on completing homework assignments on time. In-class participation is good but consistency in submission is lacking.',
        date: '2023-06-05',
        status: 'draft',
        class: 'C2'
      },
    ];

    setFeedbackList(mockFeedback);
    setFilteredFeedback(mockFeedback);
  }, []);

  // Filter feedback based on search query and tab
  useEffect(() => {
    let filtered = feedbackList;

    // Filter by search query
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        feedback => 
          feedback.studentName.toLowerCase().includes(query) ||
          feedback.title.toLowerCase().includes(query) ||
          feedback.content.toLowerCase().includes(query)
      );
    }

    // Filter by tab (sent/draft)
    if (tabValue === 1) {
      filtered = filtered.filter(feedback => feedback.status === 'sent');
    } else if (tabValue === 2) {
      filtered = filtered.filter(feedback => feedback.status === 'draft');
    }

    // Filter by class if selected
    if (selectedClass) {
      filtered = filtered.filter(feedback => feedback.class === selectedClass);
    }

    setFilteredFeedback(filtered);
  }, [searchQuery, tabValue, feedbackList, selectedClass]);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Handle search change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Handle student change
  const handleStudentChange = (event) => {
    setSelectedStudent(event.target.value);
  };

  // Handle class change
  const handleClassChange = (event) => {
    setSelectedClass(event.target.value);
  };

  // Clear form
  const handleClearForm = () => {
    setSelectedStudent('');
    setFeedbackTitle('');
    setFeedbackContent('');
    setCurrentFeedback(null);
  };

  // Open edit dialog
  const handleEditFeedback = (feedback) => {
    setCurrentFeedback(feedback);
    setSelectedStudent(feedback.studentId);
    setFeedbackTitle(feedback.title);
    setFeedbackContent(feedback.content);
    setOpenDialog(true);
  };

  // Close dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Delete feedback
  const handleDeleteFeedback = (feedbackId) => {
    if (window.confirm('Are you sure you want to delete this feedback?')) {
      const updatedFeedback = feedbackList.filter(feedback => feedback.id !== feedbackId);
      setFeedbackList(updatedFeedback);
    }
  };

  // Send feedback
  const handleSendFeedback = () => {
    if (!selectedStudent || !feedbackTitle || !feedbackContent) {
      alert('Please fill in all fields');
      return;
    }

    const student = students.find(s => s.id === selectedStudent);
    
    // If editing existing feedback
    if (currentFeedback) {
      const updatedFeedback = feedbackList.map(feedback => {
        if (feedback.id === currentFeedback.id) {
          return {
            ...feedback,
            studentId: selectedStudent,
            studentName: student.name,
            title: feedbackTitle,
            content: feedbackContent,
            date: new Date().toISOString().split('T')[0],
            status: 'sent',
            class: student.class
          };
        }
        return feedback;
      });
      setFeedbackList(updatedFeedback);
    } else {
      // Creating new feedback
      const newFeedback = {
        id: `F${feedbackList.length + 1}`,
        studentId: selectedStudent,
        studentName: student.name,
        title: feedbackTitle,
        content: feedbackContent,
        date: new Date().toISOString().split('T')[0],
        status: 'sent',
        class: student.class
      };
      setFeedbackList([...feedbackList, newFeedback]);
    }

    // Clear form and close dialog
    handleClearForm();
    handleCloseDialog();
    
    // Show success message
    alert('Feedback sent successfully!');
  };

  // Save as draft
  const handleSaveDraft = () => {
    if (!selectedStudent || !feedbackTitle || !feedbackContent) {
      alert('Please fill in all fields');
      return;
    }

    const student = students.find(s => s.id === selectedStudent);
    
    // If editing existing feedback
    if (currentFeedback) {
      const updatedFeedback = feedbackList.map(feedback => {
        if (feedback.id === currentFeedback.id) {
          return {
            ...feedback,
            studentId: selectedStudent,
            studentName: student.name,
            title: feedbackTitle,
            content: feedbackContent,
            date: new Date().toISOString().split('T')[0],
            status: 'draft',
            class: student.class
          };
        }
        return feedback;
      });
      setFeedbackList(updatedFeedback);
    } else {
      // Creating new draft
      const newFeedback = {
        id: `F${feedbackList.length + 1}`,
        studentId: selectedStudent,
        studentName: student.name,
        title: feedbackTitle,
        content: feedbackContent,
        date: new Date().toISOString().split('T')[0],
        status: 'draft',
        class: student.class
      };
      setFeedbackList([...feedbackList, newFeedback]);
    }

    // Clear form and close dialog
    handleClearForm();
    handleCloseDialog();
    
    // Show success message
    alert('Draft saved successfully!');
  };

  // Generate AI feedback
  const handleGenerateAIFeedback = async () => {
    if (!selectedStudent) {
      alert('Please select a student first');
      return;
    }

    setIsLoading(true);

    try {
      // Get student performances from various assignments (mock data)
      const student = students.find(s => s.id === selectedStudent);
      
      // Mock data for student performance
      const mockPerformance = {
        recentScores: [85, 92, 78, 90],
        averageScore: 86.25,
        strengths: ['Problem solving', 'Critical thinking'],
        weaknesses: ['Time management', 'Presentation skills']
      };
      
      // Mock data for questions and answers
      const mockQuestions = [
        'Explain the concept of derivatives in calculus',
        'Solve the quadratic equation: 2x² - 5x + 3 = 0',
        'Describe the relationship between polynomials and their graphs'
      ];
      
      const mockAnswers = [
        'A derivative measures the rate of change of a function with respect to one of its variables',
        'Using the quadratic formula: x = (5 ± √(25-24))/4 = (5 ± √1)/4 = (5 ± 1)/4, so x = 1.5 or x = 1',
        'Polynomials create smooth curves where the degree determines the maximum number of turns'
      ];
      
      const mockCorrectAnswers = [
        'A derivative represents the instantaneous rate of change of a function with respect to one of its variables',
        'x = (5 ± √(25-24))/4 = (5 ± 1)/4, so x = 3/2 or x = 1/2',
        'Polynomials produce continuous curves where the degree determines the maximum number of turning points'
      ];

      // Generate feedback using AI service
      const feedbackParams = {
        studentName: student.name,
        performance: mockPerformance,
        questions: mockQuestions,
        answers: mockAnswers,
        correctAnswers: mockCorrectAnswers
      };

      const generatedFeedback = await generatePersonalizedFeedback(feedbackParams);
      
      // For demo purposes, if AI service fails to generate, use fallback
      if (!generatedFeedback) {
        setFeedbackTitle(`${student.name}'s Academic Progress`);
        setFeedbackContent(`${student.name} has been making good progress in class. Continue to focus on improving time management skills while maintaining your excellent problem-solving abilities. Your recent quiz scores show improvement, especially in the conceptual questions. For the next assignment, pay special attention to showing all steps in your work.`);
      } else {
        // Set feedback based on AI generation
        setFeedbackTitle(`Personalized Feedback for ${student.name}`);
        setFeedbackContent(
          `${generatedFeedback.overallAssessment}\n\n` +
          `Strengths:\n${generatedFeedback.strengths.join('\n')}\n\n` +
          `Areas for Improvement:\n${generatedFeedback.areasForImprovement.join('\n')}\n\n` +
          `Recommended Resources:\n${generatedFeedback.suggestedResources.join('\n')}\n\n` +
          `${generatedFeedback.encouragement}`
        );
      }
    } catch (error) {
      console.error('Error generating AI feedback:', error);
      alert('Failed to generate AI feedback. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Typography variant="h5" className={classes.title} gutterBottom>
          Student Feedback Management
        </Typography>
        
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          aria-label="feedback tabs"
        >
          <Tab label="All Feedback" />
          <Tab label="Sent" />
          <Tab label="Drafts" />
          <Tab label="Create New" />
        </Tabs>
        
        {/* All Feedback, Sent, and Drafts tabs */}
        {tabValue < 3 && (
          <TabPanel value={tabValue} index={tabValue} className={classes.tabPanel}>
            <Box display="flex" alignItems="center" mb={2}>
              <TextField
                className={classes.searchField}
                variant="outlined"
                size="small"
                placeholder="Search feedback..."
                value={searchQuery}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <SearchIcon color="action" style={{ marginRight: 8 }} />
                  ),
                }}
                style={{ flexGrow: 1, marginRight: 16 }}
              />
              
              <FormControl variant="outlined" size="small" style={{ minWidth: 200 }}>
                <InputLabel id="class-filter-label">Filter by Class</InputLabel>
                <Select
                  labelId="class-filter-label"
                  id="class-filter"
                  value={selectedClass}
                  onChange={handleClassChange}
                  label="Filter by Class"
                >
                  <MenuItem value="">
                    <em>All Classes</em>
                  </MenuItem>
                  {classes_.map((cls) => (
                    <MenuItem key={cls.id} value={cls.id}>
                      {cls.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            
            <TableContainer>
              <Table>
                <TableHead className={classes.tableHeader}>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Student</TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredFeedback.length > 0 ? (
                    filteredFeedback.map((feedback) => (
                      <TableRow key={feedback.id}>
                        <TableCell>{feedback.date}</TableCell>
                        <TableCell>{feedback.studentName}</TableCell>
                        <TableCell>{feedback.title}</TableCell>
                        <TableCell>
                          <Chip
                            label={feedback.status === 'sent' ? 'Sent' : 'Draft'}
                            className={feedback.status === 'sent' ? classes.sentChip : classes.draftChip}
                            size="small"
                          />
                        </TableCell>
                        <TableCell className={classes.actionButtons}>
                          <IconButton size="small" color="primary" onClick={() => handleEditFeedback(feedback)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton size="small" color="secondary" onClick={() => handleDeleteFeedback(feedback.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        No feedback found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>
        )}
        
        {/* Create New tab */}
        <TabPanel value={tabValue} index={3} className={classes.tabPanel}>
          <Grid container spacing={2} className={classes.feedbackForm}>
            <Grid item xs={12}>
              <FormControl variant="outlined" fullWidth className={classes.studentSelector}>
                <InputLabel id="student-select-label">Select Student</InputLabel>
                <Select
                  labelId="student-select-label"
                  id="student-select"
                  value={selectedStudent}
                  onChange={handleStudentChange}
                  label="Select Student"
                >
                  <MenuItem value="">
                    <em>Select a student</em>
                  </MenuItem>
                  {students.map((student) => (
                    <MenuItem key={student.id} value={student.id}>
                      {student.name} ({student.grade})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                label="Feedback Title"
                variant="outlined"
                fullWidth
                value={feedbackTitle}
                onChange={(e) => setFeedbackTitle(e.target.value)}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                label="Feedback Content"
                variant="outlined"
                fullWidth
                multiline
                rows={8}
                value={feedbackContent}
                onChange={(e) => setFeedbackContent(e.target.value)}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Box display="flex" justifyContent="space-between">
                <Box>
                  <Button
                    variant="contained"
                    className={classes.aiButton}
                    startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <AIIcon />}
                    onClick={handleGenerateAIFeedback}
                    disabled={isLoading || !selectedStudent}
                  >
                    {isLoading ? 'Generating...' : 'Generate with AI'}
                  </Button>
                </Box>
                
                <Box>
                  <Button
                    variant="outlined"
                    color="default"
                    onClick={handleClearForm}
                    style={{ marginRight: 8 }}
                  >
                    Clear
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<SaveIcon />}
                    onClick={handleSaveDraft}
                    style={{ marginRight: 8 }}
                  >
                    Save Draft
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<SendIcon />}
                    onClick={handleSendFeedback}
                  >
                    Send Feedback
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </TabPanel>
      </Paper>
      
      {/* Preview recent feedback */}
      {tabValue < 3 && filteredFeedback.length > 0 && (
        <Paper className={classes.paper}>
          <Typography variant="h6" gutterBottom>
            Recent Feedback Preview
          </Typography>
          <Divider className={classes.divider} />
          
          {filteredFeedback.slice(0, 2).map((feedback) => (
            <Card key={feedback.id} className={classes.feedbackCard}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="subtitle1" gutterBottom>
                    <strong>{feedback.title}</strong>
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {feedback.date}
                  </Typography>
                </Box>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  To: {feedback.studentName}
                </Typography>
                <Divider style={{ margin: '8px 0' }} />
                <Typography variant="body1">
                  {feedback.content}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Paper>
      )}
      
      {/* Edit Feedback Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="edit-feedback-dialog"
        maxWidth="md"
        fullWidth
      >
        <DialogTitle id="edit-feedback-dialog">
          {currentFeedback ? 'Edit Feedback' : 'Create New Feedback'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl variant="outlined" fullWidth className={classes.studentSelector}>
                <InputLabel id="dialog-student-select-label">Student</InputLabel>
                <Select
                  labelId="dialog-student-select-label"
                  id="dialog-student-select"
                  value={selectedStudent}
                  onChange={handleStudentChange}
                  label="Student"
                >
                  {students.map((student) => (
                    <MenuItem key={student.id} value={student.id}>
                      {student.name} ({student.grade})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                label="Feedback Title"
                variant="outlined"
                fullWidth
                value={feedbackTitle}
                onChange={(e) => setFeedbackTitle(e.target.value)}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                label="Feedback Content"
                variant="outlined"
                fullWidth
                multiline
                rows={8}
                value={feedbackContent}
                onChange={(e) => setFeedbackContent(e.target.value)}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="default">
            Cancel
          </Button>
          <Button 
            onClick={handleSaveDraft} 
            color="primary"
            startIcon={<SaveIcon />}
          >
            Save Draft
          </Button>
          <Button 
            onClick={handleSendFeedback} 
            color="primary" 
            variant="contained"
            startIcon={<SendIcon />}
          >
            Send Feedback
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default FacultyFeedback; 