'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function Reviews({ restaurants }) {
  const [reviews, setReviews] = useState([])
  const [user, setUser] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [selectedPlace, setSelectedPlace] = useState('')
  const [stars, setStars] = useState(0)
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    fetchReviews()

    async function checkUser() {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
    }
    checkUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  async function fetchReviews() {
    const { data } = await supabase
      .from('reviews')
      .select('*')
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
    setReviews(data || [])
  }

  async function submitReview() {
    if (!selectedPlace) { alert('Mekan seçin'); return }
    if (!stars) { alert('Puan verin'); return }

    setLoading(true)

    const { data: { session } } = await supabase.auth.getSession()

    if (!session) { alert('Oturum bulunamadı, tekrar giriş yapın'); setLoading(false); return }

    const userName = session?.user?.user_metadata?.name || session?.user?.email?.split('@')[0]

    const { data, error } = await supabase.from('reviews').insert({
      restaurant_id: parseInt(selectedPlace),
      user_id: session.user.id,
      user_name: userName,
      stars,
      text,
      status: 'pending',
    })

    if (error) {
      alert('Hata: ' + error.message)
      setLoading(false)
      return
    }

    setLoading(false)
    setSuccess(true)
    setShowForm(false)
    setSelectedPlace('')
    setStars(0)
    setText('')
    setTimeout(() => setSuccess(false), 3000)
  }

  const starLabels = ['', 'Berbat 😞', 'İdare eder 😐', 'Fena değil 🙂', 'Güzeldi 😊', 'Mükemmel! 🔥']
  const colors = ['#F55D00', '#2A7A4A', '#1A6BB5', '#8A4FB5', '#C94A00', '#2A5A7A']

  return (
    <section id="yorumlar" style={{ padding: '80px', background: '#fff' }}>
      <div style={{ marginBottom: '48px' }}>
        <span style={{
          fontSize: '0.75rem', letterSpacing: '0.12em',
          textTransform: 'uppercase', color: 'var(--rust)',
          fontWeight: 500, display: 'block', marginBottom: '12px',
        }}>
          Okuyucu Yorumları
        </span>
        <h2 style={{
          fontFamily: 'var(--font-playfair)',
          fontSize: 'clamp(2rem, 3.5vw, 3rem)',
          color: 'var(--dark)',
        }}>
          Gidenler <em style={{ color: 'var(--rust)', fontStyle: 'italic' }}>ne dedi?</em>
        </h2>
      </div>

      {reviews.length > 0 ? (
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '24px', marginBottom: '40px',
        }}>
          {reviews.map((r, i) => (
            <div key={r.id} style={{
              background: 'var(--cream)', borderRadius: '14px',
              padding: '24px', border: '1px solid var(--border)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <div style={{
                    width: '38px', height: '38px', borderRadius: '50%',
                    background: colors[i % colors.length],
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontWeight: 600, fontSize: '0.85rem',
                  }}>
                    {r.user_name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: 500, fontSize: '0.88rem' }}>{r.user_name}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {new Date(r.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                  </div>
                </div>
                <div style={{ color: 'var(--rust)', fontSize: '0.85rem' }}>
                  {'★'.repeat(r.stars)}{'☆'.repeat(5 - r.stars)}
                </div>
              </div>
              <div style={{
                fontSize: '0.72rem', color: 'var(--text-muted)',
                background: '#fff', border: '1px solid var(--border)',
                borderRadius: '100px', padding: '4px 10px',
                display: 'inline-block', marginBottom: '12px',
              }}>
                📍 {restaurants?.find(re => re.id === r.restaurant_id)?.name || 'Mekan'}
              </div>
              <p style={{ fontSize: '0.85rem', lineHeight: 1.65 }}>"{r.text}"</p>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '5px',
                fontSize: '0.7rem', color: '#2A7A4A', marginTop: '12px',
              }}>
                ✓ Onaylı yorum
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{
          textAlign: 'center', padding: '60px',
          color: 'var(--text-muted)', marginBottom: '40px',
        }}>
          Henüz onaylı yorum yok. İlk yorumu sen yaz!
        </div>
      )}

      {success && (
        <div style={{
          background: '#f0fff4', border: '1px solid #2A7A4A',
          borderRadius: '12px', padding: '16px 24px',
          color: '#2A7A4A', marginBottom: '24px', textAlign: 'center',
        }}>
          ✅ Yorumun alındı! İncelendikten sonra yayınlanacak.
        </div>
      )}

      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'var(--cream)', borderRadius: '14px',
        padding: '20px 28px', border: '1px solid var(--border)',
      }}>
        <div>
          <strong style={{ color: 'var(--dark)', display: 'block', fontSize: '1rem', marginBottom: '2px' }}>
            Sen de deneyimini paylaş
          </strong>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Gittiğin mekanı puanla — onaylandıktan sonra yayınlanır.
          </p>
        </div>
        <button
          onClick={() => {
            if (user) {
              setShowForm(true)
            } else {
              alert('Önce giriş yapman gerekiyor.')
            }
          }}
          style={{
            background: 'var(--rust)', color: '#fff',
            padding: '10px 24px', borderRadius: '100px',
            fontSize: '0.88rem', fontWeight: 500,
            border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
          }}
        >
          ✍️ Yorum Yaz
        </button>
      </div>

      {showForm && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 2000,
          background: 'rgba(26,18,8,0.6)', backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            background: '#fff', borderRadius: '20px',
            padding: '40px', width: '100%', maxWidth: '460px',
            position: 'relative', maxHeight: '90vh', overflowY: 'auto',
          }}>
            <button onClick={() => setShowForm(false)} style={{
              position: 'absolute', top: '16px', right: '16px',
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: '1.2rem', color: 'var(--text-muted)',
            }}>✕</button>

            <h3 style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: '1.4rem', marginBottom: '24px',
            }}>
              Yorum Yaz
            </h3>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                Mekan seçin
              </label>
              <select
                value={selectedPlace}
                onChange={e => setSelectedPlace(e.target.value)}
                style={{
                  width: '100%', padding: '11px 14px',
                  border: '1.5px solid var(--border)', borderRadius: '10px',
                  fontFamily: 'inherit', fontSize: '0.88rem', outline: 'none',
                  background: 'var(--cream)',
                }}
              >
                <option value="">— Mekan seçin —</option>
                {restaurants?.map(r => (
                  <option key={r.id} value={r.id}>{r.emoji} {r.name}</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                Puan
              </label>
              <div style={{ display: 'flex', gap: '6px', marginBottom: '4px' }}>
                {[1, 2, 3, 4, 5].map(n => (
                  <span
                    key={n}
                    onClick={() => setStars(n)}
                    style={{
                      fontSize: '1.6rem', cursor: 'pointer',
                      color: n <= stars ? '#F55D00' : '#D0C4B8',
                    }}
                  >★</span>
                ))}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {stars ? starLabels[stars] : 'Puan vermek için yıldıza tıkla'}
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                Yorumun (isteğe bağlı)
              </label>
              <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="Bu mekanda ne yedin? Atmosfer nasıldı?"
                style={{
                  width: '100%', padding: '11px 14px', minHeight: '100px',
                  border: '1.5px solid var(--border)', borderRadius: '10px',
                  fontFamily: 'inherit', fontSize: '0.88rem', outline: 'none',
                  resize: 'vertical', background: 'var(--cream)',
                }}
              />
            </div>

            <div style={{
              background: '#FFF5F0', border: '1px solid #FFD0B0',
              borderRadius: '8px', padding: '10px 12px',
              fontSize: '0.75rem', color: '#7A4020', marginBottom: '16px',
            }}>
              ℹ️ Yorumun editör onayından sonra yayınlanır.
            </div>

            <button
              onClick={submitReview}
              disabled={loading || !selectedPlace || !stars}
              style={{
                width: '100%', padding: '12px',
                background: 'var(--rust)', color: '#fff',
                border: 'none', borderRadius: '10px',
                fontFamily: 'inherit', fontSize: '0.9rem', fontWeight: 500,
                cursor: 'pointer',
                opacity: (loading || !selectedPlace || !stars) ? 0.5 : 1,
              }}
            >
              {loading ? 'Gönderiliyor...' : 'Yorum Gönder'}
            </button>
          </div>
        </div>
      )}
    </section>
  )
}