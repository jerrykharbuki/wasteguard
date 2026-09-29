// DetectionStatus — small indicator of what the AI mode sees.
// Variants: idle, detecting, suspect.
// The AI returns object detections; "suspect" is set by frame analysis in
// the backend. It is NOT proof — just a flag to review.

export default function DetectionStatus({ status = 'idle', detail }) {
  const map = {
    idle: { label: 'Not detecting', tone: 'muted' },
    detecting: { label: 'Detecting…', tone: 'detecting' },
    suspect: { label: '⚠ Suspected activity', tone: 'suspect' },
  }
  const current = map[status] || map.idle

  return (
    <div className={`detection-status detection-status--${current.tone}`}>
      <span className="detection-status__dot" />
      <div>
        <p className="detection-status__label">{current.label}</p>
        {detail && <p className="detection-status__detail">{detail}</p>}
      </div>
    </div>
  )
}