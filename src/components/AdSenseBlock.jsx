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

  return null;
}
