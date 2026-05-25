'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '../lib/supabase'
import AuthModal from './AuthModal'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    setUser(null)
    setMenuOpen(false)
  }

  const links = [
    { label: 'Harita', href: '/#harita' },
    { label: 'Kategoriler', href: '/#kategoriler' },
    { label: 'Yorumlar', href: '/#yorumlar' },
    { label: 'Blog', href: '/#blog' },
  ]

  const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || ''

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 24px', height: '64px',
        background: 'rgba(250,247,242,0.94)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #E8DDD0',
      }}>
        <Link href="/" style={{
          fontFamily: 'var(--font-poppins)', fontSize: '1.3rem',
          fontWeight: 700, color: '#1A1208', textDecoration: 'none',
          letterSpacing: '-0.02em', flexShrink: 0,
        }}>
          bizzat<span style={{ color: '#F55D00' }}>ankara</span>
        </Link>

        {/* Desktop nav */}
        <ul style={{
          display: 'flex', gap: '28px', listStyle: 'none', alignItems: 'center',
          '@media(max-width:768px)': { display: 'none' },
        }} className="desktop-nav">
          {links.map(l => (
            <li key={l.label}>
              <Link href={l.href} style={{
                textDecoration: 'none', color: '#7A6A5A',
                fontSize: '0.85rem', fontWeight: 500,
                letterSpacing: '0.04em', textTransform: 'uppercase',
              }}>
                {l.label}
              </Link>
            </li>
          ))}
          <li>
            <Link href="/#partner" style={{
              background: '#F55D00', color: '#fff',
              padding: '7px 18px', borderRadius: '100px',
              textDecoration: 'none', fontSize: '0.85rem',
            }}>
              İş Birliği
            </Link>
          </li>
          <li>
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%',
                  background: '#F55D00', color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.72rem', fontWeight: 600,
                }}>
                  {userName.charAt(0).toUpperCase()}
                </div>
                <button onClick={handleLogout} style={{
                  padding: '6px 14px', borderRadius: '100px',
                  border: '1.5px solid #E8DDD0', background: 'none',
                  fontSize: '0.8rem', color: '#7A6A5A', cursor: 'pointer',
                  fontFamily: 'inherit',
                }}>
                  Çıkış
                </button>
              </div>
            ) : (
              <button onClick={() => setAuthOpen(true)} style={{
                padding: '6px 16px', borderRadius: '100px',
                border: '1.5px solid #E8DDD0', background: 'none',
                fontSize: '0.82rem', color: '#7A6A5A', cursor: 'pointer',
                fontFamily: 'inherit',
              }}>
                Giriş Yap
              </button>
            )}
          </li>
        </ul>

        {/* Hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="hamburger-btn"
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            padding: '8px', display: 'flex', flexDirection: 'column',
            gap: '5px',
          }}
        >
          <span style={{ display: 'block', width: '22px', height: '2px', background: menuOpen ? 'transparent' : '#1A1208', borderRadius: '2px', transition: 'all 0.3s' }} />
          <span style={{ display: 'block', width: '22px', height: '2px', background: '#1A1208', borderRadius: '2px', transform: menuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none', transition: 'all 0.3s' }} />
          <span style={{ display: 'block', width: '22px', height: '2px', background: '#1A1208', borderRadius: '2px', transform: menuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none', transition: 'all 0.3s' }} />
        </button>
      </nav>

      {/* Mobil menü */}
      {menuOpen && (
        <div style={{
          position: 'fixed', top: '64px', left: 0, right: 0, bottom: 0,
          zIndex: 999, background: '#FAF7F2',
          padding: '24px', display: 'flex', flexDirection: 'column',
          borderTop: '1px solid #E8DDD0', overflowY: 'auto',
        }}>
          {links.map(l => (
            <Link
              key={l.label}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              style={{
                display: 'block', padding: '16px 0',
                fontSize: '1.1rem', fontWeight: 500,
                color: '#1A1208', textDecoration: 'none',
                borderBottom: '1px solid #E8DDD0',
              }}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/#partner"
            onClick={() => setMenuOpen(false)}
            style={{
              display: 'block', padding: '16px 0',
              fontSize: '1.1rem', fontWeight: 500,
              color: '#F55D00', textDecoration: 'none',
              borderBottom: '1px solid #E8DDD0',
            }}
          >
            İş Birliği
          </Link>
          {user ? (
            <button onClick={handleLogout} style={{
              marginTop: '16px', padding: '12px',
              background: 'none', border: '1.5px solid #E8DDD0',
              borderRadius: '10px', color: '#7A6A5A',
              fontSize: '0.9rem', cursor: 'pointer', fontFamily: 'inherit',
            }}>
              Çıkış Yap ({userName})
            </button>
          ) : (
            <button onClick={() => { setMenuOpen(false); setAuthOpen(true) }} style={{
              marginTop: '16px', padding: '12px',
              background: '#F55D00', border: 'none',
              borderRadius: '10px', color: '#fff',
              fontSize: '0.9rem', cursor: 'pointer', fontFamily: 'inherit',
              fontWeight: 500,
            }}>
              Giriş Yap
            </button>
          )}
        </div>
      )}

      {authOpen && (
        <AuthModal
          onClose={() => setAuthOpen(false)}
          onSuccess={(u) => setUser(u)}
        />
      )}

      <style>{`
        @media (min-width: 769px) {
          .hamburger-btn { display: none !important; }
        }
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
        }
      `}</style>
    </>
  )
}