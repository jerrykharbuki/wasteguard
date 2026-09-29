// ProtectedRoute — gate a route behind authentication.
// - If auth is still loading, show a loading spinner.
// - If the user is signed out, redirect to /login.
// - If a requiredRole is provided and the user's role doesn't match,
//   redirect to their home (user -> /dashboard, authority -> /admin).

import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Loading from '../common/Loading'

export default function ProtectedRoute({ children, requiredRole }) {
  const { user, profile, loading } = useAuth()

  if (loading) return <Loading label="Checking session…" />

  if (!user) return <Navigate to="/login" replace />

  if (requiredRole && profile?.role !== requiredRole) {
    // No access -> send them to the area they belong to.
    const destination = profile?.role === 'authority' ? '/admin' : '/dashboard'
    return <Navigate to={destination} replace />
  }

  return children
}