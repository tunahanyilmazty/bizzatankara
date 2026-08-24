'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '../../../lib/supabase'
import Link from 'next/link'

function BasvuruForm() {
  const searchParams = useSearchParams()
  const kosuRef = searchParams.get('kosu') || null

  const [katilimTipi, setKatilimTipi] = useState(null)
  const [seciliKosular, setSeciliKosular] = useState([])
  const [form, setForm] = useState({
    ad_soyad: '',
    email: '',
    telefon: '',
    yas: '',
    kosu_deneyimi: '',
    sizi_taniyalim: '',
    motivasyon: '',
    nereden_duydunuz: '',
    kvkk_onay: false,
  })
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const [showKvkk, setShowKvkk] = useState(false)

  const isSecim = kosuRef === 'secim'

  const kosular = [
    { id: '25agustos', label: 'Rota #014 — Anıttepe Koşu Parkuru [Akşam Koşusu]', tarih: '25 Ağustos Salı', saat: '20.30' },
    { id: '30agustos', label: 'Rota #015 — 30 Ağustos Zafer Parkı', tarih: '30 Ağustos Pazar', saat: '07.30' },
  ]

  const is12 = kosuRef === '12temmuz'
  const is21 = kosuRef === '21haziran'
  const is19 = kosuRef === '19temmuz'
  const is26 = kosuRef === '26temmuz'
  const is2a = kosuRef === '2agustos'
  const is5a = kosuRef === '5agustos'
  const is9a = kosuRef === '9agustos'
  const is12a = kosuRef === '12agustos'
  const is16a = kosuRef === '16agustos'
  const is19a = kosuRef === '19agustos'
  const is23a = kosuRef === '23agustos'
  const isKosu = is12 || is21 || is19 || is26 || is2a || is5a || is9a || is12a || is16a || is19a || is23a || isSecim
  const kosuLabel = is23a ? '23 Ağustos' : is19a ? '19 Ağustos' : is16a ? '16 Ağustos' : is12a ? '12 Ağustos' : is9a ? '9 Ağustos' : is5a ? '5 Ağustos' : is2a ? '2 Ağustos' : is26 ? '26 Temmuz' : is19 ? '19 Temmuz' : is12 ? '12 Temmuz' : is21 ? '21 Haziran' : null

  function handle(e) {
    const { name, value, type, checked } = e.target
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  function toggleKosu(id) {
    setSeciliKosular(prev =>
      prev.includes(id) ? prev.filter(k => k !== id) : [...prev, id]
    )
  }

  async function submit(e) {
    e.preventDefault()
    if (!form.kvkk_onay) { setError('Lütfen aydınlatma metnini onaylayın.'); return }
    if (isSecim && seciliKosular.length === 0) { setError('Lütfen en az bir koşu seçin.'); return }

    setLoading(true)
    setError('')

    const kosuReferans = isSecim ? seciliKosular.join(',') : kosuRef

    const insertData = katilimTipi === 'onceki'
      ? {
          ad_soyad: form.ad_soyad,
          telefon: form.telefon,
          kvkk_onay: form.kvkk_onay,
          kosu_referans: kosuReferans,
          email: '',
          yas: null,
          kosu_deneyimi: 'Daha önce katıldım',
        }
      : {
          ad_soyad: form.ad_soyad,
          email: form.email,
          telefon: form.telefon,
          yas: parseInt(form.yas),
          kosu_deneyimi: form.kosu_deneyimi,
          sizi_taniyalim: form.sizi_taniyalim,
          motivasyon: form.motivasyon,
          nereden_duydunuz: form.nereden_duydunuz,
          kvkk_onay: form.kvkk_onay,
          kosu_referans: kosuReferans,
        }

    const { error: err } = await supabase.from('runners_applications').insert(insertData)
    setLoading(false)
    if (err) { setError('Bir hata oluştu, tekrar deneyin.'); return }
    setDone(true)
  }

  return (
    <>
      {showKvkk && (
        <div className="kvkk-modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setShowKvkk(false) }}>
          <div className="kvkk-modal">
            <button className="kvkk-modal-close" onClick={() => setShowKvkk(false)}>✕</button>
            <h2>Kişisel Verilerin Korunması Aydınlatma Metni</h2>
            <div className="kvkk-modal-section">
              <h3>Veri Sorumlusu</h3>
              <p>bizzat runners (bizzatankara.com)</p>
            </div>
            <div className="kvkk-modal-section">
              <h3>Toplanan Veriler</h3>
              <p>Ad soyad, e-posta, telefon, yaş ve koşu deneyimi bilgileri.</p>
            </div>
            <div className="kvkk-modal-section">
              <h3>İşleme Amacı</h3>
              <p>Koşu komünitesi üyelik sürecinin yürütülmesi ve etkinlik duyurularının iletilmesi.</p>
            </div>
            <div className="kvkk-modal-section">
              <h3>Aktarım</h3>
              <p>Kişisel verileriniz üçüncü kişilerle paylaşılmayacaktır.</p>
            </div>
            <div className="kvkk-modal-section">
              <h3>Haklarınız</h3>
              <p>KVKK&apos;nın 11. maddesi kapsamında verilerinize erişim, düzeltme, silme ve işlemeye itiraz haklarına sahipsiniz. Talepler için: bizzatankara@gmail.com</p>
            </div>
            <button className="kvkk-modal-btn" onClick={() => {
              setForm(f => ({ ...f, kvkk_onay: true }))
              setShowKvkk(false)
            }}>
              Okudum, Onaylıyorum ✓
            </button>
          </div>
        </div>
      )}

      <div className="hero">
        <div className="hero-tag">
          {isSecim ? 'Koşu Seçimi · Ağustos 2026' : isKosu ? `Rota · ${kosuLabel} 2026` : 'Komüniteye Katıl'}
        </div>
        <h1 className="hero-title">
          {isSecim ? (
            <>Koşunu <span className="accent">seç.</span></>
          ) : isKosu ? (
            <>{kosuLabel} <span className="accent">Koşusu</span></>
          ) : (
            <>Başvuru <span className="accent">Formu</span></>
          )}
        </h1>
        <p className="hero-sub">
          {isSecim
            ? 'İki koşudan birine ya da ikisine birden başvurabilirsin.'
            : isKosu
            ? 'Buluşma noktası seçilen katılımcılarla paylaşılacak.'
            : "Ankara'dan doğan komünitenin bir parçası ol."}
        </p>
        {isKosu && !isSecim && (
          <p className="hero-note">
            Komüniteyi birlikte ve sağlıklı büyütmek istiyoruz — her koşu için sınırlı kontenjan açıyoruz.
          </p>
        )}
      </div>

      <div className="form-wrap">
        <div className="form-card">
          {done ? (
            <div className="success-wrap">
              <span className="success-icon">⚡</span>
              <h2 className="success-title">Başvurun alındı!</h2>
              <p className="success-sub">
                {isSecim && seciliKosular.length > 0
                  ? `${seciliKosular.includes('25agustos') ? '25 Ağustos' : ''}${seciliKosular.length === 2 ? ' ve ' : ''}${seciliKosular.includes('30agustos') ? '30 Ağustos' : ''} koşusu için başvurunu aldık.`
                  : 'Harika! Başvurunu aldık. Seçilen katılımcılara buluşma noktasını ileteceğiz.'
                }<br/>
                Bizi Instagram&apos;dan takip etmeyi unutma.
              </p>
              <div style={{display:'flex',flexDirection:'column',gap:'12px',alignItems:'center',marginTop:'8px'}}>
                <a href="https://instagram.com/bizzatrunners" target="_blank" rel="noopener noreferrer" className="ig-link">
                  @bizzatrunners ↗
                </a>
                <a href="https://www.strava.com/clubs/bizzatrunners" target="_blank" rel="noopener noreferrer" style={{display:'inline-flex',alignItems:'center',gap:'8px',color:'#FC4C02',fontSize:'0.88rem',fontWeight:600,textDecoration:'none'}}>
                  🟠 Strava kulübümüze katıl →
                </a>
              </div>
            </div>
          ) : (
            <>
              {isKosu && !katilimTipi && (
                <div className="katilim-secim">
                  <h3 className="katilim-title">Daha önce bizzatrunners koşusuna katıldın mı?</h3>
                  <div className="katilim-btns">
                    <button type="button" className="katilim-btn" onClick={() => setKatilimTipi('onceki')}>
                      ✓ Evet, daha önce katıldım
                    </button>
                    <button type="button" className="katilim-btn katilim-btn-outline" onClick={() => setKatilimTipi('yeni')}>
                      İlk kez katılıyorum
                    </button>
                  </div>
                </div>
              )}

              {(katilimTipi || !isKosu) && (
                <form onSubmit={submit}>
                  {isKosu && katilimTipi && (
                    <button
                      type="button"
                      onClick={() => { setKatilimTipi(null); setError('') }}
                      style={{background:'none',border:'none',color:'rgba(250,247,242,0.35)',fontSize:'0.78rem',cursor:'pointer',marginBottom:'20px',padding:0,fontFamily:'inherit'}}
                    >
                      ← Geri
                    </button>
                  )}

                  {/* KOŞU SEÇİMİ */}
                  {isSecim && (
                    <div className="field">
                      <label>Hangi Koşulara Katılmak İstiyorsun?<span>*</span></label>
                      <div style={{display:'flex',flexDirection:'column',gap:'10px',marginTop:'4px'}}>
                                                 {kosular.map(k => (
                          <label
                            key={k.id}
                            htmlFor={`kosu-${k.id}`}
                            style={{
                              display:'flex',gap:'14px',alignItems:'flex-start',padding:'16px',
                              background: seciliKosular.includes(k.id) ? 'rgba(45,111,255,0.1)' : 'rgba(255,255,255,0.03)',
                              border: `1.5px solid ${seciliKosular.includes(k.id) ? '#2D6FFF' : 'rgba(45,111,255,0.2)'}`,
                              borderRadius:'10px',cursor:'pointer',transition:'all 0.2s'
                            }}
                          >
                            <input
                              id={`kosu-${k.id}`}
                              type="checkbox"
                              checked={seciliKosular.includes(k.id)}
                              onChange={() => toggleKosu(k.id)}
                              style={{display:'none'}}
                            />
                            <div style={{
                              width:'20px',height:'20px',flexShrink:0,marginTop:'2px',
                              borderRadius:'4px',border:`2px solid ${seciliKosular.includes(k.id) ? '#2D6FFF' : 'rgba(45,111,255,0.4)'}`,
                              background: seciliKosular.includes(k.id) ? '#2D6FFF' : 'transparent',
                              display:'flex',alignItems:'center',justifyContent:'center',
                              transition:'all 0.2s',flexShrink:0
                            }}>
                              {seciliKosular.includes(k.id) && (
                                <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
                                  <path d="M1 4L4.5 7.5L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              )}
                            </div>
                            <div>
                              <div style={{fontFamily:'Poppins,sans-serif',fontWeight:700,fontSize:'0.95rem',color:'#FAF7F2',marginBottom:'4px'}}>{k.label}</div>
                              <div style={{fontSize:'0.8rem',color:'rgba(250,247,242,0.45)'}}>{k.tarih} · {k.saat}</div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {katilimTipi === 'onceki' ? (
                    <>
                      <div style={{background:'rgba(45,111,255,0.06)',border:'1px solid rgba(45,111,255,0.15)',borderRadius:'10px',padding:'12px 16px',marginBottom:'20px'}}>
                        <p style={{fontSize:'0.82rem',color:'rgba(250,247,242,0.45)',lineHeight:1.6}}>
                          Sen zaten komünitedensin :) — sadece adını ve telefonunu doğrulayalım.
                        </p>
                      </div>
                      <div className="field">
                        <label>Adın Soyadın<span>*</span></label>
                        <input name="ad_soyad" value={form.ad_soyad} onChange={handle} required placeholder="Adın ve soyadın"/>
                      </div>
                      <div className="field">
                        <label>Telefon<span>*</span></label>
                        <input name="telefon" value={form.telefon} onChange={handle} required placeholder="05xx xxx xx xx"/>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="field-row">
                        <div className="field">
                          <label>Adın Soyadın<span>*</span></label>
                          <input name="ad_soyad" value={form.ad_soyad} onChange={handle} required placeholder="Adın ve soyadın"/>
                        </div>
                        <div className="field">
                          <label>Yaşın<span>*</span></label>
                          <input name="yas" type="number" value={form.yas} onChange={handle} required placeholder="Yaşın" min="10" max="99"/>
                        </div>
                      </div>
                      <div className="field-row">
                        <div className="field">
                          <label>E-posta<span>*</span></label>
                          <input name="email" type="email" value={form.email} onChange={handle} required placeholder="ornek@mail.com"/>
                        </div>
                        <div className="field">
                          <label>Telefon<span>*</span></label>
                          <input name="telefon" value={form.telefon} onChange={handle} required placeholder="05xx xxx xx xx"/>
                        </div>
                      </div>
                      <div className="field">
                        <label>Koşu Deneyimin<span>*</span></label>
                        <select name="kosu_deneyimi" value={form.kosu_deneyimi} onChange={handle} required>
                          <option value="">Seç...</option>
                          <option value="Hiç koşmadım">Hiç koşmadım</option>
                          <option value="Ara sıra koşuyorum">Ara sıra koşuyorum</option>
                          <option value="Düzenli koşuyorum">Düzenli koşuyorum</option>
                          <option value="Yarışmalara katılıyorum">Yarışmalara katılıyorum</option>
                        </select>
                      </div>
                      <div className="field">
                        <label>Seni Tanıyalım<span>*</span></label>
                        <textarea
                          name="sizi_taniyalim"
                          value={form.sizi_taniyalim}
                          onChange={handle}
                          required
                          placeholder="İlgi alanların, mesleğin, sana dair şeyler; bir amaç uğruna koşabilecek bir komünitenin temelinde ortak ruhlar var."
                          style={{minHeight:'120px'}}
                        />
                      </div>
                      <div className="field">
                        <label>Katılma Motivasyonun</label>
                        <textarea name="motivasyon" value={form.motivasyon} onChange={handle} placeholder="Neden bizzat runners'a katılmak istiyorsun?"/>
                      </div>
                      {!isKosu && (
                        <div className="field">
                          <label>Bizi Nereden Duydun?</label>
                          <select name="nereden_duydunuz" value={form.nereden_duydunuz} onChange={handle}>
                            <option value="">Seç...</option>
                            <option value="Instagram">Instagram</option>
                            <option value="Arkadaş tavsiyesi">Arkadaş tavsiyesi</option>
                            <option value="bizzatankara.com">bizzatankara.com</option>
                            <option value="Diğer">Diğer</option>
                          </select>
                        </div>
                      )}
                    </>
                  )}

                  <div className="kvkk-row">
                    <input type="checkbox" id="kvkk" name="kvkk_onay" checked={form.kvkk_onay} onChange={handle}/>
                    <span className="kvkk-row-text">
                      <button type="button" className="kvkk-link" onClick={() => setShowKvkk(true)}>
                        Aydınlatma Metni
                      </button>
                      &apos;ni okudum ve kişisel verilerimin işlenmesini onaylıyorum.
                    </span>
                  </div>

                  {error && <div className="error-msg">{error}</div>}

                  <button type="submit" className="submit-btn" disabled={loading}>
                    {loading ? 'Gönderiliyor...' : isSecim ? 'Başvuruyu Gönder →' : isKosu ? `${kosuLabel} Koşusuna Başvur →` : 'Başvuruyu Gönder →'}
                  </button>
                </form>
              )}
            </>
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
    </>
  )
}

export default function BasvuruPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@700;800;900&family=DM+Sans:wght@300;400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        .bp{background:#090915;min-height:100vh;font-family:'DM Sans',sans-serif;color:#FAF7F2}
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
        .hero-title{font-family:'Poppins',sans-serif;font-weight:900;font-size:clamp(2rem,5vw,3.5rem);line-height:1;letter-spacing:-0.04em;margin-bottom:16px}
        .accent{color:#2D6FFF}
        .hero-sub{font-size:1rem;color:rgba(250,247,242,0.5);max-width:480px;margin:0 auto;line-height:1.7}
        .hero-note{font-size:0.82rem;color:rgba(45,111,255,0.7);max-width:480px;margin:8px auto 0;line-height:1.6}
        .form-wrap{max-width:640px;margin:0 auto;padding:40px 48px 80px}
        .form-card{background:#0D0D20;border:1px solid rgba(45,111,255,0.2);border-radius:24px;padding:40px;position:relative;overflow:hidden}
        .form-card::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,#120a94,#2D6FFF)}
        .field{margin-bottom:20px}
        .field label{display:block;font-size:0.78rem;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:rgba(250,247,242,0.5);margin-bottom:8px}
        .field label span{color:#E05050;margin-left:2px}
        .field input,.field select,.field textarea{width:100%;padding:13px 16px;background:rgba(255,255,255,0.05);border:1.5px solid rgba(45,111,255,0.2);border-radius:10px;color:#FAF7F2;font-family:'DM Sans',sans-serif;font-size:0.95rem;outline:none;transition:border-color 0.2s;appearance:none}
        .field input:focus,.field select:focus,.field textarea:focus{border-color:#2D6FFF;background:rgba(45,111,255,0.06)}
        .field input::placeholder,.field textarea::placeholder{color:rgba(250,247,242,0.2)}
        .field select option{background:#0D0D20;color:#FAF7F2}
        .field textarea{resize:vertical;min-height:100px;line-height:1.6}
        .field-row{display:grid;grid-template-columns:1fr 1fr;gap:16px}
        .kvkk-row{display:flex;gap:12px;align-items:center;padding:14px 16px;background:rgba(18,10,148,0.15);border:1.5px solid rgba(45,111,255,0.15);border-radius:10px;margin-bottom:24px}
        .kvkk-row input[type=checkbox]{width:20px;height:20px;flex-shrink:0;accent-color:#2D6FFF;cursor:pointer}
        .kvkk-row-text{font-size:0.85rem;color:rgba(250,247,242,0.6);line-height:1.5}
        .kvkk-link{color:#2D6FFF;font-weight:600;cursor:pointer;text-decoration:underline;background:none;border:none;font-size:0.85rem;font-family:inherit;padding:0}
        .submit-btn{width:100%;padding:16px;background:#120a94;color:#fff;border:1.5px solid #2D6FFF;border-radius:12px;font-family:'DM Sans',sans-serif;font-size:1rem;font-weight:700;cursor:pointer;transition:all 0.2s;letter-spacing:0.02em}
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
        .kvkk-modal-overlay{position:fixed;inset:0;z-index:9000;background:rgba(9,9,21,0.88);backdrop-filter:blur(10px);display:flex;align-items:center;justify-content:center;padding:24px}
        .kvkk-modal{background:#0D0D20;border:1px solid rgba(45,111,255,0.3);border-radius:24px;padding:40px;width:100%;max-width:560px;position:relative;max-height:80vh;overflow-y:auto}
        .kvkk-modal-close{position:absolute;top:16px;right:20px;background:none;border:none;color:rgba(250,247,242,0.4);font-size:1.4rem;cursor:pointer}
        .kvkk-modal h2{font-family:'Poppins',sans-serif;font-weight:800;font-size:1.2rem;color:#FAF7F2;margin-bottom:20px}
        .kvkk-modal-section{margin-bottom:16px}
        .kvkk-modal-section h3{font-size:0.82rem;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:#2D6FFF;margin-bottom:6px}
        .kvkk-modal-section p{font-size:0.88rem;color:rgba(250,247,242,0.55);line-height:1.7}
        .kvkk-modal-btn{width:100%;padding:14px;background:#120a94;color:#fff;border:1.5px solid #2D6FFF;border-radius:10px;font-family:'DM Sans',sans-serif;font-size:0.95rem;font-weight:700;cursor:pointer;margin-top:20px;transition:all 0.2s}
        .kvkk-modal-btn:hover{background:#2D6FFF}
        .katilim-secim{text-align:center;padding:20px 0}
        .katilim-title{font-family:'Poppins',sans-serif;font-weight:700;font-size:1.1rem;color:#FAF7F2;margin-bottom:24px;line-height:1.4}
        .katilim-btns{display:flex;flex-direction:column;gap:12px}
        .katilim-btn{width:100%;padding:14px;background:#120a94;color:#fff;border:1.5px solid #2D6FFF;border-radius:12px;font-family:'DM Sans',sans-serif;font-size:0.95rem;font-weight:700;cursor:pointer;transition:all 0.2s}
        .katilim-btn:hover{background:#2D6FFF}
        .katilim-btn-outline{background:transparent;color:rgba(250,247,242,0.6);border-color:rgba(45,111,255,0.25)}
        .katilim-btn-outline:hover{background:rgba(45,111,255,0.08);color:#FAF7F2;border-color:#2D6FFF}
        @media(max-width:768px){
          .bnav{padding:0 24px}
          .hero{padding:100px 24px 32px}
          .form-wrap{padding:24px 16px 60px}
          .form-card{padding:24px}
          .field-row{grid-template-columns:1fr}
          .bfooter{padding:0 16px 40px}
          .kvkk-modal{padding:24px}
        }
      `}</style>

      <div className="bp">
        <nav className="bnav">
          <a href="/runners" className="rlogo">bizzat <span>runners</span></a>
          <Link href="/runners" className="back-btn">← Geri dön</Link>
        </nav>
        <Suspense fallback={<div style={{padding:'120px 48px',textAlign:'center',color:'rgba(250,247,242,0.3)'}}>Yükleniyor...</div>}>
          <BasvuruForm />
        </Suspense>
      </div>
    </>
  )
}