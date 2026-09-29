// ReportForm — submit an incident report with title, description, location
// and uploaded evidence images. Called from the ReportPage.

import { useState } from 'react'
import { createIncident } from '../../services/firestoreService'
import { useAuth } from '../../context/AuthContext'
import Button from '../common/Button'
import ImagePreview from './ImagePreview'
import LocationPicker from './LocationPicker'

export default function ReportForm({ initialLocation, onLocation, evidenceImages = [] }) {
  const { user } = useAuth()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState(initialLocation || null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  function handleLocationChange(loc) {
    setLocation(loc)
    onLocation?.(loc)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!title) return setError('A title is required.')
    if (!location) return setError('Pick a location on the map.')

    setBusy(true)
    try {
      await createIncident({
        title,
        description,
        location,
        evidenceImages, // already-uploaded URLs (from the report page)
        reportedBy: user?.uid,
        reporterName: user?.displayName || user?.email || 'anonymous',
      })
      // Reset the form on success.
      setTitle('')
      setDescription('')
      setError('Submitted successfully ✓')
    } catch (err) {
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

      <div className="field">
        <span>Location</span>
        <LocationPicker value={location} onChange={handleLocationChange} />
      </div>

      {error && <p className="form-error">{error}</p>}

      <Button type="submit" disabled={busy}>
        {busy ? 'Submitting…' : 'Submit report'}
      </Button>
    </form>
  )
}