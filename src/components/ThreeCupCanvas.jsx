import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import staticCup from '../assets/takeback-cup-static.png';

const getRouteBgColor = (route) => {
  switch (route) {
    case '/borrow': return '#1A2E22'; // Forest Green
    case '/return': return '#1E252B'; // Slate
    case '/shop': return '#F4F3EF'; // Off-White
    case '/for-cafes': return '#F7F5F0'; // Light Cream
    case '/impact':
    case '/account':
    case '/':
    default:
      return '#0B0F12'; // Deep Ink
  }
};

export function ThreeCupCanvas({ activeVariant, currentRoute, vesselProps, mouseConfig, reducedMotion }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [useFallbackImage, setUseFallbackImage] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Hook 1: Handle mobile viewport detection dynamically
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Hook 2: Initialize WebGL and run the rendering loop
  useEffect(() => {
    if (isMobile) return;

    const isFallbackActive = reducedMotion || useFallbackImage;
    const canvas = canvasRef.current;

    let scene, renderer, camera;
    let cupGeometry, ribGeo, lidBaseGeo, lidRecessGeo, spoutGeo, debossedEmblemGeo;
    let cupMaterial, lidBaseMat, debossedEmblemMat;
    let qrTexture, cupTexture;
    let animationFrameId;
    let resizeObserver;
    let meshGroup;

    if (!isFallbackActive && canvas) {
      try {
        // Initialize WebGL Scene
        scene = new THREE.Scene();
        
        // WebGL Renderer setup with transparent background
        renderer = new THREE.WebGLRenderer({
          canvas,
          alpha: true,
          antialias: true
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        const fov = 45;
        camera = new THREE.PerspectiveCamera(fov, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
        camera.position.z = 5.8;

        // High-Fidelity Coffee Husk composite PBR material setup
        const createCompositeTexture = (baseHex) => {
          const texCanvas = document.createElement('canvas');
          texCanvas.width = 512;
          texCanvas.height = 512;
          const tctx = texCanvas.getContext('2d');
          tctx.fillStyle = baseHex;
          tctx.fillRect(0, 0, 512, 512);

          // Draw random coffee husk flecks (dark brown composite specks)
          tctx.fillStyle = 'rgba(45, 28, 12, 0.14)';
          for (let i = 0; i < 550; i++) {
            const x = Math.random() * 512;
            const y = Math.random() * 512;
            const r = Math.random() * 3.2 + 0.6;
            tctx.beginPath();
            tctx.arc(x, y, r, 0, Math.PI * 2);
            tctx.fill();
          }

          // Draw subtle noise dust flecks
          tctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
          for (let i = 0; i < 300; i++) {
            const x = Math.random() * 512;
            const y = Math.random() * 512;
            const r = Math.random() * 1.5;
            tctx.beginPath();
            tctx.arc(x, y, r, 0, Math.PI * 2);
            tctx.fill();
          }

          const texture = new THREE.CanvasTexture(texCanvas);
          texture.wrapS = THREE.RepeatWrapping;
          texture.wrapT = THREE.RepeatWrapping;
          return texture;
        };

        cupTexture = createCompositeTexture(activeVariant ? activeVariant.hex : '#1A2E22');

        cupMaterial = new THREE.MeshPhysicalMaterial({
          map: cupTexture,
          roughness: 0.72,      // Matte finish with tactile earthy scattering
          metalness: 0.02,
          transmission: 0.15,   // Warm organic subsurface glow
          thickness: 1.2,
          clearcoat: 0.01
        });

        // Cafe Cup Architecture (Tapered Body + Travel Lid)
        meshGroup = new THREE.Group();

        // Main Tapered Cylinder body (Huskee/KeepCup inspired silhouette)
        cupGeometry = new THREE.CylinderGeometry(0.85, 0.65, 1.8, 36, 1, false);
        const cupMesh = new THREE.Mesh(cupGeometry, cupMaterial);
        cupMesh.position.y = -0.1;
        meshGroup.add(cupMesh);

        // Premium matching press-fit travel lid
        const lidGroup = new THREE.Group();
        lidBaseMat = new THREE.MeshPhysicalMaterial({
          color: '#26292b', // Dark matte slate charcoal travel lid
          roughness: 0.8,
          metalness: 0.1,
          clearcoat: 0.02
        });

        // Lid base ring
        lidBaseGeo = new THREE.CylinderGeometry(0.87, 0.85, 0.14, 36);
        const lidBase = new THREE.Mesh(lidBaseGeo, lidBaseMat);
        lidBase.position.y = 0.85;
        lidGroup.add(lidBase);

        // Inner cap center recess (Nose indentation)
        lidRecessGeo = new THREE.CylinderGeometry(0.81, 0.81, 0.05, 36);
        const lidRecess = new THREE.Mesh(lidRecessGeo, lidBaseMat);
        lidRecess.position.y = 0.88;
        lidGroup.add(lidRecess);

        // Spout protrusion
        spoutGeo = new THREE.BoxGeometry(0.12, 0.06, 0.12);
        const spout = new THREE.Mesh(spoutGeo, lidBaseMat);
        spout.position.set(0, 0.92, 0.8);
        lidGroup.add(spout);

        meshGroup.add(lidGroup);

        // Circular Debossed Emblem hosting QR matrix code (Like a manufacturer's stamp)
        const createQRCanvas = () => {
          const qrCanvas = document.createElement('canvas');
          qrCanvas.width = 128;
          qrCanvas.height = 128;
          const qctx = qrCanvas.getContext('2d');
          qctx.fillStyle = '#F7F5F0'; // light cream background
          qctx.fillRect(0, 0, 128, 128);
          qctx.fillStyle = '#0B0F12'; // dark blocks

          const drawMarker = (x, y) => {
            qctx.fillRect(x, y, 16, 16);
            qctx.fillStyle = '#F7F5F0';
            qctx.fillRect(x + 3, y + 3, 10, 10);
            qctx.fillStyle = '#0B0F12';
            qctx.fillRect(x + 5, y + 5, 6, 6);
          };

          drawMarker(8, 8);
          drawMarker(104, 8);
          drawMarker(8, 104);

          for (let px = 8; px < 120; px += 4) {
            for (let py = 8; py < 120; py += 4) {
              if ((px < 28 && py < 28) || (px > 96 && py < 28) || (px < 28 && py > 96)) continue;
              if (Math.random() > 0.45) {
                qctx.fillRect(px, py, 3, 3);
              }
            }
          }
          return qrCanvas;
        };

        qrTexture = new THREE.CanvasTexture(createQRCanvas());
        
        // Circular debossed emblem mesh (Placed in center of cup body)
        debossedEmblemGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.02, 32);
        debossedEmblemMat = new THREE.MeshStandardMaterial({
          map: qrTexture,
          roughness: 0.85,
          metalness: 0.05
        });
        
        const qrEmblemMesh = new THREE.Mesh(debossedEmblemGeo, debossedEmblemMat);
        qrEmblemMesh.position.set(0, -0.05, 0.765);
        qrEmblemMesh.rotation.x = Math.PI / 2 + 0.055; // align with tapered body angle
        meshGroup.add(qrEmblemMesh);

        scene.add(meshGroup);

        // Dynamic Three-Point Studio Lighting System
        const keyLight = new THREE.DirectionalLight(0xfff3e0, 1.4); // warm directional key light
        keyLight.position.set(5, 5, 4);
        scene.add(keyLight);

        const fillLight = new THREE.DirectionalLight(0xe0f2f1, 0.7); // cool soft fill light
        fillLight.position.set(-5, 2, 2);
        scene.add(fillLight);

        const rimLight = new THREE.DirectionalLight(0xffffff, 2.2); // high-contrast rim light from behind
        rimLight.position.set(0, 3, -6);
        scene.add(rimLight);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.25);
        scene.add(ambientLight);

        const pointBacklight = new THREE.PointLight(0xa3e2c9, 0.8, 10);
        pointBacklight.position.set(0, 0.5, -2.5);
        scene.add(pointBacklight);
      } catch (err) {
        console.warn("WebGL initialization failed in ThreeCupCanvas:", err);
        setUseFallbackImage(true);
        return;
      }
    }

    // Spring Physics Tracking Coordinates & State Variables
    const stiffness = 45;
    const damping = 16;
    const mass = 1.0;

    let currentLeft = 32.5;
    let velLeft = 0;
    
    let currentTop = 15;
    let velTop = 0;

    // Desktop scale target scaled down by an additional 30% globally (targetScale: 0.45)
    let currentScale = 0.45;
    let velScale = 0;

    let currentOpacity = 1;
    let velOpacity = 0;

    let currentRx = 0.15;
    let velRx = 0;

    let currentRy = 0.8;
    let velRy = 0;

    let lastTime = performance.now();

    // Render Tick Loop with spring physics coordinates mapping
    const render = (time) => {
      let dt = (time - lastTime) / 1000;
      if (dt > 0.1) dt = 0.1;
      lastTime = time;

      let targetLeft = 32.5;
      let targetTop = 15;
      let targetScale = 0.45; // 30% scale-down target to clear headings
      let targetOpacity = vesselProps.current ? vesselProps.current.opacity : 1;
      let targetRx = vesselProps.current ? vesselProps.current.rx : 0.15;
      let targetRy = vesselProps.current ? vesselProps.current.ry : 0.8;

      // Update base composite texture map dynamically
      if (activeVariant && cupMaterial && !isFallbackActive) {
        cupMaterial.color.set(activeVariant.hex);
      }

      // Desktop layout coordinates mappings
      if (currentRoute === '/shop') {
        targetLeft = 60; // Right side panel (clears left text container by > 100px)
        targetTop = 15;
        targetScale = 0.46;
      } else if (currentRoute === '/borrow') {
        targetLeft = 60; // Right side camera phone viewport
        targetTop = 10;
        targetScale = 0.42;
      } else if (currentRoute === '/return') {
        targetLeft = 60;
        targetTop = 15;
        targetScale = 0.42;
      } else {
        // Homepage scrollytelling path
        const vx = vesselProps.current ? vesselProps.current.x : 0;
        if (Math.abs(vx) < 0.05) {
          // Hero section - centered, shifted lower (top 45vh) to clear hero text by > 100px
          targetLeft = 32.5;
          targetTop = 45;
          targetScale = 0.48;
        } else if (vx > 0.05) {
          // Right-aligned side panels - clears left text container
          targetLeft = 60;
          targetTop = 12;
          targetScale = 0.45;
        } else {
          // Left-aligned side panels - clears right text container
          targetLeft = 8;
          targetTop = 12;
          targetScale = 0.45;
        }
      }

      // Rotate / mouse interact overrides
      if (vesselProps.current && vesselProps.current.userInteract === 1) {
        // Configurator cursor tracking
        targetRx = mouseConfig.current ? mouseConfig.current.y * 0.4 : 0;
        targetRy = mouseConfig.current ? mouseConfig.current.x * 0.8 : 0;
      } else if (vesselProps.current) {
        // Ambient spin
        vesselProps.current.ry += 0.003;
        targetRy = vesselProps.current.ry;
      }

      // Apply Spring Physics Equations
      const stepSpring = (current, target, vel, dt) => {
        const force = -stiffness * (current - target) - damping * vel;
        const accel = force / mass;
        const nextVel = vel + accel * dt;
        const nextVal = current + nextVel * dt;
        return { val: nextVal, vel: nextVel };
      };

      const resLeft = stepSpring(currentLeft, targetLeft, velLeft, dt);
      currentLeft = resLeft.val;
      velLeft = resLeft.vel;

      const resTop = stepSpring(currentTop, targetTop, velTop, dt);
      currentTop = resTop.val;
      velTop = resTop.vel;

      const resScale = stepSpring(currentScale, targetScale, velScale, dt);
      currentScale = resScale.val;
      velScale = resScale.vel;

      const resOpacity = stepSpring(currentOpacity, targetOpacity, velOpacity, dt);
      currentOpacity = resOpacity.val;
      velOpacity = resOpacity.vel;

      const resRx = stepSpring(currentRx, targetRx, velRx, dt);
      currentRx = resRx.val;
      velRx = resRx.vel;

      const resRy = stepSpring(currentRy, targetRy, velRy, dt);
      currentRy = resRy.val;
      velRy = resRy.vel;

      // Apply transforms & CSS hardware acceleration to the layout container bounds
      if (containerRef.current) {
        containerRef.current.style.width = '35vw';
        containerRef.current.style.height = '80vh';
        containerRef.current.style.transform = `translate3d(${currentLeft}vw, ${currentTop}vh, 0)`;
        containerRef.current.style.opacity = currentOpacity;
      }

      // Apply mesh scale and rotation
      if (meshGroup && !isFallbackActive) {
        meshGroup.scale.setScalar(currentScale * 1.55);
        meshGroup.rotation.x = currentRx;
        meshGroup.rotation.y = currentRy;
      }

      if (renderer && scene && camera && !isFallbackActive) {
        renderer.render(scene, camera);
      }
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    // ResizeObserver to dynamically sync WebGL sizes with wrapper bounds
    if (!isFallbackActive && renderer && camera && canvas) {
      resizeObserver = new ResizeObserver((entries) => {
        for (let entry of entries) {
          const { width, height } = entry.contentRect;
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
          renderer.setSize(width, height);
        }
      });
      resizeObserver.observe(canvas);
    }

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (resizeObserver) resizeObserver.disconnect();
      if (cupGeometry) cupGeometry.dispose();
      if (lidBaseGeo) lidBaseGeo.dispose();
      if (lidRecessGeo) lidRecessGeo.dispose();
      if (spoutGeo) spoutGeo.dispose();
      if (debossedEmblemGeo) debossedEmblemGeo.dispose();
      
      if (cupMaterial) cupMaterial.dispose();
      if (lidBaseMat) lidBaseMat.dispose();
      if (debossedEmblemMat) debossedEmblemMat.dispose();
      
      if (qrTexture) qrTexture.dispose();
      if (cupTexture) cupTexture.dispose();
      
      if (renderer) renderer.dispose();
    };
  }, [activeVariant, currentRoute, vesselProps, mouseConfig, reducedMotion, isMobile, useFallbackImage]);

  // Early conditional return layouts placed strictly at the bottom (complying with rules of hooks)
  if (isMobile) {
    return null;
  }

  const isFallbackActive = reducedMotion || useFallbackImage;

  return (
    <div 
      ref={containerRef}
      id={isFallbackActive ? "takeback-cup-canvas-fallback" : "takeback-cup-canvas-container"}
      className="fixed z-[3000] pointer-events-none will-change-transform flex items-center justify-center transition-all duration-[600ms] ease-out"
      style={{
        transform: 'translate3d(32.5vw, 15vh, 0)',
        willChange: 'transform',
        width: '35vw',
        height: '80vh',
        top: 0,
        left: 0,
        backgroundColor: 'transparent',
        opacity: 1
      }}
    >
      {isFallbackActive ? (
        <img 
          src={staticCup} 
          alt="Takeback Insulated Smart Vessel" 
          className="w-full h-full object-contain filter drop-shadow-[0_24px_36px_rgba(0,0,0,0.35)]"
        />
      ) : (
        <canvas 
          ref={canvasRef}
          id="takeback-cup-canvas"
          className="w-full h-full"
        />
      )}
    </div>
  );
}

export default ThreeCupCanvas;
