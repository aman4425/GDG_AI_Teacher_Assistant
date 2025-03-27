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
  const [demoMode, setDemoMode] = useState(true); // Always use demo mode
  const [initFailed, setInitFailed] = useState(false);

  // Initialize demo mode
  useEffect(() => {
    try {
      console.log('Demo mode always activated for local deployment');
      setDemoMode(true);
      localStorage.setItem('demoMode', 'true');
      
      // Create demo user with default role
      const demoRole = localStorage.getItem('demoRole') || 'admin';
      createDemoUser(demoRole);
      
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
      uid: 'demo-user-id', 
      email: `${role}@demo.com`,
      displayName: `Demo ${role.charAt(0).toUpperCase() + role.slice(1)}`
    };
    setCurrentUser(mockUser);
    setUserRole(role);
    localStorage.setItem('demoRole', role);
  };

  // Simple mock implementations for auth operations
  const login = (email, password) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let role = 'student';
        let displayName = 'Demo Student';
        
        if (email.includes('faculty') || email.includes('teacher')) {
          role = 'faculty';
          displayName = 'Demo Teacher';
        } else if (email.includes('parent')) {
          role = 'parent';
          displayName = 'Demo Parent';
        } else if (email.includes('admin')) {
          role = 'admin';
          displayName = 'Demo Admin';
        }
        
        const mockUser = { uid: 'demo-user-id', email, displayName };
        setCurrentUser(mockUser);
        setUserRole(role);
        localStorage.setItem('demoRole', role);
        localStorage.setItem('demoMode', 'true');
        resolve({ user: mockUser });
      }, 500);
    });
  };

  const signup = (email, password, role, displayName) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockUser = { uid: 'demo-user-id', email, displayName };
        setCurrentUser(mockUser);
        setUserRole(role);
        localStorage.setItem('demoRole', role);
        resolve({ user: mockUser });
      }, 500);
    });
  };

  const logout = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setCurrentUser(null);
        setUserRole(null);
        localStorage.removeItem('demoRole');
        resolve();
      }, 500);
    });
  };

  const resetPassword = (email) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Demo password reset for ${email}`);
        resolve();
      }, 500);
    });
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
  const contextValue = {
    currentUser,
    userRole,
    demoMode,
    error,
    loading,
    signup,
    login,
    logout,
    resetPassword,
    setupRecaptcha,
    loginWithPhone,
    verifyOtp,
    setDemoMode,
    
    // Specific login for demo mode
    loginAsDemo: (role = 'admin') => {
      setDemoMode(true);
      localStorage.setItem('demoMode', 'true');
      createDemoUser(role);
      return Promise.resolve({ user: { uid: 'demo-user-id' } });
    },
    
    // Force demo mode function
    forceDemo: () => {
      setDemoMode(true);
      localStorage.setItem('demoMode', 'true');
      createDemoUser('admin');
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {!loading ? children : (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <p>Loading application...</p>
        </div>
      )}
    </AuthContext.Provider>
  );
} 