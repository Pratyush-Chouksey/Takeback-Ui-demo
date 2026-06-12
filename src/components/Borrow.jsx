import React, { useState, useEffect } from 'react';
import staticCup from '../assets/takeback-cup-static.png';
import MagneticButton from './MagneticButton';

export function Borrow({ triggerReward }) {
  const [scanState, setScanState] = useState('idle'); // idle, scanning, upi, success
  const [cameraPermission, setCameraPermission] = useState(true);

  const startScan = () => {
    setScanState('scanning');
    
    // Simulate events dispatching targeting global WebGL canvas
    const event = new CustomEvent('canvas-mode-update', {
      detail: { mode: 2 } // Set interact to 2: Scan targeting focus coordinates
    });
    window.dispatchEvent(event);

    // After 1.5s scanning check, morph to UPI authorization state
    setTimeout(() => {
      setScanState('upi');
    }, 1500);
  };

  const handleUPIConfirm = () => {
    setScanState('success');
    
    // Trigger the global spring reward particle cascade of gold coins!
    triggerReward();

    // After 3 seconds, reset to idle
    setTimeout(() => {
      setScanState('idle');
      // Reset canvas mode
      const event = new CustomEvent('canvas-mode-update', {
        detail: { mode: 0 }
      });
      window.dispatchEvent(event);
    }, 3200);
  };

  const resetScan = () => {
    setScanState('idle');
    // Reset canvas mode
    const event = new CustomEvent('canvas-mode-update', {
      detail: { mode: 0 }
    });
    window.dispatchEvent(event);
  };

  return (
    <section className="min-h-screen w-full bg-[#1A2E22] text-light-cream pt-28 pb-16 flex items-center justify-center">
      <div className="layout-grid">
        
        {/* Left Column Description */}
        <div className="col-span-4 lg:col-span-6 flex flex-col justify-center gap-6">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-mono uppercase text-mint tracking-wider font-bold">
              TRANSACTION PLATFORM
            </span>
            <h1 className="display-header text-4xl md:text-5xl font-black text-light-cream leading-none">
              BORROW A VESSEL
            </h1>
          </div>

          <p className="interface-text text-sm md:text-base text-white/70 leading-[1.60] max-w-md">
            Scan the laser QR code on the lower base band of any smart cup. A refundable deposit of ₹50 will be locked via UPI and settled instantly upon return.
          </p>

          <div className="space-y-3 font-mono text-xs max-w-sm border-t border-white/10 pt-4">
            <div className="flex justify-between">
              <span className="text-white/40">REFUNDABLE DEPOSIT:</span>
              <span className="text-mint font-bold">₹50.00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/40">VALIDATOR WEBHOOK:</span>
              <span className="text-mint">Secure SHA-256 Verified</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/40">COMPLIANCE CODE:</span>
              <span className="text-mint">WCAG 2.2 AA AA-Targeted</span>
            </div>
          </div>
        </div>

        {/* Right Column App Viewfinder Frame */}
        <div className="col-span-4 lg:col-span-6 flex justify-center items-center">
          
          <div className="relative w-[320px] h-[580px] rounded-[42px] bg-[#0A0D0B] border-[6px] border-[#2C322E] shadow-2xl overflow-hidden flex flex-col justify-between p-4 bg-gradient-to-b from-[#111612] to-[#0D100D]">
            
            {/* Status bar */}
            <div className="flex justify-between items-center text-[10px] font-mono text-white/40 px-2 pt-1">
              <span>16:05</span>
              <div className="w-16 h-4 bg-black rounded-full flex items-center justify-center border border-white/5">
                <div className="w-8 h-1 bg-white/20 rounded-full" />
              </div>
              <span>PWA 5G</span>
            </div>

            {/* Main Interactive Screen */}
            <div className="flex-1 w-full flex flex-col justify-between py-6">
              
              {scanState === 'idle' && (
                <div className="flex-grow flex flex-col items-center justify-center text-center gap-6">
                  <div className="w-40 h-40 rounded-full bg-white/5 border border-white/10 flex items-center justify-center relative shadow-inner">
                    <svg className="w-12 h-12 text-mint" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    </svg>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold text-light-cream">Camera Ready</span>
                    <span className="text-[10px] font-mono text-white/45 uppercase">[ HOLD VESSEL BASE IN VIEW ]</span>
                  </div>
                  <MagneticButton 
                    onClick={startScan}
                    className="w-full py-3.5 bg-mint hover:bg-mint/95 text-deep-ink font-semibold rounded-xl text-xs uppercase tracking-wider font-sans focus-visible:outline-none"
                  >
                    Scan Simulated QR Code
                  </MagneticButton>
                </div>
              )}

              {scanState === 'scanning' && (
                <div className="flex-1 flex flex-col justify-between">
                  {/* Simulated viewfinder area targeting the global WebGL canvas center coordinate */}
                  <div 
                    id="pwa-camera-viewport"
                    className="relative flex-1 w-full bg-black/60 border border-white/10 rounded-2xl flex items-center justify-center overflow-hidden"
                  >
                    {/* Mobile Fallback: Show static cup in scanner */}
                    <div className="md:hidden absolute inset-0 flex items-center justify-center p-8 bg-black/20">
                      <img 
                        src={staticCup} 
                        alt="Takeback smart cup scanning preview" 
                        className="w-full h-full object-contain filter drop-shadow-md"
                      />
                    </div>

                    {/* Pulsing Scan reticle overlay */}
                    <div className="absolute z-20 flex items-center justify-center animate-pulse">
                      <svg className="w-24 h-24 text-mint" viewBox="0 0 100 100">
                        <path d="M 10,25 V 10 H 25" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                        <path d="M 75,10 H 90 V 25" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                        <path d="M 10,75 V 90 H 25" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                        <path d="M 75,90 H 90 V 75" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                      </svg>
                    </div>
                  </div>
                  <div className="text-center font-mono text-[10px] text-mint uppercase tracking-wider mt-4">
                    [ targeting base matrix QR code... ]
                  </div>
                </div>
              )}

              {scanState === 'upi' && (
                <div className="flex-grow flex flex-col justify-between bg-[#121613] p-4 rounded-2xl border border-white/10">
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-mono text-white/50 uppercase">// secure gateway check</span>
                    <h3 className="display-header text-sm font-bold text-light-cream uppercase tracking-wide">
                      UPI Deposit Authorization
                    </h3>
                  </div>

                  <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-3 font-mono text-xs">
                    <div className="flex justify-between">
                      <span className="text-white/40">Vessel ID</span>
                      <span className="text-light-cream">TB-CUP-4921</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/40">Deposit Amount</span>
                      <span className="text-mint font-bold">₹50.00</span>
                    </div>
                    <div className="flex justify-between border-t border-white/10 pt-2">
                      <span className="text-white/40">Destination</span>
                      <span className="text-light-cream">Takeback ESCROW</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <button
                      onClick={handleUPIConfirm}
                      className="w-full py-3 bg-mint hover:bg-mint/90 text-deep-ink font-bold rounded-xl text-xs uppercase tracking-wider font-sans focus-visible:outline-none spring-transition"
                    >
                      Authorize One-Tap UPI
                    </button>
                    <button
                      onClick={resetScan}
                      className="w-full py-2 bg-transparent text-white/50 hover:text-white rounded-xl text-[10px] font-mono uppercase focus-visible:outline-none"
                    >
                      Cancel Scan
                    </button>
                  </div>
                </div>
              )}

              {scanState === 'success' && (
                <div className="flex-grow flex flex-col items-center justify-center text-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-mint/20 border border-mint flex items-center justify-center text-mint font-black text-xl animate-bounce">
                    ✓
                  </div>
                  <h3 className="display-header text-lg font-bold text-light-cream">
                    Borrow Verified
                  </h3>
                  <p className="interface-text text-xs text-white/60 px-4">
                    UPI Escrow locked successfully. You are now inside the loop. Drink responsibly!
                  </p>
                </div>
              )}

            </div>

            {/* Home indicator bar */}
            <div className="w-24 h-1 bg-white/20 mx-auto rounded-full mt-2" />
          </div>

        </div>

      </div>
    </section>
  );
}

export default Borrow;
