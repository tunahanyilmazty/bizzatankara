'use client'

import { useEffect, useRef, useState } from 'react'
import { supabase } from '../lib/supabase'

function useFavorites() {
  const [favorites, setFavorites] = useState(new Set())
  const [user, setUser] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) loadFavorites(session.user.id)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) loadFavorites(session.user.id)
      else setFavorites(new Set())
    })

    return () => subscription.unsubscribe()
  }, [])

  async function loadFavorites(userId) {
    const { data } = await supabase
      .from('favorites')
      .select('restaurant_id')
      .eq('user_id', userId)
    if (data) setFavorites(new Set(data.map(f => f.restaurant_id)))
  }

  async function toggleFavorite(restaurantId) {
    if (!user) return false
    if (favorites.has(restaurantId)) {
      await supabase.from('favorites').delete()
        .eq('user_id', user.id)
        .eq('restaurant_id', restaurantId)
      setFavorites(prev => {
        const next = new Set(prev)
        next.delete(restaurantId)
        return next
      })
    } else {
      await supabase.from('favorites').insert({
        user_id: user.id,
        restaurant_id: restaurantId,
      })
      setFavorites(prev => new Set([...prev, restaurantId]))
    }
    return true
  }

  return { favorites, toggleFavorite, user }
}

export default function Map({ restaurants }) {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const [reviewModal, setReviewModal] = useState(null)
  const [reviewCounts, setReviewCounts] = useState({})
  const [locating, setLocating] = useState(false)
  const [located, setLocated] = useState(false)
  const [sortedRestaurants, setSortedRestaurants] = useState(restaurants)
  const [activeId, setActiveId] = useState(null)
  const [activeTag, setActiveTag] = useState('hepsi')
  const userMarkerRef = useRef(null)
  const { favorites, toggleFavorite, user } = useFavorites()

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

  function calcDist(lat1, lng1, lat2, lng2) {
    const R = 6371000
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLng = (lng2 - lng1) * Math.PI / 180
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  }

  function fmtDist(m) {
    return m < 1000 ? Math.round(m) + ' m' : (m / 1000).toFixed(1) + ' km'
  }

  function getFiltered(list) {
    if (activeTag === 'favoriler') return list.filter(r => favorites.has(r.id))
    if (activeTag === 'hepsi') return list
    return list.filter(r => r.tags?.includes(activeTag))
  }

  function locateUser() {
    if (!navigator.geolocation) { alert('Tarayıcınız konum desteklemiyor.'); return }
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude: lat, longitude: lng } = pos.coords
        const map = mapInstanceRef.current
        if (!map) return

        import('leaflet').then(L => {
          if (userMarkerRef.current) map.removeLayer(userMarkerRef.current)
          const icon = L.divIcon({
            html: `<div style="width:16px;height:16px;border-radius:50%;background:#F55D00;border:3px solid #fff;box-shadow:0 0 0 4px rgba(245,93,0,0.25)"></div>`,
            className: '', iconSize: [16, 16], iconAnchor: [8, 8],
          })
          userMarkerRef.current = L.marker([lat, lng], { icon }).addTo(map)
          userMarkerRef.current.bindTooltip('📍 Buradasın', { permanent: false, direction: 'top' })
          map.setView([lat, lng], 16, { animate: true })
        })

        const withDist = [...restaurants].map(r => ({
          ...r,
          distance: calcDist(lat, lng, r.lat, r.lng)
        })).sort((a, b) => a.distance - b.distance)

        setSortedRestaurants(withDist)
        setLocating(false)
        setLocated(true)
        setActiveTag('hepsi')
      },
      err => {
        setLocating(false)
        if (err.code === 1) alert('Konum izni verilmedi.')
        else alert('Konum alınamadı, tekrar dene.')
      },
      { timeout: 10000, enableHighAccuracy: true }
    )
  }

  function selectRestaurant(r) {
    setActiveId(r.id)
    const map = mapInstanceRef.current
    if (map) {
      map.setView([r.lat, r.lng], 15, { animate: true })
      setTimeout(() => {
        if (window._markers && window._markers[r.id]) {
          window._markers[r.id].openPopup()
        }
      }, 400)
    }
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

      window._markers = {}

      restaurants.forEach(r => {
        const icon = L.divIcon({
          html: `<div style="background:#F55D00;border:2.5px solid #fff;border-radius:50%;width:36px;height:36px;display:flex;align-items:center;justify-content:center;font-size:16px;box-shadow:0 2px 10px rgba(0,0,0,.3);cursor:pointer">${r.emoji}</div>`,
          className: '', iconSize: [36, 36], iconAnchor: [18, 18],
        })

        const count = reviewCounts[r.id] || 0
        const reviewBtn = count > 0
          ? `<div style="padding:0 12px 12px"><button onclick="window.openRestaurantReviews(${r.id})" style="width:100%;padding:8px;border-radius:8px;border:1.5px solid #E8DDD0;background:none;font-size:0.78rem;cursor:pointer;color:#7A6A5A;font-family:inherit">💬 ${count} Yorum Gör</button></div>`
          : ''

        const popup = L.popup({
          className: 'custom-popup', offset: [0, -10], closeButton: false,
        }).setContent(`
          <div style="padding:16px 16px 0;background:#fff">
            <span style="font-size:1.8rem;display:block;margin-bottom:8px">${r.emoji}</span>
            <div style="font-size:1rem;font-weight:600;color:#1A1208">${r.name}</div>
            <div style="font-size:0.75rem;color:#7A6A5A;margin-top:2px">${r.type} · ${r.area}</div>
            <div style="font-size:0.8rem;color:#C94A00;margin-top:6px">${r.rating}</div>
            <p style="font-size:.78rem;color:#7A7A75;margin-top:8px;margin-bottom:14px">${r.description}</p>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;padding:0 12px 8px">
            <a href="${r.maps_url}" target="_blank" style="display:flex;align-items:center;justify-content:center;gap:5px;padding:9px 6px;border-radius:8px;font-size:0.75rem;font-weight:500;text-decoration:none;background:#F55D00;color:#fff">📍 Konuma Git</a>
            <a href="${r.video_url}" target="_blank" style="display:flex;align-items:center;justify-content:center;gap:5px;padding:9px 6px;border-radius:8px;font-size:0.75rem;font-weight:500;text-decoration:none;background:#1A1208;color:#fff">▶ İnceleme</a>
          </div>
          ${reviewBtn}
        `)

        const marker = L.marker([r.lat, r.lng], { icon }).addTo(map).bindPopup(popup)
        window._markers[r.id] = marker
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

  const tags = ['hepsi', 'kahvaltı', 'öğle', 'akşam', 'kafe', 'favoriler']
  const displayList = getFiltered(sortedRestaurants)
  const colors = ['#F55D00', '#2A7A4A', '#1A6BB5', '#8A4FB5', '#C94A00', '#2A5A7A']

  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', height: '700px' }}>

        {/* SOL PANEL */}
        <div style={{ background: '#fff', borderRight: '1px solid #E8DDD0', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

          {/* Header */}
          <div style={{ padding: '24px 24px 16px', borderBottom: '1px solid #E8DDD0' }}>
            <h3 style={{ fontFamily: 'var(--font-playfair)', fontSize: '1.3rem', color: '#1A1208', marginBottom: '4px' }}>
              Mekanlar
            </h3>
            <p style={{ fontSize: '0.78rem', color: '#7A6A5A' }}>
              {located ? 'Konumuna göre sıralandı' : 'Tıkla, haritada bul'}
            </p>
            <button
              onClick={locateUser}
              disabled={locating}
              style={{
                marginTop: '12px',
                display: 'inline-flex', alignItems: 'center', gap: '7px',
                padding: '8px 16px', borderRadius: '100px',
                background: located ? '#2A7A4A' : '#F55D00',
                color: '#fff', border: 'none', cursor: locating ? 'wait' : 'pointer',
                fontFamily: 'inherit', fontSize: '0.78rem', fontWeight: 500,
                opacity: locating ? 0.7 : 1,
              }}
            >
              {locating ? '⏳ Alınıyor...' : located ? '✓ Konuma göre sıralandı' : '📍 Konumuma göre ara'}
            </button>
          </div>

          {/* Filtreler */}
          <div style={{ display: 'flex', gap: '6px', padding: '12px 24px', borderBottom: '1px solid #E8DDD0', overflowX: 'auto' }}>
            {tags.map(tag => (
              <button
                key={tag}
                onClick={() => {
                  if (tag === 'favoriler' && !user) {
                    alert('Favorileri görmek için giriş yapman gerekiyor.')
                    return
                  }
                  setActiveTag(tag)
                }}
                style={{
                  padding: '5px 12px', borderRadius: '100px',
                  fontSize: '0.75rem', fontWeight: 500, cursor: 'pointer',
                  whiteSpace: 'nowrap', fontFamily: 'inherit',
                  background: activeTag === tag ? (tag === 'favoriler' ? '#E8445A' : '#F55D00') : 'none',
                  color: activeTag === tag ? '#fff' : (tag === 'favoriler' ? '#E8445A' : '#7A6A5A'),
                  border: activeTag === tag
                    ? (tag === 'favoriler' ? '1px solid #E8445A' : '1px solid #F55D00')
                    : (tag === 'favoriler' ? '1px solid #FDDDE2' : '1px solid #E8DDD0'),
                }}
              >
                {tag === 'favoriler' ? '♥ Favorilerim' : tag.charAt(0).toUpperCase() + tag.slice(1)}
              </button>
            ))}
          </div>

          {/* Mekan listesi */}
          <div style={{ overflowY: 'auto', flex: 1 }}>
            {displayList.length === 0 && activeTag === 'favoriler' ? (
              <div style={{ textAlign: 'center', padding: '48px 24px', color: '#7A6A5A' }}>
                <div style={{ fontSize: '2rem', marginBottom: '12px' }}>♡</div>
                <div style={{ fontSize: '0.88rem' }}>Henüz favori eklemedin.</div>
                <div style={{ fontSize: '0.78rem', marginTop: '6px', opacity: 0.7 }}>Mekan listesindeki kalp ikonuna tıkla.</div>
              </div>
            ) : displayList.map(r => (
              <div
                key={r.id}
                onClick={() => selectRestaurant(r)}
                style={{
                  display: 'flex', gap: '14px', padding: '16px 24px',
                  borderBottom: '1px solid #E8DDD0', cursor: 'pointer',
                  alignItems: 'flex-start',
                  background: activeId === r.id ? '#FEF5F0' : '#fff',
                  borderLeft: activeId === r.id ? '3px solid #F55D00' : '3px solid transparent',
                  transition: 'background 0.15s',
                }}
              >
                <div style={{
                  width: '52px', height: '52px', borderRadius: '10px',
                  background: '#FAF7F2', border: '1px solid #E8DDD0',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.6rem', flexShrink: 0,
                }}>
                  {r.emoji}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 500, fontSize: '0.92rem', color: '#1A1208', marginBottom: '2px' }}>
                    {r.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#7A6A5A', marginBottom: '6px' }}>
                    {r.type} · {r.area}
                  </div>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {r.tags?.map(t => (
                      <span key={t} style={{
                        fontSize: '0.65rem', padding: '2px 7px', borderRadius: '100px',
                        background: '#FAF7F2', color: '#7A6A5A', border: '1px solid #E8DDD0',
                      }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px', flexShrink: 0 }}>
                  <div style={{ fontSize: '0.75rem', color: '#C94A00', fontWeight: 500 }}>{r.rating}</div>
                  {r.distance != null && (
                    <div style={{ fontSize: '0.7rem', color: '#F55D00', fontWeight: 600 }}>
                      {fmtDist(r.distance)}
                    </div>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      if (!user) { alert('Favori eklemek için giriş yapman gerekiyor.'); return }
                      toggleFavorite(r.id)
                    }}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      fontSize: '1.1rem',
                      color: favorites.has(r.id) ? '#E8445A' : '#D0C4B8',
                      padding: '2px',
                    }}
                    title={favorites.has(r.id) ? 'Favorilerden çıkar' : 'Favorilere ekle'}
                  >
                    {favorites.has(r.id) ? '♥' : '♡'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SAĞ — HARİTA */}
        <div ref={mapRef} style={{ width: '100%', height: '700px' }} />
      </div>

      {/* Yorumlar Modal */}
      {reviewModal && (
        <div
          onClick={(e) => { if (e.target === e.currentTarget) setReviewModal(null) }}
          style={{
            position: 'fixed', inset: 0, zIndex: 3000,
            background: 'rgba(26,18,8,0.7)', backdropFilter: 'blur(6px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
          }}
        >
          <div style={{
            background: '#fff', borderRadius: '20px',
            width: '100%', maxWidth: '560px', maxHeight: '80vh',
            overflow: 'hidden', display: 'flex', flexDirection: 'column',
            boxShadow: '0 32px 80px rgba(0,0,0,0.25)',
          }}>
            <div style={{
              padding: '24px 28px', borderBottom: '1px solid #E8DDD0',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0,
            }}>
              <div>
                <div style={{ fontSize: '1.4rem', marginBottom: '4px' }}>{reviewModal.restaurant.emoji}</div>
                <div style={{ fontFamily: 'var(--font-playfair)', fontSize: '1.2rem', fontWeight: 700, color: '#1A1208' }}>
                  {reviewModal.restaurant.name}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#7A6A5A', marginTop: '2px' }}>
                  {reviewModal.restaurant.area} · {reviewModal.reviews.length} yorum
                </div>
              </div>
              <button onClick={() => setReviewModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: '#7A6A5A' }}>✕</button>
            </div>
            <div style={{ overflowY: 'auto', padding: '24px 28px', flex: 1 }}>
              {reviewModal.reviews.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: '#7A6A5A', fontSize: '0.9rem' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '12px' }}>💬</div>
                  Bu mekan için henüz onaylı yorum yok.
                </div>
              ) : reviewModal.reviews.map((rev, i) => (
                <div key={rev.id} style={{ padding: '16px 0', borderBottom: i < reviewModal.reviews.length - 1 ? '1px solid #E8DDD0' : 'none' }}>
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
                        <div style={{ fontWeight: 500, fontSize: '0.88rem', color: '#1A1208' }}>{rev.user_name}</div>
                        <div style={{ fontSize: '0.7rem', color: '#7A6A5A' }}>
                          {new Date(rev.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </div>
                      </div>
                    </div>
                    <div style={{ color: '#F55D00', fontSize: '0.9rem' }}>
                      {'★'.repeat(rev.stars)}{'☆'.repeat(5 - rev.stars)}
                    </div>
                  </div>
                  {rev.text && (
                    <p style={{ fontSize: '0.88rem', lineHeight: 1.65, color: '#2D2D2B', marginLeft: '46px' }}>
                      &quot;{rev.text}&quot;
                    </p>
                  )}
                  <div style={{ fontSize: '0.7rem', color: '#2A7A4A', marginLeft: '46px', marginTop: '6px' }}>
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