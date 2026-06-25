import React, { useState } from 'react';

export default function QuizZone({ quizzes, onUpdateQuizStats }) {
  const [activeFilter, setActiveFilter] = useState('All');
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  // Group options for filter (exam-wise)
  const filters = ['All', 'UPSC', 'SSC', 'Banking', 'Railways', 'Defence', 'State PSC'];

  // Filter quizzes based on selected exam target
  const filteredQuizzes = quizzes.filter(q => {
    return activeFilter === 'All' || (q.examTarget && q.examTarget.includes(activeFilter));
  });

  const handleStartQuiz = () => {
    setIsQuizActive(true);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setHasAnswered(false);
    setScore(0);
    setQuizFinished(false);
  };

  const handleAnswerSubmit = (optionIndex) => {
    if (hasAnswered) return;
    
    setSelectedOption(optionIndex);
    setHasAnswered(true);

    const isCorrect = optionIndex === filteredQuizzes[currentQuestionIndex].correctAnswer;
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setHasAnswered(false);

    if (currentQuestionIndex + 1 < filteredQuizzes.length) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Quiz Finished!
      setQuizFinished(true);
      const finalAccuracy = Math.round((score / filteredQuizzes.length) * 100);
      onUpdateQuizStats(finalAccuracy);
    }
  };

  const activeQuestion = filteredQuizzes[currentQuestionIndex];

  return (
    <div className="quiz-zone-container">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title-section">
          <h1>Self-Assessment Quiz</h1>
          <p>Test your retention of current affairs and static modules with live feedback.</p>
        </div>
      </div>

      {!isQuizActive ? (
        /* Quiz Selection Dashboard */
        <div className="quiz-setup-card glass-card">
          <div className="setup-header">
            <span className="setup-icon">🎯</span>
            <h2>Select Target Exam Quiz</h2>
          </div>
          <p className="setup-desc">Choose your target exam. The quiz engine will calibrate a test matching the syllabus and question styles of your selected exam.</p>

          <div className="setup-filters">
            {filters.map(f => (
              <button
                key={f}
                className={`setup-filter-btn ${activeFilter === f ? 'active' : ''}`}
                onClick={() => setActiveFilter(f)}
              >
                {f === 'All' ? 'All Exams' : f}
              </button>
            ))}
          </div>

          <div className="setup-details">
            <div className="detail-item">
              <span className="detail-label">Total Questions:</span>
              <span className="detail-val">{filteredQuizzes.length} Questions</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Question Type:</span>
              <span className="detail-val">Multiple Choice (MCQ)</span>
            </div>
            <div className="detail-item">
              <span className="detail-label font-bold">Exam Calibration:</span>
              <span className="detail-val text-warning">{activeFilter === 'All' ? 'Mixed Syllabus' : `${activeFilter} Calibrated`}</span>
            </div>
          </div>

          <button 
            className="btn btn-primary start-quiz-btn"
            onClick={handleStartQuiz}
            disabled={filteredQuizzes.length === 0}
          >
            Start Practice Test &rarr;
          </button>
        </div>
      ) : quizFinished ? (
        /* Quiz Results Page */
        <div className="quiz-results-card glass-card">
          <div className="results-badge">🏆 Quiz Completed!</div>
          
          <div className="results-score-circle">
            <span className="results-score-num">{score}</span>
            <span className="results-score-total">/ {filteredQuizzes.length}</span>
          </div>

          <div className="results-stats">
            <h3>Performance Breakdown</h3>
            <div className="results-stat-row">
              <span>Accuracy Rate:</span>
              <span className="stat-highlight">
                {Math.round((score / filteredQuizzes.length) * 100)}%
              </span>
            </div>
            <div className="results-stat-row">
              <span>Topic:</span>
              <span className="stat-highlight">{activeFilter} Focus</span>
            </div>
          </div>

          <div className="results-feedback">
            {score === filteredQuizzes.length ? (
              <p className="feedback-success">🌟 Phenomenal performance! You have perfect command over these modules.</p>
            ) : score >= filteredQuizzes.length / 2 ? (
              <p className="feedback-warning">👍 Good job! Read through your saved bookmarks to cover the gaps.</p>
            ) : (
              <p className="feedback-danger">📚 Revision needed. Go back to the Current Affairs and Static GK pages to revise.</p>
            )}
          </div>

          <div className="results-actions">
            <button className="btn btn-primary" onClick={handleStartQuiz}>
              Retry Quiz
            </button>
            <button className="btn btn-secondary" onClick={() => setIsQuizActive(false)}>
              Back to Menu
            </button>
          </div>
        </div>
      ) : (
        /* Active Quiz Screen */
        <div className="active-quiz-card glass-card">
          <div className="quiz-progress-header">
            <span className="quiz-progress-text">Question {currentQuestionIndex + 1} of {filteredQuizzes.length}</span>
            <span className="quiz-category-tag">{activeQuestion.category} &bull; {activeQuestion.subCategory}</span>
          </div>
          
          <div className="progress-bar-outer">
            <div 
              className="progress-bar-inner" 
              style={{ width: `${((currentQuestionIndex + 1) / filteredQuizzes.length) * 100}%` }}
            ></div>
          </div>

          {/* Question Text */}
          <h2 className="quiz-question-text">{activeQuestion.question}</h2>

          {/* Options Grid */}
          <div className="quiz-options-grid">
            {activeQuestion.options.map((option, idx) => {
              let optionClass = '';
              if (hasAnswered) {
                if (idx === activeQuestion.correctAnswer) {
                  optionClass = 'option-correct';
                } else if (idx === selectedOption) {
                  optionClass = 'option-incorrect';
                } else {
                  optionClass = 'option-disabled';
                }
              }
              
              return (
                <button
                  key={idx}
                  className={`option-btn ${optionClass} ${selectedOption === idx ? 'selected' : ''}`}
                  onClick={() => handleAnswerSubmit(idx)}
                  disabled={hasAnswered}
                >
                  <span className="option-letter">{String.fromCharCode(65 + idx)}.</span>
                  <span className="option-text-content">{option}</span>
                </button>
              );
            })}
          </div>

          {/* Explanation Segment */}
          {hasAnswered && (
            <div className="explanation-section glass-card">
              <div className="explanation-header">
                <span className="ex-icon">🧐</span>
                <h4>Detailed Explanation</h4>
              </div>
              <p className="explanation-body">{activeQuestion.explanation}</p>
              
              <button className="btn btn-primary next-question-btn" onClick={handleNext}>
                {currentQuestionIndex + 1 === filteredQuizzes.length ? 'Finish Quiz' : 'Next Question →'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
