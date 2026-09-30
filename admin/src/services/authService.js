// services/authService.js — administrator authentication.
// Only accounts with role 'authority' in Firestore (users/{uid})
// are allowed to use this admin app.

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, db } from '../firebase/firebase'

// Register a new authority account. An email/password account is created
// and a matching profile document (role 'authority') is written to Firestore
// so the account can access the admin app.
export async function registerUser({ name, email, password }) {
  const cred = await createUserWithEmailAndPassword(auth, email, password)
  const user = cred.user

  await updateProfile(user, { displayName: name })

  await setDoc(doc(db, 'users', user.uid), {
    uid: user.uid,
    name,
    email,
    role: 'authority',
    provider: 'password',
    createdAt: new Date().toISOString(),
  })

  return user
}

// Sign in with Google. Google accounts may not have a Firestore profile yet,
// so we create one with role 'authority' on first sign-in.
export async function loginWithGoogle() {
  const provider = new GoogleAuthProvider()
  const cred = await signInWithPopup(auth, provider)
  const user = cred.user

  const existing = await getProfile(user.uid)
  if (!existing) {
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      name: user.displayName || 'Google User',
      email: user.email,
      role: 'authority',
      provider: 'google',
      createdAt: new Date().toISOString(),
    })
  }

  return user
}

// Log in with email + password.
export async function loginUser({ email, password }) {
  const cred = await signInWithEmailAndPassword(auth, email, password)
  return cred.user
}

// Log out.
export function logoutUser() {
  return signOut(auth)
}

// Subscribe to auth changes; callback receives the user or null.
export function observeAuth(callback) {
  return onAuthStateChanged(auth, callback)
}

// Fetch the role/profile document for a uid from Firestore.
export async function getProfile(uid) {
  const snap = await getDoc(doc(db, 'users', uid))
  return snap.exists() ? snap.data() : null
}

// Convenience helper: is this uid an authorized authority?
export async function isAdmin(uid) {
  const profile = await getProfile(uid)
  return Boolean(profile && profile.role === 'authority')
}