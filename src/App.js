import React, { useState, useEffect, useMemo } from 'react';
import { 
  Newspaper, RefreshCw, DollarSign, ExternalLink, TrendingUp, 
  Menu, X, Info, Vote, Sun, MapPin, Search, Mail, Loader, 
  Sparkles, ArrowRight, Zap, Radio, Film, Activity, 
  BookOpen, Moon, Skull, History, TrendingDown, Gamepad2, 
  Coffee, Bitcoin
} from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';

// --- CONFIGURATION ---
// Hardcoded configuration for local development to avoid "no-undef" errors
const firebaseConfig = {
  apiKey: "AIzaSyCr50KAccK3MeENaqZYaZBjTPbRSHmtwS0", 
  authDomain: "newsai-portal.firebaseapp.com",
  projectId: "newsai-portal",
  storageBucket: "newsai-portal.firebasestorage.app",
  messagingSenderId: "99035161662",
  appId: "1:99035161662:web:a540b69d1af42f635d1d6f"
};

// Initialize Firebase
let db, auth;
// Use the projectId as the default appId for storage paths
const appId = "newsai-portal";

try {
  if (firebaseConfig.apiKey) {
    const app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
  }
} catch (e) {
  console.log("Firebase not configured.");
}

// --- GEMINI API SETUP ---
const apiKey = ""; // API Key injected by environment or paste your key here

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

// --- GLOBAL SOURCES ---
const NEWS_SOURCES = [
  // Science & Tech
  { name: "NASA", url: "https://www.nasa.gov/rss/dyn/breaking_news.rss", category: "Science" },
  { name: "TechCrunch", url: "https://techcrunch.com/feed/", category: "Technology" },
  { name: "The Verge", url: "https://www.theverge.com/rss/index.xml", category: "Technology" },
  
  // Sports
  { name: "ESPN", url: "https://www.espn.com/espn/rss/news", category: "Sports" },
  
  // Entertainment & Gaming
  { name: "Variety", url: "https://variety.com/feed/", category: "Entertainment" },
  { name: "Kotaku", url: "https://kotaku.com/rss", category: "Gaming" },
  { name: "PC Gamer", url: "https://www.pcgamer.com/rss/", category: "Gaming" },
  { name: "Polygon", url: "https://www.polygon.com/rss/index.xml", category: "Gaming" },

  // Finance & Crypto
  { name: "CNBC", url: "https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=10001147", category: "Business" },
  { name: "CoinTelegraph", url: "https://cointelegraph.com/rss", category: "Crypto" },
  { name: "CoinDesk", url: "https://www.coindesk.com/arc/outboundfeeds/rss/", category: "Crypto" },

  // Lifestyle
  { name: "Vogue", url: "https://www.vogue.com/feed/rss", category: "Lifestyle" },
  { name: "GQ", url: "https://www.gq.com/feed/rss", category: "Lifestyle" },

  // World
  { name: "BBC World", url: "https://feeds.bbci.co.uk/news/world/rss.xml", category: "World" },
  { name: "NY Times", url: "https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml", category: "Politics" }
];

// --- ADVANCED CONTENT GENERATORS ---

const getDailySeed = () => {
  const d = new Date();
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
};

const generateConspiracies = () => {
  const seed = getDailySeed();
  const subjects = ["The CIA", "Ancient Aliens", "The Illuminati", "Big Pharma", "The Moon Landing", "JFK", "Area 51", "The Pyramids", "Atlantis", "Denver Airport"];
  const verbs = ["faked", "hid", "invented", "controls", "suppressed", "built", "destroyed", "encrypted", "signals", "monitors"];
  const objects = ["the weather", "human DNA", "the internet", "history books", "gold reserves", "telepathy technology", "zero-point energy", "the ice wall", "Mars colonies", "underground cities"];
  
  let list = [];
  for(let i=0; i<10; i++) {
    const sIdx = (seed + i * 7) % subjects.length;
    const vIdx = (seed + i * 13) % verbs.length;
    const oIdx = (seed + i * 23) % objects.length;
    
    list.push({
      id: `c_gen_${i}`,
      title: `File #${4000+i}: Did ${subjects[sIdx]} ${verbs[vIdx]} ${objects[oIdx]}?`,
      summary: `New leaked documents suggest a connection between ${subjects[sIdx]} and the sudden disappearance of ${objects[oIdx]} in 199${i%9}.`,
      image: `https://picsum.photos/seed/conspire${i}/800/600`, 
      category: "Conspiracy"
    });
  }
  return list;
};

const generateMovieNews = () => {
  const seed = getDailySeed();
  const studios = ["Marvel Studios", "DC Studios", "Warner Bros", "A24", "Netflix", "Disney+", "Paramount", "Sony Pictures", "Universal"];
  const franchises = ["Avengers: Secret Wars", "Batman Part II", "Spider-Man 4", "Avatar 3", "Star Wars: New Jedi Order", "Jurassic World Rebirth", "Dune: Messiah", "James Bond"];
  const actions = ["leaked set photos reveal", "announces surprise casting for", "delays release date of", "drops explosive new trailer for", "confirms multiverse crossover in", "reportedly cancelling"];
  
  let list = [];
  for(let i=0; i<10; i++) { 
    const sIdx = (seed + i * 3) % studios.length;
    const fIdx = (seed + i * 5) % franchises.length;
    const aIdx = (seed + i * 7) % actions.length;
    
    list.push({
      id: `mov_gen_${i}`,
      title: `BREAKING: ${studios[sIdx]} ${actions[aIdx]} ${franchises[fIdx]}`,
      summary: `AI Web Crawler has detected a surge in discussions regarding ${franchises[fIdx]}. Insider reports suggest massive changes to the script.`,
      source: "AI Web Scraper",
      time: "Just now",
      image: `https://picsum.photos/seed/movie${i}/800/600`, 
      category: "Movies"
    });
  }
  return list;
};

const generateMarketNews = () => {
  const seed = getDailySeed();
  const entities = ["Federal Reserve", "Bitcoin", "Nvidia", "Goldman Sachs", "Tesla", "Oil Prices", "European Central Bank", "Apple"];
  const actions = ["announces surprise rate hike", "plummets following regulator crackdown", "hits all-time high", "warns of looming recession", "unveils revolutionary tech", "stabilizes after volatile week"];
  
  let list = [];
  for(let i=0; i<8; i++) { 
    const eIdx = (seed + i * 2) % entities.length;
    const aIdx = (seed + i * 3) % actions.length;
    
    list.push({
      id: `mkt_gen_${i}`,
      title: `MARKET WATCH: ${entities[eIdx]} ${actions[aIdx]}`,
      summary: `Analysts are scrambling to adjust forecasts after ${entities[eIdx]} shocked the markets today. Trading volume has spiked.`,
      source: "Financial AI Agent",
      time: "Live Update",
      image: `https://picsum.photos/seed/finance${i}/800/600`, 
      category: "Markets"
    });
  }
  return list;
};

const generateHealthTips = () => {
  const seed = getDailySeed();
  const actions = ["Drink", "Eat", "Avoid", "Run", "Sleep", "Stretch", "Meditate", "Lift", "Fast", "Walk"];
  const targets = ["Lemon Water", "Blue Light", "Sugar", "Sprints", "8 Hours", "Hamstrings", "10 Minutes", "Heavy Weights", "16 Hours", "Barefoot"];
  const benefits = ["boosts testosterone", "clears skin", "reduces cortisol", "increases focus", "burns fat", "improves longevity", "fixes posture", "aligns chakras"];
  
  let list = [];
  for(let i=0; i<10; i++) {
    const aIdx = (seed + i * 3) % actions.length;
    const tIdx = (seed + i * 11) % targets.length;
    const bIdx = (seed + i * 17) % benefits.length;

    list.push({
      id: `h_gen_${i}`,
      title: `Tip #${i+1}: ${actions[aIdx]} ${targets[tIdx]}`,
      desc: `Studies show that this simple habit ${benefits[bIdx]} within 2 weeks.`,
      img: `https://picsum.photos/seed/health${i}/800/600`,
      category: "Health"
    });
  }
  return list;
};

const generateQuotes = () => {
  const seed = getDailySeed();
  const authors = ["Marcus Aurelius", "Seneca", "Steve Jobs", "Einstein", "Rumi", "Lao Tzu", "Jordan Peterson", "Naval Ravikant"];
  const starters = ["The only way to", "Never forget that", "Always remember:", "The secret of life is", "Happiness is not", "Wisdom begins when", "Strength comes from"];
  const middles = ["overcome fear", "find peace", "achieve greatness", "master yourself", "love deeply", "understand the universe"];
  const ends = ["is to let go.", "lies within.", "starts today.", "requires courage.", "is the ultimate truth.", "cannot be taught."];
  
  let list = [];
  for(let i=0; i<10; i++) {
    const aIdx = (seed + i * 5) % authors.length;
    const sIdx = (seed + i * 2) % starters.length;
    const mIdx = (seed + i * 4) % middles.length;
    const eIdx = (seed + i * 6) % ends.length;

    list.push({
      id: `q_gen_${i}`,
      text: `"${starters[sIdx]} ${middles[mIdx]} ${ends[eIdx]}"`,
      author: authors[aIdx],
      tag: "inspiration",
      category: "GoodReads"
    });
  }
  return list;
};

const generateHistoryEvents = () => {
  const seed = getDailySeed();
  const years = [1492, 1776, 1865, 1914, 1945, 1969, 1989, 2001, 1066];
  const events = ["Empire Falls", "Treaty Signed", "New Land Discovered", "Revolution Begins", "First Flight", "Internet Born", "Moon Landing", "Wall Falls"];
  const locations = ["Rome", "Paris", "London", "New York", "Tokyo", "Berlin", "The Atlantic", "Space"];

  let list = [];
  for(let i=0; i<8; i++) {
    const yIdx = (seed + i * 2) % years.length;
    const eIdx = (seed + i * 4) % events.length;
    const lIdx = (seed + i * 6) % locations.length;
    list.push({
      year: years[yIdx],
      event: events[eIdx],
      location: locations[lIdx],
      desc: `On this day in history, the world changed forever in ${locations[lIdx]} when the ${events[eIdx]} took place.`
    });
  }
  return list.sort((a,b) => a.year - b.year);
};

const generateGameReviews = () => {
  const seed = getDailySeed();
  const games = ["Half-Life 3", "GTA VI", "Elden Ring: Shadow", "Hollow Knight: Silksong", "Metroid Prime 4", "Star Citizen", "Portal 3", "The Witcher 4"];
  const verdicts = ["Masterpiece", "Disappointing", "Worth the Wait", "Broken at Launch", "Game of the Year", "Must Play", "Wait for Sale"];
  const scores = ["10/10", "9.5/10", "7/10", "4/10", "9/10", "8.5/10", "6/10"];
  
  let list = [];
  for(let i=0; i<8; i++) {
    const gIdx = (seed + i * 3) % games.length;
    const vIdx = (seed + i * 5) % verdicts.length;
    const sIdx = (seed + i * 2) % scores.length;
    list.push({
      id: `game_gen_${i}`,
      title: `REVIEW: ${games[gIdx]}`,
      summary: `Our full verdict is in. Is ${games[gIdx]} the ${verdicts[vIdx]} we were promised? Click to read the full breakdown of graphics, gameplay, and story.`,
      score: scores[sIdx],
      verdict: verdicts[vIdx],
      image: `https://picsum.photos/seed/game${i}/800/600`,
      category: "Gaming"
    });
  }
  return list;
};

// --- COMPONENTS ---

const BirthChartWidget = () => {
  const [formData, setFormData] = useState({ name: "", dob: "", time: "", place: "" });
  const [loading, setLoading] = useState(false);
  const [reading, setReading] = useState("");

  const handlePersonalReading = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setReading(`✨ ${formData.name}'s Chart: Sun in Scorpio, Moon in Libra. A lucky week ahead for creative ventures!`);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-lg border border-slate-800">
       <h3 className="font-bold text-lg mb-4 flex items-center text-purple-300">
         <Sparkles className="h-5 w-5 mr-2" /> AI Birth Chart Analyzer
       </h3>
       <form onSubmit={handlePersonalReading} className="space-y-3">
         <input 
           placeholder="Your Full Name" 
           className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm text-white focus:border-purple-500 outline-none transition-colors placeholder-slate-500" 
           onChange={e => setFormData({...formData, name: e.target.value})} 
           required
         />
         <div className="flex gap-3">
           <div className="relative w-1/2">
             <input type="date" className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm text-white focus:border-purple-500 outline-none transition-colors" onChange={e => setFormData({...formData, dob: e.target.value})} required />
           </div>
           <div className="relative w-1/2">
             <input type="time" className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm text-white focus:border-purple-500 outline-none transition-colors" onChange={e => setFormData({...formData, time: e.target.value})} required />
           </div>
         </div>
         <input placeholder="City of Birth" className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm text-white focus:border-purple-500 outline-none transition-colors placeholder-slate-500" onChange={e => setFormData({...formData, place: e.target.value})} required />
         <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg transition-all shadow-lg shadow-purple-900/50 text-sm mt-2">
           {loading ? <span className="flex items-center justify-center"><Loader className="animate-spin mr-2 h-4 w-4"/> Analyzing...</span> : "Generate Full Analysis"}
         </button>
       </form>
       {reading && (
         <div className="mt-4 p-3 bg-purple-900/30 rounded-lg border border-purple-500/30 text-purple-100 text-sm animate-fade-in">
           {reading}
         </div>
       )}
    </div>
  );
};

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
    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg border border-blue-400 p-6 mb-6 text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full blur-2xl"></div>
      <div className="flex items-center justify-between mb-4 relative z-10">
        <h3 className="font-medium text-sm uppercase tracking-wider text-blue-100">Local Conditions</h3>
        <MapPin className="h-4 w-4 text-blue-100" />
      </div>
      <div className="flex items-center relative z-10">
        <Sun className="h-10 w-10 text-yellow-300 mr-4 animate-pulse" />
        <div>
          <div className="text-3xl font-bold">{Math.round(weather.temperature)}°C</div>
          <div className="text-xs text-blue-100">Wind: {weather.windspeed} km/h</div>
        </div>
      </div>
    </div>
  );
};

const PollWidget = () => {
  const [voted, setVoted] = useState(false);
  const [counts, setCounts] = useState({ a: 45, b: 32, c: 23 });

  const handleVote = (option) => {
    if(voted) return;
    setCounts(prev => ({...prev, [option]: prev[option] + 1}));
    setVoted(true);
  };
  const total = counts.a + counts.b + counts.c;
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6 shadow-sm">
      <h3 className="font-bold text-gray-800 mb-4 flex items-center"><Vote className="h-5 w-5 mr-2 text-indigo-500"/> Daily Poll</h3>
      <p className="text-sm text-gray-600 mb-4">Should AI be regulated like nuclear weapons?</p>
      {!voted ? (
        <div className="space-y-2">
          <button onClick={() => handleVote('a')} className="w-full text-left px-4 py-2 rounded-lg bg-gray-50 hover:bg-indigo-50 text-sm font-medium transition text-gray-700 hover:text-indigo-600 border border-gray-200 hover:border-indigo-200">Yes, strictly.</button>
          <button onClick={() => handleVote('b')} className="w-full text-left px-4 py-2 rounded-lg bg-gray-50 hover:bg-indigo-50 text-sm font-medium transition text-gray-700 hover:text-indigo-600 border border-gray-200 hover:border-indigo-200">No, innovation first.</button>
          <button onClick={() => handleVote('c')} className="w-full text-left px-4 py-2 rounded-lg bg-gray-50 hover:bg-indigo-50 text-sm font-medium transition text-gray-700 hover:text-indigo-600 border border-gray-200 hover:border-indigo-200">I'm not sure.</button>
        </div>
      ) : (
        <div className="space-y-3">
          {[
            { l: 'Yes', v: counts.a, c: 'bg-green-500' },
            { l: 'No', v: counts.b, c: 'bg-red-500' },
            { l: 'Unsure', v: counts.c, c: 'bg-gray-400' }
          ].map((item, i) => (
            <div key={i}>
              <div className="flex justify-between text-xs mb-1">
                <span>{item.l}</span>
                <span>{Math.round((item.v/total)*100)}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full ${item.c} transition-all duration-1000`} style={{width: `${(item.v/total)*100}%`}}></div>
              </div>
            </div>
          ))}
          <p className="text-xs text-center text-gray-400 mt-2">Thanks for voting!</p>
        </div>
      )}
    </div>
  );
};

const SmartImage = ({ article, type = "news" }) => {
  const [imgSrc, setImgSrc] = useState(article.image || `https://picsum.photos/seed/${(article.title || 'news').replace(/\s+/g, '')}/800/600`);
  const [hasError, setHasError] = useState(false);
  
  useEffect(() => {
    setImgSrc(article.image || `https://picsum.photos/seed/${(article.title || 'news').replace(/\s+/g, '')}/800/600`);
    setHasError(false);
  }, [article]);

  const handleError = () => {
    if (!hasError) {
        setHasError(true);
        const safeSeed = (article.title || 'news').replace(/[^a-zA-Z0-9]/g, '');
        setImgSrc(`https://picsum.photos/seed/${safeSeed}/800/600`);
    }
  };

  return (
    <div className={`w-full ${type === 'hero' ? 'h-64' : 'sm:w-32 h-32'} shrink-0 relative overflow-hidden rounded-lg bg-gray-100`}>
      <img 
        src={imgSrc} 
        alt={article.title} 
        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" 
        onError={handleError}
      />
    </div>
  );
};

const LiveAiTicker = ({ articles }) => {
  const [insight, setInsight] = useState("AI is analyzing global trends...");
  
  useEffect(() => {
    if (articles.length === 0) return;
    const interval = setInterval(() => {
      const randomArticle = articles[Math.floor(Math.random() * articles.length)];
      if(randomArticle && randomArticle.title) {
        setInsight(`BREAKING ANALYSIS: ${randomArticle.title.slice(0, 60)}... Impacting ${randomArticle.category} sector.`);
      }
    }, 5000);
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

// --- PAGES ---

// 1. MARKETS (EXISTING)
const MarketsPage = ({ onArticleClick }) => {
  const [coins, setCoins] = useState([
    { name: "Bitcoin", sym: "BTC", price: 64230, change: 2.4, color: "text-orange-500", data: [60,62,61,63,64,65,64] },
    { name: "Ethereum", sym: "ETH", price: 3450, change: -1.2, color: "text-purple-500", data: [35,36,35,34,33,34,34] },
    { name: "Solana", sym: "SOL", price: 145, change: 5.7, color: "text-green-500", data: [120,130,125,135,140,142,145] },
    { name: "S&P 500", sym: "SPX", price: 5120, change: 0.4, color: "text-blue-500", data: [50,50,51,51,51,52,51] },
    { name: "Tesla", sym: "TSLA", price: 178, change: -3.4, color: "text-red-500", data: [190,185,182,180,175,176,178] },
    { name: "Nvidia", sym: "NVDA", price: 890, change: 1.2, color: "text-green-600", data: [850,860,870,880,885,888,890] },
  ]);
  const news = useMemo(() => generateMarketNews(), []);
  useEffect(() => {
    const interval = setInterval(() => {
      setCoins(prev => prev.map(c => ({
        ...c,
        price: c.price * (1 + (Math.random() * 0.002 - 0.001)),
        data: [...c.data.slice(1), c.data[6] * (1 + (Math.random() * 0.1 - 0.05))]
      })));
    }, 2000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <TrendingUp className="h-8 w-8 text-blue-600 mr-3" />
        <h1 className="text-3xl font-bold text-gray-800">Global Markets</h1>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {coins.map(c => (
          <div key={c.sym} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
             <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                   <div className={`p-2 rounded-lg bg-gray-50 ${c.color}`}><DollarSign className="h-6 w-6" /></div>
                   <div><h3 className="font-bold text-gray-900">{c.name}</h3><span className="text-xs font-bold text-gray-400">{c.sym}</span></div>
                </div>
                <div className={`text-sm font-bold flex items-center ${c.change > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {c.change > 0 ? '+' : ''}{c.change}%{c.change > 0 ? <TrendingUp className="h-3 w-3 ml-1"/> : <TrendingDown className="h-3 w-3 ml-1"/>}
                </div>
             </div>
             <div className="text-2xl font-bold text-gray-900 mb-4">${c.price.toLocaleString(undefined, {maximumFractionDigits: 2})}</div>
             <div className="flex items-end gap-1 h-16 w-full opacity-50">
                {c.data.map((h, i) => (<div key={i} className={`flex-1 rounded-t-sm ${c.change > 0 ? 'bg-green-400' : 'bg-red-400'} transition-all duration-500`} style={{height: `${(h / Math.max(...c.data)) * 100}%`}}></div>))}
             </div>
          </div>
        ))}
      </div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center"><Newspaper className="h-6 w-6 mr-2 text-blue-600"/> Financial News Wire</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {news.map((item, i) => (
             <div key={i} onClick={() => onArticleClick(item)} className="flex bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 group hover:shadow-md transition cursor-pointer">
                <div className="w-1/3 relative overflow-hidden"><img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="market news" /></div>
                <div className="w-2/3 p-4 flex flex-col justify-between">
                   <div>
                      <div className="flex justify-between items-center mb-1"><span className="text-xs font-bold text-blue-600">{item.source}</span><span className="text-xs text-gray-400">{item.time}</span></div>
                      <h3 className="font-bold text-gray-900 leading-tight mb-2 group-hover:text-blue-600 transition-colors">{item.title}</h3>
                   </div>
                </div>
             </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// 2. HISTORY (EXISTING)
const HistoryPage = () => {
  const events = useMemo(() => generateHistoryEvents(), []);
  return (
    <div className="p-6 bg-stone-50 min-h-screen">
      <div className="flex items-center mb-8 justify-center">
        <History className="h-8 w-8 text-stone-700 mr-3" />
        <h1 className="text-3xl font-serif font-bold text-stone-900">Time Capsule: On This Day</h1>
      </div>
      <div className="max-w-4xl mx-auto relative">
         <div className="absolute left-1/2 top-0 bottom-0 w-px bg-stone-300 transform -translate-x-1/2 hidden md:block"></div>
         {events.map((e, i) => (
           <div key={i} className={`flex items-center justify-between mb-8 flex-col md:flex-row ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
              <div className="w-full md:w-5/12"></div>
              <div className="z-10 bg-stone-200 border-4 border-white rounded-full h-12 w-12 flex items-center justify-center font-bold text-stone-700 text-xs shadow-sm shrink-0 my-4 md:my-0">{e.year}</div>
              <div className="w-full md:w-5/12 bg-white p-6 rounded-lg shadow-sm border border-stone-200 hover:shadow-md transition">
                 <h3 className="font-serif font-bold text-xl text-stone-800 mb-1">{e.event}</h3>
                 <span className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-2 block">{e.location}</span>
                 <p className="text-stone-600 text-sm leading-relaxed">{e.desc}</p>
              </div>
           </div>
         ))}
      </div>
    </div>
  );
};

// 3. CONSPIRACY THEORIES (EXISTING)
const ConspiracyPage = ({ onArticleClick }) => {
  const theories = useMemo(() => generateConspiracies(), []);
  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <Skull className="h-8 w-8 text-purple-600 mr-3" />
        <h1 className="text-3xl font-bold text-gray-800">The Unexplained Files</h1>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {theories.map(t => (
          <div key={t.id} onClick={() => onArticleClick(t)} className="bg-gray-900 text-white rounded-xl overflow-hidden shadow-lg hover:shadow-purple-500/20 transition-all cursor-pointer group">
            <div className="h-48 overflow-hidden"><img src={t.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt="theory" onError={(e) => e.target.src=`https://picsum.photos/seed/${t.id}/800/600`} /></div>
            <div className="p-5">
              <h3 className="text-xl font-bold mb-2 text-purple-300">{t.title}</h3>
              <p className="text-gray-400 text-sm">{t.summary}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 4. GAMING (NEW)
const GamingPage = ({ articles, onArticleClick }) => {
  const reviews = useMemo(() => generateGameReviews(), []);
  const gamingNews = articles.filter(a => a.category === "Gaming");

  return (
    <div className="p-6 bg-slate-950 text-white min-h-screen">
      <div className="flex items-center mb-8">
        <Gamepad2 className="h-8 w-8 text-emerald-500 mr-3" />
        <h1 className="text-3xl font-bold tracking-tighter">Gaming<span className="text-emerald-500">Zone</span></h1>
      </div>

      {/* Featured Reviews */}
      <h2 className="text-xl font-bold mb-4 flex items-center text-emerald-400"><Sparkles className="h-4 w-4 mr-2"/> Top Critic Reviews</h2>
      <div className="grid md:grid-cols-4 gap-4 mb-10">
        {reviews.map((game, i) => (
          <div key={i} onClick={() => onArticleClick(game)} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden group hover:border-emerald-500/50 transition-all relative cursor-pointer">
            <div className="absolute top-2 right-2 bg-emerald-600 text-white font-bold text-sm px-2 py-1 rounded shadow-lg z-10">{game.score}</div>
            <div className="h-32 overflow-hidden"><img src={game.image} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" alt="game" /></div>
            <div className="p-4">
              <h3 className="font-bold text-lg leading-tight mb-1 truncate">{game.title.replace('REVIEW: ', '')}</h3>
              <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-2">{game.verdict}</p>
            </div>
          </div>
        ))}
      </div>

      {/* News Feed */}
      <h2 className="text-xl font-bold mb-4 flex items-center text-white"><Zap className="h-4 w-4 mr-2"/> Latest Headlines</h2>
      <div className="space-y-4">
        {gamingNews.length > 0 ? gamingNews.map((news, i) => (
          <div key={i} onClick={() => onArticleClick(news)} className="flex bg-slate-900/50 border border-slate-800 p-4 rounded-xl hover:bg-slate-800 transition cursor-pointer gap-4 items-center group">
            <div className="w-24 h-16 bg-slate-800 rounded overflow-hidden shrink-0">
               <img src={news.image} className="w-full h-full object-cover" alt="thumb" onError={(e)=>e.target.src=`https://picsum.photos/seed/${news.title.replace(/\s+/g,'')}/200/200`}/>
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-200 group-hover:text-emerald-400">{news.title}</h3>
              <div className="flex gap-2 text-xs text-slate-500 mt-1"><span>{news.source}</span><span>•</span><span>{news.time}</span></div>
            </div>
          </div>
        )) : (
          <div className="text-center text-slate-600 py-10">Loading gaming news feeds...</div>
        )}
      </div>
    </div>
  );
};

// 5. MOVIE LOVERS (EXISTING)
const MovieLoversPage = ({ onArticleClick }) => {
  const news = useMemo(() => generateMovieNews(), []);
  return (
    <div className="p-6 bg-black min-h-screen text-white">
      <div className="flex items-center mb-8">
        <Film className="h-8 w-8 text-red-600 mr-3" />
        <div><h1 className="text-3xl font-bold">Cinema & Streaming AI Feed</h1></div>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.map((item, i) => (
           <div key={i} onClick={() => onArticleClick(item)} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden group cursor-pointer hover:border-red-600 transition-colors">
              <div className="h-48 overflow-hidden relative">
                 <img src={item.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="movie" />
                 <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded shadow-sm">LIVE FEED</div>
              </div>
              <div className="p-5">
                 <h3 className="text-lg font-bold mb-2 leading-tight group-hover:text-red-400 transition-colors">{item.title}</h3>
                 <p className="text-gray-400 text-sm line-clamp-2">{item.summary}</p>
              </div>
           </div>
        ))}
      </div>
    </div>
  );
};

// 6. HEALTH & FITNESS (EXISTING)
const HealthPage = ({ onArticleClick }) => {
  const tips = useMemo(() => generateHealthTips(), []);
  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <Activity className="h-8 w-8 text-green-600 mr-3" />
        <h1 className="text-3xl font-bold text-gray-800">Daily Vitality</h1>
      </div>
      <div className="grid md:grid-cols-2 gap-8">
        {tips.map((tip, i) => (
          <div key={i} onClick={() => onArticleClick(tip)} className="flex bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer">
            <div className="w-1/3"><img src={tip.img} className="w-full h-full object-cover" alt="health" onError={(e) => e.target.src=`https://picsum.photos/seed/${tip.id}/800/600`} /></div>
            <div className="w-2/3 p-5 flex flex-col justify-center">
              <h3 className="font-bold text-lg text-gray-800 mb-2">{tip.title}</h3>
              <p className="text-sm text-gray-600">{tip.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 7. GOOD READS (EXISTING)
const GoodReadsPage = () => {
  const quotes = useMemo(() => generateQuotes(), []);
  return (
    <div className="p-6 bg-amber-50 min-h-screen">
      <div className="flex items-center mb-8 justify-center">
        <BookOpen className="h-8 w-8 text-amber-700 mr-3" />
        <h1 className="text-3xl font-serif font-bold text-amber-900">The Wisdom Archive</h1>
      </div>
      <div className="max-w-3xl mx-auto space-y-8">
        {quotes.map((q, i) => (
          <div key={i} className="bg-white p-8 rounded-lg shadow-md border-l-4 border-amber-500 relative">
            <span className="absolute top-4 left-4 text-6xl text-amber-100 font-serif">"</span>
            <p className="text-xl font-serif text-gray-800 italic relative z-10 mb-4">{q.text}</p>
            <div className="flex justify-between items-center">
              <span className="font-bold text-amber-800">— {q.author}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 8. HOROSCOPE (EXISTING)
const HoroscopePage = () => {
  const [sign, setSign] = useState(null);
  const [reading, setReading] = useState("");
  const [formData, setFormData] = useState({ name: "", dob: "", time: "", place: "" });
  const [loading, setLoading] = useState(false);

  const getDailyHoroscope = (signName) => {
    const today = new Date().getDate(); 
    const aspects = ["finance", "romance", "health", "career"];
    const planets = ["Mercury", "Venus", "Mars", "Jupiter", "Saturn"];
    const aspect = aspects[(today + signName.length) % aspects.length];
    const planet = planets[(today * signName.length) % planets.length];
    return `Today, ${planet} moves into alignment affecting your ${aspect} sector. Expect significant shifts in energy around midday. Use this time to reflect on recent choices.`;
  };

  const handlePersonalReading = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setReading(`ASTRAL REPORT FOR ${formData.name.toUpperCase()}:\n\nBased on your birth chart at ${formData.time} in ${formData.place}, your Sun is strong today.\n\nKEY INSIGHT: A trine between your natal Moon and transiting Jupiter indicates a stroke of luck.`);
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="p-6 bg-slate-900 text-slate-100 min-h-screen">
      <div className="flex items-center mb-8 justify-center">
        <Moon className="h-8 w-8 text-purple-400 mr-3" />
        <h1 className="text-3xl font-bold text-white">Cosmic Insights ({new Date().toLocaleDateString()})</h1>
      </div>
      <div className="grid md:grid-cols-2 gap-10 max-w-6xl mx-auto">
        <div>
          <h3 className="text-xl font-bold text-purple-300 mb-4">Daily Readings</h3>
          <div className="grid grid-cols-3 gap-3">
            {["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"].map(s => (
              <button key={s} onClick={() => setSign(s)} className={`p-3 rounded-lg text-sm font-medium transition-all ${sign === s ? 'bg-purple-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'}`}>{s}</button>
            ))}
          </div>
          {sign && (
            <div className="mt-6 p-6 bg-slate-800 rounded-xl border border-purple-500/50 animate-fade-in shadow-xl shadow-purple-900/20">
              <h4 className="font-bold text-2xl text-white mb-2">{sign}</h4>
              <p className="text-purple-200 text-lg italic mb-4 leading-relaxed">{getDailyHoroscope(sign)}</p>
            </div>
          )}
        </div>
        <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
          <h3 className="text-xl font-bold text-purple-300 mb-4 flex items-center"><Sparkles className="h-5 w-5 mr-2" /> AI Birth Chart Analyzer</h3>
          <form onSubmit={handlePersonalReading} className="space-y-4">
            <input placeholder="Your Full Name" className="w-full bg-slate-900 border border-slate-700 rounded p-3 text-white focus:border-purple-500 outline-none" onChange={e => setFormData({...formData, name: e.target.value})} />
            <div className="flex gap-4">
              <input type="date" className="w-1/2 bg-slate-900 border border-slate-700 rounded p-3 text-white" onChange={e => setFormData({...formData, dob: e.target.value})} />
              <input type="time" className="w-1/2 bg-slate-900 border border-slate-700 rounded p-3 text-white" onChange={e => setFormData({...formData, time: e.target.value})} />
            </div>
            <input placeholder="City of Birth" className="w-full bg-slate-900 border border-slate-700 rounded p-3 text-white" onChange={e => setFormData({...formData, place: e.target.value})} />
            <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg transition shadow-lg shadow-purple-900/50">
              {loading ? <span className="flex items-center justify-center"><Loader className="animate-spin mr-2"/> Consulting the Stars...</span> : "Generate Full Analysis"}
            </button>
          </form>
          {reading && <div className="mt-6 p-6 bg-purple-900/20 rounded-xl border border-purple-500/30 text-purple-100 whitespace-pre-line leading-relaxed animate-fade-in">{reading}</div>}
        </div>
      </div>
    </div>
  );
};

// 9. CRYPTO WATCH (NEW)
const CryptoPage = ({ articles, onArticleClick }) => {
  const cryptoNews = articles.filter(a => a.category === "Crypto");
  const [prices, setPrices] = useState([
    { name: "Bitcoin", sym: "BTC", price: 65120, change: 1.2 },
    { name: "Ethereum", sym: "ETH", price: 3450, change: -0.5 },
    { name: "Solana", sym: "SOL", price: 148, change: 4.2 },
    { name: "Cardano", sym: "ADA", price: 0.45, change: 0.8 },
    { name: "XRP", sym: "XRP", price: 0.62, change: -1.1 },
    { name: "Dogecoin", sym: "DOGE", price: 0.16, change: 8.4 },
  ]);

  return (
    <div className="p-6 bg-indigo-950 min-h-screen text-indigo-50">
      <div className="flex items-center mb-8">
        <Bitcoin className="h-8 w-8 text-yellow-400 mr-3" />
        <h1 className="text-3xl font-bold text-white">Crypto Watch</h1>
      </div>
      
      {/* Ticker Tape */}
      <div className="flex gap-4 mb-8 overflow-x-auto pb-4">
        {prices.map(c => (
          <div key={c.sym} className="bg-indigo-900/50 border border-indigo-800 p-4 rounded-xl min-w-[200px]">
             <div className="flex justify-between mb-2">
               <span className="font-bold">{c.sym}</span>
               <span className={`text-xs ${c.change>0 ? 'text-green-400' : 'text-red-400'}`}>{c.change > 0 ? '+' : ''}{c.change}%</span>
             </div>
             <div className="text-2xl font-mono">${c.price.toLocaleString()}</div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {cryptoNews.length > 0 ? cryptoNews.map((news, i) => (
          <div key={i} onClick={() => onArticleClick(news)} className="bg-indigo-900 border border-indigo-800 rounded-xl overflow-hidden hover:border-indigo-600 transition cursor-pointer">
             <div className="h-40 overflow-hidden"><img src={news.image} className="w-full h-full object-cover" alt="crypto" onError={(e)=>e.target.src=`https://picsum.photos/seed/${news.title.replace(/\s+/g,'')}/200/200`}/></div>
             <div className="p-4">
                <span className="text-xs text-indigo-400 font-bold mb-2 block">{news.source}</span>
                <h3 className="font-bold text-white mb-2">{news.title}</h3>
             </div>
          </div>
        )) : <div className="col-span-3 text-center py-12 text-indigo-400">Loading blockchain data...</div>}
      </div>
    </div>
  );
};

// 10. LIFESTYLE (NEW)
const LifestylePage = ({ articles, onArticleClick }) => {
  const lifestyleNews = articles.filter(a => a.category === "Lifestyle");
  return (
     <div className="p-6 bg-stone-100 min-h-screen">
        <div className="flex items-center mb-8 justify-center">
           <Coffee className="h-8 w-8 text-stone-600 mr-3" />
           <h1 className="text-3xl font-serif text-stone-800 italic">Modern Living</h1>
        </div>
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
           {lifestyleNews.length > 0 ? lifestyleNews.map((item, i) => (
              <div key={i} onClick={() => onArticleClick(item)} className="break-inside-avoid bg-white p-4 rounded-none shadow-lg border-b-4 border-stone-800 cursor-pointer hover:shadow-xl transition-shadow">
                 <div className="mb-4 overflow-hidden"><img src={item.image} className="w-full object-cover grayscale hover:grayscale-0 transition-all duration-700" alt="style" onError={(e)=>e.target.src=`https://picsum.photos/seed/${item.title.replace(/\s+/g,'')}/400/500`}/></div>
                 <h3 className="font-serif text-xl font-bold text-stone-900 mb-2">{item.title}</h3>
                 <p className="text-stone-600 text-sm font-light leading-relaxed">{item.summary}</p>
                 <div className="mt-4 pt-4 border-t border-stone-100 flex justify-between items-center">
                    <span className="text-xs font-bold tracking-widest uppercase text-stone-400">{item.source}</span>
                 </div>
              </div>
           )) : <div className="text-center py-20 text-stone-500">Curating the latest trends...</div>}
        </div>
     </div>
  );
};

// --- ARTICLE READER (EXISTING) ---
const ArticleReader = ({ article, allArticles, onClose, onSelectArticle }) => {
  const [fullContent, setFullContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [imgError, setImgError] = useState(false);

  const suggestedArticles = allArticles.filter(a => a.id !== article.id && a.category === article.category).slice(0, 3);

  useEffect(() => {
    setLoading(true);
    setFullContent("");
    setImgError(false);
    
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
          <img 
             src={imgError ? `https://picsum.photos/seed/${(article.title || 'news').replace(/[^a-zA-Z0-9]/g, '')}/800/600` : article.image} 
             onError={() => setImgError(true)}
             alt={article.title} 
             className="w-full h-full object-cover opacity-90" 
          />
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
              <a href={article.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                Read on {article.source} <ExternalLink className="h-4 w-4 ml-2" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- MAIN APP ---
const App = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [activeTab, setActiveTab] = useState("Home");
  const [searchQuery, setSearchQuery] = useState(""); 
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [user, setUser] = useState(null);
  const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  // --- AUTHENTICATION ---
  useEffect(() => {
    if (!auth) return;
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (err) {
        console.error("Auth failed:", err);
      }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  // --- GLOBAL FETCH ENGINE ---
  const fetchNews = async () => {
    setLoading(true);
    let allNews = [];
    
    // 1. Fetch Standard RSS Feeds
    const rssPromises = NEWS_SOURCES.map(async (source) => {
      try {
        const res = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(source.url)}`);
        const data = await res.json();
        if (data.items) {
          return data.items.map(item => ({
            id: item.guid || item.link,
            title: item.title,
            source: source.name,
            time: new Date(item.pubDate).toLocaleTimeString([], { hour: '2-digit', minute:'2-digit' }),
            image: item.thumbnail || item.enclosure?.link,
            category: source.category,
            summary: item.description ? item.description.replace(/<[^>]*>?/gm, '').slice(0, 150) + "..." : "Click to read full coverage...",
            link: item.link,
            content: item.content
          }));
        }
        return [];
      } catch (e) { return []; }
    });

    // 2. Generate Special Content 
    const movies = generateMovieNews().slice(0, 5).map(m => ({ ...m, category: "Movies", time: "Fresh Scoop" }));
    const markets = generateMarketNews().slice(0, 5).map(m => ({ ...m, category: "Markets", time: "Live Market" }));
    const conspiracies = generateConspiracies().slice(0, 5).map(c => ({ ...c, source: "Declassified", time: "Unknown", link: "#" }));
    const health = generateHealthTips().slice(0, 5).map(h => ({ ...h, source: "Health AI", time: "Daily Tip", link: "#" }));
    const games = generateGameReviews().slice(0, 4).map(g => ({ ...g, source: "Gaming AI", time: "Review", link: "#" })); // Add mock games to main feed too

    const rssResults = await Promise.all(rssPromises);
    const flatRss = rssResults.flat();

    allNews = [...flatRss, ...movies, ...markets, ...conspiracies, ...health, ...games];
    allNews = allNews.sort(() => Math.random() - 0.5);

    setArticles(allNews.slice(0, 200));
    setLoading(false);
  };

  useEffect(() => {
    fetchNews();
    const interval = setInterval(fetchNews, 60000); 
    return () => clearInterval(interval);
  }, []);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if(newsletterEmail && db && user) {
        try {
            // Updated to use the correct public data path for this environment
            await addDoc(collection(db, 'artifacts', appId, 'public', 'data', "newsletter_subs"), { 
              email: newsletterEmail, 
              time: serverTimestamp(),
              uid: user.uid
            });
            alert("Subscribed successfully!");
            setNewsletterEmail("");
        } catch(e) { 
          console.error(e);
          alert("Error subscribing. Please try again."); 
        }
    } else {
        alert("Subscribed! (Demo Mode - Database not connected)");
        setNewsletterEmail("");
    }
  };

  const renderContent = () => {
    if (activeTab === "Conspiracy") return <ConspiracyPage onArticleClick={setSelectedArticle} />;
    if (activeTab === "MovieLovers") return <MovieLoversPage onArticleClick={setSelectedArticle} />; 
    if (activeTab === "Health") return <HealthPage onArticleClick={setSelectedArticle} />;
    if (activeTab === "GoodReads") return <GoodReadsPage />;
    if (activeTab === "Horoscope") return <HoroscopePage />;
    if (activeTab === "Markets") return <MarketsPage onArticleClick={setSelectedArticle} />;
    if (activeTab === "History") return <HistoryPage />;
    if (activeTab === "Gaming") return <GamingPage articles={articles} onArticleClick={setSelectedArticle} />;
    if (activeTab === "Crypto") return <CryptoPage articles={articles} onArticleClick={setSelectedArticle} />;
    if (activeTab === "Lifestyle") return <LifestylePage articles={articles} onArticleClick={setSelectedArticle} />;

    const displayArticles = articles.filter(article => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return article.title.toLowerCase().includes(q) || article.source.toLowerCase().includes(q);
      }
      return true; 
    });

    return (
      <div className="lg:col-span-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-light text-gray-800">{searchQuery ? `Search: "${searchQuery}"` : "Your Unified Feed"}</h1>
            <p className="text-gray-500 text-sm mt-1">{currentDate} • {articles.length} Stories Loaded</p>
          </div>
        </div>
        <div className="space-y-6">
          {loading && articles.length === 0 ? (
             <div className="text-center py-20 text-gray-400 flex flex-col items-center"><Loader className="h-8 w-8 animate-spin mb-4 text-blue-500" />Connecting to global satellites...</div>
          ) : displayArticles.length === 0 ? (
             <div className="text-center py-20 text-gray-500 bg-gray-50 rounded-xl">No recent articles found.</div>
          ) : (
              displayArticles.map((article, idx) => (
                <div key={idx} onClick={() => setSelectedArticle(article)} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col sm:flex-row gap-6 group">
                   <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                         <span className={`text-xs font-bold px-2 py-0.5 rounded text-white ${
                           article.category === 'Conspiracy' ? 'bg-purple-600' :
                           article.category === 'Movies' ? 'bg-red-600' :
                           article.category === 'Markets' ? 'bg-blue-600' :
                           article.category === 'Crypto' ? 'bg-indigo-600' :
                           article.category === 'Gaming' ? 'bg-emerald-600' :
                           article.category === 'Health' ? 'bg-green-600' :
                           article.category === 'Lifestyle' ? 'bg-stone-500' :
                           'bg-gray-800'
                         }`}>{article.category || 'News'}</span>
                         <span className="text-xs font-bold text-gray-800">{article.source}</span>
                         <span className="text-xs text-gray-400">• {article.time}</span>
                      </div>
                      <h3 className="text-xl font-serif font-medium text-gray-900 leading-tight mb-2 group-hover:text-blue-700">{article.title}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2">{article.summary}</p>
                   </div>
                   <SmartImage article={article} />
                </div>
              ))
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 flex flex-col">
      {selectedArticle && <ArticleReader article={selectedArticle} allArticles={articles} onClose={() => setSelectedArticle(null)} onSelectArticle={setSelectedArticle} />}
      <LiveAiTicker articles={articles} />
      <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => setActiveTab("Home")}>
             <Menu className="h-6 w-6 text-gray-500 md:hidden" />
             <span className="text-2xl tracking-tighter text-gray-700">News<span className="font-bold text-blue-600">AI</span></span>
          </div>
          <div className="hidden md:flex flex-1 max-w-xl mx-8 relative">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search 25+ global sources..." className="w-full bg-gray-100 rounded-lg py-2.5 pl-10 pr-4 focus:bg-white focus:ring-2 ring-blue-100 outline-none transition-all" />
          </div>
          <div className="flex items-center gap-3">
             <button onClick={fetchNews} className="hidden md:flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-all">
                {loading ? <Loader className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                {loading ? "Updating..." : "Refresh"}
             </button>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-6 overflow-x-auto py-3 scrollbar-hide text-sm font-medium text-gray-500 border-b border-gray-100">
          <button onClick={() => setActiveTab("Home")} className={`whitespace-nowrap pb-2 border-b-2 ${activeTab === "Home" ? 'border-blue-600 text-blue-600' : 'border-transparent'}`}>Home</button>
          <button onClick={() => setActiveTab("Markets")} className={`whitespace-nowrap pb-2 border-b-2 ${activeTab === "Markets" ? 'border-blue-600 text-blue-600' : 'border-transparent'}`}>Markets</button>
          <button onClick={() => setActiveTab("Crypto")} className={`whitespace-nowrap pb-2 border-b-2 ${activeTab === "Crypto" ? 'border-indigo-600 text-indigo-600' : 'border-transparent'}`}>Crypto</button>
          <button onClick={() => setActiveTab("Gaming")} className={`whitespace-nowrap pb-2 border-b-2 ${activeTab === "Gaming" ? 'border-emerald-600 text-emerald-600' : 'border-transparent'}`}>Gaming</button>
          <button onClick={() => setActiveTab("Lifestyle")} className={`whitespace-nowrap pb-2 border-b-2 ${activeTab === "Lifestyle" ? 'border-stone-500 text-stone-500' : 'border-transparent'}`}>Lifestyle</button>
          <button onClick={() => setActiveTab("MovieLovers")} className={`whitespace-nowrap pb-2 border-b-2 ${activeTab === "MovieLovers" ? 'border-red-600 text-red-600' : 'border-transparent'}`}>Movies</button>
          <button onClick={() => setActiveTab("Conspiracy")} className={`whitespace-nowrap pb-2 border-b-2 ${activeTab === "Conspiracy" ? 'border-purple-600 text-purple-600' : 'border-transparent'}`}>Conspiracy</button>
          <button onClick={() => setActiveTab("Health")} className={`whitespace-nowrap pb-2 border-b-2 ${activeTab === "Health" ? 'border-green-600 text-green-600' : 'border-transparent'}`}>Health</button>
          <button onClick={() => setActiveTab("History")} className={`whitespace-nowrap pb-2 border-b-2 ${activeTab === "History" ? 'border-stone-600 text-stone-600' : 'border-transparent'}`}>History</button>
          <button onClick={() => setActiveTab("GoodReads")} className={`whitespace-nowrap pb-2 border-b-2 ${activeTab === "GoodReads" ? 'border-amber-600 text-amber-600' : 'border-transparent'}`}>Reads</button>
          <button onClick={() => setActiveTab("Horoscope")} className={`whitespace-nowrap pb-2 border-b-2 ${activeTab === "Horoscope" ? 'border-indigo-600 text-indigo-600' : 'border-transparent'}`}>Horoscope</button>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1">
        {["Conspiracy", "Health", "GoodReads", "Horoscope", "Markets", "History", "MovieLovers", "Gaming", "Crypto", "Lifestyle"].includes(activeTab) ? (
          <div className="lg:col-span-12">{renderContent()}</div>
        ) : (
          <>
            {renderContent()}
            <div className="lg:col-span-4 space-y-6">
              <WeatherWidget />
              <PollWidget />
              <BirthChartWidget />
              <div className="bg-blue-600 rounded-2xl p-6 text-white relative overflow-hidden">
                  <div className="relative z-10">
                    <h3 className="font-bold text-lg mb-2 flex items-center"><Mail className="h-5 w-5 mr-2" /> Daily Intelligence</h3>
                    <p className="text-blue-100 text-sm mb-4">Get the 5 most important global stories delivered to your inbox.</p>
                    <form onSubmit={handleSubscribe}>
                        <input type="email" value={newsletterEmail} onChange={e => setNewsletterEmail(e.target.value)} placeholder="Your email address" className="w-full px-4 py-2 rounded-lg text-gray-900 text-sm mb-2 outline-none text-black" />
                        <button className="w-full bg-blue-800 hover:bg-blue-900 py-2 rounded-lg text-sm font-medium transition">Subscribe</button>
                    </form>
                  </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default App;