'use client'

import { useState } from 'react'
import { supabase } from '../../../lib/supabase'

export default function GeriBildirimPage() {
  const [form, setForm] = useState({
    genel_degerlendirme: '',
    gelistirme: '',
    gelecek_istek: '',
    serbest_mesaj: '',
  })
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  function handle(e) {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }

  async function submit(e) {
    e.preventDefault()
    const hepsiDolu = !form.genel_degerlendirme && !form.gelistirme && !form.gelecek_istek && !form.serbest_mesaj
    if (hepsiDolu) { setError('En az bir alanı doldurman yeterli.'); return }
    setLoading(true)
    setError('')
    const { error: err } = await supabase.from('runners_geri_bildirim').insert({
      genel_degerlendirme: form.genel_degerlendirme || null,
      gelistirme: form.gelistirme || null,
      gelecek_istek: form.gelecek_istek || null,
      serbest_mesaj: form.serbest_mesaj || null,
    })
    setLoading(false)
    if (err) { setError('Bir hata oluştu, tekrar deneyin.'); return }
    setDone(true)
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@700;800;900&family=DM+Sans:wght@300;400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        .gp{background:#090915;min-height:100vh;font-family:'DM Sans',sans-serif;color:#FAF7F2}
        .hero{padding:100px 48px 40px;text-align:center;position:relative}
        .hero::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 50% 30%,rgba(18,10,148,0.2) 0%,transparent 65%);pointer-events:none}
        .hero-tag{display:inline-flex;align-items:center;gap:8px;font-size:0.72rem;letter-spacing:0.15em;text-transform:uppercase;color:#2D6FFF;font-weight:600;margin-bottom:20px}
        .hero-tag::before{content:'';width:24px;height:1px;background:#2D6FFF}
        .hero-tag::after{content:'';width:24px;height:1px;background:#2D6FFF}
        .hero-title{font-family:'Poppins',sans-serif;font-weight:900;font-size:clamp(1.8rem,5vw,3rem);line-height:1.05;letter-spacing:-0.04em;margin-bottom:12px}
        .accent{color:#2D6FFF}
        .hero-sub{font-size:0.95rem;color:rgba(250,247,242,0.45);max-width:480px;margin:0 auto;line-height:1.7}
        .anon-note{display:inline-flex;align-items:center;gap:8px;margin-top:16px;font-size:0.78rem;color:rgba(250,247,242,0.3);letter-spacing:0.04em}
        .anon-dot{width:6px;height:6px;border-radius:50%;background:#2D6FFF;flex-shrink:0}
        .form-wrap{max-width:620px;margin:0 auto;padding:40px 48px 80px}
        .form-card{background:#0D0D20;border:1px solid rgba(45,111,255,0.2);border-radius:24px;padding:40px;position:relative;overflow:hidden}
        .form-card::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,#120a94,#2D6FFF)}
        .field{margin-bottom:24px}
        .field-label{display:block;font-size:0.78rem;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:rgba(250,247,242,0.5);margin-bottom:8px}
        .field-opt{font-size:0.68rem;font-weight:400;color:rgba(250,247,242,0.2);letter-spacing:0.04em;text-transform:none;margin-left:6px}
        .field textarea{width:100%;padding:14px 16px;background:rgba(255,255,255,0.04);border:1.5px solid rgba(45,111,255,0.15);border-radius:10px;color:#FAF7F2;font-family:'DM Sans',sans-serif;font-size:0.95rem;outline:none;transition:border-color 0.2s,background 0.2s;resize:vertical;min-height:90px;line-height:1.6}
        .field textarea:focus{border-color:#2D6FFF;background:rgba(45,111,255,0.05)}
        .field textarea::placeholder{color:rgba(250,247,242,0.18)}
        .divider{height:1px;background:rgba(45,111,255,0.08);margin:8px 0 24px}
        .submit-btn{width:100%;padding:16px;background:#120a94;color:#fff;border:1.5px solid #2D6FFF;border-radius:12px;font-family:'DM Sans',sans-serif;font-size:1rem;font-weight:700;cursor:pointer;transition:all 0.2s;letter-spacing:0.02em;margin-top:4px}
        .submit-btn:hover{background:#2D6FFF}
        .submit-btn:disabled{opacity:0.5;cursor:not-allowed}
        .error-msg{color:#E05050;font-size:0.85rem;margin-bottom:16px;text-align:center}
        .success-wrap{text-align:center;padding:60px 20px}
        .success-icon{font-size:3rem;margin-bottom:20px;display:block}
        .success-title{font-family:'Poppins',sans-serif;font-weight:900;font-size:1.8rem;color:#FAF7F2;margin-bottom:12px;letter-spacing:-0.03em}
        .success-sub{font-size:0.95rem;color:rgba(250,247,242,0.45);line-height:1.7;margin-bottom:28px}
        .ig-link{color:#2D6FFF;font-size:0.88rem;font-weight:600;text-decoration:none}
        .footer{text-align:center;padding:0 48px 40px}
        .footer p{font-size:0.78rem;color:rgba(250,247,242,0.15);line-height:1.7}
        @media(max-width:768px){
          .hero{padding:80px 24px 32px}
          .form-wrap{padding:24px 16px 60px}
          .form-card{padding:24px}
          .footer{padding:0 16px 40px}
        }
      `}</style>

      <div className="gp">
        <div className="hero">
          <div className="hero-tag">bizzat runners</div>
          <h1 className="hero-title">
            Sesini <span className="accent">duymak istiyoruz.</span>
          </h1>
          <p className="hero-sub">
            Komüniteyi birlikte büyütüyoruz. Düşüncelerini paylaş — hiçbir alan zorunlu değil, istediğini yaz.
          </p>
          <div className="anon-note">
            <div className="anon-dot"></div>
            Tamamen anonim — isim, telefon, e-posta yok.
          </div>
        </div>

        <div className="form-wrap">
          <div className="form-card">
            {done ? (
              <div className="success-wrap">
                <span className="success-icon">⚡</span>
                <h2 className="success-title">Teşekkürler!</h2>
                <p className="success-sub">
                  Geri bildiriminiz için teşekkürler — her görüş bizi daha iyi yapıyor.
                </p>
                <a href="https://instagram.com/bizzatrunners" target="_blank" rel="noopener noreferrer" className="ig-link">
                  @bizzatrunners ↗
                </a>
              </div>
            ) : (
              <form onSubmit={submit}>

                <div className="field">
                  <label className="field-label">
                    bizzat runners&apos;ı nasıl değerlendiriyorsun?
                    <span className="field-opt">isteğe bağlı</span>
                  </label>
                  <textarea
                    name="genel_degerlendirme"
                    value={form.genel_degerlendirme}
                    onChange={handle}
                    placeholder="Komünite nasıl ilerliyor, genel izlenimlerin neler?"
                  />
                </div>

                <div className="divider"></div>

                <div className="field">
                  <label className="field-label">
                    Neyi geliştirebiliriz?
                    <span className="field-opt">isteğe bağlı</span>
                  </label>
                  <textarea
                    name="gelistirme"
                    value={form.gelistirme}
                    onChange={handle}
                    placeholder="Eksik gördüğün ya da daha iyi olabilecek bir şey var mı?"
                  />
                </div>

                <div className="divider"></div>

                <div className="field">
                  <label className="field-label">
                    Gelecekte görmek istediğin bir şey var mı?
                    <span className="field-opt">isteğe bağlı</span>
                  </label>
                  <textarea
                    name="gelecek_istek"
                    value={form.gelecek_istek}
                    onChange={handle}
                    placeholder="Yeni rota, format, etkinlik, özellik... aklındaki her şey."
                  />
                </div>

                <div className="divider"></div>

                <div className="field">
                  <label className="field-label">
                    Ekibe serbest mesaj
                    <span className="field-opt">isteğe bağlı</span>
                  </label>
                  <textarea
                    name="serbest_mesaj"
                    value={form.serbest_mesaj}
                    onChange={handle}
                    placeholder="Aklındaki her şeyi yazabilirsin."
                    style={{minHeight:'120px'}}
                  />
                </div>

                {error && <div className="error-msg">{error}</div>}

                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? 'Gönderiliyor...' : 'Geri Bildirimi Gönder →'}
                </button>

              </form>
            )}
          </div>
        </div>

        <div className="footer">
          <p>bizzat runners · Run Beyond Running · Ankara</p>
        </div>
      </div>
    </>
  )
}