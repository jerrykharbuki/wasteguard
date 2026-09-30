// components/LocationMap.jsx — shows a single point on a Leaflet +
// OpenStreetMap map. Used on the report details page.
// `point` is [lat, lng].

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Leaflet's default marker icon paths break under bundlers, so we pin it.
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})
L.Marker.prototype.options.icon = defaultIcon

export default function LocationMap({ point }) {
  const el = useRef(null)
  const map = useRef(null)

  useEffect(() => {
    if (!el.current || map.current) return
    map.current = L.map(el.current).setView(
      point && point.length === 2 ? point : [14.6, 121.0],
      15
    )
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map.current)

    if (point && point.length === 2) {
      L.marker(point).addTo(map.current)
    }

    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <div ref={el} className="location-map" />
}