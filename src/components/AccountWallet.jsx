import React, { useState, useEffect } from 'react';
import MagneticButton from './MagneticButton';

export function AccountWallet({ triggerReward, authToken, currentUser, onLoginClick }) {
  const [walletBalance, setWalletBalance] = useState(0);
  const [upiAddress, setUpiAddress] = useState('');
  const [withdrawState, setWithdrawState] = useState('idle'); // idle, processing, success
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({
    totalBorrows: 0,
    returnRate: '100%',
    carbonScore: '0 kg'
  });
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    if (!authToken) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/user/dashboard', {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setWalletBalance(data.walletBalance || 0);
        
        // Map history to transactions layout
        const history = data.borrowHistory || [];
        const txs = history.map(item => {
          const isReturned = item.status === 'Returned';
          const statusLabel = 
            item.status === 'Returned' ? 'Refunded' : 
            item.status === 'Return Requested' ? 'Pending Audit' : 'In Escrow';

          return {
            id: item._id ? `TX-${item._id.substring(item._id.length - 6).toUpperCase()}` : `TX-${item.cupId}`,
            cafe: `Smart Cup ${item.cupId}`,
            time: new Date(item.borrowedAt).toLocaleDateString() + ', ' + new Date(item.borrowedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            deposit: '₹50.00',
            status: statusLabel,
            isReturned
          };
        });
        setTransactions(txs);

        // Calculate metrics
        const total = history.length;
        const returned = history.filter(h => h.status === 'Returned').length;
        const rate = total > 0 ? ((returned / total) * 100).toFixed(1) + '%' : '100%';
        const carbon = (returned * 0.58).toFixed(2) + ' kg';

        setStats({
          totalBorrows: total,
          returnRate: rate,
          carbonScore: carbon
        });
      }
    } catch (err) {
      console.error('Error loading user dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [authToken]);

  const handleWithdraw = (e) => {
    e.preventDefault();
    if (!upiAddress.includes('@')) {
      alert("Please enter a valid UPI ID (e.g., username@upi)");
      return;
    }
    setWithdrawState('processing');

    setTimeout(() => {
      setWithdrawState('success');
      setWalletBalance(0);
      triggerReward(); // Trigger gold coins particle cascade!
      
      // Auto-reset back to idle after 4.2 seconds
      setTimeout(() => {
        setWithdrawState('idle');
      }, 4200);

    }, 1500);
  };

  if (!authToken) {
    return (
      <section className="min-h-screen w-full bg-[#0B0F12] text-light-cream pt-28 pb-16 flex items-center justify-center">
        <div className="max-w-md w-full mx-5 p-8 rounded-2xl bg-[#121613] border border-white/10 text-center flex flex-col items-center gap-6">
          <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-mint text-2xl">
            💳
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="display-header text-2xl font-bold uppercase text-light-cream">Member Wallet</h2>
            <p className="interface-text text-sm text-white/60">
              Sign in to view your circular rewards wallet, active borrows, and request cashback withdrawals.
            </p>
          </div>
          <button 
            onClick={onLoginClick}
            className="px-6 py-2.5 bg-mint hover:bg-mint/90 text-deep-ink font-bold rounded-lg text-xs uppercase tracking-wider cursor-pointer border-none spring-transition"
          >
            Sign In / Register
          </button>
        </div>
      </section>
    );
  }

  if (loading) {
    return (
      <section className="min-h-screen w-full bg-[#0B0F12] text-light-cream pt-28 pb-16 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-mint border-t-transparent animate-spin" />
          <span className="text-xs font-mono text-mint uppercase tracking-wider">Loading Wallet Ledger...</span>
        </div>
      </section>
    );
  }

  return (
    <section 
      id="account-wallet-section"
      className="min-h-screen w-full bg-[#0B0F12] text-light-cream pt-28 pb-16 flex items-center justify-center"
    >
      <div className="max-w-[1440px] mx-auto w-full px-5 lg:px-20 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        
        {/* Left 6 Columns: User Milestone Profile & Returns Timeline Log */}
        <div className="col-span-1 lg:col-span-7 flex flex-col gap-8">
          
          <div className="flex flex-col gap-2">
            <span className="text-xs font-mono tracking-[0.2em] text-mint uppercase font-bold">
              USER ACCOUNT CORE
            </span>
            <h1 className="display-header text-4xl md:text-5xl font-black text-light-cream leading-none uppercase">
              LOOP MEMBER WALLET
            </h1>
            <p className="interface-text text-sm text-white/65 mt-2">
              Track your circular lifecycle coordinates, active borrowing logs, and accumulated cashback settlements.
            </p>
          </div>

          {/* User milestone stats grid */}
          <div className="grid grid-cols-3 gap-4">
            
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col">
              <span className="text-[9px] font-mono text-white/40 uppercase">Total Borrows</span>
              <span className="text-xl md:text-2xl font-black font-mono text-mint mt-1 font-mono technical-figures">{stats.totalBorrows}</span>
              <span className="text-[8px] font-mono text-white/30 uppercase mt-0.5">Vessels Released</span>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col">
              <span className="text-[9px] font-mono text-white/40 uppercase">Return Rate</span>
              <span className="text-xl md:text-2xl font-black font-mono text-mint mt-1 font-mono technical-figures">{stats.returnRate}</span>
              <span className="text-[8px] font-mono text-white/30 uppercase mt-0.5">Escrow settlements</span>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col">
              <span className="text-[9px] font-mono text-white/40 uppercase">Carbon Score</span>
              <span className="text-xl md:text-2xl font-black font-mono text-[#F5B973] mt-1 font-mono technical-figures">{stats.carbonScore}</span>
              <span className="text-[8px] font-mono text-white/30 uppercase mt-0.5">CO2 Diverted</span>
            </div>

          </div>

          {/* Return timeline log list */}
          <div className="flex flex-col gap-4 text-left">
            <span className="text-[10px] font-mono text-white/45 uppercase tracking-wider font-bold">
              // ACTIVE RETURN TIMELINE LOG
            </span>

            {transactions.length === 0 ? (
              <div className="p-6 rounded-xl bg-white/5 border border-white/5 text-center text-white/40 interface-text text-xs">
                No borrowing history or active escrows found on this account.
              </div>
            ) : (
              <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-2">
                {transactions.map((tx) => (
                  <div 
                    key={tx.id} 
                    className="p-4 rounded-xl bg-[#1E252B] border border-white/5 flex items-center justify-between transition-colors duration-300 hover:bg-white/5"
                  >
                    <div className="flex items-center gap-3">
                      {/* Circle status indicator */}
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                        tx.isReturned 
                          ? 'bg-mint/10 border border-mint/35 text-mint' 
                          : 'bg-gold-amber/10 border border-gold-amber/35 text-gold-amber animate-pulse'
                      }`}>
                        {tx.isReturned ? '✓' : '●'}
                      </div>
                      
                      <div className="flex flex-col">
                        <span className="text-xs font-mono text-white/40">{tx.id} • {tx.time}</span>
                        <h3 className="display-header text-sm font-bold text-light-cream mt-0.5">{tx.cafe}</h3>
                      </div>
                    </div>

                    <div className="text-right flex flex-col items-end">
                      <span className="text-xs font-mono text-light-cream font-semibold">{tx.deposit}</span>
                      <span className={`text-[9px] font-mono font-bold uppercase ${
                        tx.isReturned ? 'text-mint' : 'text-gold-amber'
                      }`}>{tx.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right 5 Columns: Withdraw drawer interface */}
        <div className="col-span-1 lg:col-span-5 flex flex-col gap-6 text-left">
          
          <div className="flex flex-col gap-1">
            <span className="text-xs font-mono uppercase text-gold-amber tracking-wider font-semibold">
              ACCUMULATED REWARDS
            </span>
            <h2 className="display-header text-2xl font-bold text-light-cream uppercase">
              CASHBACK WITHDRAWAL
            </h2>
          </div>

          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 shadow-xl flex flex-col gap-6">
            
            {/* Wallet Cash Balance Display */}
            <div className="flex justify-between items-center bg-[#1E252B] p-5 rounded-xl border border-white/5">
              <div className="flex flex-col">
                <span className="text-[10px] font-mono text-white/45 uppercase tracking-wide">AVALIABLE FOR PAYOUT:</span>
                <span className="text-3xl font-black font-mono text-[#F5B973] mt-1 font-mono">
                  ₹{walletBalance.toFixed(2)}
                </span>
              </div>
              <span className="text-[9px] font-mono px-2 py-0.5 border border-white/15 text-white/50 rounded uppercase">
                UPI Escrow
              </span>
            </div>

            {withdrawState === 'idle' && (
              <form onSubmit={handleWithdraw} className="flex flex-col gap-4">
                
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="wallet-upi-input" className="text-[10px] font-mono text-white/40 uppercase">
                    UPI ADDRESS (VPA):
                  </label>
                  <input 
                    id="wallet-upi-input"
                    type="text" 
                    required 
                    value={upiAddress} 
                    onChange={(e) => setUpiAddress(e.target.value)}
                    placeholder="username@upi"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-xs text-light-cream placeholder:text-white/20 focus:ring-1 focus:ring-mint focus:outline-none transition-all"
                  />
                </div>

                <p className="interface-text text-[10px] text-white/50 leading-relaxed">
                  Payouts settle instantly back to your bank account using unified payment interfaces. Single limits apply up to ₹5,000 daily.
                </p>

                <MagneticButton 
                  type="submit"
                  disabled={walletBalance <= 0}
                  className={`w-full py-3.5 rounded-lg text-xs font-bold uppercase tracking-wider font-sans focus-visible:outline-none spring-transition ${
                    walletBalance <= 0 
                      ? 'bg-white/5 text-white/30 cursor-not-allowed border border-white/5' 
                      : 'bg-mint hover:bg-mint/90 text-deep-ink'
                  }`}
                >
                  Withdraw Cashback
                </MagneticButton>

              </form>
            )}

            {withdrawState === 'processing' && (
              <div className="flex flex-col items-center justify-center py-12 gap-3.5">
                <div className="w-9 h-9 rounded-full border-2 border-mint border-t-transparent animate-spin" />
                <span className="text-xs font-mono text-mint uppercase tracking-wider">Resolving escrow payload...</span>
              </div>
            )}

            {withdrawState === 'success' && (
              <div className="flex flex-col items-center text-center gap-4 py-8">
                <div className="w-14 h-14 rounded-full bg-mint/20 border border-mint flex items-center justify-center text-mint font-black text-xl animate-bounce">
                  ✓
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="display-header text-base font-bold text-light-cream uppercase">Withdrawal Initiated</h3>
                  <span className="text-xl font-mono text-[#F5B973] font-black">+ ₹{walletBalance.toFixed(2)}</span>
                  <p className="interface-text text-[10px] text-white/50 px-2 leading-relaxed mt-1">
                    UPI Instant Settlement complete. Please check your banking notification log.
                  </p>
                </div>
              </div>
            )}

            <div className="text-[9px] font-mono text-white/35 border-t border-white/5 pt-3 flex justify-between">
              <span>LEDGER COMPLIANCE KEY</span>
              <span>UPI BANK GATEWAY</span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

export default AccountWallet;
