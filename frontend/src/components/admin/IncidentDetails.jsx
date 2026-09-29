// IncidentDetails — full detail view for an authority to review one
// incident: evidence images, detection data, location, and a form to
// update status and record notes (e.g. cleanup / fine after verification).

import { useState } from 'react'
import { updateIncident } from '../../services/firestoreService'
import StatusBadge from './StatusBadge'
import Button from '../common/Button'

export default function IncidentDetails({ incident, onBack, onUpdated }) {
  const [status, setStatus] = useState(incident.status || 'pending')
  const [notes, setNotes] = useState(incident.notes || '')
  const [busy, setBusy] = useState(false)
  const [saved, setSaved] = useState(false)

  if (!incident) return <Button variant="ghost" onClick={onBack}>← Back</Button>

  async function handleSave() {
    setBusy(true)
    try {
      await updateIncident(incident.id, { status, notes })
      setSaved(true)
      onUpdated?.(incident.id, { status, notes })
      setTimeout(() => setSaved(false), 2000)
    } catch (err) {
      console.error('Failed to update incident:', err)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="incident-details">
      <div className="incident-details__top">
        <Button variant="ghost" onClick={onBack}>← Back</Button>
        <h2>{incident.title || 'Untitled incident'}</h2>
        <StatusBadge status={incident.status} />
      </div>

      <p className="incident-details__meta">
        Reported by <strong>{incident.reporterName || '—'}</strong> ·{' '}
        {incident.location
          ? `${incident.location.lat?.toFixed?.(5) ?? '?'}, ${incident.location.lng?.toFixed?.(5) ?? '?'}`
          : 'No location'}
      </p>

      {incident.description && (
        <p className="incident-details__desc">{incident.description}</p>
      )}

      {/* Evidence images */}
      {incident.evidenceImages?.length > 0 && (
        <section className="panel">
          <h3>Evidence</h3>
          <div className="evidence-grid">
            {incident.evidenceImages.map((url, i) => (
              <a key={i} href={url} target="_blank" rel="noreferrer">
                <img src={url} alt={`Evidence ${i + 1}`} className="evidence-grid__img" />
              </a>
            ))}
          </div>
        </section>
      )}

      {/* AI detection data (for transparency — not proof) */}
      {incident.detectionData && (
        <section className="panel">
          <h3>AI detection data</h3>
          <pre className="code-block">{JSON.stringify(incident.detectionData, null, 2)}</pre>
          <p className="muted">
            ⚠ AI detections are suspected incidents, not proof. Verify before acting.
          </p>
        </section>
      )}

      {/* Authority actions */}
      <section className="panel">
        <h3>Review &amp; action</h3>
        <div className="field">
          <span>Status</span>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="pending">Pending review</option>
            <option value="verified">Verified</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
        <div className="field">
          <span>Notes (cleanup / fines after verification)</span>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Record cleanup actions, responsible party, or fine — only after verification and where legally authorized."
          />
        </div>
        {saved && <p className="form-success">Saved ✓</p>}
        <Button onClick={handleSave} disabled={busy}>
          {busy ? 'Saving…' : 'Save review'}
        </Button>
      </section>
    </div>
  )
}