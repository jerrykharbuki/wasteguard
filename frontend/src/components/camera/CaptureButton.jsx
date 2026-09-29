// CaptureButton — captures an evidence frame from the current video.
// onCapture receives the JPEG { blob, url } captured by useCamera.

import Button from '../common/Button'

export default function CaptureButton({ onCapture, captureFrame, disabled = false }) {
  async function handleClick() {
    const frame = await captureFrame()
    if (frame) onCapture?.(frame)
  }

  return (
    <Button variant="danger" disabled={disabled} onClick={handleClick}>
      📸 Capture evidence
    </Button>
  )
}