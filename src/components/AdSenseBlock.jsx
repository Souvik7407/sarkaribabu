import React, { useEffect } from 'react';

// Developer Configuration
// Set this to true and enter your publisher ID below to activate real Google Adsense ads!
const IS_LIVE_ADSENSE_ACTIVE = false; 
const ADSENSE_PUBLISHER_ID = "ca-pub-XXXXXXXXXXXXXXXX"; // e.g., ca-pub-1234567890123456

export default function AdSenseBlock({ slotId, format = "auto", responsive = "true", adStyle = {} }) {
  
  useEffect(() => {
    if (IS_LIVE_ADSENSE_ACTIVE) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.warn("AdSense push error: ", e);
      }
    }
  }, []);

  if (IS_LIVE_ADSENSE_ACTIVE) {
    return (
      <div className="adsense-outer-container" style={{ margin: '1.5rem 0', minHeight: '90px', background: 'transparent' }}>
        <ins className="adsbygoogle"
             style={{ display: 'block', ...adStyle }}
             data-ad-client={ADSENSE_PUBLISHER_ID}
             data-ad-slot={slotId}
             data-ad-format={format}
             data-full-width-responsive={responsive}></ins>
      </div>
    );
  }

  // Pre-configured premium educational mock ads that rotate randomly
  const mockAds = [
    {
      sponsor: "SARKARI BABU PREMIUM",
      headline: "Crack UPSC & State PSC 2026",
      desc: "Get 90% off on all printed mindmaps and worksheets this week. Use Code: ASPIRANT90",
      cta: "Grab E-books Now",
      url: "#buy-material",
      accent: "var(--primary)"
    },
    {
      sponsor: "TELEGRAM ALERTS",
      headline: "Join Official Telegram Group",
      desc: "150,000+ serious aspirants. Daily quiz updates, exam notifications, and free revision PDFs.",
      cta: "Join Group",
      url: "https://t.me/sarkaribabu",
      accent: "#24A1DE"
    },
    {
      sponsor: "EXAM PRACTICE",
      headline: "SSC CGL All-India Free Live Mock",
      desc: "Evaluate your rank amongst 50,000 live participants. Full performance analytics dashboard.",
      cta: "Register Free",
      url: "#quiz-zone",
      accent: "#e11d48"
    }
  ];

  // Pick a mock ad based on the slotId (or random selection)
  const adIndex = Math.abs(parseInt(slotId || "0")) % mockAds.length;
  const activeAd = mockAds[adIndex];

  return (
    <div className="adsense-mock-container glass-card" style={{ borderLeft: `4px solid ${activeAd.accent}` }}>
      <div className="ad-sponsor-row">
        <span className="ad-sponsor-label">Sponsored</span>
        <span className="ad-sponsor-name">{activeAd.sponsor}</span>
      </div>
      <div className="ad-content-row">
        <div className="ad-text-col">
          <h4 className="ad-headline">{activeAd.headline}</h4>
          <p className="ad-description">{activeAd.desc}</p>
        </div>
        <a href={activeAd.url} className="ad-cta-btn" style={{ background: activeAd.accent }}>
          {activeAd.cta}
        </a>
      </div>
    </div>
  );
}
