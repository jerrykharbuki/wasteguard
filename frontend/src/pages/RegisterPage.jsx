// RegisterPage — renders the registration form in a centered layout.

import { Navigate } from 'react-router-dom'
import Register from '../components/auth/Register'
import { useAuth } from '../context/AuthContext'

export default function RegisterPage() {
  const { user } = useAuth()
  if (user) return <Navigate to="/dashboard" replace />
  return <Register />
}