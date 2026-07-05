import React from 'react';
import AdSenseBlock from './AdSenseBlock';

export default function Sidebar({ activeTab, setActiveTab, stats, isLightTheme, toggleTheme, isOpen, onClose }) {
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="9" rx="1" />
          <rect x="14" y="3" width="7" height="5" rx="1" />
          <rect x="14" y="12" width="7" height="9" rx="1" />
          <rect x="3" y="16" width="7" height="5" rx="1" />
        </svg>
      )
    },
    {
      id: 'current-affairs',
      label: 'Current Affairs',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
          <path d="M18 14h-8M15 18h-5M10 6h8v4h-8z" />
        </svg>
      )
    },
    {
      id: 'one-liners',
      label: 'One-Liners',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275Z" />
        </svg>
      )
    },
    {
      id: 'static-gk',
      label: 'Static GK',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
          <path d="M6 8h2M6 12h2M16 8h2M16 12h2" />
        </svg>
      )
    },
    {
      id: 'exam-tools',
      label: 'Aspirant Tools',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
        </svg>
      )
    },
    {
      id: 'quiz-zone',
      label: 'Quiz Zone',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      )
    },
    {
      id: 'bookmarks',
      label: 'Saved & Bookmarks',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
        </svg>
      )
    },
    {
      id: 'criteria',
      label: 'Exam Criteria',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
        </svg>
      )
    },
    {
      id: 'ai-tutor',
      label: 'AI Doubt Solver',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      )
    },
    {
      id: 'buy-material',
      label: 'Buy Study Material',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="8" cy="21" r="1" />
          <circle cx="19" cy="21" r="1" />
          <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
        </svg>
      )
    }
  ];

  return (
    <>
      {/* Sidebar Backdrop Overlay on Mobile */}
      {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}

      <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        {/* Close Button on Mobile */}
        <button className="sidebar-close-btn" onClick={onClose} aria-label="Close Sidebar">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div className="sidebar-brand">
          <div className="brand-icon">
            <img src="/logo.png" alt="SARKARI BABU Logo" className="brand-logo-img" />
          </div>
          <div className="brand-text">
            <h2><span className="brand-orange">SARKARI</span> <span className="brand-green">BABU</span></h2>
            <span>Exam Prep Portal</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`sidebar-link sidebar-${item.id} ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => { setActiveTab(item.id); onClose(); }}
            >
              <span className="sidebar-link-icon">{item.icon}</span>
              <div className="sidebar-link-text-group">
                <span className="sidebar-link-text">{item.label}</span>
                {item.id === 'quiz-zone' && (
                  <span className="sidebar-coming-soon-text">Coming Soon</span>
                )}
              </div>
              {item.id === 'ai-tutor' && (
                <span className="ai-badge-live">LIVE</span>
              )}
            </button>
          ))}
        </nav>

      <div className="sidebar-divider"></div>

      <div className="sidebar-stats-card glass-card">
        <h4 className="stats-card-title">YOUR PROGRESS</h4>
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-value">🔥 {stats.streak}</span>
            <span className="stat-label">Day Streak</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">📚 {stats.readArticlesCount}</span>
            <span className="stat-label">Read News</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">🎯 {stats.quizScore}%</span>
            <span className="stat-label">Quiz Acc.</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">🔖 {stats.bookmarksCount}</span>
            <span className="stat-label">Saved</span>
          </div>
        </div>
      </div>

      <div style={{ padding: '0 0.2rem' }}>
        <AdSenseBlock slotId="1000001" />
      </div>

      <div className="sidebar-footer">
        <button className="theme-toggle-btn" onClick={toggleTheme} aria-label="Toggle Theme">
          {isLightTheme ? (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
              </svg>
              <span>Dark Mode</span>
            </>
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
              </svg>
              <span>Light Mode</span>
            </>
          )}
        </button>
      </div>
    </aside>
  </>
  );
}
