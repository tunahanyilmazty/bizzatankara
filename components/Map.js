'use client'

import { useEffect, useRef } from 'react'

export default function Map({ restaurants }) {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (mapInstanceRef.current) return
    if (!mapRef.current) return

    import('leaflet').then(L => {
      // Eğer zaten initialize edilmişse atla
      if (mapRef.current._leaflet_id) return

      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      document.head.appendChild(link)

      const map = L.map(mapRef.current, {
        zoomControl: true,
        scrollWheelZoom: false,
      }).setView([39.9150, 32.8400], 13)

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap &copy; CARTO',
        maxZoom: 19,
      }).addTo(map)

      restaurants.forEach(r => {
        const icon = L.divIcon({
          html: `<div style="background:#F55D00;border:2.5px solid #fff;border-radius:50%;width:36px;height:36px;display:flex;align-items:center;justify-content:center;font-size:16px;box-shadow:0 2px 10px rgba(0,0,0,.3);cursor:pointer">${r.emoji}</div>`,
          className: '',
          iconSize: [36, 36],
          iconAnchor: [18, 18],
        })

        const popup = L.popup({
          className: 'custom-popup',
          offset: [0, -10],
          closeButton: false,
        }).setContent(`
          <div style="padding:16px 16px 0;background:#fff">
            <span style="font-size:1.8rem;display:block;margin-bottom:8px">${r.emoji}</span>
            <div style="font-size:1rem;font-weight:600;color:#1A1208">${r.name}</div>
            <div style="font-size:0.75rem;color:#7A6A5A;margin-top:2px">${r.type} · ${r.area}</div>
            <div style="font-size:0.8rem;color:#C94A00;margin-top:6px">${r.rating}</div>
            <p style="font-size:.78rem;color:#7A7A75;margin-top:8px;margin-bottom:14px">${r.description}</p>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;padding:0 12px 10px">
            <a href="${r.maps_url}" target="_blank" style="display:flex;align-items:center;justify-content:center;gap:5px;padding:9px 6px;border-radius:8px;font-size:0.75rem;font-weight:500;text-decoration:none;background:#F55D00;color:#fff">
              📍 Konuma Git
            </a>
            <a href="${r.video_url}" target="_blank" style="display:flex;align-items:center;justify-content:center;gap:5px;padding:9px 6px;border-radius:8px;font-size:0.75rem;font-weight:500;text-decoration:none;background:#1A1208;color:#fff">
              ▶ İnceleme
            </a>
          </div>
        `)

        L.marker([r.lat, r.lng], { icon }).addTo(map).bindPopup(popup)
      })

      mapInstanceRef.current = map
    })

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  return (
    <div
      ref={mapRef}
      style={{ width: '100%', height: '600px' }}
    />
  )
}