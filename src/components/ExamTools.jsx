import React, { useState, useEffect, useRef } from 'react';

export default function ExamTools() {
  const [activeSubTab, setActiveSubTab] = useState('negative-calc');

  // --- Negative Score Calculator State ---
  const [correctCount, setCorrectCount] = useState(60);
  const [incorrectCount, setIncorrectCount] = useState(15);
  const [marksPerCorrect, setMarksPerCorrect] = useState(2);
  const [negativeFactor, setNegativeFactor] = useState(0.333); // 1/3rd default for UPSC
  const [calcResult, setCalcResult] = useState({ gross: 0, penalty: 0, net: 0, accuracy: 0 });

  // --- Pomodoro Timer State ---
  const [timerMode, setTimerMode] = useState('work'); // 'work' or 'break'
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [timerActive, setTimerActive] = useState(false);
  const timerRef = useRef(null);

  // --- Eligibility Calculator State ---
  const [dob, setDob] = useState('2000-01-01');
  const [category, setCategory] = useState('General');
  const [examType, setExamType] = useState('UPSC'); // 'UPSC', 'SSC-CGL', 'IBPS-PO'
  const [eligibilityResult, setEligibilityResult] = useState(null);

  // --- Photo & Signature Merger State ---
  const [photoFile, setPhotoFile] = useState(null);
  const [sigFile, setSigFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [sigPreview, setSigPreview] = useState(null);
  const [canvasWidth, setCanvasWidth] = useState(350);
  const [canvasPhotoHeight, setCanvasPhotoHeight] = useState(350);
  const [canvasSigHeight, setCanvasSigHeight] = useState(100);
  const [gapSize, setGapSize] = useState(10);
  const [bgColor, setBgColor] = useState('#FFFFFF');
  const canvasRef = useRef(null);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      setPhotoPreview(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSigUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSigFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      setSigPreview(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleClearPhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
  };

  const handleClearSig = () => {
    setSigFile(null);
    setSigPreview(null);
  };

  const handleDownloadMerged = () => {
    const canvas = canvasRef.current;
    if (!canvas || !photoPreview) {
      alert("Please upload at least the photograph to download.");
      return;
    }
    const link = document.createElement('a');
    link.download = 'merged_photo_signature.jpg';
    link.href = canvas.toDataURL('image/jpeg', 0.9);
    link.click();
  };

  const drawMergedCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const totalHeight = canvasPhotoHeight + canvasSigHeight + gapSize;
    canvas.width = canvasWidth;
    canvas.height = totalHeight;

    // Clear and set background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvasWidth, totalHeight);

    const loadAndDrawImage = (src, x, y, w, h, fallbackText) => {
      return new Promise((resolve) => {
        if (!src) {
          // Draw placeholder
          ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)';
          ctx.lineWidth = 1;
          ctx.strokeRect(5, y + 5, w - 10, h - 10);
          ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
          ctx.font = '12px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(fallbackText, w / 2, y + (h / 2));
          resolve();
          return;
        }

        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 0, y, w, h);
          resolve();
        };
        img.onerror = () => {
          resolve();
        };
        img.src = src;
      });
    };

    Promise.all([
      loadAndDrawImage(photoPreview, 0, 0, canvasWidth, canvasPhotoHeight, "Photograph Area (Upload photo)"),
      loadAndDrawImage(sigPreview, 0, canvasPhotoHeight + gapSize, canvasWidth, canvasSigHeight, "Signature Area (Upload signature)")
    ]);
  };

  useEffect(() => {
    if (activeSubTab === 'photo-merger') {
      setTimeout(drawMergedCanvas, 100);
    }
  }, [activeSubTab, photoPreview, sigPreview, canvasWidth, canvasPhotoHeight, canvasSigHeight, gapSize, bgColor]);

  // --- Calculate Negative Marks ---
  useEffect(() => {
    const gross = correctCount * marksPerCorrect;
    const penalty = incorrectCount * marksPerCorrect * negativeFactor;
    const net = gross - penalty;
    const totalAttempted = correctCount + incorrectCount;
    const accuracy = totalAttempted > 0 ? (correctCount / totalAttempted) * 100 : 0;
    setCalcResult({
      gross: gross.toFixed(2),
      penalty: penalty.toFixed(2),
      net: net.toFixed(2),
      accuracy: accuracy.toFixed(1)
    });
  }, [correctCount, incorrectCount, marksPerCorrect, negativeFactor]);

  // --- Pomodoro Timer Logic ---
  useEffect(() => {
    if (timerActive) {
      timerRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setTimerActive(false);
            // Toggle mode
            if (timerMode === 'work') {
              setTimerMode('break');
              setSecondsLeft(5 * 60);
              alert("Focus session complete! Take a 5-minute break. ☕");
            } else {
              setTimerMode('work');
              setSecondsLeft(25 * 60);
              alert("Break is over! Time to focus. 📚");
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [timerActive, timerMode]);

  const handleStartPause = () => {
    setTimerActive(!timerActive);
  };

  const handleResetTimer = () => {
    setTimerActive(false);
    setSecondsLeft(timerMode === 'work' ? 25 * 60 : 5 * 60);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const getTimerPercentage = () => {
    const totalSecs = timerMode === 'work' ? 25 * 60 : 5 * 60;
    return ((totalSecs - secondsLeft) / totalSecs) * 100;
  };

  // --- Eligibility Calculation Logic ---
  const handleCalculateEligibility = (e) => {
    if (e) e.preventDefault();
    if (!dob) return;

    const birthDate = new Date(dob);
    const referenceDate = new Date('2026-08-01'); // Standard reference date for eligibility check
    
    let ageYears = referenceDate.getFullYear() - birthDate.getFullYear();
    let monthDiff = referenceDate.getMonth() - birthDate.getMonth();
    let dayDiff = referenceDate.getDate() - birthDate.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      ageYears--;
    }

    let isEligible = false;
    let maxAge = 0;
    let minAge = 21;
    let attemptsLimit = 0;
    
    // Eligibility criteria details (Category-based relaxations)
    if (examType === 'UPSC') {
      minAge = 21;
      attemptsLimit = 6;
      if (category === 'General' || category === 'EWS') {
        maxAge = 32;
      } else if (category === 'OBC') {
        maxAge = 35;
        attemptsLimit = 9;
      } else if (category === 'SC' || category === 'ST') {
        maxAge = 37;
        attemptsLimit = 'Unlimited';
      }
      isEligible = ageYears >= minAge && ageYears <= maxAge;
    } else if (examType === 'SSC-CGL') {
      minAge = 18;
      attemptsLimit = 'Unlimited';
      if (category === 'General' || category === 'EWS') {
        maxAge = 30; // Varies 27-32 depending on post, average 30
      } else if (category === 'OBC') {
        maxAge = 33;
      } else if (category === 'SC' || category === 'ST') {
        maxAge = 35;
      }
      isEligible = ageYears >= minAge && ageYears <= maxAge;
    } else {
      // IBPS-PO
      minAge = 20;
      attemptsLimit = 'Unlimited';
      if (category === 'General' || category === 'EWS') {
        maxAge = 30;
      } else if (category === 'OBC') {
        maxAge = 33;
      } else if (category === 'SC' || category === 'ST') {
        maxAge = 35;
      }
      isEligible = ageYears >= minAge && ageYears <= maxAge;
    }

    setEligibilityResult({
      age: ageYears,
      isEligible,
      minAge,
      maxAge,
      attemptsLimit,
      examType
    });
  };

  return (
    <div className="exam-tools-container">
      <div className="page-header">
        <div className="page-title-section">
          <h1>🛠️ Aspirant Toolkit</h1>
          <p>Handy tools to calculate eligibility, negative marking scores, and build study focus intervals.</p>
        </div>
      </div>

      {/* Sub Tabs Selector */}
      <div className="store-filter-bar glass-card" style={{ marginBottom: '2rem' }}>
        <div className="category-scroll-chips" style={{ paddingBottom: 0 }}>
          <button 
            className={`filter-chip ${activeSubTab === 'negative-calc' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('negative-calc')}
          >
            📊 Negative Marker Calculator
          </button>
          <button 
            className={`filter-chip ${activeSubTab === 'pomodoro' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('pomodoro')}
          >
            ⏱️ Pomodoro Focus Timer
          </button>
          <button 
            className={`filter-chip ${activeSubTab === 'eligibility' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('eligibility')}
          >
            🎓 Eligibility & Age Calculator
          </button>
          <button 
            className={`filter-chip ${activeSubTab === 'photo-merger' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('photo-merger')}
          >
            📷 Photo & Signature Merger
          </button>
        </div>
      </div>

      {/* Tab Panels */}
      <div className="tools-panel-content">
        
        {/* PANEL 1: Negative Marker Calculator */}
        {activeSubTab === 'negative-calc' && (
          <div className="tool-card glass-card" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <h3>Marks & Deductions Calculator</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                Simulate your exam scores. Change answer parameters to see your net score and negative penalty impact.
              </p>

              <div className="calculator-form" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="input-group-label" style={{ display: 'flex', flexDirection: 'column' }}>
                  <label htmlFor="correct-field">Correct Answers</label>
                  <input 
                    id="correct-field"
                    type="number" 
                    value={correctCount} 
                    onChange={(e) => setCorrectCount(Math.max(0, parseInt(e.target.value) || 0))} 
                  />
                </div>
                <div className="input-group-label" style={{ display: 'flex', flexDirection: 'column' }}>
                  <label htmlFor="incorrect-field">Incorrect Answers</label>
                  <input 
                    id="incorrect-field"
                    type="number" 
                    value={incorrectCount} 
                    onChange={(e) => setIncorrectCount(Math.max(0, parseInt(e.target.value) || 0))} 
                  />
                </div>
                <div className="input-group-label" style={{ display: 'flex', flexDirection: 'column' }}>
                  <label htmlFor="marks-field">Marks Per Correct</label>
                  <input 
                    id="marks-field"
                    type="number" 
                    step="0.5" 
                    value={marksPerCorrect} 
                    onChange={(e) => setMarksPerCorrect(Math.max(0, parseFloat(e.target.value) || 0))} 
                  />
                </div>
                <div className="input-group-label" style={{ display: 'flex', flexDirection: 'column' }}>
                  <label htmlFor="negative-field">Negative Penalty Factor</label>
                  <select 
                    id="negative-field"
                    value={negativeFactor} 
                    onChange={(e) => setNegativeFactor(parseFloat(e.target.value))}
                    style={{ 
                      background: 'rgba(255,255,255,0.05)', 
                      border: '1px solid rgba(255,255,255,0.08)', 
                      borderRadius: 'var(--radius-md)', 
                      padding: '0.75rem 1rem', 
                      color: 'var(--text-main)', 
                      outline: 'none' 
                    }}
                  >
                    <option value={0.333}>-1/3rd (0.33) - UPSC / PCS</option>
                    <option value={0.25}>-1/4th (0.25) - SSC CGL / Bank</option>
                    <option value={0.5}>-1/2 (0.50) - Defence / Airforce</option>
                    <option value={0.0}>No Negative Marking</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="results-panel" style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px dashed rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <h4 style={{ textTransform: 'uppercase', fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '0.05em', marginBottom: '1.25rem' }}>Calculated Scoreboard</h4>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Gross Marks</span>
                  <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>{calcResult.gross}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Penalty Deducted</span>
                  <span style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f43f5e' }}>-{calcResult.penalty}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gridColumn: 'span 2', padding: '1rem 0', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--primary)', textTransform: 'uppercase', fontWeight: 700 }}>Net Score</span>
                  <span style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-main)' }}>{calcResult.net}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gridColumn: 'span 2' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Accuracy rate</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.25rem' }}>
                    <div style={{ flex: 1, height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
                      <div style={{ width: `${calcResult.accuracy}%`, height: '100%', background: parseFloat(calcResult.accuracy) > 75 ? '#22c55e' : '#f59e0b', transition: 'width 0.3s ease' }}></div>
                    </div>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{calcResult.accuracy}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSubTab === 'pomodoro' && (
          <div className={`tool-card glass-card ${timerActive ? 'timer-active' : ''}`} style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '3rem 2rem' }}>
            <h3 style={{ marginBottom: '0.5rem' }}>Pomodoro Study Companion</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', maxWidth: '480px', margin: '0 auto 2.5rem auto' }}>
              Boost study stamina. Work without distractions for 25 minutes, then recharge with a 5-minute break.
            </p>

            <div className="timer-svg-container" style={{ position: 'relative', width: '200px', height: '200px', marginBottom: '2rem' }}>
              <svg width="200" height="200" viewBox="0 0 200 200" style={{ transform: 'rotate(-90deg)' }}>
                {/* Background Ring */}
                <circle cx="100" cy="100" r="85" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="8" />
                {/* Foreground Progress Ring */}
                <circle 
                  cx="100" 
                  cy="100" 
                  r="85" 
                  fill="none" 
                  stroke={timerMode === 'work' ? 'var(--primary)' : '#22c55e'} 
                  strokeWidth="8" 
                  strokeDasharray="534" 
                  strokeDashoffset={534 - (534 * getTimerPercentage()) / 100}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 1s linear' }}
                />
              </svg>
              {/* Central Clock */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-main)', letterSpacing: '0.02em' }}>{formatTime(secondsLeft)}</span>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: timerMode === 'work' ? 'var(--primary)' : '#22c55e', letterSpacing: '0.05em', marginTop: '0.2rem' }}>
                  {timerMode === 'work' ? '🔥 Focus Session' : '☕ Relax break'}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', width: '100%', maxWidth: '320px' }}>
              <button 
                className={`btn ${timerActive ? 'btn-secondary' : 'btn-primary'}`} 
                onClick={handleStartPause}
                style={{ flex: 1, padding: '0.75rem 1rem', fontWeight: 700 }}
              >
                {timerActive ? 'Pause' : 'Start Focus'}
              </button>
              <button 
                className="btn btn-secondary" 
                onClick={handleResetTimer}
                style={{ flex: 1, padding: '0.75rem 1rem', fontWeight: 700 }}
              >
                Reset Timer
              </button>
            </div>
          </div>
        )}

        {/* PANEL 3: Age & Eligibility Calculator */}
        {activeSubTab === 'eligibility' && (
          <div className="tool-card glass-card" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <h3>Exam Age & Criteria Eligibility Checker</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                Enter your date of birth and reservation pool to instantly test your eligibility status and limits for major examinations.
              </p>

              <form onSubmit={handleCalculateEligibility} style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                <div className="input-group-label" style={{ display: 'flex', flexDirection: 'column' }}>
                  <label htmlFor="dob-field">Date of Birth</label>
                  <input 
                    id="dob-field"
                    type="date" 
                    value={dob} 
                    onChange={(e) => setDob(e.target.value)} 
                    style={{ width: '100%' }}
                    required
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="input-group-label" style={{ display: 'flex', flexDirection: 'column' }}>
                    <label htmlFor="category-field">Category Pool</label>
                    <select 
                      id="category-field"
                      value={category} 
                      onChange={(e) => setCategory(e.target.value)}
                      style={{ 
                        background: 'rgba(255,255,255,0.05)', 
                        border: '1px solid rgba(255,255,255,0.08)', 
                        borderRadius: 'var(--radius-md)', 
                        padding: '0.75rem 1rem', 
                        color: 'var(--text-main)', 
                        outline: 'none' 
                      }}
                    >
                      <option value="General">General (UR)</option>
                      <option value="OBC">OBC (Non-Creamy)</option>
                      <option value="SC">SC</option>
                      <option value="ST">ST</option>
                      <option value="EWS">EWS</option>
                    </select>
                  </div>
                  <div className="input-group-label" style={{ display: 'flex', flexDirection: 'column' }}>
                    <label htmlFor="exam-type-field">Target Examination</label>
                    <select 
                      id="exam-type-field"
                      value={examType} 
                      onChange={(e) => setExamType(e.target.value)}
                      style={{ 
                        background: 'rgba(255,255,255,0.05)', 
                        border: '1px solid rgba(255,255,255,0.08)', 
                        borderRadius: 'var(--radius-md)', 
                        padding: '0.75rem 1rem', 
                        color: 'var(--text-main)', 
                        outline: 'none' 
                      }}
                    >
                      <option value="UPSC">UPSC Civil Services</option>
                      <option value="SSC-CGL">SSC CGL Tier Exams</option>
                      <option value="IBPS-PO">IBPS PO Banking Officer</option>
                    </select>
                  </div>
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.8rem', fontWeight: 700, marginTop: '0.5rem' }}>
                  Check Eligibility Status
                </button>
              </form>
            </div>

            <div className="results-panel" style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px dashed rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <h4 style={{ textTransform: 'uppercase', fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '0.05em', marginBottom: '1rem' }}>Verification Report</h4>

              {eligibilityResult ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontSize: '2rem' }}>
                      {eligibilityResult.isEligible ? '✅' : '❌'}
                    </span>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '1.25rem', color: eligibilityResult.isEligible ? '#22c55e' : '#f43f5e', fontWeight: 800 }}>
                        {eligibilityResult.isEligible ? 'Eligible to Apply' : 'Not Eligible (Age Limit)'}
                      </h4>
                      <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        Based on age calculations on reference date Aug 1, 2026.
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem' }}>
                    <div>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>Calculated Age</span>
                      <span style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)' }}>{eligibilityResult.age} Years</span>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>Age Limits (Min/Max)</span>
                      <span style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)' }}>{eligibilityResult.minAge} to {eligibilityResult.maxAge} Yrs</span>
                    </div>
                    <div style={{ gridColumn: 'span 2' }}>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>Attempts Permitted (Category relaxation)</span>
                      <span style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--primary)' }}>
                        {eligibilityResult.attemptsLimit} {eligibilityResult.attemptsLimit === 'Unlimited' ? '' : 'Attempts'}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '1.5rem 0', color: 'var(--text-muted)' }}>
                  <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.5rem' }}>📅</span>
                  <p style={{ margin: 0, fontSize: '0.85rem' }}>Select your birthdate and click "Check Eligibility" above to build your report.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* PANEL 4: Photo & Signature Merger */}
        {activeSubTab === 'photo-merger' && (
          <div className="tool-card glass-card" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <h3>📷 Photo & Signature Merger</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                Quickly combine your passport photograph and signature into a single image to meet official government application specifications (UPSC/SSC CGL).
              </p>

              <div className="merger-upload-controls" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* Photo Upload */}
                <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <label htmlFor="photo-file-input" style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.5rem' }}>1. Upload Passport Photograph</label>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <input 
                      id="photo-file-input"
                      type="file" 
                      accept="image/*" 
                      onChange={handlePhotoUpload} 
                      style={{ fontSize: '0.8rem' }}
                    />
                    {photoPreview && (
                      <button className="btn btn-secondary" onClick={handleClearPhoto} style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}>
                        Clear
                      </button>
                    )}
                  </div>
                </div>

                {/* Signature Upload */}
                <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <label htmlFor="signature-file-input" style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.5rem' }}>2. Upload Signature</label>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <input 
                      id="signature-file-input"
                      type="file" 
                      accept="image/*" 
                      onChange={handleSigUpload} 
                      style={{ fontSize: '0.8rem' }}
                    />
                    {sigPreview && (
                      <button className="btn btn-secondary" onClick={handleClearSig} style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}>
                        Clear
                      </button>
                    )}
                  </div>
                </div>

                {/* Advanced Dimensions Settings */}
                <div style={{ background: 'rgba(255, 255, 255, 0.01)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px dashed rgba(255, 255, 255, 0.06)' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '0.75rem' }}>Adjust Dimensions (UPSC Standard: 350x450px)</span>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                    <div className="input-group-label" style={{ display: 'flex', flexDirection: 'column' }}>
                      <label htmlFor="canvas-width-field" style={{ fontSize: '0.7rem' }}>Width (px)</label>
                      <input 
                        id="canvas-width-field"
                        type="number" 
                        value={canvasWidth} 
                        onChange={(e) => setCanvasWidth(Math.max(100, parseInt(e.target.value) || 0))} 
                        style={{ padding: '0.5rem', fontSize: '0.8rem' }}
                      />
                    </div>
                    <div className="input-group-label" style={{ display: 'flex', flexDirection: 'column' }}>
                      <label htmlFor="photo-height-field" style={{ fontSize: '0.7rem' }}>Photo H (px)</label>
                      <input 
                        id="photo-height-field"
                        type="number" 
                        value={canvasPhotoHeight} 
                        onChange={(e) => setCanvasPhotoHeight(Math.max(100, parseInt(e.target.value) || 0))} 
                        style={{ padding: '0.5rem', fontSize: '0.8rem' }}
                      />
                    </div>
                    <div className="input-group-label" style={{ display: 'flex', flexDirection: 'column' }}>
                      <label htmlFor="signature-height-field" style={{ fontSize: '0.7rem' }}>Sig H (px)</label>
                      <input 
                        id="signature-height-field"
                        type="number" 
                        value={canvasSigHeight} 
                        onChange={(e) => setCanvasSigHeight(Math.max(30, parseInt(e.target.value) || 0))} 
                        style={{ padding: '0.5rem', fontSize: '0.8rem' }}
                      />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.75rem' }}>
                    <div className="input-group-label" style={{ display: 'flex', flexDirection: 'column' }}>
                      <label htmlFor="spacing-gap-field" style={{ fontSize: '0.7rem' }}>Spacing Gap (px)</label>
                      <input 
                        id="spacing-gap-field"
                        type="number" 
                        value={gapSize} 
                        onChange={(e) => setGapSize(Math.max(0, parseInt(e.target.value) || 0))} 
                        style={{ padding: '0.5rem', fontSize: '0.8rem' }}
                      />
                    </div>
                    <div className="input-group-label" style={{ display: 'flex', flexDirection: 'column' }}>
                      <label htmlFor="bg-color-field" style={{ fontSize: '0.7rem' }}>Background Color</label>
                      <input 
                        id="bg-color-field"
                        type="color" 
                        value={bgColor} 
                        onChange={(e) => setBgColor(e.target.value)} 
                        style={{ padding: '0.2rem', height: '34px', width: '100%', border: 'none', background: 'transparent', cursor: 'pointer' }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Canvas Output Display */}
            <div className="results-panel" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px dashed rgba(255,255,255,0.08)' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>Live merged Preview</span>
              
              <div className="canvas-preview-container" style={{ border: '1px solid rgba(255, 255, 255, 0.1)', padding: '10px', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', maxWidth: '100%', overflowX: 'auto' }}>
                <canvas 
                  ref={canvasRef} 
                  style={{ 
                    display: 'block', 
                    maxWidth: '100%', 
                    boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                    borderRadius: '4px' 
                  }} 
                />
              </div>

              <button 
                className="btn btn-primary" 
                onClick={handleDownloadMerged} 
                style={{ width: '100%', padding: '0.8rem', fontWeight: 700 }}
                disabled={!photoPreview}
              >
                Download Combined Image (.JPG)
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
