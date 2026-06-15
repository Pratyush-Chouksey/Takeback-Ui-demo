import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

export function WasteRealization() {
  const sectionRef = useRef(null);
  const leftColRef = useRef(null);
  const rightColRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const leftCol = leftColRef.current;
    const rightCol = rightColRef.current;

    if (!section || !leftCol || !rightCol) return;

    // 1. GSAP matchMedia to enable pinning on Desktop (>768px) and disable on Mobile (<=768px)
    let ctx = gsap.context(() => {
      let mm = gsap.matchMedia();

      // Desktop layout: Pinned Left side, Scrolling Right side
      mm.add("(min-width: 769px)", () => {
        ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          pin: leftCol,
          pinSpacing: true,
        });
      });

      // 2. Scroll-Driven Numerical Counter for Block 1 (One Billion)
      const counterEl = document.getElementById("scroll-digit-counter");
      if (counterEl) {
        const counterObj = { value: 0 };
        gsap.to(counterObj, {
          value: 1000000000,
          ease: "power1.inOut",
          scrollTrigger: {
            trigger: "#metric-block-1",
            start: "top 80%",
            end: "bottom 30%",
            scrub: true,
          },
          onUpdate: () => {
            counterEl.textContent = Math.floor(counterObj.value).toLocaleString('en-US');
          }
        });
      }

      // 3. Staggered vertical offset glide reveal for right column text blocks
      const textBlocks = gsap.utils.toArray('.waste-reveal');
      textBlocks.forEach((block) => {
        gsap.fromTo(block,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            ease: "power2.out",
            scrollTrigger: {
              trigger: block,
              start: "top 85%",
              end: "bottom 20%",
              toggleActions: "play none none reverse",
            }
          }
        );
      });
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section 
      ref={sectionRef}
      id="waste-realization-section"
      className="relative min-h-screen w-full bg-[#1E252B] text-light-cream border-t border-white/5"
    >
      {/* 
        Grid setup:
        Desktop: Asymmetric 2-column landscape container setup.
        Mobile: Stacked linear flow (md:grid-cols-[1fr_1.2fr]).
      */}
      <div className="layout-grid grid grid-cols-1 md:grid-cols-[1fr_1.3fr] gap-10 md:gap-24 py-16 md:py-0">
        
        {/* Left Column Panel: Sticky Anchor Container on desktop */}
        <div 
          ref={leftColRef}
          className="w-full md:h-screen flex flex-col justify-center py-6 md:py-0"
        >
          <div className="flex flex-col gap-3 max-w-md">
            <span className="text-xs font-mono text-mint tracking-[0.2em] font-semibold uppercase">
              CHAPTER 2 // STRATEGIC MISSION
            </span>
            <h2 className="display-header text-[32px] md:text-[44px] lg:text-[56px] font-bold leading-[1.10] tracking-[-0.03em] text-light-cream animate-fade-in">
              We exist to make reuse second nature for coffee lovers across India. By partnering with local cafes, we're building a seamless, circular borrow-and-return system that eliminates single-use cups entirely, keeping our oceans clean and our communities thriving.
            </h2>
            <div className="w-12 h-1 bg-mint mt-6 rounded-full" />
          </div>
        </div>

        {/* Right Column Container: Scrollable Block Array */}
        <div 
          ref={rightColRef}
          className="w-full flex flex-col gap-24 md:gap-40 py-10 md:py-48"
        >
          {/* Data Block 1 */}
          <div 
            id="metric-block-1"
            className="waste-reveal flex flex-col gap-4 p-8 rounded-2xl glass-panel border border-white/5"
          >
            <span className="text-[11px] font-mono text-mint tracking-wider font-semibold uppercase">
              METRIC SYSTEM 01
            </span>
            <h3 className="display-header text-xl md:text-2xl font-bold text-light-cream">
              ANNUAL DISPOSAL IMPACT
            </h3>
            
            {/* Custom High-Contrast Brackets around Metric */}
            <div className="flex items-center gap-1 py-4">
              <span className="text-white/20 font-mono text-2xl md:text-4xl font-light select-none">[</span>
              <span 
                id="scroll-digit-counter" 
                className="technical-figures text-2xl md:text-4xl font-black text-mint tracking-tight font-sans"
                aria-label="One Billion Single Use Disposable Cups Generated Annually Across India"
              >
                0
              </span>
              <span className="text-white/20 font-mono text-2xl md:text-4xl font-light select-none">]</span>
            </div>

            <p className="interface-text text-sm md:text-base text-white/70 leading-[1.60] max-w-xl">
              One billion paper and plastic cups are thrown away every year in India. The vast majority cannot be recycled due to complex microplastic laminate linings, building immediate toxicity inside global water tables.
            </p>
          </div>

          {/* Data Block 2 */}
          <div 
            id="metric-block-2"
            className="waste-reveal flex flex-col gap-4 p-8 rounded-2xl glass-panel border border-white/5"
          >
            <span className="text-[11px] font-mono text-gold-amber tracking-wider font-semibold uppercase">
              METRIC SYSTEM 02
            </span>
            <h3 className="display-header text-xl md:text-2xl font-bold text-light-cream">
              DEGRADATION DECAY SCALE
            </h3>
            
            {/* Custom High-Contrast Brackets around Duration */}
            <div className="flex items-center gap-1 py-4">
              <span className="text-white/20 font-mono text-2xl md:text-4xl font-light select-none">[</span>
              <span 
                className="technical-figures text-2xl md:text-4xl font-black text-gold-amber tracking-tight font-sans"
                aria-label="Takes four hundred and fifty years to decay"
              >
                450 Years
              </span>
              <span className="text-white/20 font-mono text-2xl md:text-4xl font-light select-none">]</span>
            </div>

            <p className="interface-text text-sm md:text-base text-white/70 leading-[1.60] max-w-xl">
              Without active intervention, a single plastic-coated lining requires four centuries to disintegrate. Throughout this duration, it degrades into microparticles, contaminating agriculture, marine ecosystems, and human physiology.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}

export default WasteRealization;
