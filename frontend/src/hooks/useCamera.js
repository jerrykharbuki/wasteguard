// useCamera — wrap the browser getUserMedia API so components can
// easily start/stop the camera and grab frames.
// Provides: { stream, error, isOn, start, stop, captureFrame }
//  - start(): requests camera permission and opens the stream
//  - stop(): stops the stream
//  - captureFrame(): returns a { blob, url } JPEG snapshot of the video

import { useRef, useState, useCallback } from 'react'

export default function useCamera() {
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const [stream, setStream] = useState(null)
  const [error, setError] = useState(null)
  const [isOn, setIsOn] = useState(false)

  const start = useCallback(async (facingMode = 'environment') => {
    setError(null)
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode }, // 'environment' = rear camera on phones
        audio: false,
      })
      streamRef.current = mediaStream
      setStream(mediaStream)
      setIsOn(true)
      return mediaStream
    } catch (err) {
      setError(err.message || 'Camera permission denied')
      return null
    }
  }, [])

  const stop = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
    setStream(null)
    setIsOn(false)
    if (videoRef.current) videoRef.current.srcObject = null
  }, [])

  // Draw the current video frame to a canvas and return a JPEG Blob + URL.
  const captureFrame = useCallback(() => {
    const video = videoRef.current
    if (!video || video.readyState < 2) return null
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth || 640
    canvas.height = video.videoHeight || 480
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height)
    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) return resolve(null)
          resolve({ blob, url: URL.createObjectURL(blob) })
        },
        'image/jpeg',
        0.8
      )
    })
  }, [])

  return { videoRef, stream, error, isOn, start, stop, captureFrame }
}