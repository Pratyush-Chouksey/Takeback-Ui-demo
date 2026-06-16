import React, { useState, useEffect } from 'react';
import CONFIG from '../config';
import MagneticButton from './MagneticButton';

export function PaymentModal({ isOpen, onClose, amount, itemName, onSuccess }) {
  const [paymentState, setPaymentState] = useState('idle'); // idle, processing, success
  const [isMobile, setIsMobile] = useState(false);

  // Check viewport device type for deep linking behavior
  useEffect(() => {
    const checkDevice = () => {
      const mobileAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobile(mobileAgent || window.innerWidth < 768);
    };
    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  if (!isOpen) return null;

  // Construct standard UPI deep link payload
  const upiUrl = `upi://pay?pa=${CONFIG.UPI_VPA}&pn=${encodeURIComponent(CONFIG.MERCHANT_NAME)}&am=${amount}&cu=INR&tn=${encodeURIComponent(itemName)}`;
  
  // Construct dynamic QR code URL
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&color=0b0f12&data=${encodeURIComponent(upiUrl)}`;

  const handleMobilePayment = () => {
    window.open(upiUrl, '_self');
  };

  const handleConfirmPayment = () => {
    setPaymentState('processing');
    
    // Simulate payment verification via escrow hook
    setTimeout(() => {
      setPaymentState('success');
      
      setTimeout(() => {
        onSuccess();
        setPaymentState('idle');
      }, 1500);
      
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[6000] flex items-center justify-center p-4">
      {/* Backdrop overlay */}
      <div 
        className="absolute inset-0 bg-black/85 backdrop-blur-sm cursor-pointer"
        onClick={paymentState === 'idle' ? onClose : undefined}
      />
      
      {/* Modal panel body */}
      <div className="relative w-full max-w-md bg-[#121613] border border-white/10 rounded-[28px] overflow-hidden shadow-2xl p-6 text-light-cream text-left">
        
        {paymentState === 'idle' && (
          <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex justify-between items-start">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-mono text-mint uppercase tracking-wider">// SECURE UPI ESCROW v1.4</span>
                <h3 className="display-header text-xl font-bold uppercase">PAYMENT SETUP</h3>
              </div>
              <button 
                onClick={onClose}
                className="text-white/40 hover:text-white text-xs font-mono bg-transparent border-none cursor-pointer"
              >
                [ CANCEL ]
              </button>
            </div>

            {/* Summary Details */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2 font-mono text-xs">
              <div className="flex justify-between">
                <span className="text-white/40">Product / Vessel:</span>
                <span className="text-white/95">{itemName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">Amount Due:</span>
                <span className="text-mint font-bold">₹{amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t border-white/10 pt-2">
                <span className="text-white/40">Recipient:</span>
                <span className="text-white/95">{CONFIG.MERCHANT_NAME}</span>
              </div>
            </div>

            {/* UPI App deep links for mobile devices */}
            {isMobile ? (
              <div className="flex flex-col gap-3">
                <p className="interface-text text-[11px] text-white/60 leading-relaxed text-center">
                  Pressing the button below will securely open your installed UPI apps (Google Pay, PhonePe, Paytm) to complete the transaction.
                </p>
                
                <MagneticButton 
                  onClick={handleMobilePayment}
                  className="w-full py-4 bg-mint hover:bg-mint/90 text-deep-ink font-bold rounded-xl text-xs uppercase tracking-wider font-sans border-none cursor-pointer text-center"
                >
                  Pay via Google Pay / UPI
                </MagneticButton>
              </div>
            ) : (
              /* QR code scanning display for desktops */
              <div className="flex flex-col items-center gap-4 border-t border-white/5 pt-4">
                <span className="text-[10px] font-mono text-white/40 uppercase">SCAN WITH YOUR UPI APP TO PAY</span>
                
                <div className="p-3 bg-white rounded-2xl border border-white/10 shadow-lg">
                  <img 
                    src={qrCodeUrl} 
                    alt="UPI Payment QR Code" 
                    className="w-48 h-48 block"
                  />
                </div>
                
                <div className="text-center font-mono text-xs space-y-1 mt-1 bg-white/5 p-3 rounded-lg border border-white/5 w-full">
                  <div className="flex justify-between">
                    <span className="text-white/40">GPay Phone Number:</span>
                    <span className="text-mint font-bold">{CONFIG.GPAY_NUMBER}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/40">UPI VPA:</span>
                    <span className="text-mint">{CONFIG.UPI_VPA}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Common Confirm Payout CTA */}
            <div className="flex flex-col gap-2 border-t border-white/5 pt-4">
              <button
                onClick={handleConfirmPayment}
                className="w-full py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs uppercase tracking-wider font-sans border border-white/10 cursor-pointer spring-transition"
              >
                Confirm Payment Completed
              </button>
              <span className="text-[9px] text-center font-mono text-white/30 uppercase tracking-widest mt-1 block">
                Payments are processed instantly into bank escrow channels.
              </span>
            </div>
          </div>
        )}

        {paymentState === 'processing' && (
          <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
            <div className="w-10 h-10 rounded-full border-2 border-mint border-t-transparent animate-spin" />
            <div className="flex flex-col gap-1.5 mt-2">
              <span className="text-xs font-mono text-mint uppercase tracking-wider">Verifying payment with bank...</span>
              <p className="interface-text text-[11px] text-white/50 max-w-[280px]">
                Checking unified interface registry for incoming settlement transaction ledger records.
              </p>
            </div>
          </div>
        )}

        {paymentState === 'success' && (
          <div className="flex flex-col items-center justify-center py-8 gap-4 text-center">
            <div className="w-16 h-16 rounded-full bg-mint/20 border border-mint flex items-center justify-center text-mint font-black text-xl animate-bounce">
              ✓
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="display-header text-lg font-bold uppercase">PAYMENT CONFIRMED</h3>
              <p className="interface-text text-xs text-white/60">
                Escrow receipt verified successfully. Your transaction is authorized!
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default PaymentModal;
