// components/StatCard.jsx — a single statistic card.
// Used on the dashboard to show counts (total, pending, resolved, rejected).
// The `tone` prop picks a colour for the value.

export default function StatCard({ label, value, tone = 'default' }) {
  return (
    <div className={`stat-card stat-card--${tone}`}>
      <div className="stat-card__value">{value}</div>
      <div className="stat-card__label">{label}</div>
    </div>
  )
}