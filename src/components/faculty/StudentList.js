import React, { useState, useEffect } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Box,
  Chip,
  makeStyles,
  CircularProgress
} from '@material-ui/core';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@material-ui/icons';
import { useDatabase } from '../../hooks/useDatabase';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
    padding: theme.spacing(2),
  },
  table: {
    minWidth: 650,
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
  filterButton: {
    marginLeft: theme.spacing(1),
  },
  actionButtons: {
    '& > *': {
      marginRight: theme.spacing(1),
    },
  },
  statusChip: {
    fontWeight: 'bold',
  },
  activeChip: {
    backgroundColor: theme.palette.success.light,
    color: theme.palette.success.dark,
  },
  inactiveChip: {
    backgroundColor: theme.palette.error.light,
    color: theme.palette.error.dark,
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    padding: theme.spacing(3),
  },
}));

const StudentList = () => {
  const classes = useStyles();
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredStudents, setFilteredStudents] = useState([]);
  const { getAllStudents, loading, error } = useDatabase();

  // Fetch students from database
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const result = await getAllStudents();
        if (result.success) {
          // Transform the database format to match the expected format
          const formattedStudents = result.data.map(student => ({
            id: student.rollNumber || student.id,
            name: `${student.firstName} ${student.lastName}`,
            email: student.email,
            grade: student.classId ? `${student.classId}${student.section ? student.section : ''}` : '10th',
            enrolledCourses: student.enrolledCourses || ['Mathematics', 'Science'],
            status: 'Active',
            performance: 'Good'
          }));
          setStudents(formattedStudents);
          setFilteredStudents(formattedStudents);
        } else {
          console.error("Failed to fetch students:", result.error);
        }
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchStudents();
  }, [getAllStudents]);

  // Handle search
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredStudents(students);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = students.filter(
        student => 
          student.name.toLowerCase().includes(query) ||
          student.email.toLowerCase().includes(query) ||
          student.id.toLowerCase().includes(query) ||
          (student.grade && student.grade.toLowerCase().includes(query))
      );
      setFilteredStudents(filtered);
    }
  }, [searchQuery, students]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleEditStudent = (studentId) => {
    // In a real app, this would navigate to edit page or open a modal
    console.log('Edit student with ID:', studentId);
  };

  const handleDeleteStudent = (studentId) => {
    // In a real app, this would show a confirmation dialog
    console.log('Delete student with ID:', studentId);
    
    // For demo, just filter out the student
    const updatedStudents = students.filter(student => student.id !== studentId);
    setStudents(updatedStudents);
  };

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Typography variant="h6" gutterBottom>
          Student Management
        </Typography>
        
        <Box display="flex" alignItems="center" mb={2}>
          <TextField
            className={classes.searchField}
            variant="outlined"
            size="small"
            placeholder="Search students..."
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            style={{ flexGrow: 1 }}
          />
          <Button
            variant="outlined"
            color="primary"
            startIcon={<FilterIcon />}
            className={classes.filterButton}
          >
            Filter
          </Button>
        </Box>
        
        {loading ? (
          <div className={classes.loadingContainer}>
            <CircularProgress />
          </div>
        ) : filteredStudents.length === 0 ? (
          <Typography align="center" variant="body1" style={{ padding: '20px' }}>
            No students found. {error ? `Error: ${error}` : ''}
          </Typography>
        ) : (
          <TableContainer>
            <Table className={classes.table}>
              <TableHead className={classes.tableHeader}>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Grade</TableCell>
                  <TableCell>Courses</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Performance</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>{student.id}</TableCell>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>{student.grade}</TableCell>
                    <TableCell>
                      {student.enrolledCourses?.map((course) => (
                        <Chip key={course} label={course} size="small" style={{ margin: '2px' }} />
                      ))}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={student.status}
                        size="small"
                        className={`${classes.statusChip} ${
                          student.status === 'Active' ? classes.activeChip : classes.inactiveChip
                        }`}
                      />
                    </TableCell>
                    <TableCell>{student.performance}</TableCell>
                    <TableCell className={classes.actionButtons}>
                      <IconButton size="small" color="primary" onClick={() => handleEditStudent(student.id)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton size="small" color="secondary" onClick={() => handleDeleteStudent(student.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </div>
  );
};

export default StudentList; 