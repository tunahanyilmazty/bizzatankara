import { supabase } from '../../../lib/supabase'
import Navbar from '../../../components/Navbar'
import Footer from '../../../components/Footer'
import Link from 'next/link'

export async function generateMetadata({ params }) {
  const { slug } = await params
  const { data: post } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!post) return { title: 'Yazi bulunamadi' }

  return {
    title: `${post.title} — bizzatankara`,
    description: post.excerpt,
  }
}

export async function generateStaticParams() {
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('slug')
    .not('slug', 'is', null)

  return (posts || []).map(p => ({ slug: p.slug }))
}

export default async function BlogPost({ params }) {
  const { slug } = await params

  const { data: post } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!post) {
    return (
      <>
        <Navbar />
        <main style={{ paddingTop: '64px', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>😕</div>
            <h1 style={{ fontFamily: 'var(--font-playfair)', fontSize: '2rem', marginBottom: '16px' }}>Yazi bulunamadi</h1>
            <Link href="/" style={{ color: '#F55D00', textDecoration: 'none' }}>Ana sayfaya don</Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  const thumbColors = { t1: '#F5EDE0', t2: '#EDF5E0', t3: '#F5E8E0' }
  const igUrl = 'https://www.instagram.com/bizzatankara'

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: '64px' }}>

        <div style={{
          height: '320px',
          background: thumbColors[post.thumb_class] || '#F5EDE0',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '5rem',
        }}>
          {post.emoji}
        </div>

        <div style={{ maxWidth: '720px', margin: '0 auto', padding: '60px 24px' }}>

          <div style={{ marginBottom: '24px' }}>
            <Link href="/#blog" style={{ fontSize: '0.82rem', color: '#7A6A5A', textDecoration: 'none' }}>
              Blog&apos;a don
            </Link>
          </div>

          <div style={{ fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#F55D00', fontWeight: 500, marginBottom: '16px' }}>
            {post.category}
          </div>

          <h1 style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#1A1208', lineHeight: 1.15, marginBottom: '24px' }}>
            {post.title}
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 0', borderTop: '1px solid #E8DDD0', borderBottom: '1px solid #E8DDD0', marginBottom: '40px' }}>
            <span style={{ fontSize: '0.82rem', color: '#7A6A5A' }}>⏱ {post.read_time}</span>
            <span style={{ fontSize: '0.82rem', color: '#7A6A5A' }}>
              📅 {new Date(post.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          </div>

          <p style={{ fontSize: '1.1rem', color: '#7A6A5A', lineHeight: 1.8, marginBottom: '32px', fontStyle: 'italic' }}>
            {post.excerpt}
          </p>

          <div style={{ background: '#FAF7F2', borderRadius: '16px', padding: '32px', border: '1px solid #E8DDD0', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '12px' }}>✍️</div>
            <p style={{ fontSize: '0.95rem', color: '#7A6A5A', lineHeight: 1.7, marginBottom: '20px' }}>
              Bu yazinin tam icerigi yakinda eklenecek. Instagram&apos;da{' '}
              <strong style={{ color: '#F55D00' }}>@bizzatankara</strong>{' '}
              hesabini takip ederek guncel iceriklere ulasabilirsin.
            </p>
            <a href={igUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', background: '#F55D00', color: '#fff', padding: '12px 28px', borderRadius: '100px', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}>
              Instagram&apos;da Takip Et
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}