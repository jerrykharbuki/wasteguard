// components/ReportsTable.jsx — displays all reports in a table.
// Columns: Report ID, Waste type, Location, Date, Status.
// Rows link to the report details page.

import { Link } from 'react-router-dom'
import { formatDate } from '../utils/format'

export default function ReportsTable({ reports = [] }) {
  return (
    <div className="table-wrap">
      <table className="reports-table">
        <thead>
          <tr>
            <th>Report ID</th>
            <th>Waste type</th>
            <th>Location</th>
            <th>Date</th>
            <th>Status</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {reports.map((report) => (
            <tr key={report.id}>
              <td className="reports-table__id">{report.id}</td>
              <td>{report.wasteType || report.title || 'Not specified'}</td>
              <td>
                {report.location
                  ? `${report.location.lat?.toFixed?.(4) ?? '?'}, ${report.location.lng?.toFixed?.(4) ?? '?'}`
                  : '—'}
              </td>
              <td>{formatDate(report.createdAt)}</td>
              <td><StatusPill status={report.status} /></td>
              <td>
                <Link to={`/admin/reports/${report.id}`} className="btn btn--small">
                  View →
                </Link>
              </td>
            </tr>
          ))}
          {reports.length === 0 && (
            <tr>
              <td colSpan="6" className="muted">No reports found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

// Small coloured pill shared by the table.
export function StatusPill({ status }) {
  const label = status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown'
  return <span className={`status-pill status-pill--${status || 'unknown'}`}>{label}</span>
}