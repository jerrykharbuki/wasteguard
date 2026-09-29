// IncidentTable — a table of all incidents for authorities.
// Rows are clickable to open IncidentDetails.

import StatusBadge from './StatusBadge'

function formatDate(value) {
  if (!value) return '—'
  const d = value?.toDate ? value.toDate() : new Date(value)
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

export default function IncidentTable({ incidents = [], onSelect }) {
  return (
    <div className="table-wrap">
      <table className="incident-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Reporter</th>
            <th>Location</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {incidents.map((incident) => (
            <tr
              key={incident.id}
              onClick={() => onSelect?.(incident)}
              className="incident-table__row"
            >
              <td>{incident.title || 'Untitled'}</td>
              <td>{incident.reporterName || '—'}</td>
              <td>
                {incident.location
                  ? `${incident.location.lat?.toFixed?.(4) ?? '?'}, ${incident.location.lng?.toFixed?.(4) ?? '?'}`
                  : '—'}
              </td>
              <td>{formatDate(incident.createdAt)}</td>
              <td><StatusBadge status={incident.status} /></td>
            </tr>
          ))}
          {incidents.length === 0 && (
            <tr>
              <td colSpan="5" className="muted">No incidents yet.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}