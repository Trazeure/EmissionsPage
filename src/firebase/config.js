// src/firebase/config.js

import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBQa_lv8rGDt-zK8EbazhZu3KdoK-FmQgE",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "globe-rating-system.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "globe-rating-system",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "globe-rating-system.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "213598069837",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:213598069837:web:b59d5d3c5a79d0640aa804"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };