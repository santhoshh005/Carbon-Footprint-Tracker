import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyCVvUWEpdbUaMmVnS3CeWfjFXbjPYqC6rY',
  authDomain: 'carbon-footprint-tracker-54f5c.firebaseapp.com',
  projectId: 'carbon-footprint-tracker-54f5c',
  storageBucket: 'carbon-footprint-tracker-54f5c.firebasestorage.app',
  messagingSenderId: '69835828189',
  appId: '1:69835828189:web:988aeebd7f913bd2bf2434'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
