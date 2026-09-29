// ReportPage — live detection + capture + report submission.
// Flow:
//   1. Start camera
//   2. Start AI detection (calls aiService → FastAPI)
//   3. Capture evidence image(s) → upload to Firebase Storage via storageService
//   4. Fill ReportForm → submit to Firestore via firestoreService

import { useState, useEffect, useRef } from 'react'
import useCamera from '../hooks/useCamera'
import { useAuth } from '../context/AuthContext'
import CameraView from '../components/camera/CameraView'
import DetectionStatus from '../components/camera/DetectionStatus'
import CaptureButton from '../components/camera/CaptureButton'
import ReportForm from '../components/reporting/ReportForm'
import Button from '../components/common/Button'
import {
  startSession,
  stopSession,
  analyzeFrame,
} from '../services/aiService'
import { uploadEvidence } from '../services/storageService'

export default function ReportPage() {
  const { user } = useAuth()
  const camera = useCamera()
  const sessionIdRef = useRef(`session-${Date.now()}`)

  const [detecting, setDetecting] = useState(false)
  const [status, setStatus] = useState('idle') // idle | detecting | suspect
  const [statusDetail, setStatusDetail] = useState('')
  const [evidenceUrls, setEvidenceUrls] = useState([])
  const [location, setLocation] = useState(null)

  // Stop camera/session on unmount.
  useEffect(() => () => camera.stop(), [camera])

  async function handleStart() {
    // 1. Request camera permission.
    const stream = await camera.start('environment')
    if (!stream) return
    // 3. Tell the backend to start a detection session.
    try {
      await startSession(sessionIdRef.current)
      setDetecting(true)
      setStatus('detecting')
    } catch (err) {
      console.error('Failed to start session:', err)
      setStatusDetail('Could not connect to AI backend.')
    }
  }

  async function handleStop() {
    setDetecting(false)
    setStatus('idle')
    setStatusDetail('')
    try {
      await stopSession(sessionIdRef.current)
    } catch (err) {
      console.error('Failed to stop session:', err)
    }
    camera.stop()
  }

  // Simple loop that sends frames to the AI backend while detecting.
  useEffect(() => {
    if (!detecting) return
    let cancelled = false
    const tick = async () => {
      if (cancelled) return
      const frame = await camera.captureFrame()
      if (!frame) return setTimeout(tick, 500)
      try {
        const res = await analyzeFrame(sessionIdRef.current, await blobToBase64(frame.blob))
        if (!cancelled && res) {
          const suspect = res.suspicious === true
          setStatus(suspect ? 'suspect' : 'detecting')
          setStatusDetail(
            res.detections?.length
              ? `${res.detections.length} object(s) detected`
              : ''
          )
        }
      } catch (err) {
        if (!cancelled) setStatusDetail('AI analysis unavailable.')
      }
      // Rate-limit: don't flood the backend.
      setTimeout(tick, 800)
    }
    tick()
    return () => {
      cancelled = true
    }
  }, [detecting, camera])

  // Upload a captured evidence frame to Firebase Storage and remember its URL.
  async function handleCapture(frame) {
    try {
      const url = await uploadEvidence(frame.blob, {
        userId: user?.uid,
      })
      setEvidenceUrls((prev) => [...prev, url])
    } catch (err) {
      console.error('Failed to upload evidence:', err)
      alert('Could not upload evidence image.')
    }
  }

  return (
    <div className="report-page">
      <section className="panel">
        <div className="panel__header">
          <h2>Live detection</h2>
          <DetectionStatus status={status} detail={statusDetail} />
        </div>

        <CameraView videoRef={camera.videoRef} stream={camera.stream} />

        <div className="action-row">
          {!detecting ? (
            <Button onClick={handleStart}>▶ Start camera</Button>
          ) : (
            <>
              <CaptureButton
                onCapture={handleCapture}
                captureFrame={camera.captureFrame}
              />
              <Button variant="ghost" onClick={handleStop}>■ Stop</Button>
            </>
          )}
        </div>
        {camera.error && <p className="form-error">{camera.error}</p>}
      </section>

      <section className="panel">
        <div className="panel__header">
          <h2>Submit report</h2>
        </div>
        {/* Location captured by the form's map; evidence URLs passed along. */}
        <ReportForm initialLocation={location} onLocation={setLocation} evidenceImages={evidenceUrls} />
      </section>
    </div>
  )
}

// Convert a Blob to a base64 data string for sending to the backend.
function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result) // "data:image/jpeg;base64,..."
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}