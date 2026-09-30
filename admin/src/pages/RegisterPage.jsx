// pages/RegisterPage.jsx — administrator registration.
// Create a new authority account with email + password. Once registered,
// the account is auto-signed-in and granted the 'authority' role in
// Firestore so it can access the admin app.

import { useState } from 'react'
import { useNavigate, Navigate, Link } from 'react-router-dom'
import { registerUser } from '../services/authService'
import { useAuth } from '../context/AuthContext'

export default function RegisterPage() {
  const { user, isAdmin: alreadyAdmin, loading } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const navigate = useNavigate()

  // If already an admin, skip registration.
  if (loading) return null
  if (user && alreadyAdmin) return <Navigate to="/admin" replace />

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!name || !email || !password || !confirm) {
      setError('All fields are required.')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    setBusy(true)
    try {
      await registerUser({ name, email, password })
      // The newly created account has role 'authority', so it can go straight in.
      navigate('/admin', { replace: true })
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.')
      setBusy(false)
    }
  }

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <div className="login-card__logo">♻</div>
        <h1>WasteGuard AI</h1>
        <p className="muted">Authority Portal — create an account</p>

        <label className="field">
          <span>Full name</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Jane Doe"
            autoComplete="name"
          />
        </label>

        <label className="field">
          <span>Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@wasteguard.app"
            autoComplete="email"
          />
        </label>

        <label className="field">
          <span>Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 6 characters"
            autoComplete="new-password"
          />
        </label>

        <label className="field">
          <span>Confirm password</span>
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Repeat password"
            autoComplete="new-password"
          />
        </label>

        {error && <p className="form-error">{error}</p>}

        <button className="btn btn--primary btn--block" type="submit" disabled={busy}>
          {busy ? 'Creating account…' : 'Register'}
        </button>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </form>
    </div>
  )
}