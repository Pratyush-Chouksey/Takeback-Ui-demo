import React, { useState } from 'react';
import staticCup from '../assets/product_lifestyle.png';
import MagneticButton from './MagneticButton';

export function PWADemo() {
  const [scanState, setScanState] = useState('idle'); // idle, scanning, success
  const [showNotification, setShowNotification] = useState(false);

  const triggerScan = () => {
    if (scanState === 'scanning') return;
    
    setScanState('scanning');
    setShowNotification(false);

    // 800ms automatic timer check for scan validation focus morph
    setTimeout(() => {
      setScanState('success');
      setShowNotification(true);
    }, 1100); 
  };

  const resetScan = () => {
    setScanState('idle');
    setShowNotification(false);
  };

  return (
    <section 
      id="pwa-workflow-section"
      className="relative min-h-screen w-full bg-[#1A2E22] text-light-cream border-t border-white/5"
    >
      {/* Inline styles for hardware-accelerated animations (no layout shifts) */}
      <style>{`
        @keyframes scanLaser {
          0% { transform: translateY(-30px); opacity: 0.2; }
          50% { transform: translateY(30px); opacity: 1; }
          100% { transform: translateY(-30px); opacity: 0.2; }
        }
        @keyframes ringExpand {
          0% { transform: scale(0.5); opacity: 0.8; }
          100% { transform: scale(3.2); opacity: 0; }
        }
        @keyframes reticlePulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(0.94); }
        }
      `}</style>

      <div className="max-w-[1440px] mx-auto px-5 lg:px-20 py-16 md:py-24 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
        
        {/* Left Column Segment: Conceptual explainer blocks */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-mono tracking-[0.2em] text-mint uppercase font-semibold">
              CHAPTER 5 // ZERO FRICTION APP
            </span>
            <h2 className="display-header text-3xl md:text-5xl font-black text-light-cream">
              THE 3-SECOND DIGITAL DEPOSIT
            </h2>
          </div>

          <p className="interface-text text-sm md:text-base text-white/75 leading-[1.60] max-w-lg">
            We eliminated download friction. Scan to release and return directly through our lightweight Progressive Web App container. No app store installation, no credentials creation.
          </p>

          {/* Stats matrix */}
          <div className="grid grid-cols-2 gap-4 max-w-md mt-4 font-mono text-xs">
            <div className="p-4 rounded-lg bg-white/5 border border-white/10 flex flex-col">
              <span className="text-white/40 uppercase">SCAN VERIFICATION</span>
              <span className="text-mint font-bold text-lg mt-1 font-mono technical-figures">800 ms</span>
            </div>
            <div className="p-4 rounded-lg bg-white/5 border border-white/10 flex flex-col">
              <span className="text-white/40 uppercase">UPI REFUND RATE</span>
              <span className="text-gold-amber font-bold text-lg mt-1 font-mono technical-figures">&lt; 3 Secs</span>
            </div>
            <div className="p-4 rounded-lg bg-white/5 border border-white/10 col-span-2 flex justify-between items-center px-4 py-3">
              <span className="text-white/40 uppercase">TRANSACTION COST</span>
              <span className="text-mint font-bold">₹0.00 (ZERO FEES)</span>
            </div>
          </div>

          {/* Reset control */}
          {scanState === 'success' && (
            <div className="mt-2">
              <button
                onClick={resetScan}
                className="text-xs font-mono text-mint underline hover:text-white focus-visible:outline-none"
              >
                Reset Scanner Simulation
              </button>
            </div>
          )}
        </div>

        {/* Right Interactive Area: Precision mobile device frame container */}
        <div className="flex justify-center items-center">
          
          {/* PWA Phone Shell */}
          <div className="relative w-[310px] h-[610px] rounded-[36px] bg-[#0A0D0B] border-[6px] border-[#2C322E] shadow-2xl overflow-hidden flex flex-col">
            
            {/* Status bar Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-xl z-50 flex items-center justify-center">
              <div className="w-12 h-1 bg-[#2C322E] rounded-full" />
            </div>

            {/* PWA Notification Slide Down Banner (z-40 overlay) */}
            <div 
              className={`absolute top-8 left-3 right-3 z-40 bg-[#121613] border border-mint/20 rounded-xl p-3.5 shadow-xl transition-all duration-500 transform ${
                showNotification ? 'translate-y-0 opacity-100' : '-translate-y-24 opacity-0 pointer-events-none'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-mint/10 border border-mint/30 flex items-center justify-center text-mint font-black text-xs">
                  ✓
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-mono text-white/55 uppercase font-bold tracking-wide">
                    deposit return success
                  </span>
                  <span className="text-xs font-semibold text-light-cream">
                    ₹15 Cashback Verified via UPI
                  </span>
                </div>
              </div>
            </div>

            {/* Screen Content Wrapper */}
            <div className="flex-1 w-full relative flex flex-col justify-between bg-gradient-to-b from-[#111612] to-[#0D100D] pt-10 pb-6 px-4">
              
              {/* Internal Mock Header */}
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-mint animate-pulse" />
                  <span className="display-header text-sm font-bold text-light-cream tracking-tight">
                    takeback.in
                  </span>
                </div>
                <span className="text-[9px] px-1.5 py-0.5 border border-white/20 rounded-full text-white/40 font-mono">
                  PWA active
                </span>
              </div>

              {/* Mock Camera Viewfinder window */}
              <div className="relative flex-1 w-full bg-black/40 border border-white/10 rounded-2xl flex items-center justify-center overflow-hidden my-4">
                
                {/* Camera Viewfinder static cup image */}
                <div className="absolute inset-0 flex items-center justify-center p-8 bg-black/20">
                  <img 
                    src={staticCup} 
                    alt="Takeback smart cup camera simulator" 
                    className="w-full h-full object-contain filter drop-shadow-md"
                  />
                </div>

                {/* Background Simulated QR target */}
                <div className={`transition-opacity duration-500 opacity-30 w-32 h-32 flex flex-col items-center justify-center gap-2 border border-dashed border-white/20 rounded p-4 ${
                  scanState === 'success' ? 'opacity-10' : ''
                }`}>
                  <div className="grid grid-cols-4 gap-1 w-full h-full opacity-40">
                    {Array.from({ length: 16 }).map((_, i) => (
                      <div key={i} className="bg-white rounded-[2px]" />
                    ))}
                  </div>
                </div>

                {/* Animated Green ring expansion on success */}
                {scanState === 'success' && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
                    <div 
                      className="w-16 h-16 rounded-full border-2 border-mint"
                      style={{ animation: 'ringExpand 0.85s cubic-bezier(0.1, 0.8, 0.3, 1) forwards' }}
                    />
                  </div>
                )}

                {/* Scanning Reticle Vector Grid */}
                <div 
                  className="absolute z-20 flex items-center justify-center"
                  style={{
                    animation: scanState === 'scanning' ? 'reticlePulse 1s infinite ease-in-out' : 'none'
                  }}
                >
                  <svg className="w-32 h-32 transition-colors duration-500" viewBox="0 0 100 100">
                    {/* Corners */}
                    <path d="M 12,24 V 12 H 24" fill="none" stroke={scanState === 'success' ? '#A3E2C9' : '#F5B973'} strokeWidth="3.5" strokeLinecap="round" />
                    <path d="M 76,12 H 88 V 24" fill="none" stroke={scanState === 'success' ? '#A3E2C9' : '#F5B973'} strokeWidth="3.5" strokeLinecap="round" />
                    <path d="M 12,76 V 88 H 24" fill="none" stroke={scanState === 'success' ? '#A3E2C9' : '#F5B973'} strokeWidth="3.5" strokeLinecap="round" />
                    <path d="M 76,88 H 88 V 76" fill="none" stroke={scanState === 'success' ? '#A3E2C9' : '#F5B973'} strokeWidth="3.5" strokeLinecap="round" />
                    
                    {/* Core contents */}
                    {scanState === 'success' ? (
                      /* Success checkmark morph graphic */
                      <path 
                        d="M 36,52 L 46,62 L 64,42" 
                        fill="none" 
                        stroke="#A3E2C9" 
                        strokeWidth="5" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      />
                    ) : (
                      /* Scanning Laser grid line */
                      <line 
                        x1="18" y1="50" x2="82" y2="50" 
                        stroke="#F5B973" 
                        strokeWidth="2.5" 
                        style={{
                          animation: scanState === 'scanning' ? 'scanLaser 1.5s infinite linear' : 'none',
                          opacity: scanState === 'scanning' ? 1 : 0.4
                        }}
                      />
                    )}
                  </svg>
                </div>
                
              </div>

              {/* Trigger controller */}
              <div className="w-full flex flex-col gap-2">
                <MagneticButton 
                  className={`w-full py-3.5 rounded-xl text-xs font-semibold uppercase tracking-wider font-sans focus-visible:outline-none ${
                    scanState === 'success' 
                      ? 'bg-white/10 text-mint border border-mint/20' 
                      : 'bg-mint text-deep-ink hover:bg-mint/95'
                  }`}
                  onClick={triggerScan}
                  disabled={scanState === 'scanning'}
                >
                  {scanState === 'idle' && 'Scan Simulated QR Code'}
                  {scanState === 'scanning' && 'Scanning Cup...'}
                  {scanState === 'success' && 'Scan Successful ✓'}
                </MagneticButton>

                <div className="text-[10px] text-center font-mono text-white/40 uppercase tracking-widest mt-1 select-none">
                  [ UPI account linked: Pratyush@upi ]
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

export default PWADemo;
