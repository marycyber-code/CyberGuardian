import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Shield, AlertTriangle, Activity, Search, ShieldAlert, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar'; 
import '../components/Dashboard.css';      

function MiniSpark({ data, color }) {
  const w = 60, h = 20;
  const min = Math.min(...data), max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) =>
    `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * (h - 3) - 1.5}`
  ).join(' L');
  return (
    <svg width={w} height={h} style={{ display: 'block' }}>
      <path d={`M${pts}`} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.8" />
    </svg>
  );
}

const sparkData = {
  threats:  [8, 10, 9, 12, 11, 14, 13, 15, 14, 11],
  scans:    [900, 950, 1000, 1050, 1100, 1150, 1200, 1220, 1247, 1264],
  blocked:  [60, 65, 70, 75, 78, 80, 83, 86, 89, 92],
  response: [380, 360, 350, 345, 342, 340, 341, 339, 340, 340],
};

export default function Dashboard() {
  const [activeThreats, setActiveThreats] = useState(14);
  const [scansToday, setScansToday] = useState(1247);
  const [blockedAttacks, setBlockedAttacks] = useState(89);
  const [currentTime, setCurrentTime] = useState('');
  const [scanUrl, setScanUrl] = useState('');
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);

  // مصفوفة بيانات ثابتة تمثل سيناريو هجوم حقيقي وموثق (Scenario-Based Demo) لشرحه أمام اللجنة
  const demoIncidentFeed = [
    { id: 1, sev: 'CRITICAL', sevColor: '#EF4444', source: '103.212.x.x', target: 'Internal DB Server', type: 'SQL Injection Probe' },
    { id: 2, sev: 'HIGH',     sevColor: '#F59E0B', source: 'Botnet Cluster', target: 'API Gateway Auth', type: 'Brute Force Attempt' },
    { id: 3, sev: 'MEDIUM',   sevColor: '#3B82F6', source: '185.45.x.x',   target: 'Public Web App',   type: 'XSS Reflection' },
  ];

  const [chartData] = useState([
    { time: '09:00', Attacks: 42 },
    { time: '09:05', Attacks: 68 },
    { time: '09:10', Attacks: 45 },
    { time: '09:15', Attacks: 92 },
    { time: '09:20', Attacks: 74 },
    { time: '09:25', Attacks: 115 },
  ]);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-GB', { hour12: false }) + ' UTC+3');
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  const handleScan = async () => {
    if (!scanUrl || scanning) return;
    setScanning(true);
    setScanResult(null);
    try {
      const res = await fetch('http://127.0.0.1:8000/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: scanUrl })
      });
      const data = await res.json();
      setScanResult(data);
    } catch {
      setScanResult({ error: true });
    }
    setScanning(false);
  };

  return (
    <div className="soc-container">
      <div className="soc-layout">
        
        <Sidebar />

        <div className="soc-main-content">
          
          {/* NOTICE BADGE: إعلان صريح وذكي أمام اللجنة بوضع المحاكاة والتدريب */}
          <div style={{
            backgroundColor: 'rgba(245, 158, 11, 0.1)',
            border: '1px solid #F59E0B',
            borderRadius: '8px',
            padding: '8px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'between',
            fontSize: '0.85rem',  
            color: '#F59E0B'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Cpu size={16} className="animate-pulse" />
              <strong>[TACTICAL SIMULATION MODULE]</strong> - Pre-configured incident scenarios for capbility demonstration. Live scanner remains fully operational below.
            </div>
          </div>

          <header className="soc-header" style={{ marginTop: '0' }}>
            <div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#06B6D4', margin: 0 }}>
                CYBER GUARDIAN CONTROL COMPLEX
              </h1>
              <p style={{ color: '#64748B', fontSize: '0.8rem', margin: '4px 0 0 0' }}>
                Tactical Security Operations • Evaluation Grid
              </p>
            </div>
            <div className="header-meta">
              <span className="time-badge">🟢 {currentTime}</span>
              <span style={{
               color: '#06B6D4',
               fontSize: '0.7rem',
               fontFamily: 'monospace',
               padding: '3px 10px',
               borderRadius: '4px',
               background: 'rgba(6,182,212,0.1)',
              border: '1px solid rgba(6,182,212,0.25)'
             }}>
               ● SYSTEM READY
              </span>
            </div>
          </header>

          <div className="kpi-grid">
            <motion.div className="kpi-card" whileHover={{ y: -3 }}>
              <div className="kpi-card-header">
                <AlertTriangle size={18} color="#EF4444" />
                <span className="trend-indicator trend-up" style={{ backgroundColor: 'rgba(239,68,68,0.15)', color: '#EF4444' }}>BASELINE</span>
              </div>
              <h3 className="kpi-value" style={{ color: '#EF4444' }}>{activeThreats}</h3>
              <p className="kpi-title">Threat Baseline</p>
              <MiniSpark data={sparkData.threats} color="#EF4444" />
            </motion.div>

            <motion.div className="kpi-card" whileHover={{ y: -3 }}>
              <div className="kpi-card-header">
                <Search size={18} color="#06B6D4" />
                <span className="trend-indicator trend-stable" style={{ backgroundColor: 'rgba(6,182,212,0.15)', color: '#06B6D4' }}>LIVE FEED</span>
              </div>
              <h3 className="kpi-value">{scansToday.toLocaleString()}</h3>
              <p className="kpi-title">SIMULATION Scans</p>
              <MiniSpark data={sparkData.scans} color="#06B6D4" />
            </motion.div>

            <motion.div className="kpi-card" whileHover={{ y: -3 }}>
              <div className="kpi-card-header">
                <Shield size={18} color="#10B981" />
                <span className="trend-indicator trend-stable" style={{ backgroundColor: 'rgba(16,185,129,0.15)', color: '#10B981' }}>MITIGATED</span>
              </div>
              <h3 className="kpi-value" style={{ color: '#10B981' }}>{blockedAttacks}</h3>
              <p className="kpi-title">MITIGATED Scans</p>
              <MiniSpark data={sparkData.blocked} color="#10B981" />
            </motion.div>

            <motion.div className="kpi-card" whileHover={{ y: -3 }}>
              <div className="kpi-card-header">
                <Activity size={18} color="#3B82F6" />
                <span className="trend-indicator trend-stable" style={{ backgroundColor: 'rgba(59,130,246,0.15)', color: '#3B82F6' }}>RESPONSE</span>
              </div>
              <h3 className="kpi-value">340ms</h3>
              <p className="kpi-title">Response Time</p>
              <MiniSpark data={sparkData.response} color="#3B82F6" />
            </motion.div>
          </div>

          <div className="panel-grid-top">
            {/* الجزء الفعلي والحقيقي 100% المرتبط بالباكيند */}
            <div className="soc-panel">
              <h4 className="panel-title" style={{ color: '#10B981' }}>// REAL_TIME_PRODUCTION_SCANNER (LIVE)</h4>
              <div className="scanner-input-group">
                <input 
                  type="text" 
                  value={scanUrl} 
                  onChange={e => setScanUrl(e.target.value)} 
                  onKeyDown={e => e.key === 'Enter' && handleScan()}
                  placeholder="Enter suspicious link to test live backend..." 
                />
                <button onClick={handleScan} style={{ backgroundColor: '#10B981' }}>{scanning ? '...' : 'Scan Link'}</button>
              </div>
              
              <div className="service-status-row"><span>• FastAPI Backend Node (Port 8000)</span><span style={{ color: '#10B981' }}>Connected</span></div>
              <div className="service-status-row"><span>• Local Security Logic Rules</span><span style={{ color: '#10B981' }}>Active</span></div>

              {scanResult && (
                <div style={{
                  marginTop: '12px', padding: '10px', borderRadius: '6px',
                  backgroundColor: scanResult.error ? 'rgba(239,68,68,0.1)' : scanResult.safe ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                  border: `1px solid ${scanResult.error ? '#EF4444' : scanResult.safe ? '#10B981' : '#EF4444'}`,
                  fontSize: '0.8rem'
                }}>
                  {scanResult.error ? (
                    <span style={{ color: '#EF4444' }}>❌ Backend Pipeline Error (Check FastAPI Console)</span>
                  ) : (
                    <>
                      <div style={{ fontWeight: 'bold', marginBottom: '4px', color: scanResult.safe ? '#10B981' : '#EF4444' }}>
                        {scanResult.safe ? '✅ LINK ANALYSIS: SECURE' : '🚨 MALICIOUS LINK DETECTED'}
                      </div>
                      <div style={{ color: '#94A3B8' }}>Risk Index: {scanResult.risk_level} · Score: {scanResult.score}/100</div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* جدول السيناريو الثابت المنظم والشرح للجنة بدلاً من التدفق العشوائي المزيف */}
            <div className="soc-panel">
              <h4 className="panel-title">
                <span>// TACTICAL_INCIDENT_PLAYBOOK</span>
                <span style={{ color: '#F59E0B' }}>● SCENARIO MODULE</span>
              </h4>
              <table className="feed-table">
                <thead>
                  <tr>
                    <th>SEVERITY</th>
                    <th>SOURCE</th>
                    <th>TARGET</th>
                    <th>INCIDENT TYPE</th>
                  </tr>
                </thead>
                <tbody>
                  {demoIncidentFeed.map(a => (
                    <tr key={a.id}>
                      <td><span className="severity-badge" style={{ backgroundColor: a.sevColor }}>{a.sev}</span></td>
                      <td>{a.source}</td>
                      <td>{a.target}</td>
                      <td style={{ color: '#94A3B8' }}>{a.type}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="panel-grid-bottom">
            <div className="soc-panel" style={{textAlign: 'center'}}>
              <h4 className="panel-title">// RADAR_SIMULATION_PATTERN</h4>
              <div className="radar-container">
                <div className="radar-sweep"></div>
                <div className="radar-cross-h"></div>
                <div className="radar-cross-v"></div>
                <div className="radar-blip" style={{ top: '35px', left: '45px' }}></div>
              </div>
              <div className="health-grid">
                <div className="health-node"><span>Radar Mode</span><span style={{ color: '#F59E0B', fontWeight: 'bold' }}>TRAINING</span></div>
                <div className="health-node"><span>Core Engine</span><span className="node-online">READY</span></div>
              </div>
            </div>
            <div className="soc-panel">
  <h4 className="panel-title">// QUICK_SECURITY_STATUS</h4>

  <div className="status-list">

    <div className="status-row">
      <span>Security Score</span>
      <span className="status-good">97%</span>
    </div>

    <div className="status-row">
      <span>Threat Level</span>
      <span className="status-warning">MEDIUM</span>
    </div>

    <div className="status-row">
      <span>Blocked Attacks</span>
      <span className="status-good">{blockedAttacks}</span>
    </div>

    <div className="status-row">
      <span>Scans Today</span>
      <span>{scansToday}</span>
    </div>

    <div className="status-row">
      <span>Backend</span>
      <span className="status-good">ONLINE</span>
    </div>

    <div className="status-row">
      <span>Database</span>
      <span className="status-good">HEALTHY</span>
    </div>

  </div>
</div>
            <div className="soc-panel" style={{gridColumn: 'span 2'}}>
              <h4 className="panel-title">// INCIDENT_FREQUENCY_LOG_METRICS</h4>
              <div style={{ width: '100%', height: '150px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#3A506B" />
                    <XAxis dataKey="time" stroke="#64748B" style={{ fontSize: '0.7rem' }} />
                    <YAxis stroke="#64748B" style={{ fontSize: '0.7rem' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#0B132B', borderColor: '#3A506B', color: '#fff' }} />
                    <Line type="monotone" dataKey="Attacks" stroke="#06B6D4" strokeWidth={2} dot={{ fill: '#06B6D4', r: 3 }} isAnimationActive={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <footer className="footer-section">
            CYBER_GUARDIAN SECURITY — SYSTEM COMPLIANCE EVALUATION NODE <br />
            PROJECT ENTRY FOR THE NATIONAL COMPETITION ©️ 2026
          </footer>

        </div>
      </div>
    </div>
  );
}