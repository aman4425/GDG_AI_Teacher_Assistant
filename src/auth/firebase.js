// Mock Firebase implementation for demo mode
console.log('Using mock Firebase implementation (demo mode)');

// Create mock auth implementation
const auth = {
  currentUser: null,
  onAuthStateChanged: (callback) => {
    callback(null);
    return () => {};
  },
  signInWithEmailAndPassword: () => Promise.resolve({ user: null }),
  createUserWithEmailAndPassword: () => Promise.resolve({ user: null }),
  signOut: () => Promise.resolve(),
};

// Create mock firestore implementation
const db = {
  collection: () => ({
    doc: () => ({
      get: () => Promise.resolve({ exists: false, data: () => ({}) }),
      set: () => Promise.resolve(),
    }),
  }),
};

// Set demo mode
localStorage.setItem('demoMode', 'true');
localStorage.setItem('demoRole', localStorage.getItem('demoRole') || 'admin');

// Export mock implementations
export const usingMockFirebase = true;
export { auth, db };
export default { auth, db }; 
