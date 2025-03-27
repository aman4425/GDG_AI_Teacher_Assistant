import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Always enable demo mode for local deployment without Firebase
console.log('Enabling demo mode for local deployment');
localStorage.setItem('demoMode', 'true');
localStorage.setItem('demoRole', 'admin'); // Default role is admin

// Add error handling for debugging
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
  // Show error details on page instead of white screen
  document.body.innerHTML = `
    <div style="padding: 20px; font-family: Arial, sans-serif;">
      <h2 style="color: red;">Application Error</h2>
      <p>Something went wrong while loading the application:</p>
      <pre style="background: #f1f1f1; padding: 10px; border-radius: 5px;">${event.error?.stack || event.message}</pre>
      <p>Please check the console for more details.</p>
      <button onclick="window.location.reload()">Reload Application</button>
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