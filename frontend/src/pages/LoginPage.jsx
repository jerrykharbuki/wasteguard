// LoginPage — renders the login form in a centered layout.

import { Navigate } from 'react-router-dom'
import Login from '../components/auth/Login'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const { user } = useAuth()
  if (user) return <Navigate to="/dashboard" replace />
  return <Login />
}