import React, { useState } from 'react';
import AdSenseBlock from './AdSenseBlock';

export default function StaticGK({ staticGK, bookmarks, onToggleBookmark }) {
  const [activeSubject, setActiveSubject] = useState(staticGK[0]?.id || '');
  const [expandedTopic, setExpandedTopic] = useState(null);
  const [gkSearchQuery, setGkSearchQuery] = useState('');

  const handleToggleAccordion = (topicTitle) => {
    if (expandedTopic === topicTitle) {
      setExpandedTopic(null);
    } else {
      setExpandedTopic(topicTitle);
    }
  };

  // Find active subject data
  const currentSubjectData = staticGK.find(s => s.id === activeSubject);

  // Filter topics based on search query
  const filteredTopics = currentSubjectData 
    ? currentSubjectData.topics.filter(topic => {
        const query = gkSearchQuery.toLowerCase();
        return (
          topic.title.toLowerCase().includes(query) ||
          topic.description.toLowerCase().includes(query) ||
          topic.keyPoints.some(pt => pt.toLowerCase().includes(query)) ||
          (topic.mnemonic && topic.mnemonic.toLowerCase().includes(query))
        );
      })
    : [];

  return (
    <div className="static-gk-container">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title-section">
          <h1>Static General Knowledge</h1>
          <p>Core syllabus modules structured logically to support your revision.</p>
        </div>

        {/* Search */}
        <div className="search-input-wrapper">
          <input 
            type="text" 
            className="search-input" 
            placeholder="Search Static GK topics..." 
            value={gkSearchQuery}
            onChange={(e) => setGkSearchQuery(e.target.value)}
          />
          <span className="search-icon-svg">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </span>
        </div>
      </div>

      {/* Subject Selector Tabs */}
      <div className="tab-filters">
        {staticGK.map((sub) => (
          <button
            key={sub.id}
            className={`tab-btn ${activeSubject === sub.id ? 'active' : ''}`}
            onClick={() => {
              setActiveSubject(sub.id);
              setExpandedTopic(null); // Reset open accordions
              setGkSearchQuery(''); // Reset search
            }}
          >
            {sub.subject}
          </button>
        ))}
      </div>

      {/* Accordion Topics List */}
      {filteredTopics.length > 0 ? (
        <div className="gk-accordion-list">
          {filteredTopics.map((topic) => {
            const isOpen = expandedTopic === topic.title;
            const isBookmarked = bookmarks.includes(topic.title); // Use title as ID for static GK bookmarks

            return (
              <div 
                key={topic.title} 
                className={`gk-accordion-card glass-card ${isOpen ? 'active-accordion' : ''}`}
              >
                {/* Header */}
                <div 
                  className="accordion-header" 
                  onClick={() => handleToggleAccordion(topic.title)}
                >
                  <div className="accordion-header-left">
                    <span className="bullet-icon">📖</span>
                    <h3>{topic.title}</h3>
                  </div>
                  <div className="accordion-header-right">
                    <button 
                      className={`bookmark-btn-icon ${isBookmarked ? 'active' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation(); // Stop click from bubbling to accordion toggle
                        onToggleBookmark(topic.title);
                      }}
                      title="Save Topic"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill={isBookmarked ? "var(--accent)" : "none"} stroke={isBookmarked ? "var(--accent)" : "currentColor"} strokeWidth="2">
                        <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
                      </svg>
                    </button>
                    <span className={`chevron-icon ${isOpen ? 'rotated' : ''}`}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m6 9 6 6 6-6"/>
                      </svg>
                    </span>
                  </div>
                </div>

                {/* Body */}
                {isOpen && (
                  <div className="accordion-body">
                    <p className="topic-desc">{topic.description}</p>

                    {topic.image && (
                      <div className="topic-map-container">
                        <img src={topic.image} alt={`${topic.title} Map`} className="topic-map-img" />
                      </div>
                    )}
                    
                    <div className="topic-details-section">
                      <h4>Key Facts & Syllabus Takeaways:</h4>
                      <ul className="takeaways-list">
                        {topic.keyPoints.map((point, index) => {
                          const colonIndex = point.indexOf(':');
                          if (colonIndex !== -1) {
                            const titlePart = point.substring(0, colonIndex + 1);
                            const textPart = point.substring(colonIndex + 1);
                            return (
                              <li key={index}>
                                <strong>{titlePart}</strong>{textPart}
                              </li>
                            );
                          }
                          return <li key={index}>{point}</li>;
                        })}
                      </ul>
                    </div>

                    {topic.mnemonic && (
                      <div className="mnemonic-box">
                        <div className="mnemonic-header">
                          <span className="lightbulb-icon">💡</span>
                          <h5>Smart Memorization Aid</h5>
                        </div>
                        <p>{topic.mnemonic}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="empty-state glass-card">
          <p className="empty-title">No Static GK topics matched your query</p>
          <p className="empty-subtitle">Try searching for other terms like "Writs", "Mughal", "Rivers", or "Vitamins".</p>
        </div>
      )}

      {/* Google AdSense Bottom Banner */}
      <AdSenseBlock slotId="4000001" />
    </div>
  );
}
