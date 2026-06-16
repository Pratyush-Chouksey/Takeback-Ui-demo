import React, { useState, useEffect } from 'react';
import MagneticButton from './MagneticButton';
import productImg from '../assets/product_card_forest.png';

export function CupDetails({ 
  cupId, 
  currentUser, 
  authToken, 
  onLoginClick, 
  triggerReward, 
  setRoute 
}) {
  const [cupData, setCupData] = useState(null);
  const [lastRecord, setLastRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');

  const fetchCupDetails = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const response = await fetch(`/api/cups/${cupId}`);
      const data = await response.json();
      if (response.ok && data.success) {
        setCupData(data.cup);
        setLastRecord(data.lastRecord);
      } else {
        setErrorMsg(data.message || 'Failed to load cup information.');
      }
    } catch (err) {
      console.error('Error fetching cup details:', err);
      setErrorMsg('Failed to establish connection to database server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (cupId) {
      fetchCupDetails();
    }
  }, [cupId, authToken]);

  const handleBorrow = async () => {
    if (!currentUser || !authToken) {
      onLoginClick();
      return;
    }

    setActionLoading(true);
    setActionSuccessMsg('');
    try {
      const response = await fetch('/api/borrow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ cupId })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        triggerReward();
        setActionSuccessMsg('Cup borrowed successfully! The ₹50.00 deposit is pre-authorized in escrow.');
        // Refresh details
        await fetchCupDetails();
      } else {
        alert(data.message || 'Failed to borrow cup.');
      }
    } catch (err) {
      console.error('Borrow error:', err);
      alert('Network error borrowing cup.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReturn = async () => {
    if (!currentUser || !authToken) {
      onLoginClick();
      return;
    }

    setActionLoading(true);
    setActionSuccessMsg('');
    try {
      const response = await fetch('/api/return-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ cupId })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setActionSuccessMsg('Return requested! Please hand the cup to the café counter for admin verification.');
        // Refresh details
        await fetchCupDetails();
      } else {
        alert(data.message || 'Failed to initiate return.');
      }
    } catch (err) {
      console.error('Return error:', err);
      alert('Network error initiating return.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="min-h-screen w-full bg-[#0B0F12] text-light-cream pt-28 pb-16 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-mint border-t-transparent animate-spin" />
          <span className="text-xs font-mono text-mint uppercase tracking-wider">Verifying Smart Cup Registry...</span>
        </div>
      </section>
    );
  }

  if (errorMsg || !cupData) {
    return (
      <section className="min-h-screen w-full bg-[#0B0F12] text-light-cream pt-28 pb-16 flex items-center justify-center">
        <div className="max-w-md w-full mx-5 p-8 rounded-2xl bg-[#121613] border border-red-500/20 text-center flex flex-col items-center gap-6">
          <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 font-bold text-2xl">
            !
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="display-header text-2xl font-bold uppercase text-red-400">Cup ID Not Registered</h2>
            <p className="interface-text text-sm text-white/60">
              {errorMsg || 'The cup ID scanned is not registered in our database system.'}
            </p>
          </div>
          <button 
            onClick={() => setRoute('/')}
            className="px-6 py-2.5 bg-mint hover:bg-mint/90 text-deep-ink font-bold rounded-lg text-xs uppercase tracking-wider cursor-pointer border-none spring-transition"
          >
            Return to Safety
          </button>
        </div>
      </section>
    );
  }

  // Check if current user is borrower
  const isCurrentBorrower = currentUser && lastRecord && 
    (String(lastRecord.userId) === String(currentUser.id)) && 
    (lastRecord.status === 'Borrowed' || lastRecord.status === 'Return Requested');

  const isBorrowed = cupData.status === 'Borrowed';
  const isReturnRequested = cupData.status === 'Return Requested';
  const isAvailable = cupData.status === 'Available';

  return (
    <section className="min-h-screen w-full bg-[#0B0F12] text-light-cream pt-28 pb-16 flex items-center justify-center">
      <div className="max-w-[1000px] mx-auto w-full px-5 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        
        {/* Left Column: Premium Cup Image */}
        <div className="col-span-1 md:col-span-5 flex justify-center">
          <div className="relative group max-w-[320px] w-full rounded-[28px] overflow-hidden bg-[#121613] border border-white/10 p-6 flex flex-col items-center shadow-xl">
            <div className="w-full h-60 flex items-center justify-center relative overflow-hidden rounded-xl bg-[#1e252b]/50">
              <img 
                src={productImg} 
                alt="Takeback Circular Smart Cup" 
                className="max-h-52 object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)] spring-transition group-hover:scale-105"
              />
            </div>
            <div className="w-full flex justify-between items-center mt-6">
              <div className="flex flex-col">
                <span className="text-[10px] font-mono text-white/40">// SERIAL CODE</span>
                <span className="text-lg font-black font-mono text-light-cream uppercase tracking-wide">
                  {cupData.cupId}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono text-white/40">// SPECIFICATION</span>
                <span className="text-xs block font-bold text-mint">12oz Husk Smart Cup</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Status & Checkout Control Pane */}
        <div className="col-span-1 md:col-span-7 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-mono text-mint tracking-[0.2em] uppercase font-bold">
              CIRCULAR LEDGER INTERFACE
            </span>
            <h1 className="display-header text-3xl md:text-4xl font-black text-light-cream leading-none uppercase">
              Cup Borrowing Portal
            </h1>
            <p className="interface-text text-xs text-white/60">
              Unique ID-linked reusable cup system. Track status, borrow, or request verification cashbacks securely.
            </p>
          </div>

          {/* Action Success Message banner */}
          {actionSuccessMsg && (
            <div className="p-4 rounded-xl bg-mint/10 border border-mint/30 text-mint text-xs font-mono flex items-center gap-2">
              <span className="text-sm">✓</span>
              <span>{actionSuccessMsg}</span>
            </div>
          )}

          {/* Status Display Card */}
          <div className="p-6 rounded-2xl bg-[#121613] border border-white/10 flex flex-col gap-5">
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <span className="text-xs font-mono text-white/40 uppercase">Vessel Status:</span>
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${
                  isAvailable ? 'bg-mint animate-pulse' : 
                  isReturnRequested ? 'bg-blue-400' : 'bg-gold-amber'
                }`} />
                <span className="text-sm font-mono font-bold text-light-cream uppercase">
                  {cupData.status}
                </span>
              </div>
            </div>

            {/* Info details context */}
            <div className="text-xs space-y-3 font-mono">
              <div className="flex justify-between">
                <span className="text-white/45">Refundable Escrow Deposit:</span>
                <span className="text-mint font-bold">₹50.00</span>
              </div>
              
              {/* Conditional contexts based on state */}
              {isAvailable && (
                <p className="interface-text text-[11px] text-white/60 leading-relaxed pt-2">
                  This vessel is registered and available. You can borrow it by pre-authorizing a ₹50.00 deposit. The deposit will be locked in escrow and instantly returned to your wallet upon verification at any of our partner cafés.
                </p>
              )}

              {isBorrowed && (
                <div className="pt-2">
                  {isCurrentBorrower ? (
                    <p className="interface-text text-[11px] text-mint leading-relaxed">
                      You hold the active borrow lease for this cup! Scan this QR code when you are ready to return the cup.
                    </p>
                  ) : (
                    <p className="interface-text text-[11px] text-gold-amber leading-relaxed">
                      This cup is currently checked out by another member. It must be returned to the network before it becomes available.
                    </p>
                  )}
                </div>
              )}

              {isReturnRequested && (
                <div className="pt-2">
                  {isCurrentBorrower ? (
                    <p className="interface-text text-[11px] text-blue-400 leading-relaxed font-semibold">
                      Your return request is pending admin verification. Please hand the cup to the café counter cashier to receive your ₹50.00 cashback refund.
                    </p>
                  ) : (
                    <p className="interface-text text-[11px] text-white/50 leading-relaxed">
                      A return request has been submitted for this cup and is awaiting verification by café staff.
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* CTA action buttons */}
            <div className="mt-4 flex flex-col gap-3">
              {isAvailable && (
                <>
                  {currentUser ? (
                    <MagneticButton
                      onClick={handleBorrow}
                      disabled={actionLoading}
                      className="w-full py-3 bg-mint hover:bg-mint/90 text-deep-ink font-bold rounded-xl text-xs uppercase tracking-wider border-none cursor-pointer"
                    >
                      {actionLoading ? 'Pre-authorizing Escrow...' : 'Borrow Cup (Pre-authorize ₹50)'}
                    </MagneticButton>
                  ) : (
                    <MagneticButton
                      onClick={onLoginClick}
                      className="w-full py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs uppercase tracking-wider border border-white/10 cursor-pointer"
                    >
                      Sign In to Borrow Cup
                    </MagneticButton>
                  )}
                </>
              )}

              {isBorrowed && isCurrentBorrower && (
                <MagneticButton
                  onClick={handleReturn}
                  disabled={actionLoading}
                  className="w-full py-3 bg-mint hover:bg-mint/90 text-deep-ink font-bold rounded-xl text-xs uppercase tracking-wider border-none cursor-pointer"
                >
                  {actionLoading ? 'Submitting Return Request...' : 'Return Cup'}
                </MagneticButton>
              )}

              {isBorrowed && !isCurrentBorrower && (
                <button
                  disabled
                  className="w-full py-3 bg-white/5 text-white/20 font-bold rounded-xl text-xs uppercase tracking-wider border border-white/5 cursor-not-allowed"
                >
                  Vessel Occupied
                </button>
              )}

              {isReturnRequested && (
                <button
                  disabled
                  className="w-full py-3 bg-blue-500/10 text-blue-400 font-bold rounded-xl text-xs uppercase tracking-wider border border-blue-500/20 cursor-not-allowed"
                >
                  Pending Admin Verification
                </button>
              )}
            </div>
          </div>

          {/* Simple back navigation */}
          <button 
            onClick={() => setRoute('/')}
            className="text-[10px] font-mono text-white/40 hover:text-white self-start bg-transparent border-none cursor-pointer"
          >
            [ ← RETURN TO THE LOOP ]
          </button>
        </div>

      </div>
    </section>
  );
}

export default CupDetails;
