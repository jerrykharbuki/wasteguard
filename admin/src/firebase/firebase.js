// firebase/firebase.js — Firebase initialization for the admin app.
// Uses the SAME Firebase project as the user application so authorities
// can see and manage the reports submitted there.

import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
 apiKey: "AIzaSyBDSrVQiD1t-BPylKIOD5lgtzR0_GcexXM",
  authDomain: "wasteguard-dba25.firebaseapp.com",
  projectId: "wasteguard-dba25",
  storageBucket: "wasteguard-dba25.firebasestorage.app",
  messagingSenderId: "252705699770",
  appId: "1:252705699770:web:5a704974cb4ec460c9cf83",
  measurementId: "G-XDNX82JMSR"
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)

export default app