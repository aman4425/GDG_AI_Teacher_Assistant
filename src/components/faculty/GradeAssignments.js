import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Grid,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Card,
  CardContent,
  Tabs,
  Tab,
  Box,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  makeStyles,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import {
  ArrowBack as ArrowBackIcon,
  CloudUpload as CloudUploadIcon,
  Check as CheckIcon,
  MoreVert as MoreVertIcon,
  AutorenewRounded as AutoGradeIcon,
  Search as SearchIcon,
  Save as SaveIcon,
  Grade as GradeIcon,
  ExpandMore as ExpandMoreIcon,
  Send as SendIcon,
  Assignment as AssignmentIcon,
  AssignmentTurnedIn as SubmittedIcon,
  Refresh as RefreshIcon,
  Description as DescriptionIcon,
  ListAlt as RubricIcon,
  AutorenewRounded as AIIcon
} from '@material-ui/icons';

import { gradeAssignmentWithAI, generatePersonalizedFeedback, evaluateEssayWithVertexAI } from '../../services/aiService';

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(3),
    borderRadius: 10,
  },
  title: {
    marginBottom: theme.spacing(3),
  },
  tableContainer: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    borderRadius: 10,
  },
  submissionCard: {
    marginTop: theme.spacing(3),
    padding: theme.spacing(3),
    borderRadius: 10,
  },
  actionButton: {
    marginRight: theme.spacing(1),
  },
  tabContent: {
    padding: theme.spacing(3),
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.background.paper,
    marginBottom: theme.spacing(2),
    width: '100%',
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
    width: '100%',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    width: '100%',
  },
  gradingContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
  questionItem: {
    marginBottom: theme.spacing(2),
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    border: `1px solid ${theme.palette.divider}`,
  },
  gradingActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: theme.spacing(2),
  },
  feedback: {
    marginTop: theme.spacing(2),
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.default,
    borderRadius: theme.shape.borderRadius,
    border: `1px solid ${theme.palette.divider}`,
  },
  buttonProgress: {
    marginRight: theme.spacing(1),
  },
  score: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: theme.palette.primary.main,
    textAlign: 'center',
  },
  scoreLabel: {
    textAlign: 'center',
  },
  root: {
    width: '100%',
    padding: theme.spacing(2),
  },
  questionPaper: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    border: `1px solid ${theme.palette.divider}`,
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
  chip: {
    margin: theme.spacing(0.5),
  },
  divider: {
    margin: theme.spacing(2, 0),
  },
  studentInfo: {
    marginBottom: theme.spacing(2),
  },
  aiButton: {
    backgroundColor: '#a142f4',
    color: 'white',
    '&:hover': {
      backgroundColor: '#8a36d1',
    },
    marginRight: theme.spacing(1),
  },
  submittedChip: {
    backgroundColor: theme.palette.success.light,
    color: theme.palette.success.dark,
  },
  pendingChip: {
    backgroundColor: theme.palette.warning.light,
    color: theme.palette.warning.dark,
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: theme.spacing(2),
  },
  sliderContainer: {
    padding: theme.spacing(2, 0),
  },
  sliderLabel: {
    marginTop: theme.spacing(1),
  },
  pointsDisplay: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: theme.spacing(1),
  },
}));

// Mock data for pending assignments
const MOCK_ASSIGNMENTS = [
  { id: 1, title: 'Introduction to Algorithms', subject: 'Computer Science', dueDate: '2023-06-15', submissions: 23, graded: 18, student: null },
  { id: 2, title: 'Advanced Calculus Concepts', subject: 'Mathematics', dueDate: '2023-06-18', submissions: 18, graded: 12, student: null },
  { id: 3, title: 'Literary Analysis: Shakespeare', subject: 'English Literature', dueDate: '2023-06-20', submissions: 25, graded: 25, student: null },
];

// Mock data for student submissions
const MOCK_SUBMISSIONS = [
  { id: 101, studentId: 'S1001', studentName: 'Emma Smith', submissionDate: '2023-06-10', status: 'pending' },
  { id: 102, studentId: 'S1002', studentName: 'Aiden Johnson', submissionDate: '2023-06-11', status: 'pending' },
  { id: 103, studentId: 'S1003', studentName: 'Olivia Williams', submissionDate: '2023-06-12', status: 'pending' },
  { id: 104, studentId: 'S1004', studentName: 'Noah Brown', submissionDate: '2023-06-13', status: 'graded', score: 85 },
  { id: 105, studentId: 'S1005', studentName: 'Sophia Jones', submissionDate: '2023-06-14', status: 'graded', score: 92 },
];

// Mock submission details
const MOCK_SUBMISSION_DETAILS = {
  id: 101,
  studentName: 'Emma Smith',
  studentId: 'S1001',
  submissionDate: '2023-06-10 14:32',
  assignmentTitle: 'Introduction to Algorithms',
  questions: [
    {
      id: 'q1',
      text: 'Explain the concept of time complexity in algorithms.',
      answer: "Time complexity is a measure of the amount of time an algorithm takes to run as a function of the length of the input. It's usually expressed using Big O notation, which describes the upper bound of the growth rate of the algorithm's running time. For example, O(n) means the algorithm's running time grows linearly with the input size, while O(n²) means it grows quadratically.",
      maxPoints: 10
    },
    {
      id: 'q2',
      text: 'Compare and contrast merge sort and quick sort algorithms.',
      answer: "Merge sort and quick sort are both efficient sorting algorithms with an average time complexity of O(n log n). Merge sort uses a divide-and-conquer approach, splitting the array recursively and then merging the sorted subarrays. It has a consistent O(n log n) performance regardless of the input data. Quick sort also uses divide-and-conquer but selects a pivot element and partitions the array around it. While quick sort is often faster in practice, it can degrade to O(n²) in the worst case with poor pivot choices. Merge sort requires additional O(n) space, while quick sort can be implemented in-place with O(log n) space complexity for recursion.",
      maxPoints: 10
    },
    {
      id: 'q3',
      text: 'Implement a basic graph traversal algorithm.',
      answer: `function bfs(graph, startNode) {
  const visited = new Set();
  const queue = [startNode];
  visited.add(startNode);
  
  while (queue.length > 0) {
    const currentNode = queue.shift();
    console.log(currentNode); // Process node
    
    for (const neighbor of graph[currentNode]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
}`,
      maxPoints: 10
    }
  ]
};

function GradeAssignments() {
  const classes = useStyles();
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [gradingResults, setGradingResults] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [generatedFeedback, setGeneratedFeedback] = useState('');
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [assignments, setAssignments] = useState([]);
  const [students, setStudents] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [evaluations, setEvaluations] = useState([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [maxPoints, setMaxPoints] = useState(0);
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [feedback, setFeedback] = useState('');

  // Load submissions when an assignment is selected
  useEffect(() => {
    if (selectedAssignment) {
      // In a real app, this would fetch submissions for the selected assignment
      setSubmissions(MOCK_SUBMISSIONS);
    }
  }, [selectedAssignment]);

  // Load assignments when tab changes
  useEffect(() => {
    const mockAssignments = [
      {
        id: 'a1',
        title: 'Algorithm Analysis',
        class: 'C1',
        dueDate: '2023-07-20',
        totalSubmissions: 18,
        pendingGrading: 5,
        totalPoints: 50
      },
      {
        id: 'a2',
        title: 'Data Structures Implementation',
        class: 'C1',
        dueDate: '2023-07-15',
        totalSubmissions: 20,
        pendingGrading: 0,
        totalPoints: 75
      },
      {
        id: 'a3',
        title: 'Ecosystem Analysis',
        class: 'C2',
        dueDate: '2023-07-18',
        totalSubmissions: 15,
        pendingGrading: 8,
        totalPoints: 40
      }
    ];
    setAssignments(mockAssignments);
  }, []);

  // Load students when tab changes
  useEffect(() => {
    const mockStudents = [
      { id: 'S1001', name: 'Alex Johnson', grade: '10th', class: 'C1', status: 'submitted' },
      { id: 'S1002', name: 'Emma Wilson', grade: '10th', class: 'C1', status: 'submitted' },
      { id: 'S1003', name: 'Michael Brown', grade: '9th', class: 'C2', status: 'submitted' },
      { id: 'S1004', name: 'Sophia Davis', grade: '11th', class: 'C3', status: 'pending' },
      { id: 'S1005', name: 'Daniel Miller', grade: '9th', class: 'C2', status: 'submitted' },
    ];
    setStudents(mockStudents);
  }, []);

  // Load questions when assignment is selected
  useEffect(() => {
    if (selectedAssignment) {
      // Mock questions for Algorithm Analysis
      const mockQuestions = [
        {
          id: 'q1',
          text: 'Explain the concept of time complexity in algorithms.',
          answer: "Time complexity is a measure of the amount of time an algorithm takes to run as a function of the length of the input. It's usually expressed using Big O notation, which describes the upper bound of the growth rate of the algorithm's running time. For example, O(n) means the algorithm's running time grows linearly with the input size, while O(n²) means it grows quadratically.",
          maxPoints: 10
        },
        {
          id: 'q2',
          text: 'What is the time complexity of binary search? Explain why.',
          answer: "The time complexity of binary search is O(log n) because the algorithm divides the search interval in half with each comparison. Since the size of the input is reduced by half in each step, the maximum number of comparisons needed to find the target is logarithmic in the size of the input array.",
          maxPoints: 10
        },
        {
          id: 'q3',
          text: 'Compare and contrast quicksort and mergesort algorithms.',
          answer: "Quicksort and mergesort are both efficient sorting algorithms with average-case time complexity of O(n log n). Mergesort uses a divide-and-conquer approach, dividing the array into halves, sorting them recursively, and then merging the sorted halves. It's stable and guarantees O(n log n) performance but requires additional O(n) space. Quicksort also uses divide-and-conquer by selecting a 'pivot' element and partitioning the array around it. It's generally faster in practice due to better cache performance and lower constant factors, but it has a worst-case time complexity of O(n²) and is not stable.",
          maxPoints: 15
        },
        {
          id: 'q4',
          text: 'What is space complexity and why is it important?',
          answer: "Space complexity measures the total amount of memory space an algorithm uses relative to the input size. It's important because in many applications, memory is a limited resource. Even if an algorithm is time-efficient, it might not be practical if it requires too much memory. For example, an algorithm with O(1) space complexity uses constant space regardless of input size, while an algorithm with O(n) space complexity uses memory proportional to the input size.",
          maxPoints: 10
        },
        {
          id: 'q5',
          text: 'Describe a real-world scenario where algorithm efficiency matters significantly.',
          answer: "Algorithm efficiency matters significantly in real-time systems like GPS navigation. When calculating routes in GPS applications, algorithms must process massive graph data representing road networks and find optimal paths quickly. Users expect immediate results when requesting directions or when recalculations are needed due to wrong turns. An inefficient routing algorithm could cause noticeable delays, leading to missed turns and user frustration. Additionally, mobile devices have limited processing power and battery life, so efficient algorithms directly impact device performance and battery consumption.",
          maxPoints: 5
        }
      ];
      setQuestions(mockQuestions);
      
      // Calculate max points
      const totalMax = mockQuestions.reduce((sum, q) => sum + q.maxPoints, 0);
      setMaxPoints(totalMax);
    }
  }, [selectedAssignment]);

  // Load student's answers and existing evaluations
  useEffect(() => {
    if (selectedStudent && selectedAssignment) {
      // Reset evaluations when student changes
      const initialEvaluations = questions.map(q => ({
        questionId: q.id,
        points: 0,
        feedback: ''
      }));
      setEvaluations(initialEvaluations);
      setFeedback('');
      setTotalPoints(0);
    }
  }, [selectedStudent, selectedAssignment, questions]);

  // Update total points when evaluations change
  useEffect(() => {
    const total = evaluations.reduce((sum, eval_) => sum + eval_.points, 0);
    setTotalPoints(total);
  }, [evaluations]);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleSelectAssignment = (assignment) => {
    setSelectedAssignment(assignment);
    setSelectedSubmission(null);
    setGradingResults(null);
  };

  const handleBackToAssignments = () => {
    setSelectedAssignment(null);
    setSelectedSubmission(null);
    setGradingResults(null);
  };

  const handleSelectSubmission = (submission) => {
    setSelectedSubmission(MOCK_SUBMISSION_DETAILS);
    setGradingResults(null);
  };

  const handleBackToSubmissions = () => {
    setSelectedSubmission(null);
    setGradingResults(null);
  };

  const handleAutoGrade = async () => {
    setLoading(true);
    
    try {
      // Create a rubric from the questions
      const rubric = selectedSubmission.questions.map(q => ({
        questionId: q.id,
        maxPoints: q.maxPoints,
        criteria: `Evaluate the answer based on accuracy, completeness, and clarity.`
      }));

      // Create the answers object
      const answers = {};
      selectedSubmission.questions.forEach(q => {
        answers[q.id] = q.answer;
      });

      // Use AI to grade the assignment
      const results = await gradeAssignmentWithAI({
        studentName: selectedSubmission.studentName,
        assignmentId: selectedSubmission.id,
        answers,
        rubric
      });
      
      setGradingResults(results);
      setSuccessMessage('Assignment graded successfully!');
    } catch (error) {
      console.error('Error grading assignment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleManualGradeChange = (questionId, newScore) => {
    if (!gradingResults) return;
    
    const updatedBreakdown = gradingResults.breakdown.map(item => {
      if (item.questionId === questionId) {
        return { ...item, score: parseInt(newScore, 10) || 0 };
      }
      return item;
    });
    
    // Recalculate total score
    const totalPoints = updatedBreakdown.reduce((sum, item) => sum + item.score, 0);
    const totalMaxPoints = updatedBreakdown.reduce((sum, item) => sum + item.maxPoints, 0);
    const newOverallScore = Math.round((totalPoints / totalMaxPoints) * 100);
    
    setGradingResults({
      ...gradingResults,
      breakdown: updatedBreakdown,
      score: newOverallScore
    });
  };

  const handleGenerateFeedback = async () => {
    if (!gradingResults) return;
    
    setFeedbackLoading(true);
    
    try {
      // Extract answers from the submission
      const answers = {};
      selectedSubmission.questions.forEach(q => {
        answers[q.id] = q.answer;
      });
      
      // Generate personalized feedback
      const feedback = await generatePersonalizedFeedback({
        studentName: selectedSubmission.studentName,
        assignment: selectedSubmission.assignmentTitle,
        score: gradingResults.score,
        answers,
        previousPerformance: "Consistently performing well in assignments with an average score of 85%"
      });
      
      setGeneratedFeedback(feedback);
      setDialogOpen(true);
    } catch (error) {
      console.error('Error generating feedback:', error);
    } finally {
      setFeedbackLoading(false);
    }
  };

  const handleSaveGrading = () => {
    // In a real app, this would save the grading results to a database
    setSuccessMessage('Grading saved successfully!');
    
    // Update the submission status in the list
    const updatedSubmissions = submissions.map(sub => {
      if (sub.id === selectedSubmission.id) {
        return { ...sub, status: 'graded', score: gradingResults.score };
      }
      return sub;
    });
    
    setSubmissions(updatedSubmissions);
  };

  // Handle search change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Handle student selection
  const handleStudentChange = (event) => {
    setSelectedStudent(event.target.value);
  };

  // Handle points change for a question
  const handlePointsChange = (questionId, newValue) => {
    setEvaluations(prev => 
      prev.map(e => 
        e.questionId === questionId 
          ? { ...e, points: newValue } 
          : e
      )
    );
  };

  // Handle feedback change for a question
  const handleFeedbackChange = (questionId, newFeedback) => {
    setEvaluations(prev => 
      prev.map(e => 
        e.questionId === questionId 
          ? { ...e, feedback: newFeedback } 
          : e
      )
    );
  };

  // Handle overall feedback change
  const handleOverallFeedbackChange = (event) => {
    setFeedback(event.target.value);
  };

  // Get question by ID
  const getQuestionById = (questionId) => {
    return questions.find(q => q.id === questionId);
  };

  // Get student by ID
  const getStudentById = (studentId) => {
    return students.find(s => s.id === studentId);
  };

  // Get assignment by ID
  const getAssignmentById = (assignmentId) => {
    return assignments.find(a => a.id === assignmentId);
  };

  // Use AI to help grade an essay question
  const handleAIGrading = async (questionId) => {
    const question = getQuestionById(questionId);
    if (!question) return;
    
    setLoading(true);
    
    try {
      const student = getStudentById(selectedStudent);
      
      // Rubric for the AI to use
      const rubric = {
        criteria: [
          { name: "Understanding of Concept", weight: 40 },
          { name: "Clarity of Explanation", weight: 30 },
          { name: "Completeness", weight: 20 },
          { name: "Examples & Application", weight: 10 }
        ],
        maxPoints: question.maxPoints
      };
      
      // Call AI service for evaluation
      const result = await evaluateEssayWithVertexAI(
        question.text,
        question.answer,
        rubric
      );
      
      if (result) {
        // Update the evaluation with AI feedback
        const aiSuggestedPoints = result.suggestedPoints;
        const aiFeedback = `${result.overallFeedback}\n\nStrengths:\n- ${result.strengths.join('\n- ')}\n\nAreas for Improvement:\n- ${result.areasForImprovement.join('\n- ')}`;
        
        setEvaluations(prev => 
          prev.map(e => 
            e.questionId === questionId 
              ? { 
                  ...e, 
                  points: aiSuggestedPoints, 
                  feedback: aiFeedback
                } 
              : e
          )
        );
      } else {
        // Fallback if AI service fails
        alert('AI grading assistance is currently unavailable. Please grade manually.');
      }
    } catch (error) {
      console.error('Error in AI grading:', error);
      alert('Failed to get AI grading assistance. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Submit grades for the selected student
  const handleSubmitGrades = () => {
    // Validate that all questions have points assigned
    const allGraded = evaluations.every(e => e.points > 0);
    
    if (!allGraded) {
      if (!window.confirm('Some questions have not been graded (0 points). Continue anyway?')) {
        return;
      }
    }
    
    // In a real application, this would save to the database
    alert(`Grades submitted for ${getStudentById(selectedStudent)?.name}. Total points: ${totalPoints}/${maxPoints}`);
    
    // Clear selections
    setSelectedStudent('');
    setEvaluations([]);
    setFeedback('');
  };

  // Filtered assignments based on search
  const filteredAssignments = assignments.filter(
    assignment => 
      assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assignment.class.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Filtered students based on selected assignment
  const filteredStudents = students.filter(
    student => selectedAssignment ? (
      getAssignmentById(selectedAssignment)?.class === student.class &&
      student.status === 'submitted'
    ) : false
  );

  // Render the assignment list
  if (!selectedAssignment) {
    return (
      <Container>
        <Paper className={classes.paper}>
          <Typography variant="h5" className={classes.title}>
            Assignments to Grade
          </Typography>
          
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <TextField
              placeholder="Search assignments..."
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              variant="outlined"
              size="small"
              fullWidth
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          
          <Tabs
            value={tabValue}
            onChange={(event, newValue) => {
              setTabValue(newValue);
            }}
            indicatorColor="primary"
            textColor="primary"
            centered
          >
            <Tab label="Pending" />
            <Tab label="In Progress" />
            <Tab label="Completed" />
          </Tabs>
          
          <TableContainer component={Paper} className={classes.tableContainer}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Assignment Title</TableCell>
                  <TableCell>Subject</TableCell>
                  <TableCell>Due Date</TableCell>
                  <TableCell>Submissions</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredAssignments.map((assignment) => (
                  <TableRow key={assignment.id}>
                    <TableCell>{assignment.title}</TableCell>
                    <TableCell>{assignment.class}</TableCell>
                    <TableCell>{assignment.dueDate}</TableCell>
                    <TableCell>{assignment.totalSubmissions} received</TableCell>
                    <TableCell>
                      {assignment.pendingGrading > 0 ? (
                        <Chip label={assignment.pendingGrading} color="secondary" size="small" />
                      ) : (
                        'All graded'
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        onClick={() => {
                          setSelectedAssignment(assignment.id);
                          setTabValue(1);
                        }}
                      >
                        Grade
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Container>
    );
  }

  // Render the submissions list for a selected assignment
  if (selectedAssignment && !selectedSubmission) {
    return (
      <Container>
        <Paper className={classes.paper}>
          <Box display="flex" alignItems="center" mb={3}>
            <IconButton
              className={classes.actionButton}
              onClick={handleBackToAssignments}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h5">
              {selectedAssignment} - Student Submissions
            </Typography>
          </Box>
          
          <TableContainer component={Paper} className={classes.tableContainer}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Student ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Submission Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Score</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {submissions.map((submission) => (
                  <TableRow key={submission.id}>
                    <TableCell>{submission.studentId}</TableCell>
                    <TableCell>{submission.studentName}</TableCell>
                    <TableCell>{submission.submissionDate}</TableCell>
                    <TableCell>
                      {submission.status === 'graded' ? (
                        <Typography variant="body2" style={{ color: 'green' }}>
                          <CheckIcon fontSize="small" style={{ verticalAlign: 'middle' }} /> Graded
                        </Typography>
                      ) : (
                        'Pending'
                      )}
                    </TableCell>
                    <TableCell>
                      {submission.status === 'graded' ? `${submission.score}%` : '-'}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        onClick={() => handleSelectSubmission(submission)}
                      >
                        Grade
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Container>
    );
  }

  // Render the submission details and grading interface
  return (
    <Container>
      <Paper className={classes.paper}>
        <Box display="flex" alignItems="center" mb={3}>
          <IconButton
            className={classes.actionButton}
            onClick={handleBackToSubmissions}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h5">
            Grade Submission - {selectedSubmission.studentName}
          </Typography>
        </Box>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Submission Details
                </Typography>
                <Divider style={{ marginBottom: 16 }} />
                
                <Typography variant="body2">
                  <strong>Student:</strong> {selectedSubmission.studentName}
                </Typography>
                <Typography variant="body2">
                  <strong>Student ID:</strong> {selectedSubmission.studentId}
                </Typography>
                <Typography variant="body2">
                  <strong>Assignment:</strong> {selectedSubmission.assignmentTitle}
                </Typography>
                <Typography variant="body2">
                  <strong>Submitted:</strong> {selectedSubmission.submissionDate}
                </Typography>
                
                {gradingResults && (
                  <>
                    <Box mt={3} mb={2}>
                      <Typography variant="h5" className={classes.score}>
                        {gradingResults.score}%
                      </Typography>
                      <Typography variant="body2" className={classes.scoreLabel}>
                        Overall Score
                      </Typography>
                    </Box>
                    
                    <Box display="flex" justifyContent="center" mt={2}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleGenerateFeedback}
                        disabled={feedbackLoading}
                        startIcon={feedbackLoading ? <CircularProgress size={20} /> : null}
                      >
                        Generate Feedback
                      </Button>
                    </Box>
                  </>
                )}
                
                {!gradingResults && (
                  <Box display="flex" justifyContent="center" mt={3}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleAutoGrade}
                      disabled={loading}
                      startIcon={loading ? <CircularProgress size={20} /> : <AutoGradeIcon />}
                    >
                      Auto Grade with AI
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={8}>
            <div className={classes.gradingContainer}>
              {selectedSubmission.questions.map((question, index) => (
                <div key={question.id} className={classes.questionItem}>
                  <Typography variant="subtitle1" gutterBottom>
                    <strong>Question {index + 1}:</strong> {question.text}
                  </Typography>
                  
                  <Typography variant="body2" gutterBottom style={{ whiteSpace: 'pre-wrap' }}>
                    <strong>Student's Answer:</strong><br />
                    {question.answer}
                  </Typography>
                  
                  {gradingResults && (
                    <div className={classes.feedback}>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={8}>
                          <Typography variant="body2">
                            <strong>AI-Generated Feedback:</strong><br />
                            {gradingResults.breakdown.find(b => b.questionId === question.id)?.feedback || 'No feedback available.'}
                          </Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <TextField
                            label="Score"
                            type="number"
                            variant="outlined"
                            size="small"
                            fullWidth
                            value={gradingResults.breakdown.find(b => b.questionId === question.id)?.score || 0}
                            onChange={(e) => handleManualGradeChange(question.id, e.target.value)}
                            InputProps={{
                              inputProps: { min: 0, max: question.maxPoints },
                              endAdornment: <Typography variant="body2">/ {question.maxPoints}</Typography>
                            }}
                          />
                        </Grid>
                      </Grid>
                    </div>
                  )}
                </div>
              ))}
              
              {gradingResults && (
                <div className={classes.gradingActions}>
                  <Button
                    variant="outlined"
                    color="primary"
                    className={classes.actionButton}
                    onClick={() => setGradingResults(null)}
                  >
                    Reset Grading
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSaveGrading}
                  >
                    Save Grading
                  </Button>
                </div>
              )}
            </div>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Feedback Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>AI-Generated Personalized Feedback</DialogTitle>
        <DialogContent>
          <Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }}>
            {generatedFeedback}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="primary">
            Close
          </Button>
          <Button color="primary" variant="contained">
            Send to Student
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Success Message */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={4000}
        onClose={() => setSuccessMessage('')}
      >
        <Alert onClose={() => setSuccessMessage('')} severity="success">
          {successMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default GradeAssignments; 