import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './Dashboard.css';

// بيانات الرسم البياني
const data = [
  { time: '10:00', value: 30 },
  { time: '10:05', value: 60 },
  { time: '10:10', value: 30 },
  { time: '10:15', value: 65 },
  { time: '10:20', value: 35 },
  { time: '10:25', value: 75 },
];

export default function Dashboard() {
  return (
    <div className="soc-container">
      <div className="soc-main-content">
        
        {/* الهيدر مع الأزرار */}
        <header className="soc-header">
          <h2>CYBER_GUARDIAN_CONTROL_PANEL</h2>
          <div className="nav-actions">
            <button className="action-btn">SETTINGS</button>
            <button className="action-btn" onClick={() => window.location.href = '/'}>EXIT</button>
          </div>
        </header>

        {/* الجزء العلوي (الرادار والمقاييس) */}
        <div className="panel-grid-top">
          {/* الرادار */}
          <div className="soc-panel">
            <h4 className="panel-title">// RADAR_SIMULATION_PATTERN</h4>
            <div className="radar-container">
              <div className="radar-sweep"></div>
              <div className="radar-cross-h"></div>
              <div className="radar-cross-v"></div>
              <div className="radar-blip"></div>
            </div>
            <div className="health-grid">
              <div className="node-online">ENGINE_READY</div>
            </div>
          </div>

          {/* المقاييس الحية */}
          <div className="soc-panel">
            <h4 className="panel-title">// LIVE_SYSTEM_METRICS</h4>
            <div className="metrics-content">
              <p>CPU LOAD: <span style={{color: '#06b6d4'}}>42%</span></p>
              <div className="progress-bar"><div style={{width: '42%'}}></div></div>
              <p style={{marginTop: '20px'}}>NETWORK PACKETS: <span style={{color: '#10b981'}}>1,204/s</span></p>
              <div className="progress-bar"><div style={{width: '75%', background: '#10b981'}}></div></div>
            </div>
          </div>
        </div>

        {/* الجزء السفلي (الرسم البياني) */}
        <div className="soc-panel">
          <h4 className="panel-title">// INCIDENT_FREQUENCY_LOG_METRICS</h4>
          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e3a8a" />
                <XAxis dataKey="time" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip contentStyle={{backgroundColor: '#050b14', border: '1px solid #1e3a8a'}} />
                <Line type="monotone" dataKey="value" stroke="#06b6d4" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}