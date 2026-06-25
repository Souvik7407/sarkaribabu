import React, { useState } from 'react';

export default function OneLiners({ currentAffairs, bookmarks, onToggleBookmark }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeMode, setActiveMode] = useState('deck'); // 'deck' or 'list'
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const categories = [
    { id: 'all', label: 'All Categories' },
    { id: 'politics', label: 'Politics' },
    { id: 'sports', label: 'Sports' },
    { id: 'science', label: 'Science' },
    { id: 'technology', label: 'Technology' }
  ];

  // Filter items
  const filteredItems = currentAffairs.filter(item => {
    return activeCategory === 'all' || item.category === activeCategory;
  });

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentCardIndex((prev) => (prev + 1) % filteredItems.length);
    }, 150);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentCardIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
    }, 150);
  };

  const handleCategoryChange = (catId) => {
    setActiveCategory(catId);
    setCurrentCardIndex(0);
    setIsFlipped(false);
  };

  const currentItem = filteredItems[currentCardIndex];

  return (
    <div className="oneliners-container">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title-section">
          <h1>Factual One-Liners</h1>
          <p>Super-condensed facts tailored for SSC CGL, CHSL, Banking, and State PSCs.</p>
        </div>

        <div className="mode-toggle-group glass-card">
          <button 
            className={`mode-btn ${activeMode === 'deck' ? 'active' : ''}`}
            onClick={() => setActiveMode('deck')}
          >
            🗂️ Flip Card Deck
          </button>
          <button 
            className={`mode-btn ${activeMode === 'list' ? 'active' : ''}`}
            onClick={() => setActiveMode('list')}
          >
            📋 Continuous List
          </button>
        </div>
      </div>

      {/* Category filters */}
      <div className="tab-filters">
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`tab-btn ${activeCategory === cat.id ? 'active' : ''}`}
            onClick={() => handleCategoryChange(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {filteredItems.length > 0 ? (
        activeMode === 'deck' ? (
          /* Card Deck Mode */
          <div className="deck-wrapper">
            <div className="deck-progress">
              <span>Card {currentCardIndex + 1} of {filteredItems.length}</span>
              <div className="progress-bar-outer">
                <div 
                  className="progress-bar-inner" 
                  style={{ width: `${((currentCardIndex + 1) / filteredItems.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Flashcard container with 3D perspective */}
            <div className="flashcard-scene" onClick={() => setIsFlipped(!isFlipped)}>
              <div className={`flashcard ${isFlipped ? 'is-flipped' : ''}`}>
                
                {/* Front of Card */}
                <div className="flashcard-face flashcard-front glass-card">
                  <div className="card-top">
                    <span className={`tag cat-${currentItem.category}`}>{currentItem.category}</span>
                    <span className="source-label">{currentItem.source}</span>
                  </div>
                  <div className="card-center">
                    <h2>{currentItem.title}</h2>
                    <span className="flip-prompt">Click Card to Reveal One-Liner Answer</span>
                  </div>
                  <div className="card-bottom">
                    <div className="badges-row">
                      {currentItem.examTarget.map(badge => (
                        <span key={badge} className="badge-exam">{badge}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Back of Card */}
                <div className="flashcard-face flashcard-back glass-card">
                  <div className="card-top">
                    <span className="back-accent">⚡ Key One-Liner Takeaway</span>
                    <button 
                      className={`bookmark-btn-icon ${bookmarks.includes(currentItem.id) ? 'active' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation(); // Avoid flipping the card again
                        onToggleBookmark(currentItem.id);
                      }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill={bookmarks.includes(currentItem.id) ? "var(--accent)" : "none"} stroke={bookmarks.includes(currentItem.id) ? "var(--accent)" : "currentColor"} strokeWidth="2">
                        <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
                      </svg>
                    </button>
                  </div>
                  <div className="card-center">
                    <p className="one-liner-fact">{currentItem.oneLiner}</p>
                    <span className="flip-prompt">Click to View Title Question</span>
                  </div>
                  <div className="card-bottom-back">
                    <div className="back-tags">
                      {currentItem.tags.map(t => <span key={t} className="tag tag-sm">#{t}</span>)}
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Navigation buttons */}
            <div className="deck-controls">
              <button className="btn btn-secondary nav-btn" onClick={handlePrev}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m15 18-6-6 6-6"/>
                </svg>
                Previous
              </button>
              <button className="btn btn-primary nav-btn" onClick={handleNext}>
                Next
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m9 18 6-6-6-6"/>
                </svg>
              </button>
            </div>
          </div>
        ) : (
          /* List Mode */
          <div className="oneliners-list-view">
            {filteredItems.map((item, index) => (
              <div key={item.id} className="oneliner-list-item glass-card">
                <div className="item-left">
                  <span className="item-index">{index + 1}</span>
                </div>
                <div className="item-content">
                  <div className="item-meta">
                    <span className={`tag tag-sm cat-${item.category}`}>{item.category}</span>
                    <span className="item-date">{item.date}</span>
                    <span className="item-source">({item.source})</span>
                  </div>
                  <h3 className="item-title">{item.title}</h3>
                  <p className="item-fact">⚡ {item.oneLiner}</p>
                </div>
                <div className="item-right">
                  <button 
                    className={`bookmark-btn-icon ${bookmarks.includes(item.id) ? 'active' : ''}`}
                    onClick={() => onToggleBookmark(item.id)}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill={bookmarks.includes(item.id) ? "var(--accent)" : "none"} stroke={bookmarks.includes(item.id) ? "var(--accent)" : "currentColor"} strokeWidth="2">
                      <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        <div className="empty-state glass-card">
          <p className="empty-title">No one-liners found for this category</p>
          <p className="empty-subtitle">Select a different category tab to read facts.</p>
        </div>
      )}
    </div>
  );
}
