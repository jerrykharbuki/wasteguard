// AdminLayout — dedicated layout for the authority/admin section.
// Provides a left sidebar with navigation and an <Outlet /> where the
// active admin page renders. Replaces the normal app Navbar/Footer area
// so the admin section looks and behaves like its own portal.

import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { logoutUser } from '../services/authService'

// Navigation entries for the admin sidebar.
const LINKS = [
  { to: '/admin', label: 'Dashboard', icon: '📊', end: true },
  { to: '/admin/reports', label: 'Reports', icon: '🗂️', end: false },
]

export default function AdminLayout() {
  const { user } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logoutUser()
    // No login page in demo mode — go back to the dashboard.
    navigate('/dashboard')
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__brand">
          <span className="navbar__logo-badge">♻</span>
          <div>
            <strong>WasteGuard AI</strong>
            <span className="admin-sidebar__role">Authority Portal</span>
          </div>
        </div>

        <nav className="admin-sidebar__nav">
          {LINKS.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `admin-sidebar__link${isActive ? ' admin-sidebar__link--active' : ''}`
              }
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar__footer">
          <div className="admin-sidebar__user">
            <span className="admin-sidebar__avatar">
              {(user?.displayName || user?.email || 'A').charAt(0).toUpperCase()}
            </span>
            <div className="admin-sidebar__user-meta">
              <strong>{user?.displayName || user?.email}</strong>
              <span>Administrator</span>
            </div>
          </div>
          <button className="admin-sidebar__logout" onClick={handleLogout}>
            Sign out
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  )
}