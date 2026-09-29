// StatusBadge — colored badge for an incident's status.
// pending -> verified -> resolved
// (Cleanup / fine actions are recorded separately as notes in details.)

const STATUS_STYLES = {
  pending: { label: 'Pending', className: 'status--pending' },
  verified: { label: 'Verified', className: 'status--verified' },
  resolved: { label: 'Resolved', className: 'status--resolved' },
}

export default function StatusBadge({ status }) {
  const s = STATUS_STYLES[status] || { label: status || 'Unknown', className: '' }
  return <span className={`status-badge ${s.className}`}>{s.label}</span>
}