// Login — email/password login form card.
// Uses authService.loginUser then routes by saved location.

import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { loginUser, getUserProfile } from '../../services/authService'
import Button from '../common/Button'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from || '/dashboard'

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!email || !password) return setError('Email and password are required.')
    setBusy(true)
    try {
      const cred = await loginUser({ email, password })
      // Route authorities to the admin dashboard.
      const profile = await getUserProfile(cred.user.uid)
      navigate(profile?.role === 'authority' ? '/admin' : from, { replace: true })
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <form className="auth-card" onSubmit={handleSubmit}>
      <h2>Welcome back</h2>
      <p className="auth-card__sub">Sign in to WasteGuard AI</p>

      <label className="field">
        <span>Email</span>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
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

      <Button type="submit" disabled={busy}>
        {busy ? 'Signing in…' : 'Sign in'}
      </Button>

      <p className="auth-card__footer">
        Don’t have an account? <Link to="/register">Create one</Link>
      </p>
    </form>
  )
}