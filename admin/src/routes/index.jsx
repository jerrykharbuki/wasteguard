// routes/index.jsx — all routes for the admin application.
//
//   /login                -> admin login (public)
//   /admin                -> dashboard (protected)
//   /admin/reports        -> reports table (protected)
//   /admin/reports/:id    -> single report details (protected)
//
// Admin pages share AdminLayout (sidebar + header + <Outlet />) and are
// wrapped in ProtectedRoute to block non-authorities.

import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext'
import ProtectedRoute from '../components/ProtectedRoute'

import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'
import AdminLayout from '../layouts/AdminLayout'
import AdminDashboard from '../pages/AdminDashboard'
import ReportsPage from '../pages/ReportsPage'
import ReportDetailsPage from '../pages/ReportDetailsPage'

const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  {
    path: '/admin',
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: 'reports', element: <ReportsPage /> },
      { path: 'reports/:id', element: <ReportDetailsPage /> },
    ],
  },
  // Anything else goes to the admin dashboard.
  { path: '*', element: <Navigate to="/admin" replace /> },
])

export default function AppRoutes() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}