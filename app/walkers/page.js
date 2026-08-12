'use client'

import { useEffect, useRef, useState } from 'react'

export default function WalkersPage() {
  const [splashDone, setSplashDone] = useState(false)
  const lineRef = useRef(null)

  useEffect(() => {
    const timer = setTimeout(() => setSplashDone(true), 3000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    function handleScroll() {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = Math.min(scrollTop / docHeight, 1)
      if (lineRef.current) lineRef.current.style.width = (progress * 100) + '%'
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const IG = 'https://instagram.com/bizzatwalkers'

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;700;800;900&family=DM+Sans:wght@300;400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        :root{
          --bg:#0C0C0C;
          --surface:#141414;
          --surface2:#1A1A1A;
          --cream:#F5F5F0;
          --cream-muted:rgba(245,245,240,0.5);
          --cream-dim:rgba(245,245,240,0.15);
          --green:#2D5A3D;
          --green-light:#3D7A52;
          --green-pale:#8FB89A;
          --green-glow:rgba(45,90,61,0.3);
          --border:rgba(245,245,240,0.08);
        }
        .wp{background:var(--bg);color:var(--cream);font-family:'DM Sans',sans-serif;overflow-x:hidden;min-height:100vh}
        .splash{position:fixed;inset:0;z-index:9999;background:var(--bg);display:flex;align-items:center;justify-content:center;flex-direction:column;gap:20px;transition:opacity 0.8s ease,visibility 0.8s ease}
        .splash.done{opacity:0;visibility:hidden;pointer-events:none}
        .splash-wordmark{font-family:'Poppins',sans-serif;font-weight:300;font-size:1.1rem;letter-spacing:0.3em;color:var(--cream);opacity:0;animation:fadeWord 1.2s ease 0.4s forwards}
        .splash-wordmark strong{font-weight:800;color:var(--cream)}
        .splash-sub{font-size:0.65rem;letter-spacing:0.25em;text-transform:uppercase;color:var(--green-pale);opacity:0;animation:fadeWord 1s ease 1.6s forwards}
        @keyframes fadeWord{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
        .progress-track{position:fixed;top:0;left:0;right:0;height:2px;background:var(--border);z-index:99}
        .progress-fill{height:100%;width:0%;background:var(--green-light);transition:width 0.1s linear}
        .wnav{position:fixed;top:0;left:0;right:0;z-index:100;display:flex;align-items:center;justify-content:space-between;padding:0 56px;height:60px;background:rgba(12,12,12,0.9);backdrop-filter:blur(16px);border-bottom:1px solid var(--border)}
        .wlogo{font-family:'Poppins',sans-serif;font-weight:800;font-size:1rem;letter-spacing:-0.01em;color:var(--cream);text-decoration:none;display:flex;align-items:center;gap:10px}
        .wlogo span{color:var(--green-light)}
        .wnav-links{display:flex;gap:32px;list-style:none;align-items:center}
        .wnav-links a{color:var(--cream-muted);text-decoration:none;font-size:0.78rem;letter-spacing:0.08em;text-transform:uppercase;transition:color 0.2s}
        .wnav-links a:hover{color:var(--cream)}
        .join-nav{background:var(--green)!important;color:var(--cream)!important;padding:8px 22px;border-radius:2px;font-size:0.78rem;font-weight:600;border:none!important;text-decoration:none;letter-spacing:0.06em;text-transform:uppercase;transition:background 0.2s}
        .join-nav:hover{background:var(--green-light)!important}
        .hero{min-height:100vh;display:flex;flex-direction:column;justify-content:center;padding:100px 56px 80px;position:relative;overflow:hidden}
        .hero-bg{position:absolute;inset:0;pointer-events:none}
        .hero-circle{position:absolute;width:600px;height:600px;border-radius:50%;background:radial-gradient(ellipse,var(--green-glow) 0%,transparent 70%);top:50%;left:50%;transform:translate(-50%,-50%)}
        .hero-grid{position:absolute;inset:0;background-image:linear-gradient(var(--border) 1px,transparent 1px),linear-gradient(90deg,var(--border) 1px,transparent 1px);background-size:60px 60px;opacity:0.4}
        .hero-eyebrow{display:inline-flex;align-items:center;gap:10px;font-size:0.7rem;letter-spacing:0.2em;text-transform:uppercase;color:var(--green-pale);font-weight:500;margin-bottom:28px;position:relative;z-index:1}
        .eyebrow-line{width:40px;height:1px;background:var(--green-light)}
        .hero-title{font-family:'Poppins',sans-serif;font-weight:900;font-size:clamp(4rem,10vw,8rem);line-height:0.88;letter-spacing:-0.05em;margin-bottom:32px;position:relative;z-index:1}
        .hero-title .line-1{display:block;color:var(--cream)}
        .hero-title .line-2{display:block;color:var(--cream)}
        .hero-title .line-3{display:block;-webkit-text-stroke:1px rgba(245,245,240,0.25);color:transparent}
        .hero-title .accent{color:var(--green-light)}
        .hero-desc{font-size:1.05rem;color:var(--cream-muted);max-width:480px;line-height:1.75;margin-bottom:12px;position:relative;z-index:1;font-weight:300}
        .hero-tagline{font-family:'Poppins',sans-serif;font-size:0.75rem;letter-spacing:0.12em;text-transform:uppercase;color:var(--green-pale);margin-bottom:48px;position:relative;z-index:1}
        .hero-actions{display:flex;gap:16px;align-items:center;flex-wrap:wrap;position:relative;z-index:1}
        .btn-primary{background:var(--cream);color:var(--bg);padding:14px 40px;border-radius:2px;font-size:0.88rem;font-weight:700;text-decoration:none;letter-spacing:0.08em;transition:all 0.2s;display:inline-block}
        .btn-primary:hover{background:var(--green-pale);transform:translateY(-1px)}
        .btn-ghost{color:var(--cream-muted);font-size:0.82rem;text-decoration:none;letter-spacing:0.06em;text-transform:uppercase;transition:color 0.2s;border-bottom:1px solid var(--border);padding-bottom:2px}
        .btn-ghost:hover{color:var(--cream);border-color:var(--cream-muted)}
        .manifesto{padding:120px 56px;background:var(--surface);border-top:1px solid var(--border);border-bottom:1px solid var(--border)}
        .manifesto-inner{max-width:760px;margin:0 auto;text-align:center}
        .manifesto-label{font-size:0.65rem;letter-spacing:0.25em;text-transform:uppercase;color:var(--green-pale);margin-bottom:32px;display:block}
        .manifesto-text{font-family:'Poppins',sans-serif;font-weight:300;font-size:clamp(1.5rem,3vw,2.4rem);line-height:1.4;letter-spacing:-0.02em;color:var(--cream)}
        .manifesto-text em{font-style:normal;color:var(--green-pale);font-weight:400}
        .neden{padding:120px 56px;background:var(--bg)}
        .neden-header{margin-bottom:80px}
        .section-label{font-size:0.65rem;letter-spacing:0.25em;text-transform:uppercase;color:var(--green-pale);display:block;margin-bottom:16px}
        .section-title{font-family:'Poppins',sans-serif;font-weight:800;font-size:clamp(1.8rem,4vw,3rem);letter-spacing:-0.03em;line-height:1;color:var(--cream)}
        .neden-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:1px;background:var(--border)}
        .neden-item{background:var(--bg);padding:48px;position:relative;transition:background 0.3s}
        .neden-item:hover{background:var(--surface)}
        .neden-num{font-family:'Poppins',sans-serif;font-weight:900;font-size:3rem;color:var(--border);letter-spacing:-0.05em;line-height:1;margin-bottom:20px}
        .neden-item-title{font-family:'Poppins',sans-serif;font-weight:700;font-size:1.1rem;color:var(--cream);margin-bottom:12px;letter-spacing:-0.01em}
        .neden-item-text{font-size:0.9rem;color:var(--cream-muted);line-height:1.7;font-weight:300}
        .neden-dot{position:absolute;top:48px;right:48px;width:8px;height:8px;border-radius:50%;background:var(--green);opacity:0;transition:opacity 0.3s}
        .neden-item:hover .neden-dot{opacity:1}
        .yakinda{padding:120px 56px;background:var(--surface);border-top:1px solid var(--border)}
        .yakinda-inner{max-width:680px}
        .yakinda-badge{display:inline-flex;align-items:center;gap:8px;background:rgba(45,90,61,0.15);border:1px solid rgba(45,90,61,0.4);padding:6px 16px;border-radius:2px;margin-bottom:32px}
        .yakinda-badge-dot{width:6px;height:6px;border-radius:50%;background:var(--green-light);animation:blink 1.5s ease-in-out infinite}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0.2}}
        .yakinda-badge-text{font-size:0.68rem;letter-spacing:0.15em;text-transform:uppercase;color:var(--green-pale);font-weight:600}
        .yakinda-title{font-family:'Poppins',sans-serif;font-weight:800;font-size:clamp(2rem,5vw,3.5rem);letter-spacing:-0.04em;line-height:1;color:var(--cream);margin-bottom:20px}
        .yakinda-title span{color:var(--green-light)}
        .yakinda-desc{font-size:1rem;color:var(--cream-muted);line-height:1.75;font-weight:300;margin-bottom:40px;max-width:520px}
        .notify-note{font-size:0.72rem;color:var(--cream-dim);margin-top:16px;letter-spacing:0.04em}
        .deneyimler{padding:120px 56px;background:var(--bg);border-top:1px solid var(--border)}
        .deneyimler-header{display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:64px;flex-wrap:wrap;gap:20px}
        .deneyim-list{display:flex;flex-direction:column;gap:1px;background:var(--border)}
        .deneyim-row{background:var(--bg);display:flex;align-items:center;justify-content:space-between;gap:24px;transition:background 0.2s;padding:28px 32px;cursor:default}
        .deneyim-row:hover{background:var(--surface)}
        .deneyim-left{display:flex;align-items:center;gap:24px}
        .deneyim-icon{font-size:1.5rem;width:40px;text-align:center;flex-shrink:0}
        .deneyim-name{font-family:'Poppins',sans-serif;font-weight:600;font-size:1rem;color:var(--cream);letter-spacing:-0.01em}
        .deneyim-desc{font-size:0.82rem;color:var(--cream-muted);margin-top:2px;font-weight:300}
        .deneyim-tag{font-size:0.65rem;padding:4px 12px;border:1px solid var(--border);color:var(--cream-muted);letter-spacing:0.08em;text-transform:uppercase}
        .cta-section{padding:160px 56px;text-align:center;background:var(--surface);border-top:1px solid var(--border);position:relative;overflow:hidden}
        .cta-bg-text{position:absolute;font-family:'Poppins',sans-serif;font-weight:900;font-size:20vw;color:rgba(245,245,240,0.02);top:50%;left:50%;transform:translate(-50%,-50%);letter-spacing:-0.05em;white-space:nowrap;pointer-events:none;user-select:none}
        .cta-label{font-size:0.65rem;letter-spacing:0.25em;text-transform:uppercase;color:var(--green-pale);margin-bottom:24px;display:block;position:relative;z-index:1}
        .cta-title{font-family:'Poppins',sans-serif;font-weight:900;font-size:clamp(3rem,8vw,6rem);letter-spacing:-0.05em;line-height:0.9;color:var(--cream);margin-bottom:32px;position:relative;z-index:1}
        .cta-title span{color:var(--green-light)}
        .cta-sub{font-size:1rem;color:var(--cream-muted);max-width:400px;margin:0 auto 48px;line-height:1.7;font-weight:300;position:relative;z-index:1}
        .wfooter{background:var(--bg);padding:40px 56px;display:flex;align-items:center;justify-content:space-between;border-top:1px solid var(--border);flex-wrap:wrap;gap:16px}
        .wfooter-logo{font-family:'Poppins',sans-serif;font-weight:800;font-size:0.9rem;color:var(--cream);text-decoration:none}
        .wfooter-logo span{color:var(--green-light)}
        .wfooter p{font-size:0.72rem;color:rgba(245,245,240,0.2);margin-top:4px}
        .wfooter a{font-size:0.72rem;color:rgba(245,245,240,0.25);text-decoration:none;transition:color 0.2s}
        .wfooter a:hover{color:var(--green-pale)}
        @media(max-width:768px){
          .wnav{padding:0 24px}
          .wnav-links{display:none}
          .hero{padding:90px 24px 60px}
          .manifesto{padding:80px 24px}
          .neden{padding:80px 24px}
          .neden-grid{grid-template-columns:1fr}
          .neden-item{padding:32px 24px}
          .yakinda{padding:80px 24px}
          .deneyimler{padding:80px 24px}
          .deneyimler-header{flex-direction:column;align-items:flex-start}
          .cta-section{padding:100px 24px}
          .wfooter{padding:32px 24px;flex-direction:column;text-align:center}
        }
      `}</style>

      <div className={`splash${splashDone ? ' done' : ''}`}>
        <img src="/walkers-logo.png" alt="bizzat walkers" style={{width:'120px',opacity:0,animation:'fadeWord 1.2s ease 0.4s forwards'}} />
        <div className="splash-wordmark" style={{marginTop:'16px'}}>bizzat <strong>walkers</strong></div>
        <div className="splash-sub">Ankara merkezli deneyim odaklı komünite</div>
      </div>

      <div className="progress-track">
        <div className="progress-fill" ref={lineRef} />
      </div>

      <div className="wp">
        <nav className="wnav">
          <a href="/walkers" className="wlogo">
            <img src="/walkers-logo.png" alt="w" style={{height:'24px',filter:'invert(1)'}} />
            bizzat <span>walkers</span>
          </a>
          <ul className="wnav-links">
            <li><a href="#neden">Neden</a></li>
            <li><a href="#deneyimler">Deneyimler</a></li>
            <li><a href={IG} target="_blank" rel="noopener noreferrer">Instagram</a></li>
            <li><a href="#yakinda" className="join-nav">Katıl</a></li>
          </ul>
        </nav>

        <section className="hero">
          <div className="hero-bg">
            <div className="hero-grid"></div>
            <div className="hero-circle"></div>
          </div>
          <div className="hero-eyebrow">
            <span className="eyebrow-line"></span>
            Ankara Deneyim Komünitesi
          </div>
          <h1 className="hero-title">
            <span className="line-1">WALK</span>
            <span className="line-2"><span className="accent">BEYOND</span></span>
            <span className="line-3">WALKING</span>
          </h1>
          <p className="hero-desc">
            Sadece yürümüyoruz. Şehri hissediyoruz, deneyimliyoruz.
          </p>
          <div className="hero-tagline">Ankara&apos;dan doğan, deneyimle büyüyen komünite</div>
          <div className="hero-actions">
            <a href="#yakinda" className="btn-primary">Komüniteye Katıl</a>
            <a href="#neden" className="btn-ghost">Daha fazla</a>
          </div>
        </section>

        <section className="manifesto">
          <div className="manifesto-inner">
            <span className="manifesto-label">Manifestomuz</span>
            <p className="manifesto-text">
              Hareket etmek için <em>bir neden</em> olmalı.
              Biz o nedeni birlikte yaratıyoruz —
              şehrin içinde, <em>anın içinde</em>, birbirimizin yanında.
            </p>
          </div>
        </section>

        <section className="neden" id="neden">
          <div className="neden-header">
            <span className="section-label">Neden bizzat walkers?</span>
            <h2 className="section-title">
              Nitelikli hareket,<br />gerçek bağlantı.
            </h2>
          </div>
          <div className="neden-grid">
            {[
              { num: '01', title: 'Deneyim önce gelir', text: 'Her buluşma bir tema etrafında şekillenir. Bir mahalle, bir tarih, bir lezzet, bir hikaye — sadece yürümek değil.' },
              { num: '02', title: 'Küçük gruplar, derin bağlar', text: 'Kalabalık değil, kaliteli. Her etkinlikte sınırlı katılımcıyla gerçek bir komünite hissi yaratıyoruz.' },
              { num: '03', title: "Ankara'yı yeniden keşfet", text: 'Tanıdık sokaklar, bilinmeyen hikayeler. Şehri turistik değil, yerel gözle görmeyi öğreniyoruz.' },
              { num: '04', title: 'Hareket, bağlantı, anlam', text: 'Fiziksel hareket zihinsel açılımla buluştuğunda ortaya çıkan şey sadece bir yürüyüş değil, bir deneyim.' },
            ].map(item => (
              <div key={item.num} className="neden-item">
                <div className="neden-num">{item.num}</div>
                <div className="neden-item-title">{item.title}</div>
                <div className="neden-item-text">{item.text}</div>
                <div className="neden-dot"></div>
              </div>
            ))}
          </div>
        </section>

        <section className="yakinda" id="yakinda">
          <div className="yakinda-inner">
            <div className="yakinda-badge">
              <div className="yakinda-badge-dot"></div>
              <span className="yakinda-badge-text">Yakında</span>
            </div>
            <h2 className="yakinda-title">
              İlk deneyim<br /><span>geliyor.</span>
            </h2>
            <p className="yakinda-desc">
              bizzat walkers&apos;ın ilk etkinliği yakında. Gelişmeleri kaçırmamak için bizi Instagram&apos;dan takip et.
            </p>
            <a href={IG} target="_blank" rel="noopener noreferrer" className="btn-primary">
              @bizzatwalkers
            </a>
            <p className="notify-note">Instagram&apos;da takipte kal, ilk haberdar ol.</p>
          </div>
        </section>

        <section className="deneyimler" id="deneyimler">
          <div className="deneyimler-header">
            <div>
              <span className="section-label">Ne yapacağız?</span>
              <h2 className="section-title">Deneyim<br />formatları</h2>
            </div>
          </div>
          <div className="deneyim-list">
            {[
              { icon: '🏛️', name: 'Tarihi Mahalle Yürüyüşleri', desc: "Ankara'nın gizli kalmış tarihi dokularını yerel rehberlerle keşfediyoruz", tag: 'Kültür' },
              { icon: '🍽️', name: 'Gastronomi Rotaları', desc: 'Şehrin en iyi lezzetlerini yürüyerek, konuşarak, keşfederek deneyimliyoruz', tag: 'Lezzet' },
              { icon: '🌅', name: 'Şafak & Gün Batımı', desc: "Ankara'nın en güzel saatlerinde, en iyi manzaralarında buluşuyoruz", tag: 'Atmosfer' },
              { icon: '📸', name: 'Fotoğraf Yürüyüşleri', desc: 'Şehri bir fotoğrafçının gözüyle görüyor, birlikte çekiyor ve paylaşıyoruz', tag: 'Yaratıcı' },
              { icon: '🎭', name: 'Kültür & Sanat Turları', desc: 'Galeri açılışları, müze gezileri, sokak sanatı keşifleri', tag: 'Sanat' },
              { icon: '🌿', name: 'Doğa İçi Yürüyüşler', desc: 'Şehrin yeşil alanlarında nefes alıyoruz — AOÇ, Eymir, Dikmen', tag: 'Doğa' },
            ].map(d => (
              <div key={d.name} className="deneyim-row">
                <div className="deneyim-left">
                  <span className="deneyim-icon">{d.icon}</span>
                  <div>
                    <div className="deneyim-name">{d.name}</div>
                    <div className="deneyim-desc">{d.desc}</div>
                  </div>
                </div>
                <span className="deneyim-tag">{d.tag}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="cta-section">
          <div className="cta-bg-text">WALK</div>
          <span className="cta-label">Komünitenin parçası ol</span>
          <h2 className="cta-title">
            HAZIR<br /><span>MISIN?</span>
          </h2>
          <p className="cta-sub">
            Ankara&apos;yı birlikte yeniden keşfedelim. İlk adım senden.
          </p>
          <a href="#yakinda" className="btn-primary" style={{position:'relative',zIndex:1}}>
            Listeye Katıl
          </a>
        </section>

        <footer className="wfooter">
          <div>
            <a href="/walkers" className="wfooter-logo">bizzat <span>walkers</span></a>
            <p>Walk Beyond Walking — Ankara</p>
          </div>
          <div style={{display:'flex',gap:'24px',alignItems:'center'}}>
            <a href={IG} target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href="/runners">bizzat runners</a>
          </div>
        </footer>
      </div>
    </>
  )
}