// AdminDashboard — the default/admin dashboard at /admin.
// Shows summary statistics for authorities: total, pending, resolved,
// and rejected reports. Includes quick links to the reports page.

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getIncidents } from '../../services/firestoreService'
import Loading from '../common/Loading'

const STATUS_VALUES = ['pending', 'resolved', 'rejected']

export default function AdminDashboard() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    async function load() {
      try {
        // Authorities see every submitted report.
        const data = await getIncidents()
        if (active) setReports(data)
      } catch (err) {
        console.error('Failed to load reports:', err)
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => {
      active = false
    }
  }, [])

  const stats = {
    total: reports.length,
    pending: reports.filter((r) => r.status === 'pending').length,
    resolved: reports.filter((r) => r.status === 'resolved').length,
    rejected: reports.filter((r) => r.status === 'rejected').length,
  }

  return (
    <div className="admin-dashboard">
      <header className="admin-dashboard__header">
        <h1>Dashboard</h1>
        <p className="muted">Overview of all submitted reports.</p>
      </header>

      {loading ? (
        <Loading label="Loading statistics…" />
      ) : (
        <section className="stats-row">
          <StatCard label="Total reports" value={stats.total} />
          <StatCard label="Pending" value={stats.pending} tone="pending" />
          <StatCard label="Resolved" value={stats.resolved} tone="resolved" />
          <StatCard label="Rejected" value={stats.rejected} tone="rejected" />
        </section>
      )}

      <section className="panel">
        <div className="panel__header">
          <h2>Reports quick actions</h2>
        </div>
        <p className="muted">
          Review user submissions, verify evidence, and update report status.
        </p>
        <Link to="/admin/reports" className="btn btn--primary" style={{ marginTop: 12 }}>
          View all reports →
        </Link>
      </section>

      {!loading && STATUS_VALUES.every((s) => stats[s] === 0) && stats.total === 0 && (
        <p className="muted" style={{ padding: '8px 4px' }}>
          No reports submitted yet.
        </p>
      )}
    </div>
  )
}

function StatCard({ label, value, tone }) {
  return (
    <div className={`stat-card stat-card--${tone || 'default'}`}>
      <span className="stat-card__value">{value}</span>
      <span className="stat-card__label">{label}</span>
    </div>
  )
}