import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import staticCup from '../assets/takeback-cup-static.png';
import MagneticButton from './MagneticButton';

// Register GSAP ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

export function Hero() {
  const containerRef = useRef(null);

  // Split-text logic for staggered reveal
  const titleText = "TAKE BACK THE CUP.";
  const chars = titleText.split("").map((char, index) => (
    <span key={index} className="inline-block overflow-hidden py-1">
      <span 
        className="char-span inline-block translate-y-full"
        style={{ display: 'inline-block' }}
      >
        {char === ' ' ? '\u00A0' : char}
      </span>
    </span>
  ));

  useEffect(() => {
    // 1. Entry Stagger Animation
    // 45ms stagger interval, 1100ms overall timing (duration: 1.1s)
    gsap.fromTo('.char-span', 
      { y: '100%' },
      { 
        y: '0%', 
        duration: 1.1, 
        ease: 'power4.out', 
        stagger: 0.045, 
        delay: 0.2 
      }
    );

    // Fade in supplementary text and buttons
    gsap.fromTo('.hero-fade-in',
      { opacity: 0, y: 15 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.8, 
        ease: 'power3.out', 
        stagger: 0.15,
        delay: 0.9 
      }
    );

    // 2. GSAP ScrollTrigger Background Fade
    // Transition background color of the hero section container away from Deep Ink (#0B0F12) into Muted Slate (#1E252B) on exit.
    const bgAnimation = gsap.to(containerRef.current, {
      backgroundColor: '#1E252B',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      }
    });

    return () => {
      if (bgAnimation.scrollTrigger) {
        bgAnimation.scrollTrigger.kill();
      }
      bgAnimation.kill();
    };
  }, []);

  return (
    <section 
      ref={containerRef}
      id="hero-section"
      className="relative min-h-screen w-full flex flex-col justify-center items-center overflow-hidden bg-[#0B0F12]"
    >
      {/* Content Container (z-100) */}
      <div className="relative z-[100] layout-grid text-center flex flex-col items-center gap-6">
        <div className="col-span-4 lg:col-span-12 flex flex-col items-center gap-4 max-w-4xl mx-auto">
          
          {/* Subheader token label */}
          <span className="hero-fade-in text-xs font-mono tracking-[0.25em] uppercase text-mint font-semibold">
            CHAPTER 1: THE INCEPTION
          </span>

          {/* Primary display statement */}
          <h2 className="display-header text-[48px] md:text-[96px] leading-[1.05] tracking-[-0.03em] font-bold text-light-cream select-none text-center">
            {chars}
          </h2>

          {/* Hero Subtext */}
          <p className="hero-fade-in interface-text text-base md:text-lg text-light-cream/90 max-w-xl text-center leading-[1.60] mt-2">
            Takeback is building a fluid circular borrow-and-deposit network. Swap your single-use waste for high-fidelity smart containers and save the loop.
          </p>

          {/* Multi-button action layout */}
          <div className="hero-fade-in flex flex-col sm:flex-row gap-4 mt-6">
            <MagneticButton 
              className="px-8 py-3.5 bg-mint hover:bg-mint/95 text-deep-ink font-semibold rounded-lg text-sm tracking-wider uppercase font-sans focus-visible:outline-none"
              onClick={() => alert("Scroller navigation initiated")}
            >
              Start Borrowing
            </MagneticButton>
            <MagneticButton 
              className="px-8 py-3.5 bg-white/5 hover:bg-white/10 text-light-cream border border-white/10 font-semibold rounded-lg text-sm tracking-wider uppercase font-sans focus-visible:outline-none"
              onClick={() => alert("Redirecting to Live Impact data...")}
            >
              Explore Live Impact
            </MagneticButton>
          </div>

          {/* Mobile landing cup image mockup fallback */}
          <div className="md:hidden mt-8 w-60 h-60 flex items-center justify-center pointer-events-none select-none">
            <img 
              src={staticCup} 
              alt="Takeback smart coffee cup mockup" 
              className="w-full h-full object-contain filter drop-shadow-[0_20px_30px_rgba(0,0,0,0.35)] animate-pulse"
              style={{ animationDuration: '4s' }}
            />
          </div>

        </div>
      </div>
    </section>
  );
}

export default Hero;
