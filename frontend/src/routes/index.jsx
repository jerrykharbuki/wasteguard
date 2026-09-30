// routes/index.jsx — all React Router routes.
//
// User area (requires sign-in):
//   /dashboard, /report        (wrapped in AppLayout)
//
// Authority/admin area (requires role === 'authority'):
//   /admin                     (admin dashboard)
//   /admin/reports             (reports management)
//   /admin/reports/:id         (single report details)
//   (all wrapped in AdminLayout with a sidebar + <Outlet />)
//
// Regular users are NOT allowed into /admin; ProtectedRoute redirects them.

import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from '../context/AuthContext'
import ProtectedRoute from '../components/auth/ProtectedRoute'
import Loading from '../components/common/Loading'

import AppLayout from '../pages/AppLayout'
import DashboardPage from '../pages/DashboardPage'
import ReportPage from '../pages/ReportPage'

import AdminLayout from '../pages/AdminLayout'
import AdminDashboard from '../components/admin/AdminDashboard'
import AdminReports from '../pages/AdminReports'
import AdminReportDetails from '../pages/AdminReportDetails'

// Redirect "/" to the user's home depending on role.
function HomeRedirect() {
  const { profile, loading } = useAuth()
  if (loading) return <Loading label="Loading…" />
  return <Navigate to={profile?.role === 'authority' ? '/admin' : '/dashboard'} replace />
}

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <HomeRedirect /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'report', element: <ReportPage /> },
    ],
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute requiredRole="authority">
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: 'reports', element: <AdminReports /> },
      { path: 'reports/:id', element: <AdminReportDetails /> },
    ],
  },
  { path: '*', element: <Navigate to="/dashboard" replace /> },
])

// Wrap everything in the AuthProvider so auth state is shared app-wide.
export default function AppRoutes() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}