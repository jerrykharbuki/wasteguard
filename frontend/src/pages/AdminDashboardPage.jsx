// AdminDashboardPage — authority dashboard with incident table, map, and details.

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getIncidents } from '../services/firestoreService'
import AdminDashboard from '../components/admin/AdminDashboard'
import IncidentDetails from '../components/admin/IncidentDetails'
import IncidentMap from '../components/map/IncidentMap'

export default function AdminDashboardPage() {
  const [incidents, setIncidents] = useState([])
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    let active = true
    getIncidents()
      .then((data) => active && setIncidents(data))
      .finally(() => (active = false))
  }, [])

  // Refresh the list after an authority updates an incident.
  function handleUpdated(id, updates) {
    setIncidents((prev) =>
      prev.map((i) => (i.id === id ? { ...i, ...updates } : i))
    )
    setSelected((prev) => (prev?.id === id ? { ...prev, ...updates } : prev))
  }

  return (
    <div className="admin-page">
      {(selected == null && (
        <>
          <div className="panel">
            <div className="panel__header">
              <div>
                <h2>Incident map</h2>
                <p className="muted">{incidents.length} incident(s)</p>
              </div>
              <Link to="/report" className="btn btn--primary">
                Start detection
              </Link>
            </div>
            <IncidentMap
              incidents={incidents}
              onSelect={(i) => setSelected(i)}
            />
          </div>
          <AdminDashboard
            incidents={incidents}
            onSelect={(i) => setSelected(i)}
          />
        </>
      )) || (
          <>
            <IncidentDetails
              incident={selected}
              onBack={() => setSelected(null)}
              onUpdated={handleUpdated}
            />
          </>
        )}
    </div>
  )


}