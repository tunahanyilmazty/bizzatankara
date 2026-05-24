'use client'

import { useEffect, useRef, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Map({ restaurants }) {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const [reviewModal, setReviewModal] = useState(null)
  const [reviewCounts, setReviewCounts] = useState({})

  useEffect(() => {
    fetchReviewCounts()
  }, [])

  async function fetchReviewCounts() {
    const { data } = await supabase
      .from('reviews')
      .select('restaurant_id')
      .eq('status', 'approved')
    if (!data) return
    const counts = {}
    data.forEach(r => {
      counts[r.restaurant_id] = (counts[r.restaurant_id] || 0) + 1
    })
    setReviewCounts(counts)
  }

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (mapInstanceRef.current) return
    if (!mapRef.current) return

    import('leaflet').then(L => {
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

        const count = reviewCounts[r.id] || 0
        const reviewBtn = count > 0
          ? `<div style="padding:0 12px 12px">
              <button
                onclick="window.openRestaurantReviews(${r.id})"
                style="width:100%;padding:8px;border-radius:8px;border:1.5px solid #E8DDD0;background:none;font-size:0.78rem;cursor:pointer;color:#7A6A5A;font-family:inherit"
              >
                💬 ${count} Yorum Gör
              </button>
             </div>`
          : ''

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
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;padding:0 12px 8px">
            <a href="${r.maps_url}" target="_blank" style="display:flex;align-items:center;justify-content:center;gap:5px;padding:9px 6px;border-radius:8px;font-size:0.75rem;font-weight:500;text-decoration:none;background:#F55D00;color:#fff">
              📍 Konuma Git
            </a>
            <a href="${r.video_url}" target="_blank" style="display:flex;align-items:center;justify-content:center;gap:5px;padding:9px 6px;border-radius:8px;font-size:0.75rem;font-weight:500;text-decoration:none;background:#1A1208;color:#fff">
              ▶ İnceleme
            </a>
          </div>
          ${reviewBtn}
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
  }, [reviewCounts])

  useEffect(() => {
    window.openRestaurantReviews = async (restaurantId) => {
      const restaurant = restaurants.find(r => r.id === restaurantId)
      const { data: reviews } = await supabase
        .from('reviews')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .eq('status', 'approved')
        .order('created_at', { ascending: false })
      setReviewModal({ restaurant, reviews: reviews || [] })
    }
    return () => { delete window.openRestaurantReviews }
  }, [restaurants])

  const colors = ['#F55D00', '#2A7A4A', '#1A6BB5', '#8A4FB5', '#C94A00', '#2A5A7A']

  return (
    <>
      <div ref={mapRef} style={{ width: '100%', height: '600px' }} />

      {reviewModal && (
        <div
          onClick={(e) => { if (e.target === e.currentTarget) setReviewModal(null) }}
          style={{
            position: 'fixed', inset: 0, zIndex: 3000,
            background: 'rgba(26,18,8,0.7)', backdropFilter: 'blur(6px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div style={{
            background: '#fff', borderRadius: '20px',
            width: '100%', maxWidth: '560px',
            maxHeight: '80vh', overflow: 'hidden',
            display: 'flex', flexDirection: 'column',
            boxShadow: '0 32px 80px rgba(0,0,0,0.25)',
          }}>
            <div style={{
              padding: '24px 28px',
              borderBottom: '1px solid #E8DDD0',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              flexShrink: 0,
            }}>
              <div>
                <div style={{ fontSize: '1.4rem', marginBottom: '4px' }}>{reviewModal.restaurant.emoji}</div>
                <div style={{
                  fontFamily: 'var(--font-playfair)',
                  fontSize: '1.2rem', fontWeight: 700, color: '#1A1208',
                }}>
                  {reviewModal.restaurant.name}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#7A6A5A', marginTop: '2px' }}>
                  {reviewModal.restaurant.area} · {reviewModal.reviews.length} yorum
                </div>
              </div>
              <button
                onClick={() => setReviewModal(null)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: '1.2rem', color: '#7A6A5A',
                }}
              >✕</button>
            </div>

            <div style={{ overflowY: 'auto', padding: '24px 28px', flex: 1 }}>
              {reviewModal.reviews.length === 0 ? (
                <div style={{
                  textAlign: 'center', padding: '40px 0',
                  color: '#7A6A5A', fontSize: '0.9rem',
                }}>
                  <div style={{ fontSize: '2rem', marginBottom: '12px' }}>💬</div>
                  Bu mekan için henüz onaylı yorum yok.
                </div>
              ) : reviewModal.reviews.map((rev, i) => (
                <div key={rev.id} style={{
                  padding: '16px 0',
                  borderBottom: i < reviewModal.reviews.length - 1 ? '1px solid #E8DDD0' : 'none',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <div style={{
                        width: '36px', height: '36px', borderRadius: '50%',
                        background: colors[i % colors.length],
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#fff', fontWeight: 600, fontSize: '0.82rem', flexShrink: 0,
                      }}>
                        {rev.user_name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: 500, fontSize: '0.88rem', color: '#1A1208' }}>
                          {rev.user_name}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#7A6A5A' }}>
                          {new Date(rev.created_at).toLocaleDateString('tr-TR', {
                            day: 'numeric', month: 'long', year: 'numeric'
                          })}
                        </div>
                      </div>
                    </div>
                    <div style={{ color: '#F55D00', fontSize: '0.9rem' }}>
                      {'★'.repeat(rev.stars)}{'☆'.repeat(5 - rev.stars)}
                    </div>
                  </div>
                  {rev.text && (
                    <p style={{
                      fontSize: '0.88rem', lineHeight: 1.65,
                      color: '#2D2D2B', marginLeft: '46px',
                    }}>
                      &quot;{rev.text}&quot;
                    </p>
                  )}
                  <div style={{
                    fontSize: '0.7rem', color: '#2A7A4A',
                    marginLeft: '46px', marginTop: '6px',
                  }}>
                    ✓ Onaylı yorum
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}