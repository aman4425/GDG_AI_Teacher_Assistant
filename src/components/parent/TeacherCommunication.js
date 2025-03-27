import React, { useState, useEffect } from 'react';
import {
  Typography,
  Paper,
  Card,
  CardContent,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  makeStyles
} from '@material-ui/core';
import {
  Send as SendIcon,
  Message as MessageIcon,
  School as TeacherIcon
} from '@material-ui/icons';
import { useAuth } from '../../auth/AuthContext';
import { useDatabase } from '../../hooks/useDatabase';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3)
  },
  title: {
    marginBottom: theme.spacing(3)
  },
  card: {
    marginBottom: theme.spacing(3)
  },
  messageInputContainer: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: theme.spacing(4),
    padding: theme.spacing(3),
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[1]
  },
  inputRow: {
    display: 'flex',
    alignItems: 'flex-start',
    marginBottom: theme.spacing(2)
  },
  formControl: {
    marginRight: theme.spacing(2),
    minWidth: 200
  },
  messageInput: {
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(2)
  },
  sendButton: {
    marginLeft: 'auto'
  },
  messageList: {
    marginTop: theme.spacing(2)
  },
  messageItem: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  sentMessage: {
    backgroundColor: theme.palette.primary.light,
    marginLeft: theme.spacing(4),
    marginRight: 0
  },
  receivedMessage: {
    backgroundColor: theme.palette.background.paper,
    marginRight: theme.spacing(4),
    marginLeft: 0
  },
  messageHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(1)
  },
  messageTime: {
    color: theme.palette.text.secondary,
    fontSize: '0.8rem'
  },
  teacherAvatar: {
    backgroundColor: theme.palette.secondary.main
  },
  parentAvatar: {
    backgroundColor: theme.palette.primary.main
  },
  noMessages: {
    padding: theme.spacing(4),
    textAlign: 'center'
  }
}));

function TeacherCommunication() {
  const classes = useStyles();
  const { currentUser, demoMode } = useAuth();
  const { getCollection, addDocument } = useDatabase();
  const [loading, setLoading] = useState(true);
  const [teachers, setTeachers] = useState([]);
  const [children, setChildren] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [selectedChild, setSelectedChild] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // In demo mode, use mock data
        if (demoMode) {
          setTeachers(getMockTeachers());
          setChildren(getMockChildren());
          setMessages(getMockMessages());
        } else {
          // In real application, fetch from Firestore
          const teachersData = await getCollection('teachers');
          const childrenData = await getCollection('students', {
            where: ['parentId', '==', currentUser.uid]
          });
          const messagesData = await getCollection('messages', {
            where: ['participants', 'array-contains', currentUser.uid],
            orderBy: ['timestamp', 'desc']
          });

          setTeachers(teachersData);
          setChildren(childrenData);
          setMessages(messagesData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser, demoMode, getCollection]);

  const handleTeacherChange = (e) => {
    setSelectedTeacher(e.target.value);
  };

  const handleChildChange = (e) => {
    setSelectedChild(e.target.value);
  };

  const handleMessageChange = (e) => {
    setNewMessage(e.target.value);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedTeacher || !selectedChild) return;

    try {
      const childInfo = children.find(child => child.id === selectedChild);
      const teacherInfo = teachers.find(teacher => teacher.id === selectedTeacher);
      
      // Create new message object
      const messageData = {
        id: `msg_${Date.now()}`,
        message: newMessage,
        senderId: currentUser.uid,
        senderName: 'Parent Name', // In real app, use currentUser.displayName
        senderRole: 'parent',
        receiverId: selectedTeacher,
        receiverName: teacherInfo.name,
        receiverRole: 'teacher',
        childId: selectedChild,
        childName: childInfo.name,
        timestamp: new Date().toISOString(),
        isRead: false,
        participants: [currentUser.uid, selectedTeacher]
      };

      // In demo mode, just add to local state
      if (demoMode) {
        setMessages([messageData, ...messages]);
      } else {
        // In real app, save to Firestore
        await addDocument('messages', messageData);
        // Then refresh messages
        const updatedMessages = await getCollection('messages', {
          where: ['participants', 'array-contains', currentUser.uid],
          orderBy: ['timestamp', 'desc']
        });
        setMessages(updatedMessages);
      }

      // Clear input field
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Mock data generators
  const getMockTeachers = () => {
    return [
      { id: 'teacher1', name: 'Mrs. Smith', subject: 'Mathematics', grade: '6th Grade' },
      { id: 'teacher2', name: 'Mr. Johnson', subject: 'Science', grade: '6th Grade' },
      { id: 'teacher3', name: 'Ms. Wilson', subject: 'English', grade: '6th Grade' },
      { id: 'teacher4', name: 'Mr. Davis', subject: 'Mathematics', grade: '4th Grade' },
      { id: 'teacher5', name: 'Mrs. Thompson', subject: 'Science', grade: '4th Grade' }
    ];
  };

  const getMockChildren = () => {
    return [
      { id: 'child1', name: 'Emma Johnson', grade: '6th Grade' },
      { id: 'child2', name: 'Ethan Johnson', grade: '4th Grade' }
    ];
  };

  const getMockMessages = () => {
    return [
      {
        id: 'msg1',
        message: 'Hello Mrs. Smith, I wanted to discuss Emma\'s recent math test. She found some of the questions challenging. Could we schedule a time to talk about additional support?',
        senderId: 'parent1',
        senderName: 'Parent Name',
        senderRole: 'parent',
        receiverId: 'teacher1',
        receiverName: 'Mrs. Smith',
        receiverRole: 'teacher',
        childId: 'child1',
        childName: 'Emma Johnson',
        timestamp: '2023-05-15T14:30:00Z',
        isRead: true,
        participants: ['parent1', 'teacher1']
      },
      {
        id: 'msg2',
        message: 'Of course! I noticed Emma struggled with the fractions section. I would be happy to meet and discuss strategies to help her improve. How about Thursday after school at 3:30 PM?',
        senderId: 'teacher1',
        senderName: 'Mrs. Smith',
        senderRole: 'teacher',
        receiverId: 'parent1',
        receiverName: 'Parent Name',
        receiverRole: 'parent',
        childId: 'child1',
        childName: 'Emma Johnson',
        timestamp: '2023-05-15T16:45:00Z',
        isRead: true,
        participants: ['parent1', 'teacher1']
      },
      {
        id: 'msg3',
        message: 'Thursday at 3:30 PM works perfectly. Thank you for your attention to Emma\'s progress. I appreciate your support!',
        senderId: 'parent1',
        senderName: 'Parent Name',
        senderRole: 'parent',
        receiverId: 'teacher1',
        receiverName: 'Mrs. Smith',
        receiverRole: 'teacher',
        childId: 'child1',
        childName: 'Emma Johnson',
        timestamp: '2023-05-15T17:30:00Z',
        isRead: true,
        participants: ['parent1', 'teacher1']
      },
      {
        id: 'msg4',
        message: 'Mr. Davis, I wanted to let you know that Ethan has been practicing his math facts every evening. He seems to be gaining confidence with multiplication.',
        senderId: 'parent1',
        senderName: 'Parent Name',
        senderRole: 'parent',
        receiverId: 'teacher4',
        receiverName: 'Mr. Davis',
        receiverRole: 'teacher',
        childId: 'child2',
        childName: 'Ethan Johnson',
        timestamp: '2023-05-14T19:15:00Z',
        isRead: true,
        participants: ['parent1', 'teacher4']
      },
      {
        id: 'msg5',
        message: 'That\'s wonderful news! I\'ve noticed Ethan\'s improvement in class as well. Keep up the good work at home - it really makes a difference.',
        senderId: 'teacher4',
        senderName: 'Mr. Davis',
        senderRole: 'teacher',
        receiverId: 'parent1',
        receiverName: 'Parent Name',
        receiverRole: 'parent',
        childId: 'child2',
        childName: 'Ethan Johnson',
        timestamp: '2023-05-14T20:05:00Z',
        isRead: false,
        participants: ['parent1', 'teacher4']
      }
    ];
  };

  // Format timestamp to display
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  if (loading) {
    return <Typography>Loading communication data...</Typography>;
  }

  return (
    <div className={classes.root}>
      <Typography variant="h4" className={classes.title}>
        Teacher Communication
      </Typography>

      <Paper className={classes.messageInputContainer}>
        <Typography variant="h6" gutterBottom>
          New Message
        </Typography>
        
        <div className={classes.inputRow}>
          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel>Select Child</InputLabel>
            <Select
              value={selectedChild}
              onChange={handleChildChange}
              label="Select Child"
            >
              <MenuItem value="">
                <em>Select a child</em>
              </MenuItem>
              {children.map((child) => (
                <MenuItem key={child.id} value={child.id}>
                  {child.name} - {child.grade}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel>Select Teacher</InputLabel>
            <Select
              value={selectedTeacher}
              onChange={handleTeacherChange}
              label="Select Teacher"
              disabled={!selectedChild}
            >
              <MenuItem value="">
                <em>Select a teacher</em>
              </MenuItem>
              {teachers
                .filter(teacher => {
                  // Filter teachers based on selected child's grade
                  if (!selectedChild) return true;
                  const childInfo = children.find(c => c.id === selectedChild);
                  return childInfo && teacher.grade === childInfo.grade;
                })
                .map((teacher) => (
                  <MenuItem key={teacher.id} value={teacher.id}>
                    {teacher.name} - {teacher.subject}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </div>
        
        <TextField
          className={classes.messageInput}
          label="Message"
          variant="outlined"
          fullWidth
          multiline
          rows={3}
          value={newMessage}
          onChange={handleMessageChange}
          placeholder="Type your message here..."
        />
        
        <Button
          variant="contained"
          color="primary"
          startIcon={<SendIcon />}
          className={classes.sendButton}
          onClick={handleSendMessage}
          disabled={!newMessage.trim() || !selectedTeacher || !selectedChild}
        >
          Send Message
        </Button>
      </Paper>
      
      <Typography variant="h6" gutterBottom>
        Message History
      </Typography>
      
      {messages.length === 0 ? (
        <Paper className={classes.noMessages}>
          <Typography variant="body1">
            No message history yet. Start a conversation with a teacher above.
          </Typography>
        </Paper>
      ) : (
        <List className={classes.messageList}>
          {messages.map((message) => {
            const isFromParent = message.senderRole === 'parent';
            
            return (
              <ListItem 
                key={message.id} 
                className={`${classes.messageItem} ${
                  isFromParent ? classes.sentMessage : classes.receivedMessage
                }`}
              >
                <Grid container>
                  <Grid item xs={12}>
                    <div className={classes.messageHeader}>
                      <Box display="flex" alignItems="center">
                        <ListItemAvatar>
                          <Avatar 
                            className={isFromParent ? classes.parentAvatar : classes.teacherAvatar}
                          >
                            {isFromParent ? 'P' : 'T'}
                          </Avatar>
                        </ListItemAvatar>
                        <div>
                          <Typography variant="subtitle1">
                            {isFromParent ? 'You' : message.senderName}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            Re: {message.childName}
                          </Typography>
                        </div>
                      </Box>
                      <Typography variant="caption" className={classes.messageTime}>
                        {formatTime(message.timestamp)}
                      </Typography>
                    </div>
                  </Grid>
                  <Grid item xs={12}>
                    <ListItemText
                      primary={
                        <Typography
                          variant="body1"
                          style={{ whiteSpace: 'pre-wrap', paddingLeft: '56px' }}
                        >
                          {message.message}
                        </Typography>
                      }
                    />
                  </Grid>
                </Grid>
              </ListItem>
            );
          })}
        </List>
      )}
    </div>
  );
}

export default TeacherCommunication; 