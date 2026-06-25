import React, { useState, useEffect, useRef } from 'react';

// Curated Offline Database of High-Yield Exam Pointers
const offlineQA = {
  inflation: {
    title: "Difference between WPI and CPI (Economics)",
    content: `Here is the core distinction between Wholesale Price Index (WPI) and Consumer Price Index (CPI) for competitive exams:

• **1. Level of Measurement:** 
  - **WPI:** Measures price inflation at the wholesale level (first stage of transaction, e.g., factory gate).
  - **CPI:** Measures price changes at the retail consumer level (final stage of transaction).

• **2. Commodity Basket Coverage:**
  - **WPI:** Covers ONLY goods. It does not measure services.
  - **CPI:** Covers BOTH goods and services.

• **3. Primary Focus / Weightage:**
  - **WPI:** Manufactured goods carry the highest weightage (~64%), followed by primary articles (~23%) and fuel/power (~13%).
  - **CPI:** Food and beverages carry the highest weightage (~45.8%), making it sensitive to crop failures or monsoon shocks.

• **4. Publishing Authority:**
  - **WPI:** Office of Economic Adviser, Ministry of Commerce and Industry.
  - **CPI:** National Statistical Office (NSO), Ministry of Statistics and Programme Implementation (MoSPI).

• **5. Policy Inflation Target:**
  - RBI uses **CPI (Combined)** as its key nominal anchor for targeting inflation under the Monetary Policy Framework.`
  },
  act1935: {
    title: "Government of India Act 1935 (Polity & History)",
    content: `The GOI Act 1935 was a critical milestone in India's constitutional history, forming the blueprint for today's Constitution. Key highlights:

• **1. Provincial Autonomy:** Abolished dyarchy in provinces and introduced provincial autonomy. Dyarchy was instead introduced at the Centre (Federal Executive).
• **2. Federation Proposal:** Proposed an All-India Federation comprising British Indian provinces and princely states (which never came into being as princely states declined).
• **3. Division of Powers:** Divided legislative powers between the Centre and provinces into three lists: Federal List, Provincial List, and Concurrent List. Residuary powers were vested in the Viceroy.
• **4. Bicameralism:** Introduced bicameral legislatures in 6 out of 11 provinces (Bengal, Bombay, Madras, Bihar, Assam, United Provinces).
• **5. Institutions Established:**
  - Federal Court of India (established in 1937, later renamed Supreme Court).
  - Reserve Bank of India (RBI) (established in 1935 to control currency and credit).
  - Federal Public Service Commission (precursor to UPSC).`
  },
  satyagraha: {
    title: "Concept of Satyagraha (History - Indian National Movement)",
    content: `Satyagraha, developed by Mahatma Gandhi, translates literally to "insistence on truth" or "truth-force". It is a moral weapon based on active non-violent resistance:

• **1. Soul Force (Ahimsa):** Gandhi emphasized that Satyagraha is not passive resistance of the weak; it is active soul-force that requires immense moral courage. Violence is strictly prohibited.
• **2. Distinguish Between Evil and Evil-Doer:** A Satyagrahi seeks to convert the opponent through patience and self-suffering, hating the evil deed but not the person doing it.
• **3. Core Techniques:** Includes non-cooperation (Asahyog), civil disobedience (Savinay Avagya), boycotting foreign goods, picketing, and fasts.
• **4. Key Satyagraha Campaigns in India:**
  - **Champaran (1917):** First Civil Disobedience in India (protesting indigo farming conditions).
  - **Kheda (1918):** First Non-Cooperation (tax waiver dispute due to crop failure).
  - **Ahmedabad Mill Strike (1918):** First Hunger Strike (bonus dispute).`
  },
  ramsar: {
    title: "Ramsar Convention (Geography & Ecology)",
    content: `The Ramsar Convention is an international treaty for the conservation and sustainable use of wetlands. Key facts for exams:

• **1. Origin:** Signed on February 2, 1971, in the Iranian city of Ramsar. February 2 is celebrated as World Wetlands Day.
• **2. Montreux Record:** A register of wetland sites on the List of Wetlands of International Importance where changes in ecological character have occurred, are occurring, or are likely to occur due to technological developments, pollution, or human interference.
  - Currently, two Indian sites are under the Montreux Record: **Loktak Lake** (Manipur) and **Keoladeo National Park** (Rajasthan). (Chilika Lake was removed earlier after restoration).
• **3. India Details:** India is a contracting party to the convention. India has expanded its Ramsar list significantly (covering dozens of key biodiversity areas, like Chilika Lake, Sundarbans, and Vembanad Kol).`
  },
  rights: {
    title: "Fundamental Rights - Part III (Polity)",
    content: `Fundamental Rights are enshrined in Part III of the Constitution (Articles 12 to 35). Known as the Magna Carta of India, they are legally enforceable (justiciable):

• **1. Right to Equality (Articles 14–18):** Equality before law, prohibition of discrimination, equality of opportunity in public employment, abolition of untouchability and titles.
• **2. Right to Freedom (Articles 19–22):** Six freedoms (speech, assembly, association, movement, residence, profession), protection in conviction, right to life & personal liberty (Article 21), and right to education (Article 21A).
• **3. Right against Exploitation (Articles 23–24):** Prohibition of human trafficking/forced labor and child labor in factories.
• **4. Right to Freedom of Religion (Articles 25–28):** Freedom of conscience, profession, practice, propagation, and management of religious affairs.
• **5. Cultural & Educational Rights (Articles 29–30):** Protection of language, script, and culture of minorities; right of minorities to establish educational institutions.
• **6. Right to Constitutional Remedies (Article 32):** Empowering citizens to approach the Supreme Court directly for enforcement of rights. Dr. B. R. Ambedkar called Article 32 the "Heart and Soul of the Constitution".`
  },
  monetary: {
    title: "RBI Monetary Policy Committee - MPC (Economics)",
    content: `The Monetary Policy Committee (MPC) is the statutory body responsible for setting policy interest rates to maintain price stability:

• **1. Composition:** 6-member committee. 3 members from RBI (including the Governor, who acts as ex-officio Chairman) and 3 external members appointed by the Government of India.
• **2. Mandate:** Maintain inflation target (under Section 45ZB of RBI Act 1934) of **4% with a +/- 2% band** (2% to 6%).
• **3. Core Policy Tools:**
  - **Repo Rate:** Rate at which RBI lends money to commercial banks against government securities.
  - **Reverse Repo:** Rate at which banks park short-term surplus funds with RBI.
  - **Cash Reserve Ratio (CRR):** Percentage of total bank deposits that banks must keep with RBI as cash reserves.
  - **Statutory Liquidity Ratio (SLR):** Percentage of deposits banks must invest in liquid assets (gold, cash, approved securities) internally.`
  },
  hydrogen: {
    title: "National Green Hydrogen Mission (Science & Environment)",
    content: `Launched in January 2023 with an initial outlay of ₹19,744 crore to position India as a global hub for green hydrogen:

• **1. Production Targets:** Aims to reach at least **5 MMT (Million Metric Tonnes)** of green hydrogen production capacity per annum by 2030.
• **2. Renewable Energy Sync:** Requires addition of about 125 GW of associated renewable energy capacity by 2030.
• **3. Hydrogen Categorization:**
  - **Grey Hydrogen:** Produced from fossil fuels (steam methane reforming), releasing CO2.
  - **Blue Hydrogen:** Produced from fossil fuels, but carbon emissions are captured and stored (CCS).
  - **Green Hydrogen:** Produced by water electrolysis using renewable power (zero carbon footprint).`
  },
  schedules: {
    title: "12 Schedules of the Constitution (Polity Mnemonic)",
    content: `The 12 Schedules of the Indian Constitution can be quickly remembered with the mnemonic **"TEARS OF OLD PM"**:

• **T** - **T**erritories (Schedule 1: States and UTs names)
• **E** - **E**moluments (Schedule 2: Salaries of President, Judges, CAG, etc.)
• **A** - **A**ffirmations & Oaths (Schedule 3)
• **R** - **R**ajya Sabha (Schedule 4: Allocation of seats to States/UTs)
• **S** - **S**cheduled Areas (Schedule 5: Administration of Scheduled Areas)
• **O** - **O**ther Scheduled Areas (Schedule 6: Assam, Meghalaya, Tripura, Mizoram)
• **F** - **F**ederal Structure (Schedule 7: Union, State, Concurrent Lists)
• **O** - **O**fficial Languages (Schedule 8: 22 recognized languages)
• **L** - **L**and Reforms (Schedule 9: Validation of acts/regulations)
• **D** - **D**efection (Schedule 10: Anti-Defection Law, added by 52nd Amendment)
• **P** - **P**anchayats (Schedule 11: 29 matters, added by 73rd Amendment)
• **M** - **M**unicipalities (Schedule 12: 18 matters, added by 74th Amendment)`
  }
};

// ==========================================
// DEVELOPER API CONFIGURATION (SERVER/CODE SIDE)
// ==========================================
// Set your API keys here so they are loaded automatically for students
// You can also use Vite environment variables (VITE_GEMINI_API_KEY, VITE_GROQ_API_KEY, VITE_OPENROUTER_API_KEY, VITE_OPENAI_API_KEY)
const DEVELOPER_GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
const DEVELOPER_GROQ_KEY = import.meta.env.VITE_GROQ_API_KEY || "";
const DEVELOPER_OPENROUTER_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || "";
const DEVELOPER_OPENAI_KEY = import.meta.env.VITE_OPENAI_API_KEY || "";

export default function AITutor() {
  const [messages, setMessages] = useState([
    {
      role: 'tutor',
      text: "Namaste! I am your SARKARI BABU AI Tutor. Ask me any doubt regarding Indian Polity, History, Economics, Geography, Current Affairs, or General Science, and I will explain it in clear, exam-oriented takeaways.",
      isGreeting: true
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const geminiKey = DEVELOPER_GEMINI_KEY;
  const groqKey = DEVELOPER_GROQ_KEY;
  const openrouterKey = DEVELOPER_OPENROUTER_KEY;
  const openaiKey = DEVELOPER_OPENAI_KEY;
  const chatEndRef = useRef(null);

  // Auto scroll to chat end
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Keyword match offline tutor parser
  const getOfflineTutorReply = (query) => {
    const q = query.toLowerCase();
    
    if (/\b(wpi|cpi|inflation|wholesale|retail)\b/.test(q)) {
      return offlineQA.inflation.content;
    }
    if (/\b(1935|government of india act|goi act)\b/.test(q)) {
      return offlineQA.act1935.content;
    }
    if (/\b(satyagraha|gandhi|non-violent|ahimsa)\b/.test(q)) {
      return offlineQA.satyagraha.content;
    }
    if (/\b(ramsar|wetland|montreux|swamps)\b/.test(q)) {
      return offlineQA.ramsar.content;
    }
    if (/\b(fundamental rights|rights|articles? (14|19|21|32))\b/.test(q)) {
      return offlineQA.rights.content;
    }
    if (/\b(monetary policy|mpc|repo rate|rbi|crr|slr)\b/.test(q)) {
      return offlineQA.monetary.content;
    }
    if (/\b(green hydrogen|hydrogen|electrolyser)\b/.test(q)) {
      return offlineQA.hydrogen.content;
    }
    if (/\b(tears of old pm|schedules|schedule)\b/.test(q)) {
      return offlineQA.schedules.content;
    }

    return `I am currently operating in **Offline Tutor Mode** to conserve server resources. 

Meanwhile, you can click on any of the **Quick Doubt Chips** below to explore standard syllabus explanation sheets!`;
  };

  // Send message handler with auto-fallback chain
  const handleSendMessage = async (textToSend) => {
    const query = (textToSend || inputValue).trim();
    if (!query) return;

    // Add user message
    setMessages(prev => [...prev, { role: 'user', text: query }]);
    setInputValue('');
    setIsLoading(true);

    let responseReceived = false;
    let aiResponseText = "";

    // Helper to call Gemini API
    const callGemini = async () => {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${geminiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are an expert exam tutor for Indian Government Exams (UPSC, SSC, Banking). Answer this question clearly, comprehensively, and formatted with bullet points for easy study. Question: ${query}`
            }]
          }]
        })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData?.error?.message || res.statusText);
      }

      const data = await res.json();
      return data?.candidates?.[0]?.content?.parts?.[0]?.text || "No reply generated.";
    };

    // Helper to call Groq API (OpenAI-compatible)
    const callGroq = async () => {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${groqKey}`
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content: "You are an expert exam tutor for Indian Government Exams (UPSC, SSC, Banking). Answer clearly, comprehensively, and format with bullet points for easy study."
            },
            {
              role: "user",
              content: query
            }
          ]
        })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData?.error?.message || res.statusText);
      }

      const data = await res.json();
      return data?.choices?.[0]?.message?.content || "No reply generated.";
    };

    // Helper to call OpenRouter API (OpenAI-compatible)
    const callOpenRouter = async () => {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openrouterKey}`
        },
        body: JSON.stringify({
          model: "google/gemma-2-9b-it:free",
          messages: [
            {
              role: "system",
              content: "You are an expert exam tutor for Indian Government Exams (UPSC, SSC, Banking). Answer clearly, comprehensively, and format with bullet points for easy study."
            },
            {
              role: "user",
              content: query
            }
          ]
        })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData?.error?.message || res.statusText);
      }

      const data = await res.json();
      return data?.choices?.[0]?.message?.content || "No reply generated.";
    };

    // Helper to call OpenAI API
    const callOpenAI = async () => {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: "You are an expert exam tutor for Indian Government Exams (UPSC, SSC, Banking). Answer clearly, comprehensively, and format with bullet points for easy study."
            },
            {
              role: "user",
              content: query
            }
          ]
        })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData?.error?.message || res.statusText);
      }

      const data = await res.json();
      return data?.choices?.[0]?.message?.content || "No reply generated.";
    };

    // Try Primary Model (Gemini) first if key is present
    if (geminiKey) {
      try {
        aiResponseText = await callGemini();
        responseReceived = true;
      } catch (geminiErr) {
        console.warn("Gemini call failed, swapping to Groq fallback...", geminiErr);
      }
    }

    // Try Secondary Model (Groq Llama) if Gemini failed or wasn't configured, and Groq key is present
    if (!responseReceived && groqKey) {
      try {
        aiResponseText = await callGroq();
        responseReceived = true;
      } catch (groqErr) {
        console.warn("Groq call failed, swapping to OpenRouter fallback...", groqErr);
      }
    }

    // Try Tertiary Model (OpenRouter Gemma) if previous models failed, and OpenRouter key is present
    if (!responseReceived && openrouterKey) {
      try {
        aiResponseText = await callOpenRouter();
        responseReceived = true;
      } catch (orErr) {
        console.warn("OpenRouter call failed, swapping to OpenAI fallback...", orErr);
      }
    }

    // Try Quaternary Model (OpenAI) if previous models failed and OpenAI key is present
    if (!responseReceived && openaiKey) {
      try {
        aiResponseText = await callOpenAI();
        responseReceived = true;
      } catch (openaiErr) {
        console.warn("OpenAI call failed, reverting to offline fallback...", openaiErr);
      }
    }

    // If all failed or neither key was set, fall back to Offline Mode
    if (!responseReceived) {
      setTimeout(() => {
        const reply = getOfflineTutorReply(query);
        setMessages(prev => [...prev, { role: 'tutor', text: reply }]);
        setIsLoading(false);
      }, 600);
    } else {
      // Add Bot response
      setMessages(prev => [...prev, { role: 'tutor', text: aiResponseText }]);
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        role: 'tutor',
        text: "Namaste! Chat reset. How can I help you in your exam preparation today?",
        isGreeting: true
      }
    ]);
  };

  const isLiveActive = !!geminiKey || !!groqKey || !!openrouterKey || !!openaiKey;



  return (
    <div className="ai-tutor-container">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title-section">
          <h1>🤖 AI Doubt Solver</h1>
          <p>Clear doubts instantly, draft model answers, or explain concepts across UPSC, SSC, &amp; Banking syllabi.</p>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="ai-chat-window glass-card">
        {/* Custom Brand Header with Mascot */}
        <div className="chat-brand-header">
          <div className="chat-brand-info">
            <div className={`robot-mascot-container ${isLoading ? 'is-thinking' : ''}`}>
              <svg className="cute-robot-svg" viewBox="0 0 100 100">
                {/* Antenna */}
                <line x1="50" y1="22" x2="50" y2="10" strokeWidth="4" strokeLinecap="round" className="robot-antenna-mast" />
                <circle cx="50" cy="10" r="5" className="robot-antenna-bulb" />
                {/* Ears */}
                <rect x="20" y="42" width="6" height="16" rx="3" className="robot-ear" />
                <rect x="74" y="42" width="6" height="16" rx="3" className="robot-ear" />
                {/* Head */}
                <rect x="25" y="25" width="50" height="48" rx="14" className="robot-head" />
                {/* Face Screen */}
                <rect x="31" y="31" width="38" height="28" rx="8" className="robot-face-screen" />
                {/* Eyes */}
                <circle cx="42" cy="45" r="4.5" className="robot-eye eye-left" />
                <circle cx="58" cy="45" r="4.5" className="robot-eye eye-right" />
                {/* Mouth */}
                <path d="M 44 53 Q 50 57 56 53" fill="none" strokeWidth="2.5" strokeLinecap="round" className="robot-mouth" />
              </svg>
            </div>
            <div className="chat-brand-titles">
              <h2 className="chat-title-main">Sarkari Babu AI</h2>
              <p className="chat-title-sub">
                <span className="live-dot-pulse" style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e', display: 'inline-block', boxShadow: '0 0 6px #22c55e' }}></span>
                {isLiveActive ? "Tutor Active" : "Local Tutor Active"}
              </p>
            </div>
          </div>
          <div className="chat-header-actions">
            <span className={`status-badge-pill ${isLiveActive ? 'status-live' : 'status-offline'}`}>
              {isLiveActive ? "● Live AI" : "○ Offline Mode"}
            </span>
          </div>
        </div>



        {/* Message Thread */}
        <div className="chat-message-thread">
          {messages.map((msg, index) => {
            if (msg.role === 'system') {
              return (
                <div key={index} className="chat-system-message">
                  <span>{msg.text}</span>
                </div>
              );
            }
            const isUser = msg.role === 'user';
            return (
              <div key={index} className={`chat-message-row ${isUser ? 'user-row' : 'tutor-row'}`}>
                <div className={`message-avatar ${isUser ? 'avatar-user' : 'avatar-tutor'}`}>
                  {isUser ? "👨‍🎓" : (
                    <svg className="mini-robot-svg" viewBox="0 0 100 100">
                      <line x1="50" y1="20" x2="50" y2="10" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
                      <circle cx="50" cy="10" r="6" className="robot-antenna-bulb" />
                      <rect x="25" y="25" width="50" height="50" rx="12" className="robot-head" />
                      <circle cx="41" cy="45" r="4.5" className="robot-eye" />
                      <circle cx="59" cy="45" r="4.5" className="robot-eye" />
                      <path d="M 44 57 Q 50 61 56 57" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" className="robot-mouth" />
                    </svg>
                  )}
                </div>
                <div className={`ai-message-bubble ${isUser ? 'bubble-user' : 'bubble-tutor'}`}>
                  {isUser ? (
                    <p>{msg.text}</p>
                  ) : (
                    // Parse simple markdown-like bullet points
                    <div className="formatted-bot-content">
                      {msg.text.split('\n').map((line, lIdx) => {
                        if (line.startsWith('• ') || line.startsWith('- ')) {
                          return (
                            <div key={lIdx} className="bullet-line">
                              <span className="bullet-dot">✦</span>
                              <span>{line.substring(2)}</span>
                            </div>
                          );
                        }
                        return (
                          <p key={lIdx}>
                            {line}
                          </p>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          {isLoading && (
            <div className="chat-message-row tutor-row">
              <div className="message-avatar avatar-tutor">
                <svg className="mini-robot-svg" viewBox="0 0 100 100">
                  <line x1="50" y1="20" x2="50" y2="10" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
                  <circle cx="50" cy="10" r="6" className="robot-antenna-bulb" />
                  <rect x="25" y="25" width="50" height="50" rx="12" className="robot-head" />
                  <circle cx="41" cy="45" r="4.5" className="robot-eye" />
                  <circle cx="59" cy="45" r="4.5" className="robot-eye" />
                  <path d="M 44 57 Q 50 61 56 57" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" className="robot-mouth" />
                </svg>
              </div>
              <div className="ai-message-bubble bubble-tutor">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="chat-quick-suggestions">
          <span className="suggestions-label">💡 Try clicking a doubt:</span>
          <div className="suggestions-grid">
            <button className="suggestion-chip" onClick={() => handleSendMessage("Explain the difference between WPI and CPI")}>
              ⚖️ WPI vs CPI Inflation
            </button>
            <button className="suggestion-chip" onClick={() => handleSendMessage("Key highlights of Government of India Act 1935")}>
              📜 GOI Act 1935
            </button>
            <button className="suggestion-chip" onClick={() => handleSendMessage("Explain Satyagraha concept of Mahatma Gandhi")}>
              🕊️ Gandhi Satyagraha
            </button>
            <button className="suggestion-chip" onClick={() => handleSendMessage("What is Ramsar Convention?")}>
              🦆 Ramsar Wetlands
            </button>
            <button className="suggestion-chip" onClick={() => handleSendMessage("Fundamental Rights Part III of Constitution")}>
              🛡️ Fundamental Rights
            </button>
            <button className="suggestion-chip" onClick={() => handleSendMessage("RBI Monetary Policy Committee details")}>
              📈 Monetary Policy (MPC)
            </button>
            <button className="suggestion-chip" onClick={() => handleSendMessage("Explain National Green Hydrogen Mission")}>
              🌱 Green Hydrogen
            </button>
            <button className="suggestion-chip" onClick={() => handleSendMessage("Mnemonic for 12 schedules of Constitution")}>
              📚 12 Schedules Mnemonic
            </button>
          </div>
        </div>

        {/* Input Bar */}
        <div className="chat-input-row">
          <input
            type="text"
            className="chat-textbox"
            placeholder="Type your exam doubt here (e.g., Explain Article 21)..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
          />
          <button className="btn btn-primary send-chat-btn" onClick={() => handleSendMessage()} disabled={isLoading || !inputValue.trim()}>
            Send ⚡
          </button>
          <button className="btn btn-secondary clear-chat-btn" onClick={handleClearChat} title="Clear Chat Thread">
            Reset 🗑️
          </button>
        </div>
      </div>
    </div>
  );
}
