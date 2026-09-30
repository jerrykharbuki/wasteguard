// ProtectedRoute — gate a route behind a role (demo mode).
// This app has no login page, so there is no authentication gate:
// - If auth is still loading, show a loading spinner.
// - If a requiredRole is provided and the user's role doesn't match,
//   redirect to their home (user -> /dashboard, authority -> /admin).
// Signed-out visitors pass through so the demo still works.

import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Loading from '../common/Loading'

export default function ProtectedRoute({ children, requiredRole }) {
  const { profile, loading } = useAuth()

  if (loading) return <Loading label="Loading…" />

  // Demo mode: no authentication — everyone proceeds.
  if (requiredRole && profile?.role !== requiredRole) {
    // No access -> send them to the area they belong to.
    const destination = profile?.role === 'authority' ? '/admin' : '/dashboard'
    return <Navigate to={destination} replace />
  }

  return children
}