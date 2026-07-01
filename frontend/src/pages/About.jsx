export default function About() {
  return (
    <div style={{ minHeight:'100vh', background:'#04070F',
      color:'#EDF2FF', fontFamily:"'Space Grotesk',sans-serif",
      padding:'2rem' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700&display=swap');`}</style>

      <div style={{ maxWidth:'800px', margin:'0 auto' }}>

        <a href="/" style={{ color:'#7A8BAA', textDecoration:'none',
          fontSize:'0.85rem', display:'flex', alignItems:'center',
          gap:'6px', marginBottom:'2rem' }}>← Back to Home</a>

        {/* Header */}
        <div style={{ fontFamily:'monospace', fontSize:'0.7rem',
          color:'#00F0FF', letterSpacing:'0.1em',
          marginBottom:'0.5rem' }}>// ABOUT_CYBER_GUARDIAN</div>

        <h1 style={{ fontSize:'clamp(1.8rem,4vw,3rem)',
          fontWeight:700, marginBottom:'1rem',
          background:'linear-gradient(135deg,#00F0FF,#7B2FFF)',
          WebkitBackgroundClip:'text',
          WebkitTextFillColor:'transparent' }}>
          About Cyber Guardian
        </h1>

        <p style={{ color:'#7A8BAA', marginBottom:'3rem',
          fontSize:'0.95rem', lineHeight:1.75 }}>
          Cyber Guardian is a professional AI-powered cybersecurity platform
          designed to detect and protect against modern digital threats including
          phishing links, social engineering attacks, and AI voice deepfakes.
        </p>

        {/* Tools */}
        <div style={{ marginBottom:'3rem' }}>
          <div style={{ fontFamily:'monospace', fontSize:'0.68rem',
            color:'#3D4F6B', letterSpacing:'0.1em',
            marginBottom:'1rem' }}>// PLATFORM_TOOLS</div>

          {[
            { icon:'🔗', name:'Phishing Link Detector',
              desc:'Scans URLs against 90+ security engines via VirusTotal API with SSL and WHOIS analysis.',
              color:'#00F0FF' },
            { icon:'🧠', name:'Social Engineering Analyzer',
              desc:'Detects psychological manipulation, urgency tactics, and fraud patterns in messages.',
              color:'#7B2FFF' },
            { icon:'🎙️', name:'AI Voice Deepfake Detector',
              desc:'Analyzes audio files to detect AI-generated or cloned voices using spectral analysis.',
              color:'#FF3A3A' },
          ].map(t => (
            <div key={t.name} style={{ background:'#0D1526',
              border:`1px solid ${t.color}22`,
              borderRadius:'12px', padding:'1.5rem',
              marginBottom:'1rem',
              display:'flex', gap:'1rem', alignItems:'flex-start' }}>
              <span style={{ fontSize:'1.8rem' }}>{t.icon}</span>
              <div>
                <div style={{ fontWeight:700, marginBottom:'4px',
                  color:t.color }}>{t.name}</div>
                <div style={{ fontSize:'0.83rem',
                  color:'#7A8BAA', lineHeight:1.6 }}>{t.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Tech Stack */}
        <div style={{ marginBottom:'3rem' }}>
          <div style={{ fontFamily:'monospace', fontSize:'0.68rem',
            color:'#3D4F6B', letterSpacing:'0.1em',
            marginBottom:'1rem' }}>// TECH_STACK</div>

          <div style={{ display:'grid',
            gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',
            gap:'1rem' }}>
            {[
              ['⚛️','React + Vite','Frontend'],
              ['🐍','FastAPI','Backend'],
              ['🛡️','VirusTotal API','Threat Intel'],
              ['🤖','AI Analysis','ML Engine'],
            ].map(([icon, name, label]) => (
              <div key={name} style={{ background:'#0D1526',
                border:'1px solid rgba(0,240,255,0.08)',
                borderRadius:'10px', padding:'1rem',
                textAlign:'center' }}>
                <div style={{ fontSize:'1.5rem',
                  marginBottom:'6px' }}>{icon}</div>
                <div style={{ fontWeight:600,
                  fontSize:'0.9rem' }}>{name}</div>
                <div style={{ fontSize:'0.72rem',
                  color:'#3D4F6B', fontFamily:'monospace' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Security */}
        <div style={{ background:'#0D1526',
          border:'1px solid rgba(0,255,140,0.15)',
          borderRadius:'12px', padding:'1.5rem',
          marginBottom:'2rem' }}>
          <div style={{ fontFamily:'monospace', fontSize:'0.68rem',
            color:'#00FF8C', letterSpacing:'0.1em',
            marginBottom:'1rem' }}>// SECURITY_FEATURES</div>
          {[
            '✅ API Keys stored in .env — never exposed',
            '✅ Input validation on all endpoints',
            '✅ File size limits on uploads',
            '✅ CORS protection enabled',
            '✅ No user data stored permanently',
            '✅ Fallback system if API fails',
          ].map(f => (
            <div key={f} style={{ fontSize:'0.83rem',
              color:'#7A8BAA', padding:'4px 0',
              fontFamily:'monospace' }}>{f}</div>
          ))}
        </div>

        {/* Version */}
        <div style={{ fontFamily:'monospace', fontSize:'0.7rem',
          color:'#3D4F6B', textAlign:'center', paddingBottom:'2rem' }}>
          CYBER_GUARDIAN v2.4.0 — BUILD_STABLE — 2025
        </div>

      </div>
    </div>
  )
}