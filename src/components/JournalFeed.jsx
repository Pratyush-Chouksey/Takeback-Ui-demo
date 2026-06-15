import React, { useState } from 'react';
import MagneticButton from './MagneticButton';
import { articles, categories } from './articlesData';

// Import blog header images
import blog1 from '../assets/blog_header_1.png';
import blog2 from '../assets/blog_header_2.png';
import blog3 from '../assets/blog_header_3.png';
import blog4 from '../assets/blog_header_4.png';
import blog5 from '../assets/blog_header_5.png';
import blog6 from '../assets/blog_header_6.png';
import blog7 from '../assets/blog_header_7.png';
import blog8 from '../assets/blog_header_8.png';

export function JournalFeed() {
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');

  const illustrations = {
    hero: <img src={blog1} alt="Why We Started TakeBack — The Founder's Story" className="w-full h-full object-cover" />,
    loop: <img src={blog2} alt="How Our Borrow & Return System Works (Step by Step)" className="w-full h-full object-cover" />,
    cost: <img src={blog3} alt="The Real Cost of Disposable Coffee Cups in India" className="w-full h-full object-cover" />,
    cafes: <img src={blog4} alt="5 Cafés Doing Sustainability Right in Goa" className="w-full h-full object-cover" />,
    footprint: <img src={blog5} alt="How to Reduce Your Daily Coffee Carbon Footprint" className="w-full h-full object-cover" />,
    comparison: <img src={blog6} alt="TakeBack vs. Other Reusable Cups — What's Different?" className="w-full h-full object-cover" />,
    materials: <img src={blog7} alt="Behind the Cup — Where Our Materials Come From" className="w-full h-full object-cover" />,
    report: <img src={blog8} alt="Introducing the Impact Report 2025-26" className="w-full h-full object-cover" />
  };

  const filteredArticles = activeCategory === 'All'
    ? articles
    : articles.filter(art => art.category === activeCategory);

  return (
    <section 
      id="editorial-journal-section"
      className="relative min-h-screen w-full bg-[#F4F3EF] text-[#0B0F12] pt-28 pb-16 border-t border-black/5"
    >
      <div className="max-w-[1440px] mx-auto px-5 lg:px-20 flex flex-col gap-12 md:gap-16">
        
        {/* Section Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-black/10 pb-8">
          <div className="flex flex-col gap-2 max-w-xl">
            <span className="text-xs font-mono tracking-[0.2em] text-[#0B0F12]/60 uppercase font-semibold">
              CHAPTER 8 // EDITORIAL HUB
            </span>
            <h1 className="display-header text-4xl md:text-6xl font-black text-[#0B0F12] uppercase tracking-tight">
              THE JOURNAL
            </h1>
            <p className="interface-text text-sm text-[#0B0F12]/60 mt-1">
              Sustainability deep-dives, industrial design breakdowns, and behind-the-scenes coffee culture narratives from the TakeBack ecosystem.
            </p>
          </div>

          {/* Categories descriptions & Filter bar */}
          <div className="flex flex-col gap-3 max-w-md w-full">
            <div className="flex flex-wrap gap-2 text-xs font-mono select-none">
              <button 
                onClick={() => setActiveCategory('All')}
                className={`px-3 py-1.5 rounded transition-all cursor-pointer ${
                  activeCategory === 'All' ? 'bg-[#0B0F12] text-[#F7F5F0]' : 'bg-white border border-black/10 hover:border-black/35'
                }`}
              >
                All Articles
              </button>
              {Object.keys(categories).map(cat => (
                <button 
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded transition-all cursor-pointer ${
                    activeCategory === cat ? 'bg-[#0B0F12] text-[#F7F5F0]' : 'bg-white border border-black/10 hover:border-black/35'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            
            {/* Active category description tagline */}
            <p className="text-[10px] font-mono text-black/50 leading-relaxed min-h-[30px] text-left">
              {activeCategory === 'All' 
                ? 'Displaying all news updates, step guides, material deep-dives, and network reports.' 
                : `${activeCategory}: ${categories[activeCategory]}`
              }
            </p>
          </div>
        </div>

        {/* 
          Asymmetric Variable Masonry Layout Grid.
          On viewports <= 768px, collapses into a single-column layout with no offsets.
          Uses CSS columns mapping for smooth masonry columns alignment.
        */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-8 [column-fill:_balance] w-full">
          {filteredArticles.map((art, idx) => {
            const illustrationKey = art.illustration;
            return (
              <article 
                key={idx}
                onClick={() => setSelectedArticle(art)}
                className="break-inside-avoid mb-8 group flex flex-col justify-between p-6 rounded-2xl bg-white border border-black/5 hover:bg-[#0B0F12] hover:border-[#0B0F12] transition-all duration-500 cursor-pointer shadow-sm hover:shadow-xl"
              >
                <div className="flex flex-col gap-4">
                  
                  {/* Bounding image mask container */}
                  <div className={`w-full ${art.aspect} rounded-xl overflow-hidden relative border border-black/5 bg-[#F7F5F0]`}>
                    <div className="w-full h-full transform transition-transform duration-500 ease-out group-hover:scale-[1.04] will-change-transform">
                      {illustrations[illustrationKey] || (
                        <div className="w-full h-full bg-mint/10 flex items-center justify-center text-mint font-bold">[ Illust ]</div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 text-left">
                    <span className="text-[10px] font-mono text-black/40 group-hover:text-[#A3E2C9] transition-colors duration-300 uppercase tracking-widest font-bold">
                      {art.category}
                    </span>
                    
                    {/* Semantic Heading 2 path styled in Serif */}
                    <h2 className="display-header text-xl md:text-2xl font-bold leading-tight text-[#0B0F12] group-hover:text-[#A3E2C9] transition-colors duration-300">
                      {art.title}
                    </h2>

                    {/* Body copy styled at 16px, 160% line-height */}
                    <p className="interface-text text-base text-[#0B0F12]/70 group-hover:text-[#F7F5F0]/70 transition-colors duration-300 leading-[1.60] mt-1">
                      {art.description}
                    </p>
                  </div>
                </div>

                {/* Card Footer Metadata */}
                <div className="flex justify-between items-center border-t border-black/5 group-hover:border-white/10 pt-4 mt-6">
                  <div className="flex flex-col text-[11px] text-black/50 group-hover:text-[#F7F5F0]/50 font-mono transition-colors duration-300 text-left">
                    <span className="font-semibold text-black/85 group-hover:text-[#F7F5F0]/85">{art.author}</span>
                    <span>{art.readTime}</span>
                  </div>
                  <MagneticButton className="px-3.5 py-1.5 bg-black/5 text-[#0B0F12] group-hover:bg-[#A3E2C9] group-hover:text-[#0B0F12] text-[10px] font-bold uppercase tracking-wider font-sans rounded-md transition-colors duration-300 border-none cursor-pointer">
                    Read Log
                  </MagneticButton>
                </div>

              </article>
            );
          })}
        </div>

      </div>

      {/* Article Detail Reader Modal Overlay (Z-index: 5000) */}
      {selectedArticle && (
        <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4">
          {/* Backdrop mask */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-[4px] cursor-pointer"
            onClick={() => setSelectedArticle(null)}
          />
          {/* Modal Container */}
          <div className="relative w-full max-w-3xl max-h-[85vh] bg-[#F7F5F0] text-[#0B0F12] rounded-2xl shadow-2xl border border-black/10 flex flex-col overflow-hidden text-left">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-black/10 flex justify-between items-center bg-[#ffffff]/60 backdrop-blur-md">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-mono text-[#A3E2C9] bg-[#0B0F12] px-2.5 py-1 rounded-full inline-block self-start font-bold uppercase tracking-wider">
                  {selectedArticle.category}
                </span>
                <span className="text-xs text-[#0B0F12]/55 font-mono mt-1">
                  By {selectedArticle.author} • {selectedArticle.readTime}
                </span>
              </div>
              <button 
                onClick={() => setSelectedArticle(null)}
                className="text-[#0B0F12]/50 hover:text-[#0B0F12] text-sm font-mono focus:outline-none border-none bg-transparent cursor-pointer font-bold"
              >
                [ CLOSE ]
              </button>
            </div>

            {/* Modal Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-6 font-sans text-[#0B0F12]/80 leading-relaxed text-sm md:text-base">
              <h2 className="display-header text-2xl md:text-4xl font-black text-[#0B0F12] leading-tight uppercase">
                {selectedArticle.title}
              </h2>
              
              <div className="whitespace-pre-line space-y-4 font-sans leading-[1.60] text-sm md:text-base pr-2">
                {selectedArticle.content.split('\n\n').map((para, idx) => {
                  const isLink = para.includes('// LINK PLACEHOLDER:');
                  if (isLink) {
                    const skuMatch = para.match(/sku=(\w+)/);
                    const sku = skuMatch ? skuMatch[1] : '12oz';
                    return (
                      <div key={idx} className="my-6 p-4 rounded-xl bg-[#1A2E22] text-light-cream border border-[#A3E2C9]/20 flex items-center justify-between flex-wrap gap-3">
                        <div className="flex flex-col gap-0.5 text-left">
                          <span className="text-[9px] font-mono text-mint uppercase tracking-wider font-bold">RECOMMENDED PRODUCT</span>
                          <span className="text-xs font-sans text-white/90">Configure your circular {sku} vessel inside our store:</span>
                        </div>
                        {/* TODO: confirm with founder */}
                        <a 
                          href="#/shop" 
                          onClick={(e) => {
                            e.preventDefault();
                            setSelectedArticle(null);
                            alert(`Redirecting to config for ${sku} vessel in Shop page!`);
                          }}
                          className="px-4 py-2 bg-mint hover:bg-mint/95 text-deep-ink text-xs font-bold uppercase tracking-wider rounded-lg border-none cursor-pointer flex-shrink-0 text-center font-sans text-deep-ink no-underline font-semibold"
                        >
                          Configure {sku} Vessel
                        </a>
                      </div>
                    );
                  }
                  return (
                    <p key={idx}>
                      {para}
                    </p>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}

export default JournalFeed;
