import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Always enable demo mode for local deployment without Firebase
console.log('Environment:', {
  NODE_ENV: process.env.NODE_ENV,
  REACT_APP_API_URL: process.env.REACT_APP_API_URL,
  REACT_APP_FORCE_DEMO_MODE: process.env.REACT_APP_FORCE_DEMO_MODE
});

// Enable demo mode
localStorage.setItem('demoMode', 'true');
localStorage.setItem('demoRole', 'admin');

// Add detailed error handling for debugging
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
  
  // Show detailed error information
  document.body.innerHTML = `
    <div style="padding: 20px; font-family: Arial, sans-serif;">
      <h2 style="color: red;">Application Error</h2>
      <p>Something went wrong while loading the application:</p>
      <pre style="background: #f1f1f1; padding: 10px; border-radius: 5px; white-space: pre-wrap;">
Error: ${event.error?.message || 'Unknown error'}
Stack: ${event.error?.stack || 'No stack trace available'}
Location: ${window.location.href}
API URL: ${process.env.REACT_APP_API_URL || 'Not set'}
Demo Mode: ${localStorage.getItem('demoMode') || 'Not set'}
Demo Role: ${localStorage.getItem('demoRole') || 'Not set'}
      </pre>
      <p>Please check the console for more details.</p>
      <button onclick="window.location.reload()" style="padding: 10px; margin-top: 10px;">
        Reload Application
      </button>
    </div>
  `;
});

// Check if demo mode is forced via environment variable
if (process.env.REACT_APP_FORCE_DEMO_MODE === 'true') {
  console.log('Demo mode forced via environment variable');
  localStorage.setItem('demoMode', 'true');
  localStorage.setItem('demoRole', 'admin');
}

// Add debugging for Firebase config
console.log('Firebase config environment variables present:', {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY ? 'Yes' : 'No',
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN ? 'Yes' : 'No',
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID ? 'Yes' : 'No'
});

// Log all available environment variables without sensitive values
console.log('Available environment variables:', 
  Object.keys(process.env)
    .filter(key => key.startsWith('REACT_APP_'))
    .reduce((obj, key) => {
      obj[key] = process.env[key] ? 'Set' : 'Not set';
      return obj;
    }, {})
);

// React 17 rendering (not using createRoot which is React 18 specific)
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(); 
