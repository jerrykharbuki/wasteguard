// LocationPicker — Leaflet + OpenStreetMap click-to-pick location.
// Also a "Use GPS" button to grab the browser's geolocation.

import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

export default function LocationPicker({ value, onChange }) {
  const mapElRef = useRef(null)
  const mapRef = useRef(null)
  const markerRef = useRef(null)
  const [gpsBusy, setGpsBusy] = useState(false)
  const [gpsError, setGpsError] = useState('')

  // Initialise the map once.
  useEffect(() => {
    if (!mapElRef.current || mapRef.current) return

    const map = L.map(mapElRef.current).setView([14.6, 121.0], 12) // default: Metro Manila
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map)

    map.on('click', (e) => {
      const loc = { lat: e.latlng.lat, lng: e.latlng.lng }
      setMarker(map, loc)
      onChange?.(loc)
    })

    mapRef.current = map
    return () => {
      map.remove()
      mapRef.current = null
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function setMarker(map, loc) {
    if (markerRef.current) markerRef.current.remove()
    markerRef.current = L.marker([loc.lat, loc.lng]).addTo(map)
  }

  function enableLocation() {
    if (!navigator.geolocation) {
      setGpsError('Location is not supported by this browser.')
      return
    }
    setGpsBusy(true)
    setGpsError('')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude }
        if (mapRef.current) {
          mapRef.current.setView([loc.lat, loc.lng], 16)
          setMarker(mapRef.current, loc)
        }
        onChange?.(loc)
        setGpsBusy(false)
      }, (error) => {
        setGpsError(
          error.code === error.PERMISSION_DENIED
            ? 'Location access was denied. Allow it in your browser settings and try again.'
            : 'Could not get your location. Check your device settings or click on the map.'
        )
        setGpsBusy(false)
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  return (
    <div className="location-picker">
      <div className="location-picker__toolbar">
        <button type="button" className="btn btn--outline" onClick={enableLocation} disabled={gpsBusy}>
          {gpsBusy ? 'Getting location…' : 'Enable live location'}
        </button>
        {value && (
          <span className="location-picker__coords">
            {value.lat.toFixed(5)}, {value.lng.toFixed(5)}
          </span>
        )}
      </div>
      {gpsError && <p className="form-error">{gpsError}</p>}
      <div ref={mapElRef} className="location-picker__map" />
    </div>
  )
}