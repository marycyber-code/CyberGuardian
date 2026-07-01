import { useState, useRef } from 'react'
import axios from 'axios'

export default function VoiceDetector() {
  const [file, setFile]       = useState(null)
  const [result, setResult]   = useState(null)
  const [loading, setLoading] = useState(false)
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef()

  function handleFile(f) {
    if (!f) return
    const allowed = ['audio/wav','audio/mpeg','audio/mp3',
                     'audio/ogg','audio/flac','audio/mp4']
    if (!allowed.includes(f.type)) {
      alert('Please upload an audio file (mp3, wav, ogg, flac)')
      return
    }
    setFile(f)
    setResult(null)
  }

  async function analyze() {
    if (!file) return
    setLoading(true)
    setResult(null)
    const form = new FormData()
    form.append('file', file)
    try {
      const res = await axios.post(
        'http://127.0.0.1:8000/analyze/voice',
        form,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      )
      setResult(res.data)
    } catch {
      setResult({ error: true })
    }
    setLoading(false)
  }

  const color = result
    ? result.is_deepfake ? '#FF3A3A' : '#00FF8C'
    : '#FF3A3A'

  return (
    <div style={{
      minHeight: '100vh',
      background: '#04070F',
      color: '#EDF2FF',
      fontFamily: "'Space Grotesk', sans-serif",
      padding: '2rem',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700&display=swap');
        .drop-zone:hover { border-color: rgba(255,58,58,0.4) !important; }
      `}</style>

      <div style={{ maxWidth: '800px', margin: '0 auto' }}>

        <a href="/" style={{
          color: '#7A8BAA', textDecoration: 'none',
          fontSize: '0.85rem', display: 'flex',
          alignItems: 'center', gap: '6px',
          marginBottom: '2rem'
        }}>← Back to Home</a>

        <div style={{
          fontFamily: 'monospace', fontSize: '0.7rem',
          color: '#FF3A3A', letterSpacing: '0.1em',
          marginBottom: '0.5rem'
        }}>// VOICE_DEEPFAKE_DETECTOR</div>

        <h1 style={{
          fontSize: 'clamp(1.8rem,4vw,3rem)',
          fontWeight: 700, marginBottom: '0.5rem',
          background: 'linear-gradient(135deg,#FF3A3A,#FF8C00)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>AI Voice Deepfake Detector</h1>

        <p style={{ color: '#7A8BAA', marginBottom: '2.5rem', fontSize: '0.95rem' }}>
          Upload an audio file to detect if the voice is AI-generated or cloned.
        </p>

        {/* DROP ZONE */}
        <div
          className="drop-zone"
          onClick={() => inputRef.current.click()}
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => {
            e.preventDefault(); setDragging(false)
            handleFile(e.dataTransfer.files[0])
          }}
          style={{
            background: dragging ? 'rgba(255,58,58,0.08)' : '#0D1526',
            border: `2px dashed ${dragging ? '#FF3A3A' : 'rgba(255,58,58,0.2)'}`,
            borderRadius: '16px', padding: '3rem 2rem',
            textAlign: 'center', cursor: 'pointer',
            transition: 'all 0.2s', marginBottom: '1.5rem',
          }}
        >
          <input
            ref={inputRef} type="file"
            accept="audio/*" style={{ display: 'none' }}
            onChange={e => handleFile(e.target.files[0])}
          />

          {file ? (
            <>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎵</div>
              <div style={{ fontWeight: 600, marginBottom: '4px' }}>{file.name}</div>
              <div style={{ color: '#7A8BAA', fontSize: '0.83rem' }}>
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </div>
            </>
          ) : (
            <>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎙️</div>
              <div style={{ fontWeight: 600, marginBottom: '4px' }}>
                Drop audio file here or click to browse
              </div>
              <div style={{ color: '#7A8BAA', fontSize: '0.83rem' }}>
                Supports: MP3, WAV, OGG, FLAC, MP4
              </div>
            </>
          )}
        </div>

        {/* ANALYZE BUTTON */}
        {file && (
          <button
            onClick={analyze}
            style={{
              width: '100%', padding: '14px',
              background: 'linear-gradient(135deg,#FF3A3A,#FF8C00)',
              border: 'none', borderRadius: '10px',
              color: '#fff', fontWeight: 700,
              fontSize: '1rem', cursor: 'pointer',
              marginBottom: '1.5rem',
              boxShadow: '0 0 30px rgba(255,58,58,0.3)',
            }}
          >
            {loading ? '🔍 Analyzing Audio...' : '⚡ Detect Deepfake'}
          </button>
        )}

        {/* LOADING ANIMATION */}
        {loading && (
          <div style={{
            background: '#0D1526',
            border: '1px solid rgba(255,58,58,0.2)',
            borderRadius: '12px', padding: '1.5rem',
            marginBottom: '1.5rem', fontFamily: 'monospace',
          }}>
            {['Extracting MFCC features...',
              'Running spectral analysis...',
              'Checking GAN artifacts...',
              'Comparing voice patterns...',
              'Generating report...'
            ].map((step, i) => (
              <div key={i} style={{
                color: '#7A8BAA', fontSize: '0.78rem',
                padding: '4px 0', display: 'flex',
                alignItems: 'center', gap: '8px'
              }}>
                <span style={{ color: '#FF3A3A' }}>›</span> {step}
              </div>
            ))}
          </div>
        )}

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
                <div style={{
                  display: 'flex', alignItems: 'center',
                  gap: '1rem', marginBottom: '1.5rem',
                }}>
                  <span style={{ fontSize: '2.5rem' }}>
                    {result.is_deepfake ? '🚨' : '✅'}
                  </span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '1.3rem', color }}>
                      {result.is_deepfake
                        ? 'DEEPFAKE DETECTED — AI Generated Voice'
                        : 'AUTHENTIC — Real Human Voice'}
                    </div>
                    <div style={{ color: '#7A8BAA', fontSize: '0.85rem', marginTop: '2px' }}>
                      Confidence: {result.confidence}% · File: {result.filename}
                    </div>
                  </div>
                </div>

                {/* Confidence Bar */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    fontSize: '0.75rem', color: '#7A8BAA',
                    fontFamily: 'monospace', marginBottom: '6px'
                  }}>
                    <span>DEEPFAKE_PROBABILITY</span>
                    <span>{result.confidence}%</span>
                  </div>
                  <div style={{
                    height: '8px', background: 'rgba(255,255,255,0.06)',
                    borderRadius: '99px', overflow: 'hidden'
                  }}>
                    <div style={{
                      height: '100%', width: result.confidence + '%',
                      background: `linear-gradient(90deg,#FF8C00,${color})`,
                      borderRadius: '99px',
                      boxShadow: `0 0 10px ${color}`,
                      transition: 'width 1s ease',
                    }} />
                  </div>
                </div>

                {/* Tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {result.indicators.map(ind => (
                    <span key={ind} style={{
                      fontFamily: 'monospace', fontSize: '0.72rem',
                      padding: '4px 12px', borderRadius: '4px',
                      background: `${color}15`,
                      border: `1px solid ${color}33`,
                      color,
                    }}>{ind}</span>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}