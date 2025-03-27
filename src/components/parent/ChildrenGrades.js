import React, { useState, useEffect } from 'react';
import {
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Box,
  Card,
  CardContent,
  Grid,
  Divider,
  makeStyles
} from '@material-ui/core';
import { Assessment as GradeIcon } from '@material-ui/icons';
import { useAuth } from '../../auth/AuthContext';
import { useDatabase } from '../../hooks/useDatabase';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3)
  },
  title: {
    marginBottom: theme.spacing(3)
  },
  tableContainer: {
    marginBottom: theme.spacing(4)
  },
  gradeChip: {
    fontWeight: 'bold'
  },
  excellentGrade: {
    backgroundColor: '#4caf50',
    color: 'white'
  },
  goodGrade: {
    backgroundColor: '#8bc34a',
    color: 'white'
  },
  averageGrade: {
    backgroundColor: '#ffeb3b'
  },
  belowAverageGrade: {
    backgroundColor: '#ff9800',
    color: 'white'
  },
  failingGrade: {
    backgroundColor: '#f44336',
    color: 'white'
  },
  childCard: {
    marginBottom: theme.spacing(3)
  },
  childTitle: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(2)
  },
  childIcon: {
    marginRight: theme.spacing(1),
    color: theme.palette.primary.main
  }
}));

function ChildrenGrades() {
  const classes = useStyles();
  const { currentUser, demoMode } = useAuth();
  const { getCollection } = useDatabase();
  const [gradesData, setGradesData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        // If in demo mode, use mock data
        if (demoMode) {
          const mockData = getMockGradesData();
          setGradesData(mockData);
        } else {
          // In a real application, you would fetch from Firestore
          const data = await getCollection('grades', {
            where: ['parentId', '==', currentUser.uid]
          });
          setGradesData(data);
        }
      } catch (error) {
        console.error('Error fetching grades:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGrades();
  }, [currentUser, demoMode, getCollection]);

  // Helper function to get grade color class
  const getGradeColorClass = (grade) => {
    if (grade >= 90) return classes.excellentGrade;
    if (grade >= 80) return classes.goodGrade;
    if (grade >= 70) return classes.averageGrade;
    if (grade >= 60) return classes.belowAverageGrade;
    return classes.failingGrade;
  };

  // Mock data generator for demo mode
  const getMockGradesData = () => {
    return [
      {
        childId: 'child1',
        childName: 'Emma Johnson',
        grade: '6th Grade',
        subjects: [
          { 
            name: 'Mathematics', 
            grades: [
              { assessment: 'Quiz 1', score: 92, date: '2023-03-10' },
              { assessment: 'Midterm Exam', score: 88, date: '2023-04-02' },
              { assessment: 'Project', score: 95, date: '2023-04-15' },
              { assessment: 'Final Exam', score: 90, date: '2023-05-10' }
            ]
          },
          { 
            name: 'Science', 
            grades: [
              { assessment: 'Lab Report 1', score: 85, date: '2023-03-12' },
              { assessment: 'Midterm Exam', score: 78, date: '2023-04-05' },
              { assessment: 'Project', score: 92, date: '2023-04-20' },
              { assessment: 'Final Exam', score: 86, date: '2023-05-12' }
            ]
          },
          { 
            name: 'English', 
            grades: [
              { assessment: 'Essay 1', score: 88, date: '2023-03-15' },
              { assessment: 'Book Report', score: 94, date: '2023-04-08' },
              { assessment: 'Midterm Exam', score: 85, date: '2023-04-18' },
              { assessment: 'Final Project', score: 91, date: '2023-05-15' }
            ]
          }
        ]
      },
      {
        childId: 'child2',
        childName: 'Ethan Johnson',
        grade: '4th Grade',
        subjects: [
          { 
            name: 'Mathematics', 
            grades: [
              { assessment: 'Quiz 1', score: 78, date: '2023-03-10' },
              { assessment: 'Midterm Exam', score: 75, date: '2023-04-02' },
              { assessment: 'Project', score: 85, date: '2023-04-15' },
              { assessment: 'Final Exam', score: 82, date: '2023-05-10' }
            ]
          },
          { 
            name: 'Science', 
            grades: [
              { assessment: 'Lab Activity 1', score: 90, date: '2023-03-12' },
              { assessment: 'Midterm Exam', score: 83, date: '2023-04-05' },
              { assessment: 'Project', score: 88, date: '2023-04-20' },
              { assessment: 'Final Exam', score: 85, date: '2023-05-12' }
            ]
          },
          { 
            name: 'Reading', 
            grades: [
              { assessment: 'Book Report 1', score: 92, date: '2023-03-15' },
              { assessment: 'Comprehension Test', score: 88, date: '2023-04-08' },
              { assessment: 'Midterm Exam', score: 85, date: '2023-04-18' },
              { assessment: 'Final Project', score: 90, date: '2023-05-15' }
            ]
          }
        ]
      }
    ];
  };

  // Calculate average grade for a subject
  const calculateAverage = (grades) => {
    if (!grades || grades.length === 0) return 0;
    const sum = grades.reduce((total, grade) => total + grade.score, 0);
    return Math.round(sum / grades.length);
  };

  if (loading) {
    return <Typography>Loading grades data...</Typography>;
  }

  return (
    <div className={classes.root}>
      <Typography variant="h4" className={classes.title}>
        Children's Academic Performance
      </Typography>

      {gradesData.length === 0 ? (
        <Paper className={classes.paper} elevation={2}>
          <Typography variant="h6" align="center">
            No grades data available yet.
          </Typography>
        </Paper>
      ) : (
        gradesData.map((child) => (
          <Card key={child.childId} className={classes.childCard}>
            <CardContent>
              <div className={classes.childTitle}>
                <GradeIcon className={classes.childIcon} />
                <Typography variant="h5">
                  {child.childName} - {child.grade}
                </Typography>
              </div>

              <Divider style={{ marginBottom: '20px' }} />

              <Grid container spacing={3}>
                {child.subjects.map((subject) => (
                  <Grid item xs={12} md={4} key={subject.name}>
                    <Typography variant="h6" gutterBottom>
                      {subject.name}
                      <Chip
                        label={`${calculateAverage(subject.grades)}%`}
                        className={`${classes.gradeChip} ${getGradeColorClass(
                          calculateAverage(subject.grades)
                        )}`}
                        style={{ marginLeft: '10px' }}
                      />
                    </Typography>
                    
                    <TableContainer component={Paper} className={classes.tableContainer}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Assessment</TableCell>
                            <TableCell align="right">Score</TableCell>
                            <TableCell align="right">Date</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {subject.grades.map((grade, index) => (
                            <TableRow key={index}>
                              <TableCell component="th" scope="row">
                                {grade.assessment}
                              </TableCell>
                              <TableCell align="right">
                                <Chip
                                  size="small"
                                  label={`${grade.score}%`}
                                  className={`${classes.gradeChip} ${getGradeColorClass(
                                    grade.score
                                  )}`}
                                />
                              </TableCell>
                              <TableCell align="right">
                                {new Date(grade.date).toLocaleDateString()}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}

export default ChildrenGrades; 