import { useState, useEffect, useRef } from 'react'
import axios from 'axios'

const STEPS = ['DNS_LOOKUP','VIRUSTOTAL','SAFE_BROWSE','AI_ANALYSIS','REPORT']

export default function Home() {
  const [url, setUrl]           = useState('')
  const [pct, setPct]           = useState(0)
  const [scanning, setScanning] = useState(false)
  const [stepIdx, setStepIdx]   = useState(-1)
  const [result, setResult]     = useState(null)
  const canvasRef = useRef(null)

  /* ── Particle Background ── */
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let W, H, particles = [], raf

    const resize = () => {
      W = canvas.width  = window.innerWidth
      H = canvas.height = window.innerHeight
    }
    const init = () => {
      particles = Array.from({ length: 50 }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - .5) * .25,
        vy: (Math.random() - .5) * .25,
        r: Math.random() * 1.4 + .3,
        a: Math.random() * .5 + .1,
      }))
    }
    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      ctx.strokeStyle = 'rgba(0,240,255,0.035)'
      ctx.lineWidth = .5
      for (let x = 0; x < W; x += 60) {
        ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke()
      }
      for (let y = 0; y < H; y += 60) {
        ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke()
      }
      particles.forEach((p, i) => {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0 || p.x > W) p.vx *= -1
        if (p.y < 0 || p.y > H) p.vy *= -1
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2)
        ctx.fillStyle = `rgba(0,240,255,${p.a})`; ctx.fill()
        particles.slice(i+1).forEach(q => {
          const d = Math.hypot(p.x-q.x, p.y-q.y)
          if (d < 110) {
            ctx.beginPath(); ctx.moveTo(p.x,p.y); ctx.lineTo(q.x,q.y)
            ctx.strokeStyle = `rgba(0,240,255,${.07*(1-d/110)})`
            ctx.lineWidth = .4; ctx.stroke()
          }
        })
      })
      raf = requestAnimationFrame(draw)
    }
    resize(); init(); draw()
    window.addEventListener('resize', () => { resize(); init() })
    return () => cancelAnimationFrame(raf)
  }, [])

  /* ── Scan ── */
  async function startScan() {
    if (!url || scanning) return
    setScanning(true); setResult(null); setPct(0); setStepIdx(0)
    let p = 0
    const timer = setInterval(() => {
      p += 2; if (p > 90) { clearInterval(timer); return }
      setPct(p)
      setStepIdx(Math.min(Math.floor(p / 20), 4))
    }, 60)
    try {
      const res = await axios.post('http://127.0.0.1:8000/scan', { url })
      clearInterval(timer); setPct(100); setStepIdx(5)
      setTimeout(() => { setResult(res.data); setScanning(false) }, 300)
    } catch {
      clearInterval(timer); setScanning(false)
      setResult({ error: true })
    }
  }

  const type = result
    ? result.error ? 'danger' : result.safe ? 'safe' : 'danger'
    : null

  const riskColor = type === 'safe' ? '#00FF8C'
                  : type === 'danger' ? '#FF3A3A' : '#FFB800'

  return (
    <div style={{ minHeight:'100vh', background:'#04070F', color:'#EDF2FF',
      fontFamily:"'Space Grotesk',sans-serif", overflowX:'hidden' }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        input::placeholder{color:#3D4F6B}
        @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(.8)}}
        @keyframes shimmer{0%,100%{opacity:.3}50%{opacity:1}}
        .scan-btn:hover{transform:translateY(-2px);box-shadow:0 0 40px rgba(0,240,255,.45)!important}
        .tool-card:hover{transform:translateY(-4px);border-color:rgba(0,240,255,.3)!important}
        .nav-link:hover{color:#00F0FF!important}
        ::-webkit-scrollbar{width:5px}
        ::-webkit-scrollbar-track{background:#04070F}
        ::-webkit-scrollbar-thumb{background:#3D4F6B;border-radius:3px}
      `}</style>

      {/* Background */}
      <canvas ref={canvasRef} style={{
        position:'fixed', inset:0, zIndex:0,
        pointerEvents:'none', opacity:.4
      }}/>

      <div style={{ position:'relative', zIndex:1 }}>

        {/* ── NAV ── */}
        <nav style={{
          position:'sticky', top:0, zIndex:100,
          display:'flex', alignItems:'center',
          justifyContent:'space-between',
          padding:'0 2.5rem', height:'64px',
          background:'rgba(4,7,15,0.88)',
          backdropFilter:'blur(20px)',
          borderBottom:'1px solid rgba(0,240,255,0.08)',
          gap:'1rem',
        }}>
          <a href="/" style={{ display:'flex', alignItems:'center',
            gap:'10px', textDecoration:'none' }}>
            <svg width="36" height="36" viewBox="0 0 40 40" fill="none">
              <path d="M20 3L4 10V21C4 29.5 11 37.3 20 39C29 37.3 36 29.5 36 21V10L20 3Z"
                stroke="#00F0FF" strokeWidth="1.5" fill="rgba(0,240,255,0.07)"/>
              <path d="M13 20L18 25L27 15" stroke="#00F0FF" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span style={{ fontWeight:700, fontSize:'1.05rem',
              letterSpacing:'0.06em',
              background:'linear-gradient(135deg,#00F0FF,#7B2FFF)',
              WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
              CYBER GUARDIAN
            </span>
          </a>

          <ul style={{ display:'flex', alignItems:'center',
            gap:'1.6rem', listStyle:'none' }}>
            <li><a href="/social" className="nav-link"
              style={{ color:'#7A8BAA', textDecoration:'none',
                fontSize:'0.87rem', fontWeight:500, transition:'color .2s' }}>
              Social Analyzer
            </a></li>
            <li><a href="/voice" className="nav-link"
              style={{ color:'#7A8BAA', textDecoration:'none',
                fontSize:'0.87rem', fontWeight:500, transition:'color .2s' }}>
              Voice Detector
            </a></li>
            <li><a href="/dashboard" className="nav-link"
  style={{
    color:'#8B5CF6',
    textDecoration:'none',
    fontSize:'0.87rem',
    fontWeight:600,
    padding:'6px 14px',
    borderRadius:'8px',
    border:'1px solid rgba(139,92,246,0.3)',
    transition:'all .2s'
  }}>
  🖥️ SOC Dashboard
</a></li>
  
            <li><a href="/" style={{
              background:'linear-gradient(135deg,#00F0FF,#00A8B5)',
              color:'#04070F', padding:'7px 18px', borderRadius:'8px',
              fontWeight:700, fontSize:'0.85rem', textDecoration:'none',
              boxShadow:'0 0 20px rgba(0,240,255,.2)',
            }}>Start Scan</a></li>
          </ul>

          <div style={{ display:'flex', alignItems:'center', gap:'6px',
            fontSize:'0.68rem', color:'#00FF8C', fontFamily:'monospace' }}>
            <div style={{ width:7, height:7, borderRadius:'50%',
              background:'#00FF8C', boxShadow:'0 0 8px #00FF8C',
              animation:'pulse 2s ease infinite' }}/>
            All Systems Operational
          </div>
        </nav>

        {/* ── HERO ── */}
        <section style={{ minHeight:'calc(100vh - 64px)', display:'flex',
          flexDirection:'column', alignItems:'center',
          justifyContent:'center', padding:'4rem 1.5rem', textAlign:'center' }}>

          <div style={{ display:'inline-flex', alignItems:'center', gap:'8px',
            padding:'6px 16px', borderRadius:'50px',
            border:'1px solid rgba(0,240,255,0.25)',
            background:'rgba(0,240,255,0.06)',
            fontSize:'0.7rem', color:'#00F0FF',
            letterSpacing:'0.08em', textTransform:'uppercase',
            marginBottom:'2rem', fontFamily:'monospace' }}>
            <div style={{ width:6, height:6, borderRadius:'50%',
              background:'#00F0FF', boxShadow:'0 0 8px #00F0FF',
              animation:'pulse 1.5s ease infinite' }}/>
            v2.4.0 — Cyber Guardian Platform
          </div>

          <h1 style={{ fontSize:'clamp(2.4rem,6vw,5rem)', fontWeight:700,
            lineHeight:1.1, letterSpacing:'-0.02em', marginBottom:'1.5rem' }}>
            Cybersecurity Shield<br/>
            <span style={{ background:'linear-gradient(135deg,#00F0FF,#00A8FF)',
              WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
              Detecting
            </span>{' '}Digital{' '}
            <span style={{ background:'linear-gradient(135deg,#7B2FFF,#C850C0)',
              WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
              Threats
            </span>
          </h1>

          <p style={{ fontSize:'1.05rem', color:'#7A8BAA',
            maxWidth:'560px', lineHeight:1.75, marginBottom:'2.5rem' }}>
            An integrated platform combining AI with global threat databases
            to detect phishing links, social engineering, and voice deepfakes.
          </p>

          {/* ── SCANNER CARD ── */}
          <div style={{ width:'100%', maxWidth:'720px',
            background:'#0D1526',
            border:'1px solid rgba(0,240,255,0.2)',
            borderRadius:'20px', padding:'2.5rem',
            boxShadow:'0 32px 80px rgba(0,0,0,.5)',
            marginBottom:'2rem', position:'relative', overflow:'hidden' }}>

            <div style={{ fontFamily:'monospace', fontSize:'0.68rem',
              color:'#3D4F6B', letterSpacing:'0.1em',
              textTransform:'uppercase', marginBottom:'0.8rem',
              textAlign:'left' }}>
              // URL_SCANNER — Powered by VirusTotal
            </div>

            {/* Input Row */}
            <div style={{ display:'flex', gap:'10px', marginBottom:'1.2rem' }}>
              <input
                value={url}
                onChange={e => setUrl(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && startScan()}
                placeholder="https://suspicious-site.com"
                style={{ flex:1, padding:'14px 18px',
                  background:'rgba(255,255,255,0.03)',
                  border:'1px solid rgba(0,240,255,0.1)',
                  borderRadius:'8px', color:'#EDF2FF',
                  fontFamily:'monospace', fontSize:'0.88rem',
                  outline:'none', direction:'ltr' }}
              />
              <button onClick={startScan} className="scan-btn"
                style={{ padding:'14px 28px',
                  background:'linear-gradient(135deg,#00F0FF,#00A8FF)',
                  border:'none', borderRadius:'8px',
                  color:'#04070F', fontWeight:700, fontSize:'0.95rem',
                  cursor:'pointer', whiteSpace:'nowrap',
                  boxShadow:'0 0 24px rgba(0,240,255,.25)',
                  transition:'all .2s' }}>
                {scanning ? '🔍 Scanning...' : '⚡ Instant Scan'}
              </button>
            </div>

            {/* Progress */}
            {scanning && (
              <div style={{ marginBottom:'1.2rem' }}>
                <div style={{ height:'3px',
                  background:'rgba(255,255,255,0.06)',
                  borderRadius:'99px', overflow:'hidden' }}>
                  <div style={{ height:'100%', width:pct+'%',
                    background:'linear-gradient(90deg,#00F0FF,#7B2FFF)',
                    borderRadius:'99px', transition:'width .3s ease',
                    boxShadow:'0 0 10px #00F0FF' }}/>
                </div>
                <div style={{ display:'flex', justifyContent:'space-between',
                  marginTop:'8px' }}>
                  {STEPS.map((s, i) => (
                    <span key={s} style={{
                      fontFamily:'monospace', fontSize:'0.62rem',
                      color: i < stepIdx ? '#00FF8C'
                           : i === stepIdx ? '#00F0FF' : '#3D4F6B',
                    }}>{s}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Result */}
            {result && !scanning && (
              <div style={{
                padding:'16px', borderRadius:'8px',
                border:`1px solid ${riskColor}33`,
                background: type === 'safe'
                  ? 'rgba(0,255,140,0.07)'
                  : 'rgba(255,58,58,0.08)',
                marginBottom:'1.2rem',
              }}>
                {result.error ? (
                  <p style={{ color:'#FF3A3A' }}>
                    ❌ Connection error — is backend running?
                  </p>
                ) : (
                  <>
                    {/* Header */}
                    <div style={{ display:'flex', alignItems:'center',
                      gap:'10px', marginBottom:'10px', flexWrap:'wrap' }}>
                      <span style={{ fontSize:'1.3rem' }}>
                        {type === 'safe' ? '✅' : '🚨'}
                      </span>
                      <span style={{ fontWeight:700, fontSize:'1rem',
                        color:riskColor }}>
                        {result.message}
                      </span>
                      <span style={{ marginLeft:'auto',
                        fontFamily:'monospace', fontSize:'0.8rem',
                        padding:'3px 10px', borderRadius:'4px',
                        background:'rgba(255,255,255,0.06)' }}>
                        Score: {result.score}/100
                      </span>
                    </div>

                    {/* VirusTotal Stats */}
                    {result.malicious !== undefined && (
                      <div style={{ display:'grid',
                        gridTemplateColumns:'repeat(3,1fr)',
                        gap:'8px', margin:'12px 0' }}>
                        {[
                          ['Malicious',  result.malicious,  '#FF3A3A'],
                          ['Suspicious', result.suspicious, '#FFB800'],
                          ['Harmless',   result.harmless,   '#00FF8C'],
                        ].map(([label, val, color]) => (
                          <div key={label} style={{
                            background:'rgba(255,255,255,0.03)',
                            border:`1px solid ${color}22`,
                            borderRadius:'8px', padding:'10px',
                            textAlign:'center' }}>
                            <div style={{ fontSize:'1.4rem',
                              fontWeight:700, color }}>{val}</div>
                            <div style={{ fontSize:'0.65rem',
                              color:'#7A8BAA',
                              fontFamily:'monospace' }}>{label}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Source */}
                    {result.source && (
                      <div style={{ fontFamily:'monospace',
                        fontSize:'0.65rem', color:'#00F0FF',
                        marginBottom:'8px' }}>
                        🛡️ {result.source}
                      </div>
                    )}

                    {/* Tags */}
                    <div style={{ display:'flex', flexWrap:'wrap', gap:'6px' }}>
                      <span style={{ fontFamily:'monospace', fontSize:'0.62rem',
                        padding:'3px 10px', borderRadius:'4px',
                        background:'rgba(255,255,255,0.05)',
                        color:'#7A8BAA' }}>
                        {result.safe ? '✅ Clean' : '⚠️ Threat Found'}
                      </span>
                      <span style={{ fontFamily:'monospace', fontSize:'0.62rem',
                        padding:'3px 10px', borderRadius:'4px',
                        background:'rgba(255,255,255,0.05)',
                        color:'#7A8BAA' }}>
                        Risk: {result.risk_level}
                      </span>
                      {result.total && (
                        <span style={{ fontFamily:'monospace', fontSize:'0.62rem',
                          padding:'3px 10px', borderRadius:'4px',
                          background:'rgba(255,255,255,0.05)',
                          color:'#7A8BAA' }}>
                          Engines: {result.total}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* API Badges */}
            <div style={{ display:'flex', flexWrap:'wrap',
              gap:'8px', justifyContent:'center' }}>
              {[
                ['#34D399','VirusTotal API'],
                ['#60A5FA','Google Safe Browsing'],
                ['#A78BFA','Claude AI Engine'],
                ['#F59E0B','WHOIS Lookup'],
              ].map(([c,l]) => (
                <div key={l} style={{ display:'flex', alignItems:'center',
                  gap:'6px', padding:'5px 12px', borderRadius:'6px',
                  background:'rgba(255,255,255,0.03)',
                  border:'1px solid rgba(255,255,255,0.07)',
                  fontFamily:'monospace', fontSize:'0.63rem',
                  color:'#3D4F6B' }}>
                  <div style={{ width:5, height:5, borderRadius:'50%',
                    background:c }}/>
                  {l}
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div style={{ display:'grid',
            gridTemplateColumns:'repeat(4,1fr)',
            gap:'1px', background:'rgba(0,240,255,0.08)',
            borderRadius:'14px', overflow:'hidden',
            maxWidth:'720px', width:'100%',
            marginBottom:'5rem' }}>
            {[
              ['2.4M+','#00F0FF','Links Scanned'],
              ['98.7%','#FF3A3A','Detection Accuracy'],
              ['340ms','#7B2FFF','Avg Scan Time'],
              ['24/7', '#00FF8C','Monitoring'],
            ].map(([v,c,l]) => (
              <div key={l} style={{ background:'#0D1526',
                padding:'1.2rem 1.5rem', textAlign:'center' }}>
                <div style={{ fontFamily:"'Space Grotesk',sans-serif",
                  fontSize:'2rem', fontWeight:700, color:c,
                  lineHeight:1, marginBottom:'4px' }}>{v}</div>
                <div style={{ fontSize:'0.72rem', color:'#3D4F6B' }}>{l}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── TOOLS ── */}
        <section style={{ padding:'5rem 2.5rem',
          maxWidth:'1200px', margin:'0 auto' }}>
          <div style={{ fontFamily:'monospace', fontSize:'0.68rem',
            color:'#00F0FF', letterSpacing:'0.12em',
            textTransform:'uppercase', marginBottom:'0.8rem',
            textAlign:'center' }}>// ADVANCED_TOOLS</div>
          <h2 style={{ fontSize:'clamp(1.6rem,3.5vw,2.4rem)',
            fontWeight:700, textAlign:'center',
            marginBottom:'0.6rem' }}>Advanced Detection Tools</h2>
          <p style={{ fontSize:'0.9rem', color:'#7A8BAA',
            textAlign:'center', maxWidth:'500px',
            margin:'0 auto 3rem' }}>
            Four AI-powered tools covering all dimensions of modern digital threats
          </p>

          <div style={{ display:'grid',
            gridTemplateColumns:'repeat(auto-fit,minmax(270px,1fr))',
            gap:'1.2rem' }}>
            {[
              { icon:'🔗', name:'Phishing Link Detector', href:'/',
                desc:'Full URL inspection via VirusTotal & Google Safe Browsing with WHOIS, SSL fingerprinting, and domain reputation scoring.',
                tags:['VirusTotal','Safe Browsing','DNS Analysis'],
                border:'rgba(0,240,255,0.15)', color:'#00F0FF',
                bg:'rgba(0,240,255,0.08)' },
              { icon:'🧠', name:'Social Engineering Analyzer', href:'/social',
                desc:'Detects psychological manipulation, artificial urgency, emotional deception, and fraud patterns in any message.',
                tags:['NLP Analysis','Urgency Detection','Manipulation Score'],
                border:'rgba(123,47,255,0.2)', color:'#7B2FFF',
                bg:'rgba(123,47,255,0.1)' },
              { icon:'🎙️', name:'AI Voice Deepfake Detector', href:'/voice',
                desc:'Upload audio files for AI analysis detecting synthetic or cloned voices using MFCC and Spectral Analysis.',
                tags:['MFCC Features','GAN Detection','Spectral Analysis'],
                border:'rgba(255,58,58,0.2)', color:'#FF3A3A',
                bg:'rgba(255,58,58,0.08)' },
              { icon:'📧', name:'Email Phishing Analyzer', href:'/',
                desc:'Full email inspection: SPF/DKIM/DMARC headers, embedded links, and suspicious attachment detection.',
                tags:['Header Analysis','SPF / DKIM','Phishing Score'],
                border:'rgba(0,255,140,0.15)', color:'#00FF8C',
                bg:'rgba(0,255,140,0.07)' },
            ].map(t => (
              <a key={t.name} href={t.href} className="tool-card"
                style={{ background:'#0D1526',
                  border:`1px solid ${t.border}`,
                  borderRadius:'14px', padding:'2rem',
                  cursor:'pointer', transition:'all .28s',
                  textDecoration:'none', color:'inherit',
                  display:'block' }}>
                <div style={{ width:52, height:52, borderRadius:'12px',
                  display:'grid', placeItems:'center', fontSize:'1.6rem',
                  marginBottom:'1.2rem', background:t.bg }}>{t.icon}</div>
                <div style={{ fontWeight:600, fontSize:'1.05rem',
                  marginBottom:'0.5rem' }}>{t.name}</div>
                <div style={{ fontSize:'0.83rem', color:'#7A8BAA',
                  lineHeight:1.65, marginBottom:'1.2rem' }}>{t.desc}</div>
                <div style={{ display:'flex', flexWrap:'wrap', gap:'6px' }}>
                  {t.tags.map(tg => (
                    <span key={tg} style={{ fontFamily:'monospace',
                      fontSize:'0.6rem', padding:'3px 10px',
                      borderRadius:'4px',
                      border:`1px solid ${t.color}`,
                      color:t.color }}>{tg}</span>
                  ))}
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer style={{ borderTop:'1px solid rgba(0,240,255,0.08)',
          padding:'2rem 2.5rem', display:'flex',
          justifyContent:'space-between', flexWrap:'wrap',
          gap:'1rem', fontFamily:'monospace',
          fontSize:'0.68rem', color:'#3D4F6B' }}>
          <span>© 2025 <span style={{color:'#00F0FF'}}>CYBER GUARDIAN</span></span>
          <span>
            Powered by <span style={{color:'#00F0FF'}}>VirusTotal</span> ·{' '}
            <span style={{color:'#00F0FF'}}>Claude AI</span>
          </span>
          <span style={{direction:'ltr'}}>v2.4.0 — BUILD_STABLE</span>
        </footer>

      </div>
    </div>
  )
}