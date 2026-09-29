// AdminDashboard — authority's overview: stats + full incident table.

import { useEffect, useState } from 'react'
import { getIncidents } from '../../services/firestoreService'
import IncidentTable from './IncidentTable'
import Loading from '../common/Loading'

export default function AdminDashboard({ incidents: propIncidents, onSelect }) {
  // If incidents are passed from the parent page, use them; otherwise fetch.
  const [localIncidents, setLocalIncidents] = useState([])
  const [loading, setLoading] = useState(!propIncidents)
  const incidents = propIncidents || localIncidents

  useEffect(() => {
    if (propIncidents) return
    let active = true
    async function load() {
      try {
        const data = await getIncidents() // authorities see everything
        if (active) setLocalIncidents(data)
      } catch (err) {
        console.error('Failed to load incidents:', err)
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => {
      active = false
    }
  }, [propIncidents])

  const stats = {
    total: incidents.length,
    pending: incidents.filter((i) => i.status === 'pending').length,
    verified: incidents.filter((i) => i.status === 'verified').length,
    resolved: incidents.filter((i) => i.status === 'resolved').length,
  }

  return (
    <div className="admin">
      <section className="stats-row">
        <StatCard label="Total incidents" value={stats.total} />
        <StatCard label="Pending review" value={stats.pending} tone="pending" />
        <StatCard label="Verified" value={stats.verified} tone="verified" />
        <StatCard label="Resolved" value={stats.resolved} tone="resolved" />
      </section>

      <section className="panel">
        <div className="panel__header">
          <h2>All incidents</h2>
          <p className="muted">AI detections are suspected only — review the
          evidence before any action.</p>
        </div>
        {loading ? (
          <Loading />
        ) : (
          <IncidentTable incidents={incidents} onSelect={onSelect} />
        )}
      </section>
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