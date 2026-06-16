import React, { useState } from 'react';
import MagneticButton from './MagneticButton';

export function Footer({ setRoute }) {
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (sectionIndex) => {
    setOpenSection(openSection === sectionIndex ? null : sectionIndex);
  };

  const footerDirectories = [
    {
      title: 'THE LOOP',
      links: [
        { label: 'Deposit Registry', path: '/' },
        { label: 'Smart Bin Finder', path: '/return' },
        { label: 'B2B Coffee System', path: '/for-cafes' },
        { label: 'Carbon Offset Logs', path: '/impact' }
      ]
    },
    {
      title: 'COMPANY',
      links: [
        { label: 'Founder Origin Archive', path: '/about' },
        { label: 'Asymmetric Editorial', path: '/journal' },
        { label: 'Usage Metrics Tracker', path: '/impact' },
        { label: 'The Insulated Vessel', path: '/shop' }
      ]
    },
    {
      title: 'B2B NETWORK',
      links: [
        { label: 'Join as Cafe Partner', path: '/for-cafes' },
        { label: 'Account Dashboard', path: '/account' },
        { label: 'System Loop Guide', path: '/' }
      ]
    }
  ];

  return (
    <footer 
      id="global-system-footer"
      className="relative z-10 bg-[#0B0F12] text-light-cream border-t border-white/10 pt-16 pb-8"
    >
      <div className="max-w-[1440px] mx-auto px-5 lg:px-20 flex flex-col gap-12">
        
        {/* Main Footer Directory layout grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 pb-12 border-b border-white/10">
          
          {/* Responsive Directories 1, 2, 3 */}
          {footerDirectories.map((dir, idx) => {
            const isSectionOpen = openSection === idx;
            return (
              <div key={idx} className="flex flex-col gap-4 border-b border-white/5 md:border-b-0 pb-4 md:pb-0">
                
                {/* Mobile Accordion Header / Desktop static label */}
                <button 
                  onClick={() => toggleSection(idx)}
                  className="w-full md:pointer-events-none text-left flex justify-between items-center focus-visible:outline-none bg-transparent border-none cursor-pointer"
                  aria-expanded={isSectionOpen}
                >
                  <h3 className="text-xs font-mono tracking-widest text-white/50 uppercase font-semibold">
                    {dir.title}
                  </h3>
                  {/* Accordion indicator for mobile screen viewports */}
                  <span className="text-white/40 text-xs md:hidden">
                    {isSectionOpen ? '▲' : '▼'}
                  </span>
                </button>

                {/* Collapsible Link list */}
                <ul className={`flex flex-col gap-3.5 mt-2 md:mt-0 font-sans text-xs ${
                  isSectionOpen ? 'flex' : 'hidden md:flex'
                }`}>
                  {dir.links.map((link, lIdx) => (
                    <li key={lIdx}>
                      {link.path && setRoute ? (
                        <button
                          onClick={() => setRoute(link.path)}
                          className="interface-text text-white/70 hover:text-mint spring-transition focus-visible:outline-none bg-transparent border-none cursor-pointer text-left p-0"
                          style={{ minHeight: 'auto' }}
                        >
                          {link.label}
                        </button>
                      ) : (
                        <a 
                          href={link.href || '#'}
                          className="interface-text text-white/70 hover:text-mint spring-transition focus-visible:outline-none"
                        >
                          {link.label}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>

              </div>
            );
          })}

          {/* Column 4: Newsletter Subscription Input */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-mono tracking-widest text-white/50 uppercase font-semibold">
              NEWSLETTER SIGNUP
            </h3>
            <p className="interface-text text-xs text-white/60 leading-[1.60] max-w-xs">
              Subscribe to get release logs, partner cafe network launches, and B2B carbon summaries.
            </p>
            
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                alert("Subscription registered.");
              }}
              className="flex gap-2 w-full max-w-sm mt-1"
            >
              <input 
                type="email" 
                placeholder="Email address"
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-xs text-light-cream placeholder:text-white/20 focus:ring-2 focus:ring-mint focus:outline-none transition-all duration-300"
                required 
              />
              <button 
                type="submit"
                className="px-4 py-2.5 bg-mint hover:bg-mint/90 text-deep-ink font-semibold rounded-lg text-xs tracking-wider uppercase font-sans focus-visible:outline-none spring-transition"
              >
                Join
              </button>
            </form>
          </div>

        </div>

        {/* Verification badging + Copyright row */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 text-[11px] font-mono text-white/45">
          
          {/* Logo badging */}
          <div className="flex items-center gap-6">
            
            {/* 1% For the Planet Badge outline */}
            <div className="flex items-center gap-2 border border-white/10 px-3 py-1.5 rounded bg-white/5 select-none">
              <svg className="w-4 h-4 text-mint" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="M12 2a10 10 0 0 1 10 10c0 1.5-.3 3-.9 4.3L12 12V2z" />
              </svg>
              <span className="font-semibold uppercase tracking-wider">1% FOR THE PLANET</span>
            </div>

            {/* B-Corp Badge outline */}
            <div className="flex items-center gap-2 border border-white/10 px-3 py-1.5 rounded bg-white/5 select-none">
              <div className="w-4 h-4 rounded-full bg-mint text-deep-ink flex items-center justify-center font-black text-[10px]">
                B
              </div>
              <span className="font-semibold uppercase tracking-wider">B-CORP (PENDING CERTIFICATION)</span>
            </div>

          </div>

          {/* Legal / Copyright details */}
          <div className="flex flex-col md:items-end gap-1.5 text-center md:text-right">
            <span>© {new Date().getFullYear()} TAKEBACK • ZERO WASTE NETWORK</span>
            <div className="flex gap-4 justify-center md:justify-end">
              <a href="#" className="hover:text-mint transition-colors">Privacy Policy</a>
              <span>•</span>
              <a href="#" className="hover:text-mint transition-colors">Terms of Loop Service</a>
            </div>
          </div>

        </div>

      </div>
    </footer>
  );
}

export default Footer;
