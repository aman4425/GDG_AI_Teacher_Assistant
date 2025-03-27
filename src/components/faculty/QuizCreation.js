import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  CircularProgress,
  Chip,
  Box,
  Snackbar,
  makeStyles,
  Divider
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { Check as CheckIcon } from '@material-ui/icons';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

// Mock AI service - would be replaced with actual Gemini API integration
import { generateQuizWithAI } from '../../services/aiService';

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(3),
    borderRadius: 10,
  },
  formControl: {
    minWidth: '100%',
  },
  submitButton: {
    marginTop: theme.spacing(3),
  },
  topicChips: {
    display: 'flex',
    flexWrap: 'wrap',
    marginTop: theme.spacing(1),
    '& > *': {
      margin: theme.spacing(0.5),
    },
  },
  generatedQuizSection: {
    marginTop: theme.spacing(4),
  },
  questionPaper: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    borderLeft: `4px solid ${theme.palette.primary.main}`,
  },
  previewOption: {
    margin: theme.spacing(1, 0),
  },
  previewAnswer: {
    fontWeight: 'bold',
    color: theme.palette.success.main,
    marginTop: theme.spacing(1),
  },
  previewExplanation: {
    marginTop: theme.spacing(1),
    fontStyle: 'italic',
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: theme.spacing(2),
  },
}));

// Helper function to safely render math expressions
const renderMathExpression = (text) => {
  if (!text) return '';
  
  // Regular expression to match LaTeX expressions wrapped in \( ... \) or $ ... $ or \[ ... \]
  const mathRegex = /(\\\(|\$|\\\[)(.*?)(\\\)|\$|\\\])/g;
  
  // Check if the text contains math expressions
  if (!mathRegex.test(text)) {
    return <span>{text}</span>;
  }
  
  // Split the text into parts and render math expressions
  const parts = [];
  let lastIndex = 0;
  let match;
  
  // Reset the regex to start from the beginning
  mathRegex.lastIndex = 0;
  
  while ((match = mathRegex.exec(text)) !== null) {
    const [fullMatch, openDelim, mathExpression, closeDelim] = match;
    
    // Add the text before the math expression
    if (match.index > lastIndex) {
      parts.push(
        <span key={`text-${lastIndex}`}>
          {text.substring(lastIndex, match.index)}
        </span>
      );
    }
    
    // Add the math expression
    try {
      const isBlock = openDelim === '\\[' || (openDelim === '$' && closeDelim === '$' && mathExpression.includes('\\'));
      parts.push(
        isBlock ? (
          <BlockMath key={`math-${match.index}`} math={mathExpression} />
        ) : (
          <InlineMath key={`math-${match.index}`} math={mathExpression} />
        )
      );
    } catch (error) {
      console.error('Error rendering math:', error);
      parts.push(<span key={`math-error-${match.index}`}>{fullMatch}</span>);
    }
    
    lastIndex = match.index + fullMatch.length;
  }
  
  // Add the remaining text
  if (lastIndex < text.length) {
    parts.push(<span key={`text-${lastIndex}`}>{text.substring(lastIndex)}</span>);
  }
  
  return <>{parts}</>;
};

function QuizCreation() {
  const classes = useStyles();
  const [quizTitle, setQuizTitle] = useState('');
  const [topicInput, setTopicInput] = useState('');
  const [topics, setTopics] = useState([]);
  const [questionCount, setQuestionCount] = useState(5);
  const [quizType, setQuizType] = useState('multiple_choice');
  const [difficultyLevel, setDifficultyLevel] = useState('medium');
  const [timeLimit, setTimeLimit] = useState(30);
  const [loading, setLoading] = useState(false);
  const [generatedQuiz, setGeneratedQuiz] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleAddTopic = () => {
    if (topicInput.trim() !== '' && !topics.includes(topicInput.trim())) {
      setTopics([...topics, topicInput.trim()]);
      setTopicInput('');
    }
  };

  const handleDeleteTopic = (topicToDelete) => {
    setTopics(topics.filter((topic) => topic !== topicToDelete));
  };

  const handleGenerateQuiz = async () => {
    // Validation
    if (quizTitle.trim() === '') {
      setError('Please provide a quiz title');
      return;
    }

    if (topics.length === 0) {
      setError('Please add at least one topic');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // This would be replaced with an actual API call to Gemini
      const generatedQuizData = await generateQuizWithAI({
        title: quizTitle,
        subject: quizTitle.split(' ')[0], // Use first word of title as subject
        topics: topics,
        numQuestions: questionCount,
        questionType: quizType,
        difficulty: difficultyLevel
      });

      setGeneratedQuiz(generatedQuizData);
      setSuccess(true);
    } catch (error) {
      console.error('Error generating quiz:', error);
      setError('Failed to generate quiz. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveQuiz = () => {
    // Save quiz to database logic would go here
    setSuccess(true);
  };

  const renderQuestion = (question, index) => {
    switch (question.type) {
      case 'multiple_choice':
        return (
          <div>
            <Typography variant="body1">
              {index + 1}. {renderMathExpression(question.question)}
            </Typography>
            {question.options?.map((option, i) => (
              <Typography key={i} variant="body2" className={classes.previewOption}>
                {String.fromCharCode(65 + i)}. {renderMathExpression(option)}
              </Typography>
            ))}
            <Typography variant="body2" className={classes.previewAnswer}>
              Correct Answer: {renderMathExpression(question.correctAnswer)}
            </Typography>
            <Typography variant="body2" className={classes.previewExplanation}>
              Explanation: {renderMathExpression(question.explanation)}
            </Typography>
          </div>
        );
      case 'fill_blank':
        return (
          <div>
            <Typography variant="body1">
              {index + 1}. {renderMathExpression(question.question)}
            </Typography>
            <Typography variant="body2" className={classes.previewAnswer}>
              Correct Answer: {renderMathExpression(question.correctAnswer)}
            </Typography>
            <Typography variant="body2" className={classes.previewExplanation}>
              Explanation: {renderMathExpression(question.explanation)}
            </Typography>
          </div>
        );
      case 'short_answer':
        return (
          <div>
            <Typography variant="body1">
              {index + 1}. {renderMathExpression(question.question)}
            </Typography>
            <Typography variant="body2" className={classes.previewAnswer}>
              Sample Answer: {renderMathExpression(question.correctAnswer)}
            </Typography>
            <Typography variant="body2" className={classes.previewExplanation}>
              Explanation: {renderMathExpression(question.explanation)}
            </Typography>
          </div>
        );
      case 'long_answer':
        return (
          <div>
            <Typography variant="body1">
              {index + 1}. {renderMathExpression(question.question)}
            </Typography>
            <Typography variant="body2" className={classes.previewExplanation}>
              Grading Rubric: {renderMathExpression(question.explanation)}
            </Typography>
          </div>
        );
      case 'true_false':
        return (
          <div>
            <Typography variant="body1">
              {index + 1}. {renderMathExpression(question.question)}
            </Typography>
            <Typography variant="body2" className={classes.previewAnswer}>
              Correct Answer: {renderMathExpression(question.correctAnswer)}
            </Typography>
            <Typography variant="body2" className={classes.previewExplanation}>
              Explanation: {renderMathExpression(question.explanation)}
            </Typography>
          </div>
        );
      default:
        return (
          <div>
            <Typography variant="body1">
              {index + 1}. {renderMathExpression(question.question)}
            </Typography>
            <Typography variant="body2" className={classes.previewAnswer}>
              Answer: {renderMathExpression(question.correctAnswer)}
            </Typography>
          </div>
        );
    }
  };

  return (
    <Container>
      <Paper className={classes.paper}>
        <Typography variant="h5" gutterBottom>
          Create AI-Generated Quiz
        </Typography>
        <Typography variant="body2" color="textSecondary" paragraph>
          Leverage AI to automatically generate quizzes based on topics and preferences
        </Typography>

        <Grid container spacing={3}>
          {/* Quiz Details */}
          <Grid item xs={12}>
            <TextField
              label="Quiz Title"
              variant="outlined"
              fullWidth
              value={quizTitle}
              onChange={(e) => setQuizTitle(e.target.value)}
              required
            />
          </Grid>

          {/* Topics */}
          <Grid item xs={12}>
            <TextField
              label="Add Topics"
              variant="outlined"
              fullWidth
              value={topicInput}
              onChange={(e) => setTopicInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTopic();
                }
              }}
              helperText="Press Enter to add multiple topics"
            />
            {topics.length > 0 && (
              <div className={classes.topicChips}>
                {topics.map((topic) => (
                  <Chip
                    key={topic}
                    label={topic}
                    onDelete={() => handleDeleteTopic(topic)}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </div>
            )}
          </Grid>

          {/* Quiz Configuration */}
          <Grid item xs={12} sm={6}>
            <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel>Quiz Type</InputLabel>
              <Select
                value={quizType}
                onChange={(e) => setQuizType(e.target.value)}
                label="Quiz Type"
              >
                <MenuItem value="multiple_choice">Multiple Choice</MenuItem>
                <MenuItem value="fill_blank">Fill in the Blanks</MenuItem>
                <MenuItem value="true_false">True / False</MenuItem>
                <MenuItem value="short_answer">Short Answer</MenuItem>
                <MenuItem value="long_answer">Long Answer/Essay</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel>Difficulty Level</InputLabel>
              <Select
                value={difficultyLevel}
                onChange={(e) => setDifficultyLevel(e.target.value)}
                label="Difficulty Level"
              >
                <MenuItem value="easy">Easy</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="hard">Hard</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel>Number of Questions</InputLabel>
              <Select
                value={questionCount}
                onChange={(e) => setQuestionCount(e.target.value)}
                label="Number of Questions"
              >
                {[5, 10, 15, 20, 25, 30].map((num) => (
                  <MenuItem key={num} value={num}>
                    {num}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel>Time Limit (minutes)</InputLabel>
              <Select
                value={timeLimit}
                onChange={(e) => setTimeLimit(e.target.value)}
                label="Time Limit (minutes)"
              >
                {[15, 30, 45, 60, 90, 120].map((num) => (
                  <MenuItem key={num} value={num}>
                    {num}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>Time allowed for quiz completion</FormHelperText>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleGenerateQuiz}
              disabled={loading}
              className={classes.submitButton}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'GENERATE QUIZ WITH AI'
              )}
            </Button>
          </Grid>
        </Grid>

        {/* Display Generated Quiz */}
        {generatedQuiz && (
          <div className={classes.generatedQuizSection}>
            <Divider />
            <Box mt={2} mb={2}>
              <Typography variant="h6" gutterBottom>
                Preview: {generatedQuiz.title}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {generatedQuiz.questions.length} questions · {difficultyLevel} difficulty · {timeLimit} minutes
              </Typography>
            </Box>

            {generatedQuiz.questions.map((question, index) => (
              <Paper key={index} className={classes.questionPaper}>
                {renderQuestion(question, index)}
              </Paper>
            ))}

            <div className={classes.buttonGroup}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSaveQuiz}
                startIcon={<CheckIcon />}
              >
                Save Quiz
              </Button>
              <Button
                variant="outlined"
                onClick={() => setGeneratedQuiz(null)}
              >
                Discard
              </Button>
            </div>
          </div>
        )}

        {/* Notifications */}
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError('')}
        >
          <Alert onClose={() => setError('')} severity="error">
            {error}
          </Alert>
        </Snackbar>

        <Snackbar
          open={success}
          autoHideDuration={6000}
          onClose={() => setSuccess(false)}
        >
          <Alert onClose={() => setSuccess(false)} severity="success">
            {generatedQuiz ? 'Quiz generated successfully!' : 'Quiz saved successfully!'}
          </Alert>
        </Snackbar>
      </Paper>
    </Container>
  );
}

export default QuizCreation; 