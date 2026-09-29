// Authentication service.
// All Firebase Auth calls live here so components stay clean.

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, db } from './firebase'

// Register a new user. Sets role = 'user' by default and stores
// a matching profile document in Firestore so we can distinguish
// regular users from authorities.
export async function registerUser({ name, email, password }) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password)
  const user = userCredential.user

  await updateProfile(user, { displayName: name })

  await setDoc(doc(db, 'users', user.uid), {
    uid: user.uid,
    name,
    email,
    role: 'user',
    createdAt: new Date().toISOString(),
  })

  return user
}

// Log in with email + password.
export function loginUser({ email, password }) {
  return signInWithEmailAndPassword(auth, email, password)
}

// Log out the current user.
export function logoutUser() {
  return signOut(auth)
}

// Subscribe to auth state changes. Returns an unsubscribe function.
// callback receives the user (or null when signed out).
export function observeAuth(callback) {
  return onAuthStateChanged(auth, callback)
}

// Get the role (and profile) of a user by uid.
export async function getUserProfile(uid) {
  const snap = await getDoc(doc(db, 'users', uid))
  return snap.exists() ? snap.data() : null
}