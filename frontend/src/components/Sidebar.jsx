import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, LayoutDashboard, Search, Share2, Mic, FileText, Settings, LogOut } from 'lucide-react';

export default function Sidebar() {
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard',       icon: <LayoutDashboard size={18} />, path: '/dashboard' },
    { name: 'URL Scanner',     icon: <Search size={18} />,          path: '#' }, 
    { name: 'Social Analyzer', icon: <Share2 size={18} />,          path: '/social' },
    { name: 'Voice Detector',  icon: <Mic size={18} />,             path: '/voice' },
    { name: 'About App',       icon: <FileText size={18} />,        path: '/about' },
  ];

  return (
    <aside className="soc-sidebar" style={{
      width: '240px',
      backgroundColor: '#0a192f',
      borderRight: '1px solid #1a365d',
      height: '100vh',
      position: 'sticky',
      top: 0,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'between',
      padding: '20px 0',
      boxSizing: 'border-box',
      zIndex: 100
    }}>
      <div>
        {/* شعار التطبيق */}
        <div style={{ padding: '0 20px 20px 20px', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid #1a365d' }}>
          <Shield color="#06b6d4" size={24} />
          <div>
            <span style={{ fontWeight: 'bold', color: '#fff', display: 'block', fontSize: '0.95rem' }}>CYBER GUARDIAN</span>
            <span style={{ color: '#64748b', fontSize: '0.7rem' }}>SOC DASHBOARD v2.4</span>
          </div>
        </div>

        {/* قائمة عناصر التنقل */}
        <nav style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '4px', padding: '0 10px' }}>
          {menuItems.map((item, idx) => {
            const isActive = location.pathname === item.path || (item.name === 'URL Scanner' && location.pathname === '/dashboard');
            
            // دالة التنقل والتمرير مع إضاءة حقل الإدخال تلقائياً
            const handleItemClick = (e) => {
              if (item.name === 'URL Scanner') {
                e.preventDefault();
                
                // إذا كنا خارج لوحة التحكم، ننتقل إليها أولاً
                if (location.pathname !== '/dashboard') {
                  window.location.href = '/dashboard';
                  return;
                }
                
                // البحث عن حقل إدخال الروابط (input) مباشرة في الصفحة
                const urlInput = document.querySelector('input[placeholder*="http"], input[type="text"]');
                if (urlInput) {
                  // التمرير السلس للحقل ليصبح في منتصف الشاشة
                  urlInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  
                  // التركيز داخل الحقل لإظهار مؤشر الكتابة (Cursor)
                  urlInput.focus();
                  
                  // إضافة تأثير وميض نيون أزرق حول الحقل لجذب الانتباه فوراً
                  urlInput.style.boxShadow = '0 0 15px #06b6d4';
                  urlInput.style.borderColor = '#06b6d4';
                  
                  // إزالة تأثير الوميض بعد ثانيتين ليعود لشغله الطبيعي
                  setTimeout(() => {
                    urlInput.style.boxShadow = 'none';
                    urlInput.style.borderColor = '';
                  }, 2000);
                }
              }
            };

            return (
              <Link
                key={idx}
                to={item.path}
                onClick={handleItemClick}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  color: isActive ? '#06b6d4' : '#94a3b8',
                  backgroundColor: isActive ? 'rgba(6, 182, 212, 0.1)' : 'transparent',
                  textDecoration: 'none',
                  borderRadius: '6px',
                  fontSize: '0.85rem',
                  fontWeight: isActive ? 'bold' : 'normal',
                  transition: 'all 0.2s',
                  borderLeft: isActive ? '3px solid #06b6d4' : '3px solid transparent'
                }}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div style={{ padding: '0 10px', display: 'flex', flexDirection: 'column', gap: '4px', marginTop: 'auto' }}>
        <Link to="/settings" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', color: '#64748b', textDecoration: 'none', fontSize: '0.85rem' }}>
          <Settings size={18} />
          <span>Settings</span>
        </Link>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', color: '#ef4444', textDecoration: 'none', fontSize: '0.85rem' }}>
          <LogOut size={18} />
          <span>Exit Dashboard</span>
        </Link>
      </div>
    </aside>
  );
}