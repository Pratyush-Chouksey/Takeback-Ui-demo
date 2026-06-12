import React, { useRef, useState, useEffect } from 'react';

export function MagneticButton({ children, className = '', ...props }) {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!ref.current) return;
      const { clientX, clientY } = e;
      const { left, top, width, height } = ref.current.getBoundingClientRect();
      const centerX = left + width / 2;
      const centerY = top + height / 2;
      const distanceX = clientX - centerX;
      const distanceY = clientY - centerY;
      
      const distance = Math.hypot(distanceX, distanceY);
      const activeRadius = 90; // Pull trigger radius
      const maxPull = 12; // 12px maximum magnetic pull displacement

      if (distance < activeRadius) {
        // Calculate influence factor (strongest at center, fading out to activeRadius boundary)
        const factor = (activeRadius - distance) / activeRadius;
        const pullX = (distanceX / distance) * maxPull * factor;
        const pullY = (distanceY / distance) * maxPull * factor;
        setPosition({ x: pullX, y: pullY });
      } else {
        setPosition({ x: 0, y: 0 });
      }
    };

    const handleMouseLeave = () => {
      setPosition({ x: 0, y: 0 });
    };

    const element = ref.current;
    if (element) {
      element.addEventListener('mousemove', handleMouseMove);
      element.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (element) {
        element.removeEventListener('mousemove', handleMouseMove);
        element.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  const isPulled = position.x !== 0 || position.y !== 0;

  return (
    <button
      ref={ref}
      className={`spring-transition select-none outline-none focus-visible:outline-none ${className}`}
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0) scale(${isPulled ? 1.04 : 1})`,
        // Smooth damp following cursor, snap-back via spring physics when mouse exits.
        transition: isPulled ? 'transform 0.08s ease-out' : 'transform 0.5s var(--transition-spring)',
      }}
      {...props}
    >
      {children}
    </button>
  );
}

export default MagneticButton;
