import React from 'react';
import MagneticButton from './MagneticButton';

export function JournalFeed() {
  const articles = [
    {
      category: 'CULTURE',
      title: 'The Specialty Coffee Shift in Indian Cities',
      author: 'Pratyush Chouksey',
      readTime: '5 min read',
      illustration: (
        <svg className="w-full h-full bg-[#1A2E22]/5 text-[#1A2E22]" viewBox="0 0 200 200" fill="none">
          {/* Stylized coffee cup vector */}
          <rect x="50" y="60" width="100" height="90" rx="12" stroke="currentColor" strokeWidth="2.5" />
          <path d="M 150,85 C 165,85 165,115 150,115" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="75" y1="35" x2="75" y2="45" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <line x1="100" y1="30" x2="100" y2="45" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <line x1="125" y1="35" x2="125" y2="45" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          {/* Ambient grid lines */}
          <line x1="20" y1="170" x2="180" y2="170" stroke="currentColor" strokeWidth="1" strokeDasharray="4,4" />
        </svg>
      )
    },
    {
      category: 'DESIGN SCIENCE',
      title: 'Austenitic Steel & Thermal Retentions',
      author: 'Materials Lab',
      readTime: '8 min read',
      illustration: (
        <svg className="w-full h-full bg-[#C26343]/5 text-[#C26343]" viewBox="0 0 200 200" fill="none">
          {/* Double-wall vacuum diagram */}
          <circle cx="100" cy="100" r="65" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3,3" />
          <circle cx="100" cy="100" r="55" stroke="currentColor" strokeWidth="3" />
          <circle cx="100" cy="100" r="45" stroke="currentColor" strokeWidth="1.5" />
          {/* Ray lines demonstrating thermal reflection */}
          <line x1="100" y1="100" x2="160" y2="40" stroke="currentColor" strokeWidth="1" />
          <line x1="100" y1="100" x2="40" y2="160" stroke="currentColor" strokeWidth="1" />
          <line x1="100" y1="100" x2="150" y2="150" stroke="currentColor" strokeWidth="1" />
        </svg>
      )
    },
    {
      category: 'FIELD NOTES',
      title: 'Partner Cafe Return Automation Cases',
      author: 'Ops Team',
      readTime: '6 min read',
      illustration: (
        <svg className="w-full h-full bg-mint/5 text-[#1E252B]" viewBox="0 0 200 200" fill="none">
          {/* Smart drop bin connectivity diagram */}
          <rect x="70" y="50" width="60" height="100" rx="8" stroke="currentColor" strokeWidth="2.5" />
          <circle cx="100" cy="80" r="12" stroke="currentColor" strokeWidth="2" />
          <path d="M 90,120 H 110" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          {/* Simulated signal beams */}
          <path d="M 85,25 C 95,20 105,20 115,25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M 75,15 C 90,8 110,8 125,15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      )
    }
  ];

  return (
    <section 
      id="editorial-journal-section"
      className="relative min-h-screen w-full bg-[#F4F3EF] text-[#0B0F12] border-t border-black/5"
    >
      <div className="max-w-[1440px] mx-auto px-5 lg:px-20 py-16 md:py-24 flex flex-col gap-12 md:gap-16">
        
        {/* Section Title */}
        <div className="flex flex-col gap-2 max-w-xl">
          <span className="text-xs font-mono tracking-[0.2em] text-[#1a2e22]/70 uppercase font-semibold">
            CHAPTER 8 // EDITORIAL JOURNAL
          </span>
          <h2 className="display-header text-3xl md:text-5xl font-black text-[#0B0F12]">
            THE TAKEBACK LOG
          </h2>
        </div>

        {/* 
          Asymmetric 3-Column Editorial Grid structure.
          Separates sections cleanly without harsh borders.
        */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {articles.map((art, idx) => (
            <article 
              key={idx}
              className="group flex flex-col justify-between p-6 rounded-2xl bg-[#ffffff]/35 hover:bg-[#ffffff]/80 transition-all duration-500 cursor-pointer shadow-sm hover:shadow-md"
            >
              <div className="flex flex-col gap-4">
                
                {/* Bounding image mask container */}
                <div className="w-full h-48 md:h-56 rounded-xl overflow-hidden relative border border-black/5">
                  <div className="w-full h-full spring-transition group-hover:scale-[1.04]">
                    {art.illustration}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-mono text-black/50 uppercase tracking-widest font-semibold">
                    {art.category}
                  </span>
                  
                  {/* Semantic Heading 4 path */}
                  <h4 className="display-header text-lg md:text-xl font-bold leading-snug text-[#0B0F12] group-hover:text-mint spring-transition">
                    {art.title}
                  </h4>
                </div>
              </div>

              {/* Card Footer Metadata */}
              <div className="flex justify-between items-center border-t border-black/5 pt-4 mt-6">
                <div className="flex flex-col text-[11px] text-black/50 font-mono">
                  <span className="font-semibold text-black/85">{art.author}</span>
                  <span>{art.readTime}</span>
                </div>
                <MagneticButton className="px-3.5 py-1.5 bg-black/5 group-hover:bg-[#A3E2C9] text-deep-ink text-[10px] font-semibold uppercase tracking-wider font-sans rounded-md">
                  Read Log
                </MagneticButton>
              </div>

            </article>
          ))}
        </div>

      </div>
    </section>
  );
}

export default JournalFeed;
