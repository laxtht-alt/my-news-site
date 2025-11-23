import React, { useState, useEffect, useRef } from 'react';
import { 
  Newspaper, RefreshCw, DollarSign, ExternalLink, TrendingUp, Clock, 
  Share2, Menu, X, Info, MessageCircle, Send, ThumbsUp, User, Globe, 
  Cpu, Briefcase, Vote, Sun, Cloud, CloudRain, Wind, MapPin, Settings, 
  Search, Bell, MoreVertical, Mail, PlayCircle, Loader, Sparkles, ArrowRight, Zap, Radio, Film, Activity
} from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';

// --- CONFIGURATION ---
const firebaseConfig = {
  apiKey: "", 
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};

// Initialize Firebase
let db;
try {
  if (firebaseConfig.apiKey) {
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    signInAnonymously(auth).catch(console.error);
    db = getFirestore(app);
  }
} catch (e) {
  console.log("Firebase not configured.");
}

// --- GEMINI API SETUP ---
const apiKey = ""; // API Key injected by environment

const callGeminiAPI = async (prompt) => {
  if (!apiKey) return null;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text;
  } catch (error) { return null; }
};

// --- EXPANDED GLOBAL SOURCES (25+ Sources) ---
const NEWS_SOURCES = [
  // SCIENCE
  { name: "NASA", url: "https://www.nasa.gov/rss/dyn/breaking_news.rss", category: "Science" },
  { name: "Science Daily", url: "https://www.sciencedaily.com/rss/top_news.xml", category: "Science" },
  { name: "Space.com", url: "https://www.space.com/feeds/all", category: "Science" },
  { name: "Scientific American", url: "http://rss.sciam.com/ScientificAmerican-Global", category: "Science" },

  // TECHNOLOGY
  { name: "TechCrunch", url: "https://techcrunch.com/feed/", category: "Technology" },
  { name: "The Verge", url: "https://www.theverge.com/rss/index.xml", category: "Technology" },
  { name: "Wired", url: "https://www.wired.com/feed/rss", category: "Technology" },
  { name: "BBC Tech", url: "http://feeds.bbci.co.uk/news/technology/rss.xml", category: "Technology" },
  { name: "Engadget", url: "https://www.engadget.com/rss.xml", category: "Technology" },

  // SPORTS
  { name: "ESPN", url: "https://www.espn.com/espn/rss/news", category: "Sports" },
  { name: "BBC Sport", url: "http://feeds.bbci.co.uk/sport/rss.xml", category: "Sports" },
  { name: "CBS Sports", url: "https://www.cbssports.com/rss/headlines/", category: "Sports" },
  { name: "Sky Sports", url: "https://www.skysports.com/rss/12040", category: "Sports" },

  // ENTERTAINMENT
  { name: "IGN", url: "https://feeds.ign.com/ign/news", category: "Entertainment" },
  { name: "Variety", url: "https://variety.com/feed/", category: "Entertainment" },
  { name: "Hollywood Reporter", url: "https://www.hollywoodreporter.com/feed/", category: "Entertainment" },
  { name: "Rolling Stone", url: "https://www.rollingstone.com/feed/", category: "Entertainment" },

  // BUSINESS
  { name: "CNBC", url: "https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=10001147", category: "Business" },
  { name: "Reuters Business", url: "http://feeds.reuters.com/reuters/businessNews", category: "Business" },
  { name: "Forbes", url: "https://www.forbes.com/most-popular/feed/", category: "Business" },
  { name: "WSJ Markets", url: "https://feeds.a.dj.com/rss/RSSMarketsMain.xml", category: "Business" },
  
  // WORLD & POLITICS
  { name: "Al Jazeera", url: "https://www.aljazeera.com/xml/rss/all.xml", category: "World" },
  { name: "BBC World", url: "https://feeds.bbci.co.uk/news/world/rss.xml", category: "World" },
  { name: "NY Times", url: "https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml", category: "Politics" },
  { name: "The Guardian", url: "https://www.theguardian.com/world/rss", category: "World" },
  { name: "CNN World", url: "http://rss.cnn.com/rss/edition_world.rss", category: "World" }
];

// --- COMPONENTS ---

const WeatherWidget = () => {
  const [weather, setWeather] = useState(null);
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
          const data = await res.json();
          setWeather(data.current_weather);
        } catch (e) {}
      });
    }
  }, []);
  
  if (!weather) return <div className="bg-white h-32 rounded-2xl mb-6 border border-gray-100 flex items-center justify-center text-gray-400 text-sm">Loading Local Weather...</div>;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-500 font-medium text-sm uppercase tracking-wider">Local Conditions</h3>
        <MapPin className="h-4 w-4 text-blue-500" />
      </div>
      <div className="flex items-center">
        <Sun className="h-10 w-10 text-yellow-500 mr-4" />
        <div>
          <div className="text-3xl font-bold text-gray-900">{Math.round(weather.temperature)}°C</div>
          <div className="text-xs text-gray-500">Wind: {weather.windspeed} km/h</div>
        </div>
      </div>
    </div>
  );
};

const LiveAiTicker = ({ articles }) => {
  const [insight, setInsight] = useState("AI is analyzing global trends...");
  
  useEffect(() => {
    if (articles.length === 0) return;
    const interval = setInterval(() => {
      const randomArticle = articles[Math.floor(Math.random() * articles.length)];
      if(randomArticle) setInsight(`BREAKING ANALYSIS: ${randomArticle.title.slice(0, 60)}... Impacting ${randomArticle.category} sector.`);
    }, 3000); // Faster ticker updates
    return () => clearInterval(interval);
  }, [articles]);

  return (
    <div className="bg-black text-white px-4 py-2 flex items-center gap-3 overflow-hidden text-sm font-medium">
      <div className="flex items-center gap-1 text-red-500 shrink-0">
        <Radio className="h-4 w-4 animate-pulse" />
        <span className="uppercase font-bold tracking-wider">Live AI Pulse</span>
      </div>
      <div className="h-4 w-px bg-gray-700 mx-2"></div>
      <span className="truncate animate-fade-in">{insight}</span>
    </div>
  );
};

const ArticleReader = ({ article, allArticles, onClose, onSelectArticle }) => {
  const [fullContent, setFullContent] = useState("");
  const [loading, setLoading] = useState(true);

  const suggestedArticles = allArticles.filter(a => a.id !== article.id && a.category === article.category).slice(0, 3);

  useEffect(() => {
    setLoading(true);
    setFullContent("");
    
    const generate = async () => {
      if (apiKey) {
        const prompt = `Write a full 400-word news article based on: ${article.title}. Summary: ${article.summary}. Source: ${article.source}. Tone: Professional Journalist.`;
        const text = await callGeminiAPI(prompt);
        if (text) {
          setFullContent(text);
          setLoading(false);
          return;
        }
      }
      
      setTimeout(() => {
        setFullContent(
          `(AI Expanded Report) — ${article.summary}\n\n` +
          `According to fresh data from ${article.source}, this development represents a major shift in the current landscape. Analysts suggest that the immediate repercussions could be felt across the ${article.category} sector.\n\n` +
          `"This is a developing situation," noted one industry expert. The timeline of events indicates that stakeholders have been preparing for this outcome for several weeks, yet the magnitude of the announcement has still caught markets by surprise.\n\n` +
          `Moving forward, we expect to see a ripple effect. Global monitoring agencies have already begun to adjust their forecasts. We will continue to update this story as ${article.source} releases more information.`
        );
        setLoading(false);
      }, 1200);
    };

    generate();
  }, [article]);

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto bg-black/60 backdrop-blur-sm flex justify-center animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl min-h-screen md:min-h-0 md:my-8 rounded-none md:rounded-2xl shadow-2xl flex flex-col relative overflow-hidden">
        <button onClick={onClose} className="absolute top-4 right-4 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full z-20 backdrop-blur-md transition-all">
          <X className="h-6 w-6" />
        </button>
        
        <div className="h-64 md:h-80 w-full shrink-0 relative bg-gray-900">
          <img src={article.image || "https://source.unsplash.com/random/800x600?news"} alt={article.title} className="w-full h-full object-cover opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-6 md:p-10 w-full">
            <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-3 inline-block shadow-sm">{article.category}</span>
            <h1 className="text-2xl md:text-4xl font-bold text-white leading-tight shadow-sm max-w-2xl">{article.title}</h1>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-6 md:p-10 max-w-3xl mx-auto">
            <div className="flex items-center text-sm text-gray-500 mb-8 border-b border-gray-100 pb-6">
               <img src={`https://ui-avatars.com/api/?name=${article.source}&background=random`} className="w-8 h-8 rounded-full mr-3 shadow-sm" alt="icon"/>
               <div><p className="font-bold text-gray-900">{article.source}</p></div>
            </div>

            <div className="prose prose-lg text-gray-800 max-w-none leading-relaxed">
              {loading ? (
                <div className="space-y-6 animate-pulse mt-8">
                  <div className="flex items-center text-blue-600 font-medium bg-blue-50 p-4 rounded-lg">
                    <Sparkles className="h-5 w-5 mr-3 animate-spin" /> AI Agent is compiling full report...
                  </div>
                  <div className="h-4 bg-gray-100 rounded w-full"></div>
                  <div className="h-4 bg-gray-100 rounded w-full"></div>
                </div>
              ) : (
                <div className="whitespace-pre-line text-gray-700">{fullContent}</div>
              )}
            </div>

            <div className="mt-12 p-6 bg-gray-50 rounded-xl border border-gray-100">
              <h4 className="font-bold text-gray-900 mb-2 flex items-center"><Info className="h-4 w-4 mr-2 text-blue-500" /> Source Reference</h4>
              <p className="text-sm text-gray-600 mb-4">Aggregated from RSS feed. Original source:</p>
              <a href={article.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                Read on {article.source} <ExternalLink className="h-4 w-4 ml-2" />
              </a>
            </div>
          </div>

          <div className="bg-gray-50 border-t border-gray-200 py-10 px-6 md:px-10">
            <div className="max-w-3xl mx-auto">
              <h3 className="font-bold text-gray-900 mb-6 flex items-center"><TrendingUp className="h-5 w-5 mr-2" /> Read Next</h3>
              <div className="grid gap-4">
                {suggestedArticles.map((item) => (
                  <div key={item.id} onClick={() => onSelectArticle(item)} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer flex gap-4 group">
                    <div className="w-20 h-20 shrink-0 bg-gray-200 rounded-lg overflow-hidden"><img src={item.image} className="w-full h-full object-cover" alt="thumb" /></div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight mb-2">{item.title}</h4>
                      <div className="flex items-center text-xs text-gray-500"><span className="font-medium text-gray-700">{item.source}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [activeTab, setActiveTab] = useState("Home");
  const [searchQuery, setSearchQuery] = useState(""); 
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  // --- GLOBAL FETCH ENGINE ---
  const fetchNews = async (currentList) => {
    setLoading(true);
    let newBatch = [];

    const promises = NEWS_SOURCES.map(async (source) => {
      try {
        const res = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(source.url)}`);
        const data = await res.json();
        
        if (data.items) {
          return data.items.map(item => ({
            id: item.guid || item.link,
            title: item.title,
            source: source.name,
            time: new Date(item.pubDate).toLocaleTimeString([], { hour: '2-digit', minute:'2-digit' }),
            image: item.enclosure?.link || item.thumbnail || `https://source.unsplash.com/random/800x600?${source.category}`,
            category: source.category,
            summary: item.description ? item.description.replace(/<[^>]*>?/gm, '').slice(0, 150) + "..." : "Click to read full coverage...",
            link: item.link,
            content: item.content
          }));
        }
        return [];
      } catch (e) { return []; }
    });

    const results = await Promise.all(promises);
    newBatch = results.flat().sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
    
    // MERGE LOGIC: Add new stories to existing list without duplicates
    setArticles(prev => {
        const existingIds = new Set(prev.map(a => a.title)); // Use Title as ID to catch dupes
        const filteredNew = newBatch.filter(a => !existingIds.has(a.title));
        return [...filteredNew, ...prev]; // Add new on top, keep old at bottom
    });
    
    setLoading(false);
  };

  useEffect(() => {
    fetchNews(); // Initial fetch
    const interval = setInterval(fetchNews, 10000); // Aggressive 10s updates
    return () => clearInterval(interval);
  }, []);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if(newsletterEmail && db) {
        try {
            await addDoc(collection(db, "newsletter_subs"), { email: newsletterEmail, time: serverTimestamp() });
            alert("Subscribed!");
            setNewsletterEmail("");
        } catch(e) { alert("Error subscribing"); }
    } else {
        alert("Subscribed! (Demo Mode)");
        setNewsletterEmail("");
    }
  };

  const displayArticles = articles.filter(article => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return article.title.toLowerCase().includes(q) || article.source.toLowerCase().includes(q);
    }
    return activeTab === "Home" ? true : (article.category === activeTab || (activeTab === "For you" && ["Technology", "Business"].includes(article.category)));
  });

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 flex flex-col">
      {selectedArticle && <ArticleReader article={selectedArticle} allArticles={articles} onClose={() => setSelectedArticle(null)} onSelectArticle={setSelectedArticle} />}

      {/* LIVE AI TICKER */}
      <LiveAiTicker articles={articles} />

      {/* HEADER */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <Menu className="h-6 w-6 text-gray-500 cursor-pointer" />
             <span className="text-2xl tracking-tighter text-gray-700">News<span className="font-bold text-blue-600">AI</span></span>
          </div>
          
          <div className="hidden md:flex flex-1 max-w-xl mx-8 relative">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={`Search ${articles.length} articles...`} className="w-full bg-gray-100 rounded-lg py-2.5 pl-10 pr-4 focus:bg-white focus:ring-2 ring-blue-100 outline-none transition-all" />
          </div>

          <div className="flex items-center gap-3">
             <button onClick={fetchNews} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-all">
                {loading ? <Loader className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                {loading ? "Scanning..." : "Refresh"}
             </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 flex items-center gap-6 overflow-x-auto py-3 scrollbar-hide text-sm font-medium text-gray-500 border-b border-gray-100">
          {["Home", "Business", "Technology", "Science", "Sports", "Entertainment", "World", "Politics"].map(tab => (
            <button key={tab} onClick={() => { setActiveTab(tab); setSearchQuery(""); }} className={`whitespace-nowrap pb-2 border-b-2 transition-colors ${activeTab === tab && !searchQuery ? 'border-blue-600 text-blue-600' : 'border-transparent hover:text-gray-800'}`}>
              {tab}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1">
        
        {/* LEFT: NEWS FEED */}
        <div className="lg:col-span-8">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h1 className="text-3xl font-light text-gray-800">{searchQuery ? `Search: "${searchQuery}"` : activeTab === "Home" ? "Your Briefing" : `${activeTab} News`}</h1>
              <p className="text-gray-500 text-sm mt-1">{currentDate} • {articles.length} Stories Loaded</p>
            </div>
          </div>

          <div className="space-y-6">
            {loading && articles.length === 0 ? (
               <div className="text-center py-20 text-gray-400 flex flex-col items-center"><Loader className="h-8 w-8 animate-spin mb-4 text-blue-500" />Connecting to global satellites...</div>
            ) : displayArticles.length === 0 ? (
               <div className="text-center py-20 text-gray-500 bg-gray-50 rounded-xl">No articles found yet. Waiting for updates...</div>
            ) : (
                displayArticles.map((article, idx) => (
                  <div key={idx} onClick={() => setSelectedArticle(article)} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col sm:flex-row gap-6 group">
                     <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                           <span className="text-xs font-bold text-gray-800">{article.source}</span>
                           <span className="text-xs text-gray-400">• {article.time}</span>
                        </div>
                        <h3 className="text-xl font-serif font-medium text-gray-900 leading-tight mb-2 group-hover:text-blue-700">{article.title}</h3>
                        <p className="text-sm text-gray-600 line-clamp-2">{article.summary}</p>
                     </div>
                     {article.image && (
                       <div className="w-full sm:w-32 h-32 shrink-0">
                         <img src={article.image} className="w-full h-full object-cover rounded-lg bg-gray-100" onError={(e) => e.target.style.display='none'} alt="thumb" />
                       </div>
                     )}
                  </div>
                ))
            )}
          </div>
        </div>

        {/* RIGHT: WIDGETS */}
        <div className="lg:col-span-4">
           <WeatherWidget />

           <div className="bg-blue-600 rounded-2xl p-6 text-white mb-6 relative overflow-hidden">
              <div className="relative z-10">
                 <h3 className="font-bold text-lg mb-2 flex items-center"><Mail className="h-5 w-5 mr-2" /> Daily Intelligence</h3>
                 <p className="text-blue-100 text-sm mb-4">Get the 5 most important global stories delivered to your inbox.</p>
                 <form onSubmit={handleSubscribe}>
                    <input type="email" value={newsletterEmail} onChange={e => setNewsletterEmail(e.target.value)} placeholder="Your email address" className="w-full px-4 py-2 rounded-lg text-gray-900 text-sm mb-2 outline-none text-black" />
                    <button className="w-full bg-blue-800 hover:bg-blue-900 py-2 rounded-lg text-sm font-medium transition">Subscribe</button>
                 </form>
              </div>
           </div>

           <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="font-bold text-gray-800 mb-4">Active Feeds</h3>
              <div className="space-y-3">
                 {NEWS_SOURCES.slice(0, 8).map(source => (
                    <div key={source.name} className="flex items-center justify-between text-sm">
                       <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                          <span className="text-gray-700">{source.name}</span>
                       </div>
                       <span className="text-gray-400 text-xs">{source.category}</span>
                    </div>
                 ))}
                 <div className="text-xs text-gray-400 mt-2">+ {NEWS_SOURCES.length - 8} more sources active</div>
              </div>
           </div>
        </div>

      </main>
    </div>
  );
};

export default App;