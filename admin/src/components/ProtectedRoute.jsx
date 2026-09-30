// components/ProtectedRoute.jsx — guards admin pages.
// - Shows a loading message while auth state loads.
// - Redirects already-signed-out users to /login.
// - Blocks signed-in users who are NOT authorities (shows a clear message
//   and a sign-out option), instead of letting them into the admin app.

import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { logoutUser } from '../services/authService'

export default function ProtectedRoute({ children }) {
  const { user, isAdmin, loading } = useAuth()

  if (loading) {
    return <div className="auth-message">Checking access…</div>
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (!isAdmin) {
    // Signed in but not an authorized authority.
    return (
      <div className="auth-message">
        <h2>Access denied</h2>
        <p>Your account does not have administrator privileges.</p>
        <button
          className="btn btn--primary"
          onClick={() => logoutUser().then(() => navigateToLogin())}
        >
          Sign out &amp; try again
        </button>
      </div>
    )
  }

  return children
}

// Small helper to keep the inline handler above clean.
export function navigateToLogin() {
  window.location.href = '/login'
}