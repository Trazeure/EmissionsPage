import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBQa_lv8rGDt-zK8EbazhZu3KdoK-FmQgE",
  authDomain: "globe-rating-system.firebaseapp.com",
  projectId: "globe-rating-system",
  storageBucket: "globe-rating-system.firebasestorage.app",
  messagingSenderId: "213598069837",
  appId: "1:213598069837:web:b59d5d3c5a79d0640aa804"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

export default app;