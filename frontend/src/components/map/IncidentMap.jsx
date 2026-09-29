// IncidentMap — Leaflet map showing all incidents as markers.
// Clicking a marker can call onSelect with that incident.

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Default marker icon (Leaflet's default icon paths break under bundlers).
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})
L.Marker.prototype.options.icon = defaultIcon

export default function IncidentMap({ incidents = [], onSelect }) {
  const mapElRef = useRef(null)
  const mapRef = useRef(null)
  const markersRef = useRef([])

  useEffect(() => {
    if (!mapElRef.current || mapRef.current) return
    const map = L.map(mapElRef.current).setView([14.6, 121.0], 11)
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map)
    mapRef.current = map
    return () => {
      map.remove()
      mapRef.current = null
      markersRef.current = []
    }
  }, [])

  // Update markers whenever incidents change.
  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    markersRef.current.forEach((m) => m.remove())
    markersRef.current = []

    incidents
      .filter((i) => i.location && i.location.lat != null && i.location.lng != null)
      .forEach((i) => {
        const marker = L.marker([i.location.lat, i.location.lng])
          .addTo(map)
          .bindPopup(`<strong>${i.title || 'Incident'}</strong><br/>Status: ${i.status || 'pending'}`)
        marker.on('click', () => onSelect?.(i))
        markersRef.current.push(marker)
      })
  }, [incidents, onSelect])

  return <div ref={mapElRef} className="incident-map" />
}