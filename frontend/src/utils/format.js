// Shared small helpers.

// Render a Firestore timestamp (or ISO string / Date) as a short date.
export function formatDate(value) {
  if (!value) return '—'
  const d = value?.toDate ? value.toDate() : new Date(value)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

// Render a Firestore timestamp as a date + time (for report details).
export function formatDateTime(value) {
  if (!value) return '—'
  const d = value?.toDate ? value.toDate() : new Date(value)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}