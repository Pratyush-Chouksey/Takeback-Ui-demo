import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Layout & Navigation Components
import Header from './components/Header';
import Footer from './components/Footer';
import BottomNav from './components/BottomNav';

// Page Components
import Homepage from './components/Homepage';
import Borrow from './components/Borrow';
import ReturnMap from './components/ReturnMap';
import Shop from './components/Shop';
import ImpactHUD from './components/ImpactHUD';
import B2BPortal from './components/B2BPortal';
import AccountWallet from './components/AccountWallet';
import About from './components/About';
import JournalFeed from './components/JournalFeed';

// Dynamic Sub-Systems
import LoginModal from './components/LoginModal';
import CupDetails from './components/CupDetails';
import AdminDashboard from './components/AdminDashboard';

// Register GSAP ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

function App() {
  const [currentRoute, setRouteState] = useState(window.location.pathname || '/');
  const [currentUser, setCurrentUser] = useState(null);
  const [authToken, setAuthToken] = useState(localStorage.getItem('takeback_token') || null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  
  // 1. Variant Colorway State for Configurator integration
  const [activeVariant, setActiveVariant] = useState({
    name: 'Forest',
    hex: '#1A2E22',
    stroke: 'rgba(26, 46, 34, 0.45)',
    fill: 'rgba(26, 46, 34, 0.08)'
  });

  // 2. Global Canvas Motion & SKU Size State
  const [reducedMotion, setReducedMotion] = useState(false);
  const [activeSKU, setActiveSKU] = useState('12oz');

  // 4. Global Rewards Particle System refs
  const rewardsCanvasRef = useRef(null);
  const particlesRef = useRef([]);
  const ringsRef = useRef([]);
  const isAnimatingRef = useRef(false);

  const setRoute = (route) => {
    window.history.pushState({}, '', route);
    setRouteState(route);
  };

  useEffect(() => {
    const handlePopState = () => {
      setRouteState(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const fetchUserProfile = async (token) => {
    try {
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setCurrentUser(data.user);
      } else {
        localStorage.removeItem('takeback_token');
        setAuthToken(null);
        setCurrentUser(null);
      }
    } catch (err) {
      console.error("Failed to fetch user profile:", err);
    }
  };

  useEffect(() => {
    if (authToken) {
      fetchUserProfile(authToken);
    }
  }, [authToken]);

  const handleAuthSuccess = (user, token) => {
    setCurrentUser(user);
    setAuthToken(token);
  };

  const handleSignOut = () => {
    localStorage.removeItem('takeback_token');
    setAuthToken(null);
    setCurrentUser(null);
    setRoute('/');
  };

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
  }, [currentRoute]);

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

  return (
    <div className="relative min-h-screen bg-deep-ink text-light-cream selection:bg-mint selection:text-deep-ink">
      {/* 1. Global Noise Layer */}
      <div className="global-noise-layer" />

      {/* 2. Global Header Navigation (z-1000) */}
      <Header 
        currentRoute={currentRoute} 
        setRoute={setRoute} 
        currentUser={currentUser}
        onSignOut={handleSignOut}
        onLoginClick={() => setIsLoginOpen(true)}
      />

      {/* 4. Global Payout/Scan Rewards FX Layer Canvas (z-4000) */}
      <canvas 
        ref={rewardsCanvasRef}
        id="rewards-canvas"
        className="fixed inset-0 pointer-events-none z-[4000] w-full h-full"
      />

      {/* 5. Main Routed Screen Viewports */}
      <main className="relative z-[20]">
        {currentRoute === '/' && <Homepage activeVariant={activeVariant} onColorwayChange={setActiveVariant} setRoute={setRoute} />}
        {currentRoute === '/borrow' && <Borrow triggerReward={triggerReward} setRoute={setRoute} />}
        {currentRoute === '/return' && <ReturnMap triggerReward={triggerReward} />}
        {currentRoute === '/shop' && (
          <Shop 
            activeVariant={activeVariant} 
            onColorwayChange={setActiveVariant} 
            activeSKU={activeSKU} 
            setActiveSKU={setActiveSKU} 
          />
        )}
        {currentRoute === '/impact' && <ImpactHUD />}
        {currentRoute === '/for-cafes' && <B2BPortal />}
        {currentRoute === '/about' && <About />}
        {currentRoute === '/journal' && <JournalFeed />}
        {currentRoute === '/account' && (
          <AccountWallet 
            triggerReward={triggerReward} 
            authToken={authToken}
            currentUser={currentUser}
            onLoginClick={() => setIsLoginOpen(true)}
          />
        )}
        {currentRoute.startsWith('/cup/') && (
          <CupDetails 
            cupId={currentRoute.substring(5)}
            currentUser={currentUser}
            authToken={authToken}
            onLoginClick={() => setIsLoginOpen(true)}
            triggerReward={triggerReward}
            setRoute={setRoute}
          />
        )}
        {currentRoute === '/admin' && (
          <AdminDashboard 
            currentUser={currentUser}
            authToken={authToken}
            setRoute={setRoute}
          />
        )}
      </main>

      {/* 7. Global system Footer directories (z-100) */}
      <Footer setRoute={setRoute} />

      {/* 8. Mobile floating bottom tab navigation (z-5000) */}
      <BottomNav currentRoute={currentRoute} setRoute={setRoute} />

      {/* 9. Access Gateway Login Modal */}
      <LoginModal 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)} 
        onAuthSuccess={handleAuthSuccess} 
      />
    </div>
  );
}

export default App;
