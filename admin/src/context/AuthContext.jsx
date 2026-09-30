// context/AuthContext.jsx — manages admin authentication state.
// Provides { user, isAdmin, loading } so the whole app knows whether the
// logged-in account is an authorized authority.

import { createContext, useContext, useEffect, useState } from 'react'
import { observeAuth, getProfile } from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Listen to Firebase auth changes.
    const unsubscribe = observeAuth(async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser)
        // Verify the role in Firestore before granting admin access.
        const profile = await getProfile(firebaseUser.uid)
        setIsAdmin(profile?.role === 'authority')
      } else {
        setUser(null)
        setIsAdmin(false)
      }
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const value = { user, isAdmin, loading }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Hook for components to read the auth state.
export function useAuth() {
  return useContext(AuthContext)
}