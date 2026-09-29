// AuthContext — provides the authenticated user + role to the whole app.
// Wraps the app in App.jsx so any component can call useAuth().
// This avoids prop-drilling and lets ProtectedRoute redirect properly.

import { createContext, useContext } from 'react'
import useAuthHook from '../hooks/useAuth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const auth = useAuthHook()
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}

// Custom hook so components call useAuth() to get { user, profile, loading }.
export function useAuth() {
  return useContext(AuthContext)
}