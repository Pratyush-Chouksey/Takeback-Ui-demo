import React, { useState, useEffect } from 'react';
import MagneticButton from './MagneticButton';

export function B2BPortal() {
  // ROI state values
  const [dailyVolume, setDailyVolume] = useState(300);
  const [paperCupCost, setPaperCupCost] = useState(8); // average cost in ₹ per cup
  const [isSavingsScaling, setIsSavingsScaling] = useState(false);

  // Partnership intake sheet state
  const [formData, setFormData] = useState({
    contactName: '',
    brandTitle: '',
    city: 'Bangalore',
    outlets: '1',
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
  const annualSavings = Math.max(0, annualPaperCupExpense - annualTakebackExpense);
  const plasticWasteDivertedKg = Math.round(annualSingleUseCount * 0.015); // ~15g per cup/lid

  // Trigger savings text scale morph animation
  useEffect(() => {
    setIsSavingsScaling(true);
    const timer = setTimeout(() => {
      setIsSavingsScaling(false);
    }, 250);
    return () => clearTimeout(timer);
  }, [annualSavings]);

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
        contactName: '',
        brandTitle: '',
        city: 'Bangalore',
        outlets: '1',
        contactEmail: '',
        acceptedTerms: false
      });
    }, 4000);
  };

  const partners = [
    {
      name: 'Third Wave Coffee Co.',
      nodes: '14 Urban Hub Nodes',
      region: 'Bengaluru Core',
      accent: 'border-mint/20'
    },
    {
      name: 'Blue Tokai Coffee Roasters',
      nodes: '22 Metro Nodes',
      region: 'Mumbai/Delhi Capital Region',
      accent: 'border-gold-amber/20'
    },
    {
      name: 'Subko Coffee Roasters',
      nodes: '6 Specialty Nodes',
      region: 'Bandra/Colaba Districts',
      accent: 'border-white/10'
    },
    {
      name: 'Araku Coffee',
      nodes: '2 flagship Heritage Nodes',
      region: 'Indiranagar Hub',
      accent: 'border-mint/20'
    }
  ];

  return (
    <section 
      id="b2b-portal-section"
      className="min-h-screen w-full bg-[#0B0F12] text-[#F7F5F0] pt-28 pb-16 flex items-center justify-center spring-transition"
    >
      <div className="max-w-[1440px] mx-auto w-full px-5 lg:px-20 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        
        {/* Row 1: Brand story header & registry data (Full width) */}
        {/* B2B Hero Image Stub: assets/b2b_hero.png (barista handing cup, TakeBack branding visible) */}
        {/* Starter Kit Flat-Lay Image Stub: assets/starter_kit.png (cups, menu card, signage on marble) */}
        <div className="col-span-1 lg:col-span-12 flex flex-col gap-8 border-b border-white/10 pb-8">
          <div className="flex flex-col lg:flex-row gap-8 justify-between items-start">
            <div className="flex flex-col gap-2 max-w-xl">
              <span className="text-xs font-mono tracking-[0.2em] text-[#A3E2C9] uppercase font-bold">
                B2B PARTNER NETWORK HUB
              </span>
              <h1 className="display-header text-4xl md:text-5xl font-black text-[#F7F5F0] leading-none uppercase">
                Operational Realization
              </h1>
              <p className="interface-text text-sm text-[#F7F5F0]/65 mt-2">
                Optimize procurement budgets and integrate your cafes into India's largest smart-sharing borrow-and-return system.
              </p>
            </div>
            
            {/* Café Owner Benefits */}
            <div className="flex flex-col gap-4 max-w-xl w-full bg-white/5 border border-white/10 p-6 rounded-2xl">
              <span className="text-[10px] font-mono tracking-widest text-[#A3E2C9] uppercase font-bold block">
                PARTNER CAFÉ BENEFITS
              </span>
              <ul className="flex flex-col gap-3 text-xs leading-relaxed text-[#F7F5F0]/85 font-sans">
                <li className="flex gap-2 items-start">
                  {/* TODO: confirm with founder */}
                  <span className="text-mint font-bold">✓</span>
                  <span><strong>Cost Reduction:</strong> Phase out disposable cup spending. Pay only a low service fee per borrow/wash cycle, saving up to 40% annually on packaging budgets.</span>
                </li>
                <li className="flex gap-2 items-start">
                  {/* TODO: confirm with founder */}
                  <span className="text-mint font-bold">✓</span>
                  <span><strong>Premium Branding:</strong> Custom-deboss your café logo onto beautiful fluted husk cups, aligning your brand with modern circular design.</span>
                </li>
                <li className="flex gap-2 items-start">
                  {/* TODO: confirm with founder */}
                  <span className="text-mint font-bold">✓</span>
                  <span><strong>Seamless Sustainability:</strong> Divert waste without operational friction. We manage automated bin collection, high-temperature sanitation, and restocking.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Registry Social Proof Matrix */}
          <div className="flex flex-col gap-4 mt-2">
            <span className="text-[10px] font-mono tracking-widest text-[#F7F5F0]/40 uppercase font-semibold">
              ACTIVE NETWORK REGISTRY
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {partners.map((partner, idx) => (
                <div 
                  key={idx} 
                  className={`glass-panel p-5 rounded-xl border ${partner.accent} hover:bg-white/5 transition-all duration-300`}
                >
                  <span className="text-[10px] font-mono text-[#A3E2C9] font-bold uppercase tracking-wider block">
                    {partner.nodes}
                  </span>
                  <h3 className="display-header text-base font-bold text-[#F7F5F0] mt-1.5 leading-snug">
                    {partner.name}
                  </h3>
                  <span className="text-xs text-[#F7F5F0]/50 font-mono block mt-1">
                    {partner.region}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Row 2, Left 7 Columns: B2B ROI Calculator Workspace */}
        <div className="col-span-1 lg:col-span-7 flex flex-col gap-8">
          
          <div className="flex flex-col gap-2">
            <span className="text-xs font-mono tracking-[0.2em] text-[#A3E2C9]/80 uppercase font-bold">
              CHAPTER 6 // OPERATOR INTEGRATION
            </span>
            <h2 className="display-header text-2xl md:text-3xl font-black text-[#F7F5F0] leading-none uppercase">
              CAFÉ ROI CALCULATOR
            </h2>
            {/* TODO: confirm with founder */}
            <p className="interface-text text-xs text-[#F7F5F0]/60 mt-1">
              Calculate your direct environmental and financial impact. Enter your café's daily coffee volume and current single-use packaging unit costs to determine your projected annual savings. By shifting from traditional disposable cups and plastic lids to our shared loop, you replace high procurement expenses with a low, predictable flat-rate washing cycle fee.
            </p>
          </div>

          <div className="p-6 md:p-8 rounded-2xl bg-[#1E252B] border border-white/5 flex flex-col gap-6 shadow-xl">
            
            {/* Control Outlines */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Daily Volume typing field */}
              <div className="flex flex-col gap-2">
                <label htmlFor="daily-volume-input" className="text-[10px] font-mono text-[#F7F5F0]/50 uppercase tracking-wider">
                  DAILY CUP DEMAND:
                </label>
                <div className="relative flex items-center">
                  <input 
                    id="daily-volume-input"
                    type="number" 
                    min="1" 
                    max="100000" 
                    value={dailyVolume} 
                    onChange={(e) => setDailyVolume(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-3 text-sm font-mono text-[#F7F5F0] focus:ring-1 focus:ring-mint focus:outline-none transition-all"
                    style={{ minHeight: '48px' }}
                  />
                  <span className="absolute right-3 text-[10px] font-mono text-[#F7F5F0]/30 pointer-events-none">CUPS/DAY</span>
                </div>
              </div>

              {/* Paper cup unit cost typing field */}
              <div className="flex flex-col gap-2">
                <label htmlFor="paper-cost-input" className="text-[10px] font-mono text-[#F7F5F0]/50 uppercase tracking-wider">
                  SINGLE-USE CUP + LID COST (₹):
                </label>
                <div className="relative flex items-center">
                  <input 
                    id="paper-cost-input"
                    type="number" 
                    min="0" 
                    max="100" 
                    value={paperCupCost} 
                    onChange={(e) => setPaperCupCost(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-3 text-sm font-mono text-[#F7F5F0] focus:ring-1 focus:ring-mint focus:outline-none transition-all"
                    style={{ minHeight: '48px' }}
                  />
                  <span className="absolute right-3 text-[10px] font-mono text-[#F7F5F0]/30 pointer-events-none">INR/CUP</span>
                </div>
              </div>

            </div>

            {/* Calculations Grid Dashboard */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-white/5 pt-6 mt-2">
              
              <div className="p-4 rounded-xl bg-black/35 border border-white/5 flex flex-col gap-1">
                <span className="text-[9px] font-mono text-[#F7F5F0]/45 uppercase font-bold">Paper Cup Budget</span>
                <span className="text-base font-black font-mono text-[#F7F5F0]/80">
                  ₹{annualPaperCupExpense.toLocaleString('en-IN')}
                </span>
                <span className="text-[8px] font-mono text-[#F7F5F0]/40">annualized</span>
              </div>

              <div className="p-4 rounded-xl bg-black/35 border border-white/5 flex flex-col gap-1">
                <span className="text-[9px] font-mono text-[#F7F5F0]/45 uppercase font-bold">Takeback Service</span>
                <span className="text-base font-black font-mono text-[#A3E2C9]">
                  ₹{annualTakebackExpense.toLocaleString('en-IN')}
                </span>
                <span className="text-[8px] font-mono text-[#F7F5F0]/40">annualized subscription</span>
              </div>

              <div className="p-4 rounded-xl bg-[#A3E2C9]/10 border border-[#A3E2C9]/20 flex flex-col gap-1 overflow-hidden">
                <span className="text-[9px] font-mono text-[#A3E2C9]/90 uppercase font-bold">Net Budget Savings</span>
                <span 
                  className="text-[#A3E2C9] font-bold origin-left"
                  style={{
                    display: 'inline-block',
                    fontSize: '1.25rem',
                    transform: isSavingsScaling ? 'scale(1.15)' : 'scale(1)',
                    transition: 'transform 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                  }}
                >
                  ₹{annualSavings.toLocaleString('en-IN')}
                </span>
                <span className="text-[8px] font-mono text-[#A3E2C9]/70 font-semibold">savings (₹ / year)</span>
              </div>

            </div>

            {/* Waste offset metrics */}
            <div className="p-4 rounded-xl bg-black/25 border border-white/5 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[9px] font-mono text-[#F7F5F0]/45 uppercase">Landfill Waste Diverted</span>
                <span className="text-xs font-semibold text-[#F7F5F0]/85 mt-0.5">
                  Phases out {annualSingleUseCount.toLocaleString('en-IN')} single-use items/year
                </span>
              </div>
              <span className="text-sm font-black font-mono text-[#A3E2C9] bg-black/50 px-3 py-1.5 rounded-lg border border-white/5">
                {plasticWasteDivertedKg.toLocaleString('en-IN')} kg
              </span>
            </div>

          </div>

        </div>

        {/* Row 2, Right 5 Columns: Café Operator intake sheet */}
        <div className="col-span-1 lg:col-span-5 flex flex-col gap-6">
          
          <div className="flex flex-col gap-1">
            <span className="text-xs font-mono uppercase text-[#F5B973] tracking-wider font-semibold">
              JOIN THE CIRCULARITY NETWORK
            </span>
            <h2 className="display-header text-2xl font-bold text-[#F7F5F0] uppercase">
              PARTNER INTAKE FORM
            </h2>
          </div>

          <div className="p-6 rounded-2xl bg-[#1E252B] text-[#F7F5F0] border border-white/10 shadow-xl relative overflow-hidden">
            
            {submitted ? (
              <div className="py-16 text-center flex flex-col items-center justify-center gap-4">
                <div className="w-14 h-14 rounded-full bg-mint/20 border border-mint flex items-center justify-center text-mint font-black text-xl animate-bounce">
                  ✓
                </div>
                <div className="flex flex-col gap-1">
                  {/* TODO: confirm with founder */}
                  <h3 className="display-header text-lg font-bold text-[#F7F5F0]">Inquiry Submitted Successfully</h3>
                  {/* TODO: confirm with founder */}
                  <p className="interface-text text-xs text-[#F7F5F0]/55 px-4 leading-relaxed">
                    Thank you for joining the circular movement. Our partnership team will review your application and email you an onboarding packet within 24 hours.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleIntakeSubmit} className="flex flex-col gap-4">
                
                {/* Contact Name input */}
                <div className="flex flex-col gap-1">
                  {/* TODO: confirm with founder */}
                  <label htmlFor="contactName" className="text-[10px] font-mono text-[#F7F5F0]/40 uppercase">Contact Name / Partnership Lead:</label>
                  <input 
                    id="contactName"
                    type="text" 
                    name="contactName" 
                    required 
                    value={formData.contactName} 
                    onChange={handleFormChange}
                    placeholder="e.g. John Doe"
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2.5 text-xs text-[#F7F5F0] placeholder:text-white/20 focus:ring-1 focus:ring-mint focus:outline-none transition-all"
                    style={{ minHeight: '48px' }}
                  />
                </div>

                {/* Brand Title input */}
                <div className="flex flex-col gap-1">
                  {/* TODO: confirm with founder */}
                  <label htmlFor="brandTitle" className="text-[10px] font-mono text-[#F7F5F0]/40 uppercase">Café Brand Name & Title:</label>
                  <input 
                    id="brandTitle"
                    type="text" 
                    name="brandTitle" 
                    required 
                    value={formData.brandTitle} 
                    onChange={handleFormChange}
                    placeholder="e.g. Beverage Director / Founder"
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2.5 text-xs text-[#F7F5F0] placeholder:text-white/20 focus:ring-1 focus:ring-mint focus:outline-none transition-all"
                    style={{ minHeight: '48px' }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Total Active Outlets selection */}
                  <div className="flex flex-col gap-1">
                    {/* TODO: confirm with founder */}
                    <label htmlFor="outlets" className="text-[10px] font-mono text-[#F7F5F0]/40 uppercase">Total Active Locations:</label>
                    <select 
                      id="outlets"
                      name="outlets"
                      value={formData.outlets} 
                      onChange={handleFormChange}
                      className="w-full bg-[#0B0F12] border border-white/10 rounded-lg px-3 py-2.5 text-xs text-[#F7F5F0] focus:outline-none focus:border-mint"
                      style={{ minHeight: '48px' }}
                    >
                      <option value="1">1 Outlet</option>
                      <option value="2-5">2 to 5 Outlets</option>
                      <option value="6-15">6 to 15 Outlets</option>
                      <option value="15+">15+ Regional Chain</option>
                    </select>
                  </div>

                  {/* City Node Select dropdown */}
                  <div className="flex flex-col gap-1">
                    {/* TODO: confirm with founder */}
                    <label htmlFor="city" className="text-[10px] font-mono text-[#F7F5F0]/40 uppercase">Primary City Node:</label>
                    <select 
                      id="city"
                      name="city"
                      value={formData.city} 
                      onChange={handleFormChange}
                      className="w-full bg-[#0B0F12] border border-white/10 rounded-lg px-3 py-2.5 text-xs text-[#F7F5F0] focus:outline-none focus:border-mint"
                      style={{ minHeight: '48px' }}
                    >
                      <option value="Bangalore">Bangalore</option>
                      <option value="Mumbai">Mumbai</option>
                      <option value="Delhi NCR">Delhi NCR</option>
                      <option value="Pune">Pune</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  {/* TODO: confirm with founder */}
                  <label htmlFor="contactEmail" className="text-[10px] font-mono text-[#F7F5F0]/40 uppercase">Business Email Address:</label>
                  <input 
                    id="contactEmail"
                    type="email" 
                    name="contactEmail" 
                    required 
                    value={formData.contactEmail} 
                    onChange={handleFormChange}
                    placeholder="ops@yourbrand.com"
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2.5 text-xs text-[#F7F5F0] placeholder:text-white/20 focus:ring-1 focus:ring-mint focus:outline-none transition-all"
                    style={{ minHeight: '48px' }}
                  />
                </div>

                <div className="flex items-start gap-2.5 mt-2">
                  <input 
                    id="acceptedTerms"
                    type="checkbox" 
                    name="acceptedTerms" 
                    checked={formData.acceptedTerms} 
                    onChange={handleFormChange}
                    className="w-4 h-4 rounded bg-[#0B0F12] border-white/10 accent-mint focus:ring-0 focus:ring-offset-0 mt-0.5 cursor-pointer"
                    style={{ minHeight: '16px' }}
                  />
                  {/* TODO: confirm with founder */}
                  <label htmlFor="acceptedTerms" className="text-[10px] font-mono text-[#F7F5F0]/60 leading-normal cursor-pointer select-none">
                    I agree to supply food-grade safe washing cycles conforming to Takeback network hygiene parameters.
                  </label>
                </div>

                {/* TODO: confirm with founder */}
                <MagneticButton 
                  type="submit"
                  className="w-full py-3 bg-[#A3E2C9] hover:bg-[#A3E2C9]/90 text-[#0B0F12] font-bold rounded-lg text-xs uppercase tracking-wider font-sans focus-visible:outline-none mt-2 spring-transition border-none cursor-pointer"
                  style={{ minHeight: '48px' }}
                >
                  Send Inquiry & Request Pricing
                </MagneticButton>

                {/* B2B response commitment label */}
                <div className="text-[10px] font-mono text-[#F7F5F0]/50 text-center mt-2">
                  {/* TODO: confirm with founder */}
                  We commit to responding to all partner applications within 24 hours.
                </div>

              </form>
            )}

            <div className="text-[9px] font-mono text-[#F7F5F0]/35 mt-6 border-t border-white/5 pt-3 flex justify-between">
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
