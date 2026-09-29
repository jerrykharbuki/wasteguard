// Firestore (Cloud Firestore) operations.
// Handle incident reports and users here.

import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  query,
  orderBy,
  where,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from './firebase'

// --- Incident reports ---

// Create a new incident report.
// incident = { title, description, location, evidenceImages, detectionData, reportedBy }
export async function createIncident(incident) {
  const ref = await addDoc(collection(db, 'incidents'), {
    ...incident,
    status: 'pending', // pending -> verified -> resolved (see StatusBadge)
    createdAt: serverTimestamp(),
  })
  return ref.id
}

// Get incidents, optionally filtered to a single reporter.
export async function getIncidents({ userId } = {}) {
  let q = query(collection(db, 'incidents'), orderBy('createdAt', 'desc'))
  if (userId) {
    q = query(
      collection(db, 'incidents'),
      where('reportedBy', '==', userId),
      orderBy('createdAt', 'desc')
    )
  }
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

// Get a single incident by id.
export async function getIncident(id) {
  const snap = await getDoc(doc(db, 'incidents', id))
  return snap.exists() ? { id: snap.id, ...snap.data() } : null
}

// Update an incident (used by authorities to set status / add notes).
export async function updateIncident(id, updates) {
  await updateDoc(doc(db, 'incidents', id), {
    ...updates,
    updatedAt: serverTimestamp(),
  })
}

// --- Users ---
// getUserProfile is already provided in authService; this is a thin
// convenience for when you only need the role.
export { getUserProfile as getProfile } from './authService'