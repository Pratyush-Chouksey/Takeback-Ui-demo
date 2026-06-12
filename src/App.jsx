import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Layout & Navigation Components
import Header from './components/Header';
import Footer from './components/Footer';
import BottomNav from './components/BottomNav';
import ThreeCupCanvas from './components/ThreeCupCanvas';

// 7 Page Components
import Homepage from './components/Homepage';
import Borrow from './components/Borrow';
import ReturnMap from './components/ReturnMap';
import Shop from './components/Shop';
import ImpactHUD from './components/ImpactHUD';
import B2BPortal from './components/B2BPortal';
import AccountWallet from './components/AccountWallet';

// Register GSAP ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

function App() {
  const [currentRoute, setRoute] = useState('/');
  const [springActive, setSpringActive] = useState(false);
  const [activeTab, setActiveTab] = useState('tokens');
  
  // 1. Variant Colorway State for Configurator integration
  const [activeVariant, setActiveVariant] = useState({
    name: 'Forest',
    hex: '#1A2E22',
    stroke: 'rgba(26, 46, 34, 0.45)',
    fill: 'rgba(26, 46, 34, 0.08)'
  });

  // 2. Global Canvas Motion State
  const [reducedMotion, setReducedMotion] = useState(false);

  // 3. Coordination properties ref (GSAP Animates these, WebGL reads them)
  const vesselProps = useRef({
    x: 0,            // offset as fraction of screen width (-0.5 to 0.5)
    y: 0,            // offset as fraction of screen height (-0.5 to 0.5)
    scale: 1.0,      // relative scale multiplier
    rx: 0.15,        // pitch tilt rotation
    ry: 0.8,         // yaw pivot rotation
    opacity: 1,      // opacity layer target
    userInteract: 0  // 0 = Scroll tracking, 1 = Configurator mouse tracking, 2 = Scan camera tracking
  });

  // Keep a separate ref for live mouse positions inside the configurator
  const mouseConfig = useRef({ x: 0, y: 0 });

  // 4. Global Rewards Particle System refs
  const rewardsCanvasRef = useRef(null);
  const particlesRef = useRef([]);
  const ringsRef = useRef([]);
  const isAnimatingRef = useRef(false);

  // 5. Technical figures for the Design Tokens Matrix
  const figures = [
    { label: 'Network Active Nodes', value: '142 outlets', change: '+12 new' },
    { label: 'Weekly Return Rate', value: '94.2%', change: '+0.5% rate' },
    { label: 'System Carbon Savings', value: '41,392 kg', change: '+4.2 kg today' }
  ];

  // 6. Geolocation checks and prefers-reduced-motion check
  useEffect(() => {
    const userMotionPreferenceToken = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (userMotionPreferenceToken.matches) {
      setReducedMotion(true);
    }
  }, []);

  // 7. Route Transitions & Scroll Positioning effect
  useEffect(() => {
    window.scrollTo(0, 0);

    // Coordinate WebGL cup positions based on active route
    if (currentRoute === '/') {
      vesselProps.current.opacity = 1;
      vesselProps.current.userInteract = 0;
      vesselProps.current.scale = 1.0;
      vesselProps.current.x = 0;
      vesselProps.current.y = 0;
    } else if (currentRoute === '/shop') {
      vesselProps.current.opacity = 1;
      vesselProps.current.userInteract = 1; // Align to shop configurator panel
      vesselProps.current.scale = 0.85;
    } else if (currentRoute === '/borrow') {
      vesselProps.current.opacity = 0; // Invisible until scanning initiates
      vesselProps.current.userInteract = 0;
    } else {
      // Hide WebGL cup on other routes (Impact, Return, B2B, Wallet)
      vesselProps.current.opacity = 0;
      vesselProps.current.userInteract = 0;
    }
  }, [currentRoute]);

  // 8. Custom Window Event Listeners for 3D interactions
  useEffect(() => {
    // Mouse hover updates from configurator
    const handleConfigMouse = (e) => {
      mouseConfig.current.x = e.detail.x;
      mouseConfig.current.y = e.detail.y;
    };
    window.addEventListener('configurator-mouse', handleConfigMouse);

    // Canvas mode changes triggered by Borrow scan button
    const handleCanvasModeUpdate = (e) => {
      vesselProps.current.userInteract = e.detail.mode;
      if (e.detail.mode === 2) {
        vesselProps.current.opacity = 1;
      } else if (e.detail.mode === 0 && currentRoute === '/borrow') {
        vesselProps.current.opacity = 0;
      }
    };
    window.addEventListener('canvas-mode-update', handleCanvasModeUpdate);

    return () => {
      window.removeEventListener('configurator-mouse', handleConfigMouse);
      window.removeEventListener('canvas-mode-update', handleCanvasModeUpdate);
    };
  }, [currentRoute]);

  // 9. MASTER GSAP SCROLLTIMELINE CHOREOGRAPHY
  useEffect(() => {
    // Only run scrollytelling animations on homepage
    if (currentRoute !== '/' || reducedMotion) return;

    // Stage 1 to 2: Hero exit to Environmental Waste Realization Grid
    const heroToWaste = gsap.timeline({
      scrollTrigger: {
        trigger: "#hero-section",
        start: "top top",
        end: "bottom top",
        scrub: true,
      }
    });
    heroToWaste.to(vesselProps.current, {
      x: 0.23,     // slide right to fit split column
      y: 0.08,     // sink lower
      scale: 0.72, // shrink to fit card content
      rx: 0.28,    // tilt
      ry: 2.2,     // spin
      ease: "none"
    });

    // Stage 2 to 3: Environmental Waste to Horizontal Loop Slides
    const wasteToLoop = gsap.timeline({
      scrollTrigger: {
        trigger: "#waste-realization-section",
        start: "bottom center",
        end: "bottom top",
        scrub: true,
      }
    });
    wasteToLoop.to(vesselProps.current, {
      x: -0.2,     // shift left to align with Card 1
      scale: 0.65, // shrink
      rx: 0.15,
      ry: 3.6,
      ease: "none"
    });

    // Loop Horizontal Wipes Sweep: Slides alongside cards
    const loopWipes = gsap.timeline({
      scrollTrigger: {
        trigger: "#system-loop-section",
        start: "top top",
        end: () => `+=${window.innerWidth * 2}`,
        scrub: true,
      }
    });
    loopWipes.to(vesselProps.current, {
      x: 0.2, // Drifts right as horizontal scrolling swipes cards
      ry: 5.5,
      ease: "none"
    });

    // Stage 3 to 4: Slide off Loop into Configurator viewport target
    const loopToConfig = gsap.timeline({
      scrollTrigger: {
        trigger: "#product-configurator-section",
        start: "top 80%",
        end: "top 20%",
        scrub: true,
      }
    });
    loopToConfig.to(vesselProps.current, {
      x: -0.25,     // Align left for split configurator area
      scale: 0.8,
      rx: 0.12,
      ry: 6.8,
      opacity: 1,
      ease: "none"
    });

    // Toggle interactive mouse coordination control when configurator viewport is focused
    ScrollTrigger.create({
      trigger: "#product-configurator-section",
      start: "top 50%",
      end: "bottom 50%",
      onToggle: (self) => {
        vesselProps.current.userInteract = self.isActive ? 1 : 0;
      }
    });

    // Fade out completely when scrolling down into PWADemo (Chapter 5)
    gsap.to(vesselProps.current, {
      opacity: 0,
      scrollTrigger: {
        trigger: "#pwa-workflow-section",
        start: "top 80%",
        end: "top 30%",
        scrub: true,
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [reducedMotion, currentRoute]);

  // 10. Rewards Canvas Resize setup
  useEffect(() => {
    const handleResize = () => {
      const canvas = rewardsCanvasRef.current;
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 11. Physics Particle tick loop for successful transaction cashbacks!
  const tickRewards = () => {
    const canvas = rewardsCanvasRef.current;
    if (!canvas) {
      isAnimatingRef.current = false;
      return;
    }
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update & Draw Expanding Green Rings
    const activeRings = [];
    ringsRef.current.forEach((ring) => {
      ring.r += ring.speed;
      ring.opacity = Math.max(0, 1 - (ring.r / ring.maxR));
      if (ring.opacity > 0) {
        ctx.beginPath();
        ctx.arc(ring.x, ring.y, ring.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(163, 226, 201, ${ring.opacity * 0.8})`;
        ctx.lineWidth = 4;
        ctx.stroke();
        activeRings.push(ring);
      }
    });
    ringsRef.current = activeRings;

    // Update & Draw Gold Coin Particles Cascade
    const activeParticles = [];
    particlesRef.current.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.angle += p.vAngle;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      
      // Draw shiny circular/ellipse gradient coin
      ctx.beginPath();
      ctx.ellipse(0, 0, p.size, p.size * Math.abs(Math.sin(p.angle * 2)), 0, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
      ctx.strokeStyle = '#B38B13';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();

      if (p.y < window.innerHeight + 50) {
        activeParticles.push(p);
      }
    });
    particlesRef.current = activeParticles;

    if (ringsRef.current.length > 0 || particlesRef.current.length > 0) {
      requestAnimationFrame(tickRewards);
    } else {
      isAnimatingRef.current = false;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const triggerReward = () => {
    // 1. Append expanding rings
    const newRings = [
      { x: window.innerWidth / 2, y: window.innerHeight / 2, r: 10, maxR: Math.max(window.innerWidth, window.innerHeight) * 0.6, opacity: 1, speed: 7 }
    ];
    ringsRef.current.push(...newRings);

    // 2. Append gold coin waterfall particles
    const newParticles = [];
    const colorGold = '#F5B973';
    const colorAmber = '#E5A93B';
    
    for (let i = 0; i < 55; i++) {
      newParticles.push({
        x: window.innerWidth / 2 + (Math.random() * 60 - 30),
        y: window.innerHeight * 0.4 + (Math.random() * 40 - 20),
        vx: (Math.random() - 0.5) * 11,
        vy: -Math.random() * 12 - 7,
        gravity: 0.42,
        size: Math.random() * 7 + 6,
        angle: Math.random() * Math.PI * 2,
        vAngle: (Math.random() - 0.5) * 0.25,
        color: Math.random() > 0.4 ? colorGold : colorAmber
      });
    }
    particlesRef.current.push(...newParticles);

    // Start tick loop if not running
    if (!isAnimatingRef.current) {
      isAnimatingRef.current = true;
      requestAnimationFrame(tickRewards);
    }
  };

  // Foundational Workspace for demonstrating tokens (Rendered only on homepage)
  const renderFoundationalWorkspace = () => {
    return (
      <section className="relative z-[100] bg-[#1E252B] py-24 border-t border-white/5 spring-transition">
        <div className="layout-grid">
          
          {/* Section Heading */}
          <div className="col-span-4 lg:col-span-12 mb-12 border-b border-white/10 pb-6">
            <span className="text-xs font-mono uppercase text-gold-amber tracking-wider font-semibold">
              FOUNDATIONAL MATRIX
            </span>
            <h2 className="display-header text-3xl md:text-5xl font-bold mt-2 text-light-cream">
              Design Tokens Matrix
            </h2>
            <p className="interface-text text-sm md:text-base text-white/60 mt-2">
              Inspect the visual variables, layouts, and spring parameters applied across the circular codebase.
            </p>
          </div>

          {/* Controls tabs */}
          <div className="col-span-4 lg:col-span-12 flex gap-2 mb-6 border-b border-white/5 pb-4">
            {['tokens', 'layout', 'typography'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded text-sm font-sans tracking-wide uppercase transition-all focus-visible:outline-none bg-transparent border-none cursor-pointer ${
                  activeTab === tab
                    ? 'text-mint border-b-2 border-mint font-semibold'
                    : 'text-white/40 hover:text-white/80'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* TAB 1: DESIGN TOKENS MATRIX */}
          {activeTab === 'tokens' && (
            <>
              {/* Palette */}
              <div className="col-span-4 lg:col-span-6 flex flex-col gap-4">
                <h3 className="display-header text-xl md:text-2xl font-bold text-light-cream">
                  Color Token Palette
                </h3>
                <p className="interface-text text-sm text-white/55">
                  Core palette system mapped via Tailwind utility interfaces back to root custom properties.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-deep-ink border border-white/10">
                    <div className="w-8 h-8 rounded bg-deep-ink border border-white/20 mb-2" />
                    <div className="text-xs font-mono text-white/50">--color-bg-deep-ink</div>
                    <div className="text-sm font-semibold text-light-cream">#0B0F12</div>
                  </div>
                  <div className="p-4 rounded-lg bg-muted-slate border border-white/10">
                    <div className="w-8 h-8 rounded bg-[#1E252B] mb-2" />
                    <div className="text-xs font-mono text-white/50">--color-muted-slate</div>
                    <div className="text-sm font-semibold text-light-cream">#1E252B</div>
                  </div>
                  <div className="p-4 rounded-lg bg-forest-green border border-white/10">
                    <div className="w-8 h-8 rounded bg-[#1A2E22] mb-2" />
                    <div className="text-xs font-mono text-white/50">--color-forest-green</div>
                    <div className="text-sm font-semibold text-light-cream">#1A2E22</div>
                  </div>
                  <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <div className="w-8 h-8 rounded bg-[#A3E2C9] mb-2" />
                    <div className="text-xs font-mono text-white/50">--color-mint</div>
                    <div className="text-sm font-semibold text-[#A3E2C9]">#A3E2C9</div>
                  </div>
                  <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <div className="w-8 h-8 rounded bg-[#F5B973] mb-2" />
                    <div className="text-xs font-mono text-white/50">--color-gold-amber</div>
                    <div className="text-sm font-semibold text-[#F5B973]">#F5B973</div>
                  </div>
                  <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <div className="w-8 h-8 rounded bg-[#F7F5F0] mb-2" />
                    <div className="text-xs font-mono text-white/50">--color-fg-light-cream</div>
                    <div className="text-sm font-semibold text-deep-ink bg-light-cream px-1 rounded inline-block">#F7F5F0</div>
                  </div>
                </div>
              </div>

              {/* Glassmorphism & Spring Animations */}
              <div className="col-span-4 lg:col-span-6 flex flex-col gap-4">
                <h3 className="display-header text-xl md:text-2xl font-bold text-light-cream">
                  Glassmorphism & Spring Mechanics
                </h3>
                <p className="interface-text text-sm text-white/55">
                  Components apply transparency overlay specifications paired with customized stiffness metrics.
                </p>
                <div className="glass-panel p-6 rounded-xl spring-transition hover:-translate-y-1 hover:scale-[1.02] cursor-pointer border border-white/10">
                  <h4 className="display-header text-lg font-bold text-mint mb-2">Glass Panel Class</h4>
                  <p className="interface-text text-xs text-white/70 leading-relaxed">
                    background: rgba(26, 37, 43, 0.45); backdrop-filter: blur(24px) saturate(140%); border: 1px solid rgba(255, 255, 255, 0.08);
                  </p>
                </div>

                <div 
                  onClick={() => setSpringActive(!springActive)}
                  className={`glass-panel p-6 rounded-xl cursor-pointer border spring-transition ${
                    springActive ? 'border-gold-amber scale-105 shadow-lg shadow-gold-amber/10' : 'border-white/10'
                  }`}
                >
                  <h4 className="display-header text-lg font-bold text-gold-amber mb-2">
                    Spring Settings
                  </h4>
                  <p className="interface-text text-xs text-white/70 leading-relaxed mb-4">
                    Stiffness: 95 | Damping: 14 | Mass: 1. Click to trigger animation.
                  </p>
                  <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-[#F5B973] h-full spring-transition" 
                      style={{ width: springActive ? '100%' : '15%' }}
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {/* TAB 2: VARIABLE GRID SYSTEM */}
          {activeTab === 'layout' && (
            <div className="col-span-4 lg:col-span-12 flex flex-col gap-6">
              <div>
                <h3 className="display-header text-xl md:text-2xl font-bold text-light-cream mb-2">
                  Responsive Fluid Grid Check
                </h3>
                <p className="interface-text text-sm text-white/55 max-w-xl">
                  Inspect the layout structure. In desktop (≥1024px), the layout extends up to 1440px max-width, allocating 12 columns, 24px gutters, and 80px fluid page margins. Mobile structures down to 4 columns.
                </p>
              </div>

              <div className="grid grid-cols-4 lg:grid-cols-12 gap-4 lg:gap-6 bg-white/5 p-4 rounded-lg border border-white/10">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-16 rounded bg-[#A3E2C9]/10 border border-[#A3E2C9]/20 flex items-center justify-center font-mono text-xs text-mint ${
                      i >= 4 ? 'hidden lg:flex' : 'flex'
                    }`}
                  >
                    col {i + 1}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-deep-ink rounded-lg border border-white/5">
                  <div className="text-xs text-white/45 uppercase font-semibold">Tiers Blueprint</div>
                  <div className="text-lg font-bold text-light-cream mt-1 font-mono">z-axis stack</div>
                  <ul className="text-xs text-white/60 space-y-1 mt-2 font-mono">
                    <li>Base Canvas = z-0</li>
                    <li>Content Layer = z-100</li>
                    <li>Global HUD/Nav = z-1000</li>
                    <li>3D Canvas Layer = z-3000</li>
                    <li>Modal Sheet Layer = z-5000</li>
                  </ul>
                </div>

                <div className="p-4 bg-deep-ink rounded-lg border border-white/5">
                  <div className="text-xs text-white/45 uppercase font-semibold">Desktop Grid Structure</div>
                  <div className="text-lg font-bold text-light-cream mt-1 font-mono">1440px Limit</div>
                  <ul className="text-xs text-white/60 space-y-1 mt-2 font-mono">
                    <li>Columns: 12</li>
                    <li>Margins: 80px (fluid)</li>
                    <li>Gutters: 24px</li>
                  </ul>
                </div>

                <div className="p-4 bg-deep-ink rounded-lg border border-white/5">
                  <div className="text-xs text-white/45 uppercase font-semibold">Mobile Grid Structure</div>
                  <div className="text-lg font-bold text-light-cream mt-1 font-mono">390px Viewport</div>
                  <ul className="text-xs text-white/60 space-y-1 mt-2 font-mono">
                    <li>Columns: 4</li>
                    <li>Margins: 20px</li>
                    <li>Gutters: 16px</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TYPOGRAPHY SYSTEM */}
          {activeTab === 'typography' && (
            <>
              <div className="col-span-4 lg:col-span-6 flex flex-col gap-4">
                <h3 className="display-header text-xl md:text-2xl font-bold text-light-cream">
                  Serif Display Headers
                </h3>
                <p className="interface-text text-sm text-white/55">
                  Brand headers load Serif Georgia, setting exact tracking: -0.03em and leading: 105%.
                </p>
                <div className="p-6 bg-deep-ink rounded-lg border border-white/5 space-y-4">
                  <h1 className="display-header text-4xl font-bold text-light-cream">
                    Heading Level 1
                  </h1>
                  <h2 className="display-header text-3xl font-bold text-light-cream">
                    Heading Level 2
                  </h2>
                  <h3 className="display-header text-2xl font-bold text-light-cream">
                    Heading Level 3
                  </h3>
                </div>
              </div>

              <div className="col-span-4 lg:col-span-6 flex flex-col gap-4">
                <h3 className="display-header text-xl md:text-2xl font-bold text-light-cream">
                  Functional Sans & Numbers
                </h3>
                <p className="interface-text text-sm text-white/55">
                  Inter fallback font layout, line-height 160%, with tabular figures alignment for layout safety.
                </p>
                <div className="p-6 bg-deep-ink rounded-lg border border-white/5 space-y-6">
                  <div>
                    <span className="text-xs text-mint uppercase font-semibold tracking-wider font-mono">Interface Regular</span>
                    <p className="interface-text text-sm text-white/80 leading-[1.60] mt-1">
                      This interface text demonstrates the default Geometric Grotesque Sans-Serif font settings. Perfect spacing resolves styling metrics efficiently.
                    </p>
                  </div>
                  <div>
                    <span className="text-xs text-[#F5B973] uppercase font-semibold tracking-wider font-mono">Technical Figures</span>
                    <div className="mt-2 space-y-2">
                      {figures.map((fig, idx) => (
                        <div key={idx} className="flex justify-between items-center border-b border-white/5 pb-2 last:border-0 last:pb-0">
                          <span className="text-xs text-white/60">{fig.label}</span>
                          <div className="flex gap-3 font-mono text-sm">
                            <span className="technical-figures text-light-cream font-medium">{fig.value}</span>
                            <span className={`technical-figures ${fig.change.startsWith('+') ? 'text-mint' : 'text-red-400'}`}>{fig.change}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

        </div>
      </section>
    );
  };

  return (
    <div className="relative min-h-screen bg-deep-ink text-light-cream selection:bg-mint selection:text-deep-ink">
      {/* 1. Global Noise Layer */}
      <div className="global-noise-layer" />

      {/* 2. Global Header Navigation (z-1000) */}
      <Header currentRoute={currentRoute} setRoute={setRoute} />

      {/* 3. Global WebGL 3D Cup Canvas (z-3000) */}
      <ThreeCupCanvas 
        activeVariant={activeVariant}
        currentRoute={currentRoute}
        vesselProps={vesselProps}
        mouseConfig={mouseConfig}
        reducedMotion={reducedMotion}
      />

      {/* 4. Global Payout/Scan Rewards FX Layer Canvas (z-4000) */}
      <canvas 
        ref={rewardsCanvasRef}
        id="rewards-canvas"
        className="fixed inset-0 pointer-events-none z-[4000] w-full h-full"
      />

      {/* 5. Main Routed Screen Viewports */}
      <main className="relative z-100">
        {currentRoute === '/' && <Homepage activeVariant={activeVariant} onColorwayChange={setActiveVariant} />}
        {currentRoute === '/borrow' && <Borrow triggerReward={triggerReward} />}
        {currentRoute === '/return' && <ReturnMap triggerReward={triggerReward} />}
        {currentRoute === '/shop' && <Shop activeVariant={activeVariant} onColorwayChange={setActiveVariant} />}
        {currentRoute === '/impact' && <ImpactHUD />}
        {currentRoute === '/for-cafes' && <B2BPortal />}
        {currentRoute === '/account' && <AccountWallet triggerReward={triggerReward} />}
      </main>

      {/* 6. Foundational Matrix Details (Only visible on Homepage) */}
      {currentRoute === '/' && renderFoundationalWorkspace()}

      {/* 7. Global system Footer directories (z-100) */}
      <Footer />

      {/* 8. Mobile floating bottom tab navigation (z-5000) */}
      <BottomNav currentRoute={currentRoute} setRoute={setRoute} />
    </div>
  );
}

export default App;
