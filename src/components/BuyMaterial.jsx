import React, { useState } from 'react';

const products = [
  {
    id: 1,
    title: "Indian Polity Revision Mindmaps (PDF E-Book)",
    category: "Polity",
    price: 99,
    rating: "4.9",
    reviews: "1,240",
    badge: "Best Seller",
    description: "Visualize the entire Indian Constitution with flowcharts. Includes 100+ high-yield tables of articles, parts, and schedules for rapid revision.",
    features: ["Instant PDF Download", "Print-Friendly Layout", "Includes Mnemonic Cheatsheets"],
    pages: "120 Pages",
    fileSize: "8.4 MB"
  },
  {
    id: 2,
    title: "Modern Indian History Chronology & Battles (Handwritten Notes)",
    category: "History",
    price: 149,
    rating: "4.8",
    reviews: "890",
    badge: "Trending",
    description: "Handwritten timeline of the national movement from 1857 to 1947, including comprehensive summaries of all viceroys, governor-generals, and major battles.",
    features: ["High-Resolution Scanning", "Color-Coded Timelines", "Includes 100+ Short PYQs"],
    pages: "165 Pages",
    fileSize: "14.2 MB"
  },
  {
    id: 3,
    title: "General Science Exam-Centric Question Bank (1500+ MCQs)",
    category: "Science",
    price: 199,
    rating: "4.7",
    reviews: "650",
    badge: "Exam Special",
    description: "Exhaustive MCQ bank covering Physics units & laws, Chemistry formulas, and Biology human anatomy/vitamins with detailed step-by-step explanations.",
    features: ["10 Full Mock Worksheets", "Previous Years Questions (PYQs)", "Detailed Explanatory Keys"],
    pages: "220 Pages",
    fileSize: "12.8 MB"
  },
  {
    id: 4,
    title: "Indian Economy & Budgeting Masterclass notes",
    category: "Economy",
    price: 129,
    rating: "4.8",
    reviews: "420",
    badge: "New Release",
    description: "Simplified explanations of monetary policy tools, fiscal dynamics, national income, and a detailed analysis of the Union Budget 2026.",
    features: ["Budget 2026 Key Highlights", "Five-Year Plans Summaries", "Economic Glossary Included"],
    pages: "95 Pages",
    fileSize: "6.7 MB"
  },
  {
    id: 5,
    title: "Geography Map-Pointing & Rivers Workbook (Blank maps + Keys)",
    category: "Geography",
    price: 119,
    rating: "4.9",
    reviews: "540",
    badge: "Interactive",
    description: "Map-pointing guides for Himalayan and Peninsular river basins, soil distribution zones, mineral belts, passes, and seaports of India.",
    features: ["30 High-Res Blank Practice Maps", "Detailed Answer Key Included", "Physiographic Cheat Sheets"],
    pages: "80 Pages",
    fileSize: "18.5 MB"
  },
  {
    id: 6,
    title: "Sarkari Babu All-in-One Super Mock Test Series (50 Full Length)",
    category: "Mock Tests",
    price: 299,
    rating: "4.8",
    reviews: "2,150",
    badge: "Ultimate Bundle",
    description: "50 full-length practice examinations matching the latest 2026 exam patterns for UPSC CSAT, SSC CGL Tier-1, and IBPS PO.",
    features: ["OMR Sheet Printable Templates", "Fully Solved Answer Sheets", "Negative Marking Score Tracker"],
    pages: "50 Test Sheets",
    fileSize: "28.0 MB"
  }
];

export default function BuyMaterial() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCheckout, setActiveCheckout] = useState(null);
  const [checkoutStep, setCheckoutStep] = useState('input'); // 'input', 'processing', 'success'
  const [upiId, setUpiId] = useState('');

  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleOpenCheckout = (product) => {
    setActiveCheckout(product);
    setCheckoutStep('input');
    setUpiId('');
  };

  const handleProcessPayment = (e) => {
    e.preventDefault();
    if (!upiId.trim() || !upiId.includes('@')) {
      alert("Please enter a valid UPI ID (e.g. aspirant@upi)");
      return;
    }
    setCheckoutStep('processing');
    setTimeout(() => {
      setCheckoutStep('success');
    }, 2500);
  };

  const handleCloseCheckout = () => {
    setActiveCheckout(null);
    setCheckoutStep('input');
  };

  const triggerMockDownload = (title) => {
    // Generate a mock download
    const element = document.createElement("a");
    const file = new Blob([`SARKARI BABU - Official Study Material\nProduct: ${title}\nThis is a simulation download. Thank you for your support!`], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${title.replace(/[^a-zA-Z0-9]/g, "_")}_SarkariBabu.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="buy-material-container">
      {/* Header */}
      <div className="page-header">
        <div className="page-title-section">
          <h1>📚 Study Material Store</h1>
          <p>Super-condensed notes, revision mindmaps, and practice worksheets designed specifically for Indian competitive exams.</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="store-filter-bar glass-card">
        <div className="search-box">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="search-icon">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input 
            type="text" 
            placeholder="Search study material, books, test series..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="category-scroll-chips">
          {['All', 'Polity', 'History', 'Science', 'Economy', 'Geography', 'Mock Tests'].map((cat) => (
            <button
              key={cat}
              className={`filter-chip ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="no-results glass-card">
          <span className="no-results-icon">🔍</span>
          <h3>No study materials found</h3>
          <p>Try refining your search keyword or selecting a different category filter.</p>
        </div>
      ) : (
        <div className="products-grid">
          {filteredProducts.map((product) => (
            <div key={product.id} className="product-card glass-card">
              {product.badge && <span className="product-badge">{product.badge}</span>}
              <div className="product-card-header">
                <span className="product-category">{product.category}</span>
                <span className="product-specs">{product.pages} • {product.fileSize}</span>
              </div>
              <h3 className="product-title">{product.title}</h3>
              <p className="product-desc">{product.description}</p>
              
              <ul className="product-features">
                {product.features.map((feat, index) => (
                  <li key={index}>
                    <span className="feature-tick">✓</span> {feat}
                  </li>
                ))}
              </ul>

              <div className="product-card-footer">
                <div className="product-price-section">
                  <span className="price-label">Price</span>
                  <span className="price-value">₹{product.price}</span>
                </div>
                <div className="product-rating-section">
                  <span className="star-rating">★ {product.rating}</span>
                  <span className="reviews-count">({product.reviews})</span>
                </div>
              </div>

              <button className="btn btn-primary buy-btn" onClick={() => handleOpenCheckout(product)}>
                Buy Now
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Checkout Modal */}
      {activeCheckout && (
        <div className="modal-backdrop">
          <div className="modal-content glass-card checkout-modal">
            <button className="modal-close-btn" onClick={handleCloseCheckout} aria-label="Close Checkout">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            {checkoutStep === 'input' && (
              <div className="checkout-step-input">
                <span className="checkout-icon">💳</span>
                <h2>Express UPI Checkout</h2>
                <p className="checkout-subtitle">Secure instant payment via BHIM / PhonePe / GPay</p>
                
                <div className="order-summary-box">
                  <span className="order-summary-title">ORDER SUMMARY:</span>
                  <div className="order-item-row">
                    <span className="item-name">{activeCheckout.title}</span>
                    <span className="item-price">₹{activeCheckout.price}</span>
                  </div>
                  <div className="order-item-row total-row">
                    <span>Total Amount Payable</span>
                    <span>₹{activeCheckout.price}</span>
                  </div>
                </div>

                <form onSubmit={handleProcessPayment} className="checkout-form">
                  <div className="input-group-label">
                    <label htmlFor="upi-id-field">Enter UPI ID</label>
                    <input 
                      id="upi-id-field"
                      type="text" 
                      placeholder="e.g., aspirant@okaxis" 
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="qr-sim-box">
                    <div className="qr-frame">
                      {/* Simulated QR Code using SVG */}
                      <svg viewBox="0 0 100 100" className="mock-qr-svg">
                        <rect x="10" y="10" width="80" height="80" fill="none" stroke="currentColor" strokeWidth="2" />
                        {/* Top-Left Corner */}
                        <rect x="15" y="15" width="20" height="20" fill="currentColor" />
                        <rect x="18" y="18" width="14" height="14" fill="#1e293b" />
                        <rect x="22" y="22" width="6" height="6" fill="currentColor" />
                        {/* Top-Right Corner */}
                        <rect x="65" y="15" width="20" height="20" fill="currentColor" />
                        <rect x="68" y="18" width="14" height="14" fill="#1e293b" />
                        <rect x="72" y="22" width="6" height="6" fill="currentColor" />
                        {/* Bottom-Left Corner */}
                        <rect x="15" y="65" width="20" height="20" fill="currentColor" />
                        <rect x="18" y="68" width="14" height="14" fill="#1e293b" />
                        <rect x="22" y="72" width="6" height="6" fill="currentColor" />
                        {/* Random QR blocks */}
                        <rect x="42" y="20" width="10" height="10" fill="currentColor" />
                        <rect x="50" y="42" width="12" height="6" fill="currentColor" />
                        <rect x="30" y="48" width="8" height="12" fill="currentColor" />
                        <rect x="60" y="55" width="10" height="15" fill="currentColor" />
                        <rect x="45" y="68" width="15" height="10" fill="currentColor" />
                      </svg>
                      <div className="qr-scan-line"></div>
                    </div>
                    <p className="qr-caption">Scan QR with any UPI app to simulate payment directly</p>
                  </div>

                  <button type="submit" className="btn btn-primary pay-now-submit-btn">
                    Verify & Pay ₹{activeCheckout.price}
                  </button>
                </form>
              </div>
            )}

            {checkoutStep === 'processing' && (
              <div className="checkout-step-processing">
                <div className="payment-spinner-container">
                  <div className="payment-spinner"></div>
                </div>
                <h2>Awaiting Payment Confirmation...</h2>
                <p>Verifying transaction with your bank. Do not close this modal or refresh the page.</p>
                <div className="processing-bar-outer">
                  <div className="processing-bar-inner"></div>
                </div>
              </div>
            )}

            {checkoutStep === 'success' && (
              <div className="checkout-step-success">
                <div className="success-checkmark-circle animate-checkmark">
                  <svg className="success-check-svg" viewBox="0 0 52 52">
                    <circle className="success-circle" cx="26" cy="26" r="25" fill="none" />
                    <path className="success-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                  </svg>
                </div>
                <h2>Payment Successful!</h2>
                <p className="success-msg">Your transaction was verified successfully. The PDF revision notes are ready for download.</p>
                
                <div className="download-box glass-card">
                  <span className="doc-icon">📄</span>
                  <div className="doc-details">
                    <span className="doc-title">{activeCheckout.title}</span>
                    <span className="doc-meta">{activeCheckout.pages} • PDF format</span>
                  </div>
                  <button className="btn btn-primary download-action-btn" onClick={() => triggerMockDownload(activeCheckout.title)}>
                    Download Now
                  </button>
                </div>

                <button className="btn btn-secondary done-btn" onClick={handleCloseCheckout}>
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
