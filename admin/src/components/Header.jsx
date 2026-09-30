// components/Header.jsx — top navigation bar.
// Shows a hamburger toggle (mobile), the page context on the left, and
// the signed-in admin's name + sign-out on the right.

import { useAuth } from '../context/AuthContext'
import { logoutUser } from '../services/authService'

export default function Header({ onMenuClick, title }) {
  const { user } = useAuth()

  async function handleLogout() {
    await logoutUser()
    // to /login handled by ProtectedRoute redirect after auth state clears
  }

  return (
    <header className="header">
      <button className="header__menu" onClick={onMenuClick} aria-label="Open menu">
        ☰
      </button>

      <h1 className="header__title">{title}</h1>

      <div className="header__right">
        <div className="header__user">
          <span className="header__avatar">
            {(user?.email || 'A').charAt(0).toUpperCase()}
          </span>
          <span className="header__name">{user?.email}</span>
        </div>
        <button className="btn btn--ghost" onClick={handleLogout}>
          Sign out
        </button>
      </div>
    </header>
  )
}