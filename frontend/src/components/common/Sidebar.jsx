// Sidebar — navigation menu for users/authorities on their dashboards.
// Items can be filtered by role via the `items` prop.

import { NavLink } from 'react-router-dom'

export default function Sidebar({ items = [] }) {
  return (
    <aside className="sidebar">
      <nav className="sidebar__nav">
        {items.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `sidebar__link${isActive ? ' sidebar__link--active' : ''}`
            }
          >
            <span className="sidebar__icon">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}