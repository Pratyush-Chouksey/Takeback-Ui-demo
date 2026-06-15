import React, { useEffect, useRef } from 'react';

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

export function ProductConfigurator({ activeVariant, onColorwayChange }) {
  const containerRef = useRef(null);

  const variants = [
    { name: 'Forest', hex: '#1A2E22', stroke: 'rgba(26, 46, 34, 0.45)', fill: 'rgba(26, 46, 34, 0.08)' },
    { name: 'Terracotta', hex: '#C26343', stroke: 'rgba(194, 99, 67, 0.45)', fill: 'rgba(194, 99, 67, 0.08)' },
    { name: 'Bone', hex: '#D5D1C7', stroke: 'rgba(180, 175, 165, 0.55)', fill: 'rgba(213, 209, 199, 0.18)' },
    { name: 'Midnight', hex: '#14191C', stroke: 'rgba(20, 25, 28, 0.45)', fill: 'rgba(20, 25, 28, 0.08)' }
  ];



  const specs = [
    { label: 'Thermal Shield', val: 'Double-wall structural lock' },
    { label: 'Asset Identifier', val: 'High-density laser QR engraving' },
    { label: 'Material Density', val: '18/8 Austenitic Stainless Steel' },
  ];

  return (
    <section 
      id="product-configurator-section"
      className="relative min-h-screen w-full bg-[#F4F3EF] text-[#0B0F12] border-t border-black/5"
    >
      <div className="max-w-[1440px] mx-auto px-5 lg:px-20 py-16 md:py-24 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20">
        
        {/* Left Viewport Panel: Display the selected color variant image directly */}
        <div 
          id="configurator-viewport"
          className="relative w-full h-[350px] md:h-[550px] rounded-2xl bg-white/40 border border-black/5 flex items-center justify-center overflow-hidden shadow-inner p-6"
        >
          <img 
            src={cupImages[activeVariant.name] || forestCup} 
            alt={`Takeback specialty coffee cup mockup in ${activeVariant.name} colorway`} 
            className="w-full h-full object-contain filter drop-shadow-xl transition-all duration-500"
          />
        </div>

        {/* Right Viewport Configurator Panel: Specifications Column */}
        <div className="flex flex-col justify-center gap-6">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-mono tracking-[0.2em] text-[#1a2e22]/70 uppercase font-semibold">
              CHAPTER 4 // SMART VESSEL
            </span>
            <h2 className="display-header text-3xl md:text-5xl font-black text-[#0B0F12]">
              THE TAKEBACK DEPOSIT CUP
            </h2>
          </div>

          <p className="interface-text text-sm md:text-base text-black/75 leading-[1.60] max-w-lg">
            Engineered for longevity and seamless return cycles. Double-wall vacuum configurations retain beverage temperatures while surviving thousands of commercial dishwasher washes.
          </p>

          {/* Technical Specs list */}
          <div className="space-y-2 border-t border-black/10 pt-4 font-mono text-xs max-w-lg">
            {specs.map((spec, i) => (
              <div key={i} className="flex justify-between border-b border-black/5 pb-2 last:border-0 last:pb-0">
                <span className="text-black/50">{spec.label}</span>
                <span className="font-semibold text-black/95">{spec.val}</span>
              </div>
            ))}
          </div>

          {/* Colorway Switcher Component */}
          <div className="flex flex-col gap-3">
            <span className="text-[10px] font-mono uppercase text-black/55 tracking-wider font-bold">
              Select Colorway variant
            </span>
            
            <div className="flex items-center gap-3">
              {variants.map((variant) => {
                const isSelected = activeVariant.name === variant.name;
                return (
                  /* Outer grid wrapper to guarantee explicit 48x48px touch click bounds */
                  <div 
                    key={variant.name}
                    className={`w-12 h-12 flex items-center justify-center rounded-full spring-transition ${
                      isSelected ? 'border-2 border-mint scale-110 shadow-sm' : 'border border-transparent'
                    }`}
                  >
                    <button
                      onClick={() => onColorwayChange(variant)}
                      className="w-9 h-9 rounded-full transition-transform duration-300 hover:scale-105 focus-visible:outline-none"
                      style={{ backgroundColor: variant.hex }}
                      aria-label={`Select ${variant.name} colorway`}
                      aria-pressed={isSelected}
                    />
                  </div>
                );
              })}
              
              <span className="text-xs font-mono text-black/60 font-semibold ml-2">
                {activeVariant.name}
              </span>
            </div>
          </div>

          {/* Environmental subtext warning */}
          <div className="max-w-lg mt-4 border-l-2 border-mint pl-4 py-1.5">
            <p className="font-mono text-xs text-[#1a2e22] tracking-wider uppercase font-semibold">
              &gt;&gt; This vessel replaces 500+ single-use paper cups over its lifespan.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}

export default ProductConfigurator;
