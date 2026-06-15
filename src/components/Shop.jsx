import React from 'react';
import MagneticButton from './MagneticButton';

// Import color variant images
import forestCup from '../assets/product_card_forest.png';
import terracottaCup from '../assets/product_card_terracotta.png';
import boneCup from '../assets/product_card_bone.png';
import midnightCup from '../assets/product_card_midnight.png';

const cupImages = {
  Forest: forestCup,
  Terracotta: terracottaCup,
  Bone: boneCup,
  Midnight: midnightCup
};


export function Shop({ activeVariant, onColorwayChange }) {
  const products = [
    {
      id: 'vessel-single',
      name: 'Takeback Smart Vessel',
      price: '₹ 499.00',
      description: 'Single poly-composite insulated double-wall smart container. Base matrix QR integrated.',
      offset: 'Replaces 150+ paper cups',
      tag: 'BEST SELLER',
      isConfiguratorLink: true
    },
    {
      id: 'vessel-bundle',
      name: 'Loop Bundle Pack (Set of 3)',
      price: '₹ 1,299.00',
      description: 'Three thermal vessels for daily multi-use rotations. Share the loop with family.',
      offset: 'Replaces 450+ paper cups',
      tag: 'FAMILY VALUE',
      isConfiguratorLink: false
    },
    {
      id: 'vessel-corp',
      name: 'Corporate Cafe Kit (Set of 50)',
      price: '₹ 18,500.00',
      description: '50 smart vessels + B2B registration tag kits for office cafeterias and events.',
      offset: 'Replaces 7,500+ paper cups',
      tag: 'ENTERPRISE',
      isConfiguratorLink: false
    }
  ];

  return (
    <section className="min-h-screen w-full bg-[#F4F3EF] text-[#0B0F12] pt-28 pb-16 flex items-center justify-center">
      <div className="layout-grid">
        
        {/* Editorial Heading */}
        <div className="col-span-4 lg:col-span-12 flex flex-col gap-3 mb-10 border-b border-black/10 pb-6">
          <span className="text-xs font-mono uppercase text-[#1a2e22]/70 tracking-wider font-bold">
            D2C SHOP ARCHITECTURE
          </span>
          <h1 className="display-header text-4xl md:text-5xl font-black text-[#0B0F12] leading-none">
            OWN THE VESSEL
          </h1>
          <p className="interface-text text-sm text-black/60 max-w-xl">
            Acquire your personal hardware. Own the physical cup while linking it back to the digital UPI deposit and return network to retrieve cashback at any partnered cafes.
          </p>
        </div>

        {/* Products Grid */}
        <div className="col-span-4 lg:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {products.map((prod) => (
            <div 
              key={prod.id}
              className="group p-6 rounded-2xl bg-[#ffffff]/60 border border-black/5 flex flex-col justify-between hover:shadow-lg transition-all duration-300 relative overflow-hidden"
            >
              <div className="flex flex-col gap-4">
                
                {/* Visual Header */}
                <div className="flex justify-between items-center">
                  <span className="px-2.5 py-0.5 border border-black/15 rounded text-[9px] font-mono font-bold uppercase tracking-wider text-black/70">
                    {prod.tag}
                  </span>
                  <span className="text-xs font-mono text-[#1a2e22] font-semibold">
                    {prod.price}
                  </span>
                </div>

                {/* Shading/Illustration box */}
                <div className="w-full h-40 rounded-xl bg-black/5 border border-black/5 flex items-center justify-center relative overflow-hidden">
                  {prod.isConfiguratorLink ? (
                    <div className="text-center flex flex-col gap-1 p-4 pointer-events-none select-none">
                      <span className="text-[10px] font-mono uppercase text-black/40">// active configurator viewport</span>
                      <span className="text-xs font-bold text-[#1A2E22] group-hover:scale-105 transition-transform">Customize Colors Below</span>
                    </div>
                  ) : (
                    <div className="w-16 h-24 border border-[#1A2E22]/30 rounded flex flex-col justify-between p-2 opacity-55">
                      <div className="w-full h-1 bg-[#1A2E22]/20 rounded" />
                      <div className="w-full h-1 bg-[#1A2E22]/20 rounded mt-auto" />
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex flex-col gap-1.5">
                  <h3 className="display-header text-lg font-black text-[#0B0F12]">
                    {prod.name}
                  </h3>
                  <p className="interface-text text-xs text-black/70 leading-relaxed">
                    {prod.description}
                  </p>
                </div>

              </div>

              {/* Dynamic Carbon Offset rating */}
              <div className="mt-6 pt-4 border-t border-black/5 flex flex-col gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-mint shadow-[0_0_6px_rgba(163,226,201,0.5)]" />
                  <span className="font-mono text-[10px] text-[#1a2e22] tracking-wider uppercase font-semibold">
                    {prod.offset}
                  </span>
                </div>
                
                <MagneticButton 
                  onClick={() => alert(`Purchasing ${prod.name}!`)}
                  className="w-full py-2.5 bg-[#0B0F12] text-light-cream hover:bg-[#1E252B] rounded-lg text-xs font-bold uppercase tracking-wider font-sans focus-visible:outline-none"
                >
                  Purchase Vessel
                </MagneticButton>
              </div>

            </div>
          ))}
        </div>

        {/* 3D WebGL Configurator hook shown inside the shop path */}
        <div 
          id="configurator-viewport"
          className="col-span-4 lg:col-span-12 mt-12 p-8 rounded-2xl bg-[#ffffff]/60 border border-black/5 grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
        >
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-mono uppercase text-[#1a2e22]/80 font-bold tracking-wider">// physical variant config</span>
              <h2 className="display-header text-2xl font-black text-[#0B0F12]">SHADING PREVIEW</h2>
            </div>
            <p className="interface-text text-xs text-black/70 leading-relaxed">
              Select variant swatches below to customize material shader configurations and preview your smart cup colorway.
            </p>

            <div className="flex flex-col gap-2.5 mt-2">
              <span className="text-[10px] font-mono text-black/50 uppercase font-semibold">Colorway choices:</span>
              <div className="flex items-center gap-3">
                {[
                  { name: 'Forest', hex: '#1A2E22' },
                  { name: 'Terracotta', hex: '#C26343' },
                  { name: 'Bone', hex: '#D5D1C7' },
                  { name: 'Midnight', hex: '#14191C' }
                ].map((color) => {
                  const isSelected = activeVariant.name === color.name;
                  return (
                    <div 
                      key={color.name}
                      className={`w-12 h-12 flex items-center justify-center rounded-full spring-transition ${
                        isSelected ? 'border-2 border-mint scale-110 shadow-sm' : 'border border-transparent'
                      }`}
                    >
                      <button
                        onClick={() => onColorwayChange(color)}
                        className="w-9 h-9 rounded-full focus-visible:outline-none"
                        style={{ backgroundColor: color.hex }}
                        aria-label={`Select ${color.name} colorway`}
                        aria-pressed={isSelected}
                      />
                    </div>
                  );
                })}
                <span className="text-xs font-mono font-bold text-black/60 ml-2">{activeVariant.name}</span>
              </div>
            </div>
          </div>

          {/* Canvas targeting viewfinder */}
          <div className="h-[220px] rounded-xl bg-black/5 border border-black/5 flex items-center justify-center relative overflow-hidden p-3">
            <img 
              src={cupImages[activeVariant.name] || forestCup} 
              alt={`Takeback smart cup variant preview in ${activeVariant.name}`} 
              className="w-full h-full object-contain filter drop-shadow-md transition-all duration-500"
            />
          </div>

        </div>

      </div>
    </section>
  );
}

export default Shop;
