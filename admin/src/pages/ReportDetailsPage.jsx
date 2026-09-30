// pages/ReportDetailsPage.jsx — full detail view of a single report.
// Reached at /admin/reports/:id. Shows all fields, an optional Leaflet
// map of the location, and lets the admin update the report status.

import { useEffect, useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getReport, updateReportStatus } from '../services/reportService'
import { sampleReports } from '../services/sampleData'
import { formatDateTime } from '../utils/format'
import LocationMap from '../components/LocationMap'
import { StatusPill } from '../components/ReportsTable'

const STATUS_OPTIONS = ['pending', 'resolved', 'rejected']

export default function ReportDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [usingSample, setUsingSample] = useState(false)

  const [status, setStatus] = useState('pending')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const mapPoint = useMemo(
    () => (report?.location ? [report.location.lat, report.location.lng] : null),
    [report]
  )

  useEffect(() => {
    let active = true
    async function load() {
      try {
        const data = await getReport(id)
        if (!active) return
        if (data) {
          setReport(data)
          setStatus(data.status || 'pending')
          setNotes(data.notes || '')
        } else {
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
    setMessage('')
    try {
      await updateReportStatus(report.id, { status, notes })
      setReport((prev) => (prev ? { ...prev, status, notes } : prev))
      setMessage('Status updated ✓')
    } catch (err) {
      console.error('Failed to update report:', err)
      setMessage('Could not update the report status.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="page-placeholder">Loading report…</div>

  if (!report) {
    return (
      <div>
        <p className="muted">Report not found.</p>
        <button className="btn btn--ghost" onClick={() => navigate('/admin/reports')}>
          ← Back to reports
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="detail-top">
        <button className="btn btn--ghost" onClick={() => navigate('/admin/reports')}>
          ← Back
        </button>
        <h2 className="page-title">Report {report.id}</h2>
        <StatusPill status={report.status} />
      </div>

      {usingSample && (
        <p className="muted" style={{ margin: '8px 0' }}>
          Showing sample data — changes are not saved.
        </p>
      )}

      <div className="detail-grid">
        <div className="panel">
          <h3>Report details</h3>
          <div className="detail-fields">
            <Field label="Report ID" value={report.id} />
            <Field label="Waste type" value={report.wasteType || report.title || '—'} />
            <Field label="Reported by" value={report.reporterName || '—'} />
            <Field label="Submitted" value={formatDateTime(report.createdAt)} />
            <Field label="Status" value={report.status} />
            <Field
              label="Description"
              value={report.description || 'No description provided.'}
            />
          </div>
        </div>

        <div className="panel">
          <h3>Location</h3>
          {report.location ? (
            <>
              <p className="muted">
                {report.location.lat?.toFixed?.(5)}, {report.location.lng?.toFixed?.(5)}
              </p>
              <LocationMap point={mapPoint} />
              <a
                className="btn btn--outline btn--small"
                style={{ marginTop: 10 }}
                href={`https://www.openstreetmap.org/?mlat=${report.location.lat}&mlon=${report.location.lng}#map=17/${report.location.lat}/${report.location.lng}`}
                target="_blank"
                rel="noreferrer"
              >
                Open in OpenStreetMap ↗
              </a>
            </>
          ) : (
            <p className="muted">No location provided.</p>
          )}
        </div>
      </div>

      <div className="panel">
        <h3>Evidence</h3>
        {report.evidenceImages?.length > 0 ? (
          <div className="evidence-grid">
            {report.evidenceImages.map((url, i) => (
              <a key={i} href={url} target="_blank" rel="noreferrer" className="evidence-item">
                <img src={url} alt={`Evidence ${i + 1}`} />
              </a>
            ))}
          </div>
        ) : (
          <p className="muted">No evidence image attached.</p>
        )}
      </div>

      <div className="panel">
        <h3>Update status</h3>
        <div className="detail-actions">
          <label className="field">
            <span>Status</span>
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value)
                setMessage('')
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
                setMessage('')
              }}
              placeholder="Verification notes or action taken."
            />
          </label>
        </div>

        <button
          className="btn btn--primary"
          onClick={handleSave}
          disabled={saving || usingSample}
        >
          {saving ? 'Saving…' : 'Save changes'}
        </button>
        {message && <p className="form-error" style={{ marginTop: 10 }}>{message}</p>}
      </div>
    </div>
  )
}

// Tiny labelled field helper.
function Field({ label, value }) {
  return (
    <div className="detail-field">
      <span className="detail-field__label">{label}</span>
      <span className="detail-field__value">{value}</span>
    </div>
  )
}