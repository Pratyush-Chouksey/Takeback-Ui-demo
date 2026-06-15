import React, { useState, useEffect } from 'react';
import MagneticButton from './MagneticButton';

export function ReturnMap({ triggerReward }) {
  const [returnState, setReturnState] = useState('idle'); // idle, checking, refunded
  const [selectedCafe, setSelectedCafe] = useState({
    id: 'thirdwave',
    name: 'Third Wave Coffee Co.',
    nodes: '14 Urban Hub Nodes',
    location: 'Bengaluru Core',
    x: 180,
    y: 220,
    dist: '1.2 km',
    description: 'Active drop points covering Indiranagar, Koramangala, and HSR Layout.'
  });

  const cafes = [
    {
      id: 'thirdwave',
      name: 'Third Wave Coffee Co.',
      nodes: '14 Urban Hub Nodes',
      location: 'Bengaluru Core',
      x: 180,
      y: 220,
      dist: '1.2 km',
      description: 'Active drop points covering Indiranagar, Koramangala, and HSR Layout.'
    },
    {
      id: 'bluetokai',
      name: 'Blue Tokai Coffee Roasters',
      nodes: '22 Metro Nodes',
      location: 'Mumbai/Delhi Capital Region',
      x: 280,
      y: 130,
      dist: '3.4 km',
      description: 'Active drop points covering Bandra, Colaba, Safdarjung, and CyberCity.'
    },
    {
      id: 'subko',
      name: 'Subko Coffee Roasters',
      nodes: '6 Specialty Nodes',
      location: 'Bandra/Colaba Districts',
      x: 110,
      y: 310,
      dist: '0.8 km',
      description: 'Specialty nodes featuring integrated return drawer bays.'
    },
    {
      id: 'araku',
      name: 'Araku Coffee',
      nodes: '2 flagship Heritage Nodes',
      location: 'Indiranagar Hub',
      x: 310,
      y: 280,
      dist: '1.9 km',
      description: 'Flagship return node equipped with automatic weigh scale detectors.'
    }
  ];

  const handleReturnSimulate = () => {
    setReturnState('checking');
    // Simulate drop validation checklist
    setTimeout(() => {
      setReturnState('refunded');
      triggerReward(); // trigger cashback rain cascade!
    }, 1200);
  };

  const resetReturn = () => {
    setReturnState('idle');
  };

  return (
    <section className="min-h-screen w-full bg-[#1E252B] text-light-cream pt-28 pb-16 flex items-center justify-center">
      <div className="layout-grid items-stretch gap-8">
        
        {/* Left Side: Directory of active cafes */}
        <div className="col-span-4 lg:col-span-6 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-mono uppercase text-mint tracking-wider font-bold">
              GEOLOCATION SEARCH
            </span>
            <h1 className="display-header text-4xl md:text-5xl font-black text-light-cream leading-none uppercase">
              DROP POINT DIRECTORY
            </h1>
            <p className="interface-text text-sm text-white/70 mt-1">
              Locate active partnered cafes. Scan the partnered café drop-box to return vessels and earn cashback.
            </p>
          </div>

          {/* Glassmorphic Cafe Directory */}
          <div className="flex flex-col gap-3 pr-2 overflow-y-auto max-h-[380px]">
            {cafes.map((cafe) => {
              const isSelected = selectedCafe.id === cafe.id;
              return (
                <div 
                  key={cafe.id}
                  onClick={() => setSelectedCafe(cafe)}
                  onMouseEnter={() => setSelectedCafe(cafe)}
                  className={`glass-panel p-5 rounded-2xl cursor-pointer transition-all duration-300 hover:-translate-y-0.5 border ${
                    isSelected 
                      ? 'bg-mint/10 border-mint shadow-md' 
                      : 'border-white/5 bg-[#1a252b]/40 hover:bg-[#1a252b]/60'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-mono text-mint tracking-wider font-bold uppercase">
                        {cafe.nodes}
                      </span>
                      <h3 className="display-header text-base font-bold text-light-cream">
                        {cafe.name}
                      </h3>
                      <span className="text-xs text-white/55 font-mono">{cafe.location}</span>
                    </div>
                    <span className="text-xs font-mono text-mint font-bold bg-mint/10 px-2.5 py-1 rounded">
                      {cafe.dist}
                    </span>
                  </div>
                  
                  {isSelected && (
                    <p className="interface-text text-xs text-white/70 mt-3 pt-3 border-t border-white/5 leading-relaxed">
                      {cafe.description}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Geolocation Map simulation and cashback drawer */}
        <div className="col-span-4 lg:col-span-6 flex flex-col gap-6 justify-between p-6 rounded-2xl bg-white/5 border border-white/10 relative overflow-hidden min-h-[460px]">
          
          {/* Map Viewer Container */}
          <div className="flex-1 w-full rounded-xl bg-black/50 border border-white/10 relative overflow-hidden flex items-center justify-center shadow-inner">
            
            {/* Moving Geolocation Map Background */}
            <div 
              className="absolute w-[800px] h-[800px] flex items-center justify-center"
              style={{
                transform: `translate3d(${200 - selectedCafe.x}px, ${200 - selectedCafe.y}px, 0)`,
                transition: 'transform 0.7s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
              }}
            >
              {/* Map grid streets representation */}
              <div className="absolute inset-0 bg-[#0F1418] grid grid-cols-10 grid-rows-10 opacity-40">
                {Array.from({ length: 100 }).map((_, i) => (
                  <div key={i} className="border-[0.5px] border-white/10 flex items-center justify-center font-mono text-[6px] text-white/5" />
                ))}
              </div>

              {/* Streets paths */}
              <div className="absolute w-[800px] h-2 bg-white/5 rotate-12 top-[120px]" />
              <div className="absolute w-[800px] h-3 bg-white/5 -rotate-45 top-[340px]" />
              <div className="absolute w-[800px] h-2 bg-white/5 rotate-90 left-[400px]" />
              <div className="absolute w-[800px] h-1.5 bg-white/5 rotate-45 top-[580px]" />

              {/* Cafe Node Pins */}
              {cafes.map((cafe) => {
                const isSelected = selectedCafe.id === cafe.id;
                return (
                  <div 
                    key={cafe.id}
                    className="absolute transition-transform duration-300"
                    style={{ left: `${cafe.x}px`, top: `${cafe.y}px` }}
                  >
                    <div className="relative flex items-center justify-center">
                      {/* Pulse ring indicator in Tech Mint (#A3E2C9) */}
                      {isSelected && (
                        <>
                          <div className="absolute w-12 h-12 rounded-full border-2 border-[#A3E2C9] animate-ping opacity-45" />
                          <div className="absolute w-6 h-6 rounded-full border border-[#A3E2C9] animate-pulse" />
                        </>
                      )}
                      
                      {/* Central node pin dot */}
                      <div 
                        onClick={() => setSelectedCafe(cafe)}
                        className={`w-3.5 h-3.5 rounded-full cursor-pointer border shadow transition-transform ${
                          isSelected ? 'bg-[#A3E2C9] border-[#0B0F12] scale-125' : 'bg-[#F5B973] border-white'
                        }`}
                      />

                      {/* Label tooltip */}
                      <span className="absolute top-5 left-1/2 -translate-x-1/2 whitespace-nowrap bg-[#0B0F12]/90 border border-white/15 px-2 py-0.5 rounded text-[8px] font-mono font-bold tracking-wide text-[#F7F5F0] shadow-md">
                        {cafe.name.split(' ')[0]}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Viewfinder crosshair overlay */}
            <div className="absolute inset-0 pointer-events-none border-2 border-dashed border-[#A3E2C9]/20 rounded-lg m-2 flex items-center justify-center">
              <div className="w-4 h-4 border border-[#A3E2C9]/45 rounded-full flex items-center justify-center opacity-70">
                <div className="w-1 h-1 bg-[#A3E2C9] rounded-full" />
              </div>
            </div>
          </div>

          {/* Interactive Simulation validation drawer */}
          <div className="z-10 bg-[#0B0F12] border border-white/10 p-5 rounded-xl flex flex-col gap-4">
            <div className="flex justify-between items-baseline border-b border-white/5 pb-3">
              <h3 className="display-header text-sm font-bold text-light-cream uppercase tracking-wide">
                Smart Drop Validation
              </h3>
              <span className="text-xs font-mono text-mint">{selectedCafe.dist} away</span>
            </div>

            {returnState === 'idle' && (
              <div className="flex flex-col gap-3">
                <p className="interface-text text-xs text-white/60 leading-relaxed">
                  Verify your vessel is placed inside the <strong>{selectedCafe.name}</strong> receiver bin. The photo-sensor will validate the base stamp.
                </p>
                <button
                  onClick={handleReturnSimulate}
                  className="w-full py-3.5 bg-mint hover:bg-mint/95 text-deep-ink font-bold rounded-xl text-xs uppercase tracking-wider font-sans focus-visible:outline-none cursor-pointer"
                  style={{ minHeight: '48px' }}
                >
                  Simulate Deposit Scan
                </button>
              </div>
            )}

            {returnState === 'checking' && (
              <div className="flex flex-col items-center justify-center py-6 gap-3">
                <div className="w-8 h-8 rounded-full border-2 border-mint border-t-transparent animate-spin" />
                <span className="text-xs font-mono text-mint uppercase tracking-wider">checking drop validation webhook...</span>
              </div>
            )}

            {returnState === 'refunded' && (
              <div className="flex flex-col items-center text-center gap-3">
                <div className="w-12 h-12 rounded-full bg-mint/20 border border-mint flex items-center justify-center text-mint font-black text-lg animate-bounce">
                  ✓
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-black font-mono text-gold-amber">+ ₹ 15.00</span>
                  <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest mt-0.5">UPI CASHBACK SETTLED</span>
                </div>
                <button
                  onClick={resetReturn}
                  className="text-xs font-mono text-mint underline hover:text-white mt-1 focus-visible:outline-none cursor-pointer"
                  style={{ minHeight: '48px' }}
                >
                  Return Another Vessel
                </button>
              </div>
            )}
          </div>

          <div className="text-[10px] font-mono text-white/30 pt-4 border-t border-white/5 flex justify-between select-none">
            <span>NETWORK SYSTEM CORE v1.0</span>
            <span>SECURE ESCROW CHANNEL</span>
          </div>

        </div>

      </div>
    </section>
  );
}

export default ReturnMap;
