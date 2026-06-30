import React, { useState, useEffect, useRef } from 'react';

export default function ExamTools() {
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

  // --- PDF & JPG Converter State ---
  const [libStatus, setLibStatus] = useState({ jspdf: false, pdfjs: false });
  const [jpgToPdfFiles, setJpgToPdfFiles] = useState([]);
  const [pdfOrientation, setPdfOrientation] = useState('portrait');
  const [pdfMargin, setPdfMargin] = useState('none');
  const [pdfToJpgFile, setPdfToJpgFile] = useState(null);
  const [pdfToJpgPages, setPdfToJpgPages] = useState([]);
  const [pdfPageCount, setPdfPageCount] = useState(0);
  const [isPdfProcessing, setIsPdfProcessing] = useState(false);
  const [renderScale, setRenderScale] = useState(1.5);

  // --- Dynamic Script Loader on Mount ---
  useEffect(() => {
    // Inject jsPDF
    if (!window.jspdf) {
      const scriptJsPdf = document.createElement('script');
      scriptJsPdf.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
      scriptJsPdf.async = true;
      scriptJsPdf.onload = () => setLibStatus(prev => ({ ...prev, jspdf: true }));
      document.head.appendChild(scriptJsPdf);
    } else {
      setLibStatus(prev => ({ ...prev, jspdf: true }));
    }

    // Inject PDF.js
    if (!window.pdfjsLib) {
      const scriptPdfJs = document.createElement('script');
      scriptPdfJs.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js';
      scriptPdfJs.async = true;
      scriptPdfJs.onload = () => {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';
        setLibStatus(prev => ({ ...prev, pdfjs: true }));
      };
      document.head.appendChild(scriptPdfJs);
    } else {
      setLibStatus(prev => ({ ...prev, pdfjs: true }));
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

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
    const referenceDate = new Date('2026-08-01');
    
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
        maxAge = 30;
      } else if (category === 'OBC') {
        maxAge = 33;
      } else if (category === 'SC' || category === 'ST') {
        maxAge = 35;
      }
      isEligible = ageYears >= minAge && ageYears <= maxAge;
    } else {
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

  // --- Photo & Signature Merger Logic ---
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

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvasWidth, totalHeight);

    const loadAndDrawImage = (src, x, y, w, h, fallbackText) => {
      return new Promise((resolve) => {
        if (!src) {
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
    // Redraw photo merger when states change
    setTimeout(drawMergedCanvas, 100);
  }, [photoPreview, sigPreview, canvasWidth, canvasPhotoHeight, canvasSigHeight, gapSize, bgColor]);

  // --- PDF & JPG Converter Logic ---
  const handleJpgToPdfUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setJpgToPdfFiles((prev) => [
          ...prev,
          {
            id: Math.random().toString(36).substring(2, 9),
            name: file.name,
            preview: event.target.result
          }
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveJpgFile = (id) => {
    setJpgToPdfFiles(prev => prev.filter(f => f.id !== id));
  };

  const handleMoveJpgFile = (id, direction) => {
    setJpgToPdfFiles((prev) => {
      const index = prev.findIndex(f => f.id === id);
      if (index === -1) return prev;
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= prev.length) return prev;

      const newFiles = [...prev];
      const temp = newFiles[index];
      newFiles[index] = newFiles[targetIndex];
      newFiles[targetIndex] = temp;
      return newFiles;
    });
  };

  const handleConvertJpgToPdf = () => {
    if (!libStatus.jspdf || !window.jspdf) {
      alert("jsPDF library is still loading. Please wait a moment.");
      return;
    }
    if (jpgToPdfFiles.length === 0) {
      alert("Please upload at least one image file first.");
      return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
      orientation: pdfOrientation,
      unit: 'mm',
      format: 'a4'
    });

    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    
    let marginSize = 0;
    if (pdfMargin === 'small') marginSize = 5;
    else if (pdfMargin === 'normal') marginSize = 10;

    const useWidth = pageW - (marginSize * 2);
    const useHeight = pageH - (marginSize * 2);

    const addImagePage = (file, fileIndex) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          if (fileIndex > 0) {
            doc.addPage();
          }

          const imgW = img.width;
          const imgH = img.height;
          const ratio = Math.min(useWidth / imgW, useHeight / imgH);

          const drawW = imgW * ratio;
          const drawH = imgH * ratio;

          const x = marginSize + (useWidth - drawW) / 2;
          const y = marginSize + (useHeight - drawH) / 2;

          doc.addImage(file.preview, 'JPEG', x, y, drawW, drawH);
          resolve();
        };
        img.src = file.preview;
      });
    };

    jpgToPdfFiles.reduce((promise, file, index) => {
      return promise.then(() => addImagePage(file, index));
    }, Promise.resolve()).then(() => {
      doc.save('sarkaribabu_converted.pdf');
    });
  };

  const handlePdfToJpgUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPdfToJpgFile(file);
    setPdfToJpgPages([]);
    setPdfPageCount(0);
  };

  const handleConvertPdfToJpg = () => {
    if (!libStatus.pdfjs || !window.pdfjsLib) {
      alert("PDF.js library is still loading. Please wait a moment.");
      return;
    }
    if (!pdfToJpgFile) {
      alert("Please select a PDF file first.");
      return;
    }

    setIsPdfProcessing(true);
    const reader = new FileReader();

    reader.onload = function() {
      const typedArray = new Uint8Array(this.result);

      window.pdfjsLib.getDocument({ data: typedArray }).promise.then((pdf) => {
        setPdfPageCount(pdf.numPages);
        const pagesPromise = [];

        const renderPage = (pageNum) => {
          return pdf.getPage(pageNum).then((page) => {
            const viewport = page.getViewport({ scale: renderScale });
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            const renderContext = {
              canvasContext: context,
              viewport: viewport
            };

            return page.render(renderContext).promise.then(() => {
              return {
                pageNum,
                dataUrl: canvas.toDataURL('image/jpeg', 0.95)
              };
            });
          });
        };

        let sequencePromise = Promise.resolve();
        const results = [];

        for (let i = 1; i <= pdf.numPages; i++) {
          sequencePromise = sequencePromise.then(() => {
            return renderPage(i).then((pageData) => {
              results.push(pageData);
              setPdfToJpgPages([...results]);
            });
          });
        }

        sequencePromise.then(() => {
          setIsPdfProcessing(false);
        }).catch((err) => {
          console.error(err);
          alert("Error processing PDF pages.");
          setIsPdfProcessing(false);
        });

      }).catch((err) => {
        console.error(err);
        alert("Failed to load PDF file. Please ensure it is a valid PDF.");
        setIsPdfProcessing(false);
      });
    };

    reader.readAsArrayBuffer(pdfToJpgFile);
  };

  const handleDownloadSingleJpg = (page) => {
    const link = document.createElement('a');
    link.download = `pdf_page_${page.pageNum}.jpg`;
    link.href = page.dataUrl;
    link.click();
  };

  return (
    <div className="exam-tools-container">
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <div className="page-title-section">
          <h1>🛠️ Aspirant Toolkit</h1>
          <p>A comprehensive dashboard containing essential tools to prepare, calculate, and compile your exam documents.</p>
        </div>
      </div>

      {/* Grid Dashboard Frame containing every tool in its own colored square block */}
      <div className="tools-grid-container">

        {/* 1. NEGATIVE CALCULATOR - Indigo Block */}
        <div className="tool-block-card tool-block-indigo">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.25rem' }}>📊 Marks Calculator</span>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: 0 }}>
              Simulate scores and verify negative penalty factor impacts.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
            <div className="calculator-form" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div className="input-group-label" style={{ display: 'flex', flexDirection: 'column' }}>
                <label htmlFor="correct-field" style={{ fontSize: '0.75rem' }}>Correct</label>
                <input 
                  id="correct-field"
                  type="number" 
                  value={correctCount} 
                  onChange={(e) => setCorrectCount(Math.max(0, parseInt(e.target.value) || 0))} 
                  style={{ padding: '0.5rem', fontSize: '0.85rem' }}
                />
              </div>
              <div className="input-group-label" style={{ display: 'flex', flexDirection: 'column' }}>
                <label htmlFor="incorrect-field" style={{ fontSize: '0.75rem' }}>Incorrect</label>
                <input 
                  id="incorrect-field"
                  type="number" 
                  value={incorrectCount} 
                  onChange={(e) => setIncorrectCount(Math.max(0, parseInt(e.target.value) || 0))} 
                  style={{ padding: '0.5rem', fontSize: '0.85rem' }}
                />
              </div>
              <div className="input-group-label" style={{ display: 'flex', flexDirection: 'column' }}>
                <label htmlFor="marks-field" style={{ fontSize: '0.75rem' }}>Marks Per Correct</label>
                <input 
                  id="marks-field"
                  type="number" 
                  step="0.5" 
                  value={marksPerCorrect} 
                  onChange={(e) => setMarksPerCorrect(Math.max(0, parseFloat(e.target.value) || 0))} 
                  style={{ padding: '0.5rem', fontSize: '0.85rem' }}
                />
              </div>
              <div className="input-group-label" style={{ display: 'flex', flexDirection: 'column' }}>
                <label htmlFor="negative-field" style={{ fontSize: '0.75rem' }}>Penalty Factor</label>
                <select 
                  id="negative-field"
                  value={negativeFactor} 
                  onChange={(e) => setNegativeFactor(parseFloat(e.target.value))}
                  style={{ 
                    background: 'rgba(255,255,255,0.05)', 
                    border: '1px solid rgba(255,255,255,0.08)', 
                    borderRadius: 'var(--radius-md)', 
                    padding: '0.5rem', 
                    color: 'var(--text-main)', 
                    fontSize: '0.85rem',
                    outline: 'none' 
                  }}
                >
                  <option value={0.333}>-1/3rd (UPSC)</option>
                  <option value={0.25}>-1/4th (SSC)</option>
                  <option value={0.5}>-1/2 (Defence)</option>
                  <option value={0.0}>No Penalty</option>
                </select>
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px dashed rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Gross</span>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>{calcResult.gross}</div>
                </div>
                <div>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Penalty</span>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f43f5e' }}>-{calcResult.penalty}</div>
                </div>
                <div style={{ gridColumn: 'span 2', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '0.5rem' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 700 }}>NET SCORE</span>
                  <div style={{ fontSize: '2rem', fontWeight: 900 }}>{calcResult.net}</div>
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Accuracy: {calcResult.accuracy}%</span>
                  <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', marginTop: '0.25rem', overflow: 'hidden' }}>
                    <div style={{ width: `${calcResult.accuracy}%`, height: '100%', background: parseFloat(calcResult.accuracy) > 75 ? '#22c55e' : '#f59e0b' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. POMODORO TIMER - Rose Block */}
        <div className={`tool-block-card tool-block-rose ${timerActive ? 'timer-active' : ''}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ textAlign: 'center', width: '100%' }}>
            <span style={{ fontSize: '1.25rem', display: 'block', marginBottom: '0.25rem' }}>⏱️ Focus Companion</span>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: '0 auto' }}>
              Study in structured sessions to build deep concentration.
            </p>
          </div>

          <div className="timer-svg-container" style={{ margin: '1rem 0' }}>
            <svg width="180" height="180" viewBox="0 0 200 200" style={{ transform: 'rotate(-90deg)', display: 'block', margin: '0 auto' }}>
              <circle cx="100" cy="100" r="85" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="6" />
              <circle 
                cx="100" 
                cy="100" 
                r="85" 
                fill="none" 
                stroke={timerMode === 'work' ? 'var(--primary)' : '#22c55e'} 
                strokeWidth="6" 
                strokeDasharray="534" 
                strokeDashoffset={534 - (534 * getTimerPercentage()) / 100}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 1s linear' }}
              />
            </svg>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--text-main)' }}>{formatTime(secondsLeft)}</span>
              <span style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', color: timerMode === 'work' ? 'var(--primary)' : '#22c55e', marginTop: '0.1rem' }}>
                {timerMode === 'work' ? 'Focusing' : 'Break'}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', width: '100%' }}>
            <button 
              className={`btn ${timerActive ? 'btn-secondary' : 'btn-primary'}`} 
              onClick={handleStartPause}
              style={{ flex: 1, padding: '0.5rem', fontSize: '0.85rem', fontWeight: 700 }}
            >
              {timerActive ? 'Pause' : 'Start'}
            </button>
            <button 
              className="btn btn-secondary" 
              onClick={handleResetTimer}
              style={{ flex: 1, padding: '0.5rem', fontSize: '0.85rem', fontWeight: 700 }}
            >
              Reset
            </button>
          </div>
        </div>

        {/* 3. ELIGIBILITY CALCULATOR - Purple Block */}
        <div className="tool-block-card tool-block-purple">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.25rem' }}>🎓 Eligibility Checker</span>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: 0 }}>
              Verify age limits and attempt relaxations for standard exams.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
            <form onSubmit={handleCalculateEligibility} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div className="input-group-label" style={{ display: 'flex', flexDirection: 'column' }}>
                <label htmlFor="dob-field" style={{ fontSize: '0.75rem' }}>Birthdate</label>
                <input 
                  id="dob-field"
                  type="date" 
                  value={dob} 
                  onChange={(e) => setDob(e.target.value)} 
                  style={{ padding: '0.5rem', fontSize: '0.85rem' }}
                  required
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="input-group-label" style={{ display: 'flex', flexDirection: 'column' }}>
                  <label htmlFor="category-field" style={{ fontSize: '0.75rem' }}>Pool Category</label>
                  <select 
                    id="category-field"
                    value={category} 
                    onChange={(e) => setCategory(e.target.value)}
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 'var(--radius-md)', padding: '0.5rem', color: 'var(--text-main)', fontSize: '0.85rem', outline: 'none' }}
                  >
                    <option value="General">UR (Gen)</option>
                    <option value="OBC">OBC</option>
                    <option value="SC">SC</option>
                    <option value="ST">ST</option>
                    <option value="EWS">EWS</option>
                  </select>
                </div>
                <div className="input-group-label" style={{ display: 'flex', flexDirection: 'column' }}>
                  <label htmlFor="exam-type-field" style={{ fontSize: '0.75rem' }}>Target Exam</label>
                  <select 
                    id="exam-type-field"
                    value={examType} 
                    onChange={(e) => setExamType(e.target.value)}
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 'var(--radius-md)', padding: '0.5rem', color: 'var(--text-main)', fontSize: '0.85rem', outline: 'none' }}
                  >
                    <option value="UPSC">UPSC CSE</option>
                    <option value="SSC-CGL">SSC CGL</option>
                    <option value="IBPS-PO">IBPS PO</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.6rem', fontSize: '0.85rem', fontWeight: 700, marginTop: '0.25rem' }}>
                Verify Profile Limits
              </button>
            </form>

            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px dashed rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '120px' }}>
              {eligibilityResult ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.25rem' }}>{eligibilityResult.isEligible ? '✅' : '❌'}</span>
                    <span style={{ fontWeight: 800, fontSize: '0.95rem', color: eligibilityResult.isEligible ? '#22c55e' : '#f43f5e' }}>
                      {eligibilityResult.isEligible ? 'Profile Eligible' : 'Age Limit Exceeded'}
                    </span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '0.5rem', marginTop: '0.25rem' }}>
                    <div>
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block' }}>Your Age</span>
                      <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>{eligibilityResult.age} Yrs</span>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block' }}>Permitted Range</span>
                      <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>{eligibilityResult.minAge}-{eligibilityResult.maxAge} Yrs</span>
                    </div>
                    <div style={{ gridColumn: 'span 2' }}>
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block' }}>Category Attempts Limit</span>
                      <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--primary)' }}>{eligibilityResult.attemptsLimit}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                  <p style={{ margin: 0 }}>Input birthdate details to fetch eligibility constraints.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 4. PHOTO & SIGNATURE MERGER - Teal Block */}
        <div className="tool-block-card tool-block-teal">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.25rem' }}>📷 Photo-Signature Merger</span>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: 0 }}>
              Merge photo and signature into a single file to satisfy exam specifications.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.01)', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255, 255, 255, 0.04)' }}>
                <label htmlFor="photo-file-input" style={{ display: 'block', fontWeight: 600, fontSize: '0.75rem', marginBottom: '0.35rem' }}>1. Upload Photograph</label>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <input id="photo-file-input" type="file" accept="image/*" onChange={handlePhotoUpload} style={{ fontSize: '0.75rem', width: '100%' }} />
                  {photoPreview && <button className="btn btn-secondary" onClick={handleClearPhoto} style={{ padding: '0.2rem 0.5rem', fontSize: '0.7rem' }}>Clear</button>}
                </div>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.01)', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255, 255, 255, 0.04)' }}>
                <label htmlFor="signature-file-input" style={{ display: 'block', fontWeight: 600, fontSize: '0.75rem', marginBottom: '0.35rem' }}>2. Upload Signature</label>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <input id="signature-file-input" type="file" accept="image/*" onChange={handleSigUpload} style={{ fontSize: '0.75rem', width: '100%' }} />
                  {sigPreview && <button className="btn btn-secondary" onClick={handleClearSig} style={{ padding: '0.2rem 0.5rem', fontSize: '0.7rem' }}>Clear</button>}
                </div>
              </div>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.15)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px dashed rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Canvas Output (350x450px)</span>
              <div style={{ width: '100%', maxHeight: '180px', overflowY: 'auto', background: 'rgba(0,0,0,0.15)', display: 'flex', justifyContent: 'center', padding: '0.5rem', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '0.75rem' }}>
                <canvas ref={canvasRef} style={{ display: 'block', maxWidth: '100%', height: 'auto', borderRadius: '2px' }} />
              </div>
              <button 
                className="btn btn-primary" 
                onClick={handleDownloadMerged} 
                style={{ width: '100%', padding: '0.6rem', fontSize: '0.85rem', fontWeight: 700 }}
                disabled={!photoPreview}
              >
                Download Combined Image
              </button>
            </div>
          </div>
        </div>

        {/* 5. PDF ⇄ JPG CONVERTER - Emerald Block (Full Width on Desktop) */}
        <div className="tool-block-card tool-block-emerald tool-block-full-width">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.25rem' }}>📄 Document PDF ⇄ JPG Converters</span>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: 0 }}>
              Convert registration files client-side. Convert scanned images to PDF, or extract PDF pages as JPGs.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
            
            {/* JPG TO PDF SECTION */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '2rem' }}>
              <h4 style={{ margin: 0, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>🖼️</span> Images to PDF document
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <label htmlFor="pdf-images-input" style={{ display: 'block', fontWeight: 600, fontSize: '0.75rem', marginBottom: '0.35rem' }}>Select JPG / PNG Images</label>
                  <input id="pdf-images-input" type="file" accept="image/*" multiple onChange={handleJpgToPdfUpload} style={{ fontSize: '0.75rem', width: '100%' }} />
                </div>

                {jpgToPdfFiles.length > 0 && (
                  <div style={{ background: 'rgba(0,0,0,0.15)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '0.75rem' }}>Uploaded Files ({jpgToPdfFiles.length})</span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', maxHeight: '140px', overflowY: 'auto', marginBottom: '1rem' }}>
                      {jpgToPdfFiles.map((file, idx) => (
                        <div key={file.id} style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '0.4rem 0.6rem', borderRadius: 'var(--radius-sm)', gap: '0.5rem' }}>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>#{idx+1}</span>
                          <span style={{ fontSize: '0.75rem', flex: 1, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{file.name}</span>
                          <div style={{ display: 'flex', gap: '0.2rem' }}>
                            <button className="btn btn-secondary" onClick={() => handleMoveJpgFile(file.id, -1)} disabled={idx === 0} style={{ padding: '0.15rem 0.35rem', fontSize: '0.65rem' }}>▲</button>
                            <button className="btn btn-secondary" onClick={() => handleMoveJpgFile(file.id, 1)} disabled={idx === jpgToPdfFiles.length - 1} style={{ padding: '0.15rem 0.35rem', fontSize: '0.65rem' }}>▼</button>
                            <button className="btn btn-secondary" onClick={() => handleRemoveJpgFile(file.id)} style={{ padding: '0.15rem 0.35rem', fontSize: '0.65rem', color: '#f43f5e' }}>✕</button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                      <div className="input-group-label" style={{ display: 'flex', flexDirection: 'column' }}>
                        <label htmlFor="orientation-field" style={{ fontSize: '0.7rem' }}>Orientation</label>
                        <select id="orientation-field" value={pdfOrientation} onChange={(e) => setPdfOrientation(e.target.value)} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 'var(--radius-md)', padding: '0.4rem', color: 'var(--text-main)', fontSize: '0.8rem', outline: 'none' }}>
                          <option value="portrait">Portrait</option>
                          <option value="landscape">Landscape</option>
                        </select>
                      </div>
                      <div className="input-group-label" style={{ display: 'flex', flexDirection: 'column' }}>
                        <label htmlFor="margin-field" style={{ fontSize: '0.7rem' }}>Margins</label>
                        <select id="margin-field" value={pdfMargin} onChange={(e) => setPdfMargin(e.target.value)} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 'var(--radius-md)', padding: '0.4rem', color: 'var(--text-main)', fontSize: '0.8rem', outline: 'none' }}>
                          <option value="none">No Margins</option>
                          <option value="small">Small (5mm)</option>
                          <option value="normal">Normal (10mm)</option>
                        </select>
                      </div>
                    </div>

                    <button className="btn btn-primary" onClick={handleConvertJpgToPdf} style={{ width: '100%', padding: '0.6rem', fontSize: '0.85rem', fontWeight: 700 }}>
                      Generate PDF Document
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* PDF TO JPG SECTION */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h4 style={{ margin: 0, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>📄</span> PDF document to JPG extract
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <label htmlFor="jpg-pdf-input" style={{ display: 'block', fontWeight: 600, fontSize: '0.75rem', marginBottom: '0.35rem' }}>Select PDF Document</label>
                  <input id="jpg-pdf-input" type="file" accept="application/pdf" onChange={handlePdfToJpgUpload} style={{ fontSize: '0.75rem', width: '100%' }} />
                </div>

                {pdfToJpgFile && (
                  <div style={{ background: 'rgba(0,0,0,0.15)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', gap: '1rem' }}>
                      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', textOverflow: 'ellipsis', overflow: 'hidden' }}>{pdfToJpgFile.name}</span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{(pdfToJpgFile.size / 1024 / 1024).toFixed(2)} MB</span>
                      </div>
                      <div className="input-group-label" style={{ display: 'flex', flexDirection: 'column', width: '80px' }}>
                        <label htmlFor="quality-field" style={{ fontSize: '0.6rem' }}>Quality</label>
                        <select id="quality-field" value={renderScale} onChange={(e) => setRenderScale(parseFloat(e.target.value))} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 'var(--radius-sm)', padding: '0.2rem', color: 'var(--text-main)', fontSize: '0.75rem', outline: 'none' }}>
                          <option value={1.0}>1x</option>
                          <option value={1.5}>1.5x</option>
                          <option value={2.0}>2x</option>
                        </select>
                      </div>
                    </div>

                    <button 
                      className="btn btn-primary" 
                      onClick={handleConvertPdfToJpg} 
                      disabled={isPdfProcessing}
                      style={{ width: '100%', padding: '0.6rem', fontSize: '0.85rem', fontWeight: 700, marginBottom: '1rem' }}
                    >
                      {isPdfProcessing ? 'Extracting...' : 'Extract & Preview Pages'}
                    </button>

                    {pdfToJpgPages.length > 0 && (
                      <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem' }}>
                        <span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '0.75rem' }}>Extracted Sheets ({pdfToJpgPages.length} of {pdfPageCount})</span>
                        <div className="pdf-pages-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: '0.75rem', maxHeight: '250px', overflowY: 'auto' }}>
                          {pdfToJpgPages.map((page) => (
                            <div key={page.pageNum} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 'var(--radius-sm)', padding: '0.4rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem' }}>
                              <div style={{ width: '100%', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000', borderRadius: '2px', overflow: 'hidden' }}>
                                <img src={page.dataUrl} alt={`Page ${page.pageNum}`} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                              </div>
                              <span style={{ fontSize: '0.7rem', fontWeight: 600 }}>Page {page.pageNum}</span>
                              <button className="btn btn-primary" onClick={() => handleDownloadSingleJpg(page)} style={{ width: '100%', padding: '0.2rem', fontSize: '0.65rem' }}>Download</button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
