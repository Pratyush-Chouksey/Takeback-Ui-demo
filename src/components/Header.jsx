import React, { useState } from 'react';
import MagneticButton from './MagneticButton';

export function Header({ currentRoute, setRoute, currentUser, onSignOut, onLoginClick }) {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { label: 'The Loop', path: '/' },
    { label: 'Shop', path: '/shop' },
    { label: 'Impact Live', path: '/impact' },
    { label: 'For Cafés', path: '/for-cafes' },
    { label: 'About', path: '/about' },
    { label: 'Journal', path: '/journal' },
    { label: 'Account', path: '/account' }
  ];

  if (currentUser && currentUser.role === 'admin') {
    navLinks.push({ label: 'Admin Panel', path: '/admin' });
  }

  return (
    <>
      <header className="fixed top-0 left-0 w-full h-20 z-[1000] bg-deep-ink/95 backdrop-blur-md border-b border-white/10 spring-transition">
        <div className="max-w-[1440px] h-full mx-auto px-5 lg:px-20 flex items-center justify-between">
          
          {/* Brand Mark */}
          <button 
            onClick={() => setRoute('/')} 
            className="flex items-center gap-2 group focus-visible:outline-none bg-transparent border-none cursor-pointer"
          >
            <span className="w-3.5 h-3.5 rounded-full bg-mint shadow-[0_0_12px_rgba(163,226,201,0.5)] spring-transition group-hover:scale-125" />
            <span className="display-header text-xl md:text-2xl font-bold tracking-tight text-light-cream">
              Takeback
            </span>
          </button>

          {/* Desktop Center Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => setRoute(link.path)}
                className={`interface-text text-sm font-medium spring-transition relative py-2 focus-visible:outline-none bg-transparent border-none cursor-pointer ${
                  currentRoute === link.path ? 'text-mint font-bold' : 'text-white/70 hover:text-mint'
                }`}
              >
                {link.label}
                {currentRoute === link.path && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-mint rounded" />
                )}
              </button>
            ))}
          </nav>

          {/* Desktop Right Action */}
          <div className="hidden md:flex items-center gap-4">
            <MagneticButton 
              className="px-5 py-2.5 bg-mint hover:bg-mint/95 text-deep-ink font-semibold rounded-lg text-xs tracking-wider uppercase font-sans border-none cursor-pointer"
              onClick={() => setRoute('/borrow')}
            >
              Scan to Borrow
            </MagneticButton>
            {currentUser ? (
              <button
                onClick={onSignOut}
                className="px-4 py-2 border border-white/20 hover:border-white/50 text-white/80 hover:text-white rounded-lg text-xs font-mono bg-transparent cursor-pointer spring-transition uppercase"
                style={{ minHeight: '38px', display: 'inline-flex', alignItems: 'center' }}
              >
                Sign Out
              </button>
            ) : (
              <button
                onClick={onLoginClick}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-mono border border-white/10 cursor-pointer spring-transition uppercase"
                style={{ minHeight: '38px', display: 'inline-flex', alignItems: 'center' }}
              >
                Login
              </button>
            )}
          </div>

          {/* Mobile Hamburger Menu */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 -mr-2 text-white/80 hover:text-mint focus-visible:outline-none spring-transition bg-transparent border-none cursor-pointer"
              aria-label="Toggle navigation menu"
              aria-expanded={isOpen}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Menu Drawer (Z-index: 5000 to overlay all layout content layers) */}
      <div 
        className={`fixed inset-0 z-[5000] md:hidden pointer-events-none transition-all duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0'
        }`}
      >
        {/* Backdrop overlay */}
        <div 
          onClick={() => setIsOpen(false)}
          className="absolute inset-0 bg-deep-ink/90 backdrop-blur-md transition-opacity duration-300 cursor-pointer"
        />

        {/* Sliding Menu Panel */}
        <aside 
          className={`absolute right-0 top-0 h-full w-[280px] bg-muted-slate border-l border-white/10 p-6 flex flex-col justify-between shadow-2xl transition-transform duration-300 ease-out ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
              <span className="display-header text-lg font-bold text-light-cream">Menu</span>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white/60 hover:text-mint focus-visible:outline-none spring-transition bg-transparent border-none cursor-pointer"
                aria-label="Close menu"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <nav className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => {
                    setRoute(link.path);
                    setIsOpen(false);
                  }}
                  className={`nav-link interface-text text-left text-lg font-medium spring-transition focus-visible:outline-none bg-transparent border-none cursor-pointer ${
                    currentRoute === link.path ? 'text-mint font-bold' : 'text-white/80 hover:text-mint'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => {
                setRoute('/borrow');
                setIsOpen(false);
              }}
              className="w-full py-3 bg-mint hover:bg-mint/90 text-deep-ink font-semibold rounded-lg text-sm tracking-wider uppercase font-sans border-none cursor-pointer spring-transition"
            >
              Scan to Borrow
            </button>
            {currentUser ? (
              <button
                onClick={() => {
                  onSignOut();
                  setIsOpen(false);
                }}
                className="w-full py-2.5 border border-white/20 hover:border-white/40 text-white font-medium rounded-lg text-xs font-mono bg-transparent cursor-pointer spring-transition uppercase"
              >
                Sign Out
              </button>
            ) : (
              <button
                onClick={() => {
                  onLoginClick();
                  setIsOpen(false);
                }}
                className="w-full py-2.5 bg-white/10 hover:bg-white/15 text-white font-medium rounded-lg text-xs font-mono border border-white/10 cursor-pointer spring-transition uppercase"
              >
                Login / Register
              </button>
            )}
          </div>
        </aside>
      </div>
    </>
  );
}

export default Header;
