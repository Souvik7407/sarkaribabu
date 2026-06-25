import React, { useState } from 'react';

export default function CurrentAffairs({ 
  currentAffairs, 
  bookmarks, 
  onToggleBookmark, 
  readArticles, 
  onToggleRead, 
  selectedExam 
}) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('takeaways'); // 'takeaways' or 'oneliner'
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [expandedDailyCards, setExpandedDailyCards] = useState({});

  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const todayStr = `${yyyy}-${mm}-${dd}`;

  const dailyArticles = currentAffairs.filter(item => 
    item.id.startsWith('ca-daily-') && item.date === todayStr
  );

  const toggleExpandDailyCard = (id) => {
    setExpandedDailyCards(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const formattedTodayDate = today.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const categories = [
    { id: 'all', label: 'All News' },
    { id: 'politics', label: 'Politics & Polity' },
    { id: 'sports', label: 'Sports' },
    { id: 'science', label: 'Science' },
    { id: 'technology', label: 'Technology' }
  ];

  // Filters & Search
  const filteredAffairs = currentAffairs.filter(item => {
    // Exclude today's daily digest items from main grid
    if (item.id.startsWith('ca-daily-') && item.date === todayStr) {
      return false;
    }

    // 1. Category Filter
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    
    // 2. Exam Relevance Filter
    const matchesExam = selectedExam === 'All' || item.examTarget.includes(selectedExam);
    
    // 3. Search Query Filter
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      item.title.toLowerCase().includes(searchLower) ||
      item.oneLiner.toLowerCase().includes(searchLower) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
      item.source.toLowerCase().includes(searchLower);

    // 4. Date Range Filter
    let matchesDate = true;
    if (startDate) {
      matchesDate = matchesDate && item.date >= startDate;
    }
    if (endDate) {
      matchesDate = matchesDate && item.date <= endDate;
    }

    return matchesCategory && matchesExam && matchesSearch && matchesDate;
  });

  const getCategoryColorClass = (cat) => {
    switch (cat) {
      case 'sports': return 'cat-sports';
      case 'politics': return 'cat-politics';
      case 'science': return 'cat-science';
      case 'technology': return 'cat-tech';
      default: return 'cat-default';
    }
  };

  return (
    <div className="current-affairs-container">
      {/* Sub Header & Controls */}
      <div className="page-header">
        <div className="page-title-section">
          <h1>Current Affairs Feed</h1>
          <p>Curated summaries stripped of fluff, optimized for direct recall.</p>
        </div>

        <div className="controls-row">
          {/* Search bar */}
          <div className="search-input-wrapper">
            <input 
              type="text" 
              className="search-input" 
              placeholder="Search by keywords, tags, or sources..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span className="search-icon-svg">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </span>
          </div>

          {/* Date Range Picker */}
          <div className="date-filter-group glass-card">
            <div className="date-input-field">
              <span className="date-label">From:</span>
              <input 
                type="date" 
                className="date-picker-input" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="date-input-field">
              <span className="date-label">To:</span>
              <input 
                type="date" 
                className="date-picker-input" 
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            {(startDate || endDate) && (
              <button 
                className="clear-date-btn"
                onClick={() => { setStartDate(''); setEndDate(''); }}
                title="Clear Dates"
              >
                Reset
              </button>
            )}
          </div>

          {/* Mode Switcher */}
          <div className="mode-toggle-group glass-card">
            <button 
              className={`mode-btn ${viewMode === 'takeaways' ? 'active' : ''}`}
              onClick={() => setViewMode('takeaways')}
              title="Detailed Pointers"
            >
              📋 Key Takeaways
            </button>
            <button 
              className={`mode-btn ${viewMode === 'oneliner' ? 'active' : ''}`}
              onClick={() => setViewMode('oneliner')}
              title="Fast Facts"
            >
              ⚡ One-Liners
            </button>
          </div>
        </div>
      </div>

      {/* Today's Daily Live Digest Panel */}
      {dailyArticles.length > 0 && (
        <div className="daily-digest-panel glass-card">
          <div className="digest-header">
            <div className="digest-header-left">
              <span className="live-dot-pulse"></span>
              <h2>Today's Fresh Daily Digest</h2>
              <span className="digest-date-badge">{formattedTodayDate}</span>
            </div>
            <span className="digest-tagline">3 high-yield updates selected for your preparation</span>
          </div>

          <div className="digest-cards-row">
            {dailyArticles.map((article) => {
              const isBookmarked = bookmarks.includes(article.id);
              const isRead = readArticles.includes(article.id);
              const isExpanded = !!expandedDailyCards[article.id];

              return (
                <div key={article.id} className={`digest-mini-card glass-card ${isRead ? 'read-card' : ''}`}>
                  <div className="digest-card-meta">
                    <span className={`tag ${getCategoryColorClass(article.category)}`}>
                      {article.category}
                    </span>
                    <span className="meta-text">{article.readTime}</span>
                    <span className="meta-divider">&bull;</span>
                    <span className="meta-text source-tag">Source: {article.source}</span>
                  </div>

                  <h3 className="digest-card-title">{article.title}</h3>
                  <p className="digest-card-oneliner">{article.oneLiner}</p>

                  {/* Key Takeaways Collapsible */}
                  {isExpanded && (
                    <div className="digest-card-takeaways">
                      <ul className="takeaways-list">
                        {article.summary.map((point, index) => (
                          <li key={index}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <button 
                    className="digest-expand-btn"
                    onClick={() => toggleExpandDailyCard(article.id)}
                  >
                    {isExpanded ? '▲ Hide Takeaways' : '▼ Read Key Takeaways'}
                  </button>

                  <div className="digest-card-footer">
                    <label className="checkbox-container">
                      <input 
                        type="checkbox" 
                        checked={isRead}
                        onChange={() => onToggleRead(article.id)}
                      />
                      <span className="checkmark"></span>
                      <span className="checkbox-label">{isRead ? 'Completed' : 'Mark as Read'}</span>
                    </label>

                    <button 
                      className={`bookmark-btn-icon ${isBookmarked ? 'active' : ''}`}
                      onClick={() => onToggleBookmark(article.id)}
                      aria-label="Bookmark article"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill={isBookmarked ? "var(--accent)" : "none"} stroke={isBookmarked ? "var(--accent)" : "currentColor"} strokeWidth="2">
                        <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Category Tabs */}
      <div className="tab-filters">
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`tab-btn ${activeCategory === cat.id ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Exam Calibration Alert (if set) */}
      {selectedExam !== 'All' && (
        <div className="calibration-alert glass-card">
          <span>🎯 Filter active: Showing current affairs matching <strong>{selectedExam}</strong> requirements.</span>
        </div>
      )}

      {/* Google AdSense Horizontal Banner */}
      <div className="google-adsense-banner glass-card">
        <div className="ad-info-bar">
          <span className="ad-indicator">ADVERTISEMENT</span>
          <span className="ads-by-google">Ads by Google</span>
        </div>
        <div className="ad-banner-content">
          <div className="ad-text-block">
            <h4>Targeting {selectedExam === 'All' ? 'Competitive Exams' : selectedExam} 2026?</h4>
            <p>Get SARKARI BABU Premium Test Series. Access 10,000+ calibrated questions with high-yield explanation maps.</p>
          </div>
          <a href="https://google.com/adsense" target="_blank" rel="noopener noreferrer" className="ad-banner-btn">
            Get 50% Off Now
          </a>
        </div>
      </div>

      {/* News Feed Grid */}
      {filteredAffairs.length > 0 ? (
        <div className="news-feed-grid">
          {filteredAffairs.map((news) => {
            const isBookmarked = bookmarks.includes(news.id);
            const isRead = readArticles.includes(news.id);
            
            return (
              <article key={news.id} className={`news-card glass-card ${isRead ? 'read-card' : ''}`}>
                <div className="news-card-meta">
                  <span className={`tag ${getCategoryColorClass(news.category)}`}>
                    {news.category}
                  </span>
                  <span className="meta-text">{news.date}</span>
                  <span className="meta-divider">&bull;</span>
                  <span className="meta-text">{news.readTime}</span>
                  <span className="meta-divider">&bull;</span>
                  <span className="meta-text source-tag">Source: {news.source}</span>
                </div>

                <h3 className="news-card-title">{news.title}</h3>

                {/* Body Content */}
                <div className="news-card-body">
                  {viewMode === 'takeaways' ? (
                    <ul className="takeaways-list">
                      {news.summary.map((point, index) => (
                        <li key={index}>{point}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="oneliner-text">{news.oneLiner}</p>
                  )}
                </div>

                {/* Tags and Targets */}
                <div className="news-card-tags">
                  <div className="exam-badges">
                    {news.examTarget.map((exam) => (
                      <span key={exam} className="badge-exam">{exam}</span>
                    ))}
                  </div>
                  <div className="keyword-tags">
                    {news.tags.map((tag) => (
                      <span key={tag} className="tag tag-sm">#{tag}</span>
                    ))}
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="news-card-footer">
                  <label className="checkbox-container">
                    <input 
                      type="checkbox" 
                      checked={isRead}
                      onChange={() => onToggleRead(news.id)}
                    />
                    <span className="checkmark"></span>
                    <span className="checkbox-label">{isRead ? 'Completed' : 'Mark as Read'}</span>
                  </label>

                  <button 
                    className={`bookmark-btn-icon ${isBookmarked ? 'active' : ''}`}
                    onClick={() => onToggleBookmark(news.id)}
                    aria-label="Bookmark article"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill={isBookmarked ? "var(--accent)" : "none"} stroke={isBookmarked ? "var(--accent)" : "currentColor"} strokeWidth="2">
                      <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
                    </svg>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="empty-state glass-card">
          <p className="empty-title">No current affairs match your active filters</p>
          <p className="empty-subtitle">Try adjusting your search query, choosing a different category, or resetting your target exam.</p>
        </div>
      )}
    </div>
  );
}
