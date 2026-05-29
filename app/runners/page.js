'use client'

import { useEffect, useRef, useState } from 'react'
import { LOGO_PATH } from './logoPath'

export default function RunnersPage() {
  const lineRef = useRef(null)
  const runnerRef = useRef(null)
  const [splashDone, setSplashDone] = useState(false)
  const [showPopup, setShowPopup] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setSplashDone(true), 2800)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    function handleScroll() {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = Math.min(scrollTop / docHeight, 1)
      if (lineRef.current) lineRef.current.style.width = (progress * 100) + '%'
      if (runnerRef.current) runnerRef.current.style.left = Math.min(progress * 100, 96) + '%'
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@700;800;900&family=DM+Sans:wght@300;400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        .rp{background:#0A0A0A;color:#FAF7F2;font-family:'DM Sans',sans-serif;overflow-x:hidden}

        .splash{position:fixed;inset:0;z-index:9999;background:#090915;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:24px;transition:opacity 0.6s ease,visibility 0.6s ease}
        .splash.done{opacity:0;visibility:hidden;pointer-events:none}
        .splash-logo{width:280px;height:200px;position:relative;display:flex;align-items:center;justify-content:center}
        .splash-glow{position:absolute;width:100%;height:70%;border-radius:50%;background:radial-gradient(ellipse,rgba(18,10,148,0.7) 0%,transparent 70%);animation:glowPulse 3s ease-in-out infinite}
        .splash-svg{width:100%;height:100%;overflow:visible}
        .splash-stroke{fill:none;stroke:#4A8FFF;stroke-width:80;stroke-dasharray:500000;stroke-dashoffset:500000;animation:logoStroke 2s ease 0.2s forwards;filter:drop-shadow(0 0 60px #2D6FFF)}
        .splash-fill{fill:#ffffff;fill-opacity:0;animation:logoFill 2s ease 0.2s forwards}
        .splash-tag{font-family:'Poppins',sans-serif;font-size:0.72rem;letter-spacing:0.2em;text-transform:uppercase;color:rgba(45,111,255,0.7);font-weight:600;animation:fadeInUp 1s ease 1.5s both}

        .scroll-line-track{position:fixed;top:64px;left:0;right:0;height:4px;background:rgba(255,255,255,0.06);z-index:99;overflow:visible}
        .scroll-line-fill{height:100%;width:0%;background:linear-gradient(90deg,#120a94,#2D6FFF);transition:width 0.08s linear;border-radius:0 2px 2px 0;box-shadow:0 0 10px rgba(45,111,255,0.5)}
        .runner-on-bar{position:fixed;top:50px;left:0%;font-size:1.6rem;line-height:1;transition:left 0.08s linear;pointer-events:none;filter:drop-shadow(0 0 6px rgba(45,111,255,0.8));z-index:101}
        @keyframes runBounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}
        .runner-on-bar{animation:runBounce 0.35s ease-in-out infinite}

        .rnav{position:fixed;top:0;left:0;right:0;z-index:100;display:flex;align-items:center;justify-content:space-between;padding:0 48px;height:64px;background:rgba(10,10,10,0.92);backdrop-filter:blur(12px);border-bottom:1px solid rgba(255,255,255,0.06)}
        .rlogo{font-family:'Poppins',sans-serif;font-weight:800;font-size:1.1rem;letter-spacing:-0.02em;color:#FAF7F2;text-decoration:none}
        .rlogo span{color:#2D6FFF}
        .rnav-links{display:flex;gap:28px;list-style:none;align-items:center}
        .rnav-links a{color:rgba(250,247,242,0.5);text-decoration:none;font-size:0.82rem;letter-spacing:0.06em;text-transform:uppercase;transition:color 0.2s}
        .rnav-links a:hover{color:#FAF7F2}
        .join-btn-nav{background:#120a94!important;color:#fff!important;padding:8px 20px;border-radius:100px;font-size:0.82rem;font-weight:600;border:1px solid #2D6FFF!important;text-decoration:none;cursor:pointer;font-family:inherit}

        .hero{min-height:100vh;display:flex;flex-direction:column;justify-content:center;align-items:flex-start;padding:120px 80px 80px;position:relative;overflow:hidden}
        .hero::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 50% 40%,rgba(18,10,148,0.2) 0%,transparent 65%);pointer-events:none}
        .logo-wrap{width:260px;height:180px;position:relative;display:flex;align-items:center;justify-content:center;margin-bottom:40px}
        .logo-glow-bg{position:absolute;width:100%;height:70%;border-radius:50%;background:radial-gradient(ellipse,rgba(18,10,148,0.7) 0%,transparent 70%);animation:glowPulse 3s ease-in-out infinite}
        .logo-svg{width:100%;height:100%;overflow:visible}
        .logo-stroke{fill:none;stroke:#4A8FFF;stroke-width:80;stroke-dasharray:500000;stroke-dashoffset:500000;animation:logoStroke 2.5s ease 0.3s forwards;filter:drop-shadow(0 0 60px #2D6FFF)}
        .logo-fill{fill:#ffffff;fill-opacity:0;animation:logoFill 2.5s ease 0.3s forwards}
        @keyframes logoStroke{from{stroke-dashoffset:500000}to{stroke-dashoffset:0}}
        @keyframes logoFill{0%,55%{fill-opacity:0}100%{fill-opacity:1}}
        @keyframes glowPulse{0%,100%{opacity:0.6;transform:scale(1)}50%{opacity:1;transform:scale(1.1)}}
        @keyframes fadeInUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}

        .hero-tag{display:inline-flex;align-items:center;gap:10px;font-size:0.75rem;letter-spacing:0.15em;text-transform:uppercase;color:#2D6FFF;font-weight:600;margin-bottom:24px}
        .hero-tag::before{content:'';width:32px;height:1px;background:#2D6FFF}
        .tag-dot{width:6px;height:6px;border-radius:50%;background:#2D6FFF;animation:dotBlink 1.2s ease-in-out infinite}
        @keyframes dotBlink{0%,100%{opacity:1}50%{opacity:0.2}}
        .hero-title{font-family:'Poppins',sans-serif;font-weight:900;font-size:clamp(3.5rem,9vw,7.5rem);line-height:0.92;letter-spacing:-0.04em;margin-bottom:28px}
        .accent{color:#2D6FFF}
        .outline{-webkit-text-stroke:2px rgba(45,111,255,0.4);color:transparent}
        .hero-sub{font-size:clamp(1rem,2vw,1.15rem);color:rgba(250,247,242,0.55);max-width:500px;line-height:1.7;margin-bottom:16px}
        .hero-date{font-family:'Poppins',sans-serif;font-weight:700;font-size:1rem;color:#2D6FFF;letter-spacing:0.06em;margin-bottom:40px}
        .hero-actions{display:flex;gap:16px;align-items:center;flex-wrap:wrap}
        .btn-p{background:#120a94;color:#fff;padding:16px 40px;border-radius:100px;font-size:1rem;font-weight:700;text-decoration:none;border:1.5px solid #2D6FFF;transition:all 0.2s;font-family:'DM Sans',sans-serif;letter-spacing:0.02em;cursor:pointer}
        .btn-p:hover{background:#2D6FFF;transform:translateY(-2px);box-shadow:0 12px 32px rgba(45,111,255,0.4)}
        .btn-g{color:rgba(250,247,242,0.5);font-size:0.9rem;text-decoration:none;transition:color 0.2s;font-family:'DM Sans',sans-serif}
        .btn-g:hover{color:#FAF7F2}
        .hero-track{position:absolute;bottom:0;left:0;right:0;height:80px;pointer-events:none;overflow:hidden}

        .about-section{padding:80px;background:#0D0D1A;display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:center}
        .about-tag{font-size:0.72rem;letter-spacing:0.15em;text-transform:uppercase;color:#2D6FFF;font-weight:600;display:block;margin-bottom:16px}
        .about-title{font-family:'Poppins',sans-serif;font-weight:800;font-size:clamp(1.8rem,4vw,2.8rem);line-height:1.05;letter-spacing:-0.03em;margin-bottom:24px}
        .about-items{display:flex;flex-direction:column;gap:20px}
        .about-item{display:flex;gap:16px;align-items:flex-start}
        .about-item-dot{width:8px;height:8px;border-radius:50%;background:#2D6FFF;flex-shrink:0;margin-top:7px}
        .about-item-text{font-size:1rem;color:rgba(250,247,242,0.65);line-height:1.7}
        .about-item-text strong{color:#FAF7F2;font-weight:600}

        .routes-section{padding:80px;background:#0A0A0A}
        .section-tag{font-size:0.72rem;letter-spacing:0.15em;text-transform:uppercase;color:#2D6FFF;font-weight:600;display:block;margin-bottom:16px}
        .section-title{font-family:'Poppins',sans-serif;font-weight:800;font-size:clamp(1.8rem,4vw,2.8rem);line-height:1.05;letter-spacing:-0.03em;margin-bottom:40px}
        .routes-list{display:flex;flex-direction:column;gap:0}
        .route-row{display:flex;align-items:center;justify-content:space-between;padding:20px 0;border-bottom:1px solid rgba(45,111,255,0.1);cursor:default;transition:padding-left 0.2s}
        .route-row:hover{padding-left:8px}
        .route-row:first-child{border-top:1px solid rgba(45,111,255,0.1)}
        .route-left{display:flex;align-items:center;gap:16px}
        .route-emoji{font-size:1.4rem}
        .route-name{font-family:'Poppins',sans-serif;font-weight:700;font-size:1rem;color:#FAF7F2}
        .route-desc{font-size:0.82rem;color:rgba(250,247,242,0.4);margin-top:2px}
        .route-right{display:flex;gap:10px;align-items:center;flex-shrink:0}
        .route-badge{font-size:0.7rem;padding:3px 10px;border-radius:100px;font-weight:500;letter-spacing:0.04em}
        .badge-dist{background:rgba(45,111,255,0.12);color:#2D6FFF}
        .badge-easy{background:rgba(42,122,74,0.12);color:#4ABA7A}
        .badge-med{background:rgba(212,168,71,0.12);color:#D4A847}
        .badge-hard{background:rgba(200,50,50,0.12);color:#E05050}

        .cta-section{padding:120px 80px;text-align:center;background:#080818;position:relative;overflow:hidden}
        .cta-section::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 50% 50%,rgba(18,10,148,0.25) 0%,transparent 70%)}
        .cta-title{font-family:'Poppins',sans-serif;font-weight:900;font-size:clamp(2.5rem,7vw,5.5rem);letter-spacing:-0.04em;line-height:0.95;margin-bottom:20px;position:relative;z-index:1}
        .cta-date{font-family:'Poppins',sans-serif;font-weight:700;font-size:1.1rem;color:#2D6FFF;letter-spacing:0.08em;margin-bottom:16px;position:relative;z-index:1}
        .cta-sub{font-size:1rem;color:rgba(250,247,242,0.45);max-width:400px;margin:0 auto 48px;line-height:1.7;position:relative;z-index:1}

        .stats-bar{background:#120a94;padding:32px 48px;display:flex;gap:0;overflow-x:auto}
        .stat-item{flex:1;text-align:center;padding:0 32px;border-right:1px solid rgba(255,255,255,0.15);min-width:120px}
        .stat-item:last-child{border-right:none}
        .stat-num{font-family:'Poppins',sans-serif;font-weight:900;font-size:2.5rem;color:#fff;display:block;letter-spacing:-0.04em}
        .stat-label{font-size:0.72rem;color:rgba(255,255,255,0.6);letter-spacing:0.08em;text-transform:uppercase;margin-top:4px;display:block}

        .rfooter{background:#050510;padding:32px 80px;display:flex;align-items:center;justify-content:space-between;border-top:1px solid rgba(45,111,255,0.08);flex-wrap:wrap;gap:16px}
        .rfooter p{font-size:0.78rem;color:rgba(250,247,242,0.25)}
        .rfooter a{font-size:0.78rem;color:rgba(250,247,242,0.25);text-decoration:none;transition:color 0.2s}
        .rfooter a:hover{color:#2D6FFF}

        .popup-overlay{position:fixed;inset:0;z-index:9000;background:rgba(9,9,21,0.88);backdrop-filter:blur(10px);display:flex;align-items:center;justify-content:center;padding:24px}
        .popup-overlay.hidden{opacity:0;visibility:hidden;pointer-events:none}
        .popup-box{background:#0D0D20;border:1px solid rgba(45,111,255,0.3);border-radius:24px;padding:32px;width:100%;max-width:520px;position:relative;text-align:center;box-shadow:0 32px 80px rgba(0,0,0,0.5)}
        .popup-close{position:absolute;top:16px;right:20px;background:none;border:none;color:rgba(250,247,242,0.4);font-size:1.4rem;cursor:pointer;z-index:1}
        .popup-icon{font-size:2rem;margin-bottom:12px;display:block}
        .popup-date{font-family:'Poppins',sans-serif;font-weight:700;font-size:0.78rem;color:#2D6FFF;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:10px}
        .popup-title{font-family:'Poppins',sans-serif;font-weight:900;font-size:1.4rem;color:#FAF7F2;letter-spacing:-0.03em;margin-bottom:8px;line-height:1.1}
        .popup-sub{font-size:0.88rem;color:rgba(250,247,242,0.45);line-height:1.6;margin-bottom:20px}

        @media(max-width:768px){
          .rnav{padding:0 24px}
          .rnav-links{display:none}
          .hero{padding:100px 24px 60px}
          .about-section{padding:60px 24px;grid-template-columns:1fr;gap:40px}
          .routes-section{padding:60px 24px}
          .cta-section{padding:80px 24px}
          .stats-bar{padding:24px}
          .stat-item{padding:0 16px;min-width:100px}
          .stat-num{font-size:1.6rem}
          .rfooter{padding:24px;flex-direction:column;text-align:center}
          .runner-on-bar{display:none}
          .popup-box{padding:24px 16px}
        }
      `}</style>

      {/* SPLASH */}
      <div className={`splash${splashDone ? ' done' : ''}`}>
        <div className="splash-logo">
          <div className="splash-glow"></div>
          <svg className="splash-svg" viewBox="0 0 4500 4500" xmlns="http://www.w3.org/2000/svg">
            <g transform="translate(0,4500) scale(0.1,-0.1)">
              <path className="splash-fill" d={LOGO_PATH}/>
              <path className="splash-stroke" d={LOGO_PATH}/>
            </g>
          </svg>
        </div>
        <div className="splash-tag">RUN BEYOND RUNNING</div>
      </div>

      {/* POPUP — her zaman DOM'da, sadece gizleniyor */}
      <div
        className={`popup-overlay${showPopup ? '' : ' hidden'}`}
        onClick={(e) => { if (e.target === e.currentTarget) setShowPopup(false) }}
      >
        <div className="popup-box">
          <button className="popup-close" onClick={() => setShowPopup(false)}>✕</button>
          <span className="popup-icon">⚡</span>
          <div className="popup-date">1 Haziran 2026</div>
          <h2 className="popup-title">Başvurular henüz açılmadı</h2>
          <p className="popup-sub">
            E-posta adresini bırak, başvurular açıldığında ilk sen haberdar ol.
          </p>
          <iframe
            src="https://form.jotform.com/261483562815058"
            style={{ width: '100%', height: '320px', border: 'none', borderRadius: '12px' }}
            title="Ön Kayıt Formu"
          />
        </div>
      </div>

      <div className="scroll-line-track">
        <div className="scroll-line-fill" ref={lineRef} />
      </div>
      <div className="runner-on-bar" ref={runnerRef}>⚡</div>

      <div className="rp">

        <nav className="rnav">
          <a href="/runners" className="rlogo">bizzat <span>runners</span></a>
          <ul className="rnav-links">
            <li><a href="#hakkinda">Hakkında</a></li>
            <li><a href="#rotalar">Rotalar</a></li>
            <li>
              <button onClick={() => setShowPopup(true)} className="join-btn-nav">Başvur</button>
            </li>
          </ul>
        </nav>

        <section className="hero">
          <div className="logo-wrap">
            <div className="logo-glow-bg"></div>
            <svg className="logo-svg" viewBox="0 0 4500 4500" xmlns="http://www.w3.org/2000/svg">
              <g transform="translate(0,4500) scale(0.1,-0.1)">
                <path className="logo-fill" d={LOGO_PATH}/>
                <path className="logo-stroke" d={LOGO_PATH}/>
              </g>
            </svg>
          </div>

          <div className="hero-tag">
            <div className="tag-dot"></div>
            Ankara Koşu Komünitesi
          </div>

          <h1 className="hero-title">
            RUN<br />
            <span className="accent">BEYOND</span><br />
            <span className="outline">RUNNING</span>
          </h1>

          <p className="hero-sub">
            Ankara&apos;dan doğan komünitenin bir parçası ol. Sınırları aş, şehri keşfet, birlikte koş.
          </p>

          <div className="hero-date">Başvurular · 1 Haziran 2026</div>

          <div className="hero-actions">
            <button onClick={() => setShowPopup(true)} className="btn-p">
              Başvuru Formunu Doldur →
            </button>
            <a href="#hakkinda" className="btn-g">Daha fazla ↓</a>
          </div>

          <div className="hero-track">
            <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
              <path d="M0,40 C200,20 400,60 600,40 C800,20 1000,60 1200,40 C1300,30 1380,35 1440,40" fill="none" stroke="rgba(45,111,255,0.12)" strokeWidth="1" strokeDasharray="8 4"/>
              <path d="M0,40 C200,20 400,60 600,40 C800,20 1000,60 1200,40 C1300,30 1380,35 1440,40" fill="none" stroke="#2D6FFF" strokeWidth="2" strokeDasharray="1440" strokeDashoffset="1440">
                <animate attributeName="stroke-dashoffset" from="1440" to="0" dur="2.5s" begin="1s" fill="freeze"/>
              </path>
            </svg>
          </div>
        </section>

        <section className="about-section" id="hakkinda">
          <div>
            <span className="about-tag">Neden bizzat runners?</span>
            <h2 className="about-title">
              olmadı bir tur<br />
              <span className="accent">koşarız!</span>
            </h2>
          </div>
          <div className="about-items">
            {[
              { title: 'Her seviyeye açık', text: 'İlk 5K\'ndan maraton hazırlığına kadar herkes burada. Hız değil, yolculuk önemli.' },
              { title: 'Ankara\'ya özgü rotalar', text: 'AOÇ\'tan Eymir\'e, ODTÜ\'den Dikmen Vadisi\'ne — şehri koşarak keşfet.' },
              { title: 'Haftalık buluşmalar', text: 'Düzenli grup koşuları, etkinlikler ve sürpriz rotalarla her hafta yeni bir deneyim.' },
              { title: 'Gerçek bir komünite', text: 'Sadece koşmuyoruz — tanışıyoruz, büyüyoruz, Ankara\'yı birlikte keşfediyoruz.' },
            ].map(item => (
              <div key={item.title} className="about-item">
                <div className="about-item-dot"></div>
                <div className="about-item-text">
                  <strong>{item.title}</strong> — {item.text}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="routes-section" id="rotalar">
          <span className="section-tag">Ankara&apos;da Koşu Rotaları</span>
          <h2 className="section-title">
            Her seviyeye bir <span className="accent">parkur</span>.
          </h2>
          <div className="routes-list">
            {[
              { emoji: '🌳', name: 'AOÇ Çevresi', desc: 'Düz ve sakin, başlangıç dostu', dist: '8 km', level: 'easy', label: 'Kolay' },
              { emoji: '💧', name: 'Eymir Gölü', desc: 'Göl kenarında nefes kesen manzara', dist: '10 km', level: 'easy', label: 'Kolay' },
              { emoji: '🎓', name: 'ODTÜ Kampüs Turu', desc: 'Ağaçlık yollar, hafif inişli çıkışlı', dist: '12 km', level: 'med', label: 'Orta' },
              { emoji: '🌿', name: 'Botanik Bahçesi', desc: 'Şehir içinde yeşil kaçış', dist: '6 km', level: 'easy', label: 'Kolay' },
              { emoji: '🏛️', name: 'Anıtkabir Çevresi', desc: 'Tarihin içinden geçen kentsel rota', dist: '9 km', level: 'med', label: 'Orta' },
              { emoji: '⛰️', name: 'Dikmen Vadisi', desc: 'İnişli çıkışlı, dayanıklılık antrenmanı', dist: '15 km', level: 'hard', label: 'Zorlu' },
            ].map(r => (
              <div key={r.name} className="route-row">
                <div className="route-left">
                  <span className="route-emoji">{r.emoji}</span>
                  <div>
                    <div className="route-name">{r.name}</div>
                    <div className="route-desc">{r.desc}</div>
                  </div>
                </div>
                <div className="route-right">
                  <span className="route-badge badge-dist">{r.dist}</span>
                  <span className={`route-badge badge-${r.level}`}>{r.label}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="cta-section">
          <div className="cta-date">Başvurular · 1 Haziran 2026</div>
          <h2 className="cta-title">
            HAZIR<br />
            <span className="accent">MISIN?</span>
          </h2>
          <p className="cta-sub">
            Ankara&apos;dan doğan komünitenin bir parçası ol. İlk adımı at.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
            <button onClick={() => setShowPopup(true)} className="btn-p" style={{ fontSize: '1rem', padding: '18px 48px' }}>
              Başvuru Formunu Doldur →
            </button>
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

        <footer className="rfooter">
          <div>
            <a href="/runners" style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 800, color: '#FAF7F2', textDecoration: 'none', fontSize: '0.95rem' }}>
              bizzat <span style={{ color: '#2D6FFF' }}>runners</span>
            </a>
            <p style={{ marginTop: '4px' }}>Run Beyond Running — Ankara</p>
          </div>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <a href="https://instagram.com/bizzatrunners" target="_blank" rel="noopener noreferrer">Instagram</a>
            <button onClick={() => setShowPopup(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#2D6FFF', fontSize: '0.78rem', fontFamily: 'inherit' }}>Başvur →</button>
          </div>
        </footer>

      </div>
    </>
  )
}