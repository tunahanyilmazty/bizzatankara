'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function Categories() {
  const [categories, setCategories] = useState([])
  const [hoveredId, setHoveredId] = useState(null)

  useEffect(() => {
    supabase
      .from('categories')
      .select('*')
      .order('sort_order')
      .then(({ data }) => setCategories(data || []))
  }, [])

  return (
    <section id="kategoriler" style={{ background: '#1A1208', padding: '80px 0' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 80px' }}>
        <div style={{ marginBottom: '48px' }}>
          <span style={{
            fontSize: '0.75rem', letterSpacing: '0.12em',
            textTransform: 'uppercase', color: '#F55D00',
            fontWeight: 500, display: 'block', marginBottom: '12px',
          }}>
            Ne Arıyorsun?
          </span>
          <h2 style={{
            fontFamily: 'var(--font-playfair)',
            fontSize: 'clamp(2rem, 3.5vw, 3rem)',
            color: '#FAF7F2', lineHeight: 1.15,
          }}>
            Kategoriye Göre <em style={{ color: '#F55D00', fontStyle: 'italic' }}>Keşfet</em>
          </h2>
          <p style={{
            marginTop: '16px', fontSize: '1rem',
            color: 'rgba(250,247,242,0.6)', maxWidth: '500px', lineHeight: 1.7,
          }}>
            Eski Ankara&apos;nın sokak lezzetlerinden modern bistrolara kadar her damak zevkine uygun seçenekler.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '1px',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '12px',
          overflow: 'hidden',
        }}>
          {categories.map(cat => (
            <div
              key={cat.id}
              onMouseEnter={() => setHoveredId(cat.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{
                background: hoveredId === cat.id ? 'rgba(245,93,0,0.15)' : 'rgba(255,255,255,0.03)',
                padding: '32px 28px',
                borderRight: '1px solid rgba(255,255,255,0.06)',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
            >
              <span style={{ fontSize: '2rem', display: 'block', marginBottom: '14px' }}>
                {cat.emoji}
              </span>
              <div style={{
                fontFamily: 'var(--font-playfair)',
                fontSize: '1.1rem', color: '#FAF7F2', marginBottom: '6px',
              }}>
                {cat.name}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'rgba(250,247,242,0.4)' }}>
                {cat.count}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}