// StatusBadge — colored badge for a report's status.
// status values: pending | verified | resolved | rejected

const STATUS_STYLES = {
  pending: { label: 'Pending', className: 'status--pending' },
  verified: { label: 'Verified', className: 'status--verified' },
  resolved: { label: 'Resolved', className: 'status--resolved' },
  rejected: { label: 'Rejected', className: 'status--rejected' },
}

export default function StatusBadge({ status }) {
  const s = STATUS_STYLES[status] || { label: status || 'Unknown', className: '' }
  return <span className={`status-badge ${s.className}`}>{s.label}</span>
}