import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

export function SystemLoop() {
  const containerRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;

    if (!container || !track) return;

    let ctx = gsap.context(() => {
      let mm = gsap.matchMedia();

      // Desktop layout: Pin container and slide track horizontally
      mm.add("(min-width: 769px)", () => {
        // Horizontal Translation Wipes
        gsap.to(track, {
          x: () => -(track.scrollWidth - window.innerWidth),
          ease: "none",
          scrollTrigger: {
            trigger: container,
            pin: true,
            scrub: true,
            start: "top top",
            end: () => `+=${track.scrollWidth - window.innerWidth}`,
          }
        });

        // Path Accent width updates
        gsap.to("#loop-progress-accent", {
          width: "100%",
          ease: "none",
          scrollTrigger: {
            trigger: container,
            scrub: true,
            start: "top top",
            end: () => `+=${track.scrollWidth - window.innerWidth}`,
          }
        });
      });
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, []);

  const cards = [
    {
      index: '01',
      step: 'Step 01: Borrow (Scan Base QR Code)',
      description: "Find a participating café, scan the cup's QR code at any partnered café to instantly check it out.",
      feature: (
        <div className="mt-6 p-4 rounded-lg bg-black/5 border border-black/10 flex flex-col items-center gap-3">
          {/* How It Works Icon 1: QR scan icon (assets/icon_qr_scan.png) */}
          <div className="w-20 h-20 bg-black/10 border border-dashed border-black/30 rounded flex items-center justify-center relative overflow-hidden">
            {/* Visual QR Simulator */}
            <div className="absolute inset-2 border-2 border-black/50 rounded flex flex-wrap p-1">
              <div className="w-3 h-3 bg-black/80 m-0.5" />
              <div className="w-3 h-3 bg-black/80 m-0.5 ml-auto" />
              <div className="w-3 h-3 bg-black/80 m-0.5 mt-auto" />
              <div className="w-4 h-4 border border-black/50 m-0.5 ml-auto mt-auto flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-mint" />
              </div>
            </div>
            {/* Green Scanning Vector line */}
            <div className="absolute left-0 w-full h-0.5 bg-mint shadow-[0_0_8px_#A3E2C9] animate-bounce top-1/2" />
          </div>
          <span className="text-[10px] font-mono text-black/60 uppercase font-semibold">
            [ SCAN TO INITIATE LOOP ]
          </span>
        </div>
      )
    },
    {
      index: '02',
      step: 'Step 02: Use (Insulated Husk Vessel)',
      description: "Enjoy your hot or cold beverages in our insulated husk composite vessel.",
      feature: (
        <div className="mt-6 p-4 rounded-lg bg-black/5 border border-black/10 flex flex-col gap-2 font-mono text-xs">
          {/* How It Works Icon 2: Cup icon (assets/icon_cup.png) */}
          {/* How It Works Icon 3: Café icon (assets/icon_cafe.png) */}
          <div className="flex justify-between border-b border-black/10 pb-1.5">
            <span className="text-black/50">THERMAL LOCK:</span>
            <span className="font-semibold text-black/95">Double-wall structural lock thermal shield</span>
          </div>
          <div className="flex justify-between border-b border-black/10 pb-1.5">
            <span className="text-black/50">INSULATION:</span>
            <span className="font-semibold text-black/95">4 Hours Hot / Cold</span>
          </div>
          <div className="flex justify-between">
            <span className="text-black/50">DESIGN:</span>
            <span className="font-semibold text-black/95">Fluted Heat Ridges</span>
          </div>
        </div>
      )
    },
    {
      index: '03',
      step: 'Step 03: Return (Drop Bin Node & Earn ₹15 Cashback)',
      description: "Once finished, return the empty cup to any partnered café drop point in our network. A staff member or scanner registers the return, instantly refunding your deposit to your digital wallet.",
      feature: (
        <div className="mt-6 p-4 rounded-lg bg-[#A3E2C9]/10 border border-[#A3E2C9]/40 flex flex-col items-center gap-2">
          {/* How It Works Icon 4: Cashback coin icon (assets/icon_cashback_coin.png) */}
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-mint shadow-[0_0_8px_rgba(163,226,201,0.5)] animate-pulse" />
            <span className="text-sm font-bold text-black font-sans">Cashback Earned</span>
          </div>
          <div className="text-xl font-bold font-mono text-[#1A2E22] technical-figures">
            + ₹15
          </div>
          <span className="text-[9px] font-mono text-black/60 uppercase">
            [ INSTANT UPI CREDITED ]
          </span>
        </div>
      )
    }
  ];

  return (
    <section 
      ref={containerRef}
      id="system-loop-section"
      className="relative min-h-screen md:h-screen flex flex-col justify-between overflow-hidden bg-[#F4F3EF] text-[#0B0F12] border-t border-black/5"
    >
      {/* Persistent Horizontal Progress Track Vector Line - Desktop Only */}
      <div className="absolute top-44 left-[15%] right-[15%] h-0.5 bg-black/10 z-10 hidden md:block rounded-full">
        {/* Dynamic Green Mask Accent */}
        <div 
          id="loop-progress-accent"
          className="h-full bg-mint shadow-[0_0_6px_rgba(163,226,201,0.8)]"
          style={{ width: '0%' }}
        />
      </div>

      {/* Title block */}
      <div className="layout-grid pt-16 md:pt-28 pb-4">
        <div className="col-span-4 lg:col-span-12 flex flex-col gap-2">
          <span className="text-xs font-mono tracking-[0.2em] text-[#1a2e22]/70 uppercase font-semibold">
            CHAPTER 3 // HOW IT WORKS
          </span>
          <h2 className="display-header text-3xl md:text-5xl font-black text-[#0B0F12]">
            THE CIRCULAR PLATFORM LOOP
          </h2>
        </div>
      </div>

      {/* 
        Horizontal Flex Track. 
        Desktop: flex-row no-wrap with GSAP scrolling.
        Mobile: Vertical stacking flex column layout.
      */}
      <div 
        ref={trackRef}
        className="flex flex-col md:flex-row flex-nowrap md:w-[300vw] h-auto md:flex-1 items-stretch md:items-center relative"
      >
        {cards.map((card, idx) => (
          <div 
            key={idx}
            className="w-full md:w-screen flex-shrink-0 flex items-center justify-center p-5 md:p-0"
          >
            {/* Lightweight Minimalist Segment Card */}
            <div 
              tabIndex={0}
              className="w-full max-w-md p-8 md:p-10 rounded-2xl border border-black/5 bg-[#ffffff]/60 backdrop-blur-md transition-all duration-300 hover:border-mint hover:shadow-lg focus:border-mint focus:bg-[#ffffff]/90 focus-visible:outline-none"
            >
              {/* Card Index Header */}
              <div className="flex justify-between items-baseline mb-6 border-b border-black/5 pb-4">
                <span className="technical-figures text-xl md:text-3xl font-black font-sans text-mint">
                  {card.index}
                </span>
                <span className="text-xs font-mono text-black/50 font-semibold tracking-wider">
                  {card.step}
                </span>
              </div>

              {/* Card Body */}
              <p className="interface-text text-sm md:text-base text-black/80 leading-[1.60]">
                {card.description}
              </p>

              {/* Visual Interactive Feature Block */}
              {card.feature}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default SystemLoop;
