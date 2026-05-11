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
  }

  const links = ['Harita', 'Kategoriler', 'Yorumlar', 'Blog']
  const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || ''

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 40px', height: '64px',
        background: 'rgba(250,247,242,0.94)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border)',
      }}>
        <Link href="/" style={{
          fontFamily: 'var(--font-poppins)', fontSize: '1.4rem',
          fontWeight: 700, color: 'var(--dark)', textDecoration: 'none',
        }}>
          bizzat<span style={{color: 'var(--rust)'}}>ankara</span>
        </Link>

        <ul style={{display: 'flex', gap: '32px', listStyle: 'none', alignItems: 'center'}}>
          {links.map(item => (
            <li key={item}>
              <Link href={'/#' + item.toLowerCase()} style={{
                textDecoration: 'none', color: 'var(--text-muted)',
                fontSize: '0.88rem', fontWeight: 500,
                letterSpacing: '0.04em', textTransform: 'uppercase',
              }}>
                {item}
              </Link>
            </li>
          ))}
          <li>
            <Link href="/#partner" style={{
              background: 'var(--rust)', color: '#fff',
              padding: '8px 20px', borderRadius: '100px',
              textDecoration: 'none', fontSize: '0.88rem',
            }}>
              İş Birliği
            </Link>
          </li>
          <li>
            {user ? (
              <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%',
                  background: 'var(--rust)', color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.72rem', fontWeight: 600,
                }}>
                  {userName.charAt(0).toUpperCase()}
                </div>
                <span style={{fontSize: '0.85rem', color: 'var(--text-muted)'}}>
                  {userName}
                </span>
                <button onClick={handleLogout} style={{
                  padding: '7px 18px', borderRadius: '100px',
                  border: '1.5px solid var(--border)', background: 'none',
                  fontSize: '0.82rem', color: 'var(--text-muted)', cursor: 'pointer',
                  fontFamily: 'inherit',
                }}>
                  Çıkış
                </button>
              </div>
            ) : (
              <button onClick={() => setAuthOpen(true)} style={{
                padding: '7px 18px', borderRadius: '100px',
                border: '1.5px solid var(--border)', background: 'none',
                fontSize: '0.82rem', color: 'var(--text-muted)', cursor: 'pointer',
                fontFamily: 'inherit',
              }}>
                Giriş Yap
              </button>
            )}
          </li>
        </ul>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            flexDirection: 'column', gap: '5px',
            background: 'none', border: 'none', cursor: 'pointer',
            padding: '8px',
          }}
        >
          <span style={{display:'block',width:'22px',height:'2px',background:'var(--dark)',borderRadius:'2px',marginBottom:'5px'}}/>
          <span style={{display:'block',width:'22px',height:'2px',background:'var(--dark)',borderRadius:'2px',marginBottom:'5px'}}/>
          <span style={{display:'block',width:'22px',height:'2px',background:'var(--dark)',borderRadius:'2px'}}/>
        </button>
      </nav>

      {menuOpen && (
        <div style={{
          position: 'fixed', top: '64px', left: 0, right: 0, bottom: 0,
          zIndex: 999, background: 'var(--cream)',
          padding: '32px 28px',
        }}>
          {links.map(item => (
            <Link
              key={item}
              href={'/#' + item.toLowerCase()}
              onClick={() => setMenuOpen(false)}
              style={{
                display: 'block', padding: '14px 0',
                fontSize: '1.1rem', fontWeight: 500,
                color: 'var(--dark)', textDecoration: 'none',
                borderBottom: '1px solid var(--border)',
              }}
            >
              {item}
            </Link>
          ))}
          {user ? (
            <button onClick={handleLogout} style={{
              display: 'block', padding: '14px 0',
              fontSize: '1.1rem', color: 'var(--rust)',
              background: 'none', border: 'none', cursor: 'pointer',
              fontFamily: 'inherit',
            }}>
              Çıkış Yap
            </button>
          ) : (
            <button onClick={() => { setMenuOpen(false); setAuthOpen(true) }} style={{
              display: 'block', padding: '14px 0',
              fontSize: '1.1rem', color: 'var(--rust)',
              background: 'none', border: 'none', cursor: 'pointer',
              fontFamily: 'inherit',
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
    </>
  )
}