// routes/index.jsx — all React Router routes.
// Public: /login, /register
// Protected (signed-in): /dashboard, /report
// Authority-only: /admin

import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext'
import ProtectedRoute from '../components/auth/ProtectedRoute'

import AppLayout from '../pages/AppLayout'
import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'
import DashboardPage from '../pages/DashboardPage'
import ReportPage from '../pages/ReportPage'
import AdminDashboardPage from '../pages/AdminDashboardPage'

const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'report', element: <ReportPage /> },
    ],
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute requiredRole="authority">
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [{ index: true, element: <AdminDashboardPage /> }],
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