// LoginPage — public page showing the login form (centered).

import { Navigate } from 'react-router-dom'
import Login from '../components/auth/Login'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const { user, profile, loading } = useAuth()
  if (loading) return null
  if (user) {
    // Already signed in — go to the right home.
    return <Navigate to={profile?.role === 'authority' ? '/admin' : '/dashboard'} replace />
  }
  return <Login />
}