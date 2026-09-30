// pages/LoginPage.jsx — administrator login.
// Sign in with Firebase, then verify the account has role 'authority'
// before allowing access. Non-authorities get an error.
// Only works for accounts with role 'authority' in Firestore.

import { useState } from 'react'
import { useNavigate, Navigate, Link } from 'react-router-dom'
import { loginUser, loginWithGoogle, isAdmin } from '../services/authService'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const { user, isAdmin: alreadyAdmin, loading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const navigate = useNavigate()

  // If already an admin, skip login.
  if (loading) return null
  if (user && alreadyAdmin) return <Navigate to="/admin" replace />

  // Shared post-login check: only authorities may proceed.
  async function grantAccess(firebaseUser) {
    const ok = await isAdmin(firebaseUser.uid)
    if (!ok) {
      setError('Access denied: this account has no administrator privileges.')
      return false
    }
    navigate('/admin', { replace: true })
    return true
  }

  async function handleGoogle() {
    setError('')
    setBusy(true)
    try {
      const loggedIn = await loginWithGoogle()
      const ok = await grantAccess(loggedIn)
      if (!ok) setBusy(false)
    } catch (err) {
      setError(err.message || 'Google sign-in failed. Please try again.')
      setBusy(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!email || !password) {
      setError('Email and password are required.')
      return
    }
    setBusy(true)
    try {
      const loggedIn = await loginUser({ email, password })
      // Verify role BEFORE allowing access.
      const ok = await grantAccess(loggedIn)
      if (!ok) setBusy(false)
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.')
      setBusy(false)
    }
  }

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <div className="login-card__logo">♻</div>
        <h1>WasteGuard AI</h1>
        <p className="muted">Authority Portal — sign in to manage reports</p>

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
            placeholder="••••••••"
            autoComplete="current-password"
          />
        </label>

        {error && <p className="form-error">{error}</p>}

        <button className="btn btn--primary btn--block" type="submit" disabled={busy}>
          {busy ? 'Signing in…' : 'Sign in'}
        </button>

        <div className="auth-divider"><span>or</span></div>

        <button
          type="button"
          className="btn btn--google btn--block"
          onClick={handleGoogle}
          disabled={busy}
        >
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.1a7.03 7.03 0 0 1 0-4.2V6.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 6.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"
            />
          </svg>
          {busy ? 'Signing in…' : 'Sign in with Google'}
        </button>

        <p className="auth-switch">
          Don&apos;t have an account? <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  )
}