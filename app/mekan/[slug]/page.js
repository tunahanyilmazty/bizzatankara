import { supabase } from '../../../lib/supabase'
import Navbar from '../../../components/Navbar'
import Footer from '../../../components/Footer'
import Link from 'next/link'

export async function generateMetadata({ params }) {
  const { slug } = await params
  const { data: restaurant } = await supabase
    .from('restaurants')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!restaurant) return { title: 'Mekan bulunamadi' }

  return {
    title: `${restaurant.name} — bizzatankara`,
    description: restaurant.description,
  }
}

export async function generateStaticParams() {
  const { data: restaurants } = await supabase
    .from('restaurants')
    .select('slug')
    .not('slug', 'is', null)

  return (restaurants || []).map(r => ({ slug: r.slug }))
}

export default async function RestaurantPage({ params }) {
  const { slug } = await params

  const { data: restaurant } = await supabase
    .from('restaurants')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!restaurant) {
    return (
      <>
        <Navbar />
        <main style={{ paddingTop: '64px', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>😕</div>
            <h1 style={{ fontFamily: 'var(--font-playfair)', fontSize: '2rem', marginBottom: '16px' }}>Mekan bulunamadi</h1>
            <Link href="/" style={{ color: '#F55D00', textDecoration: 'none' }}>Ana sayfaya don</Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  const { data: reviews } = await supabase
    .from('reviews')
    .select('*')
    .eq('restaurant_id', restaurant.id)
    .eq('status', 'approved')
    .order('created_at', { ascending: false })

  const avgRating = reviews && reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.stars, 0) / reviews.length).toFixed(1)
    : null

  const colors = ['#F55D00', '#2A7A4A', '#1A6BB5', '#8A4FB5', '#C94A00', '#2A5A7A']

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: '64px' }}>

        {/* Hero */}
        <div style={{
          background: '#1A1208', padding: '80px',
          display: 'flex', alignItems: 'center', gap: '40px',
          minHeight: '280px',
        }}>
          <div style={{
            width: '100px', height: '100px', borderRadius: '20px',
            background: 'rgba(255,255,255,0.08)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '3.5rem', flexShrink: 0,
          }}>
            {restaurant.emoji}
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#F55D00', fontWeight: 500, marginBottom: '12px' }}>
              {restaurant.type}
            </div>
            <h1 style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#FAF7F2', lineHeight: 1.15, marginBottom: '12px' }}>
              {restaurant.name}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.88rem', color: 'rgba(250,247,242,0.6)' }}>
                📍 {restaurant.area}
              </span>
              <span style={{ fontSize: '0.88rem', color: '#C94A00' }}>
                {restaurant.rating}
              </span>
              {avgRating && (
                <span style={{ fontSize: '0.88rem', color: 'rgba(250,247,242,0.6)' }}>
                  💬 {reviews.length} okuyucu yorumu · Ort. {avgRating}/5
                </span>
              )}
            </div>
          </div>
        </div>

        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '60px 24px' }}>

          <div style={{ marginBottom: '40px' }}>
            <Link href="/#harita" style={{ fontSize: '0.82rem', color: '#7A6A5A', textDecoration: 'none' }}>
              ← Haritaya don
            </Link>
          </div>

          {/* Açıklama */}
          <div style={{ marginBottom: '48px' }}>
            <h2 style={{ fontFamily: 'var(--font-playfair)', fontSize: '1.6rem', color: '#1A1208', marginBottom: '16px' }}>
              Mekan Hakkında
            </h2>
            <p style={{ fontSize: '1.05rem', color: '#7A6A5A', lineHeight: 1.8 }}>
              {restaurant.description}
            </p>
          </div>

          {/* Butonlar */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '60px' }}>
            {restaurant.maps_url && (
              <a href={restaurant.maps_url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#F55D00', color: '#fff', padding: '12px 24px', borderRadius: '100px', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}>
                📍 Konuma Git
              </a>
            )}
            {restaurant.video_url && (
              <a href={restaurant.video_url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#1A1208', color: '#fff', padding: '12px 24px', borderRadius: '100px', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}>
                ▶ İnceleme Videosunu İzle
              </a>
            )}
          </div>

          {/* Yorumlar */}
          <div>
            <h2 style={{ fontFamily: 'var(--font-playfair)', fontSize: '1.6rem', color: '#1A1208', marginBottom: '24px' }}>
              {reviews && reviews.length > 0 ? `Okuyucu Yorumları (${reviews.length})` : 'Henüz yorum yok'}
            </h2>

            {reviews && reviews.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                {reviews.map((rev, i) => (
                  <div key={rev.id} style={{ padding: '24px 0', borderBottom: i < reviews.length - 1 ? '1px solid #E8DDD0' : 'none' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <div style={{
                          width: '40px', height: '40px', borderRadius: '50%',
                          background: colors[i % colors.length],
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: '#fff', fontWeight: 600, fontSize: '0.9rem', flexShrink: 0,
                        }}>
                          {rev.user_name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: 500, color: '#1A1208' }}>{rev.user_name}</div>
                          <div style={{ fontSize: '0.75rem', color: '#7A6A5A' }}>
                            {new Date(rev.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </div>
                        </div>
                      </div>
                      <div style={{ color: '#F55D00', fontSize: '1rem' }}>
                        {'★'.repeat(rev.stars)}{'☆'.repeat(5 - rev.stars)}
                      </div>
                    </div>
                    {rev.text && (
                      <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: '#2D2D2B', marginLeft: '52px' }}>
                        &quot;{rev.text}&quot;
                      </p>
                    )}
                    <div style={{ fontSize: '0.72rem', color: '#2A7A4A', marginLeft: '52px', marginTop: '8px' }}>
                      ✓ Onaylı yorum
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ background: '#FAF7F2', borderRadius: '12px', padding: '40px', textAlign: 'center', border: '1px solid #E8DDD0' }}>
                <div style={{ fontSize: '2rem', marginBottom: '12px' }}>💬</div>
                <p style={{ color: '#7A6A5A', fontSize: '0.95rem' }}>
                  Bu mekan için henüz yorum yok. İlk yorumu sen yaz!
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}