import React, { useState, useEffect, useRef } from 'react';
import { 
  Newspaper, RefreshCw, DollarSign, ExternalLink, TrendingUp, Clock, 
  Share2, Menu, X, Info, MessageCircle, ArrowLeft, Send, ThumbsUp, User, Globe, Cpu, Briefcase, Vote
} from 'lucide-react';

// --- MOCK DATABASE (Global Sources) ---
const MOCK_NEWS_DATABASE = [
  // POLITICS
  { 
    title: "G20 Summit Ends with Historic Agreement on Digital Tax", 
    category: "Politics", 
    summary: "World leaders have unanimously agreed to a new framework for taxing digital giants...", 
    fullContent: "In a landmark decision, G20 leaders gathered in Rio de Janeiro have signed the 'Global Digital Taxation Pact'. This agreement forces multinational tech conglomerates to pay taxes in the countries where they generate revenue, rather than where their headquarters are located. \n\n'This levels the playing field for local businesses,' stated the French President. Implementation is set to begin in 2026, though some industry lobbyists warn it could stifle innovation.",
    source: "Global Politics Wire", 
    image: "https://images.unsplash.com/photo-1529101091760-6149d4c46b29?auto=format&fit=crop&q=80&w=800"
  },
  { 
    title: "Election Update: Early Polls Show Shift in Voter Sentiment", 
    category: "Politics", 
    summary: "New data from key swing states suggests a tightening race as economic issues take center stage...", 
    fullContent: "With less than a month until the general election, the latest aggregate of polls shows the incumbent's lead shrinking to within the margin of error. Economic stability and healthcare costs have emerged as the primary concerns for 60% of surveyed voters, overtaking immigration and foreign policy.",
    source: "PolyGraph AI", 
    image: "https://images.unsplash.com/photo-1540910419868-474947cebacb?auto=format&fit=crop&q=80&w=800"
  },
  {
    title: "Senate Passes Controversial Infrastructure Bill", 
    category: "Politics", 
    summary: "After a marathon 24-hour session, the Senate has approved the $2T spending package...", 
    fullContent: "The bill, which focuses on rebuilding aging bridges and expanding high-speed internet to rural areas, passed with a slim margin of 51-49. Opposition leaders argued the spending would increase inflation, while proponents called it a 'once in a generation investment'.",
    source: "Capitol Hill Bot", 
    image: "https://images.unsplash.com/photo-1541872703-74c5963631df?auto=format&fit=crop&q=80&w=800"
  },

  // TECH
  { 
    title: "New AI Regulation Framework Proposed by EU", 
    category: "Technology", 
    summary: "The European Union has drafted a comprehensive set of rules governing artificial intelligence usage...", 
    fullContent: "The European Union has taken a historic step in digital governance by proposing the 'AI Responsibility Act'. This comprehensive framework aims to categorize AI systems by risk level, with 'high-risk' applications requiring strict human oversight.",
    source: "TechCrunch Auto", 
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800"
  },
  {
    title: "Cybersecurity Alert: Major Data Breach Affects Retail Giant",
    category: "Cybersecurity",
    summary: "Security experts warn of a massive leak involving millions of credit card details...", 
    fullContent: "A leading international retail chain has confirmed a data breach affecting approximately 12 million customers worldwide. The breach, which occurred late last week, exposed names, email addresses, and encrypted payment information.",
    source: "SecuriBot", 
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800"
  },
  { 
    title: "Apple Unveils Revolutionary AR Glasses", 
    category: "Technology", 
    summary: "The tech giant's latest wearable promises to replace smartphones within the decade...", 
    fullContent: "Apple's 'Vision Air' glasses were revealed today. Weighing less than a standard pair of sunglasses, they project a high-resolution interface directly onto the user's retina.",
    source: "TechRadar Bot", 
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800"
  },

  // WORLD
  { 
    title: "United Nations Announces New Ocean Cleanup Initiative", 
    category: "World", 
    summary: "A multi-billion dollar fund has been established to target the Great Pacific Garbage Patch...", 
    fullContent: "The UN Environment Programme (UNEP) today launched 'Project Blue Horizon', a comprehensive 10-year plan to remove 50% of floating plastic debris from the world's oceans. The initiative involves deploying autonomous solar-powered collection vessels.",
    source: "UN News Feed", 
    image: "https://images.unsplash.com/photo-1484291470158-b8f8d608850d?auto=format&fit=crop&q=80&w=800"
  },
  {
    title: "Climate Summit: Nations Pledge Net-Zero by 2040", 
    category: "World", 
    summary: "In a surprising turn of events, major industrial nations moved their carbon targets forward...", 
    fullContent: "Delegates at the Geneva Climate Accord have agreed to accelerate their carbon neutrality goals. The new timeline sets 2040 as the hard deadline for net-zero emissions.",
    source: "EcoWatch AI", 
    image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&q=80&w=800"
  },
  
  // BUSINESS
  { 
    title: "Global Markets Rally as Tech Sector Rebounds", 
    category: "Business", 
    summary: "Major indices hit record highs today as technology stocks led a surprising market recovery...", 
    fullContent: "The global stock markets saw an unprecedented surge today. Analysts attribute this recovery to better-than-expected earnings reports from AI heavyweights.",
    source: "MarketWatch AI", 
    image: "https://images.unsplash.com/photo-1611974765270-ca1258634369?auto=format&fit=crop&q=80&w=800"
  },
  { 
    title: "AI Models predict 30% increase in Global Trade", 
    category: "Economy", 
    summary: "Predictive algorithms suggest a robust recovery in international shipping and trade routes for Q4...", 
    fullContent: "Contrary to gloomy forecasts from earlier this year, advanced predictive AI models analyzing shipping logistics and purchase orders suggest a 30% boom in global trade volume for Q4.",
    source: "Global Trade AI", 
    image: "https://images.unsplash.com/photo-1526304640152-d4619684e484?auto=format&fit=crop&q=80&w=800"
  }
];

const INITIAL_NEWS = [
  { 
    id: 1, 
    title: "BREAKING: Global Energy Prices Stabilize", 
    category: "Business", 
    summary: "After months of volatility, energy markets are seeing a return to pre-crisis levels...", 
    fullContent: "Analysts report that increased production in renewables combined with strategic reserve releases has successfully calmed the markets.",
    time: "2 mins ago", 
    source: "EnergyBot", 
    image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=800",
    comments: []
  },
  {
    id: 2,
    title: "Olympics 2028: Los Angeles Unveils New Stadium Plans",
    category: "Sports",
    summary: "Organizers have released the final architectural renderings for the 2028 Olympic venues...",
    fullContent: "With just four years to go, the Los Angeles Olympic Committee has revealed the final designs for the revamped Memorial Coliseum and the new aquatic center.",
    time: "30 mins ago",
    source: "SportsWire AI",
    image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80&w=800",
    comments: []
  }
];

// --- AD COMPONENT ---
const AdPlaceholder = ({ format, label }) => (
  <div className={`bg-gray-100 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 font-medium ${format === 'banner' ? 'h-32 w-full my-6' : 'h-64 w-full mb-6'}`}>
    <DollarSign className="h-6 w-6 mb-2 text-green-500" />
    <span>{label}</span>
    <span className="text-xs text-gray-400 mt-1">(AdSense Slot)</span>
  </div>
);

// --- ARTICLE READER MODAL ---
const ArticleReader = ({ article, onClose }) => {
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState(article.comments || []);

  const handlePostComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    const newComment = { user: "Guest_User", text: commentText, likes: 0 };
    setComments([...comments, newComment]);
    setCommentText("");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex justify-center animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl min-h-screen md:min-h-0 md:my-8 rounded-none md:rounded-2xl shadow-2xl flex flex-col relative">
        <button onClick={onClose} className="absolute top-4 right-4 bg-white/80 hover:bg-white p-2 rounded-full text-gray-800 z-10 shadow-lg transition-all"><X className="h-6 w-6" /></button>
        <div className="h-64 md:h-80 w-full shrink-0 relative">
          <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
          <div className="absolute bottom-6 left-6 md:left-10 text-white">
            <span className="bg-blue-600 text-xs font-bold px-3 py-1 rounded-full mb-3 inline-block">{article.category}</span>
            <h1 className="text-2xl md:text-4xl font-bold leading-tight shadow-black drop-shadow-lg">{article.title}</h1>
          </div>
        </div>
        <div className="flex-1 p-6 md:p-10 flex flex-col md:flex-row gap-10">
          <div className="md:w-2/3">
            <div className="flex items-center text-sm text-gray-500 mb-6 space-x-4 border-b pb-4">
              <span className="flex items-center font-semibold text-blue-600"><Newspaper className="h-4 w-4 mr-2" /> {article.source}</span>
              <span className="flex items-center"><Clock className="h-4 w-4 mr-2" /> {article.time || "Just Now"}</span>
            </div>
            <div className="prose prose-lg text-gray-700 leading-relaxed whitespace-pre-line">
              <p className="font-semibold text-xl mb-4 text-gray-900">{article.summary}</p>
              {article.fullContent}
            </div>
            <div className="my-8"><AdPlaceholder format="banner" label="In-Article Ad" /></div>
          </div>
          <div className="md:w-1/3 border-t md:border-t-0 md:border-l border-gray-100 pt-6 md:pt-0 md:pl-8">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center"><MessageCircle className="h-5 w-5 mr-2" /> Discussion ({comments.length})</h3>
            <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2">
              {comments.map((c, idx) => (
                <div key={idx} className="bg-gray-50 p-3 rounded-lg text-sm">
                  <div className="flex justify-between items-center mb-1"><span className="font-bold text-blue-800 text-xs">{c.user}</span><span className="text-gray-400 text-xs flex items-center"><ThumbsUp className="h-3 w-3 mr-1" /> {c.likes}</span></div>
                  <p className="text-gray-700">{c.text}</p>
                </div>
              ))}
            </div>
            <form onSubmit={handlePostComment} className="relative">
              <input type="text" value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="Add your insight..." className="w-full pl-4 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"/>
              <button type="submit" className="absolute right-2 top-2 p-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"><Send className="h-4 w-4" /></button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [articles, setArticles] = useState(INITIAL_NEWS);
  const [isAiScanning, setIsAiScanning] = useState(true);
  const [newArticleCount, setNewArticleCount] = useState(0);
  const [notification, setNotification] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [activeCategory, setActiveCategory] = useState("Trending");
  
  // --- INFINITE AI SIMULATION ---
  useEffect(() => {
    // Check for new news every 5 seconds
    const aiInterval = setInterval(() => {
      setIsAiScanning(true);
      
      // Simulate "Scanning" delay
      setTimeout(() => {
        setIsAiScanning(false);
        
        // 40% chance to find a "new" story each cycle
        if (Math.random() > 0.6) {
          // Pick a RANDOM story from the database to keep it infinite
          const randomStory = MOCK_NEWS_DATABASE[Math.floor(Math.random() * MOCK_NEWS_DATABASE.length)];
          
          // Create a new object with a unique ID so React treats it as new
          const newArticle = {
            ...randomStory,
            id: Date.now(), // Unique ID based on time
            time: 'Just now',
            comments: []
          };

          setArticles(prev => [newArticle, ...prev]);
          setNewArticleCount(c => c + 1);
          setNotification(`AI found ${newArticle.category} story: ${newArticle.title}`);
          
          setTimeout(() => setNotification(null), 4000);
        }
      }, 1500);

    }, 5000); // Fast 5-second interval for "Constant" updates

    return () => clearInterval(aiInterval);
  }, []);

  // --- FILTERING LOGIC ---
  const filteredArticles = articles.filter(article => {
    if (activeCategory === "Trending") return true;
    if (activeCategory === "World") return ["World", "Climate", "Health", "Politics"].includes(article.category);
    if (activeCategory === "Tech") return ["Technology", "Science", "Space", "Cybersecurity", "AI"].includes(article.category);
    if (activeCategory === "Business") return ["Business", "Economy", "Auto"].includes(article.category);
    if (activeCategory === "Politics") return ["Politics", "World"].includes(article.category);
    return article.category === activeCategory;
  });

  const NavButton = ({ name, icon: Icon }) => (
    <button 
      onClick={() => setActiveCategory(name)}
      className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
        activeCategory === name 
          ? 'text-blue-600 bg-blue-50' 
          : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
      }`}
    >
      {Icon && <Icon className="h-4 w-4 mr-2" />}
      {name}
    </button>
  );

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans relative">
      {selectedArticle && <ArticleReader article={selectedArticle} onClose={() => setSelectedArticle(null)} />}
      
      {notification && (
        <div className="fixed top-20 right-4 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-xl z-50 flex items-center animate-bounce-in">
          <Globe className="h-5 w-5 mr-3 animate-pulse" />
          <div>
            <p className="text-xs font-bold uppercase tracking-wider opacity-80">Global Alert</p>
            <p className="text-sm font-medium">{notification}</p>
          </div>
        </div>
      )}

      <header className="border-b border-gray-200 sticky top-0 z-30 bg-white/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center cursor-pointer" onClick={() => setActiveCategory("Trending")}>
              <div className="bg-blue-600 p-2 rounded-lg mr-3"><Newspaper className="h-6 w-6 text-white" /></div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">NewsAI<span className="text-blue-600">.bot</span></h1>
                <p className="text-xs text-gray-500 font-medium tracking-wide">GLOBAL INTELLIGENCE AGGREGATOR</p>
              </div>
            </div>
            
            <nav className="hidden md:flex space-x-1">
              <NavButton name="Trending" icon={TrendingUp} />
              <NavButton name="World" icon={Globe} />
              <NavButton name="Tech" icon={Cpu} />
              <NavButton name="Politics" icon={Vote} />
              <NavButton name="Business" icon={Briefcase} />
            </nav>

            <div className="hidden md:flex items-center space-x-4">
              <div className={`flex items-center px-3 py-1 rounded-full text-xs font-semibold ${isAiScanning ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                <div className={`h-2 w-2 rounded-full mr-2 ${isAiScanning ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                {isAiScanning ? 'AI SCANNING WEB...' : 'AI IDLE'}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdPlaceholder format="banner" label="Header Leaderboard Ad (728x90)" />
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            <div className="flex justify-between items-center mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div className="flex items-center text-sm text-gray-600"><Clock className="h-4 w-4 mr-2 text-blue-500" /> Live Feed: {activeCategory}</div>
              <div className="flex items-center text-sm font-medium text-blue-700"><TrendingUp className="h-4 w-4 mr-2" /> {newArticleCount} Updates</div>
            </div>

            <div className="space-y-8">
              {filteredArticles.length === 0 ? (
                <div className="text-center py-10 text-gray-500">No recent stories in this category. The AI is scanning...</div>
              ) : (
                filteredArticles.map((article, index) => (
                  <React.Fragment key={article.id}>
                    <article onClick={() => setSelectedArticle(article)} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col sm:flex-row group cursor-pointer">
                      <div className="sm:w-1/3 relative overflow-hidden h-48 sm:h-auto">
                        <img src={article.image} alt={article.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute top-2 left-2 bg-black/70 text-white text-xs font-bold px-2 py-1 rounded">{article.category}</div>
                      </div>
                      <div className="p-6 sm:w-2/3 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">{article.source}</span>
                            <span className="text-gray-300">•</span>
                            <span className="text-xs text-gray-500">{article.time}</span>
                          </div>
                          <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors line-clamp-2">{article.title}</h2>
                          <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">{article.summary}</p>
                        </div>
                        <div className="mt-4 flex items-center justify-between pt-4 border-t border-gray-50">
                          <button className="text-sm font-medium text-gray-900 flex items-center hover:text-blue-600 transition group-hover:underline">Read Full Analysis <ExternalLink className="h-3 w-3 ml-1" /></button>
                          <div className="flex space-x-3 text-gray-400"><div className="flex items-center text-xs"><MessageCircle className="h-3 w-3 mr-1" /> {article.comments ? article.comments.length : 0}</div></div>
                        </div>
                      </div>
                    </article>
                    {(index + 1) % 3 === 0 && <AdPlaceholder format="banner" label="In-Feed Native Ad" />}
                  </React.Fragment>
                ))
              )}

              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center p-3 rounded-full bg-blue-50 text-blue-600 mb-4 animate-pulse"><RefreshCw className="h-6 w-6 animate-spin" /></div>
                <h3 className="text-lg font-medium text-gray-900">AI is hunting for more {activeCategory} stories...</h3>
              </div>
            </div>
          </div>

          <div className="lg:w-1/3 space-y-8">
            <div className="sticky top-24 space-y-8">
              <AdPlaceholder format="rectangle" label="Sidebar Top Ad (300x250)" />
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center"><TrendingUp className="h-4 w-4 mr-2 text-red-500" /> Trending Topics</h3>
                <div className="flex flex-wrap gap-2">
                  {['#Election2024', '#AI', '#ClimateSummit', '#MarketRally', '#G20', '#SpaceX'].map(tag => (
                    <span key={tag} className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium px-3 py-1 rounded-full cursor-pointer transition">{tag}</span>
                  ))}
                </div>
              </div>
              <div className="bg-blue-600 rounded-xl shadow-lg p-6 text-white relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="font-bold text-lg mb-2">Get Intelligence Daily</h3>
                  <input type="email" placeholder="Enter email address" className="w-full px-4 py-2 rounded-lg text-gray-900 text-sm mb-2 outline-none" />
                  <button className="w-full bg-blue-800 hover:bg-blue-900 text-white font-medium py-2 rounded-lg text-sm transition">Subscribe</button>
                </div>
                <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-blue-500 opacity-50"></div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-900 text-gray-300 py-12 mt-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
          © 2024 Global AI News Aggregator. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default App;