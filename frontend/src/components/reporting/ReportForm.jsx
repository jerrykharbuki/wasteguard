// ReportForm — submit an incident report with title, description, location
// and uploaded evidence images. Called from the ReportPage.

import { useState } from 'react'
import { createIncident } from '../../services/firestoreService'
import { useAuth } from '../../context/AuthContext'
import Button from '../common/Button'
import ImagePreview from './ImagePreview'

const WHATSAPP_RECIPIENT = '918575207086'

export default function ReportForm({ location, evidenceImages = [] }) {
  const { user } = useAuth()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [whatsAppUrl, setWhatsAppUrl] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!title) return setError('A title is required.')
    if (!location) return setError('Pick a location on the map.')

    const whatsAppWindow = window.open('about:blank', '_blank')
    setBusy(true)
    try {
      const reportId = await createIncident({
        title,
        description,
        location,
        evidenceImages, // already-uploaded URLs (from the report page)
        ...(user?.uid ? { reportedBy: user.uid } : {}),
        reporterName: user?.displayName || user?.email || 'anonymous',
      })
      const message = [
        'WasteGuard AI incident report',
        `Report ID: ${reportId}`,
        `Title: ${title}`,
        `Description: ${description || 'Not provided'}`,
        `Location: https://maps.google.com/?q=${location.lat},${location.lng}`,
        ...evidenceImages.map((url, index) => `Evidence ${index + 1}: ${url}`),
      ].join('\n')
      const url = `https://wa.me/${WHATSAPP_RECIPIENT}?${new URLSearchParams({ text: message })}`
      setWhatsAppUrl(url)
      if (whatsAppWindow) {
        whatsAppWindow.opener = null
        whatsAppWindow.location.href = url
      }
      // Reset the form on success.
      setTitle('')
      setDescription('')
      setError('Report saved. Review the message and tap Send in WhatsApp.')
    } catch (err) {
      whatsAppWindow?.close()
      setError(err.message || 'Failed to submit report.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <form className="report-form" onSubmit={handleSubmit}>
      <label className="field">
        <span>Title</span>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Dumping near riverbank"
        />
      </label>

      <label className="field">
        <span>Description</span>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          placeholder="What did the evidence show?"
        />
      </label>

      {evidenceImages.length > 0 && (
        <div className="field">
          <span>Evidence</span>
          <div className="preview-row">
            {evidenceImages.map((url, i) => (
              <ImagePreview key={i} src={url} />
            ))}
          </div>
        </div>
      )}

      <p className="muted">
        {location
          ? `Location selected: ${location.lat.toFixed(5)}, ${location.lng.toFixed(5)}`
          : 'Select an incident location above before submitting.'}
      </p>

      {error && <p className="form-error">{error}</p>}

      <Button type="submit" disabled={busy}>
        {busy ? 'Submitting…' : 'Submit report'}
      </Button>
      {whatsAppUrl && (
        <a
          href={whatsAppUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn--outline"
        >
          Open WhatsApp message
        </a>
      )}
    </form>
  )
}