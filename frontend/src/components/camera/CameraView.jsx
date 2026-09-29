// CameraView — shows the live camera feed.
// Uses the useCamera hook's video ref. Attach the stream to the <video>.

import { useEffect } from 'react'

export default function CameraView({ videoRef, stream }) {
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream
    }
  }, [videoRef, stream])

  return (
    <div className="camera-view">
      <video
        ref={videoRef}
        className="camera-view__video"
        playsInline
        autoPlay
        muted
      />
      {!stream && <p className="camera-view__placeholder">Camera preview</p>}
    </div>
  )
}