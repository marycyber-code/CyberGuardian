import { useState } from 'react'
import axios from 'axios'

export default function SocialAnalyzer() {
  const [text, setText]     = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  async function analyze() {
    if (!text.trim()) return
    setLoading(true)
    setResult(null)
    try {
      const res = await axios.post(
        'http://127.0.0.1:8000/analyze/social',
        { text }
      )
      setResult(res.data)
    } catch {
      setResult({ error: true })
    }
    setLoading(false)
  }

  const color = result
    ? result.risk_level === 'HIGH'   ? '#FF3A3A'
    : result.risk_level === 'MEDIUM' ? '#FFB800'
    : '#00FF8C'
    : '#00F0FF'

  return (
    <div style={{
      minHeight: '100vh',
      background: '#04070F',
      color: '#EDF2FF',
      fontFamily: "'Space Grotesk', sans-serif",
      padding: '2rem',
    }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700&display=swap');`}</style>

      {/* HEADER */}
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <a href="/" style={{
          color: '#7A8BAA', textDecoration: 'none',
          fontSize: '0.85rem', display: 'flex',
          alignItems: 'center', gap: '6px',
          marginBottom: '2rem'
        }}>← Back to Home</a>

        <div style={{
          fontFamily: 'monospace', fontSize: '0.7rem',
          color: '#00F0FF', letterSpacing: '0.1em',
          marginBottom: '0.5rem'
        }}>// SOCIAL_ENGINEERING_ANALYZER</div>

        <h1 style={{
          fontSize: 'clamp(1.8rem,4vw,3rem)',
          fontWeight: 700, marginBottom: '0.5rem',
          background: 'linear-gradient(135deg,#7B2FFF,#C850C0)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>Social Engineering Analyzer</h1>

        <p style={{ color: '#7A8BAA', marginBottom: '2.5rem', fontSize: '0.95rem' }}>
          Paste any suspicious message or email to detect psychological manipulation tactics.
        </p>

        {/* INPUT CARD */}
        <div style={{
          background: '#0D1526',
          border: '1px solid rgba(123,47,255,0.25)',
          borderRadius: '16px', padding: '2rem',
          marginBottom: '1.5rem',
          boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
        }}>
          <div style={{
            fontFamily: 'monospace', fontSize: '0.68rem',
            color: '#3D4F6B', letterSpacing: '0.1em',
            marginBottom: '0.8rem'
          }}>// PASTE_MESSAGE_BELOW</div>

          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Paste suspicious message here...&#10;&#10;Example: 'URGENT! Your account will be suspended in 24 hours. Click here to verify your password immediately or lose access forever!'"
            rows={8}
            style={{
              width: '100%', padding: '14px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(123,47,255,0.15)',
              borderRadius: '8px', color: '#EDF2FF',
              fontFamily: 'monospace', fontSize: '0.88rem',
              outline: 'none', resize: 'vertical',
              lineHeight: 1.6,
            }}
          />

          <div style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', marginTop: '1rem'
          }}>
            <span style={{ fontFamily:'monospace', fontSize:'0.7rem', color:'#3D4F6B' }}>
              {text.length} characters
            </span>
            <button
              onClick={analyze}
              style={{
                padding: '12px 32px',
                background: 'linear-gradient(135deg,#7B2FFF,#C850C0)',
                border: 'none', borderRadius: '8px',
                color: '#fff', fontWeight: 700,
                fontSize: '0.95rem', cursor: 'pointer',
                boxShadow: '0 0 24px rgba(123,47,255,0.3)',
              }}
            >
              {loading ? '🔍 Analyzing...' : '🧠 Analyze Message'}
            </button>
          </div>
        </div>

        {/* RESULT */}
        {result && !loading && (
          <div style={{
            background: '#0D1526',
            border: `1px solid ${color}33`,
            borderRadius: '16px', padding: '2rem',
            boxShadow: `0 0 40px ${color}15`,
          }}>
            {result.error ? (
              <p style={{ color: '#FF3A3A' }}>❌ Connection error — is backend running?</p>
            ) : (
              <>
                {/* Risk Header */}
                <div style={{
                  display: 'flex', alignItems: 'center',
                  gap: '1rem', marginBottom: '1.5rem',
                  flexWrap: 'wrap',
                }}>
                  <span style={{ fontSize: '2rem' }}>
                    {result.risk_level === 'HIGH' ? '🚨'
                   : result.risk_level === 'MEDIUM' ? '⚠️' : '✅'}
                  </span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '1.2rem', color }}>
                      {result.risk_level} RISK
                    </div>
                    <div style={{ color: '#7A8BAA', fontSize: '0.85rem' }}>
                      Manipulation Score: {result.score}/100
                    </div>
                  </div>

                  {/* Score Bar */}
                  <div style={{ flex: 1, minWidth: '150px' }}>
                    <div style={{
                      height: '8px', background: 'rgba(255,255,255,0.06)',
                      borderRadius: '99px', overflow: 'hidden',
                    }}>
                      <div style={{
                        height: '100%', width: result.score + '%',
                        background: `linear-gradient(90deg, #7B2FFF, ${color})`,
                        borderRadius: '99px', transition: 'width 0.8s ease',
                        boxShadow: `0 0 10px ${color}`,
                      }} />
                    </div>
                  </div>
                </div>

                {/* Breakdown */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))',
                  gap: '1rem', marginBottom: '1.5rem',
                }}>
                  {Object.entries(result.breakdown).map(([k, v]) => (
                    <div key={k} style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.07)',
                      borderRadius: '10px', padding: '1rem',
                      textAlign: 'center',
                    }}>
                      <div style={{
                        fontSize: '1.6rem', fontWeight: 700,
                        color: v > 0 ? color : '#3D4F6B',
                      }}>{v}</div>
                      <div style={{
                        fontSize: '0.72rem', color: '#7A8BAA',
                        textTransform: 'capitalize', marginTop: '4px',
                      }}>{k} triggers</div>
                    </div>
                  ))}
                </div>

                {/* Triggers Found */}
                {result.triggers.length > 0 && (
                  <div>
                    <div style={{
                      fontFamily: 'monospace', fontSize: '0.68rem',
                      color: '#3D4F6B', letterSpacing: '0.1em',
                      marginBottom: '0.6rem'
                    }}>MANIPULATION_KEYWORDS_DETECTED</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {result.triggers.map(t => (
                        <span key={t} style={{
                          fontFamily: 'monospace', fontSize: '0.72rem',
                          padding: '4px 12px', borderRadius: '4px',
                          background: `${color}15`,
                          border: `1px solid ${color}33`,
                          color,
                        }}>{t}</span>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}