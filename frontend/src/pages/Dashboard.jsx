import { useState, useEffect } from 'react'
import axios from 'axios'

const C = {
  bg:     '#04070F',
  card:   '#0D1526',
  cyan:   '#00F0FF',
  violet: '#7B2FFF',
  red:    '#FF3A3A',
  green:  '#00FF8C',
  amber:  '#FFB800',
  muted:  '#3D4F6B',
  sub:    '#7A8BAA',
}

const THREATS = [
  { src:'Russia',  dst:'Iraq',         type:'DDoS',        sev:'high',  time:'2m ago' },
  { src:'Unknown', dst:'Baghdad Bank', type:'Phishing',    sev:'high',  time:'5m ago' },
  { src:'China',   dst:'Oil Ministry', type:'Recon',       sev:'med',   time:'12m ago' },
  { src:'Iran',    dst:'Telecom',      type:'SQLInjection',sev:'high',  time:'18m ago' },
  { src:'Unknown', dst:'MOI Network',  type:'Malware',     sev:'med',   time:'31m ago' },
]

const STATS = [
  { label:'Active Threats',    value:'14',    color: C.red,    icon:'🚨' },
  { label:'Scans Today',       value:'1,247', color: C.cyan,   icon:'🔍' },
  { label:'Blocked Attacks',   value:'89',    color: C.green,  icon:'🛡️' },
  { label:'Avg Response Time', value:'340ms', color: C.violet, icon:'⚡' },
]

const TOOLS = [
  { name:'URL Scanner',      icon:'🔗', path:'/',       color: C.cyan,   desc:'Scan links via VirusTotal' },
  { name:'Social Analyzer',  icon:'🧠', path:'/social', color: C.violet, desc:'Detect manipulation tactics' },
  { name:'Voice Detector',   icon:'🎙️', path:'/voice',  color: C.red,    desc:'Detect AI voice deepfakes' },
  { name:'About Platform',   icon:'📋', path:'/about',  color: C.green,  desc:'Platform documentation' },
]

export default function Dashboard() {
  const [url, setUrl]         = useState('')
  const [scanning, setScanning] = useState(false)
  const [result, setResult]   = useState(null)
  const [threats, setThreats] = useState(THREATS)
  const [tick, setTick]       = useState(0)

  // Live feed simulation
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 5000)
    return () => clearInterval(id)
  }, [])

  const newThreats = [
    { src:'Brazil',  dst:'Finance Ministry', type:'Ransomware',  sev:'high', time:'now' },
    { src:'Unknown', dst:'Power Grid',        type:'SCADA Attack',sev:'high', time:'now' },
    { src:'Turkey',  dst:'Airport Systems',   type:'Phishing',    sev:'med',  time:'now' },
  ]

  useEffect(() => {
    if (tick === 0) return
    const t = newThreats[tick % newThreats.length]
    setThreats(prev => [t, ...prev].slice(0, 6))
  }, [tick])

  async function quickScan() {
    if (!url || scanning) return
    setScanning(true); setResult(null)
    try {
      const res = await axios.post('http://127.0.0.1:8000/scan', { url })
      setResult(res.data)
    } catch {
      setResult({ error: true })
    }
    setScanning(false)
  }

  const sevColor = s => s === 'high' ? C.red : s === 'med' ? C.amber : C.green

  return (
    <div style={{ minHeight:'100vh', background: C.bg,
      color:'#EDF2FF', fontFamily:"'Space Grotesk',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:.2}}
        .tool-btn:hover{transform:translateY(-3px)!important;border-color:rgba(0,240,255,.4)!important}
        .scan-btn:hover{opacity:.85}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-thumb{background:#3D4F6B;border-radius:2px}
      `}</style>

      {/* ── TOP BAR ── */}
      <div style={{ background:'rgba(4,7,15,.95)', borderBottom:`1px solid rgba(0,240,255,.08)`,
        padding:'0 2rem', height:56, display:'flex', alignItems:'center',
        justifyContent:'space-between', position:'sticky', top:0, zIndex:100,
        backdropFilter:'blur(20px)' }}>

        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
            <path d="M20 3L4 10V21C4 29.5 11 37.3 20 39C29 37.3 36 29.5 36 21V10L20 3Z"
              stroke={C.cyan} strokeWidth="1.5" fill="rgba(0,240,255,.07)"/>
            <path d="M13 20L18 25L27 15" stroke={C.cyan} strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span style={{ fontWeight:700, fontSize:'1rem', letterSpacing:'.06em',
            background:`linear-gradient(135deg,${C.cyan},${C.violet})`,
            WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
            CYBER GUARDIAN
          </span>
          <span style={{ background:'rgba(123,47,255,.2)', color: C.violet,
            fontSize:'.65rem', padding:'2px 10px', borderRadius:4,
            fontFamily:'monospace', letterSpacing:'.08em', border:`1px solid ${C.violet}44` }}>
            ANALYST MODE
          </span>
        </div>

        <div style={{ display:'flex', alignItems:'center', gap:20 }}>
          <a href="/" style={{ color: C.sub, textDecoration:'none',
            fontSize:'.82rem', fontWeight:500 }}>User View</a>
          <div style={{ display:'flex', alignItems:'center', gap:6,
            fontFamily:'monospace', fontSize:'.68rem', color: C.green }}>
            <div style={{ width:7, height:7, borderRadius:'50%', background: C.green,
              boxShadow:`0 0 8px ${C.green}`, animation:'pulse 2s infinite' }}/>
            ALL SYSTEMS OPERATIONAL
          </div>
        </div>
      </div>

      <div style={{ padding:'1.5rem 2rem', maxWidth:1400, margin:'0 auto' }}>

        {/* ── STATS ROW ── */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)',
          gap:'1rem', marginBottom:'1.5rem' }}>
          {STATS.map(s => (
            <div key={s.label} style={{ background: C.card,
              border:`1px solid ${s.color}22`, borderRadius:12,
              padding:'1.2rem 1.5rem',
              boxShadow:`0 0 20px ${s.color}08` }}>
              <div style={{ display:'flex', justifyContent:'space-between',
                alignItems:'flex-start', marginBottom:8 }}>
                <span style={{ fontSize:'1.6rem' }}>{s.icon}</span>
                <span style={{ fontFamily:'monospace', fontSize:'.6rem',
                  color: C.muted, letterSpacing:'.08em' }}>LIVE</span>
              </div>
              <div style={{ fontSize:'2rem', fontWeight:700, color: s.color,
                lineHeight:1, marginBottom:4, fontFamily:"'Space Grotesk',sans-serif" }}>
                {s.value}
              </div>
              <div style={{ fontSize:'.72rem', color: C.sub }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── MAIN GRID ── */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr',
          gap:'1rem', marginBottom:'1rem' }}>

          {/* Quick Scanner */}
          <div style={{ background: C.card, border:`1px solid rgba(0,240,255,.15)`,
            borderRadius:14, padding:'1.5rem' }}>
            <div style={{ fontFamily:'monospace', fontSize:'.68rem', color: C.muted,
              letterSpacing:'.1em', marginBottom:'.8rem' }}>
              // QUICK_URL_SCAN
            </div>
            <div style={{ display:'flex', gap:8, marginBottom:'1rem' }}>
              <input value={url} onChange={e=>setUrl(e.target.value)}
                onKeyDown={e=>e.key==='Enter'&&quickScan()}
                placeholder="https://suspicious-domain.com"
                style={{ flex:1, background:'rgba(255,255,255,.03)',
                  border:`1px solid rgba(0,240,255,.1)`, borderRadius:8,
                  padding:'10px 14px', color:'#EDF2FF',
                  fontFamily:'monospace', fontSize:'.82rem', outline:'none',
                  direction:'ltr' }}/>
              <button onClick={quickScan} className="scan-btn"
                style={{ padding:'10px 20px',
                  background:`linear-gradient(135deg,${C.cyan},#00A8FF)`,
                  border:'none', borderRadius:8, color: C.bg,
                  fontWeight:700, fontSize:'.85rem', cursor:'pointer',
                  whiteSpace:'nowrap' }}>
                {scanning ? '🔍 Scanning...' : '⚡ Scan'}
              </button>
            </div>

            {result && (
              <div style={{ padding:'12px 14px', borderRadius:8,
                border:`1px solid ${result.safe ? C.green : C.red}33`,
                background: result.safe
                  ? 'rgba(0,255,140,.06)' : 'rgba(255,58,58,.08)' }}>
                {result.error ? (
                  <span style={{ color: C.red, fontSize:'.82rem' }}>
                    ❌ Backend offline
                  </span>
                ) : (
                  <>
                    <div style={{ display:'flex', alignItems:'center',
                      gap:8, marginBottom:6 }}>
                      <span>{result.safe ? '✅' : '🚨'}</span>
                      <span style={{ fontWeight:700, fontSize:'.9rem',
                        color: result.safe ? C.green : C.red }}>
                        {result.message}
                      </span>
                      <span style={{ marginLeft:'auto', fontFamily:'monospace',
                        fontSize:'.72rem', color: C.sub }}>
                        Score: {result.score}/100
                      </span>
                    </div>
                    {result.malicious !== undefined && (
                      <div style={{ display:'flex', gap:8 }}>
                        {[['Malicious',result.malicious,C.red],
                          ['Suspicious',result.suspicious,C.amber],
                          ['Harmless',result.harmless,C.green]
                        ].map(([l,v,c])=>(
                          <div key={l} style={{ flex:1, textAlign:'center',
                            background:'rgba(255,255,255,.03)',
                            borderRadius:6, padding:'6px' }}>
                            <div style={{ fontSize:'1.1rem', fontWeight:700,
                              color:c }}>{v}</div>
                            <div style={{ fontSize:'.6rem', color: C.sub,
                              fontFamily:'monospace' }}>{l}</div>
                          </div>
                        ))}
                      </div>
                    )}
                    {result.source && (
                      <div style={{ marginTop:6, fontFamily:'monospace',
                        fontSize:'.62rem', color: C.cyan }}>
                        🛡️ {result.source}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          {/* Live Threat Feed */}
          <div style={{ background: C.card,
            border:`1px solid rgba(255,58,58,.15)`,
            borderRadius:14, padding:'1.5rem' }}>
            <div style={{ display:'flex', alignItems:'center',
              justifyContent:'space-between', marginBottom:'1rem' }}>
              <div style={{ fontFamily:'monospace', fontSize:'.68rem',
                color: C.muted, letterSpacing:'.1em' }}>
                // LIVE_THREAT_FEED
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:5,
                fontFamily:'monospace', fontSize:'.62rem', color: C.red }}>
                <div style={{ width:5, height:5, borderRadius:'50%',
                  background: C.red, boxShadow:`0 0 6px ${C.red}`,
                  animation:'blink 1.2s infinite' }}/>
                LIVE
              </div>
            </div>

            <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
              {threats.map((t, i) => (
                <div key={i} style={{ display:'flex', alignItems:'center',
                  gap:10, padding:'8px 10px', borderRadius:8,
                  background:'rgba(255,255,255,.02)',
                  border:`1px solid rgba(255,255,255,.04)`,
                  animation: i===0 ? 'pulse .5s ease' : 'none' }}>
                  <div style={{ width:7, height:7, borderRadius:'50%',
                    background: sevColor(t.sev),
                    boxShadow:`0 0 6px ${sevColor(t.sev)}`,
                    flexShrink:0 }}/>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontFamily:'monospace', fontSize:'.7rem',
                      color:'#EDF2FF', overflow:'hidden',
                      textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                      <span style={{ color: sevColor(t.sev) }}>{t.src}</span>
                      <span style={{ color: C.muted }}> → </span>
                      <span>{t.dst}</span>
                    </div>
                    <div style={{ fontFamily:'monospace', fontSize:'.6rem',
                      color: C.muted }}>{t.type}</div>
                  </div>
                  <div style={{ fontFamily:'monospace', fontSize:'.6rem',
                    color: C.muted, flexShrink:0 }}>{t.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── TOOLS GRID ── */}
        <div style={{ background: C.card,
          border:`1px solid rgba(0,240,255,.08)`,
          borderRadius:14, padding:'1.5rem',
          marginBottom:'1rem' }}>
          <div style={{ fontFamily:'monospace', fontSize:'.68rem',
            color: C.muted, letterSpacing:'.1em', marginBottom:'1rem' }}>
            // ANALYSIS_TOOLS
          </div>
          <div style={{ display:'grid',
            gridTemplateColumns:'repeat(4,1fr)', gap:'1rem' }}>
            {TOOLS.map(t => (
              <a key={t.name} href={t.path} className="tool-btn"
                style={{ background:'rgba(255,255,255,.02)',
                  border:`1px solid ${t.color}22`, borderRadius:10,
                  padding:'1.2rem', textDecoration:'none', color:'inherit',
                  display:'block', transition:'all .25s',
                  cursor:'pointer' }}>
                <div style={{ fontSize:'1.8rem', marginBottom:8 }}>{t.icon}</div>
                <div style={{ fontWeight:600, fontSize:'.88rem',
                  marginBottom:4, color: t.color }}>{t.name}</div>
                <div style={{ fontSize:'.72rem', color: C.sub,
                  lineHeight:1.5 }}>{t.desc}</div>
              </a>
            ))}
          </div>
        </div>

        {/* ── SYSTEM STATUS ── */}
        <div style={{ background: C.card,
          border:`1px solid rgba(0,240,255,.08)`,
          borderRadius:14, padding:'1.5rem' }}>
          <div style={{ fontFamily:'monospace', fontSize:'.68rem',
            color: C.muted, letterSpacing:'.1em', marginBottom:'1rem' }}>
            // SYSTEM_STATUS
          </div>
          <div style={{ display:'grid',
            gridTemplateColumns:'repeat(4,1fr)', gap:'1rem' }}>
            {[
              { name:'VirusTotal API',    status:'online',  latency:'120ms' },
              { name:'FastAPI Backend',   status:'online',  latency:'8ms'   },
              { name:'React Frontend',    status:'online',  latency:'2ms'   },
              { name:'Threat Intel Feed', status:'online',  latency:'340ms' },
            ].map(s => (
              <div key={s.name} style={{ background:'rgba(255,255,255,.02)',
                borderRadius:8, padding:'12px' }}>
                <div style={{ display:'flex', alignItems:'center',
                  gap:6, marginBottom:4 }}>
                  <div style={{ width:6, height:6, borderRadius:'50%',
                    background: C.green, boxShadow:`0 0 6px ${C.green}`,
                    animation:'pulse 2s infinite' }}/>
                  <span style={{ fontFamily:'monospace', fontSize:'.65rem',
                    color: C.green, textTransform:'uppercase' }}>
                    {s.status}
                  </span>
                </div>
                <div style={{ fontSize:'.8rem', fontWeight:600,
                  marginBottom:2 }}>{s.name}</div>
                <div style={{ fontFamily:'monospace', fontSize:'.65rem',
                  color: C.muted }}>latency: {s.latency}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign:'center', marginTop:'1.5rem',
          fontFamily:'monospace', fontSize:'.65rem', color: C.muted }}>
          CYBER GUARDIAN v2.4.0 — ANALYST DASHBOARD —
          <span style={{ color: C.cyan }}> Developed by Cyber Valkariz</span>
        </div>
      </div>
    </div>
  )
}