// AdminReportsPage — reports management at /admin/reports.
// Lists every submitted report in a table (report ID, waste type,
// location, submission date, status). Rows link to the details page.

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getIncidents } from '../services/firestoreService'
import { sampleReports } from '../services/sampleData'
import StatusBadge from '../components/admin/StatusBadge'
import Loading from '../components/common/Loading'
import { formatDate } from '../utils/format'

export default function AdminReportsPage() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [usingSample, setUsingSample] = useState(false)

  useEffect(() => {
    let active = true
    async function load() {
      try {
        const data = await getIncidents()
        if (!active) return
        // If Firestore has nothing yet, fall back to sample data so the
        // page is demonstrable. Remove this fallback when real data exists.
        if (data.length === 0) {
          setReports(sampleReports)
          setUsingSample(true)
        } else {
          setReports(data)
          setUsingSample(false)
        }
      } catch (err) {
        console.error('Failed to load reports:', err)
        if (active) {
          setReports(sampleReports)
          setUsingSample(true)
        }
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => {
      active = false
    }
  }, [])

  return (
    <div className="admin-reports">
      <header className="admin-dashboard__header">
        <h1>Reports</h1>
        <p className="muted">All reports submitted by users.</p>
      </header>

      {usingSample && (
        <p className="muted" style={{ marginBottom: 12 }}>
          Showing sample data (Firestore is empty).
        </p>
      )}

      {loading ? (
        <Loading label="Loading reports…" />
      ) : (
        <div className="panel">
          <div className="table-wrap">
            <table className="incident-table">
              <thead>
                <tr>
                  <th>Report ID</th>
                  <th>Waste type</th>
                  <th>Location</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {reports.map((report) => (
                  <tr key={report.id} className="incident-table__row">
                    <td>{report.id || '—'}</td>
                    <td>{report.wasteType || report.title || 'Not specified'}</td>
                    <td>
                      {report.location
                        ? `${report.location.lat?.toFixed?.(4) ?? '?'}, ${report.location.lng?.toFixed?.(4) ?? '?'}`
                        : '—'}
                    </td>
                    <td>{formatDate(report.createdAt)}</td>
                    <td><StatusBadge status={report.status} /></td>
                    <td>
                      <Link
                        to={`/admin/reports/${report.id}`}
                        className="btn btn--outline btn--sm"
                      >
                        View →
                      </Link>
                    </td>
                  </tr>
                ))}
                {reports.length === 0 && (
                  <tr>
                    <td colSpan="6" className="muted">No reports yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}