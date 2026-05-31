'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function BasvuruPage() {
  const [loaded, setLoaded] = useState(false)

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@700;800;900&family=DM+Sans:wght@300;400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        .bp{background:#090915;min-height:100vh;font-family:'DM Sans',sans-serif;color:#FAF7F2}
        .bnav{position:fixed;top:0;left:0;right:0;z-index:100;display:flex;align-items:center;justify-content:space-between;padding:0 48px;height:64px;background:rgba(10,10,10,0.92);backdrop-filter:blur(12px);border-bottom:1px solid rgba(255,255,255,0.06)}
        .rlogo{font-family:'Poppins',sans-serif;font-weight:800;font-size:1.1rem;letter-spacing:-0.02em;color:#FAF7F2;text-decoration:none}
        .rlogo span{color:#2D6FFF}
        .back-btn{color:rgba(250,247,242,0.5);text-decoration:none;font-size:0.82rem;letter-spacing:0.06em;text-transform:uppercase;transition:color 0.2s;display:flex;align-items:center;gap:6px}
        .back-btn:hover{color:#FAF7F2}
        .hero{padding:120px 48px 40px;text-align:center;position:relative}
        .hero::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 50% 30%,rgba(18,10,148,0.25) 0%,transparent 65%);pointer-events:none}
        .hero-tag{display:inline-flex;align-items:center;gap:8px;font-size:0.72rem;letter-spacing:0.15em;text-transform:uppercase;color:#2D6FFF;font-weight:600;margin-bottom:20px}
        .hero-tag::before{content:'';width:24px;height:1px;background:#2D6FFF}
        .hero-tag::after{content:'';width:24px;height:1px;background:#2D6FFF}
        .hero-title{font-family:'Poppins',sans-serif;font-weight:900;font-size:clamp(2rem,5vw,3.5rem);line-height:1;letter-spacing:-0.04em;margin-bottom:16px}
        .accent{color:#2D6FFF}
        .hero-sub{font-size:1rem;color:rgba(250,247,242,0.5);max-width:480px;margin:0 auto;line-height:1.7}
        .form-wrap{max-width:720px;margin:0 auto;padding:0 48px 80px}
        .form-card{background:#0D0D20;border:1px solid rgba(45,111,255,0.2);border-radius:24px;overflow:hidden;position:relative}
        .form-card::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,#120a94,#2D6FFF)}
        .loading-placeholder{display:flex;align-items:center;justify-content:center;min-height:400px;flex-direction:column;gap:16px}
        .loading-dot{width:8px;height:8px;border-radius:50%;background:#2D6FFF;animation:loadingPulse 1s ease-in-out infinite}
        .loading-dot:nth-child(2){animation-delay:0.2s}
        .loading-dot:nth-child(3){animation-delay:0.4s}
        @keyframes loadingPulse{0%,100%{opacity:0.3;transform:scale(0.8)}50%{opacity:1;transform:scale(1)}}
        .loading-text{font-size:0.82rem;color:rgba(250,247,242,0.3);letter-spacing:0.1em;text-transform:uppercase}
        .form-iframe{width:100%;border:none;min-height:900px;display:block;transition:opacity 0.3s ease}
        .form-iframe.hidden{opacity:0;position:absolute;pointer-events:none}
        .form-iframe.visible{opacity:1;position:relative;pointer-events:auto}
        .bfooter{text-align:center;padding:32px;border-top:1px solid rgba(45,111,255,0.08)}
        .bfooter p{font-size:0.78rem;color:rgba(250,247,242,0.2);line-height:1.7}
        @media(max-width:768px){
          .bnav{padding:0 24px}
          .hero{padding:100px 24px 32px}
          .form-wrap{padding:0 16px 60px}
          .form-iframe{min-height:1000px}
        }
      `}</style>

      <div className="bp">
        <nav className="bnav">
          <a href="/runners" className="rlogo">bizzat <span>runners</span></a>
          <Link href="/runners" className="back-btn">
            ← Geri dön
          </Link>
        </nav>

        <div className="hero">
          <div className="hero-tag">Komüniteye Katıl</div>
          <h1 className="hero-title">
            Başvuru <span className="accent">Formu</span>
          </h1>
          <p className="hero-sub">
            Ankara&apos;dan doğan komünitenin bir parçası ol. Formu doldur, seni bekleyelim.
          </p>
        </div>

        <div className="form-wrap">
          <div className="form-card">
            {!loaded && (
              <div className="loading-placeholder">
                <div style={{ display: 'flex', gap: '8px' }}>
                  <div className="loading-dot"></div>
                  <div className="loading-dot"></div>
                  <div className="loading-dot"></div>
                </div>
                <div className="loading-text">Form yükleniyor</div>
              </div>
            )}
            <iframe
              className={`form-iframe ${loaded ? 'visible' : 'hidden'}`}
              src="https://form.jotform.com/bizzatrunners/basvuru"
              title="bizzat runners Başvuru Formu"
              allowFullScreen
              onLoad={() => setLoaded(true)}
            />
          </div>
          <div className="bfooter">
            <p>
              Run Beyond Running — Ankara<br/>
              Sorularınız için{' '}
              <a href="https://instagram.com/bizzatrunners" target="_blank" rel="noopener noreferrer" style={{ color: '#2D6FFF', textDecoration: 'none' }}>
                @bizzatrunners
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}