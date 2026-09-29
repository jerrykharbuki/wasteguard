// RecentReports — renders a grid of the user's recent ReportCards,
// or an empty state.

import ReportCard from './ReportCard'

export default function RecentReports({ reports = [] }) {
  if (reports.length === 0) {
    return <p className="muted">You haven’t submitted any reports yet.</p>
  }
  return (
    <div className="report-grid">
      {reports.map((report) => (
        <ReportCard key={report.id} report={report} />
      ))}
    </div>
  )
}