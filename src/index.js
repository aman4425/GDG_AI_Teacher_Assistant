import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Log environment configuration
console.log('Environment Configuration:', {
  NODE_ENV: process.env.NODE_ENV,
  REACT_APP_API_URL: process.env.REACT_APP_API_URL,
  REACT_APP_FORCE_DEMO_MODE: process.env.REACT_APP_FORCE_DEMO_MODE,
  PUBLIC_URL: process.env.PUBLIC_URL
});

// Initialize demo mode
localStorage.setItem('demoMode', 'true');
if (!localStorage.getItem('demoRole')) {
  localStorage.setItem('demoRole', 'admin');
}

// Add error handling for debugging
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
  
  // Show error details on page
  document.body.innerHTML = `
    <div style="padding: 20px; font-family: Arial, sans-serif;">
      <h2 style="color: red;">Application Error</h2>
      <p>Something went wrong while loading the application:</p>
      <pre style="background: #f1f1f1; padding: 10px; border-radius: 5px; white-space: pre-wrap; max-width: 100%; overflow-x: auto;">
Error: ${event.error?.message || 'Unknown error'}
Stack: ${event.error?.stack || 'No stack trace available'}
Location: ${window.location.href}
API URL: ${process.env.REACT_APP_API_URL || 'Not set'}
Demo Mode: ${localStorage.getItem('demoMode') || 'Not set'}
Demo Role: ${localStorage.getItem('demoRole') || 'Not set'}
      </pre>
      <p>Please check the console for more details.</p>
      <div style="margin-top: 20px;">
        <button onclick="window.location.reload()" style="padding: 10px 20px; cursor: pointer; margin-right: 10px;">
          Reload Application
        </button>
        <button onclick="localStorage.clear(); window.location.reload()" style="padding: 10px 20px; cursor: pointer;">
          Clear Data & Reload
        </button>
      </div>
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

// React 17 rendering
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// Performance monitoring
reportWebVitals(console.log); 
