import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Mock Firebase implementation for local development

// Create mock versions for offline/demo mode
const createMockAuth = () => {
  return {
    currentUser: null,
    onAuthStateChanged: (callback) => {
      callback(null);
      return () => {};
    },
    signInWithEmailAndPassword: () => Promise.resolve({ user: null }),
    createUserWithEmailAndPassword: () => Promise.resolve({ user: null }),
    signOut: () => Promise.resolve(),
  };
};

const createMockFirestore = () => {
  return {
    collection: () => ({
      doc: () => ({
        get: () => Promise.resolve({ exists: false, data: () => ({}) }),
        set: () => Promise.resolve(),
      }),
    }),
  };
};

// Create mock implementations
const app = {};
const auth = createMockAuth();
const db = createMockFirestore();
const usingMockFirebase = true;

console.log('Using mock Firebase implementation (demo mode)');

// Try to enable demo mode in localStorage
try {
  localStorage.setItem('demoMode', 'true');
} catch (e) {
  console.error('Could not set demo mode in localStorage:', e);
}

// Export the mock auth and firestore instances
export { auth, db, usingMockFirebase };
export default app; 