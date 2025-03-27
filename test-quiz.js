// Simple test script for quiz generation
require('dotenv').config();
const { testQuizGeneration } = require('./src/services/aiService');

async function runTest() {
  try {
    console.log('Testing quiz generation functionality...');
    
    // Test multiple choice quiz
    const mcqQuiz = await testQuizGeneration({
      title: "Mathematics Quiz",
      subject: "Mathematics",
      topics: ["Algebra", "Equations"],
      numQuestions: 3,
      questionType: "multiple_choice",
      difficulty: "medium"
    });
    
    // Test fill in the blank quiz
    const fillBlankQuiz = await testQuizGeneration({
      title: "Science Quiz",
      subject: "Science",
      topics: ["Physics", "Motion"],
      numQuestions: 2,
      questionType: "fill_blank",
      difficulty: "easy"
    });
    
    // Test short answer quiz
    const shortAnswerQuiz = await testQuizGeneration({
      title: "History Quiz",
      subject: "History",
      topics: ["World War II"],
      numQuestions: 2,
      questionType: "short_answer",
      difficulty: "hard"
    });
    
    console.log('All tests completed successfully!');
  } catch (error) {
    console.error('Test failed:', error);
  }
}

runTest(); 