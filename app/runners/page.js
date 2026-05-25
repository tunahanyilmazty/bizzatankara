'use client'

import { useEffect, useRef } from 'react'

export default function RunnersPage() {
  const lineRef = useRef(null)
  const runnerRef = useRef(null)

  useEffect(() => {
    function handleScroll() {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = Math.min(scrollTop / docHeight, 1)

      if (lineRef.current) {
        lineRef.current.style.width = (progress * 100) + '%'
      }

      if (runnerRef.current) {
        const pct = Math.min(progress * 100, 96)
        runnerRef.current.style.left = pct + '%'
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const GOOGLE_FORM_URL = 'https://forms.google.com'

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@700;800;900&family=DM+Sans:wght@300;400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        .rp{background:#0A0A0A;color:#FAF7F2;font-family:'DM Sans',sans-serif;overflow-x:hidden}

        .scroll-line-track{position:fixed;top:64px;left:0;right:0;height:4px;background:rgba(255,255,255,0.06);z-index:99;overflow:visible}
        .scroll-line-fill{height:100%;width:0%;background:linear-gradient(90deg,#120a94,#2D6FFF);transition:width 0.08s linear;border-radius:0 2px 2px 0;box-shadow:0 0 10px rgba(45,111,255,0.5)}
        .runner-on-bar{position:fixed;top:50px;left:0%;font-size:1.6rem;line-height:1;transition:left 0.08s linear;pointer-events:none;filter:drop-shadow(0 0 6px rgba(45,111,255,0.8));z-index:101}
        @keyframes runBounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}
        .runner-on-bar{animation:runBounce 0.35s ease-in-out infinite}

        .rnav{position:fixed;top:0;left:0;right:0;z-index:100;display:flex;align-items:center;justify-content:space-between;padding:0 48px;height:64px;background:rgba(10,10,10,0.9);backdrop-filter:blur(12px);border-bottom:1px solid rgba(255,255,255,0.06)}
        .rlogo{font-family:'Poppins',sans-serif;font-weight:800;font-size:1.1rem;letter-spacing:-0.02em;color:#FAF7F2;text-decoration:none}
        .rlogo span{color:#2D6FFF}
        .rnav-links{display:flex;gap:28px;list-style:none;align-items:center}
        .rnav-links a{color:rgba(250,247,242,0.5);text-decoration:none;font-size:0.82rem;letter-spacing:0.06em;text-transform:uppercase;transition:color 0.2s}
        .rnav-links a:hover{color:#FAF7F2}
        .join-btn{background:#120a94!important;color:#fff!important;padding:8px 20px;border-radius:100px;font-size:0.82rem;font-weight:600;border:1px solid #2D6FFF!important}
        .join-btn:hover{background:#2D6FFF!important}

        .hero{min-height:100vh;display:flex;flex-direction:column;justify-content:center;padding:120px 48px 80px;position:relative;overflow:hidden}
        .hero::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 60% 50%,rgba(18,10,148,0.15) 0%,transparent 70%);pointer-events:none}
        .hero-tag{display:inline-flex;align-items:center;gap:10px;font-size:0.75rem;letter-spacing:0.15em;text-transform:uppercase;color:#2D6FFF;font-weight:600;margin-bottom:32px}
        .hero-tag::before{content:'';width:32px;height:1px;background:#2D6FFF}
        .hero-title{font-family:'Poppins',sans-serif;font-weight:900;font-size:clamp(3.5rem,10vw,8rem);line-height:0.95;letter-spacing:-0.04em;margin-bottom:32px;position:relative;z-index:1}
        .accent{color:#2D6FFF}
        .outline{-webkit-text-stroke:2px rgba(45,111,255,0.4);color:transparent}
        .hero-sub{font-size:clamp(1rem,2.5vw,1.2rem);color:rgba(250,247,242,0.55);max-width:480px;line-height:1.7;margin-bottom:48px}
        .hero-actions{display:flex;gap:16px;align-items:center;flex-wrap:wrap}
        .btn-p{background:#120a94;color:#fff;padding:16px 36px;border-radius:100px;font-size:0.95rem;font-weight:600;text-decoration:none;letter-spacing:0.02em;transition:all 0.2s;display:inline-block;font-family:'DM Sans',sans-serif;border:1px solid #2D6FFF}
        .btn-p:hover{background:#2D6FFF;transform:translateY(-2px);box-shadow:0 12px 32px rgba(45,111,255,0.4)}
        .btn-g{color:rgba(250,247,242,0.6);font-size:0.9rem;text-decoration:none;display:flex;align-items:center;gap:8px;transition:color 0.2s;font-family:'DM Sans',sans-serif}
        .btn-g:hover{color:#FAF7F2}

        .hero-track{position:absolute;bottom:0;left:0;right:0;height:80px;pointer-events:none;overflow:hidden}
        .hero-track svg{width:100%;height:100%}

        .stats-bar{background:linear-gradient(135deg,#120a94,#1a14b8);padding:32px 48px;display:flex;gap:0;overflow-x:auto}
        .stat-item{flex:1;text-align:center;padding:0 32px;border-right:1px solid rgba(255,255,255,0.15);min-width:120px}
        .stat-item:last-child{border-right:none}
        .stat-num{font-family:'Poppins',sans-serif;font-weight:900;font-size:2.5rem;color:#fff;display:block;letter-spacing:-0.04em}
        .stat-label{font-size:0.72rem;color:rgba(255,255,255,0.6);letter-spacing:0.08em;text-transform:uppercase;margin-top:4px;display:block}

        .section{padding:100px 48px}
        .section-tag{font-size:0.72rem;letter-spacing:0.15em;text-transform:uppercase;color:#2D6FFF;font-weight:600;display:block;margin-bottom:16px}
        .section-title{font-family:'Poppins',sans-serif;font-weight:800;font-size:clamp(2rem,5vw,3.5rem);line-height:1.05;letter-spacing:-0.03em;margin-bottom:24px}
        .section-sub{font-size:1rem;color:rgba(250,247,242,0.55);max-width:480px;line-height:1.7;margin-bottom:48px}

        .values-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.06);border-radius:16px;overflow:hidden;margin-top:48px}
        .value-card{background:#0F0F0F;padding:40px 32px;transition:background 0.2s}
        .value-card:hover{background:#111122}
        .value-icon{font-size:2rem;margin-bottom:20px;display:block}
        .value-title{font-family:'Poppins',sans-serif;font-weight:700;font-size:1.2rem;margin-bottom:12px;color:#FAF7F2}
        .value-desc{font-size:0.88rem;color:rgba(250,247,242,0.45);line-height:1.7}

        .routes-section{padding:100px 48px;background:#0A0A18}
        .routes-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:16px;margin-top:48px}
        .route-card{background:#0F0F1E;border:1px solid rgba(45,111,255,0.12);border-radius:16px;padding:28px;transition:border-color 0.2s,transform 0.2s;cursor:pointer}
        .route-card:hover{border-color:rgba(45,111,255,0.5);transform:translateY(-4px)}
        .route-emoji{font-size:1.8rem;margin-bottom:16px;display:block}
        .route-name{font-family:'Poppins',sans-serif;font-weight:700;font-size:1.05rem;color:#FAF7F2;margin-bottom:8px}
        .route-meta{display:flex;gap:12px;flex-wrap:wrap;margin-bottom:12px}
        .route-badge{font-size:0.7rem;padding:3px 10px;border-radius:100px;font-weight:500;letter-spacing:0.04em}
        .badge-distance{background:rgba(45,111,255,0.15);color:#2D6FFF}
        .badge-easy{background:rgba(42,122,74,0.15);color:#4ABA7A}
        .badge-medium{background:rgba(212,168,71,0.15);color:#D4A847}
        .badge-hard{background:rgba(200,50,50,0.15);color:#E05050}
        .route-desc{font-size:0.82rem;color:rgba(250,247,242,0.4);line-height:1.6}

        .events-section{padding:100px 48px}
        .event-card{display:flex;gap:24px;align-items:flex-start;padding:28px 0;border-bottom:1px solid rgba(255,255,255,0.06)}
        .event-date{flex-shrink:0;text-align:center;background:rgba(18,10,148,0.2);border:1px solid rgba(45,111,255,0.25);border-radius:12px;padding:12px 16px;min-width:64px}
        .event-day{font-family:'Poppins',sans-serif;font-weight:800;font-size:1.6rem;color:#2D6FFF;display:block;line-height:1}
        .event-month{font-size:0.68rem;color:rgba(45,111,255,0.7);text-transform:uppercase;letter-spacing:0.1em}
        .event-info{flex:1}
        .event-title{font-family:'Poppins',sans-serif;font-weight:700;font-size:1.05rem;color:#FAF7F2;margin-bottom:6px}
        .event-meta{font-size:0.8rem;color:rgba(250,247,242,0.4);margin-bottom:8px}
        .event-desc{font-size:0.85rem;color:rgba(250,247,242,0.55);line-height:1.6}
        .event-badge{flex-shrink:0;background:rgba(18,10,148,0.2);border:1px solid rgba(45,111,255,0.25);color:#2D6FFF;font-size:0.72rem;padding:4px 12px;border-radius:100px;font-weight:500;align-self:flex-start;margin-top:4px}

        .cta-section{padding:120px 48px;text-align:center;background:#080818;position:relative;overflow:hidden}
        .cta-section::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 50% 50%,rgba(18,10,148,0.2) 0%,transparent 70%)}
        .cta-title{font-family:'Poppins',sans-serif;font-weight:900;font-size:clamp(2.5rem,8vw,6rem);letter-spacing:-0.04em;line-height:0.95;margin-bottom:24px;position:relative;z-index:1}
        .cta-sub{font-size:1.05rem;color:rgba(250,247,242,0.5);max-width:420px;margin:0 auto 48px;line-height:1.7;position:relative;z-index:1}

        .rfooter{background:#050510;padding:40px 48px;display:flex;align-items:center;justify-content:space-between;border-top:1px solid rgba(45,111,255,0.1);flex-wrap:wrap;gap:16px}
        .rfooter p{font-size:0.8rem;color:rgba(250,247,242,0.3)}
        .rfooter a{font-size:0.8rem;color:rgba(250,247,242,0.3);text-decoration:none;transition:color 0.2s}
        .rfooter a:hover{color:#2D6FFF}

        @media(max-width:768px){
          .rnav{padding:0 24px}
          .rnav-links{display:none}
          .hero{padding:100px 24px 60px}
          .stats-bar{padding:24px}
          .stat-item{padding:0 16px;min-width:100px}
          .stat-num{font-size:1.6rem}
          .section{padding:60px 24px}
          .routes-section{padding:60px 24px}
          .events-section{padding:60px 24px}
          .cta-section{padding:80px 24px}
          .rfooter{padding:32px 24px;flex-direction:column;text-align:center}
          .values-grid{grid-template-columns:1fr}
          .event-card{flex-direction:column;gap:16px}
          .runner-on-bar{display:none}
        }
      `}</style>

      {/* Scroll progress bar */}
      <div className="scroll-line-track">
        <div className="scroll-line-fill" ref={lineRef} />
      </div>

      {/* Şimşek — bar üzerinde sağa gidiyor */}
      <div className="runner-on-bar" ref={runnerRef}>⚡</div>

      <div className="rp">

        <nav className="rnav">
          <a href="/runners" className="rlogo">bizzat <span>runners</span></a>
          <ul className="rnav-links">
            <li><a href="#komunite">Komünite</a></li>
            <li><a href="#rotalar">Rotalar</a></li>
            <li><a href="#etkinlikler">Etkinlikler</a></li>
            <li><a href={GOOGLE_FORM_URL} target="_blank" rel="noopener noreferrer" className="join-btn">Katıl</a></li>
          </ul>
        </nav>

        <section className="hero">
          <div className="hero-tag">Ankara Koşu Komünitesi</div>
          <h1 className="hero-title">
            RUN<br />
            <span className="accent">BEYOND</span><br />
            <span className="outline">RUNNING</span>
          </h1>
          <p className="hero-sub">
            Sadece koşmuyoruz. Sınırları aşıyoruz, şehri keşfediyoruz, birlikte büyüyoruz. Ankara&apos;nın ilk gerçek koşu komünitesine katıl.
          </p>
          <div className="hero-actions">
            <a href={GOOGLE_FORM_URL} target="_blank" rel="noopener noreferrer" className="btn-p">
              Komüniteye Katıl →
            </a>
            <a href="#rotalar" className="btn-g">Rotaları keşfet ↓</a>
          </div>
          <div className="hero-track">
            <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
              <path d="M0,40 C200,20 400,60 600,40 C800,20 1000,60 1200,40 C1300,30 1380,35 1440,40" fill="none" stroke="rgba(45,111,255,0.15)" strokeWidth="1" strokeDasharray="8 4"/>
              <path d="M0,40 C200,20 400,60 600,40 C800,20 1000,60 1200,40 C1300,30 1380,35 1440,40" fill="none" stroke="#2D6FFF" strokeWidth="2" strokeDasharray="1440" strokeDashoffset="1440">
                <animate attributeName="stroke-dashoffset" from="1440" to="0" dur="2.5s" begin="0.5s" fill="freeze" calcMode="ease"/>
              </path>
            </svg>
          </div>
        </section>

        <div className="stats-bar">
          {[
            { num: '∞', label: 'Kilometre Önünüzde' },
            { num: '0', label: 'Sınır' },
            { num: '1', label: 'Komünite' },
            { num: 'İLK', label: 'Koşu Yakında' },
          ].map(s => (
            <div key={s.label} className="stat-item">
              <span className="stat-num">{s.num}</span>
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </div>

        <section className="section" id="komunite">
          <span className="section-tag">Neden bizzat runners?</span>
          <h2 className="section-title">
            Koşu bir araç.<br />
            <span className="accent">Komünite</span> amaç.
          </h2>
          <p className="section-sub">
            Ankara&apos;nın sokaklarında, parkurlarında ve doğasında birlikte koşmak için bir araya geliyoruz. Hız fark etmez, deneyim fark etmez — sadece istek yeter.
          </p>
          <div className="values-grid">
            {[
              { icon: '🤝', title: 'Birlikte Daha Güçlü', desc: 'Yalnız koşmak zordur. Yanında koşanlar olduğunda sınırların nerede bittiğini keşfedersin.' },
              { icon: '🏙️', title: 'Şehri Keşfet', desc: 'Ankara\'nın gizli kalmış köşelerini koşarak keşfet. Her rota yeni bir hikaye.' },
              { icon: '📈', title: 'Birlikte Büyü', desc: 'İlk 5K\'ndan maraton hazırlığına kadar her adımda yanındayız.' },
              { icon: '🔥', title: 'Sınırları Aş', desc: '"Yapamam" dediğin an, tam olarak başlaman gereken andır.' },
              { icon: '📍', title: 'Ankara\'ya Özgü', desc: 'Başkent\'in enerjisiyle dolu rotalar, Ankaralılar için tasarlanmış bir komünite.' },
              { icon: '🎯', title: 'Hedef Koy, Ulaş', desc: 'Bireysel hedeflerini komünitenin desteğiyle gerçeğe dönüştür.' },
            ].map(v => (
              <div key={v.title} className="value-card">
                <span className="value-icon">{v.icon}</span>
                <div className="value-title">{v.title}</div>
                <div className="value-desc">{v.desc}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="routes-section" id="rotalar">
          <span className="section-tag">Ankara&apos;da Koşu Rotaları</span>
          <h2 className="section-title">
            Her seviyeye bir <span className="accent">parkur</span>.
          </h2>
          <p className="section-sub">Şehrin en güzel koşu rotalarını sizin için işaretledik.</p>
          <div className="routes-grid">
            {[
              { emoji: '🌳', name: 'AOÇ Çevresi', distance: '8 km', difficulty: 'easy', diffLabel: 'Kolay', desc: 'Atatürk Orman Çiftliği\'nin huzurlu yollarında düz ve keyifli bir rota.' },
              { emoji: '🎓', name: 'ODTÜ Kampüs Turu', distance: '12 km', difficulty: 'medium', diffLabel: 'Orta', desc: 'Ağaçlık kampüs yollarında hafif inişli çıkışlı parkur.' },
              { emoji: '💧', name: 'Eymir Gölü', distance: '10 km', difficulty: 'easy', diffLabel: 'Kolay', desc: 'Göl çevresinde nefes kesen manzaralarla tamamlanan düz rota.' },
              { emoji: '🌿', name: 'Botanik Bahçesi', distance: '6 km', difficulty: 'easy', diffLabel: 'Kolay', desc: 'Şehrin kalbinde yeşil bir sığınak. Kısa ama etkili bir antrenman rotası.' },
              { emoji: '🏛️', name: 'Anıtkabir Çevresi', distance: '9 km', difficulty: 'medium', diffLabel: 'Orta', desc: 'Tarihin içinden geçen kentsel bir rota.' },
              { emoji: '⛰️', name: 'Dikmen Vadisi', distance: '15 km', difficulty: 'hard', diffLabel: 'Zorlu', desc: 'Vadinin inişli çıkışlı parkurunda dayanıklılık antrenmanı.' },
            ].map(route => (
              <div key={route.name} className="route-card">
                <span className="route-emoji">{route.emoji}</span>
                <div className="route-name">{route.name}</div>
                <div className="route-meta">
                  <span className="route-badge badge-distance">📏 {route.distance}</span>
                  <span className={`route-badge badge-${route.difficulty}`}>{route.diffLabel}</span>
                </div>
                <div className="route-desc">{route.desc}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="events-section" id="etkinlikler">
          <span className="section-tag">Yaklaşan Etkinlikler</span>
          <h2 className="section-title">
            İlk buluşma <span className="accent">yakında</span>.
          </h2>
          <p className="section-sub">
            Henüz ilk koşumuzu yapmadık — ama çok yakında. Şimdiden kaydol, ilk bildirimi al.
          </p>
          <div style={{ marginTop: '48px' }}>
            {[
              { day: '?', month: 'Haziran', title: 'İlk Buluşma Koşusu', meta: 'AOÇ Çevresi · 8 km · Başlangıç dostu', desc: 'bizzat runners\'ın ilk resmi koşusu. Tüm seviyelere açık.', badge: 'Yakında' },
              { day: '?', month: 'Temmuz', title: 'Haftalık Grup Koşusu', meta: 'Eymir Gölü · 10 km · Orta tempo', desc: 'Her hafta tekrarlanan grup koşumuz. Göl kenarında güneşin doğuşuyla.', badge: 'Planlama' },
              { day: '?', month: 'Ağustos', title: 'ODTÜ Gece Koşusu', meta: 'ODTÜ Kampüs · 12 km · Gece', desc: 'Kampüsün serinliğinde özel bir deneyim. Sınırlı kontenjan.', badge: 'Planlama' },
            ].map(event => (
              <div key={event.title} className="event-card">
                <div className="event-date">
                  <span className="event-day">{event.day}</span>
                  <span className="event-month">{event.month}</span>
                </div>
                <div className="event-info">
                  <div className="event-title">{event.title}</div>
                  <div className="event-meta">{event.meta}</div>
                  <div className="event-desc">{event.desc}</div>
                </div>
                <div className="event-badge">{event.badge}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="cta-section">
          <h2 className="cta-title">
            HAZIR<br />
            <span className="accent">MISIN?</span>
          </h2>
          <p className="cta-sub">
            İlk adımı at. Komüniteye katıl, etkinliklerden haberdar ol, birlikte koş.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
            <a href={GOOGLE_FORM_URL} target="_blank" rel="noopener noreferrer" className="btn-p" style={{ fontSize: '1rem', padding: '18px 48px' }}>
              Başvuru Formunu Doldur →
            </a>
            <a href="/" className="btn-g" style={{ color: 'rgba(250,247,242,0.4)' }}>
              bizzatankara&apos;ya dön
            </a>
          </div>
        </section>

        <footer className="rfooter">
          <div>
            <a href="/runners" style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 800, color: '#FAF7F2', textDecoration: 'none', fontSize: '1rem' }}>
              bizzat <span style={{ color: '#2D6FFF' }}>runners</span>
            </a>
            <p style={{ marginTop: '4px' }}>Run Beyond Running — Ankara</p>
          </div>
          <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
            <a href="/">bizzatankara</a>
            <a href="https://instagram.com/bizzatankara" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href={GOOGLE_FORM_URL} target="_blank" rel="noopener noreferrer" style={{ color: '#2D6FFF' }}>Katıl →</a>
          </div>
        </footer>

      </div>
    </>
  )
}