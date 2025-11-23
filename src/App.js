import React, { useState, useEffect, useRef } from 'react';
import { 
  Newspaper, RefreshCw, DollarSign, ExternalLink, TrendingUp, Clock, 
  Share2, Menu, X, Info, MessageCircle, Send, ThumbsUp, User, Globe, 
  Cpu, Briefcase, Vote, Sun, Cloud, CloudRain, Wind, MapPin, Settings, 
  Search, Bell, MoreVertical, Mail, PlayCircle, Loader, Sparkles
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

// --- REAL NEWS SOURCES (RSS FEEDS) ---
const NEWS_SOURCES = [
  { name: "Al Jazeera", url: "https://www.aljazeera.com/xml/rss/all.xml", category: "World" },
  { name: "NY Times", url: "https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml", category: "Politics" },
  { name: "IGN", url: "https://feeds.ign.com/ign/news", category: "Entertainment" },
  { name: "Kathmandu Post", url: "https://tkpo.st/assets/rss/headline.xml", category: "World" },
  { name: "BBC Tech", url: "http://feeds.bbci.co.uk/news/technology/rss.xml", category: "Technology" },
  { name: "ESPN", url: "https://www.espn.com/espn/rss/news", category: "Sports" }
];

// --- AI CONTENT GENERATOR ---
// This function simulates an AI writing a full article from a summary.
// In a production app, you would replace this logic with a real fetch to the Gemini API.
const generateFullArticle = (title, summary, source) => {
  const intro = `(AI Reporting) – ${summary} This development marks a significant turning point in the ongoing narrative surrounding this issue.`;
  
  const body1 = `According to reports from ${source}, the situation has evolved rapidly over the last 24 hours. Key stakeholders have weighed in, suggesting that the immediate impact could be far-reaching. "This is unprecedented," noted one analyst close to the matter. The sheer scale of the event implies that we may be seeing a paradigm shift in how these matters are handled moving forward.`;
  
  const body2 = `Historical context suggests that this wasn't entirely unexpected, yet the timing has caught many off guard. Experts argue that while short-term volatility is expected, the long-term outlook remains uncertain. Data from previous similar events indicates a recovery period of several months, but ${source} sources warn that unique factors here could complicate that timeline.`;
  
  const body3 = `Furthermore, global reactions have been pouring in. Markets have reacted cautiously, and social media sentiment appears divided. As more details emerge, it becomes clear that the ramifications will extend beyond the immediate sector. We will continue to monitor the situation and update this report as new information becomes available.`;

  return `${intro}\n\n${body1}\n\n${body2}\n\n${body3}`;
};

// --- COMPONENTS ---

const WeatherWidget = () => {
  const [weather, setWeather] = useState(null);
  
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
          const data = await response.json();
          setWeather(data.current_weather);
        } catch (e) { console.error(e); }
      });
    }
  }, []);

  if (!weather) return <div className="bg-white p-6 rounded-2xl mb-6 shadow-sm border border-gray-100 flex items-center justify-center h-32 text-gray-400">Loading Weather...</div>;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-500 font-medium text-sm uppercase tracking-wider">Local Weather</h3>
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

const ArticleReader = ({ article, onClose }) => {
  const [fullContent, setFullContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate AI Generation Delay
    const timer = setTimeout(() => {
      // If RSS provided full content, use it. Otherwise, generate it.
      const content = article.content && article.content.length > 200 
        ? article.content 
        : generateFullArticle(article.title, article.summary, article.source);
      
      setFullContent(content);
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [article]);

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto bg-black/60 backdrop-blur-sm flex justify-center animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl min-h-screen md:min-h-0 md:my-8 rounded-none md:rounded-2xl shadow-2xl flex flex-col relative">
        <button onClick={onClose} className="absolute top-4 right-4 bg-white/90 hover:bg-white p-2 rounded-full text-gray-800 z-10 shadow-lg"><X className="h-6 w-6" /></button>
        
        <div className="h-64 md:h-80 w-full shrink-0 relative bg-gray-900">
          <img src={article.image || "https://source.unsplash.com/random/800x600?news"} alt={article.title} className="w-full h-full object-cover opacity-80" />
          <div className="absolute bottom-0 left-0 p-8 bg-gradient-to-t from-black/90 to-transparent w-full">
            <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded mb-2 inline-block">{article.category}</span>
            <h1 className="text-2xl md:text-4xl font-bold text-white leading-tight">{article.title}</h1>
          </div>
        </div>

        <div className="p-8 md:p-12">
          <div className="flex items-center text-sm text-gray-500 mb-8 border-b pb-4">
             <img src={`https://ui-avatars.com/api/?name=${article.source}&background=random`} className="w-6 h-6 rounded-full mr-2" alt="icon"/>
             <span className="font-bold text-gray-900 mr-4">{article.source}</span>
             <Clock className="h-4 w-4 mr-2" /> {article.time}
          </div>

          <div className="prose prose-lg text-gray-800 max-w-none">
            {loading ? (
              <div className="space-y-4 animate-pulse">
                <div className="flex items-center text-blue-600 font-medium mb-4">
                  <Sparkles className="h-5 w-5 mr-2 animate-spin" />
                  AI Agent is writing full report from {article.source} data...
                </div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-4/6"></div>
              </div>
            ) : (
              <>
                 <p className="text-xl font-medium leading-relaxed mb-6 border-l-4 border-blue-500 pl-4 italic bg-gray-50 p-4 rounded-r-lg">
                   "{article.summary}"
                 </p>
                 <div className="whitespace-pre-line leading-relaxed">
                   {fullContent}
                 </div>
              </>
            )}
          </div>

          <div className="mt-12 p-6 bg-gray-50 rounded-xl border border-gray-200">
            <h4 className="font-bold text-gray-900 mb-2">Source Reference</h4>
            <p className="text-sm text-gray-600 mb-4">This article was aggregated via RSS. View the original source below:</p>
            <a href={article.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-blue-600 font-bold hover:underline">
              Read original on {article.source} <ExternalLink className="h-4 w-4 ml-2" />
            </a>
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
  const [newsletterEmail, setNewsletterEmail] = useState("");

  const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  // --- REAL NEWS FETCHING ENGINE ---
  const fetchNews = async () => {
    setLoading(true);
    let allNews = [];

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
            content: item.content // We capture this, but RSS often leaves it empty
          }));
        }
        return [];
      } catch (e) {
        console.error(`Failed to fetch ${source.name}`, e);
        return [];
      }
    });

    const results = await Promise.all(promises);
    allNews = results.flat().sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
    
    setArticles(allNews.slice(0, 30));
    setLoading(false);
  };

  useEffect(() => {
    fetchNews();
    const interval = setInterval(fetchNews, 60000); 
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
        alert("Demo Mode: Subscription simulated!");
        setNewsletterEmail("");
    }
  };

  const displayArticles = activeTab === "Home" ? articles : articles.filter(a => a.category === activeTab || activeTab === "For you");

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      
      {/* READER MODAL */}
      {selectedArticle && <ArticleReader article={selectedArticle} onClose={() => setSelectedArticle(null)} />}

      {/* HEADER */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <Menu className="h-6 w-6 text-gray-500 cursor-pointer" />
             <span className="text-2xl tracking-tighter text-gray-700">News<span className="font-bold text-blue-600">AI</span></span>
          </div>
          
          <div className="hidden md:flex flex-1 max-w-xl mx-8 relative">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <input type="text" placeholder="Search global news..." className="w-full bg-gray-100 rounded-lg py-2.5 pl-10 pr-4 focus:bg-white focus:ring-2 ring-blue-100 outline-none transition-all" />
          </div>

          <div className="flex items-center gap-3">
             <button onClick={fetchNews} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-all">
                {loading ? <Loader className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                {loading ? "Updating..." : "Refresh Feed"}
             </button>
          </div>
        </div>

        {/* TABS */}
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-6 overflow-x-auto py-3 scrollbar-hide text-sm font-medium text-gray-500 border-b border-gray-100">
          {["Home", "World", "Politics", "Technology", "Sports", "Entertainment", "Business"].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`whitespace-nowrap pb-2 border-b-2 transition-colors ${activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent hover:text-gray-800'}`}>
              {tab}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT: NEWS FEED (66%) */}
        <div className="lg:col-span-8">
          <div className="mb-8">
            <h1 className="text-3xl font-light text-gray-800">Your briefing</h1>
            <p className="text-gray-500 text-sm mt-1">{currentDate}</p>
          </div>

          <div className="space-y-6">
            {loading && articles.length === 0 ? (
               <div className="text-center py-20 text-gray-400">Connecting to global satellites...</div>
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

        {/* RIGHT: WIDGETS (33%) */}
        <div className="lg:col-span-4">
           <WeatherWidget />

           {/* NEWSLETTER */}
           <div className="bg-blue-600 rounded-2xl p-6 text-white mb-6 relative overflow-hidden">
              <div className="relative z-10">
                 <h3 className="font-bold text-lg mb-2 flex items-center"><Mail className="h-5 w-5 mr-2" /> Daily Intelligence</h3>
                 <p className="text-blue-100 text-sm mb-4">Get the 5 most important global stories delivered to your inbox.</p>
                 <form onSubmit={handleSubscribe}>
                    <input type="email" value={newsletterEmail} onChange={e => setNewsletterEmail(e.target.value)} placeholder="Your email address" className="w-full px-4 py-2 rounded-lg text-gray-900 text-sm mb-2 outline-none" />
                    <button className="w-full bg-blue-800 hover:bg-blue-900 py-2 rounded-lg text-sm font-medium transition">Subscribe</button>
                 </form>
              </div>
              <div className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-blue-500 rounded-full opacity-50 blur-xl"></div>
           </div>

           {/* TRENDING SOURCE LIST */}
           <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="font-bold text-gray-800 mb-4">Live Sources</h3>
              <div className="space-y-3">
                 {NEWS_SOURCES.map(source => (
                    <div key={source.name} className="flex items-center justify-between text-sm">
                       <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                          <span className="text-gray-700">{source.name}</span>
                       </div>
                       <span className="text-gray-400 text-xs">{source.category}</span>
                    </div>
                 ))}
              </div>
           </div>
        </div>

      </main>
    </div>
  );
};

export default App;