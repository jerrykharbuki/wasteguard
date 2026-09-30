// pages/AdminDashboard.jsx — admin landing page.
// Shows four statistic cards: total, pending, resolved, and rejected
// reports, computed from the shared 'incidents' collection.

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getReports } from '../services/reportService'
import { sampleReports } from '../services/sampleData'
import StatCard from '../components/StatCard'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ total: 0, pending: 0, resolved: 0, rejected: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    async function load() {
      try {
        const reports = await getReports()
        const source = reports.length > 0 ? reports : sampleReports
        if (active) setStats(computeStats(source))
      } catch (err) {
        console.error('Failed to load reports:', err)
        if (active) setStats(computeStats(sampleReports))
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => {
      active = false
    }
  }, [])

  function computeStats(reports) {
    return {
      total: reports.length,
      pending: reports.filter((r) => r.status === 'pending').length,
      resolved: reports.filter((r) => r.status === 'resolved').length,
      rejected: reports.filter((r) => r.status === 'rejected').length,
    }
  }

  if (loading) return <div className="page-placeholder">Loading dashboard…</div>

  return (
    <div>
      <h2 className="page-title">Dashboard</h2>

      <div className="stats-grid">
        <StatCard label="Total reports" value={stats.total} tone="default" />
        <StatCard label="Pending" value={stats.pending} tone="pending" />
        <StatCard label="Resolved" value={stats.resolved} tone="resolved" />
        <StatCard label="Rejected" value={stats.rejected} tone="rejected" />
      </div>

      <div className="panel">
        <div className="panel__header">
          <h3>Reports</h3>
        </div>
        <p className="muted">Review user-submitted waste reports, inspect evidence,
        and update their status.</p>
        <Link to="/admin/reports" className="btn btn--primary" style={{ marginTop: 12 }}>
          Open reports →
        </Link>
      </div>
    </div>
  )
}