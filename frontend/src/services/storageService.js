// Firebase Storage — evidence image upload.

import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage } from './firebase'

// Upload a file (Blob / File / Uint8Array) to Firebase Storage under
// the given path (e.g. 'evidence/<userId>/xxxx.jpg') and return its
// public download URL.
// Only evidence images get uploaded here — never the full frame stream.
export async function uploadEvidence(file, { userId, fileName }) {
  const safeName = fileName || `${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`
  const storageRef = ref(storage, `evidence/${userId || 'anonymous'}/${safeName}`)
  const snap = await uploadBytes(storageRef, file)
  const url = await getDownloadURL(snap.ref)
  return url
}