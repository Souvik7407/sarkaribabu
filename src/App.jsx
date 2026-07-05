import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import CurrentAffairs from './components/CurrentAffairs';
import OneLiners from './components/OneLiners';
import StaticGK from './components/StaticGK';
import QuizZone from './components/QuizZone';
import Bookmarks from './components/Bookmarks';
import Criteria from './components/Criteria';
import AITutor from './components/AITutor';
import BuyMaterial from './components/BuyMaterial';
import InfoModal from './components/InfoModal';
import ExamTools from './components/ExamTools';

// Import curated database
import { initialCurrentAffairs, staticGKData, initialQuizzes, generateDailyNewsForDate, examCriteriaData } from './data/db';

// Live Open-Source News Aggregator Scraper
const parseLiveArticles = async () => {
  const articles = [];
  const todayStr = new Date().toISOString().slice(0, 10);

  // Helper to format date
  const formatDate = (dateStr) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return todayStr;
      return d.toISOString().slice(0, 10);
    } catch {
      return todayStr;
    }
  };

  // Helper to determine category based on keywords
  const determineCategory = (title, desc) => {
    const text = `${title} ${desc}`.toLowerCase();
    if (/\b(medal|olympic|bcci|cricket|sports?|cup|trophy|championship|player|wins|tournament|football|hockey|athletics|badminton)\b/.test(text)) {
      return "sports";
    }
    if (/\b(nasa|space|satellite|isro|science|technology|quantum|hydrogen|electrolyser|research|ai|artificial|tech|dna|gene|physics|chemistry|biology|discovery|scientific)\b/.test(text)) {
      return "science";
    }
    return "politics";
  };

  // Helper to clean HTML and extract exam-centric takeaways
  const extractTakeaways = (htmlText, category) => {
    if (!htmlText) return [];
    const cleaned = htmlText.replace(/<[^>]*>/g, '').trim();
    const sentences = cleaned
      .split(/[.!?]+/)
      .map(s => s.trim())
      .filter(s => s.length > 15 && !s.toLowerCase().includes("read more") && !s.toLowerCase().includes("copyright"));
    
    const takeaways = sentences.slice(0, 3);
    
    // Add custom exam relevance bullet point
    if (category === "politics") {
      takeaways.push("UPSC & State PSC Relevance: Essential study update on national policy frameworks, governance amendments, and constitutional implications.");
    } else if (category === "science") {
      takeaways.push("UPSC & SSC Relevance: Key advancements in technology, space exploration vectors, and environmental conservation policies.");
    } else {
      takeaways.push("SSC & Railways Relevance: Direct factual questions on trophies, awards, venues, and record-breaking sports personalities are common.");
    }

    return takeaways;
  };

  // 1. PIB RSS
  try {
    const res = await fetch("https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fpib.gov.in%2FRssMain.aspx%3FModId%3D6");
    if (res.ok) {
      const data = await res.json();
      if (data.status === 'ok' && data.items) {
        data.items.slice(0, 3).forEach((item) => {
          const category = determineCategory(item.title, item.description);
          const date = formatDate(item.pubDate);
          const id = `live-pib-${item.guid || item.link.split('PRID=')[1] || Math.random()}`;
          const takeaways = extractTakeaways(item.description || item.content, category);
          
          articles.push({
            id,
            title: item.title,
            date,
            category,
            tags: ["PIB", "Govt Policy", "Official"],
            readTime: "2 mins",
            source: "Press Information Bureau (PIB)",
            oneLiner: item.title,
            summary: takeaways.length > 0 ? takeaways : [item.title, "Official Government release of national significance."],
            examTarget: category === "politics" ? ["UPSC", "State PSC", "SSC"] : ["SSC", "Railways"]
          });
        });
      }
    }
  } catch (err) {
    console.warn("PIB Ingestion error:", err);
  }

  // 2. The Hindu National
  try {
    const res = await fetch("https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fwww.thehindu.com%2Fnews%2Fnational%2Ffeeder%2Fdefault.rss");
    if (res.ok) {
      const data = await res.json();
      if (data.status === 'ok' && data.items) {
        data.items.slice(0, 3).forEach((item) => {
          const category = determineCategory(item.title, item.description);
          const date = formatDate(item.pubDate);
          const id = `live-thehindu-${item.guid || Math.random()}`;
          const takeaways = extractTakeaways(item.description || item.content, category);

          articles.push({
            id,
            title: item.title,
            date,
            category,
            tags: ["The Hindu", "National News", "Analysis"],
            readTime: "3 mins",
            source: "The Hindu Newspaper",
            oneLiner: item.title,
            summary: takeaways.length > 0 ? takeaways : [item.title, "Analyzed national event from Indian mainstream daily."],
            examTarget: ["UPSC", "State PSC"]
          });
        });
      }
    }
  } catch (err) {
    console.warn("The Hindu Ingestion error:", err);
  }

  // 3. DD News
  try {
    const res = await fetch("https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fddnews.gov.in%2Ffeed%2F");
    if (res.ok) {
      const data = await res.json();
      if (data.status === 'ok' && data.items) {
        data.items.slice(0, 3).forEach((item) => {
          const category = determineCategory(item.title, item.description);
          const date = formatDate(item.pubDate);
          const id = `live-ddnews-${item.guid || Math.random()}`;
          const takeaways = extractTakeaways(item.description || item.content, category);

          articles.push({
            id,
            title: item.title,
            date,
            category,
            tags: ["DD News", "National Broadcast", "Govt"],
            readTime: "2 mins",
            source: "DD News Official",
            oneLiner: item.title,
            summary: takeaways.length > 0 ? takeaways : [item.title, "Official national broadcast updates."],
            examTarget: ["SSC", "Railways", "Defence"]
          });
        });
      }
    }
  } catch (err) {
    console.warn("DD News Ingestion error:", err);
  }

  // 4. SpaceNews (Spaceflight News API)
  try {
    const res = await fetch("https://api.spaceflightnewsapi.net/v4/articles/?limit=3");
    if (res.ok) {
      const data = await res.json();
      if (data.results) {
        data.results.forEach((item) => {
          const date = formatDate(item.published_at);
          const id = `live-space-${item.id}`;
          const takeaways = extractTakeaways(item.summary, "science");

          articles.push({
            id,
            title: item.title,
            date,
            category: "science",
            tags: ["Space", "Tech Science", "International"],
            readTime: "2 mins",
            source: item.news_site || "SpaceNews",
            oneLiner: item.title,
            summary: takeaways,
            examTarget: ["UPSC", "SSC", "Banking"]
          });
        });
      }
    }
  } catch (err) {
    console.warn("SpaceNews Ingestion error:", err);
  }

  return articles;
};

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState('dashboard');
  const [modalPage, setModalPage] = useState(null); // 'about', 'privacy', 'contact', or null
  
  // Theme State
  const [isLightTheme, setIsLightTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'light' : true;
  });

  // Exam Selection
  const [selectedExam, setSelectedExam] = useState('All');

  // Study Progress States (Synced with LocalStorage)
  const [bookmarks, setBookmarks] = useState(() => {
    const saved = localStorage.getItem('bookmarks');
    return saved ? JSON.parse(saved) : [];
  });

  const [readArticles, setReadArticles] = useState(() => {
    const saved = localStorage.getItem('readArticles');
    return saved ? JSON.parse(saved) : [];
  });

  const [quizScore, setQuizScore] = useState(() => {
    const saved = localStorage.getItem('quizScore');
    return saved ? parseInt(saved, 10) : 75; // Initial mock score accuracy
  });

  const [streak, setStreak] = useState(() => {
    const saved = localStorage.getItem('streak');
    return saved ? parseInt(saved, 10) : 3; // Initial mock streak
  });

  // Current affairs state (to allow dynamic ingestion mock)
  const [currentAffairs, setCurrentAffairs] = useState(() => {
    const saved = localStorage.getItem('currentAffairs');
    return saved ? JSON.parse(saved) : initialCurrentAffairs;
  });

  const [isScraping, setIsScraping] = useState(false);
  const [toast, setToast] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Prepend daily news if not already present in currentAffairs database
  useEffect(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const todayStr = `${yyyy}-${mm}-${dd}`;

    const dailyIds = [
      `ca-daily-politics-${todayStr}`,
      `ca-daily-science-${todayStr}`,
      `ca-daily-sports-${todayStr}`
    ];

    const hasTodayNews = currentAffairs.some(item => dailyIds.includes(item.id));
    if (!hasTodayNews) {
      const todayNews = generateDailyNewsForDate(today);
      setCurrentAffairs(prev => {
        if (prev.some(item => dailyIds.includes(item.id))) {
          return prev;
        }
        return [...todayNews, ...prev];
      });
    }
  }, [currentAffairs]);

  // Silently ingest live news feeds on initial mount
  useEffect(() => {
    const ingestOnMount = async () => {
      try {
        const liveArticles = await parseLiveArticles();
        if (liveArticles.length > 0) {
          setCurrentAffairs(prev => {
            const filteredNew = liveArticles.filter(newItem => 
              !prev.some(existingItem => existingItem.id === newItem.id)
            );
            if (filteredNew.length === 0) return prev;
            return [...filteredNew, ...prev];
          });
        }
      } catch (err) {
        console.warn("Silent mount ingestion failed:", err);
      }
    };
    ingestOnMount();
  }, []);

  // Sync theme with body class
  useEffect(() => {
    if (isLightTheme) {
      document.body.classList.add('light-theme');
      localStorage.setItem('theme', 'light');
    } else {
      document.body.classList.remove('light-theme');
      localStorage.setItem('theme', 'dark');
    }
  }, [isLightTheme]);

  // Sync states to localstorage
  useEffect(() => {
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    localStorage.setItem('readArticles', JSON.stringify(readArticles));
  }, [readArticles]);

  useEffect(() => {
    localStorage.setItem('currentAffairs', JSON.stringify(currentAffairs));
  }, [currentAffairs]);

  // Show temporary toast message helper
  const showToast = (message) => {
    setToast(message);
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Toggle Bookmark
  const handleToggleBookmark = (id) => {
    const isSaved = bookmarks.includes(id);
    if (isSaved) {
      setBookmarks(prev => prev.filter(item => item !== id));
      showToast("Item removed from bookmarks");
    } else {
      setBookmarks(prev => [...prev, id]);
      showToast("Saved to Bookmarks successfully!");
    }
  };

  // Toggle Read checkbox
  const handleToggleRead = (id) => {
    const isCompleted = readArticles.includes(id);
    if (isCompleted) {
      setReadArticles(prev => prev.filter(item => item !== id));
    } else {
      setReadArticles(prev => [...prev, id]);
      showToast("Marked as Read! Progress updated.");
    }
  };

  // Update quiz accuracy
  const handleUpdateQuizStats = (accuracy) => {
    setQuizScore(accuracy);
    localStorage.setItem('quizScore', accuracy.toString());
    // Also increment study streak
    setStreak(prev => {
      const next = prev + 1;
      localStorage.setItem('streak', next.toString());
      return next;
    });
    showToast(`Quiz completed! Accuracy: ${accuracy}%. Streak increased! 🔥`);
  };

  // Ingestion Scraper Simulator
  const handleTriggerScraper = async () => {
    if (isScraping) return;
    setIsScraping(true);

    try {
      const liveArticles = await parseLiveArticles();
      
      if (liveArticles.length > 0) {
        // Filter out articles that have already been ingested
        const filteredNew = liveArticles.filter(newItem => 
          !currentAffairs.some(existingItem => existingItem.id === newItem.id)
        );

        if (filteredNew.length === 0) {
          showToast("Feed is already up to date with the latest live portals!");
        } else {
          setCurrentAffairs(prev => [...filteredNew, ...prev]);
          showToast(`Ingested ${filteredNew.length} new live articles from PIB, DD News, The Hindu & SpaceNews!`);
        }
      } else {
        // Fallback to high-yield local templates if offline or API is blocked
        const fallbackIds = ['ca-ingest-1', 'ca-ingest-2'];
        const hasIngested = currentAffairs.some(item => fallbackIds.includes(item.id));
        
        if (hasIngested) {
          showToast("Feed is up to date (Offline backup already loaded).");
        } else {
          const fallbacks = [
            {
              id: "ca-ingest-1",
              title: "Union Cabinet Approves National Green Hydrogen Mission Amendments",
              date: "2026-06-23",
              category: "science",
              tags: ["Green Energy", "Hydrogen", "PIB", "Cabinet"],
              readTime: "2 mins",
              source: "Press Information Bureau (PIB)",
              oneLiner: "The Cabinet modified the National Green Hydrogen Mission to add incentives for local electrolyser production hubs.",
              summary: [
                "New subsidies approved for setting up green hydrogen electrolyser plants in special industrial zones.",
                "Aims to make India a global export hub for green energy by 2030, targeting 5 MMT annual capacity.",
                "Establishes a joint taskforce with the Ministry of Power for standardizing safety protocols in hydrogen transport.",
                "UPSC Relevance: Critical updates to national renewable energy schemes and climate action pillars."
              ],
              examTarget: ["UPSC", "State PSC"]
            },
            {
              id: "ca-ingest-2",
              title: "BCCI Announces India Squad for Asia Cup 2026 Tournament",
              date: "2026-06-23",
              category: "sports",
              tags: ["Cricket", "BCCI", "Asia Cup", "Sports"],
              readTime: "1 min",
              source: "Sportstar News",
              oneLiner: "BCCI has announced the 15-member Indian cricket team squad for the upcoming Asia Cup 2026 in Sri Lanka.",
              summary: [
                "The squad will be led by Captain Rohit Sharma, with Hardik Pandya named as Vice-Captain.",
                "Three new young players from domestic Ranji Trophy matches have been drafted into the team.",
                "The tournament is scheduled to take place in Colombo and Kandy starting August 15, 2026.",
                "SSC CGL/CHSL Relevance: Venue details (Sri Lanka), captaincy roles, and debut players are highly tested facts."
              ],
              examTarget: ["SSC"]
            }
          ];
          setCurrentAffairs(prev => [...fallbacks, ...prev]);
          showToast("Ingested 2 new offline articles from PIB & Sportstar!");
        }
      }
    } catch (err) {
      console.error("Error during scraping:", err);
      showToast("Scraper error. Loaded offline templates.");
    } finally {
      setIsScraping(false);
    }
  };

  const currentStats = {
    streak,
    readArticlesCount: readArticles.length,
    quizScore,
    bookmarksCount: bookmarks.length
  };

  // Render active tab views
  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard 
            selectedExam={selectedExam}
            setSelectedExam={setSelectedExam}
            stats={currentStats}
            onTriggerScraper={handleTriggerScraper}
            isScraping={isScraping}
            setActiveTab={setActiveTab}
          />
        );
      case 'current-affairs':
        return (
          <CurrentAffairs 
            currentAffairs={currentAffairs}
            bookmarks={bookmarks}
            onToggleBookmark={handleToggleBookmark}
            readArticles={readArticles}
            onToggleRead={handleToggleRead}
            selectedExam={selectedExam}
          />
        );
      case 'one-liners':
        return (
          <OneLiners 
            currentAffairs={currentAffairs}
            bookmarks={bookmarks}
            onToggleBookmark={handleToggleBookmark}
          />
        );
      case 'static-gk':
        return (
          <StaticGK 
            staticGK={staticGKData}
            bookmarks={bookmarks}
            onToggleBookmark={handleToggleBookmark}
          />
        );
      case 'quiz-zone':
        return (
          <QuizZone 
            quizzes={initialQuizzes}
            onUpdateQuizStats={handleUpdateQuizStats}
          />
        );
      case 'bookmarks':
        return (
          <Bookmarks 
            currentAffairs={currentAffairs}
            staticGK={staticGKData}
            bookmarks={bookmarks}
            onToggleBookmark={handleToggleBookmark}
          />
        );
      case 'criteria':
        return (
          <Criteria 
            examCriteria={examCriteriaData}
          />
        );
      case 'ai-tutor':
        return (
          <AITutor />
        );
      case 'buy-material':
        return (
          <BuyMaterial />
        );
      case 'exam-tools':
        return (
          <ExamTools />
        );
      default:
        return <div>Tab not found</div>;
    }
  };

  return (
    <div className="app-container">
      {/* Mobile Header Bar */}
      <header className="mobile-header">
        <button className="mobile-menu-btn" onClick={() => setIsSidebarOpen(true)} aria-label="Open Menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
        <div className="mobile-brand">
          <img src="/logo.png" alt="Logo" className="mobile-logo-img" />
          <span className="mobile-brand-title"><span className="brand-orange">SARKARI</span> <span className="brand-green">BABU</span></span>
        </div>
        <button className="mobile-theme-btn" onClick={() => setIsLightTheme(prev => !prev)} aria-label="Toggle Theme">
          {isLightTheme ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
            </svg>
          )}
        </button>
      </header>

      {/* Navigation Sidebar */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        stats={currentStats}
        isLightTheme={isLightTheme}
        toggleTheme={() => setIsLightTheme(prev => !prev)}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />



      {/* Main Content Pane */}
      <main className="main-content">
        <div className="telegram-top-banner">
          <span className="telegram-banner-text">📢 Join our Telegram Channel for daily current affairs PDFs and exam updates!</span>
          <a href="https://t.me/sarkaribabuprep" target="_blank" rel="noopener noreferrer" className="telegram-banner-link">
            Join Channel
          </a>
        </div>
        {renderTabContent()}
        <footer className="app-footer">
          <div className="footer-content">
            <div className="footer-brand-section">
              <div className="footer-brand">
                <img src="/logo.png" alt="SARKARI BABU Logo" className="footer-logo-img" />
                <span><span className="brand-orange">SARKARI</span> <span className="brand-green">BABU</span></span>
              </div>
              <p className="footer-tagline">High-yield revision summaries stripped of fluff, calibrated for competitive exams (UPSC, SSC, Banking, Railways, Defence, State PSC).</p>
              
              <div className="footer-telegram-section">
                <a href="https://t.me/sarkaribabuprep" target="_blank" rel="noopener noreferrer" className="footer-telegram-btn">
                  <svg className="telegram-icon" viewBox="0 0 24 24" width="18" height="18">
                    <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.11.02-1.93 1.23-5.46 3.62-.51.35-.98.53-1.39.51-.46-.01-1.35-.26-2.01-.48-.81-.27-1.46-.42-1.4-.88.03-.24.37-.49 1.02-.75 3.99-1.74 6.66-2.88 7.99-3.44 3.81-1.58 4.6-.1.15z" />
                  </svg>
                  <span>Join Our Telegram Channel</span>
                </a>
              </div>
            </div>
            
            <div className="footer-links-grid">
              <div className="footer-links-col">
                <h4>Portal Modules</h4>
                <ul>
                  <li><a href="#dashboard" onClick={(e) => { e.preventDefault(); setActiveTab('dashboard'); }}>Dashboard</a></li>
                  <li><a href="#current-affairs" onClick={(e) => { e.preventDefault(); setActiveTab('current-affairs'); }}>Current Affairs</a></li>
                  <li><a href="#one-liners" onClick={(e) => { e.preventDefault(); setActiveTab('one-liners'); }}>Fast One-Liners</a></li>
                  <li><a href="#static-gk" onClick={(e) => { e.preventDefault(); setActiveTab('static-gk'); }}>Static GK Syllabus</a></li>
                  <li><a href="#criteria" onClick={(e) => { e.preventDefault(); setActiveTab('criteria'); }}>Exam Criteria</a></li>
                  <li><a href="#buy-material" onClick={(e) => { e.preventDefault(); setActiveTab('buy-material'); }}>Buy Study Material</a></li>
                </ul>
              </div>
              
              <div className="footer-links-col">
                <h4>Practice & Review</h4>
                <ul>
                  <li><a href="#quiz-zone" onClick={(e) => { e.preventDefault(); setActiveTab('quiz-zone'); }}>Quiz Zone</a></li>
                  <li><a href="#bookmarks" onClick={(e) => { e.preventDefault(); setActiveTab('bookmarks'); }}>Bookmarks & Saved</a></li>
                  <li><a href="#streak" onClick={(e) => { e.preventDefault(); setActiveTab('dashboard'); }}>Streak Calendar</a></li>
                  <li><a href="#exam-tools" onClick={(e) => { e.preventDefault(); setActiveTab('exam-tools'); }}>Aspirant Tools</a></li>
                </ul>
              </div>

              <div className="footer-links-col">
                <h4>Legal & Support</h4>
                <ul>
                  <li><a href="#about" onClick={(e) => { e.preventDefault(); setModalPage('about'); }}>About Us</a></li>
                  <li><a href="#privacy" onClick={(e) => { e.preventDefault(); setModalPage('privacy'); }}>Privacy Policy</a></li>
                  <li><a href="#contact" onClick={(e) => { e.preventDefault(); setModalPage('contact'); }}>Contact Us</a></li>
                </ul>
              </div>

              <div className="footer-links-col">
                <h4>Development</h4>
                <ul>
                  <li><span className="footer-meta-item">Developer: <strong>Souvik Deb</strong></span></li>
                  <li><span className="footer-meta-item">Build Version: <strong>v1.2.4-stable</strong></span></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} SARKARI BABU. All rights reserved.</p>
            <p className="footer-developer-credit">Developed &amp; Maintained with ❤️ by <strong>Souvik Deb</strong></p>
          </div>
        </footer>
      </main>

      {/* Toast Notification */}
      {toast && (
        <div className="toast">
          <span className="toast-icon">✨</span>
          <span>{toast}</span>
        </div>
      )}

      {/* Policy and Info Modals */}
      {modalPage && (
        <InfoModal page={modalPage} onClose={() => setModalPage(null)} />
      )}
    </div>
  );
}
