import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword as fbSignIn, 
  createUserWithEmailAndPassword as fbCreateUser, 
  signOut as fbSignOut 
} from 'firebase/auth';
import { 
  getFirestore, 
  doc as fbDoc, 
  getDoc as fbGetDoc, 
  setDoc as fbSetDoc, 
  updateDoc as fbUpdateDoc, 
  onSnapshot as fbOnSnapshot, 
  collection as fbCollection, 
  query as fbQuery, 
  orderBy as fbOrderBy, 
  limit as fbLimit 
} from 'firebase/firestore';

// Safe environment configuration reading
const firebaseConfig = {
  apiKey: import.meta.env?.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env?.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env?.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env?.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env?.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env?.VITE_FIREBASE_APP_ID
};

const isFirebaseConfigured = !!(
  firebaseConfig.apiKey && 
  firebaseConfig.apiKey !== 'YOUR_API_KEY' && 
  firebaseConfig.apiKey !== '' &&
  firebaseConfig.apiKey !== 'undefined'
);

// Safe storage fallback utility
const safeStorage = {
  getItem: (key) => {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      if (!window.memoryStorage) window.memoryStorage = {};
      return window.memoryStorage[key] || null;
    }
  },
  setItem: (key, value) => {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      if (!window.memoryStorage) window.memoryStorage = {};
      window.memoryStorage[key] = value;
    }
  },
  removeItem: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      if (window.memoryStorage) delete window.memoryStorage[key];
    }
  }
};

// Variables for exports
let auth;
let db;

// Mock listeners tracking
const listeners = new Map();

// Helper to access LocalStorage Firestore
const getMockFirestore = () => {
  try {
    return JSON.parse(safeStorage.getItem('mock_firestore') || '{}');
  } catch (e) {
    return {};
  }
};

const setMockFirestore = (data) => {
  safeStorage.setItem('mock_firestore', JSON.stringify(data));
};

const notifyListeners = (path) => {
  const dbData = getMockFirestore();
  for (const [key, callback] of listeners.entries()) {
    // Exact match for doc
    if (key === path) {
      const docData = dbData[path];
      callback({
        exists: () => !!docData,
        data: () => docData,
        id: path.split('/').pop()
      });
    } 
    // Match for collection
    else if (key.startsWith('collection:') && path.startsWith(key.split(':')[1] + '/')) {
      const collectionPath = key.split(':')[1].split('|')[0];
      const allDocs = [];
      for (const p in dbData) {
        if (p.startsWith(collectionPath + '/')) {
          const docId = p.substring(collectionPath.length + 1);
          allDocs.push({ id: docId, ...dbData[p] });
        }
      }
      
      // Parse constraints
      let docs = allDocs;
      const parts = key.split('|');
      
      const orderByPart = parts.find(p => p.startsWith('orderBy:'));
      if (orderByPart) {
        const [_, field, dir] = orderByPart.split(':');
        docs.sort((a, b) => {
          const valA = a[field] ?? 0;
          const valB = b[field] ?? 0;
          return dir === 'desc' ? valB - valA : valA - valB;
        });
      }
      
      const limitPart = parts.find(p => p.startsWith('limit:'));
      if (limitPart) {
        const limitVal = parseInt(limitPart.split(':')[1], 10);
        docs = docs.slice(0, limitVal);
      }
      
      callback({
        docs: docs.map(doc => ({
          id: doc.id,
          data: () => doc,
          exists: () => true
        }))
      });
    }
  }
};

// Seed default users in mock Firestore if empty
const seedMockDatabase = () => {
  const dbData = getMockFirestore();
  const hasUsers = Object.keys(dbData).some(key => key.startsWith('users/'));
  if (!hasUsers) {
    const defaultUsers = {
      'users/leader_1': {
        uid: 'leader_1',
        name: 'Aarav Patel',
        email: 'aarav@ecolife.org',
        sustainabilityScore: 94,
        challengePoints: 160,
        offsetTotal: 35,
        friends: ['priya@greenearth.in', 'aditya@sustainable.net', 'neha@climateaction.org'],
        emissionData: { daily: 3.2, weekly: 22.4, monthly: 96, transport: 1.2, diet: 1.2, electricity: 0.8 },
        emissionLogs: [
          { date: '2026-06-11', daily: 4.5, transport: 1.5, diet: 1.2, electricity: 1.8 },
          { date: '2026-06-12', daily: 4.2, transport: 1.2, diet: 1.2, electricity: 1.8 },
          { date: '2026-06-13', daily: 3.8, transport: 0.8, diet: 1.2, electricity: 1.8 },
          { date: '2026-06-14', daily: 3.5, transport: 0.5, diet: 1.2, electricity: 1.8 },
          { date: '2026-06-15', daily: 3.2, transport: 1.2, diet: 1.2, electricity: 0.8 },
          { date: '2026-06-16', daily: 3.2, transport: 1.2, diet: 1.2, electricity: 0.8 },
          { date: '2026-06-17', daily: 3.2, transport: 1.2, diet: 1.2, electricity: 0.8 }
        ]
      },
      'users/leader_2': {
        uid: 'leader_2',
        name: 'Priya Sharma',
        email: 'priya@greenearth.in',
        sustainabilityScore: 82,
        challengePoints: 110,
        offsetTotal: 20,
        friends: ['aarav@ecolife.org', 'aditya@sustainable.net'],
        emissionData: { daily: 9.0, weekly: 63, monthly: 270, transport: 2.8, diet: 2.1, electricity: 4.1 },
        emissionLogs: [
          { date: '2026-06-11', daily: 10.5, transport: 3.2, diet: 2.1, electricity: 5.2 },
          { date: '2026-06-12', daily: 10.1, transport: 2.8, diet: 2.1, electricity: 5.2 },
          { date: '2026-06-13', daily: 9.8, transport: 2.8, diet: 2.1, electricity: 4.9 },
          { date: '2026-06-14', daily: 9.5, transport: 2.8, diet: 2.1, electricity: 4.6 },
          { date: '2026-06-15', daily: 9.0, transport: 2.8, diet: 2.1, electricity: 4.1 },
          { date: '2026-06-16', daily: 9.0, transport: 2.8, diet: 2.1, electricity: 4.1 },
          { date: '2026-06-17', daily: 9.0, transport: 2.8, diet: 2.1, electricity: 4.1 }
        ]
      },
      'users/leader_3': {
        uid: 'leader_3',
        name: 'Aditya Rao',
        email: 'aditya@sustainable.net',
        sustainabilityScore: 68,
        challengePoints: 75,
        offsetTotal: 10,
        friends: ['aarav@ecolife.org', 'priya@greenearth.in'],
        emissionData: { daily: 16.0, weekly: 112, monthly: 480, transport: 6.5, diet: 3.5, electricity: 6.0 },
        emissionLogs: [
          { date: '2026-06-11', daily: 18.2, transport: 7.2, diet: 3.5, electricity: 7.5 },
          { date: '2026-06-12', daily: 17.5, transport: 7.0, diet: 3.5, electricity: 7.0 },
          { date: '2026-06-13', daily: 17.0, transport: 6.8, diet: 3.5, electricity: 6.7 },
          { date: '2026-06-14', daily: 16.5, transport: 6.5, diet: 3.5, electricity: 6.5 },
          { date: '2026-06-15', daily: 16.0, transport: 6.5, diet: 3.5, electricity: 6.0 },
          { date: '2026-06-16', daily: 16.0, transport: 6.5, diet: 3.5, electricity: 6.0 },
          { date: '2026-06-17', daily: 16.0, transport: 6.5, diet: 3.5, electricity: 6.0 }
        ]
      },
      'users/leader_4': {
        uid: 'leader_4',
        name: 'Neha Krishnan',
        email: 'neha@climateaction.org',
        sustainabilityScore: 55,
        challengePoints: 40,
        offsetTotal: 0,
        friends: ['aarav@ecolife.org'],
        emissionData: { daily: 22.5, weekly: 157.5, monthly: 675, transport: 12.0, diet: 5.1, electricity: 5.4 },
        emissionLogs: [
          { date: '2026-06-11', daily: 25.4, transport: 14.2, diet: 5.1, electricity: 6.1 },
          { date: '2026-06-12', daily: 24.8, transport: 13.5, diet: 5.1, electricity: 6.2 },
          { date: '2026-06-13', daily: 24.0, transport: 13.0, diet: 5.1, electricity: 5.9 },
          { date: '2026-06-14', daily: 23.5, transport: 12.5, diet: 5.1, electricity: 5.9 },
          { date: '2026-06-15', daily: 22.5, transport: 12.0, diet: 5.1, electricity: 5.4 },
          { date: '2026-06-16', daily: 22.5, transport: 12.0, diet: 5.1, electricity: 5.4 },
          { date: '2026-06-17', daily: 22.5, transport: 12.0, diet: 5.1, electricity: 5.4 }
        ]
      }
    };
    Object.assign(dbData, defaultUsers);
    setMockFirestore(dbData);
  }

  // Seed mock authentication users
  let authUsers = [];
  try {
    authUsers = JSON.parse(safeStorage.getItem('mock_users') || '[]');
  } catch (e) {
    authUsers = [];
  }
  if (authUsers.length === 0) {
    const defaultAuthUsers = [
      { uid: 'leader_1', email: 'aarav@ecolife.org', password: 'password' },
      { uid: 'leader_2', email: 'priya@greenearth.in', password: 'password' },
      { uid: 'leader_3', email: 'aditya@sustainable.net', password: 'password' },
      { uid: 'leader_4', email: 'neha@climateaction.org', password: 'password' }
    ];
    safeStorage.setItem('mock_users', JSON.stringify(defaultAuthUsers));
  }
};

// Mock Implementations
const mockCreateUserWithEmailAndPassword = async (authObj, email, password) => {
  let users = [];
  try {
    users = JSON.parse(safeStorage.getItem('mock_users') || '[]');
  } catch (e) {
    users = [];
  }
  if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
    throw { code: 'auth/email-already-in-use', message: 'Email already in use.' };
  }
  const uid = 'user_' + Math.random().toString(36).substr(2, 9);
  users.push({ uid, email, password });
  safeStorage.setItem('mock_users', JSON.stringify(users));
  return { user: { uid, email } };
};

const mockSignInWithEmailAndPassword = async (authObj, email, password) => {
  let users = [];
  try {
    users = JSON.parse(safeStorage.getItem('mock_users') || '[]');
  } catch (e) {
    users = [];
  }
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    throw { code: 'auth/user-not-found', message: 'User not found.' };
  }
  if (user.password !== password) {
    throw { code: 'auth/wrong-password', message: 'Wrong password.' };
  }
  return { user: { uid: user.uid, email: user.email } };
};

const mockSignOut = async () => {
  return Promise.resolve();
};

const mockDoc = (dbObj, path, ...segments) => {
  return { type: 'doc', path: [path, ...segments].join('/') };
};

const mockCollection = (dbObj, path) => {
  return { type: 'collection', path };
};

const mockQuery = (collectionRef, ...constraints) => {
  const q = { type: 'query', collectionRef };
  constraints.forEach(c => {
    if (c.type === 'orderBy') {
      q.orderByField = c.field;
      q.orderByDirection = c.direction;
    } else if (c.type === 'limit') {
      q.limitVal = c.value;
    }
  });
  return q;
};

const mockOrderBy = (field, direction = 'asc') => {
  return { type: 'orderBy', field, direction };
};

const mockLimit = (value) => {
  return { type: 'limit', value };
};

const mockSetDoc = async (docRef, data) => {
  const dbData = getMockFirestore();
  dbData[docRef.path] = data;
  setMockFirestore(dbData);
  notifyListeners(docRef.path);
};

const mockUpdateDoc = async (docRef, data) => {
  const dbData = getMockFirestore();
  dbData[docRef.path] = { ...dbData[docRef.path], ...data };
  setMockFirestore(dbData);
  notifyListeners(docRef.path);
};

const mockGetDoc = async (docRef) => {
  const dbData = getMockFirestore();
  const docData = dbData[docRef.path];
  return {
    exists: () => !!docData,
    data: () => docData,
    id: docRef.path.split('/').pop()
  };
};

const mockOnSnapshot = (target, callback) => {
  const collectionPath = target.collectionRef ? target.collectionRef.path : target.path;
  const listenerId = target.type === 'doc'
    ? target.path
    : `collection:${collectionPath}` +
      (target.orderByField ? `|orderBy:${target.orderByField}:${target.orderByDirection}` : '') +
      (target.limitVal ? `|limit:${target.limitVal}` : '');

  listeners.set(listenerId, callback);

  // Execute immediately
  const dbData = getMockFirestore();
  if (target.type === 'doc') {
    const docData = dbData[target.path];
    callback({
      exists: () => !!docData,
      data: () => docData,
      id: target.path.split('/').pop()
    });
  } else {
    const allDocs = [];
    for (const p in dbData) {
      if (p.startsWith(collectionPath + '/')) {
        const docId = p.substring(collectionPath.length + 1);
        allDocs.push({ id: docId, ...dbData[p] });
      }
    }
    let docs = allDocs;
    if (target.orderByField) {
      docs.sort((a, b) => {
        const valA = a[target.orderByField] ?? 0;
        const valB = b[target.orderByField] ?? 0;
        return target.orderByDirection === 'desc' ? valB - valA : valA - valB;
      });
    }
    if (target.limitVal) {
      docs = docs.slice(0, target.limitVal);
    }
    callback({
      docs: docs.map(docItem => ({
        id: docItem.id,
        data: () => docItem,
        exists: () => true
      }))
    });
  }

  return () => {
    listeners.delete(listenerId);
  };
};

// Exports selection logic
let createUserWithEmailAndPassword;
let signInWithEmailAndPassword;
let signOut;
let doc;
let collection;
let query;
let orderBy;
let limit;
let setDoc;
let updateDoc;
let getDoc;
let onSnapshot;

if (isFirebaseConfigured) {
  const app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  createUserWithEmailAndPassword = fbCreateUser;
  signInWithEmailAndPassword = fbSignIn;
  signOut = fbSignOut;
  doc = fbDoc;
  collection = fbCollection;
  query = fbQuery;
  orderBy = fbOrderBy;
  limit = fbLimit;
  setDoc = fbSetDoc;
  updateDoc = fbUpdateDoc;
  getDoc = fbGetDoc;
  onSnapshot = fbOnSnapshot;
} else {
  console.warn("Firebase configuration not fully set. Falling back to offline LocalStorage database.");
  seedMockDatabase();
  auth = { currentUser: null };
  db = { type: 'mock_db' };
  createUserWithEmailAndPassword = mockCreateUserWithEmailAndPassword;
  signInWithEmailAndPassword = mockSignInWithEmailAndPassword;
  signOut = mockSignOut;
  doc = mockDoc;
  collection = mockCollection;
  query = mockQuery;
  orderBy = mockOrderBy;
  limit = mockLimit;
  setDoc = mockSetDoc;
  updateDoc = mockUpdateDoc;
  getDoc = mockGetDoc;
  onSnapshot = mockOnSnapshot;
}

export {
  auth,
  db,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  doc,
  collection,
  query,
  orderBy,
  limit,
  setDoc,
  updateDoc,
  getDoc,
  onSnapshot,
  safeStorage
};
