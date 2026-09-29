// Import Firebase functions
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics, isSupported } from "firebase/analytics";

// Firebase configuration
const firebaseConfig = {
apiKey: "AIzaSyBDSrVQiD1t-BPylKIOD5lgtzR0_GcexXM",
  authDomain: "wasteguard-dba25.firebaseapp.com",
  projectId: "wasteguard-dba25",
  storageBucket: "wasteguard-dba25.firebasestorage.app",
  messagingSenderId: "252705699770",
  appId: "1:252705699770:web:5a704974cb4ec460c9cf83",
  measurementId: "G-XDNX82JMSR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Initialize Analytics when supported
export const analytics = isSupported().then((supported) =>
  supported ? getAnalytics(app) : null
);

export default app;