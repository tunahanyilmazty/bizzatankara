'use client'

import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function AuthModal({ onClose, onSuccess }) {
  const [tab, setTab] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit() {
    setLoading(true)
    setError('')

    if (tab === 'login') {
      const { data, error } = await supabase.auth.signInWithPassword({
        email, password
      })
      if (error) {
        setError('E-posta veya şifre hatalı.')
      } else {
        onSuccess(data.user)
        onClose()
      }
    } else {
      const { data, error } = await supabase.auth.signUp({
        email, password,
        options: { data: { name } }
      })
      if (error) {
        setError(error.message)
      } else {
        // Profil oluştur
        await supabase.from('profiles').insert({
          id: data.user.id,
          name,
          email,
          is_admin: email === 'admin@bizzatankara.com'
        })
        onSuccess(data.user)
        onClose()
      }
    }
    setLoading(false)
  }

  const inputStyle = {
    width: '100%', padding: '11px 14px',
    border: '1.5px solid var(--border)', borderRadius: '10px',
    fontFamily: 'inherit', fontSize: '0.88rem',
    color: 'var(--dark)', outline: 'none',
    background: 'var(--cream)', marginBottom: '12px',
  }

  const btnStyle = {
    width: '100%', padding: '12px',
    background: 'var(--rust)', color: '#fff',
    border: 'none', borderRadius: '10px',
    fontFamily: 'inherit', fontSize: '0.9rem',
    fontWeight: 500, cursor: 'pointer',
    marginTop: '4px', opacity: loading ? 0.7 : 1,
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 2000,
      background: 'rgba(26,18,8,0.6)',
      backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        background: '#fff', borderRadius: '20px',
        padding: '40px', width: '100%', maxWidth: '420px',
        boxShadow: '0 32px 80px rgba(0,0,0,0.18)',
        position: 'relative',
      }}>
        <button onClick={onClose} style={{
          position: 'absolute', top: '16px', right: '16px',
          background: 'none', border: 'none', cursor: 'pointer',
          fontSize: '1.2rem', color: 'var(--text-muted)',
        }}>✕</button>

        <div style={{
          fontFamily: 'var(--font-poppins)', fontWeight: 700,
          fontSize: '1.1rem', color: 'var(--dark)', marginBottom: '6px',
        }}>
          bizzat<span style={{color: 'var(--rust)'}}>ankara</span>
        </div>

        <h3 style={{
          fontFamily: 'var(--font-playfair)',
          fontSize: '1.4rem', color: 'var(--dark)', marginBottom: '24px',
        }}>
          {tab === 'login' ? 'Hoş geldin' : 'Üye ol'}
        </h3>

        {/* Sekmeler */}
        <div style={{
          display: 'flex', borderBottom: '2px solid var(--border)',
          marginBottom: '24px',
        }}>
          {['login', 'register'].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              flex: 1, padding: '10px', textAlign: 'center',
              fontSize: '0.85rem', fontWeight: 500,
              cursor: 'pointer', background: 'none', border: 'none',
              color: tab === t ? 'var(--rust)' : 'var(--text-muted)',
              borderBottom: tab === t ? '2px solid var(--rust)' : '2px solid transparent',
              marginBottom: '-2px', fontFamily: 'inherit',
            }}>
              {t === 'login' ? 'Giriş Yap' : 'Üye Ol'}
            </button>
          ))}
        </div>

        {tab === 'register' && (
          <input
            style={inputStyle}
            type="text"
            placeholder="Adın Soyadın"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        )}

        <input
          style={inputStyle}
          type="email"
          placeholder="E-posta adresi"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <input
          style={inputStyle}
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
        />

        {error && (
          <div style={{
            color: '#c00', fontSize: '0.82rem',
            marginBottom: '12px', padding: '8px 12px',
            background: '#fff5f5', borderRadius: '8px',
          }}>
            {error}
          </div>
        )}

        <button style={btnStyle} onClick={handleSubmit} disabled={loading}>
          {loading ? 'Bekle...' : tab === 'login' ? 'Giriş Yap' : 'Üye Ol'}
        </button>

        <p style={{
          fontSize: '0.72rem', color: 'var(--text-muted)',
          textAlign: 'center', marginTop: '16px',
        }}>
          Admin: admin@bizzatankara.com
        </p>
      </div>
    </div>
  )
}