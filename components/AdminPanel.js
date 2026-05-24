'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function AdminPanel() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [open, setOpen] = useState(false)
  const [pendingReviews, setPendingReviews] = useState([])
  const [restaurants, setRestaurants] = useState([])
  const [tab, setTab] = useState('yorumlar')
  const [restaurantReviews, setRestaurantReviews] = useState({})

  useEffect(() => {
    checkAdmin()
  }, [])

  async function checkAdmin() {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return

    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', session.user.id)
      .single()

    if (profile?.is_admin) {
      setIsAdmin(true)
      fetchPending()
      fetchRestaurants()
    }

    supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!session) { setIsAdmin(false); return }
      const { data: p } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', session.user.id)
        .single()
      if (p?.is_admin) {
        setIsAdmin(true)
        fetchPending()
        fetchRestaurants()
      } else {
        setIsAdmin(false)
      }
    })
  }

  async function fetchPending() {
    const { data } = await supabase
      .from('reviews')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
    setPendingReviews(data || [])
  }

  async function fetchRestaurants() {
    const { data } = await supabase
      .from('restaurants')
      .select('*')
      .order('id')
    setRestaurants(data || [])
  }

  async function fetchRestaurantReviews(restaurantId) {
    const { data } = await supabase
      .from('reviews')
      .select('*')
      .eq('restaurant_id', restaurantId)
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
    return data || []
  }

  async function approveReview(id) {
    const { data, error } = await supabase
      .from('reviews')
      .update({ status: 'approved' })
      .eq('id', id)
    if (error) { alert('Hata: ' + error.message); return }
    setPendingReviews(prev => prev.filter(r => r.id !== id))
  }

  async function rejectReview(id) {
    await supabase.from('reviews').update({ status: 'rejected' }).eq('id', id)
    setPendingReviews(prev => prev.filter(r => r.id !== id))
  }

  async function deleteReview(id, restaurantId) {
    if (!confirm('Bu yorumu silmek istediğinden emin misin?')) return
    await supabase.from('reviews').delete().eq('id', id)
    const updated = await fetchRestaurantReviews(restaurantId)
    setRestaurantReviews(prev => ({ ...prev, [restaurantId]: updated }))
  }

  async function saveRestaurant(r) {
    await supabase.from('restaurants').update({
      name: document.getElementById('r-name-' + r.id).value,
      type: document.getElementById('r-type-' + r.id).value,
      area: document.getElementById('r-area-' + r.id).value,
      description: document.getElementById('r-desc-' + r.id).value,
      video_url: document.getElementById('r-video-' + r.id).value,
      maps_url: document.getElementById('r-maps-' + r.id).value,
      rating: document.getElementById('r-rating-' + r.id).value,
    }).eq('id', r.id)
    alert('✓ Kaydedildi')
  }

  if (!isAdmin) return null

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: 'fixed', bottom: '24px', right: '24px', zIndex: 2300,
          background: '#1A1208', color: '#FAF7F2',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '100px', padding: '11px 20px',
          fontSize: '0.8rem', cursor: 'pointer',
          fontFamily: 'inherit', fontWeight: 500,
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          display: 'flex', alignItems: 'center', gap: '8px',
        }}
      >
        🔧 Yönetim
        {pendingReviews.length > 0 && (
          <span style={{
            background: '#F55D00', color: '#fff',
            borderRadius: '100px', padding: '1px 7px', fontSize: '0.7rem',
          }}>
            {pendingReviews.length}
          </span>
        )}
      </button>

      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 2400,
            background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(3px)',
          }}
        />
      )}

      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 2500,
        width: '500px', maxWidth: '100vw',
        background: '#111008',
        boxShadow: '-24px 0 80px rgba(0,0,0,0.35)',
        display: 'flex', flexDirection: 'column',
        transform: open ? 'translateX(0)' : 'translateX(110%)',
        transition: 'transform 0.32s cubic-bezier(.4,0,.2,1)',
      }}>
        <div style={{
          padding: '24px 24px 0',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexShrink: 0,
        }}>
          <div>
            <div style={{
              fontFamily: 'var(--font-poppins)', fontWeight: 700,
              fontSize: '1rem', color: '#FAF7F2',
            }}>
              bizzat<span style={{ color: '#F55D00' }}>ankara</span>
            </div>
            <div style={{
              fontSize: '0.7rem', letterSpacing: '0.1em',
              textTransform: 'uppercase', color: 'rgba(250,247,242,0.35)',
              marginTop: '2px',
            }}>
              Yönetim Paneli
            </div>
          </div>
          <button onClick={() => setOpen(false)} style={{
            background: 'rgba(255,255,255,0.08)', border: 'none',
            color: '#FAF7F2', width: '36px', height: '36px',
            borderRadius: '50%', cursor: 'pointer', fontSize: '1rem',
          }}>✕</button>
        </div>

        <div style={{
          display: 'flex', padding: '20px 24px 0',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          flexShrink: 0, gap: '2px',
        }}>
          {['yorumlar', 'mekanlar'].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: '8px 14px', borderRadius: '8px 8px 0 0',
              fontSize: '0.75rem', fontWeight: 500, cursor: 'pointer',
              color: tab === t ? '#FAF7F2' : 'rgba(250,247,242,0.45)',
              border: 'none', background: 'none', fontFamily: 'inherit',
              borderBottom: tab === t ? '2px solid #F55D00' : '2px solid transparent',
              marginBottom: '-1px',
            }}>
              {t === 'yorumlar' ? (
                <span>
                  💬 Yorumlar{' '}
                  {pendingReviews.length > 0 && (
                    <span style={{
                      background: '#F55D00', color: '#fff',
                      borderRadius: '100px', padding: '1px 6px',
                      fontSize: '0.65rem', marginLeft: '4px',
                    }}>
                      {pendingReviews.length}
                    </span>
                  )}
                </span>
              ) : '📍 Mekanlar'}
            </button>
          ))}
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px 32px' }}>

          {tab === 'yorumlar' && (
            <>
              {pendingReviews.length === 0 ? (
                <div style={{
                  textAlign: 'center', padding: '40px 0',
                  color: 'rgba(250,247,242,0.3)', fontSize: '0.85rem',
                }}>
                  ✓ Bekleyen yorum yok
                </div>
              ) : pendingReviews.map(r => (
                <div key={r.id} style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '12px', padding: '14px', marginBottom: '10px',
                }}>
                  <div style={{ fontSize: '0.7rem', color: 'rgba(250,247,242,0.4)', marginBottom: '6px' }}>
                    <strong style={{ color: 'rgba(250,247,242,0.75)' }}>{r.user_name}</strong>
                    {' · '}{'★'.repeat(r.stars)}{'☆'.repeat(5 - r.stars)}
                    {' · '}{new Date(r.created_at).toLocaleDateString('tr-TR')}
                  </div>
                  {r.text && (
                    <div style={{ fontSize: '0.82rem', color: '#FAF7F2', lineHeight: 1.5, marginBottom: '10px' }}>
                      &quot;{r.text}&quot;
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => approveReview(r.id)} style={{
                      flex: 1, padding: '8px', borderRadius: '8px',
                      background: '#2A7A4A', color: '#fff', border: 'none',
                      fontSize: '0.78rem', fontWeight: 500, cursor: 'pointer',
                      fontFamily: 'inherit',
                    }}>✓ Onayla</button>
                    <button onClick={() => rejectReview(r.id)} style={{
                      flex: 1, padding: '8px', borderRadius: '8px',
                      background: 'rgba(255,255,255,0.08)', color: 'rgba(250,247,242,0.7)',
                      border: 'none', fontSize: '0.78rem', fontWeight: 500,
                      cursor: 'pointer', fontFamily: 'inherit',
                    }}>✕ Reddet</button>
                  </div>
                </div>
              ))}
            </>
          )}

          {tab === 'mekanlar' && (
            <>
              {restaurants.map(r => (
                <div key={r.id} style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '12px', marginBottom: '8px', overflow: 'hidden',
                }}>
                  <div
                    onClick={async () => {
                      const el = document.getElementById('rf-' + r.id)
                      const isOpen = el.style.display !== 'none'
                      el.style.display = isOpen ? 'none' : 'flex'
                      if (!isOpen && !restaurantReviews[r.id]) {
                        const reviews = await fetchRestaurantReviews(r.id)
                        setRestaurantReviews(prev => ({ ...prev, [r.id]: reviews }))
                      }
                    }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '10px',
                      padding: '14px 16px', cursor: 'pointer',
                    }}
                  >
                    <span style={{ fontSize: '1.3rem' }}>{r.emoji}</span>
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 500, color: '#FAF7F2' }}>{r.name}</div>
                      <div style={{ fontSize: '0.7rem', color: 'rgba(250,247,242,0.4)' }}>{r.area}</div>
                    </div>
                    <span style={{ marginLeft: 'auto', color: 'rgba(250,247,242,0.3)' }}>▾</span>
                  </div>

                  <div id={'rf-' + r.id} style={{
                    display: 'none', flexDirection: 'column', gap: '10px',
                    padding: '0 16px 16px',
                  }}>
                    {[
                      { label: 'Mekan Adı', id: 'r-name-' + r.id, val: r.name },
                      { label: 'Tür', id: 'r-type-' + r.id, val: r.type },
                      { label: 'Bölge', id: 'r-area-' + r.id, val: r.area },
                      { label: 'Açıklama', id: 'r-desc-' + r.id, val: r.description },
                      { label: 'Instagram Video', id: 'r-video-' + r.id, val: r.video_url },
                      { label: 'Google Maps', id: 'r-maps-' + r.id, val: r.maps_url },
                      { label: 'Puan', id: 'r-rating-' + r.id, val: r.rating },
                    ].map(f => (
                      <div key={f.id}>
                        <div style={{
                          fontSize: '0.68rem', letterSpacing: '0.08em',
                          textTransform: 'uppercase', color: 'rgba(250,247,242,0.4)',
                          marginBottom: '5px',
                        }}>
                          {f.label}
                        </div>
                        <input
                          id={f.id}
                          defaultValue={f.val || ''}
                          style={{
                            width: '100%', padding: '9px 12px',
                            background: 'rgba(255,255,255,0.07)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '8px', color: '#FAF7F2',
                            fontFamily: 'inherit', fontSize: '0.82rem', outline: 'none',
                          }}
                        />
                      </div>
                    ))}

                    <button
                      onClick={() => saveRestaurant(r)}
                      style={{
                        width: '100%', padding: '8px', borderRadius: '8px',
                        background: '#F55D00', color: '#fff', border: 'none',
                        fontFamily: 'inherit', fontSize: '0.8rem', fontWeight: 500,
                        cursor: 'pointer', marginTop: '4px',
                      }}
                    >
                      💾 Kaydet
                    </button>

                    {/* Onaylı Yorumlar */}
                    <div style={{ marginTop: '12px' }}>
                      <div style={{
                        fontSize: '0.68rem', letterSpacing: '0.08em',
                        textTransform: 'uppercase', color: 'rgba(250,247,242,0.4)',
                        marginBottom: '8px',
                      }}>
                        Onaylı Yorumlar {restaurantReviews[r.id] ? '(' + restaurantReviews[r.id].length + ')' : ''}
                      </div>
                      {!restaurantReviews[r.id] ? (
                        <div style={{ fontSize: '0.75rem', color: 'rgba(250,247,242,0.3)' }}>Yükleniyor...</div>
                      ) : restaurantReviews[r.id].length === 0 ? (
                        <div style={{ fontSize: '0.75rem', color: 'rgba(250,247,242,0.3)' }}>Henüz onaylı yorum yok</div>
                      ) : restaurantReviews[r.id].map(rev => (
                        <div key={rev.id} style={{
                          background: 'rgba(255,255,255,0.04)',
                          border: '1px solid rgba(255,255,255,0.06)',
                          borderRadius: '8px', padding: '10px', marginBottom: '6px',
                        }}>
                          <div style={{
                            display: 'flex', justifyContent: 'space-between',
                            alignItems: 'flex-start', marginBottom: '4px',
                          }}>
                            <div>
                              <span style={{ fontSize: '0.78rem', color: '#FAF7F2', fontWeight: 500 }}>
                                {rev.user_name}
                              </span>
                              <span style={{ fontSize: '0.72rem', color: '#F55D00', marginLeft: '8px' }}>
                                {'★'.repeat(rev.stars)}
                              </span>
                            </div>
                            <button
                              onClick={() => deleteReview(rev.id, r.id)}
                              style={{
                                background: 'rgba(200,50,50,0.2)',
                                color: 'rgba(255,100,100,0.9)',
                                border: 'none', borderRadius: '6px',
                                padding: '3px 8px', fontSize: '0.7rem',
                                cursor: 'pointer', fontFamily: 'inherit',
                              }}
                            >
                              🗑 Sil
                            </button>
                          </div>
                          {rev.text && (
                            <div style={{ fontSize: '0.75rem', color: 'rgba(250,247,242,0.6)', lineHeight: 1.5 }}>
                              &quot;{rev.text}&quot;
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </>
  )
}