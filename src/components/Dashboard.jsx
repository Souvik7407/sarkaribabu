import React, { useState } from 'react';
import { initialJobOpenings, getDayTheme } from '../data/db';
import { factsData } from '../data/facts';

export default function Dashboard({ 
  selectedExam, 
  setSelectedExam, 
  stats, 
  onTriggerScraper, 
  isScraping, 
  setActiveTab 
}) {
  const [showFactInfo, setShowFactInfo] = useState(false);
  const [isAlertVisible, setIsAlertVisible] = useState(true);

  const today = new Date();
  const dayThemes = getDayTheme(today);
  const formattedDate = today.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long'
  });

  const filteredJobs = initialJobOpenings.filter(job => 
    selectedExam === 'All' || job.examTarget === selectedExam
  );

  const getJobStatus = (startDateStr, closingDateStr) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const start = new Date(startDateStr);
    start.setHours(0, 0, 0, 0);
    
    const close = new Date(closingDateStr);
    close.setHours(0, 0, 0, 0);
    
    if (today < start) {
      return { text: "Opening Soon", class: "status-upcoming" };
    } else if (today > close) {
      return { text: "Closed", class: "status-closed" };
    } else {
      const diffTime = close.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays <= 7) {
        return { text: `Closing Soon (${diffDays}d left)`, class: "status-closing" };
      }
      return { text: "Apply Live", class: "status-live" };
    }
  };

  const alertText = "🤖 Clear your exam prep doubts instantly with the new AI Doubt Solver! Get model answers, explanations, and syllabus revision in real-time.";

  const getExamTip = () => {
    switch (selectedExam) {
      case 'UPSC':
        return 'UPSC (CSE, NDA, CDS, CAPF) - High analytical focus on core policy impacts, structural concepts, and international relations.';
      case 'SSC':
        return 'SSC (CGL, CHSL, MTS, CPO, JE) - Prioritizes factual accuracy, historical timelines, names, dates, and rapid recall.';
      case 'Banking':
        return 'Banking & Insurance (SBI, IBPS, RBI, LIC) - Emphasizes banking regulations, monetary policy indexes, and financial directions.';
      case 'Railways':
        return 'Railways (RRB NTPC, Group D, ALP) - Concentrates on general science facts, railway zones, and geographical landmarks.';
      case 'Defence':
        return 'Defence & Police (AFCAT, Agniveer, State Police) - Targets military technology, bilateral exercises, and national security directives.';
      case 'State PSC':
        return 'State PSCs (WBCS, BPSC, UPPSC) - Balanced focus on regional geography, state history, and national movement details.';
      default:
        return 'All study resources are loaded. Tailor your focus by choosing your specific target exam below.';
    }
  };

  // Get unique daily fact from the 1000 facts database
  const getDailyFact = () => {
    if (!factsData || factsData.length === 0) return null;
    const now = new Date();
    const oneDay = 1000 * 60 * 60 * 24;
    const epochMs = now.getTime() - now.getTimezoneOffset() * 60000;
    const dayIndex = Math.floor(epochMs / oneDay);
    const index = dayIndex % factsData.length;
    return factsData[index];
  };

  const dailyFact = getDailyFact() || {
    title: "Mnemonic of the Day (Polity)",
    content: "Remember the 12 Schedules of the Indian Constitution with the phrase 'TEARS OF OLD PM'.",
    breakdown: "T - Territories, E - Emoluments, A - Affirmations, R - Rajya Sabha, S - Scheduled Areas, O - Other Scheduled Areas, F - Federal Structure, O - Official Languages, L - Land Reforms, D - Defection, P - Panchayats, M - Municipalities."
  };

  // Reset breakdown expansion when the daily fact changes
  React.useEffect(() => {
    setShowFactInfo(false);
  }, [dailyFact?.title]);

  return (
    <div className="dashboard-container">
      {isAlertVisible && (
        <div className="dashboard-sticky-alert glass-card">
          <div className="alert-content">
            <span className="alert-icon">📢</span>
            <span className="alert-message">{alertText}</span>
          </div>
          <div className="alert-actions">
            <button onClick={() => setActiveTab('ai-tutor')} className="alert-apply-btn">
              Try AI Solver
            </button>
            <button className="alert-close-btn" onClick={() => setIsAlertVisible(false)} aria-label="Dismiss Alert">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
      )}
      {/* Welcome Banner */}
      <div className="welcome-banner glass-card">
        <div className="welcome-text">
          <h1>Welcome Back, Aspirant</h1>
          <p>Your daily dose of competitive exam prep is ready. Stay consistent, stay ahead.</p>
        </div>
        <div className="welcome-badge">
          <span>Targeting: {selectedExam === 'All' ? 'All Exams' : selectedExam}</span>
        </div>
      </div>

      {/* Specialty of the Day Animated Banner */}
      <div className="specialty-day-card glass-card">
        {dayThemes.map((dayTheme, idx) => (
          <div key={idx} className="specialty-card-item">
            {idx > 0 && <hr className="specialty-divider" />}
            <div className="specialty-card-body">
              <div className="specialty-icon-container">
                <span className="specialty-day-icon" role="img" aria-label="day icon">
                  {dayTheme.icon}
                </span>
              </div>
              <div className="specialty-details">
                <div className="specialty-header-row">
                  <span className="specialty-sparkle">✨ Specialty of the Day</span>
                  <span className="specialty-date">{formattedDate}</span>
                </div>
                <h2>{dayTheme.title}</h2>
                <p className="specialty-desc">{dayTheme.description}</p>
                {dayTheme.examConnection && (
                  <div className="specialty-exam-connection">
                    <span className="exam-connection-label">💡 High-Yield Exam Fact:</span>
                    <p>{dayTheme.examConnection}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="dashboard-grid">
        {/* Exam Focus Selector */}
        <div className="dashboard-card glass-card">
          <div className="card-header-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2">
              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
              <path d="m12 6-2 6h4l-2 6" />
            </svg>
            <h3>Exam Focus Settings</h3>
          </div>
          <p className="card-desc">Select your target exam. AffairsPulse will calibrate feed relevance and revision highlights accordingly.</p>
          <div className="exam-btn-grid">
            {['All', 'UPSC', 'SSC', 'Banking', 'Railways', 'Defence', 'State PSC'].map((exam) => (
              <button
                key={exam}
                className={`exam-select-btn ${selectedExam === exam ? 'active' : ''}`}
                onClick={() => setSelectedExam(exam)}
              >
                {exam === 'All' ? 'All Exams' : exam}
              </button>
            ))}
          </div>
          <div className="exam-tip-box">
            <span className="tip-indicator">🎯 Calibrated Strategy:</span>
            <p>{getExamTip()}</p>
          </div>
        </div>

        {/* Real-time Ingestion Simulator */}
        <div className="dashboard-card glass-card">
          <div className="card-header-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2">
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
            </svg>
            <h3>Portal Sync Scraper</h3>
          </div>
          <p className="card-desc">Simulate automated news gathering. AffairsPulse scans governmental portals, PIB, MEA, and major news networks to extract clean study pointers.</p>
          
          <div className="connection-status-row">
            <div className="status-item">
              <span className="status-dot green"></span>
              <span>PIB Feed</span>
            </div>
            <div className="status-item">
              <span className="status-dot green"></span>
              <span>News RSS</span>
            </div>
            <div className="status-item">
              <span className="status-dot green"></span>
              <span>Gov Portals</span>
            </div>
          </div>

          <button 
            className={`btn btn-primary sync-btn ${isScraping ? 'scraping' : ''}`}
            onClick={onTriggerScraper}
            disabled={isScraping}
          >
            {isScraping ? (
              <>
                <span className="spinner"></span>
                <span>Connecting Portals...</span>
              </>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
                </svg>
                <span>Scrape & Ingest News Feed</span>
              </>
            )}
          </button>
        </div>

        {/* Fact of the Day */}
        <div className="dashboard-card glass-card fact-card">
          <div className="card-header-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2">
              <path d="M9.663 17h4.673M12 3v1m6.364 1.636-.707.707M21 12h-1M4 12H3m3.343-5.657-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.7c-.29.37-.547.78-.77 1.22L12 21l-1.19-2.58c-.223-.44-.48-1-.77-1.22l-.548-.7c-.01-.01 0 0 0 0Z" />
            </svg>
            <h3>Fact of the Day</h3>
          </div>
          <div className="fact-content">
            <h4>{dailyFact.title}</h4>
            <p className="fact-main">{dailyFact.content}</p>
            {showFactInfo ? (
              <p className="fact-detail">{dailyFact.breakdown}</p>
            ) : (
              <button className="btn-link" onClick={() => setShowFactInfo(true)}>Show Mnemonic Breakdown &rarr;</button>
            )}
          </div>
        </div>

        {/* Study Planner Shortcuts */}
        <div className="dashboard-card glass-card shortcut-card">
          <div className="card-header-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--info)" strokeWidth="2">
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
              <path d="M6 6h10M6 10h10" />
            </svg>
            <h3>Quick Study Hub</h3>
          </div>
          <div className="shortcut-buttons-grid">
            <button className="shortcut-btn" onClick={() => setActiveTab('current-affairs')}>
              <span className="shortcut-icon font-large">📰</span>
              <div className="shortcut-text">
                <strong>Current Affairs Feed</strong>
                <span>Read concise daily inputs</span>
              </div>
            </button>
            <button className="shortcut-btn" onClick={() => setActiveTab('one-liners')}>
              <span className="shortcut-icon font-large">⚡</span>
              <div className="shortcut-text">
                <strong>One-Liner Deck</strong>
                <span>Fast review cards for factuals</span>
              </div>
            </button>
            <button className="shortcut-btn" onClick={() => setActiveTab('static-gk')}>
              <span className="shortcut-icon font-large">📚</span>
              <div className="shortcut-text">
                <strong>Static GK Modules</strong>
                <span>History, Polity, Geography core</span>
              </div>
            </button>
            <button className="shortcut-btn" onClick={() => setActiveTab('quiz-zone')}>
              <span className="shortcut-icon font-large">🎯</span>
              <div className="shortcut-text">
                <strong>Quiz Zone</strong>
                <span>Test comprehension & accuracy</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Live Government Job Alerts Section */}
      <div className="dashboard-card job-alerts-card glass-card">
        <div className="card-header-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <div className="job-alerts-title-block">
            <h3>Live Government Job Alerts</h3>
            <span className="live-dot-pulse"></span>
          </div>
        </div>
        <p className="card-desc">Stay informed with real-time job notifications, vacancies, and application deadlines. Calibrated to your target exam preferences.</p>

        {filteredJobs.length > 0 ? (
          <div className="job-table-wrapper">
            <table className="job-table">
              <thead>
                <tr>
                  <th>Exam / Post</th>
                  <th>Department / Board</th>
                  <th>Vacancies</th>
                  <th>Timeline</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredJobs.map((job) => {
                  const status = getJobStatus(job.startDate, job.closingDate);
                  return (
                    <tr key={job.id} className="job-row">
                      <td className="job-title-cell">
                        <strong>{job.title}</strong>
                        <span className="exam-target-tag">{job.examTarget}</span>
                      </td>
                      <td className="job-org-cell">{job.organization}</td>
                      <td className="job-vacancies-cell">{job.vacancies}</td>
                      <td className="job-timeline-cell">
                        <div className="timeline-date">
                          <span className="date-prefix">Starts:</span> {job.startDate}
                        </div>
                        <div className="timeline-date">
                          <span className="date-prefix">Ends:</span> {job.closingDate}
                        </div>
                      </td>
                      <td>
                        <span className={`status-badge ${status.class}`}>
                          {status.text}
                        </span>
                      </td>
                      <td>
                        <a 
                          href={job.applyUrl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="apply-btn-link"
                        >
                          Apply Now 
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3" />
                          </svg>
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-job-state">
            <span className="empty-job-icon">🔔</span>
            <p className="empty-job-title">No active job alerts match your target ({selectedExam})</p>
            <p className="empty-job-subtitle">Select a different exam setting or choose "All Exams" to browse active alerts.</p>
          </div>
        )}
      </div>
    </div>
  );
}
