'use client'

import { useState } from 'react'
import { supabase } from '../../../lib/supabase'
import Link from 'next/link'

export default function DegerlendirmePage() {
  const [form, setForm] = useState({
    ad_soyad: '',
    puan: 0,
    deneyim: [],
    mesaj: '',
    sonraki_kosu: false,
  })
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  function handle(e) {
    const { name, value, type, checked } = e.target
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  function setPuan(p) {
    setForm(f => ({ ...f, puan: p }))
  }

  function toggleDeneyim(opt) {
    setForm(f => ({
      ...f,
      deneyim: f.deneyim.includes(opt)
        ? f.deneyim.filter(d => d !== opt)
        : [...f.deneyim, opt]
    }))
  }

  async function submit(e) {
    e.preventDefault()
    if (form.puan === 0) { setError('Lütfen bir puan ver.'); return }
    setLoading(true)
    setError('')
    const { error: err } = await supabase.from('runners_feedback').insert({
      ad_soyad: form.ad_soyad,
      puan: form.puan,
      deneyim: form.deneyim,
      mesaj: form.mesaj,
      sonraki_kosu: form.sonraki_kosu,
    })
    setLoading(false)
    if (err) { setError('Bir hata oluştu, tekrar deneyin.'); return }
    setDone(true)
  }

  const stars = [1, 2, 3, 4, 5]
  const starLabels = ['', 'Kötüydü', 'İdare eder', 'İyiydi', 'Çok iyiydi', 'Harikaydı!']

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@700;800;900&family=DM+Sans:wght@300;400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        .dp{background:#090915;min-height:100vh;font-family:'DM Sans',sans-serif;color:#FAF7F2}
        .bnav{position:fixed;top:0;left:0;right:0;z-index:100;display:flex;align-items:center;justify-content:space-between;padding:0 48px;height:64px;background:rgba(10,10,10,0.92);backdrop-filter:blur(12px);border-bottom:1px solid rgba(255,255,255,0.06)}
        .rlogo{font-family:'Poppins',sans-serif;font-weight:800;font-size:1.1rem;letter-spacing:-0.02em;color:#FAF7F2;text-decoration:none}
        .rlogo span{color:#2D6FFF}
        .back-btn{color:rgba(250,247,242,0.5);text-decoration:none;font-size:0.82rem;letter-spacing:0.06em;text-transform:uppercase;transition:color 0.2s}
        .back-btn:hover{color:#FAF7F2}
        .hero{padding:120px 48px 40px;text-align:center;position:relative}
        .hero::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 50% 30%,rgba(18,10,148,0.25) 0%,transparent 65%);pointer-events:none}
        .hero-tag{display:inline-flex;align-items:center;gap:8px;font-size:0.72rem;letter-spacing:0.15em;text-transform:uppercase;color:#2D6FFF;font-weight:600;margin-bottom:20px}
        .hero-tag::before{content:'';width:24px;height:1px;background:#2D6FFF}
        .hero-tag::after{content:'';width:24px;height:1px;background:#2D6FFF}
        .hero-title{font-family:'Poppins',sans-serif;font-weight:900;font-size:clamp(2rem,5vw,3.2rem);line-height:1.05;letter-spacing:-0.04em;margin-bottom:12px}
        .accent{color:#2D6FFF}
        .hero-sub{font-size:1rem;color:rgba(250,247,242,0.5);max-width:480px;margin:0 auto;line-height:1.7}
        .form-wrap{max-width:600px;margin:0 auto;padding:40px 48px 80px}
        .form-card{background:#0D0D20;border:1px solid rgba(45,111,255,0.2);border-radius:24px;padding:40px;position:relative;overflow:hidden}
        .form-card::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,#120a94,#2D6FFF)}
        .field{margin-bottom:24px}
        .field label{display:block;font-size:0.78rem;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:rgba(250,247,242,0.5);margin-bottom:10px}
        .field label span{color:#E05050;margin-left:2px}
        .field input,.field textarea{width:100%;padding:13px 16px;background:rgba(255,255,255,0.05);border:1.5px solid rgba(45,111,255,0.2);border-radius:10px;color:#FAF7F2;font-family:'DM Sans',sans-serif;font-size:0.95rem;outline:none;transition:border-color 0.2s}
        .field input:focus,.field textarea:focus{border-color:#2D6FFF;background:rgba(45,111,255,0.06)}
        .field input::placeholder,.field textarea::placeholder{color:rgba(250,247,242,0.2)}
        .field textarea{resize:vertical;min-height:90px;line-height:1.6}
        .stars-wrap{display:flex;gap:10px;align-items:center;margin-bottom:8px}
        .star{font-size:2rem;cursor:pointer;transition:transform 0.15s;user-select:none;filter:grayscale(1);opacity:0.4}
        .star.active{filter:grayscale(0);opacity:1;transform:scale(1.1)}
        .star:hover{transform:scale(1.2)}
        .star-label{font-size:0.88rem;color:#2D6FFF;font-weight:600;min-height:20px;margin-top:4px}
        .exp-options{display:flex;flex-wrap:wrap;gap:8px}
        .exp-btn{padding:8px 16px;border-radius:100px;font-size:0.82rem;font-weight:500;border:1.5px solid rgba(45,111,255,0.25);background:transparent;color:rgba(250,247,242,0.5);cursor:pointer;transition:all 0.2s;font-family:'DM Sans',sans-serif}
        .exp-btn.selected{border-color:#2D6FFF;background:rgba(45,111,255,0.15);color:#FAF7F2}
        .exp-btn:hover{border-color:#2D6FFF;color:#FAF7F2}
        .next-run-box{display:flex;gap:14px;align-items:flex-start;padding:20px;background:rgba(18,10,148,0.2);border:1.5px solid rgba(45,111,255,0.25);border-radius:14px;cursor:pointer;transition:border-color 0.2s}
        .next-run-box.checked{border-color:#2D6FFF;background:rgba(45,111,255,0.1)}
        .next-run-box input[type=checkbox]{width:20px;height:20px;flex-shrink:0;margin-top:2px;accent-color:#2D6FFF;cursor:pointer}
        .next-run-title{font-family:'Poppins',sans-serif;font-weight:700;font-size:1rem;color:#FAF7F2;margin-bottom:4px}
        .next-run-sub{font-size:0.82rem;color:rgba(250,247,242,0.45);line-height:1.5}
        .next-run-date{display:inline-block;margin-top:8px;font-size:0.75rem;font-weight:600;letter-spacing:0.08em;color:#2D6FFF;text-transform:uppercase}
        .submit-btn{width:100%;padding:16px;background:#120a94;color:#fff;border:1.5px solid #2D6FFF;border-radius:12px;font-family:'DM Sans',sans-serif;font-size:1rem;font-weight:700;cursor:pointer;transition:all 0.2s;margin-top:8px}
        .submit-btn:hover{background:#2D6FFF}
        .submit-btn:disabled{opacity:0.5;cursor:not-allowed}
        .error-msg{color:#E05050;font-size:0.85rem;margin-top:12px;text-align:center}
        .success-wrap{text-align:center;padding:60px 20px}
        .success-icon{font-size:3rem;margin-bottom:20px;display:block}
        .success-title{font-family:'Poppins',sans-serif;font-weight:900;font-size:1.8rem;color:#FAF7F2;margin-bottom:12px;letter-spacing:-0.03em}
        .success-sub{font-size:0.95rem;color:rgba(250,247,242,0.5);line-height:1.7;margin-bottom:28px}
        .ig-link{display:inline-block;color:#2D6FFF;font-size:0.88rem;font-weight:600;text-decoration:none}
        .bfooter{text-align:center;padding:0 48px 40px}
        .bfooter p{font-size:0.78rem;color:rgba(250,247,242,0.2);line-height:1.7}
        @media(max-width:768px){
          .bnav{padding:0 24px}
          .hero{padding:100px 24px 32px}
          .form-wrap{padding:24px 16px 60px}
          .form-card{padding:24px}
          .bfooter{padding:0 16px 40px}
        }
      `}</style>

      <div className="dp">
        <nav className="bnav">
          <a href="/runners" className="rlogo">bizzat <span>runners</span></a>
          <Link href="/runners" className="back-btn">← Geri dön</Link>
        </nav>

        <div className="hero">
          <div className="hero-tag">Anıtkabir Koşusu</div>
          <h1 className="hero-title">
            Koşuyu nasıl<br/>
            <span className="accent">değerlendirdin?</span>
          </h1>
          <p className="hero-sub">
            Birlikte koştuk — şimdi birlikte gelişelim. Görüşlerin bizim için çok değerli.
          </p>
        </div>

        <div className="form-wrap">
          <div className="form-card">
            {done ? (
              <div className="success-wrap">
                <span className="success-icon">⚡</span>
                <h2 className="success-title">Teşekkürler!</h2>
                <p className="success-sub">
                  Görüşlerin için teşekkürler — her geri bildirim bizi daha iyi yapıyor.<br/>
                  {form.sonraki_kosu && '21 Haziran koşusunda görüşürüz! 🏃'}
                </p>
                <a href="https://instagram.com/bizzatrunners" target="_blank" rel="noopener noreferrer" className="ig-link">
                  @bizzatrunners ↗
                </a>
              </div>
            ) : (
              <form onSubmit={submit}>

                <div className="field">
                  <label>Adın Soyadın<span>*</span></label>
                  <input
                    name="ad_soyad"
                    value={form.ad_soyad}
                    onChange={handle}
                    required
                    placeholder="Adın ve soyadın"
                  />
                </div>

                <div className="field">
                  <label>Genel Değerlendirme<span>*</span></label>
                  <div className="stars-wrap">
                    {stars.map(s => (
                      <span
                        key={s}
                        className={`star${form.puan >= s ? ' active' : ''}`}
                        onClick={() => setPuan(s)}
                      >⭐</span>
                    ))}
                  </div>
                  <div className="star-label">{form.puan > 0 ? starLabels[form.puan] : ''}</div>
                </div>

                <div className="field">
                  <label>Koşuyu nasıl buldun? <span style={{fontSize:'0.7rem',fontWeight:400,textTransform:'none',letterSpacing:0,color:'rgba(250,247,242,0.3)'}}>birden fazla seçebilirsin</span></label>
                  <div className="exp-options">
                    {['Enerjik', 'Motive edici', 'Zorlandım', 'Rahatlatıcı', 'Eğlenceliydi', 'Yeniden gelirim', 'Arkadaşıma öneririm'].map(opt => (
                      <button
                        key={opt}
                        type="button"
                        className={`exp-btn${form.deneyim.includes(opt) ? ' selected' : ''}`}
                        onClick={() => toggleDeneyim(opt)}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="field">
                  <label>Ekibe mesajın</label>
                  <textarea
                    name="mesaj"
                    value={form.mesaj}
                    onChange={handle}
                    placeholder="Ne düşündüğünü merak ediyoruz — her şeyi yazabilirsin."
                  />
                </div>

                <div className="field">
                  <label>Sıradaki Koşu</label>
                  <label
                    className={`next-run-box${form.sonraki_kosu ? ' checked' : ''}`}
                    htmlFor="sonraki_kosu"
                  >
                    <input
                      type="checkbox"
                      id="sonraki_kosu"
                      name="sonraki_kosu"
                      checked={form.sonraki_kosu}
                      onChange={handle}
                    />
                    <div>
                      <div className="next-run-title">21 Haziran koşusuna katılmak istiyorum</div>
                      <div className="next-run-sub">
                        Bir sonraki buluşmada da aramızda ol. Rota ve detaylar yakında paylaşılacak.
                      </div>
                      <span className="next-run-date">21 Haziran 2026 · Ankara</span>
                    </div>
                  </label>
                </div>

                {error && <div className="error-msg">{error}</div>}

                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? 'Gönderiliyor...' : 'Değerlendirmeyi Gönder →'}
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="bfooter">
          <p>
            Run Beyond Running — Ankara<br/>
            <a href="https://instagram.com/bizzatrunners" target="_blank" rel="noopener noreferrer" style={{color:'#2D6FFF',textDecoration:'none'}}>
              @bizzatrunners
            </a>
          </p>
        </div>
      </div>
    </>
  )
}