import React, { useState, useEffect } from 'react';
import MagneticButton from './MagneticButton';

export function ImpactHUD() {
  // 1. Initial State configurations
  const [cups, setCups] = useState(1482910);
  const [co2, setCo2] = useState(41392.4);
  const [cashback, setCashback] = useState(2224360); // Represesenting currency in cents/paise format to enable formatting target ₹22,243.60

  // Tracking notifications
  const [notifications, setNotifications] = useState({
    cups: '▲ +2 cups diverted',
    co2: '▲ +0.22 kg CO2',
    cashback: '▲ +₹30.00 returned'
  });

  // 2. Interactive Calculator selections
  const [weeklyCount, setWeeklyCount] = useState(5);

  // 3. Ambient database incrementer loop (runs every 3.5 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      // Random increments (1 to 3 cups)
      const addedCups = Math.floor(Math.random() * 3) + 1;
      const addedCo2 = parseFloat((addedCups * 0.11).toFixed(2));
      const addedCashback = addedCups * 15 * 100; // in paise

      setCups((prev) => prev + addedCups);
      setCo2((prev) => parseFloat((prev + addedCo2).toFixed(2)));
      setCashback((prev) => prev + addedCashback);

      setNotifications({
        cups: `▲ +${addedCups} cups diverted`,
        co2: `▲ +${addedCo2.toFixed(2)} kg CO2`,
        cashback: `▲ +₹${(addedCups * 15).toFixed(2)} returned`
      });
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  // Formatting helpers
  const formatCups = (val) => val.toLocaleString('en-US');
  const formatCo2 = (val) => val.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  
  // Mappings target: "₹22,243,60" format
  const formatCashback = (val) => {
    const base = Math.floor(val / 100); // 22243
    const cents = val % 100; // 60
    return `₹${base.toLocaleString('en-US')},${cents.toString().padStart(2, '0')}`;
  };

  // Calculator projections (annual benchmarks)
  const projectedCups = weeklyCount * 52;
  const projectedCo2 = parseFloat((projectedCups * 0.11).toFixed(1));
  const projectedCashback = projectedCups * 15;

  return (
    <section 
      id="impact-hud-section"
      className="min-h-screen w-full bg-[#0B0F12] text-light-cream pt-28 pb-16 flex flex-col justify-center"
    >
      {/* Snappy hardware-accelerated text animation keyframes */}
      <style>{`
        @keyframes slideUpDigit {
          0% { transform: translateY(12px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes springScaleCalc {
          0% { transform: scale(0.93); opacity: 0.8; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>

      <div className="max-w-[1440px] mx-auto w-full px-5 lg:px-20 flex flex-col gap-12 md:gap-16">
        
        {/* Editorial Heading */}
        <div className="flex flex-col gap-2 max-w-xl">
          <span className="text-xs font-mono tracking-[0.2em] text-mint uppercase font-semibold">
            LIVE SYSTEM IMPACT CORE
          </span>
          <h1 className="display-header text-4xl md:text-5xl font-black text-light-cream leading-none uppercase">
            THE SYSTEM FOOTPRINT
          </h1>
          <p className="interface-text text-sm md:text-base text-white/65 mt-2">
            Observe live system growth. Diverted volume, carbon reductions, and returned cashbacks are updated dynamically via active drop points.
          </p>
        </div>

        {/* Top Segment: 3-column data metric counter matrix */}
        <div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"
          aria-live="polite"
        >
          {/* Metric Cell 1 */}
          <div className="p-6 md:p-8 rounded-2xl bg-[#1E252B] border border-white/5 flex flex-col gap-3 relative overflow-hidden">
            <span className="text-[10px] font-mono text-white/45 uppercase tracking-wider font-semibold">
              SINGLE-USE CUPS DIVERTED
            </span>
            <div className="h-12 overflow-hidden flex items-center">
              <span 
                key={cups}
                className="text-3xl md:text-4xl font-black font-mono text-light-cream tracking-tight inline-block"
                style={{ animation: 'slideUpDigit 0.35s cubic-bezier(0.1, 0.8, 0.3, 1) forwards' }}
              >
                {formatCups(cups)}
              </span>
            </div>
            {/* Live green increment notification label */}
            <span className="text-[10px] font-mono text-mint font-bold flex items-center gap-1 select-none">
              {notifications.cups} <span className="text-white/20">• 3.5s refresh</span>
            </span>
          </div>

          {/* Metric Cell 2 */}
          <div className="p-6 md:p-8 rounded-2xl bg-[#1E252B] border border-white/5 flex flex-col gap-3 relative overflow-hidden">
            <span className="text-[10px] font-mono text-white/45 uppercase tracking-wider font-semibold">
              CO2 KG REDUCTION
            </span>
            <div className="h-12 overflow-hidden flex items-center">
              <span 
                key={co2}
                className="text-3xl md:text-4xl font-black font-mono text-light-cream tracking-tight inline-block"
                style={{ animation: 'slideUpDigit 0.35s cubic-bezier(0.1, 0.8, 0.3, 1) forwards' }}
              >
                {formatCo2(co2)}
              </span>
            </div>
            <span className="text-[10px] font-mono text-mint font-bold flex items-center gap-1 select-none">
              {notifications.co2} <span className="text-white/20">• 3.5s refresh</span>
            </span>
          </div>

          {/* Metric Cell 3 */}
          <div className="p-6 md:p-8 rounded-2xl bg-[#1E252B] border border-white/5 flex flex-col gap-3 relative overflow-hidden">
            <span className="text-[10px] font-mono text-white/45 uppercase tracking-wider font-semibold">
              TOTAL UPI CASHBACK DISTRIBUTED
            </span>
            <div className="h-12 overflow-hidden flex items-center">
              <span 
                key={cashback}
                className="text-3xl md:text-4xl font-black font-mono text-[#F5B973] tracking-tight inline-block"
                style={{ animation: 'slideUpDigit 0.35s cubic-bezier(0.1, 0.8, 0.3, 1) forwards' }}
              >
                {formatCashback(cashback)}
              </span>
            </div>
            <span className="text-[10px] font-mono text-mint font-bold flex items-center gap-1 select-none">
              {notifications.cashback} <span className="text-white/20">• 3.5s refresh</span>
            </span>
          </div>
        </div>

        {/* Bottom Segment: Interactive impact calculator tool module */}
        <div className="p-6 md:p-10 rounded-2xl bg-white/5 border border-white/10 flex flex-col gap-8">
          <div className="flex flex-col gap-1 border-b border-white/10 pb-4">
            <span className="text-[10px] font-mono text-gold-amber tracking-wider font-semibold uppercase">
              INTERACTIVE TOOL MATRIX
            </span>
            <h3 className="display-header text-xl md:text-2xl font-bold text-light-cream">
              Calculate Your Personal Offset
            </h3>
          </div>

          {/* Selector + Output Row */}
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 lg:items-center">
            
            {/* Input adjustment selection dropdown */}
            <div className="flex flex-col gap-3">
              <label 
                htmlFor="coffee-dropdown-hud"
                className="text-xs font-mono text-white/50 uppercase"
              >
                Weekly Coffee/Tea consumption:
              </label>
              
              <div className="relative w-48">
                <select
                  id="coffee-dropdown-hud"
                  value={weeklyCount}
                  onChange={(e) => setWeeklyCount(parseInt(e.target.value))}
                  className="w-full bg-[#1E252B] border border-white/15 px-4 py-3 rounded-lg text-sm text-light-cream font-mono focus-visible:outline-none focus:border-mint transition-colors appearance-none cursor-pointer"
                >
                  {Array.from({ length: 20 }, (_, i) => i + 1).map((val) => (
                    <option key={val} value={val} className="bg-[#1E252B] text-light-cream">
                      {val} cup{val > 1 ? 's' : ''} / week
                    </option>
                  ))}
                </select>
                {/* Arrow vector custom element */}
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-white/40">
                  ▼
                </div>
              </div>
            </div>

            {/* Output boxes Row grid */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Output Diverted */}
              <div 
                key={`calc-cups-${projectedCups}`}
                className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col gap-1"
                style={{ animation: 'springScaleCalc 0.5s cubic-bezier(0.1, 0.8, 0.3, 1) forwards' }}
              >
                <span className="text-[9px] font-mono text-white/40 uppercase">ANNUAL CUPS DIVERTED</span>
                <span className="text-xl font-black font-mono text-mint technical-figures">
                  {projectedCups} cups
                </span>
              </div>

              {/* Output CO2 */}
              <div 
                key={`calc-co2-${projectedCo2}`}
                className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col gap-1"
                style={{ animation: 'springScaleCalc 0.5s cubic-bezier(0.1, 0.8, 0.3, 1) forwards' }}
              >
                <span className="text-[9px] font-mono text-white/40 uppercase">ANNUAL CARBON SAVINGS</span>
                <span className="text-xl font-black font-mono text-mint technical-figures">
                  {projectedCo2} kg CO2
                </span>
              </div>

              {/* Output Cashback */}
              <div 
                key={`calc-cash-${projectedCashback}`}
                className="p-4 rounded-xl bg-white/5 border border-[#F5B973]/20 flex flex-col gap-1"
                style={{ animation: 'springScaleCalc 0.5s cubic-bezier(0.1, 0.8, 0.3, 1) forwards' }}
              >
                <span className="text-[9px] font-mono text-white/40 uppercase">ANNUAL CASHBACK REFUND</span>
                <span className="text-xl font-black font-mono text-gold-amber technical-figures">
                  ₹{projectedCashback.toLocaleString('en-US')}
                </span>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
}

export default ImpactHUD;
