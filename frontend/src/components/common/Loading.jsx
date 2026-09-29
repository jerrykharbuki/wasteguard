// Loading — full-area or inline loading spinner.

export default function Loading({ label = 'Loading…' }) {
  return (
    <div className="loading" role="status">
      <span className="loading__spinner" aria-hidden="true" />
      <span className="loading__label">{label}</span>
    </div>
  )
}