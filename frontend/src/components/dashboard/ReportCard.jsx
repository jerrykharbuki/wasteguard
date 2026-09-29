// ReportCard — a single report card (title, status, time, preview).

import StatusBadge from '../admin/StatusBadge'

// Helper: render a Firestore timestamp (or ISO string) as a short date.
function formatDate(value) {
  if (!value) return '—'
  const d = value?.toDate ? value.toDate() : new Date(value)
  return d.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export default function ReportCard({ report }) {
  const thumb = report?.evidenceImages?.[0]

  return (
    <article className="report-card">
      {thumb && (
        <div className="report-card__thumb">
          <img src={thumb} alt="Evidence" />
        </div>
      )}
      <div className="report-card__body">
        <h3 title={report.title}>{report.title}</h3>
        <p className="report-card__meta">
          {formatDate(report.createdAt)} ·{' '}
          {report.location?.lat?.toFixed?.(4)},{' '}
          {report.location?.lng?.toFixed?.(4)}
        </p>
        <StatusBadge status={report.status} />
      </div>
    </article>
  )
}