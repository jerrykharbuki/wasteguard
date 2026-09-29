// useAuth — subscribe to the Firebase auth state.
// Provides: { user, profile, loading }
//  - user: the Firebase user (or null)
//  - profile: the Firestore profile doc (includes { role })
//  - loading: true until we know the auth state (to avoid redirect flicker)

import { useState, useEffect } from 'react'
import { observeAuth } from '../services/authService'
import { getDoc, doc } from 'firebase/firestore'
import { db } from '../services/firebase'

export default function useAuth() {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = observeAuth(async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser)
        // Load the user's role/profile from Firestore.
        const snap = await getDoc(doc(db, 'users', firebaseUser.uid))
        setProfile(snap.exists() ? snap.data() : null)
      } else {
        setUser(null)
        setProfile(null)
      }
      setLoading(false)
    })
    return unsubscribe
  }, [])

  return { user, profile, loading }
}