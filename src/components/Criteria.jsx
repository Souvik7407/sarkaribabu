import React, { useState } from 'react';

export default function Criteria({ examCriteria }) {
  const [activeCategory, setActiveCategory] = useState(examCriteria[0]?.id || 'UPSC');
  const [activeSubExam, setActiveSubExam] = useState(examCriteria[0]?.subExams?.[0]?.id || 'CSE');

  const currentCategoryData = examCriteria.find(c => c.id === activeCategory) || examCriteria[0];
  const currentSubExamData = currentCategoryData?.subExams?.find(s => s.id === activeSubExam) || currentCategoryData?.subExams?.[0];

  return (
    <div className="criteria-container">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title-section">
          <h1>Syllabus &amp; Exam Criteria</h1>
          <p>Official syllabus, eligibility parameters, fees, and stage patterns structured to guide your prep.</p>
        </div>
      </div>

      {/* Main Category Selector Grid */}
      <div className="tab-filters">
        {examCriteria.map((cat) => (
          <button
            key={cat.id}
            className={`tab-btn ${activeCategory === cat.id ? 'active' : ''}`}
            onClick={() => {
              setActiveCategory(cat.id);
              if (cat.subExams && cat.subExams.length > 0) {
                setActiveSubExam(cat.subExams[0].id);
              }
            }}
          >
            {cat.id}
          </button>
        ))}
      </div>

      {/* Secondary Sub-Exam Selector Dropdown */}
      {currentCategoryData?.subExams && currentCategoryData.subExams.length > 1 && (
        <div className="sub-exam-dropdown-container glass-card">
          <label htmlFor="sub-exam-select" className="sub-tab-label">
            📋 Select Exam:
          </label>
          <div className="select-wrapper">
            <select
              id="sub-exam-select"
              className="sub-exam-select-dropdown"
              value={activeSubExam}
              onChange={(e) => setActiveSubExam(e.target.value)}
            >
              {currentCategoryData.subExams.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  [{sub.id}] {sub.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Active Exam Card Details */}
      {currentSubExamData ? (
        <div className="criteria-details-view glass-card active-criteria-card">
          {/* Header Block */}
          <div className="criteria-card-header">
            <div className="criteria-header-left">
              <span className="exam-criteria-icon">🎯</span>
              <div>
                <h2>{currentSubExamData.name}</h2>
                <p className="conducting-body-text">Conducting Authority: <strong>{currentSubExamData.conductingBody}</strong></p>
              </div>
            </div>
            <span className="criteria-exam-badge">{currentSubExamData.id}</span>
          </div>

          <hr className="criteria-divider" />

          {/* Grid Layout: Eligibility parameters */}
          <div className="criteria-section">
            <h3 className="section-title">⚖️ Eligibility Criteria</h3>
            <div className="criteria-grid">
              {/* Age Limit */}
              <div className="criteria-grid-item">
                <div className="item-title">
                  <span className="item-icon">🗓️</span>
                  <h4>Age Limit &amp; Relaxations</h4>
                </div>
                <p>{currentSubExamData.eligibility.ageLimit}</p>
              </div>

              {/* Qualification */}
              <div className="criteria-grid-item">
                <div className="item-title">
                  <span className="item-icon">🎓</span>
                  <h4>Educational Qualification</h4>
                </div>
                <p>{currentSubExamData.eligibility.qualification}</p>
              </div>

              {/* Nationality */}
              <div className="criteria-grid-item">
                <div className="item-title">
                  <span className="item-icon">🌍</span>
                  <h4>Nationality</h4>
                </div>
                <p>{currentSubExamData.eligibility.nationality}</p>
              </div>

              {/* Attempts */}
              <div className="criteria-grid-item">
                <div className="item-title">
                  <span className="item-icon">🔄</span>
                  <h4>Number of Attempts</h4>
                </div>
                <p>{currentSubExamData.eligibility.attempts}</p>
              </div>
            </div>
          </div>

          {/* Fees Section */}
          <div className="criteria-section">
            <h3 className="section-title">💳 Application Fees Structure</h3>
            <div className="fees-row-container">
              <div className="fees-card general-fees-box">
                <div className="fees-badge-header">General / OBC / EWS</div>
                <div className="fees-amount">{currentSubExamData.fees.general}</div>
              </div>
              <div className="fees-card exempted-fees-box">
                <div className="fees-badge-header">Female / SC / ST / PwD</div>
                <div className="fees-amount">{currentSubExamData.fees.female_sc_st}</div>
              </div>
            </div>
          </div>

          {/* Exam Stages Timeline */}
          <div className="criteria-section">
            <h3 className="section-title">📝 Exam Pattern &amp; Selection Stages</h3>
            <div className="stages-timeline">
              {currentSubExamData.syllabus.stages.map((stage, idx) => (
                <div key={idx} className="timeline-stage">
                  <div className="timeline-marker">
                    <span className="timeline-step-num">{idx + 1}</span>
                    {idx < currentSubExamData.syllabus.stages.length - 1 && <span className="timeline-line"></span>}
                  </div>
                  <div className="timeline-content">
                    <h4>{stage.name}</h4>
                    <p>{stage.details}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Key Topics Tag Cloud */}
          <div className="criteria-section">
            <h3 className="section-title">📚 Core Syllabus Subjects &amp; Focus Topics</h3>
            <div className="keyword-tags criteria-tags-cloud">
              {currentSubExamData.syllabus.keyTopics.map((topic, index) => (
                <span key={index} className="tag tag-primary syllabus-focus-tag">
                  {topic}
                </span>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="glass-card active-criteria-card text-center">
          <p>Select an exam category to explore details.</p>
        </div>
      )}
    </div>
  );
}
