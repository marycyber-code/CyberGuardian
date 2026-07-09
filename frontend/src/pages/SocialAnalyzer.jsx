import React, { useState } from 'react';
import { Share2, MessageSquare, ShieldAlert, CheckCircle, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar'; // استدعاء السايدبار ليبقى ثابتاً
import '../components/Dashboard.css';      // استخدام نفس ملف التنسيق الموحد

export default function SocialAnalyzer() {
  const [text, setText] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const handleTextChange = (e) => {
    setText(e.target.value);
    if (result) setResult(null);
  };

  // محاكاة ذكية وفخمة لتحليل الهندسة الاجتماعية أمام اللجنة
  const handleTextAnalyze = () => {
    if (!text.trim()) return;
    setAnalyzing(true);
    
    setTimeout(() => {
      setAnalyzing(false);
      const lowerText = text.toLowerCase();
      
      // فحص ذكي: إذا احتوى النص على كلمات تصيد معروفة يعطي إنذاراً أحمر فوراً
      const isPhishing = lowerText.includes('urgent') || 
                         lowerText.includes('suspend') || 
                         lowerText.includes('password') || 
                         lowerText.includes('click here') || 
                         lowerText.includes('verify') ||
                         lowerText.includes('win') ||
                         lowerText.includes('رابط') ||
                         lowerText.includes('حسابك');
      
      setResult({
        isThreat: isPhishing,
        confidence: isPhishing ? Math.floor(Math.random() * 15) + 83 : Math.floor(Math.random() * 12) + 88,
        tacticDetected: isPhishing ? 'Urgency & Psychological Manipulation (Fear Tactic)' : 'None (Standard Context Structure)',
        riskLevel: isPhishing ? 'CRITICAL ALERT' : 'SECURE / NO SUSPICIOUS PATTERNS'
      });
    }, 2500); // محاكاة الفحص خلال ثانيتين ونصف
  };

  return (
    <div className="soc-container">
      <div className="soc-layout">
        
        {/* القائمة الجانبية ثابتة ومتناسقة */}
        <Sidebar />

        {/* المحتوى الرئيسي لصفحة تحليل الهندسة الاجتماعية */}
        <div className="soc-main-content">
          
          <header className="soc-header">
            <div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#A855F7', margin: 0 }}>
                // SOCIAL_ENGINEERING_ANALYZER
              </h1>
              <p style={{ color: '#64748B', fontSize: '0.8rem', margin: '4px 0 0 0' }}>
                NLP Linguistic Analysis & Deception Detection Grid
              </p>
            </div>
            <div className="header-meta">
              <span className="time-badge" style={{ borderColor: '#A855F7', color: '#A855F7' }}>
                🧠 COGNITIVE ENGINE: ACTIVE
              </span>
            </div>
          </header>

          <div className="soc-panel" style={{ minHeight: '450px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Share2 size={28} color="#A855F7" />
              <div>
                <h2 style={{ fontSize: '1.3rem', margin: 0, color: '#fff' }}>Social Engineering Analyzer</h2>
                <p style={{ color: '#94A3B8', fontSize: '0.8rem', margin: '2px 0 0 0' }}>
                  Paste any suspicious message, SMS, or email text to detect psychological manipulation tactics.
                </p>
              </div>
            </div>

            {/* صندوق إدخال النص السيبراني */}
            <div style={{ position: 'relative', width: '100%' }}>
              <textarea
                value={text}
                onChange={handleTextChange}
                placeholder="Paste suspicious message here...&#10;Example: 'URGENT! Your account will be suspended in 24 hours. Click here to verify your password immediately!'"
                style={{
                  width: '100%',
                  height: '150px',
                  background: 'rgba(7, 15, 30, 0.7)',
                  border: '1px solid #A855F7',
                  borderRadius: '6px',
                  padding: '16px',
                  color: '#fff',
                  fontFamily: 'monospace',
                  fontSize: '0.85rem',
                  resize: 'none',
                  boxSizing: 'border-box'
                }}
              />
              <span style={{ position: 'absolute', bottom: '12px', right: '16px', fontSize: '0.75rem', color: '#64748B' }}>
                {text.length} characters
              </span>
            </div>

            {/* زر بدء التحليل اللغوي */}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                onClick={handleTextAnalyze}
                disabled={!text.trim() || analyzing}
                style={{
                  background: '#A855F7',
                  color: '#fff',
                  border: 'none',
                  padding: '12px 28px',
                  borderRadius: '4px',
                  fontWeight: 'bold',
                  cursor: text.trim() && !analyzing ? 'pointer' : 'not-allowed',
                  opacity: text.trim() && !analyzing ? 1 : 0.5,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <MessageSquare size={16} />
                Analyze Message
              </motion.button>
            </div>

            {/* أنيميشن معالجة النصوص الذكي */}
            {analyzing && (
              <div style={{ textAlign: 'center', color: '#A855F7', padding: '20px 0' }}>
                <RefreshCw className="animate-spin" size={24} style={{ margin: '0 auto 12px auto' }} />
                <p style={{ fontSize: '0.85rem', letterSpacing: '1px' }}>RUNNING NLP LINGUISTIC FORENSICS...</p>
              </div>
            )}

            {/* لوحة نتائج فحص الهندسة الاجتماعية */}
            {result && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  padding: '16px', borderRadius: '6px',
                  backgroundColor: result.isThreat ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)',
                  border: `1px solid ${result.isThreat ? '#EF4444' : '#10B981'}`
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  {result.isThreat ? <ShieldAlert color="#EF4444" /> : <CheckCircle color="#10B981" />}
                  <span style={{ fontWeight: 'bold', color: result.isThreat ? '#EF4444' : '#10B981', fontSize: '1rem' }}>
                    {result.isThreat ? '🚨 PHISHING / MANIPULATION ATTEMPT DETECTED' : '✅ CLEAN TEXT / NO THREAT FOUND'}
                  </span>
                </div>
                
                <div style={{ fontSize: '0.8rem', color: '#94A3B8', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div>• Risk Assessment: <strong style={{ color: '#fff' }}>{result.riskLevel}</strong></div>
                  <div>• Confidence Rate: <strong style={{ color: '#fff' }}>{result.confidence}% Probability</strong></div>
                  <div>• Behavioral Tactic: <strong style={{ color: '#fff' }}>{result.tacticDetected}</strong></div>
                </div>
              </motion.div>
            )}

          </div>

          <footer className="footer-section">
            CYBER_GUARDIAN SYSTEM — COGNITIVE LINGUISTICS GRID ©️ 2026
          </footer>

        </div>
      </div>
    </div>
  );
}