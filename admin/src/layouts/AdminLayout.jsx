// layouts/AdminLayout.jsx — shared layout for all admin pages.
// Combines <Sidebar /> + <Header /> and renders the active page via
// React Router's <Outlet />. Router calls this for /admin and nested pages.

import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="admin-layout">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="admin-content">
        <Header
          title="Authority Portal"
          onMenuClick={() => setSidebarOpen(true)}
        />
        <main className="admin-main">
          <Outlet />
        </main>
      </div>
    </div>
  )
}