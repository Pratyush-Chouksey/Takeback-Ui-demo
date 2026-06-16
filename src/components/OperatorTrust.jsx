import React, { useState } from 'react';
import MagneticButton from './MagneticButton';

export function OperatorTrust() {
  const brands = [
    'Cafe 1',
    'Cafe 2',
    'Cafe 3',
    'Cafe 4',
    'Cafe 5',
    'Cafe 6',
    'Cafe 7'
  ];

  const testimonials = [
    {
      quote: "Implementing Takeback resolved our waste management and B2B carbon accounting. Reusing smart vessels allowed us to completely drop single-use paper cups.",
      operator: "Rahul Sharma, Operational Lead",
      cafe: "Cafe 1",
      metric: "14,200 cups diverted • ₹2,13,000 saved"
    },
    {
      quote: "Our customer feedback has been exceptional. The UPI refund workflow takes less than 3 seconds, blending B2C reward programs cleanly into sustainable loops.",
      operator: "Ananya Roy, General Manager",
      cafe: "Cafe 2",
      metric: "45,800 cups diverted • ₹6,87,000 saved"
    },
    {
      quote: "Operational integration was near frictionless. Partnered cafes process returns automatically and trigger database updates directly to our inventory trackers.",
      operator: "Vikram Sen, Tech Lead",
      cafe: "Cafe 3",
      metric: "29,400 cups diverted • ₹4,41,000 saved"
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section 
      id="operator-trust-section"
      className="relative min-h-screen w-full bg-[#F7F5F0] text-[#0B0F12] border-t border-black/5 flex flex-col justify-between py-16 lg:py-20 xl:py-24"
    >
      {/* Infinite scrolling marquee stylesheet */}
      <style>{`
        @keyframes marqueeScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-container {
          overflow: hidden;
          white-space: nowrap;
          width: 100%;
        }
        .marquee-track {
          display: inline-flex;
          gap: 4rem;
          animation: marqueeScroll 25s linear infinite;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
        @keyframes slideQuoteIn {
          0% { transform: translateX(15px); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
      `}</style>

      {/* Top Segment: Infinite auto-scrolling brand logo marquee track */}
      <div className="w-full flex flex-col gap-4">
        <div className="layout-grid pb-2">
          <div className="col-span-4 lg:col-span-12">
            <span className="text-[10px] font-mono tracking-[0.2em] text-[#1a2e22]/70 uppercase font-semibold">
              PARTNER NETWORK LOGO GRID
            </span>
          </div>
        </div>

        <div className="marquee-container py-6 border-y border-black/10 bg-white/30 backdrop-blur-sm select-none">
          <div className="marquee-track">
            {/* Original set */}
            {brands.map((brand, i) => (
              <div 
                key={i} 
                className="flex items-center gap-2 font-mono text-sm tracking-widest text-[#0B0F12] opacity-45 hover:opacity-100 hover:scale-105 spring-transition cursor-pointer"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-mint" />
                <span className="font-semibold uppercase">{brand}</span>
              </div>
            ))}
            {/* Duplicated set to create seamless looping track */}
            {brands.map((brand, i) => (
              <div 
                key={`dup-${i}`} 
                className="flex items-center gap-2 font-mono text-sm tracking-widest text-[#0B0F12] opacity-45 hover:opacity-100 hover:scale-105 spring-transition cursor-pointer"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-mint" />
                <span className="font-semibold uppercase">{brand}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Editorial Review Slider Panel Component */}
      <div className="layout-grid my-auto py-10">
        <div className="col-span-4 lg:col-span-10 lg:col-start-2 flex flex-col items-center text-center gap-8">
          
          <span className="text-xs font-mono uppercase text-gold-amber tracking-wider font-semibold">
            B2B OPERATOR TESTIMONIAL
          </span>

          {/* Testimonial Quote wrapper */}
          <div 
            key={currentIndex}
            className="w-full flex flex-col gap-6"
            style={{ animation: 'slideQuoteIn 0.45s var(--transition-spring) forwards' }}
          >
            {/* Georgia display serif 28px default */}
            <blockquote className="display-header text-xl md:text-3xl lg:text-[28px] font-medium leading-[1.3] text-[#0B0F12] max-w-3xl mx-auto italic select-none">
              “{testimonials[currentIndex].quote}”
            </blockquote>

            {/* Operator credits metadata */}
            <div className="flex flex-col gap-1 mt-2">
              <span className="interface-text text-sm font-bold text-[#0b0f12]">
                {testimonials[currentIndex].operator}
              </span>
              <span className="interface-text text-xs text-black/50">
                {testimonials[currentIndex].cafe}
              </span>
            </div>

            {/* Operational stats loop */}
            <div className="mt-4 inline-block mx-auto px-4 py-1.5 rounded-full bg-black/5 border border-black/5 font-mono text-xs text-[#1a2e22]/90">
              {testimonials[currentIndex].metric}
            </div>
          </div>

          {/* Manual navigation layout controls */}
          <div className="flex items-center gap-6 mt-4">
            <MagneticButton
              onClick={handlePrev}
              className="w-12 h-12 rounded-full border border-black/15 bg-white/40 hover:bg-white flex items-center justify-center text-lg focus-visible:outline-none"
              aria-label="Previous testimonial"
            >
              ←
            </MagneticButton>
            
            <div className="text-xs font-mono text-black/40">
              {currentIndex + 1} / {testimonials.length}
            </div>

            <MagneticButton
              onClick={handleNext}
              className="w-12 h-12 rounded-full border border-black/15 bg-white/40 hover:bg-white flex items-center justify-center text-lg focus-visible:outline-none"
              aria-label="Next testimonial"
            >
              →
            </MagneticButton>
          </div>

        </div>
      </div>

      {/* B2B Teaser Block */}
      <div className="layout-grid py-12 border-t border-black/10 my-4 lg:my-8">
        <div className="col-span-4 lg:col-span-12 flex flex-col md:flex-row items-center justify-between gap-6 bg-white/40 border border-black/5 p-8 rounded-2xl shadow-sm">
          <div className="flex flex-col gap-2 max-w-xl text-left">
            <span className="text-[10px] font-mono tracking-wider text-black/50 uppercase font-semibold">
              B2B PARTNERSHIP OPPORTUNITY
            </span>
            <h3 className="display-header text-xl md:text-2xl font-bold text-[#0B0F12]">
              Ready to transition your café to zero-waste packaging?
            </h3>
            <p className="interface-text text-sm text-black/60">
              Get in touch to request B2B pricing.
            </p>
          </div>
          <MagneticButton 
            className="px-6 py-3 bg-[#0B0F12] text-light-cream hover:bg-[#1E252B] font-semibold text-xs rounded-xl tracking-wider uppercase font-sans border-none cursor-pointer flex-shrink-0"
            onClick={() => alert("Redirecting to Cafe partner hub...")}
          >
            Request B2B Pricing
          </MagneticButton>
        </div>
      </div>

      {/* Decorative spacing/footer */}
      <div className="layout-grid pt-4 border-t border-black/5">
        <div className="col-span-4 lg:col-span-12 flex justify-between items-center text-[10px] font-mono text-black/40">
          <span>// TRUST ARCHITECTURE ENFORCED</span>
          <span>TAKEBACK / NETWORK</span>
        </div>
      </div>
    </section>
  );
}

export default OperatorTrust;
