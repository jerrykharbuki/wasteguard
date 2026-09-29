// Dashboard — the user's home screen content.
// Shows a welcome, a prompt to start detection, and their recent reports.

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getIncidents } from '../../services/firestoreService'
import RecentReports from './RecentReports'
import Button from '../common/Button'
import Loading from '../common/Loading'

export default function Dashboard() {
  const { user } = useAuth()
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    async function load() {
      try {
        const data = await getIncidents({ userId: user?.uid })
        if (active) setReports(data)
      } catch (err) {
        console.error('Failed to load reports:', err)
      } finally {
        if (active) setLoading(false)
      }
    }
    if (user) load()
    return () => {
      active = false
    }
  }, [user])

  return (
    <div className="dashboard">
      <section className="hero-panel">
        <div>
          <h1>Welcome, {user?.displayName || 'there'} 👋</h1>
          <p>Use the live camera to detect suspected waste dumping, capture
          evidence, and report it with your location.</p>
        </div>
        <Link to="/report">
          <Button>Start detection</Button>
        </Link>
      </section>

      <section className="panel">
        <div className="panel__header">
          <h2>Recent reports</h2>
        </div>
        {loading ? <Loading /> : <RecentReports reports={reports} />}
      </section>
    </div>
  )
}