// RegisterPage — public page showing the registration form (centered).

import { Navigate } from 'react-router-dom'
import Register from '../components/auth/Register'
import { useAuth } from '../context/AuthContext'

export default function RegisterPage() {
  const { user } = useAuth()
  if (user) return <Navigate to="/dashboard" replace />
  return <Register />
}