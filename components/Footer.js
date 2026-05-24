export default function Footer() {
  return (
    <footer style={{
      background: '#1A1208',
      color: 'rgba(250,247,242,0.6)',
      padding: '60px 80px 32px',
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr 1fr 1fr',
        gap: '48px', marginBottom: '48px',
      }}>
        <div>
          <div style={{
            fontFamily: 'var(--font-poppins)', fontWeight: 700,
            fontSize: '1.6rem', color: '#FAF7F2',
            marginBottom: '16px', letterSpacing: '-0.02em',
          }}>
            bizzat<span style={{ color: '#F55D00' }}>ankara</span>
          </div>
          <p style={{ fontSize: '0.88rem', lineHeight: 1.7, maxWidth: '280px' }}>
            Ankara&apos;yı gerçekten bilen birinin gözünden şehrin en iyi mekanları, hikayeleri ve rehberleri.
          </p>
        </div>

        {[
          { title: 'Keşfet', links: ['Harita', 'Kategoriler', 'Yeni Açılanlar', 'Editörün Seçimi'] },
          { title: 'İçerik', links: ['Blog', 'Mahalle Rehberleri', 'Video', 'Tarifler'] },
          { title: 'İletişim', links: ['İş Birliği', 'Instagram', 'Mekan Öner', 'Hakkında'] },
        ].map(col => (
          <div key={col.title}>
            <h4 style={{
              color: '#FAF7F2', fontSize: '0.82rem',
              letterSpacing: '0.08em', textTransform: 'uppercase',
              marginBottom: '16px',
            }}>{col.title}</h4>
            <ul style={{ listStyle: 'none' }}>
              {col.links.map(item => (
                <li key={item} style={{ marginBottom: '10px' }}>
                  <a href="#" style={{
                    color: 'rgba(250,247,242,0.55)', textDecoration: 'none',
                    fontSize: '0.88rem',
                  }}>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.08)',
        paddingTop: '24px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <p style={{ fontSize: '0.8rem' }}>
          © 2025 bizzatankara — Tüm hakları saklıdır.
        </p>
        <div style={{ display: 'flex', gap: '20px' }}>
          {['Instagram', 'Gizlilik'].map(item => (
            <a key={item} href="#" style={{
              color: 'rgba(250,247,242,0.4)', textDecoration: 'none',
              fontSize: '0.82rem', letterSpacing: '0.05em', textTransform: 'uppercase',
            }}>
              {item}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}