'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import Link from 'next/link'

export default function Blog() {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    supabase
      .from('blog_posts')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .then(({ data }) => setPosts(data || []))
  }, [])

  const thumbColors = {
    t1: '#F5EDE0',
    t2: '#EDF5E0',
    t3: '#F5E8E0',
  }

  return (
    <section id="blog" style={{ padding: '100px 80px', background: 'var(--cream)' }}>
      <div style={{ marginBottom: '60px' }}>
        <span style={{
          fontSize: '0.75rem', letterSpacing: '0.12em',
          textTransform: 'uppercase', color: 'var(--rust)',
          fontWeight: 500, display: 'block', marginBottom: '12px',
        }}>
          Yazılar & Rehberler
        </span>
        <h2 style={{
          fontFamily: 'var(--font-playfair)',
          fontSize: 'clamp(2rem, 3.5vw, 3rem)',
          color: 'var(--dark)',
        }}>
          Ankara&apos;dan <em style={{ color: 'var(--rust)', fontStyle: 'italic' }}>Hikayeler</em>
        </h2>
        <p style={{
          marginTop: '16px', fontSize: '1rem',
          color: 'var(--text-muted)', maxWidth: '500px', lineHeight: 1.7,
        }}>
          Restoranlar, mahalleler, lezzetler ve şehrin ruhunu anlatan içerikler.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '32px',
      }}>
        {posts.map(post => (
          <Link
            key={post.id}
            href={post.slug ? `/blog/${post.slug}` : '#'}
            style={{ textDecoration: 'none' }}
          >
            <div
              style={{
                background: '#fff', borderRadius: '12px',
                overflow: 'hidden', border: '1px solid var(--border)',
                cursor: 'pointer', transition: 'transform 0.25s, box-shadow 0.25s',
                height: '100%',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-6px)'
                e.currentTarget.style.boxShadow = '0 20px 48px rgba(0,0,0,0.1)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <div style={{
                height: '200px',
                background: thumbColors[post.thumb_class] || '#F5EDE0',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '3rem',
              }}>
                {post.emoji}
              </div>
              <div style={{ padding: '24px' }}>
                <div style={{
                  fontSize: '0.72rem', letterSpacing: '0.1em',
                  textTransform: 'uppercase', color: 'var(--rust)',
                  fontWeight: 500, marginBottom: '10px',
                }}>
                  {post.category}
                </div>
                <div style={{
                  fontFamily: 'var(--font-playfair)',
                  fontSize: '1.2rem', color: 'var(--dark)',
                  lineHeight: 1.3, marginBottom: '12px',
                }}>
                  {post.title}
                </div>
                <div style={{
                  fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6,
                }}>
                  {post.excerpt}
                </div>
              </div>
              <div style={{
                padding: '16px 24px',
                borderTop: '1px solid var(--border)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  {post.read_time}
                </span>
                <span style={{ fontSize: '0.78rem', color: 'var(--rust)', fontWeight: 500 }}>
                  Oku →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}