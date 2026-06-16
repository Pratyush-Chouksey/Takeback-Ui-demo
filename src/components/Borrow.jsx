import React, { useState, useEffect } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import staticCup from '../assets/product_lifestyle.png';
import MagneticButton from './MagneticButton';
import PaymentModal from './PaymentModal';

export function Borrow({ triggerReward, setRoute }) {
  const [scanState, setScanState] = useState('idle'); // idle, loading, scanning, error, upi, success
  const [errorMessage, setErrorMessage] = useState('');
  const [scannedResult, setScannedResult] = useState('');
  const [scannerInstance, setScannerInstance] = useState(null);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  const startScan = () => {
    setScanState('loading');
    setErrorMessage('');
    
    // Dispatch events targeting WebGL canvas
    const event = new CustomEvent('canvas-mode-update', {
      detail: { mode: 2 } // Set interact to 2: Scan targeting focus coordinates
    });
    window.dispatchEvent(event);
  };

  useEffect(() => {
    let qrcodeScanner = null;

    if (scanState === 'loading') {
      // Create Html5Qrcode instance
      const containerId = "qr-reader-container";
      
      // Make sure the container element exists in DOM before creating instance
      const timer = setTimeout(() => {
        try {
          qrcodeScanner = new Html5Qrcode(containerId);
          setScannerInstance(qrcodeScanner);
          
          qrcodeScanner.start(
            { facingMode: "environment" },
            {
              fps: 15,
              qrbox: (width, height) => {
                const size = Math.min(width, height) * 0.65;
                return { width: size, height: size };
              }
            },
            (decodedText) => {
              // Successfully decoded QR code!
              qrcodeScanner.stop().then(() => {
                // If it is a Takeback cup URL or ID, route directly
                let cupPath = '';
                if (decodedText.includes('/cup/')) {
                  const parts = decodedText.split('/cup/');
                  cupPath = `/cup/${parts[parts.length - 1]}`;
                } else if (decodedText.startsWith('CUP-')) {
                  cupPath = `/cup/${decodedText}`;
                }

                if (cupPath && setRoute) {
                  setRoute(cupPath);
                  
                  // Reset canvas mode
                  const canvasEvent = new CustomEvent('canvas-mode-update', {
                    detail: { mode: 0 }
                  });
                  window.dispatchEvent(canvasEvent);
                } else {
                  setScannedResult(decodedText);
                  setScanState('upi');
                }
              }).catch(err => {
                console.error("Failed to stop scanner on success:", err);
                setScannedResult(decodedText);
                setScanState('upi');
              });
            },
            () => {
              // Ignore scanning errors (no QR code detected in current frame)
            }
          ).then(() => {
            setScanState('scanning');
          }).catch(err => {
            console.error("Error starting scanner:", err);
            let userMsg = "Camera access denied. Please grant permissions in your browser.";
            if (err.name === "NotAllowedError" || err === "NotAllowedError") {
              userMsg = "Camera permission denied. Please allow camera access in settings.";
            } else if (err.name === "NotFoundError" || err === "NotFoundError") {
              userMsg = "No camera found on this device.";
            }
            setErrorMessage(userMsg);
            setScanState('error');
          });
        } catch (e) {
          console.error("Failed to initialize scanner:", e);
          setErrorMessage("Failed to access camera interface.");
          setScanState('error');
        }
      }, 100);

      return () => {
        clearTimeout(timer);
      };
    }

    return () => {
      if (qrcodeScanner && qrcodeScanner.isScanning) {
        qrcodeScanner.stop().catch(err => console.error("Error stopping scanner on cleanup:", err));
      }
    };
  }, [scanState]);

  const stopScannerActive = async () => {
    if (scannerInstance && scannerInstance.isScanning) {
      try {
        await scannerInstance.stop();
      } catch (err) {
        console.error("Failed to stop scanner:", err);
      }
    }
  };

  const handleUPIConfirm = () => {
    setScanState('success');
    
    // Trigger global gold coins cascade!
    triggerReward();

    // Reset back to idle after 3.2s
    setTimeout(() => {
      setScanState('idle');
      setScannedResult('');
      
      // Reset WebGL canvas mode
      const event = new CustomEvent('canvas-mode-update', {
        detail: { mode: 0 }
      });
      window.dispatchEvent(event);
    }, 3200);
  };

  const resetScan = async () => {
    await stopScannerActive();
    setScanState('idle');
    setScannedResult('');
    setErrorMessage('');
    
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
            Scan the qr code on the lower base band of any smart cup. A refundable deposit of ₹50.00 will be locked and settled instantly upon return.
          </p>

          {/* Borrow/Return 4-step isometric flow illustration stub: assets/isometric_flow.png */}
          {/* 4-Step Borrow/Return Process List */}
          <div className="flex flex-col gap-3.5 my-6 border-t border-b border-white/10 py-5 max-w-md">
            <div className="flex gap-3 text-xs leading-relaxed">
              <span className="font-mono text-mint font-bold">01 /</span> Find Cafe 1 or Cafe 2 on our live map to grab a fresh circular beverage vessel.
            </div>
            <div className="flex gap-3 text-xs leading-relaxed">
              <span className="font-mono text-mint font-bold">02 /</span> Scan the debossed base qr code using our web app to link the cup to your account.
            </div>
            <div className="flex gap-3 text-xs leading-relaxed">
              <span className="font-mono text-mint font-bold">03 /</span> Enjoy your warm or cold drink in a fluted, non-toxic husk composite cup with zero plastic lining.
            </div>
            <div className="flex gap-3 text-xs leading-relaxed">
              <span className="font-mono text-mint font-bold">04 /</span> Drop your empty cup at any partnered café return counter across the network to refund your deposit.
            </div>
          </div>

          <div className="space-y-3 font-mono text-xs max-w-sm">
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
                    Start Scanner
                  </MagneticButton>
                </div>
              )}

              {(scanState === 'loading' || scanState === 'scanning') && (
                <div className="flex-grow flex flex-col justify-between">
                  <div 
                    id="pwa-camera-viewport"
                    className="relative flex-1 w-full bg-black border border-white/10 rounded-2xl overflow-hidden"
                  >
                    {/* Mounting element for html5-qrcode video */}
                    <div 
                      id="qr-reader-container" 
                      className="w-full h-full [&>video]:object-cover [&>video]:w-full [&>video]:h-full"
                    />

                    {scanState === 'loading' && (
                      <div className="absolute inset-0 bg-[#0B0F12] flex flex-col items-center justify-center text-center gap-4 z-30">
                        <div className="w-10 h-10 rounded-full border-2 border-mint border-t-transparent animate-spin" />
                        <span className="text-[10px] font-mono text-mint uppercase tracking-wider">Initializing Camera...</span>
                      </div>
                    )}

                    {/* Scan reticle overlay */}
                    {scanState === 'scanning' && (
                      <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center animate-pulse">
                        <svg className="w-24 h-24 text-mint" viewBox="0 0 100 100">
                          <path d="M 10,25 V 10 H 25" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                          <path d="M 75,10 H 90 V 25" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                          <path d="M 10,75 V 90 H 25" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                          <path d="M 75,90 H 90 V 75" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                        </svg>
                      </div>
                    )}

                    <div className="absolute bottom-2 left-0 right-0 text-center text-[9px] font-mono text-white/50 bg-black/40 py-1 uppercase pointer-events-none z-20">
                      Align QR code inside frame
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 mt-3">
                    <button
                      onClick={resetScan}
                      className="w-full py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl text-[10px] font-mono uppercase border border-white/10 cursor-pointer"
                    >
                      Cancel Scan
                    </button>
                  </div>
                </div>
              )}

              {scanState === 'error' && (
                <div className="flex-grow flex flex-col items-center justify-center text-center gap-4 p-4">
                  <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 font-bold text-lg">
                    !
                  </div>
                  <span className="text-xs font-bold text-white">Camera Access Error</span>
                  <p className="interface-text text-[10px] text-white/50 leading-relaxed">
                    {errorMessage}
                  </p>
                  <div className="flex flex-col gap-2 w-full mt-2">
                    <button 
                      onClick={startScan}
                      className="w-full py-2.5 bg-mint hover:bg-mint/90 text-deep-ink font-semibold rounded-lg text-xs uppercase cursor-pointer border-none"
                    >
                      Retry Camera
                    </button>
                    <button 
                      onClick={resetScan}
                      className="w-full py-1.5 text-white/40 hover:text-white text-[10px] font-mono uppercase bg-transparent border-none cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {scanState === 'upi' && (
                <div className="flex-grow flex flex-col justify-between bg-[#121613] p-4 rounded-2xl border border-white/10">
                  <div className="flex flex-col gap-2 text-left">
                    <span className="text-[10px] font-mono text-white/50 uppercase">// secure gateway check</span>
                    <h3 className="display-header text-sm font-bold text-light-cream uppercase tracking-wide">
                      Loop Deposit Authorization
                    </h3>
                  </div>

                  <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-3 font-mono text-xs text-left">
                    <div className="flex justify-between">
                      <span className="text-white/40">Vessel ID</span>
                      <span className="text-light-cream">{scannedResult ? scannedResult.substring(0, 15) : 'TB-CUP-4921'}</span>
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
                      onClick={() => setIsPaymentOpen(true)}
                      className="w-full py-3.5 bg-mint hover:bg-mint/90 text-deep-ink font-bold rounded-xl text-xs uppercase tracking-wider font-sans focus-visible:outline-none spring-transition border-none cursor-pointer"
                    >
                      Pay via Google Pay / UPI
                    </button>
                    <button
                      onClick={resetScan}
                      className="w-full py-2 bg-transparent text-white/50 hover:text-white rounded-xl text-[10px] font-mono uppercase focus-visible:outline-none cursor-pointer"
                    >
                      Cancel
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
                    Deposit pre-authorized successfully. You are now inside the loop. Drink responsibly!
                  </p>
                </div>
              )}

            </div>

            {/* Home indicator bar */}
            <div className="w-24 h-1 bg-white/20 mx-auto rounded-full mt-2" />
          </div>

        </div>

      </div>

      <PaymentModal 
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        amount={50}
        itemName={`Takeback Vessel Deposit (${scannedResult ? scannedResult.substring(0, 10) : 'TB-CUP-4921'})`}
        onSuccess={() => {
          setIsPaymentOpen(false);
          handleUPIConfirm();
        }}
      />
    </section>
  );
}

export default Borrow;
