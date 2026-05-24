import { supabase } from '../lib/supabase'
import Navbar from '../components/Navbar'
import MapWrapper from '../components/MapWrapper'
import Reviews from '../components/Reviews'
import AdminPanel from '../components/AdminPanel'
import Categories from '../components/Categories'
import Blog from '../components/Blog'
import Footer from '../components/Footer'

export default async function Home() {
  const { data: restaurants } = await supabase
    .from('restaurants')
    .select('*')
    .order('id')

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: '64px' }}>

        {/* HERO */}
        <section style={{
          minHeight: '100vh',
          display: 'flex', flexDirection: 'column',
          justifyContent: 'center', padding: '80px',
          background: 'var(--cream)',
        }}>
          <div style={{
            fontSize: '0.78rem', fontWeight: 500,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            color: 'var(--rust)', marginBottom: '28px',
            display: 'flex', alignItems: 'center', gap: '8px',
          }}>
            <span style={{ width: '28px', height: '1px', background: 'var(--rust)', display: 'inline-block' }} />
            Ankara Rehberi
          </div>

          <h1 style={{
            fontFamily: 'var(--font-playfair)',
            fontSize: 'clamp(2.8rem, 5vw, 4.2rem)',
            lineHeight: 1.1, color: 'var(--dark)',
            marginBottom: '24px',
          }}>
            Ankara&apos;yı<br />
            <em style={{ color: 'var(--rust)', fontStyle: 'italic' }}>bizzat</em><br />
            keşfet
          </h1>

          <p style={{
            fontSize: '1.05rem', color: 'var(--text-muted)',
            lineHeight: 1.7, maxWidth: '420px', marginBottom: '44px',
          }}>
            Şehrin en iyi restoranları, gizli kalmış mekanları ve yerel lezzetleri — hepsi tek bir rehberde.
          </p>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <a href="#harita" style={{
              background: 'var(--dark)', color: '#fff',
              padding: '14px 32px', borderRadius: '100px',
              fontSize: '0.9rem', fontWeight: 500, textDecoration: 'none',
            }}>
              Haritayı Gör
            </a>
            <a href="#blog" style={{
              color: 'var(--text-muted)', fontSize: '0.9rem', textDecoration: 'none',
            }}>
              Blog&apos;u oku →
            </a>
          </div>

          <div style={{
            display: 'flex', gap: '40px',
            marginTop: '60px', paddingTop: '40px',
            borderTop: '1px solid var(--border)',
          }}>
            {[
              { num: '54K', label: 'Takipçi' },
              { num: '2 Yıl', label: 'İçerik Üretimi' },
              { num: `${restaurants?.length || 0}`, label: 'Anlaşmalı Mekan' },
            ].map(s => (
              <div key={s.label}>
                <span style={{
                  fontFamily: 'var(--font-playfair)',
                  fontSize: '2rem', fontWeight: 700,
                  color: 'var(--dark)', display: 'block',
                }}>
                  {s.num}
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* KATEGORİLER */}
        <Categories />

        {/* HARİTA */}
        <section id="harita" style={{ background: '#fff', overflow: 'hidden' }}>
          <div style={{ padding: '60px 80px 32px' }}>
            <span style={{
              fontSize: '0.75rem', letterSpacing: '0.12em',
              textTransform: 'uppercase', color: 'var(--rust)',
              fontWeight: 500, display: 'block', marginBottom: '12px',
            }}>
              Anlaşmalı Mekanlar
            </span>
            <h2 style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: 'clamp(2rem, 3.5vw, 3rem)',
              color: 'var(--dark)',
            }}>
              Haritadan <em style={{ color: 'var(--rust)', fontStyle: 'italic' }}>Bul</em>
            </h2>
          </div>
          <MapWrapper restaurants={restaurants} />
        </section>
          {/* BLOG */}
        <Blog />
        {/* YORUMLAR */}
        <Reviews restaurants={restaurants} />

        <AdminPanel />
        <Footer />
      </main>
    </>
  )
}