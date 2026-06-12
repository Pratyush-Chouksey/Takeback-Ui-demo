import React from 'react';
import MagneticButton from './MagneticButton';

export function BottomNav({ currentRoute, setRoute }) {
  return (
    <nav 
      className="fixed bottom-4 left-4 right-4 h-16 z-[5000] md:hidden glass-panel px-6 rounded-full flex items-center justify-between shadow-2xl border border-white/15"
      style={{
        position: 'fixed',
        bottom: '16px',
        left: '16px',
        right: '16px',
        height: '64px',
        zIndex: 5000
      }}
    >
      
      {/* 1. Map Nodes Link */}
      <button 
        onClick={() => setRoute('/return')}
        className={`flex flex-col items-center gap-1 focus-visible:outline-none transition-colors duration-300 w-16 bg-transparent border-none cursor-pointer ${
          currentRoute === '/return' ? 'text-mint' : 'text-white/50'
        }`}
        style={{ minHeight: '48px', justifyContent: 'center' }}
        aria-label="Cafe Map Bins"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span className="text-[9px] font-mono font-bold tracking-wider uppercase">Map Nodes</span>
      </button>

      {/* 2. Central SCAN FAB (56x56px, translateY -12px, border-radius 50%) */}
      <MagneticButton 
        onClick={() => setRoute('/borrow')}
        className="bg-mint hover:bg-mint/90 text-deep-ink flex items-center justify-center shadow-lg shadow-mint/25 border border-[#0B0F12]/10 cursor-pointer"
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          transform: 'translateY(-12px)',
          minHeight: '56px',
          padding: 0
        }}
        aria-label="Scan to Borrow"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
        </svg>
      </MagneticButton>

      {/* 3. Wallet / Account Link */}
      <button 
        onClick={() => setRoute('/account')}
        className={`flex flex-col items-center gap-1 focus-visible:outline-none transition-colors duration-300 w-16 bg-transparent border-none cursor-pointer ${
          currentRoute === '/account' ? 'text-mint' : 'text-white/50'
        }`}
        style={{ minHeight: '48px', justifyContent: 'center' }}
        aria-label="Cashback Wallet Account"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
        <span className="text-[9px] font-mono font-bold tracking-wider uppercase">Wallet</span>
      </button>

    </nav>
  );
}

export default BottomNav;
