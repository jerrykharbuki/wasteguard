// AI service — talks to the FastAPI backend.
// The frontend sends camera frames here; the backend forwards them to
// the AI module which runs YOLO + ByteTrack + frame analysis.
//
// IMPORTANT: We do NOT send every frame to Firebase. Only the AI backend
// and only selected evidence images are stored.

const BASE_URL = import.meta.env.VITE_BACKEND_URL || '/api'

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(text || `Request to ${path} failed (${res.status})`)
  }
  return res.json()
}

// Start a detection session for a given camera/session id.
export function startSession(sessionId) {
  return request('/camera/start', {
    method: 'POST',
    body: JSON.stringify({ session_id: sessionId }),
  })
}

// Stop a detection session.
export function stopSession(sessionId) {
  return request('/camera/stop', {
    method: 'POST',
    body: JSON.stringify({ session_id: sessionId }),
  })
}

// Send a single video frame (base64 jpeg) and get detection results back.
export async function analyzeFrame(sessionId, base64Jpeg) {
  const res = await fetch(`${BASE_URL}/frames`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ session_id: sessionId, frame: base64Jpeg }),
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(text || `Frame analysis failed (${res.status})`)
  }
  return res.json()
}

// Ask the backend to capture current evidence for a session.
export function captureEvidence(sessionId, metadata = {}) {
  return request('/evidence', {
    method: 'POST',
    body: JSON.stringify({ session_id: sessionId, metadata }),
  })
}