// components/Sidebar.jsx — navigation menu for the admin app.
// Shown inside AdminLayout on desktop; toggled as an overlay on mobile.

import { NavLink } from 'react-router-dom'

const NAV_LINKS = [
  { to: '/admin', label: 'Dashboard', icon: '📊', end: true },
  { to: '/admin/reports', label: 'Reports', icon: '🗂️', end: false },
]

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {/* Dark overlay that closes the sidebar on mobile */}
      {open && <div className="sidebar-overlay" onClick={onClose} />}

      <aside className={`sidebar${open ? ' sidebar--open' : ''}`}>
        <div className="sidebar__brand">
          <span className="sidebar__logo">♻</span>
          <div>
            <strong>WasteGuard AI</strong>
            <span className="sidebar__role">Authority Portal</span>
          </div>
        </div>

        <nav className="sidebar__nav">
          {NAV_LINKS.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              end={item.end}
              onClick={onClose}
              className={({ isActive }) =>
                `sidebar__link${isActive ? ' sidebar__link--active' : ''}`
              }
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar__footer">
          <a href="https://wasteguard-dba25.firebaseapp.com" className="sidebar__user-app" target="_blank" rel="noreferrer">
            ← Go to user app
          </a>
        </div>
      </aside>
    </>
  )
}