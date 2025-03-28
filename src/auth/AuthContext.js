import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db, usingMockFirebase } from './firebase';

// Create the Auth Context
const AuthContext = createContext();

// Custom hook to use the Auth Context
export function useAuth() {
  return useContext(AuthContext);
}

// Auth Provider Component
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [error, setError] = useState(null);
  const [demoMode, setDemoMode] = useState(true);
  const [initFailed, setInitFailed] = useState(false);

  // Initialize demo mode
  useEffect(() => {
    try {
      console.log('Initializing demo mode');
      setDemoMode(true);
      localStorage.setItem('demoMode', 'true');
      
      // Get demo role from localStorage or use default
      const savedRole = localStorage.getItem('demoRole');
      const defaultRole = 'admin';
      const role = savedRole || defaultRole;
      
      // Create demo user with role
      createDemoUser(role);
      setLoading(false);
    } catch (e) {
      console.error("Error setting up demo mode:", e);
      setLoading(false);
      setInitFailed(true);
    }
  }, []);

  // Helper function to create a demo user
  const createDemoUser = (role) => {
    console.log('Creating demo user with role:', role);
    const mockUser = { 
      uid: `demo-${role}-${Date.now()}`,
      email: `${role}@demo.com`,
      displayName: `Demo ${role.charAt(0).toUpperCase() + role.slice(1)}`
    };
    setCurrentUser(mockUser);
    setUserRole(role);
    localStorage.setItem('demoRole', role);
  };

  // Mock auth operations for demo mode
  const login = async (email, password) => {
    let role = 'student';
    if (email.includes('faculty')) role = 'faculty';
    else if (email.includes('admin')) role = 'admin';
    else if (email.includes('parent')) role = 'parent';
    
    createDemoUser(role);
    return { user: currentUser };
  };

  const signup = async (email, password, role, displayName) => {
    createDemoUser(role);
    return { user: currentUser };
  };

  const logout = async () => {
    setCurrentUser(null);
    setUserRole(null);
    localStorage.removeItem('demoRole');
    return Promise.resolve();
  };

  const resetPassword = async (email) => {
    console.log('Demo password reset for:', email);
    return Promise.resolve();
  };

  const setupRecaptcha = () => {
    return { verify: () => Promise.resolve("demo-verification-id") };
  };

  const loginWithPhone = (phoneNumber) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          confirm: (code) => {
            return new Promise((confirmResolve) => {
              setTimeout(() => {
                const mockUser = { 
                  uid: 'demo-phone-user-id', 
                  phoneNumber,
                  displayName: 'Demo Phone User'
                };
                setCurrentUser(mockUser);
                setUserRole('parent');
                localStorage.setItem('demoRole', 'parent');
                localStorage.setItem('demoMode', 'true');
                confirmResolve({ user: mockUser });
              }, 500);
            });
          }
        });
      }, 500);
    });
  };

  const verifyOtp = (confirmationResult, code) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockUser = { 
          uid: 'demo-phone-user-id', 
          phoneNumber: '+1234567890',
          displayName: 'Demo Parent User'
        };
        setCurrentUser(mockUser);
        setUserRole('parent');
        localStorage.setItem('demoRole', 'parent');
        localStorage.setItem('demoMode', 'true');
        resolve({ user: mockUser });
      }, 500);
    });
  };

  // Context value
  const value = {
    currentUser,
    userRole,
    demoMode: true, // Always true for demo mode
    error,
    loading,
    signup,
    login,
    logout,
    resetPassword,
    setupRecaptcha,
    loginWithPhone,
    verifyOtp,
    setDemoMode: () => {}, // No-op since we're always in demo mode
    loginAsDemo: (role = 'admin') => {
      createDemoUser(role);
      return Promise.resolve({ user: currentUser });
    }
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontFamily: 'Arial, sans-serif'
      }}>
        <p>Loading application...</p>
      </div>
    );
  }

  if (initFailed) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontFamily: 'Arial, sans-serif',
        padding: '20px',
        textAlign: 'center'
      }}>
        <h2 style={{ color: 'red' }}>Initialization Error</h2>
        <p>Failed to initialize the application. Please try refreshing the page.</p>
        <button 
          onClick={() => window.location.reload()}
          style={{
            padding: '10px 20px',
            marginTop: '20px',
            cursor: 'pointer'
          }}
        >
          Refresh Page
        </button>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
} 
