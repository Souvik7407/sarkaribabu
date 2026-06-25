import React, { useState } from 'react';

export default function Bookmarks({ 
  currentAffairs, 
  staticGK, 
  bookmarks, 
  onToggleBookmark 
}) {
  const [activeSubTab, setActiveSubTab] = useState('news'); // 'news' or 'gk'

  // Filter bookmarked current affairs
  const bookmarkedNews = currentAffairs.filter(item => bookmarks.includes(item.id));

  // Filter bookmarked static GK topics
  const bookmarkedGK = [];
  staticGK.forEach(subject => {
    subject.topics.forEach(topic => {
      if (bookmarks.includes(topic.title)) {
        bookmarkedGK.push({
          ...topic,
          subjectName: subject.subject
        });
      }
    });
  });

  return (
    <div className="bookmarks-container">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title-section">
          <h1>Saved & Bookmarks</h1>
          <p>Your personalized repository of important current affairs and GK modules.</p>
        </div>
      </div>

      {/* Bookmarks Type Sub Tabs */}
      <div className="tab-filters">
        <button
          className={`tab-btn ${activeSubTab === 'news' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('news')}
        >
          📰 Saved News ({bookmarkedNews.length})
        </button>
        <button
          className={`tab-btn ${activeSubTab === 'gk' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('gk')}
        >
          📚 Saved Static GK ({bookmarkedGK.length})
        </button>
      </div>

      {/* Bookmarked items */}
      {activeSubTab === 'news' ? (
        bookmarkedNews.length > 0 ? (
          <div className="news-feed-grid">
            {bookmarkedNews.map(item => (
              <div key={item.id} className="news-card glass-card">
                <div className="news-card-meta">
                  <span className="tag tag-sm">{item.category}</span>
                  <span className="meta-text">{item.date}</span>
                  <span className="meta-divider">&bull;</span>
                  <span className="meta-text">{item.source}</span>
                </div>
                <h3 className="news-card-title">{item.title}</h3>
                <div className="news-card-body">
                  <p className="oneliner-text">{item.oneLiner}</p>
                </div>
                <div className="news-card-footer">
                  <div className="exam-badges">
                    {item.examTarget.map(ex => (
                      <span key={ex} className="badge-exam">{ex}</span>
                    ))}
                  </div>
                  <button 
                    className="bookmark-btn-icon active"
                    onClick={() => onToggleBookmark(item.id)}
                    title="Remove Bookmark"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--accent)" stroke="var(--accent)" strokeWidth="2">
                      <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-bookmarks-card glass-card">
            <span className="empty-icon-large">🔖</span>
            <h3>No Bookmarked News Pointers</h3>
            <p>Go to the Current Affairs Feed and click the bookmark icon on any news card to save it for revision.</p>
          </div>
        )
      ) : (
        bookmarkedGK.length > 0 ? (
          <div className="gk-accordion-list">
            {bookmarkedGK.map(topic => (
              <div key={topic.title} className="gk-accordion-card glass-card active-accordion">
                <div className="accordion-header">
                  <div className="accordion-header-left">
                    <span className="bullet-icon">📚</span>
                    <div>
                      <h3>{topic.title}</h3>
                      <span className="sub-subject-label">{topic.subjectName}</span>
                    </div>
                  </div>
                  <button 
                    className="bookmark-btn-icon active"
                    onClick={() => onToggleBookmark(topic.title)}
                    title="Remove Bookmark"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="var(--accent)" stroke="var(--accent)" strokeWidth="2">
                      <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
                    </svg>
                  </button>
                </div>
                <div className="accordion-body">
                  <p className="topic-desc">{topic.description}</p>
                  <div className="topic-details-section">
                    <ul className="takeaways-list">
                      {topic.keyPoints.map((pt, i) => (
                        <li key={i}>{pt}</li>
                      ))}
                    </ul>
                  </div>
                  {topic.mnemonic && (
                    <div className="mnemonic-box">
                      <div className="mnemonic-header">
                        <span>💡</span>
                        <h5>Smart Memorization Aid</h5>
                      </div>
                      <p>{topic.mnemonic}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-bookmarks-card glass-card">
            <span className="empty-icon-large">📚</span>
            <h3>No Saved Static GK Topics</h3>
            <p>Explore the Static GK section and click the bookmark ribbons to build your custom revision syllabus.</p>
          </div>
        )
      )}
    </div>
  );
}
