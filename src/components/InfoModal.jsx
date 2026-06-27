import React, { useState } from 'react';

export default function InfoModal({ page, onClose }) {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      alert("Please fill out all required fields.");
      return;
    }
    setFormSubmitted(true);
  };

  const mockTicketId = Math.floor(100000 + Math.random() * 900000);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-content glass-card info-modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '650px', width: '90%', maxHeight: '85vh', overflowY: 'auto', textAlign: 'left' }}
      >
        <button className="modal-close-btn" onClick={onClose} aria-label="Close Modal">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {page === 'about' && (
          <div className="info-section">
            <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>🏛️</span>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-0.02em' }}>About SARKARI BABU</h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '1.25rem' }}>
              <strong>SARKARI BABU</strong> is a premium, open-source competitive exam preparation ecosystem designed to help civil service, defense, railway, and banking aspirants crack their goals. Our philosophy is simple: <em>eliminate fluff, maximize facts</em>.
            </p>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '1.25rem' }}>
              Unlike generic portals, SARKARI BABU aggregates real-time press releases and news feeds directly from the Press Information Bureau (PIB) and leading national sources, compiling them into three high-yield points. Combined with a comprehensive 19-module Indian Polity reference, Static GK cheat sheets, and automated day mnemonics, we offer the ultimate resource for revision.
            </p>
            
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginTop: '1.5rem', marginBottom: '0.75rem' }}>Our Core Pillars</h3>
            <ul style={{ paddingLeft: '1.2rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '1.5rem' }}>
              <li style={{ marginBottom: '0.5rem' }}><strong>Concise News</strong>: PIB and Hindu articles boiled down to critical takeaways for UPSC/SSC relevance.</li>
              <li style={{ marginBottom: '0.5rem' }}><strong>Static GK Database</strong>: Structured tables covering Indian Polity, dynasties, physical geography, and general science.</li>
              <li style={{ marginBottom: '0.5rem' }}><strong>Smart Memorization</strong>: Auto-rotating daily facts, schedules, and custom mnemonic memory triggers.</li>
              <li style={{ marginBottom: '0.5rem' }}><strong>AI Learning</strong>: Instant syllabus doubt-solving using Google Gemini Large Language Models.</li>
            </ul>

            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>The Developer</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
              SARKARI BABU is designed, engineered, and maintained by <strong>Souvik Deb</strong>. Our goal is to provide a clean, visual-first dashboard that removes commercial clutter and lets students focus solely on daily milestones.
            </p>
          </div>
        )}

        {page === 'privacy' && (
          <div className="info-section">
            <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>🛡️</span>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-0.02em' }}>Privacy Policy</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>Effective Date: June 28, 2026</p>
            
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '1.25rem' }}>
              At SARKARI BABU, we respect the privacy of our student community. This Privacy Policy documents how we collect, store, and utilize information across our online learning portal.
            </p>

            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginTop: '1.5rem', marginBottom: '0.5rem' }}>1. Information We Collect</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '1.25rem' }}>
              SARKARI BABU is a client-first application. We do not require account registration. Your study statistics (daily streak, read articles list, quiz accuracy, and saved bookmark files) are saved strictly inside your local web browser using <strong>HTML5 Local Storage</strong>. This data is never sent to our servers or shared with any third party.
            </p>

            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginTop: '1.5rem', marginBottom: '0.5rem' }}>2. Google AdSense & Cookies</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '1.25rem' }}>
              We use third-party advertisements (such as Google AdSense) to support and run the platform. Google, as a third-party vendor, uses cookies to serve advertisements on this site.
            </p>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '1.25rem' }}>
              Google's use of advertising cookies enables it and its partners to serve ads based on your visit to this site and/or other sites on the Internet. You can opt-out of personalized advertising by visiting the <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>Google Ad Settings Page</a>.
            </p>

            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginTop: '1.5rem', marginBottom: '0.5rem' }}>3. External Links</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '1.25rem' }}>
              Our portal contains links to external government sites, notifications, and PDF files. We are not responsible for the privacy practices of external domains.
            </p>

            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginTop: '1.5rem', marginBottom: '0.5rem' }}>4. Consent</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
              By using our portal, you hereby consent to our Privacy Policy and agree to its terms. If you have questions regarding this policy, feel free to contact us.
            </p>
          </div>
        )}

        {page === 'contact' && (
          <div className="info-section">
            <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>✉️</span>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.25rem', letterSpacing: '-0.02em' }}>Contact Us</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Have feedback, feature requests, or queries? Drop us a line below.</p>
            
            {formSubmitted ? (
              <div className="checkout-step-success" style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                <div className="success-checkmark-circle animate-checkmark">
                  <svg className="success-check-svg" viewBox="0 0 52 52">
                    <circle className="success-circle" cx="26" cy="26" r="25" fill="none" />
                    <path className="success-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                  </svg>
                </div>
                <h3 style={{ color: '#22c55e', fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Message Received!</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                  Thank you, <strong>{formData.name}</strong>. Your ticket has been logged under ID <strong>#SB-{mockTicketId}</strong>. We will get back to you at <strong>{formData.email}</strong> within 24 hours.
                </p>
                <button className="btn btn-secondary" style={{ width: 'auto', padding: '0.5rem 1.5rem' }} onClick={() => setFormSubmitted(false)}>
                  Submit Another Query
                </button>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="checkout-form contact-form" style={{ marginTop: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="input-group-label" style={{ display: 'flex', flexDirection: 'column' }}>
                    <label htmlFor="contact-name">Name</label>
                    <input 
                      id="contact-name"
                      type="text" 
                      name="name"
                      placeholder="e.g. Souvik" 
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="input-group-label" style={{ display: 'flex', flexDirection: 'column' }}>
                    <label htmlFor="contact-email">Email Address</label>
                    <input 
                      id="contact-email"
                      type="email" 
                      name="email"
                      placeholder="e.g. student@email.com" 
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="input-group-label" style={{ display: 'flex', flexDirection: 'column', marginTop: '1rem' }}>
                  <label htmlFor="contact-subject">Subject</label>
                  <input 
                    id="contact-subject"
                    type="text" 
                    name="subject"
                    placeholder="e.g. Correction in Polity Module" 
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="input-group-label" style={{ display: 'flex', flexDirection: 'column', marginTop: '1rem' }}>
                  <label htmlFor="contact-message">Message</label>
                  <textarea 
                    id="contact-message"
                    name="message"
                    rows="4" 
                    placeholder="Write your feedback or query details here..." 
                    value={formData.message}
                    onChange={handleInputChange}
                    style={{ 
                      width: '100%', 
                      background: 'rgba(255, 255, 255, 0.05)', 
                      border: '1px solid rgba(255, 255, 255, 0.08)', 
                      borderRadius: 'var(--radius-md)', 
                      padding: '0.75rem 1rem', 
                      color: 'var(--text-main)', 
                      outline: 'none', 
                      fontFamily: 'inherit',
                      resize: 'vertical',
                      marginTop: '0.4rem',
                      marginBottom: '1.5rem'
                    }}
                    required
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.85rem', fontWeight: 700 }}>
                  Send Message
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
