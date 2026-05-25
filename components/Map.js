'use client'

import { useEffect, useRef, useState } from 'react'
import { supabase } from '../lib/supabase'
import Link from 'next/link'

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
      setFavorites(prev => { const n = new Set(prev); n.delete(restaurantId); return n })
    } else {
      await supabase.from('favorites').insert({ user_id: user.id, restaurant_id: restaurantId })
      setFavorites(prev => new Set([...prev, restaurantId]))
    }
    return true
  }

  return { favorites, toggleFavorite, user }
}

// Akıllı sorgulama adımları
const STEPS = [
  {
    id: 'meal',
    question: 'Ne yemek istiyorsun?',
    options: [
      { label: '🍖 Et & Kebap', tags: ['öğle', 'akşam'], types: ['Et & Kebap', 'Cağ Kebabı', 'İskender & Et', 'Aspava & Döner'] },
      { label: '☕ Kahve & Kafe', tags: ['kafe'], types: ['Özel Kahve', 'Kahvaltı & Kafe', 'Fırın & Pastane'] },
      { label: '🥐 Kahvaltı', tags: ['kahvaltı'], types: ['Kahvaltı', 'Tatlı & Kahvaltı', 'Fırın & Pastane'] },
      { label: '🍽️ Türk Mutfağı', tags: ['öğle', 'akşam'], types: ['Türk Mutfağı', 'Lahmacun & Kebap'] },
      { label: '🍰 Tatlı', tags: ['kafe'], types: ['Tatlı & Kahvaltı', 'Fırın & Pastane'] },
      { label: '🎲 Sürpriz yap!', tags: [], types: [] },
    ],
  },
  {
    id: 'time',
    question: 'Ne zaman?',
    options: [
      { label: '☀️ Şu an / Öğle', tags: ['öğle'] },
      { label: '🌙 Akşam', tags: ['akşam'] },
      { label: '🌅 Sabah / Kahvaltı', tags: ['kahvaltı'] },
      { label: '⏰ Fark etmez', tags: [] },
    ],
  },
]

export default function Map({ restaurants }) {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const [reviewModal, setReviewModal] = useState(null)
  const [reviewCounts, setReviewCounts] = useState({})
  const userMarkerRef = useRef(null)
  const { favorites, toggleFavorite, user } = useFavorites()

  // Akıllı arama state
  const [showSmartSearch, setShowSmartSearch] = useState(false)
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [filteredResults, setFilteredResults] = useState([])
  const [showResults, setShowResults] = useState(false)

  // Konum state
  const [locating, setLocating] = useState(false)
  const [located, setLocated] = useState(false)

  useEffect(() => { fetchReviewCounts() }, [])

  async function fetchReviewCounts() {
    const { data } = await supabase.from('reviews').select('restaurant_id').eq('status', 'approved')
    if (!data) return
    const counts = {}
    data.forEach(r => { counts[r.restaurant_id] = (counts[r.restaurant_id] || 0) + 1 })
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
          map.setView([lat, lng], 15, { animate: true })
        })
        // En yakın 3 mekanı göster
        const withDist = [...restaurants]
          .map(r => ({ ...r, distance: calcDist(lat, lng, r.lat, r.lng) }))
          .sort((a, b) => a.distance - b.distance)
          .slice(0, 3)
        setFilteredResults(withDist)
        setShowResults(true)
        setLocating(false)
        setLocated(true)
      },
      err => {
        setLocating(false)
        if (err.code === 1) alert('Konum izni verilmedi.')
        else alert('Konum alınamadı, tekrar dene.')
      },
      { timeout: 10000, enableHighAccuracy: true }
    )
  }

  function handleAnswer(option) {
    const newAnswers = { ...answers, [STEPS[step].id]: option }
    setAnswers(newAnswers)
    if (step < STEPS.length - 1) {
      setStep(step + 1)
    } else {
      // Sonuçları hesapla
      const mealAnswer = newAnswers['meal']
      const timeAnswer = newAnswers['time']
      let results = [...restaurants]

      if (mealAnswer.label === '🎲 Sürpriz yap!') {
        // Rastgele 3 mekan
        results = results.sort(() => Math.random() - 0.5).slice(0, 3)
      } else {
        // Tür filtresi
        if (mealAnswer.types && mealAnswer.types.length > 0) {
          results = results.filter(r => mealAnswer.types.includes(r.type))
        }
        // Zaman filtresi
        if (timeAnswer.tags && timeAnswer.tags.length > 0) {
          const filtered = results.filter(r => r.tags?.some(t => timeAnswer.tags.includes(t)))
          if (filtered.length > 0) results = filtered
        }
        // Max 3 sonuç
        results = results.slice(0, 3)
      }

      setFilteredResults(results)
      setShowResults(true)
      setShowSmartSearch(false)

      // Haritada göster
      const map = mapInstanceRef.current
      if (map && results.length > 0) {
        map.setView([results[0].lat, results[0].lng], 14, { animate: true })
        setTimeout(() => {
          results.forEach(r => {
            if (window._markers && window._markers[r.id]) {
              window._markers[r.id].openPopup()
            }
          })
        }, 500)
      }
    }
  }

  function resetSearch() {
    setStep(0)
    setAnswers({})
    setFilteredResults([])
    setShowResults(false)
    setShowSmartSearch(false)
    setLocated(false)
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

      const map = L.map(mapRef.current, { zoomControl: true, scrollWheelZoom: false })
        .setView([39.9150, 32.8400], 13)

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap &copy; CARTO', maxZoom: 19,
      }).addTo(map)

      window._markers = {}

      restaurants.forEach(r => {
        const icon = L.divIcon({
          html: `<div style="background:#F55D00;border:2.5px solid #fff;border-radius:50%;width:36px;height:36px;display:flex;align-items:center;justify-content:center;font-size:16px;box-shadow:0 2px 10px rgba(0,0,0,.3);cursor:pointer">${r.emoji}</div>`,
          className: '', iconSize: [36, 36], iconAnchor: [18, 18],
        })

        const count = reviewCounts[r.id] || 0
        const reviewBtn = count > 0
          ? `<div style="padding:0 12px 8px"><button onclick="window.openRestaurantReviews(${r.id})" style="width:100%;padding:8px;border-radius:8px;border:1.5px solid #E8DDD0;background:none;font-size:0.78rem;cursor:pointer;color:#7A6A5A;font-family:inherit">💬 ${count} Yorum Gör</button></div>`
          : ''

        const detailBtn = r.slug
          ? `<div style="padding:0 12px 12px"><a href="/mekan/${r.slug}" style="display:block;width:100%;padding:8px;border-radius:8px;background:#FAF7F2;border:1.5px solid #E8DDD0;font-size:0.78rem;color:#1A1208;text-decoration:none;text-align:center;font-family:inherit">Mekan Sayfasına Git →</a></div>`
          : ''

        const popup = L.popup({ className: 'custom-popup', offset: [0, -10], closeButton: false })
          .setContent(`
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
            ${detailBtn}
          `)

        const marker = L.marker([r.lat, r.lng], { icon }).addTo(map).bindPopup(popup)
        window._markers[r.id] = marker
      })

      mapInstanceRef.current = map
    })

    return () => {
      if (mapInstanceRef.current) { mapInstanceRef.current.remove(); mapInstanceRef.current = null }
    }
  }, [reviewCounts])

  useEffect(() => {
    window.openRestaurantReviews = async (restaurantId) => {
      const restaurant = restaurants.find(r => r.id === restaurantId)
      const { data: reviews } = await supabase
        .from('reviews').select('*')
        .eq('restaurant_id', restaurantId).eq('status', 'approved')
        .order('created_at', { ascending: false })
      setReviewModal({ restaurant, reviews: reviews || [] })
    }
    return () => { delete window.openRestaurantReviews }
  }, [restaurants])

  const colors = ['#F55D00', '#2A7A4A', '#1A6BB5', '#8A4FB5', '#C94A00', '#2A5A7A']
  const currentStep = STEPS[step]

  return (
    <>
      {/* Arama Butonları */}
      <div style={{
        display: 'flex', gap: '12px', padding: '20px 24px',
        background: '#fff', borderBottom: '1px solid #E8DDD0',
        flexWrap: 'wrap',
      }}>
        <button
          onClick={locateUser}
          disabled={locating}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '10px 20px', borderRadius: '100px',
            background: located ? '#2A7A4A' : '#F55D00',
            color: '#fff', border: 'none', cursor: 'pointer',
            fontFamily: 'inherit', fontSize: '0.85rem', fontWeight: 500,
            opacity: locating ? 0.7 : 1,
          }}
        >
          {locating ? '⏳ Alınıyor...' : located ? '✓ Konuma Göre Arandı' : '📍 Konumuma Göre Ara'}
        </button>

        <button
          onClick={() => { setShowSmartSearch(true); setStep(0); setAnswers({}) }}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '10px 20px', borderRadius: '100px',
            background: 'none', color: '#1A1208',
            border: '1.5px solid #E8DDD0', cursor: 'pointer',
            fontFamily: 'inherit', fontSize: '0.85rem', fontWeight: 500,
          }}
        >
          🎯 Kategoriye Göre Ara
        </button>

        {(showResults || located) && (
          <button
            onClick={resetSearch}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '10px 16px', borderRadius: '100px',
              background: 'none', color: '#7A6A5A',
              border: '1.5px solid #E8DDD0', cursor: 'pointer',
              fontFamily: 'inherit', fontSize: '0.82rem',
            }}
          >
            ✕ Temizle
          </button>
        )}
      </div>

      {/* Akıllı Arama Modal */}
      {showSmartSearch && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 3000,
          background: 'rgba(26,18,8,0.7)', backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '20px',
        }}>
          <div style={{
            background: '#fff', borderRadius: '24px',
            width: '100%', maxWidth: '480px',
            padding: '40px', position: 'relative',
            boxShadow: '0 32px 80px rgba(0,0,0,0.25)',
          }}>
            <button onClick={() => setShowSmartSearch(false)} style={{
              position: 'absolute', top: '16px', right: '16px',
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: '1.2rem', color: '#7A6A5A',
            }}>✕</button>

            {/* Progress */}
            <div style={{ display: 'flex', gap: '6px', marginBottom: '28px' }}>
              {STEPS.map((s, i) => (
                <div key={s.id} style={{
                  flex: 1, height: '3px', borderRadius: '2px',
                  background: i <= step ? '#F55D00' : '#E8DDD0',
                  transition: 'background 0.3s',
                }} />
              ))}
            </div>

            <h3 style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: '1.5rem', color: '#1A1208',
              marginBottom: '24px', lineHeight: 1.3,
            }}>
              {currentStep.question}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {currentStep.options.map(option => (
                <button
                  key={option.label}
                  onClick={() => handleAnswer(option)}
                  style={{
                    padding: '14px 20px', borderRadius: '12px',
                    border: '1.5px solid #E8DDD0', background: '#FAF7F2',
                    cursor: 'pointer', fontFamily: 'inherit',
                    fontSize: '0.95rem', color: '#1A1208',
                    textAlign: 'left', transition: 'all 0.15s',
                    fontWeight: 500,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#F55D00'; e.currentTarget.style.background = '#FFF5F0' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#E8DDD0'; e.currentTarget.style.background = '#FAF7F2' }}
                >
                  {option.label}
                </button>
              ))}
            </div>

            {step > 0 && (
              <button onClick={() => setStep(step - 1)} style={{
                marginTop: '16px', background: 'none', border: 'none',
                color: '#7A6A5A', cursor: 'pointer', fontSize: '0.82rem',
                fontFamily: 'inherit',
              }}>
                ← Geri
              </button>
            )}
          </div>
        </div>
      )}

      {/* Sonuçlar */}
      {showResults && filteredResults.length > 0 && (
        <div style={{
          padding: '16px 24px', background: '#FFF5F0',
          borderBottom: '1px solid #FFD0B0',
        }}>
          <div style={{ fontSize: '0.78rem', color: '#7A4020', marginBottom: '10px', fontWeight: 500 }}>
            {located ? '📍 En yakın mekanlar' : '🎯 Senin için öneriler'} — {filteredResults.length} sonuç
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {filteredResults.map(r => (
              <Link
                key={r.id}
                href={r.slug ? `/mekan/${r.slug}` : '#'}
                style={{ textDecoration: 'none' }}
              >
                <div style={{
                  background: '#fff', border: '1.5px solid #FFD0B0',
                  borderRadius: '12px', padding: '12px 16px',
                  cursor: 'pointer', minWidth: '140px',
                }}>
                  <div style={{ fontSize: '1.4rem', marginBottom: '4px' }}>{r.emoji}</div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 500, color: '#1A1208' }}>{r.name}</div>
                  <div style={{ fontSize: '0.7rem', color: '#7A6A5A', marginTop: '2px' }}>{r.area}</div>
                  {r.distance != null && (
                    <div style={{ fontSize: '0.7rem', color: '#F55D00', fontWeight: 600, marginTop: '4px' }}>
                      {fmtDist(r.distance)}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Harita */}
      <div ref={mapRef} style={{ width: '100%', height: '600px' }} />

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
                <div style={{ textAlign: 'center', padding: '40px 0', color: '#7A6A5A' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '12px' }}>💬</div>
                  Bu mekan için henüz onaylı yorum yok.
                </div>
              ) : reviewModal.reviews.map((rev, i) => (
                <div key={rev.id} style={{ padding: '16px 0', borderBottom: i < reviewModal.reviews.length - 1 ? '1px solid #E8DDD0' : 'none' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: colors[i % colors.length], display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 600, fontSize: '0.82rem', flexShrink: 0 }}>
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
                  <div style={{ fontSize: '0.7rem', color: '#2A7A4A', marginLeft: '46px', marginTop: '6px' }}>✓ Onaylı yorum</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}