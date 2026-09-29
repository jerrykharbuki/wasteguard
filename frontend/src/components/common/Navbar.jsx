// Navbar — top navigation bar shown on the main pages.
// Shows app logo/brand and a sign-out button (via useAuth).

import { useNavigate, Link } from 'react-router-dom'
import { logoutUser } from '../../services/authService'
import { useAuth } from '../../context/AuthContext'
import Button from './Button'

export default function Navbar() {
  const { user } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logoutUser()
    navigate('/login')
  }

  return (
    <header className="navbar">
      <div className="navbar__brand">
        <Link to="/" className="navbar__logo">
          <span className="navbar__logo-badge">♻</span>
          <span>WasteGuard AI</span>
        </Link>
      </div>

      <div className="navbar__actions">
        {user && (
          <>
            <span className="navbar__user">{user.email}</span>
            <Button variant="ghost" onClick={handleLogout}>
              Sign out
            </Button>
          </>
        )}
      </div>
    </header>
  )
}