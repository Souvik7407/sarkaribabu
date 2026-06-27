import React from 'react';

export default function BuyMaterial() {
  return (
    <div className="buy-material-container">
      <div className="page-header" style={{ textAlign: 'center', padding: '5rem 2rem' }}>
        <div className="page-title-section">
          <span className="coming-soon-emoji" style={{ fontSize: '4.5rem', display: 'block', marginBottom: '1.5rem', filter: 'drop-shadow(0 0 15px rgba(var(--primary-rgb), 0.2))' }}>📚</span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-0.02em' }}>Study Store</h1>
          <p style={{ maxWidth: '580px', margin: '0 auto 2.5rem auto', color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: '1.6' }}>
            Our comprehensive PDF e-books, handwritten topper revision notes, and exam practice papers are currently under preparation. Check back soon for high-yield study resources!
          </p>
          <div className="coming-soon-indicator" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.06)', padding: '0.5rem 1.25rem', borderRadius: '50px' }}>
            <span style={{ width: '8px', height: '8px', background: '#22c55e', borderRadius: '50%', display: 'inline-block', boxShadow: '0 0 8px #22c55e' }}></span>
            <span style={{ fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-main)' }}>Under Preparation</span>
          </div>
        </div>
      </div>
    </div>
  );
}
