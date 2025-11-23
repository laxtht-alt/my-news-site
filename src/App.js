import React, { useState, useEffect, useRef } from 'react';
import { 
  Newspaper, RefreshCw, DollarSign, ExternalLink, TrendingUp, Clock, 
  Share2, Menu, X, Info, MessageCircle, ArrowLeft, Send, ThumbsUp, User 
} from 'lucide-react';

// --- MOCK DATA SOURCE (EXPANDED) ---
const MOCK_NEWS_DATABASE = [
  { 
    id: 101, 
    title: "Global Markets Rally as Tech Sector Rebounds", 
    category: "Business", 
    summary: "Major indices hit record highs today as technology stocks led a surprising market recovery...", 
    fullContent: "The global stock markets saw an unprecedented surge today, driven primarily by renewed investor confidence in the technology sector. After a volatile Q3, major indices including the NASDAQ and S&P 500 rallied to close at record highs. \n\nAnalysts attribute this recovery to three main factors: better-than-expected earnings reports from AI heavyweights, stabilized interest rates, and increasing consumer spending in the digital services sector. 'This is the correction we've been waiting for,' noted senior analyst Sarah Jenkins. 'The fundamentals of the tech sector remain strong despite regulatory headwinds.'\n\nMoving forward, all eyes will be on the upcoming Federal Reserve meeting, which could determine if this rally has the legs to continue into the next quarter.",
    time: "Just now", 
    source: "MarketWatch AI", 
    image: "https://images.unsplash.com/photo-1611974765270-ca1258634369?auto=format&fit=crop&q=80&w=800",
    comments: [
      { user: "TradePro_99", text: "Finally! My portfolio is looking green again.", likes: 45 },
      { user: "EconWatcher", text: "Don't get too excited, inflation data comes out next week.", likes: 12 }
    ]
  },
  { 
    id: 102, 
    title: "Breakthrough in Renewable Energy Storage Announced", 
    category: "Science", 
    summary: "Scientists have unveiled a new battery technology that could double the efficiency of solar farms...", 
    fullContent: "A team of researchers at the Institute of Advanced Energy has unveiled a prototype for a solid-state battery that utilizes graphene layers to store energy more densely than current lithium-ion equivalents. \n\nThis breakthrough addresses the 'intermittency problem' of renewable energy—the issue that solar and wind power are not constant. This new battery can store excess energy generated during peak sunlight hours with 90% efficiency, releasing it during the night without significant loss.\n\nCommercial production is slated to begin in 2026, with major automotive and utility companies already lining up for partnerships.",
    time: "2 mins ago", 
    source: "Science Daily Bot", 
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&q=80&w=800",
    comments: []
  },
  { 
    id: 103, 
    title: "New AI Regulation Framework Proposed by EU", 
    category: "Technology", 
    summary: "The European Union has drafted a comprehensive set of rules governing artificial intelligence usage...", 
    fullContent: "The European Union has taken a historic step in digital governance by proposing the 'AI Responsibility Act'. This comprehensive framework aims to categorize AI systems by risk level, with 'high-risk' applications (such as medical diagnosis and critical infrastructure) requiring strict human oversight.\n\nThe bill also introduces mandatory transparency clauses, requiring companies to disclose when content is AI-generated. Tech giants have reacted with mixed feelings; while acknowledging the need for safety, some argue that excessive red tape could stifle European innovation compared to US and Asian markets.",
    time: "15 mins ago", 
    source: "TechCrunch Auto", 
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800",
    comments: [
      { user: "Dev Ops", text: "Good luck enforcing this on open source models.", likes: 89 }
    ]
  },
  {
    id: 104,
    title: "Olympics 2028: Los Angeles Unveils New Stadium Plans",
    category: "Sports",
    summary: "Organizers have released the final architectural renderings for the 2028 Olympic venues...",
    fullContent: "With just four years to go, the Los Angeles Olympic Committee has revealed the final designs for the revamped Memorial Coliseum and the new aquatic center. The designs focus heavily on sustainability, utilizing recycled materials and a net-zero energy grid.\n\nThe most striking feature is the 'solar skin' that will wrap the main stadium, generating enough power to run the entire opening ceremony. Local officials promise that these games will be the first 'car-free' Olympics, relying entirely on an expanded metro and autonomous shuttle network.",
    time: "30 mins ago",
    source: "SportsWire AI",
    image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80&w=800",
    comments: [
      { user: "LA_Local", text: "Traffic is going to be a nightmare regardless.", likes: 120 },
      { user: "SportsFan22", text: "That stadium looks incredible!", likes: 45 }
    ]
  },
  {
    id: 105,
    title: "Cybersecurity Alert: Major Data Breach Affects Retail Giant",
    category: "Cybersecurity",
    summary: "Security experts warn of a massive leak involving millions of credit card details...",
    fullContent: "A leading international retail chain has confirmed a data breach affecting approximately 12 million customers worldwide. The breach, which occurred late last week, exposed names, email addresses, and encrypted payment information.\n\nCybersecurity firm NetGuard states that the attack was sophisticated, utilizing a zero-day vulnerability in the retailer's cloud infrastructure. While the company claims no unencrypted passwords were stolen, they are advising all customers to change their login credentials immediately and monitor their bank statements.",
    time: "1 hour ago",
    source: "SecuriBot",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800",
    comments: []
  },
  {
    id: 106,
    title: "Hollywood Strike Ends: Studios and Writers Reach Tentative Deal",
    category: "Entertainment",
    summary: "After 140 days of picketing, a historic agreement has been reached regarding AI usage in scripts...",
    fullContent: "The entertainment industry breathed a sigh of relief this morning as union leaders announced a tentative agreement with major studios, effectively ending the longest writer's strike in decades.\n\nKey to the deal were protections against the use of Generative AI. The new contract stipulates that AI cannot be credited as a writer, nor can it be used to rewrite human-created material without explicit consent and compensation. Production on major blockbusters is expected to resume as early as next week.",
    time: "2 hours ago",
    source: "Entertainment Weekly AI",
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=800",
    comments: [
      { user: "ScreenWriter88", text: "A huge win for human creativity!", likes: 200 }
    ]
  }
];

const INITIAL_NEWS = [
  { 
    id: 1, 
    title: "AI Models predict 30% increase in Global Trade", 
    category: "Economy", 
    summary: "Predictive algorithms suggest a robust recovery in international shipping and trade routes for Q4...", 
    fullContent: "Contrary to gloomy forecasts from earlier this year, advanced predictive AI models analyzing shipping logistics and purchase orders suggest a 30% boom in global trade volume for Q4. \n\nThe data, aggregated from over 500 ports worldwide, indicates a massive restocking effort by retailers anticipating a record-breaking holiday season. Supply chain bottlenecks that plagued the industry last year appear to have largely resolved, allowing for smoother transit of goods across the Pacific and Atlantic corridors.",
    time: "4 hours ago", 
    source: "Global Trade AI", 
    image: "https://images.unsplash.com/photo-1526304640152-d4619684e484?auto=format&fit=crop&q=80&w=800",
    comments: []
  },
  { 
    id: 2, 
    title: "Electric Vehicle Sales Surpass Traditional Autos in Nordic Region", 
    category: "Auto", 
    summary: "A historic tipping point has been reached as EV adoption accelerates faster than predicted...", 
    fullContent: "In a watershed moment for the automotive industry, electric vehicles (EVs) have officially outsold internal combustion engine cars in the Nordic region for the first time in a calendar month. \n\nDriven by generous government incentives, a robust charging infrastructure, and a cultural shift towards sustainability, countries like Norway and Sweden are leading the charge. 'This is the future arriving early,' says auto analyst Marcus Thorne. 'The rest of Europe is about 5 years behind this trend, but they are on the same path.'",
    time: "5 hours ago", 
    source: "AutoStats Bot", 
    image: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&q=80&w=800",
    comments: [
      { user: "PetrolHead", text: "I'll still miss the sound of a V8 engine though.", likes: 3 },
      { user: "GreenFuture", text: "Fantastic news for the planet!", likes: 25 }
    ]
  },
  {
    id: 3,
    title: "Medical Breakthrough: Malaria Vaccine Shows 77% Efficacy",
    category: "Health",
    summary: "A new study published in The Lancet confirms high efficacy rates for the new R21 vaccine...",
    fullContent: "In what is being hailed as a monumental victory for global health, the University of Oxford's new R21/Matrix-M malaria vaccine has demonstrated 77% efficacy in early trials, surpassing the World Health Organization's goal of 75%.\n\nMalaria kills over 400,000 people annually, mostly children in sub-Saharan Africa. This new vaccine is cheap to manufacture and can be produced at scale. 'We are looking at the potential eradication of this disease within our lifetime,' stated lead researcher Dr. Adrian Hill.",
    time: "6 hours ago",
    source: "HealthWatch AI",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800",
    comments: []
  },
  {
    id: 4,
    title: "SpaceX Starship Successfully Orbits Earth",
    category: "Space",
    summary: "The massive rocket achieved orbit successfully, marking a new era in interplanetary travel...",
    fullContent: "SpaceX's Starship, the largest and most powerful rocket ever built, has successfully reached orbit in its latest test flight. Lifting off from the Starbase facility in Texas, the vehicle separated cleanly from its Super Heavy booster and coasted through space for 90 minutes before a controlled splashdown in the Indian Ocean.\n\nThis success paves the way for the upcoming Artemis III mission, which aims to land astronauts on the Moon by 2026. Elon Musk tweeted shortly after the launch: 'Humanity just got one step closer to Mars.'",
    time: "8 hours ago",
    source: "Cosmos Daily",
    image: "https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&q=80&w=800",
    comments: [
      { user: "MarsRover", text: "History in the making!", likes: 300 }
    ]
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
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 bg-white/80 hover:bg-white p-2 rounded-full text-gray-800 z-10 shadow-lg transition-all"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Hero Image */}
        <div className="h-64 md:h-80 w-full shrink-0 relative">
          <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
          <div className="absolute bottom-6 left-6 md:left-10 text-white">
            <span className="bg-blue-600 text-xs font-bold px-3 py-1 rounded-full mb-3 inline-block">
              {article.category}
            </span>
            <h1 className="text-2xl md:text-4xl font-bold leading-tight shadow-black drop-shadow-lg">
              {article.title}
            </h1>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 md:p-10 flex flex-col md:flex-row gap-10">
          
          {/* Main Text */}
          <div className="md:w-2/3">
            <div className="flex items-center text-sm text-gray-500 mb-6 space-x-4 border-b pb-4">
              <span className="flex items-center font-semibold text-blue-600"><Newspaper className="h-4 w-4 mr-2" /> {article.source}</span>
              <span className="flex items-center"><Clock className="h-4 w-4 mr-2" /> {article.time}</span>
              <span className="flex items-center"><User className="h-4 w-4 mr-2" /> By AI Journalist</span>
            </div>

            <div className="prose prose-lg text-gray-700 leading-relaxed whitespace-pre-line">
              <p className="font-semibold text-xl mb-4 text-gray-900">{article.summary}</p>
              {article.fullContent || "This is a breaking story. Our AI agents are currently aggregating more details from global sources. Please check back in a few minutes for the full comprehensive report..."}
            </div>

            {/* In-Article Ad */}
            <div className="my-8">
               <AdPlaceholder format="banner" label="In-Article Ad" />
            </div>
          </div>

          {/* Sidebar / Comments */}
          <div className="md:w-1/3 border-t md:border-t-0 md:border-l border-gray-100 pt-6 md:pt-0 md:pl-8">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center">
              <MessageCircle className="h-5 w-5 mr-2" />
              Discussion ({comments.length})
            </h3>

            {/* Comment List */}
            <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2">
              {comments.length === 0 ? (
                <p className="text-sm text-gray-400 italic">No comments yet. Be the first to analyze this.</p>
              ) : (
                comments.map((c, idx) => (
                  <div key={idx} className="bg-gray-50 p-3 rounded-lg text-sm">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-blue-800 text-xs">{c.user}</span>
                      <span className="text-gray-400 text-xs flex items-center"><ThumbsUp className="h-3 w-3 mr-1" /> {c.likes}</span>
                    </div>
                    <p className="text-gray-700">{c.text}</p>
                  </div>
                ))
              )}
            </div>

            {/* Comment Input */}
            <form onSubmit={handlePostComment} className="relative">
              <input 
                type="text" 
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add your insight..." 
                className="w-full pl-4 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <button type="submit" className="absolute right-2 top-2 p-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                <Send className="h-4 w-4" />
              </button>
            </form>

            {/* Share Widget */}
            <div className="mt-8">
              <h4 className="font-bold text-xs uppercase text-gray-400 tracking-wider mb-3">Share Intelligence</h4>
              <div className="flex space-x-2">
                <button className="flex-1 bg-[#1DA1F2] text-white py-2 rounded text-xs font-bold hover:opacity-90 transition">Twitter</button>
                <button className="flex-1 bg-[#0A66C2] text-white py-2 rounded text-xs font-bold hover:opacity-90 transition">LinkedIn</button>
                <button className="flex-1 bg-gray-800 text-white py-2 rounded text-xs font-bold hover:opacity-90 transition">Copy</button>
              </div>
            </div>
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
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [notification, setNotification] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null); // STATE FOR READER MODE
  
  const mockIndexRef = useRef(0);

  // --- AI SIMULATION EFFECT ---
  useEffect(() => {
    const aiInterval = setInterval(() => {
      setIsAiScanning(true);
      setTimeout(() => {
        setIsAiScanning(false);
        if (Math.random() > 0.3 && mockIndexRef.current < MOCK_NEWS_DATABASE.length) {
          const newArticle = MOCK_NEWS_DATABASE[mockIndexRef.current];
          setArticles(prev => [newArticle, ...prev]);
          setNewArticleCount(c => c + 1);
          setNotification(`AI found new story: ${newArticle.title}`);
          setTimeout(() => setNotification(null), 3000);
          mockIndexRef.current += 1;
        }
      }, 1500);
    }, 8000);
    return () => clearInterval(aiInterval);
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans relative">
      
      {/* --- READER MODAL --- */}
      {selectedArticle && (
        <ArticleReader 
          article={selectedArticle} 
          onClose={() => setSelectedArticle(null)} 
        />
      )}

      {/* --- NOTIFICATION TOAST --- */}
      {notification && (
        <div className="fixed top-4 right-4 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-xl z-40 flex items-center animate-bounce-in">
          <RefreshCw className="h-5 w-5 mr-3 animate-spin" />
          <div>
            <p className="text-xs font-bold uppercase tracking-wider opacity-80">System Alert</p>
            <p className="text-sm font-medium">{notification}</p>
          </div>
        </div>
      )}

      {/* --- HEADER --- */}
      <header className="border-b border-gray-200 sticky top-0 z-30 bg-white/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center cursor-pointer" onClick={() => window.scrollTo(0,0)}>
              <div className="bg-blue-600 p-2 rounded-lg mr-3">
                <Newspaper className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">NewsAI<span className="text-blue-600">.bot</span></h1>
                <p className="text-xs text-gray-500 font-medium tracking-wide">GLOBAL INTELLIGENCE AGGREGATOR</p>
              </div>
            </div>
            <nav className="hidden md:flex space-x-8">
              <button className="text-gray-900 font-semibold border-b-2 border-blue-600 px-1 pt-1">Trending</button>
              <button className="text-gray-500 hover:text-gray-900 transition">World</button>
              <button className="text-gray-500 hover:text-gray-900 transition">Tech</button>
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

      {/* --- HEADER AD --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdPlaceholder format="banner" label="Header Leaderboard Ad (728x90)" />
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* --- MAIN FEED --- */}
          <div className="lg:w-2/3">
            <div className="flex justify-between items-center mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="h-4 w-4 mr-2 text-blue-500" />
                Live Feed
              </div>
              <div className="flex items-center text-sm font-medium text-blue-700">
                <TrendingUp className="h-4 w-4 mr-2" />
                {newArticleCount} New Stories Found
              </div>
            </div>

            <div className="space-y-8">
              {articles.map((article, index) => (
                <React.Fragment key={article.id}>
                  {/* NEWS CARD - NOW CLICKABLE */}
                  <article 
                    onClick={() => setSelectedArticle(article)}
                    className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col sm:flex-row group cursor-pointer"
                  >
                    <div className="sm:w-1/3 relative overflow-hidden h-48 sm:h-auto">
                      <img 
                        src={article.image} 
                        alt={article.title} 
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" 
                      />
                      <div className="absolute top-2 left-2 bg-black/70 text-white text-xs font-bold px-2 py-1 rounded">
                        {article.category}
                      </div>
                    </div>
                    
                    <div className="p-6 sm:w-2/3 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">{article.source}</span>
                          <span className="text-gray-300">•</span>
                          <span className="text-xs text-gray-500">{article.time}</span>
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors line-clamp-2">
                          {article.title}
                        </h2>
                        <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
                          {article.summary}
                        </p>
                      </div>
                      
                      <div className="mt-4 flex items-center justify-between pt-4 border-t border-gray-50">
                        <button className="text-sm font-medium text-gray-900 flex items-center hover:text-blue-600 transition group-hover:underline">
                          Read Full Analysis <ExternalLink className="h-3 w-3 ml-1" />
                        </button>
                        <div className="flex space-x-3 text-gray-400">
                          <div className="flex items-center text-xs"><MessageCircle className="h-3 w-3 mr-1" /> {article.comments ? article.comments.length : 0}</div>
                        </div>
                      </div>
                    </div>
                  </article>

                  {(index + 1) % 3 === 0 && (
                    <AdPlaceholder format="banner" label="In-Feed Native Ad" />
                  )}
                </React.Fragment>
              ))}

              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center p-3 rounded-full bg-blue-50 text-blue-600 mb-4 animate-pulse">
                  <RefreshCw className="h-6 w-6 animate-spin" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">AI is hunting for more stories...</h3>
              </div>
            </div>
          </div>

          {/* --- SIDEBAR --- */}
          <div className="lg:w-1/3 space-y-8">
            <div className="sticky top-24 space-y-8">
              <AdPlaceholder format="rectangle" label="Sidebar Top Ad (300x250)" />
              
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2 text-red-500" />
                  Trending Topics
                </h3>
                <div className="flex flex-wrap gap-2">
                  {['#AI', '#GlobalMarkets', '#SpaceX', '#Crypto', '#ClimateSummit', '#EVs'].map(tag => (
                    <span key={tag} className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium px-3 py-1 rounded-full cursor-pointer transition">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-blue-600 rounded-xl shadow-lg p-6 text-white relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="font-bold text-lg mb-2">Get Intelligence Daily</h3>
                  <input type="email" placeholder="Enter email address" className="w-full px-4 py-2 rounded-lg text-gray-900 text-sm mb-2 outline-none" />
                  <button className="w-full bg-blue-800 hover:bg-blue-900 text-white font-medium py-2 rounded-lg text-sm transition">
                    Subscribe
                  </button>
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