import React, { useState } from 'react';
import MagneticButton from './MagneticButton';

export function ReturnMap({ triggerReward }) {
  const [returnState, setReturnState] = useState('idle'); // idle, checking, refunded
  const [selectedNode, setSelectedNode] = useState(null);

  const nodes = [
    { name: 'Subko Cafe Node', type: 'Partner Cafe', dist: '25m', status: 'Active', capacity: 'Low Waste' },
    { name: 'Blue Tokai Node', type: 'Partner Cafe', dist: '220m', status: 'Active', capacity: 'Medium Waste' },
    { name: 'Terminal 2 Smart Bin', type: 'Automated Drop', dist: '350m', status: 'Active', capacity: 'Empty' },
    { name: 'Third Wave Node', type: 'Partner Cafe', dist: '800m', status: 'Maintenance', capacity: 'Full' }
  ];

  const handleReturnSimulate = (node) => {
    setSelectedNode(node);
    setReturnState('checking');
    
    // Simulate drop validation checklist
    setTimeout(() => {
      setReturnState('refunded');
      triggerReward(); // trigger cashback coins rain cascade!
    }, 1200);
  };

  const resetReturn = () => {
    setReturnState('idle');
    setSelectedNode(null);
  };

  return (
    <section className="min-h-screen w-full bg-[#1E252B] text-light-cream pt-28 pb-16 flex items-center justify-center">
      <div className="layout-grid grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Side: Geolocation Dashboard Nodes List */}
        <div className="col-span-4 lg:col-span-6 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-mono uppercase text-mint tracking-wider font-bold">
              GEOLOCATION SEARCH
            </span>
            <h1 className="display-header text-4xl md:text-5xl font-black text-light-cream leading-none">
              DROP MAP NODES
            </h1>
          </div>

          <p className="interface-text text-sm text-white/70">
            Find the closest smart drop bin or partner café. Deposit the vessel, confirm return, and receive instant cashback.
          </p>

          {/* Dynamic nodes grid */}
          <div className="flex flex-col gap-3 max-h-[380px] overflow-y-auto pr-2">
            {nodes.map((node, i) => (
              <div 
                key={i}
                onClick={() => setSelectedNode(node)}
                className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 ${
                  selectedNode?.name === node.name 
                    ? 'bg-mint/10 border-mint' 
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex flex-col">
                    <span className="text-xs font-mono text-white/50">{node.type}</span>
                    <h3 className="display-header text-sm font-bold text-light-cream mt-0.5">{node.name}</h3>
                  </div>
                  <span className="text-xs font-mono text-mint font-bold">{node.dist}</span>
                </div>
                <div className="flex justify-between items-center mt-3 pt-2 border-t border-white/5 text-[10px] font-mono">
                  <span className={`px-2 py-0.5 rounded ${
                    node.status === 'Active' ? 'bg-mint/20 text-mint' : 'bg-red-400/20 text-red-400'
                  }`}>
                    {node.status}
                  </span>
                  <span className="text-white/40">{node.capacity}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Visual Map Simulation Window & Return Trigger */}
        <div className="col-span-4 lg:col-span-6 flex flex-col justify-between p-6 rounded-2xl bg-white/5 border border-white/10 relative overflow-hidden min-h-[400px]">
          
          {/* Simulated Geolocation HUD Grid */}
          <div className="absolute inset-0 opacity-15 pointer-events-none flex flex-wrap p-2 gap-4">
            {Array.from({ length: 48 }).map((_, i) => (
              <div key={i} className="w-10 h-10 border border-white/10 rounded flex items-center justify-center font-mono text-[8px]">
                +
              </div>
            ))}
          </div>

          <div className="relative z-10 w-full flex flex-col gap-4">
            <span className="text-[10px] font-mono text-white/50 uppercase tracking-widest">// drop point node interface</span>
            
            {selectedNode ? (
              <div className="p-6 rounded-xl bg-deep-ink border border-white/10 flex flex-col gap-4">
                <div className="flex justify-between items-baseline border-b border-white/10 pb-3">
                  <h3 className="display-header text-base font-bold text-light-cream">{selectedNode.name}</h3>
                  <span className="text-xs font-mono text-mint">{selectedNode.dist} away</span>
                </div>

                {returnState === 'idle' && (
                  <div className="flex flex-col gap-4">
                    <p className="interface-text text-xs text-white/60 leading-relaxed">
                      Confirm you have placed the vessel inside the smart bin receiver. The deposit sensor will validate the QR code.
                    </p>
                    <button
                      onClick={() => handleReturnSimulate(selectedNode)}
                      className="w-full py-3 bg-mint hover:bg-mint/95 text-deep-ink font-bold rounded-xl text-xs uppercase tracking-wider font-sans focus-visible:outline-none spring-transition"
                    >
                      Confirm Drop-off Validation
                    </button>
                  </div>
                )}

                {returnState === 'checking' && (
                  <div className="flex flex-col items-center justify-center py-6 gap-3">
                    <div className="w-8 h-8 rounded-full border-2 border-mint border-t-transparent animate-spin" />
                    <span className="text-xs font-mono text-mint uppercase">processing refund settlement...</span>
                  </div>
                )}

                {returnState === 'refunded' && (
                  <div className="flex flex-col items-center text-center gap-3 py-4">
                    <div className="w-12 h-12 rounded-full bg-mint/20 border border-mint flex items-center justify-center text-mint font-black text-lg animate-bounce">
                      ✓
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xl font-black font-mono text-[#F5B973]">+ ₹50.00</span>
                      <span className="text-[10px] font-mono text-white/40 uppercase">UPI Settlement Success</span>
                    </div>
                    <button
                      onClick={resetReturn}
                      className="text-xs font-mono text-mint underline hover:text-white mt-2 focus-visible:outline-none"
                    >
                      Scan Another Vessel
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex-1 flex flex-col justify-center items-center text-center py-20 gap-4 border border-dashed border-white/10 rounded-xl bg-deep-ink/50 p-6">
                <svg className="w-10 h-10 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-light-cream">No Node Selected</span>
                  <span className="text-[9px] font-mono text-white/40 uppercase">Select a node from the map dashboard to return</span>
                </div>
              </div>
            )}
          </div>

          <div className="text-[10px] font-mono text-white/30 mt-6 pt-4 border-t border-white/5 flex justify-between">
            <span>NETWORK SYSTEM CORE v1.0</span>
            <span>SECURE ESCROW CHANNEL</span>
          </div>

        </div>

      </div>
    </section>
  );
}

export default ReturnMap;
