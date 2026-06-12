import React, { useState } from 'react';
import MagneticButton from './MagneticButton';

export function B2BPortal() {
  // ROI state values
  const [dailyVolume, setDailyVolume] = useState(300);
  const [paperCupCost, setPaperCupCost] = useState(8); // average cost in ₹ per cup

  // Partnership intake sheet state
  const [formData, setFormData] = useState({
    cafeName: '',
    outlets: '1',
    city: 'Mumbai',
    contactEmail: '',
    acceptedTerms: false
  });
  const [submitted, setSubmitted] = useState(false);

  // ROI computations
  const annualSingleUseCount = dailyVolume * 365;
  const annualPaperCupExpense = annualSingleUseCount * paperCupCost;
  
  // Takeback model: subscription/service fee is roughly ₹1.80 per cycle wash/borrow
  const takebackServiceFee = 1.8;
  const annualTakebackExpense = annualSingleUseCount * takebackServiceFee;
  const annualSavings = annualPaperCupExpense - annualTakebackExpense;
  const plasticWasteDivertedKg = Math.round(annualSingleUseCount * 0.015); // ~15g per cup/lid

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleIntakeSubmit = (e) => {
    e.preventDefault();
    if (!formData.acceptedTerms) {
      alert("Please accept the compliance terms to proceed.");
      return;
    }
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        cafeName: '',
        outlets: '1',
        city: 'Mumbai',
        contactEmail: '',
        acceptedTerms: false
      });
    }, 4000);
  };

  return (
    <section 
      id="b2b-portal-section"
      className="min-h-screen w-full bg-[#F7F5F0] text-[#0B0F12] pt-28 pb-16 flex items-center justify-center"
    >
      <div className="max-w-[1440px] mx-auto w-full px-5 lg:px-20 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        
        {/* Left 6 Columns: B2B ROI Calculator Workspace */}
        <div className="col-span-1 lg:col-span-7 flex flex-col gap-8">
          
          <div className="flex flex-col gap-2">
            <span className="text-xs font-mono tracking-[0.2em] text-[#1a2e22]/80 uppercase font-bold">
              CHAPTER 6 // OPERATOR INTEGRATION
            </span>
            <h1 className="display-header text-4xl md:text-5xl font-black text-[#0B0F12] leading-none uppercase">
              CAFÉ ROI CALCULATOR
            </h1>
            <p className="interface-text text-sm text-black/60 mt-2">
              Calculate packaging cost reductions by phasing out single-use paper cups and lids in favor of the Takeback smart-sharing loop network.
            </p>
          </div>

          <div className="p-6 md:p-8 rounded-2xl bg-white border border-black/5 shadow-sm flex flex-col gap-6">
            
            {/* Control Outlines */}
            <div className="flex flex-col gap-5">
              
              {/* Daily Volume slider */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-xs font-mono text-black/60">
                  <label htmlFor="daily-volume-slider">DAILY VESSEL DEMAND:</label>
                  <span className="font-bold text-base text-[#1a2e22]">{dailyVolume} cups / day</span>
                </div>
                <input 
                  id="daily-volume-slider"
                  type="range" 
                  min="50" 
                  max="2000" 
                  step="50"
                  value={dailyVolume} 
                  onChange={(e) => setDailyVolume(parseInt(e.target.value))}
                  className="w-full h-1 bg-black/10 rounded-lg appearance-none cursor-pointer accent-[#1A2E22]" 
                />
              </div>

              {/* Paper cup unit cost slider */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-xs font-mono text-black/60">
                  <label htmlFor="paper-cost-slider">PAPER CUP + LID UNIT COST:</label>
                  <span className="font-bold text-base text-[#1a2e22]">₹ {paperCupCost}.00 / cup</span>
                </div>
                <input 
                  id="paper-cost-slider"
                  type="range" 
                  min="4" 
                  max="20" 
                  step="1"
                  value={paperCupCost} 
                  onChange={(e) => setPaperCupCost(parseInt(e.target.value))}
                  className="w-full h-1 bg-black/10 rounded-lg appearance-none cursor-pointer accent-[#1A2E22]" 
                />
              </div>

            </div>

            {/* Calculations Grid Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-black/5 pt-6 mt-2">
              
              <div className="p-4 rounded-xl bg-[#F7F5F0] border border-black/5 flex flex-col gap-1">
                <span className="text-[9px] font-mono text-black/45 uppercase font-bold">Paper Cup Budget</span>
                <span className="text-lg font-black font-mono text-black/80">
                  ₹{annualPaperCupExpense.toLocaleString('en-IN')}
                </span>
                <span className="text-[8px] font-mono text-black/40">annualized</span>
              </div>

              <div className="p-4 rounded-xl bg-[#F7F5F0] border border-black/5 flex flex-col gap-1">
                <span className="text-[9px] font-mono text-black/45 uppercase font-bold">Takeback Service</span>
                <span className="text-lg font-black font-mono text-[#1a2e22]">
                  ₹{annualTakebackExpense.toLocaleString('en-IN')}
                </span>
                <span className="text-[8px] font-mono text-black/40">annualized subscription</span>
              </div>

              <div className="p-4 rounded-xl bg-mint/10 border border-mint/35 flex flex-col gap-1">
                <span className="text-[9px] font-mono text-mint/90 uppercase font-bold">Net Budget Savings</span>
                <span className="text-lg font-black font-mono text-[#1A2E22]">
                  ₹{annualSavings.toLocaleString('en-IN')}
                </span>
                <span className="text-[8px] font-mono text-[#1a2e22]/70 font-semibold">savings (₹ / year)</span>
              </div>

            </div>

            {/* Waste offset metrics */}
            <div className="p-4 rounded-xl bg-black/5 border border-black/5 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[9px] font-mono text-black/45 uppercase">Landfill Waste Diverted</span>
                <span className="text-xs font-semibold text-black/85 mt-0.5">
                  Phases out {annualSingleUseCount.toLocaleString('en-IN')} single-use items/year
                </span>
              </div>
              <span className="text-sm font-black font-mono text-[#1a2e22] bg-white px-3 py-1.5 rounded-lg border border-black/5">
                {plasticWasteDivertedKg.toLocaleString('en-IN')} kg
              </span>
            </div>

          </div>

        </div>

        {/* Right 5 Columns: Café Operator intake sheet */}
        <div className="col-span-1 lg:col-span-5 flex flex-col gap-6">
          
          <div className="flex flex-col gap-1">
            <span className="text-xs font-mono uppercase text-gold-amber tracking-wider font-semibold">
              JOIN THE CIRCULARITY NETWORK
            </span>
            <h2 className="display-header text-2xl font-bold text-[#0B0F12] uppercase">
              PARTNER INTAKE FORM
            </h2>
          </div>

          <div className="p-6 rounded-2xl bg-[#0B0F12] text-light-cream border border-white/10 shadow-xl relative overflow-hidden">
            
            {submitted ? (
              <div className="py-16 text-center flex flex-col items-center justify-center gap-4">
                <div className="w-14 h-14 rounded-full bg-mint/20 border border-mint flex items-center justify-center text-mint font-black text-xl animate-bounce">
                  ✓
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="display-header text-lg font-bold text-light-cream">Submission Received</h3>
                  <p className="interface-text text-xs text-white/55 px-4 leading-relaxed">
                    Our compliance engineers will contact your cafe team to perform outlets inspections within 24 hours.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleIntakeSubmit} className="flex flex-col gap-4">
                
                <div className="flex flex-col gap-1">
                  <label htmlFor="cafeName" className="text-[10px] font-mono text-white/40 uppercase">CAFÉ BRAND NAME:</label>
                  <input 
                    id="cafeName"
                    type="text" 
                    name="cafeName" 
                    required 
                    value={formData.cafeName} 
                    onChange={handleFormChange}
                    placeholder="e.g. Specialty Outlets Inc"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-xs text-light-cream placeholder:text-white/20 focus:ring-1 focus:ring-mint focus:outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label htmlFor="outlets" className="text-[10px] font-mono text-white/40 uppercase">ACTIVE OUTLETS:</label>
                    <select 
                      id="outlets"
                      name="outlets"
                      value={formData.outlets} 
                      onChange={handleFormChange}
                      className="w-full bg-[#1e252b] border border-white/10 rounded-lg px-3 py-2.5 text-xs text-light-cream focus:outline-none focus:border-mint"
                    >
                      <option value="1">1 Outlet</option>
                      <option value="2-5">2 to 5 Outlets</option>
                      <option value="6-15">6 to 15 Outlets</option>
                      <option value="15+">15+ Regional Chain</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label htmlFor="city" className="text-[10px] font-mono text-white/40 uppercase">OPERATING CITY:</label>
                    <select 
                      id="city"
                      name="city"
                      value={formData.city} 
                      onChange={handleFormChange}
                      className="w-full bg-[#1e252b] border border-white/10 rounded-lg px-3 py-2.5 text-xs text-light-cream focus:outline-none focus:border-mint"
                    >
                      <option value="Mumbai">Mumbai</option>
                      <option value="Bangalore">Bangalore</option>
                      <option value="Delhi NCR">Delhi NCR</option>
                      <option value="Pune">Pune</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label htmlFor="contactEmail" className="text-[10px] font-mono text-white/40 uppercase">PARTNERSHIP INVENTORY EMAIL:</label>
                  <input 
                    id="contactEmail"
                    type="email" 
                    name="contactEmail" 
                    required 
                    value={formData.contactEmail} 
                    onChange={handleFormChange}
                    placeholder="ops@yourbrand.com"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-xs text-light-cream placeholder:text-white/20 focus:ring-1 focus:ring-mint focus:outline-none transition-all"
                  />
                </div>

                <div className="flex items-start gap-2.5 mt-2">
                  <input 
                    id="acceptedTerms"
                    type="checkbox" 
                    name="acceptedTerms" 
                    checked={formData.acceptedTerms} 
                    onChange={handleFormChange}
                    className="w-4 h-4 rounded bg-[#1e252b] border-white/10 accent-mint focus:ring-0 focus:ring-offset-0 mt-0.5 cursor-pointer"
                  />
                  <label htmlFor="acceptedTerms" className="text-[10px] font-mono text-white/60 leading-normal cursor-pointer select-none">
                    I agree to supply food-grade safe washing cycles conforming to Takeback network hygiene parameters.
                  </label>
                </div>

                <MagneticButton 
                  type="submit"
                  className="w-full py-3 bg-mint hover:bg-mint/90 text-deep-ink font-bold rounded-lg text-xs uppercase tracking-wider font-sans focus-visible:outline-none mt-2 spring-transition"
                >
                  Submit Intake Application
                </MagneticButton>

              </form>
            )}

            <div className="text-[9px] font-mono text-white/35 mt-6 border-t border-white/5 pt-3 flex justify-between">
              <span>B2B COMPLIANCE INTERFACE v1.2</span>
              <span>SECURE ENDPOINT VALIDATED</span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

export default B2BPortal;
