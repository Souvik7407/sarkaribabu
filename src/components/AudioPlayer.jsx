import React, { useState, useEffect, useRef } from 'react';

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [mode, setMode] = useState(() => localStorage.getItem('audio_mode') || 'lofi');
  const [isMuted, setIsMuted] = useState(() => localStorage.getItem('audio_muted') === 'true');
  const [showTooltip, setShowTooltip] = useState(false);

  const audioRef = useRef(null);
  const audioContextRef = useRef(null);
  const synthIntervalRef = useRef(null);
  const activeOscillatorsRef = useRef([]);

  // Stable royalty-free chill lofi instrumental track
  const LOFI_URL = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3';

  // Initialize audio element
  useEffect(() => {
    const audio = new Audio(LOFI_URL);
    audio.loop = true;
    audio.volume = 0.25;
    audioRef.current = audio;

    // Handle potential stream errors gracefully
    audio.addEventListener('error', (e) => {
      console.warn("Lofi stream failed to load, switching to local Synthesizer.", e);
      setMode('synth');
    });

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  // Sync state with storage
  useEffect(() => {
    localStorage.setItem('audio_mode', mode);
  }, [mode]);

  useEffect(() => {
    localStorage.setItem('audio_muted', isMuted.toString());
  }, [isMuted]);

  // Web Audio API Synthesizer: Soothing, focus-boosting ambient chord progression
  const stopSynthesizer = () => {
    if (synthIntervalRef.current) {
      clearInterval(synthIntervalRef.current);
      synthIntervalRef.current = null;
    }
    activeOscillatorsRef.current.forEach(osc => {
      try { osc.stop(); } catch (e) {}
    });
    activeOscillatorsRef.current = [];
  };

  const startSynthesizer = () => {
    stopSynthesizer();

    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    const ctx = audioContextRef.current;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const chords = [
      [130.81, 164.81, 196.00, 246.94], // Cmaj7 (C3, E3, G3, B3) - Warm & hopeful
      [174.61, 220.00, 261.63, 329.63], // Fmaj7 (F3, A3, C4, E4) - Soft lift
      [220.00, 261.63, 329.63, 392.00], // Am7 (A3, C4, E4, G4) - Deep focus
      [196.00, 246.94, 293.66, 392.00]  // G6 (G3, B3, D4, G4) - Resolving transition
    ];
    let chordIndex = 0;

    const playNextChord = () => {
      const now = ctx.currentTime;
      const frequencies = chords[chordIndex];
      chordIndex = (chordIndex + 1) % chords.length;

      // Gentle lowpass filter to remove sharp frequencies
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(500, now);
      filter.Q.setValueAtTime(1, now);
      filter.connect(ctx.destination);

      frequencies.forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine'; // Pure tones for a soothing bell-like sound
        osc.frequency.setValueAtTime(freq, now);

        // Long ambient attack and decay envelope
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.02, now + 1.8); // Very soft volume
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 5.8);

        osc.connect(gain);
        gain.connect(filter);

        osc.start(now);
        osc.stop(now + 6.0);

        activeOscillatorsRef.current.push(osc);
      });
    };

    playNextChord();
    synthIntervalRef.current = setInterval(playNextChord, 5500);
  };

  // Main control play/pause function
  const playAudio = () => {
    if (isMuted) return;

    if (mode === 'lofi') {
      stopSynthesizer();
      if (audioRef.current) {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(err => {
          console.warn("Lofi play blocked, falling back to synth.", err);
          setMode('synth');
        });
      }
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      try {
        startSynthesizer();
        setIsPlaying(true);
      } catch (err) {
        console.error("Synthesizer failed to start.", err);
      }
    }
  };

  const pauseAudio = () => {
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
    }
    stopSynthesizer();
  };

  // Handle mode switches
  useEffect(() => {
    if (isPlaying) {
      playAudio();
    }
  }, [mode]);

  // Autoplay handler on first document interaction
  useEffect(() => {
    if (isMuted) return;

    const handleFirstInteraction = () => {
      // Small timeout to guarantee DOM state completes
      setTimeout(() => {
        if (!isPlaying && !isMuted) {
          playAudio();
          // Display welcoming tooltip briefly
          setShowTooltip(true);
          setTimeout(() => setShowTooltip(false), 5000);
        }
      }, 100);

      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };

    window.addEventListener('click', handleFirstInteraction);
    window.addEventListener('keydown', handleFirstInteraction);
    window.addEventListener('touchstart', handleFirstInteraction);

    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, [isMuted, isPlaying]);

  const togglePlayPause = () => {
    if (isPlaying) {
      pauseAudio();
    } else {
      setIsMuted(false);
      // Play immediately
      setTimeout(() => {
        if (mode === 'lofi') {
          stopSynthesizer();
          audioRef.current.play().then(() => setIsPlaying(true));
        } else {
          startSynthesizer();
          setIsPlaying(true);
        }
      }, 50);
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      togglePlayPause();
    } else {
      setIsMuted(true);
      pauseAudio();
    }
  };

  return (
    <div className="audio-player-widget glass-card">
      <div className="audio-controls-row">
        {/* Play/Pause Button */}
        <button 
          className={`audio-action-btn play-pause-btn ${isPlaying ? 'playing' : ''}`}
          onClick={togglePlayPause}
          title={isPlaying ? "Pause Focus Music" : "Play Focus Music"}
        >
          {isPlaying ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <rect x="4" y="4" width="6" height="16" rx="1" />
              <rect x="14" y="4" width="6" height="16" rx="1" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        {/* Live Audio Visualizer Bars */}
        <div className={`audio-visualizer ${isPlaying ? 'active' : ''}`}>
          <div className="visualizer-bar bar-1"></div>
          <div className="visualizer-bar bar-2"></div>
          <div className="visualizer-bar bar-3"></div>
          <div className="visualizer-bar bar-4"></div>
        </div>

        {/* Music Source Select Toggle */}
        <div className="audio-mode-selector">
          <button 
            className={`mode-toggle-btn ${mode === 'lofi' ? 'selected' : ''}`}
            onClick={() => setMode('lofi')}
            title="Lofi Radio"
            disabled={isMuted}
          >
            Lofi
          </button>
          <button 
            className={`mode-toggle-btn ${mode === 'synth' ? 'selected' : ''}`}
            onClick={() => setMode('synth')}
            title="Soothing Ambient Synth Pad (Offline)"
            disabled={isMuted}
          >
            Synth
          </button>
        </div>

        {/* Mute/Speaker Icon */}
        <button 
          className={`audio-action-btn mute-btn ${isMuted ? 'muted' : ''}`}
          onClick={toggleMute}
          title={isMuted ? "Unmute Ambient Music" : "Mute Ambient Music"}
        >
          {isMuted ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 5L6 9H2v6h4l5 4V5z" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 5L6 9H2v6h4l5 4V5z" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
            </svg>
          )}
        </button>
      </div>

      {/* Autoplay welcome tooltip */}
      {showTooltip && (
        <div className="audio-welcome-tooltip">
          <span>🎵 Ambient study music playing. Pause or mute here!</span>
        </div>
      )}
    </div>
  );
}
