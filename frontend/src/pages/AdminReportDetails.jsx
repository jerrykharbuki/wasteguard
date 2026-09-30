// AdminReportDetails — full detail view for a single report at
// /admin/reports/:id. Shows the uploaded evidence image, location on a
// map, and lets an authority update the report status.

import { useEffect, useMemo, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getIncident, updateIncident } from '../services/firestoreService'
import { sampleReports } from '../services/sampleData'
import StatusBadge from '../components/admin/StatusBadge'
import IncidentMap from '../components/map/IncidentMap'
import Button from '../components/common/Button'
import Loading from '../components/common/Loading'
import { formatDateTime } from '../utils/format'

const STATUS_OPTIONS = ['pending', 'resolved', 'rejected']

export default function AdminReportDetails() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [usingSample, setUsingSample] = useState(false)
  const [notes, setNotes] = useState('')
  const [status, setStatus] = useState('pending')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  // A memoised, single-incident map marker object for the detail view.
  const mapIncidents = useMemo(
    () => (report?.location ? [report] : []),
    [report]
  )

  useEffect(() => {
    let active = true
    async function load() {
      try {
        const data = await getIncident(id)
        if (!active) return
        if (data) {
          setReport(data)
          setStatus(data.status || 'pending')
          setNotes(data.notes || '')
        } else {
          // Fallback to sample data (frontend-first demo).
          const sample = sampleReports.find((r) => r.id === id)
          if (sample) {
            setReport(sample)
            setStatus(sample.status)
            setUsingSample(true)
          }
        }
      } catch (err) {
        console.error('Failed to load report:', err)
        const sample = sampleReports.find((r) => r.id === id)
        if (active) {
          if (sample) {
            setReport(sample)
            setStatus(sample.status)
            setUsingSample(true)
          } else {
            setReport(null)
          }
        }
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => {
      active = false
    }
  }, [id])

  async function handleSave() {
    if (!report || usingSample) return
    setSaving(true)
    try {
      await updateIncident(report.id, { status, notes })
      setReport((prev) => (prev ? { ...prev, status, notes } : prev))
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (err) {
      console.error('Failed to update report:', err)
      alert('Could not update the report status.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Loading label="Loading report…" />

  if (!report) {
    return (
      <div className="admin-reports">
        <p className="muted">Report not found.</p>
        <Link to="/admin/reports" className="btn btn--ghost">← Back to reports</Link>
      </div>
    )
  }

  return (
    <div className="admin-report-detail">
      <div className="incident-details__top">
        <button className="btn btn--ghost" onClick={() => navigate('/admin/reports')}>
          ← Back
        </button>
        <h1>Report {report.id}</h1>
        <StatusBadge status={report.status} />
      </div>

      {usingSample && (
        <p className="muted" style={{ margin: '8px 0' }}>
          Showing sample data — changes are not saved in this mode.
        </p>
      )}

      <section className="panel">
        <div className="report-detail__fields">
          <div className="field">
            <span>Waste type</span>
            <div className="report-detail__value">{report.wasteType || report.title || '—'}</div>
          </div>
          <div className="field">
            <span>Reported by</span>
            <div className="report-detail__value">{report.reporterName || '—'}</div>
          </div>
          <div className="field">
            <span>Submitted</span>
            <div className="report-detail__value">{formatDateTime(report.createdAt)}</div>
          </div>
        </div>

        {report.description && (
          <p className="incident-details__desc">{report.description}</p>
        )}
      </section>

      {/* Evidence image */}
      {report.evidenceImages?.length > 0 ? (
        <section className="panel">
          <h3>Evidence image</h3>
          <div className="evidence-grid">
            {report.evidenceImages.map((url, i) => (
              <a key={i} href={url} target="_blank" rel="noreferrer">
                <img src={url} alt={`Evidence ${i + 1}`} className="evidence-grid__img" />
              </a>
            ))}
          </div>
        </section>
      ) : (
        <section className="panel">
          <h3>Evidence image</h3>
          <p className="muted">No evidence image attached.</p>
        </section>
      )}

      {/* Location */}
      <section className="panel">
        <h3>Location</h3>
        {report.location ? (
          <>
            <p className="muted">
              {report.location.lat?.toFixed?.(5)}, {report.location.lng?.toFixed?.(5)}
            </p>
            <IncidentMap incidents={mapIncidents} />
          </>
        ) : (
          <p className="muted">No location provided.</p>
        )}
      </section>

      {/* Status update (authority action) */}
      <section className="panel">
        <h3>Update status</h3>
        <div className="report-detail__actions">
          <label className="field">
            <span>Status</span>
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value)
                setSaved(false)
              }}
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span>Notes (optional)</span>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => {
                setNotes(e.target.value)
                setSaved(false)
              }}
              placeholder="Record verification or action taken."
            />
          </label>
        </div>

        <div className="action-row">
          <Button
            onClick={handleSave}
            disabled={saving || usingSample}
          >
            {saving ? 'Saving…' : 'Save changes'}
          </Button>
          {saved && <p className="form-success">Saved ✓</p>}
        </div>
      </section>
    </div>
  )
}