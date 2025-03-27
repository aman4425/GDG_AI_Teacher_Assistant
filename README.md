# AI Teacher Assistant

An AI-powered educational platform built with React that automates grading, provides personalized feedback, and generates quizzes using Google's Gemini and Vertex AI.

## Features

### For Faculty
- **AI-Generated Quizzes**: Create quizzes instantly on any subject with customizable difficulty levels and question types
- **Automated Grading**: Grade assignments and assessments quickly with AI assistance
- **Personalized Feedback**: Generate tailored feedback for students based on their performance
- **Student Performance Analytics**: Track student progress with detailed analytics
- **Course Management**: Organize courses, assignments, and materials in one place

### For Students
- **Interactive Dashboard**: Access assignments, grades, and feedback in a user-friendly interface
- **AI-Powered Learning Resources**: Get personalized learning recommendations
- **Progress Tracking**: Monitor academic performance over time
- **Quiz Taking**: Take quizzes with immediate feedback

### For Parents
- **Student Performance Monitoring**: Track children's academic progress
- **Teacher Communication**: Communicate directly with teachers
- **Attendance Tracking**: View attendance records
- **Event Notifications**: Stay updated on important academic events

### For Administrators
- **User Management**: Add and manage user accounts
- **System Settings**: Configure platform settings
- **Data Management**: Handle data backup and restoration
- **Activity Monitoring**: Track platform usage and activities

## Technologies Used

- **React**: Frontend UI library
- **Material-UI**: Component library for responsive design
- **Firebase**: Authentication and database
- **Gemini API**: Google's generative AI for content creation and analysis
- **Vertex AI**: Google Cloud's AI platform for advanced analytics
- **React Router**: Navigation management
- **Chart.js**: Data visualization

## Installation

### Prerequisites
- Node.js (v14 or later)
- npm (v6 or later)
- Firebase account
- Google AI API keys (Gemini and/or Vertex AI)

### Setup Instructions

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/ai-teacher-assistant.git
   cd ai-teacher-assistant
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   REACT_APP_FIREBASE_PROJECT_ID=your_firebase_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   REACT_APP_FIREBASE_APP_ID=your_firebase_app_id
   
   REACT_APP_GEMINI_API_KEY=your_gemini_api_key
   
   REACT_APP_VERTEX_API_KEY=your_vertex_api_key
   REACT_APP_GCP_PROJECT_ID=your_gcp_project_id
   
   REACT_APP_RECAPTCHA_SITE_KEY=your_recaptcha_site_key
   ```

4. Update the Firebase configuration in `src/auth/firebase.js` with your credentials.

5. Start the development server:
   ```
   npm start
   ```

6. Open [http://localhost:3000](http://localhost:3000) to view the application.

## Usage

### User Types and Access

The application supports four user types, each with their own login flow:

1. **Faculty**: Email/password login with CAPTCHA
2. **Students**: Student ID/email and password login
3. **Parents**: Phone number authentication with OTP
4. **Administrators**: Email/password with security key and CAPTCHA

### Creating an AI-Generated Quiz (Faculty)

1. Log in as a faculty member
2. Navigate to "Create Quiz" in the dashboard
3. Enter quiz details (title, topics, question count, etc.)
4. Click "Generate Quiz with AI"
5. Review and optionally edit the generated quiz
6. Save the quiz to make it available to students

### Grading Assignments with AI (Faculty)

1. Log in as a faculty member
2. Navigate to "Grade Assignments" in the dashboard
3. Select an assignment to grade
4. Choose auto-grading or manual grading options
5. For auto-grading, review AI-suggested scores and feedback
6. Make adjustments if necessary and save the grades

### Viewing Academic Performance (Student/Parent)

1. Log in as a student or parent
2. View the dashboard for an overview of grades and performance
3. Navigate to specific sections for detailed information on assignments, quizzes, and feedback

## Project Structure

```
ai-teacher-assistant/
├── public/                  # Public assets
├── src/                     # Source files
│   ├── auth/                # Authentication components and context
│   │   ├── faculty/         # Faculty-specific components
│   │   ├── student/         # Student-specific components
│   │   ├── parent/          # Parent-specific components
│   │   └── admin/           # Admin-specific components
│   ├── pages/               # Page components
│   ├── services/            # API and service functions
│   ├── App.js               # Main app component
│   └── index.js             # Application entry point
└── package.json             # Project dependencies
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Google's Generative AI APIs for powering the AI features
- Firebase for authentication and database solutions
- Material-UI for the responsive design components 