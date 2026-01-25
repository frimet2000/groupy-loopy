// @ts-nocheck
import React from 'react';
import { motion } from 'framer-motion';

export default function RopeOverlay({ containerRef, days = [], linkedDaysPairs = [], cardRefs, isRTL = false }) {
  const [paths, setPaths] = React.useState([]);
  const [isSwinging, setIsSwinging] = React.useState(false);

  const computePaths = React.useCallback(() => {
    const container = containerRef?.current;
    if (!container) return setPaths([]);
    const crect = container.getBoundingClientRect();

    const getElByDayNumber = (dayNumber) => {
      const d = days.find((x) => x.day_number === dayNumber);
      if (!d) return null;
      return cardRefs?.current?.[d.id] || null;
    };

    const makePath = (x1, y1, x2, y2) => {
      // Create a sagging rope using a quadratic curve
      const midX = (x1 + x2) / 2;
      const dx = Math.abs(x2 - x1);
      const dy = Math.abs(y2 - y1);
      const dist = Math.hypot(dx, dy);
      const sag = Math.max(12, Math.min(40, dist / 6));
      const ctrlY = Math.max(y1, y2) + sag;
      return `M ${x1} ${y1} Q ${midX} ${ctrlY} ${x2} ${y2}`;
    };

    const newPaths = [];
    linkedDaysPairs.forEach((pair, idx) => {
      const [aNum, bNum] = Array.isArray(pair) ? pair : [pair.day_id_1, pair.day_id_2];
      const elA = getElByDayNumber(aNum);
      const elB = getElByDayNumber(bNum);
      if (!elA || !elB) return;

      const rA = elA.getBoundingClientRect();
      const rB = elB.getBoundingClientRect();

      // Anchor near top-center of each card
      const x1 = rA.left - crect.left + rA.width / 2;
      const y1 = rA.top - crect.top + 10; // 10px from top
      const x2 = rB.left - crect.left + rB.width / 2;
      const y2 = rB.top - crect.top + 10;

      newPaths.push({ id: `${aNum}-${bNum}-${idx}`, d: makePath(x1, y1, x2, y2) });
    });

    setPaths(newPaths);
  }, [containerRef, days, linkedDaysPairs, cardRefs]);

  React.useEffect(() => {
    computePaths();
    const onResize = () => computePaths();
    window.addEventListener('resize', onResize);
    const ro = new ResizeObserver(() => computePaths());
    if (containerRef?.current) ro.observe(containerRef.current);
    return () => {
      window.removeEventListener('resize', onResize);
      ro.disconnect();
    };
  }, [computePaths]);

  React.useEffect(() => {
    let timeout;
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsSwinging(true);
          clearTimeout(timeout);
          timeout = setTimeout(() => setIsSwinging(false), 900);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      clearTimeout(timeout);
    };
  }, []);

  const containerWidth = containerRef?.current?.clientWidth || 0;
  const containerHeight = containerRef?.current?.clientHeight || 0;

  if (!paths.length || containerWidth === 0 || containerHeight === 0) return null;

  return (
    <motion.svg
      className="pointer-events-none absolute inset-0 z-10"
      width="100%"
      height="100%"
      viewBox={`0 0 ${containerWidth} ${containerHeight}`}
      preserveAspectRatio="none"
      animate={isSwinging ? { rotate: [0, 1.2, -1.2, 0] } : { rotate: 0 }}
      transition={{ duration: 0.9, ease: 'easeInOut' }}
      style={{ transformOrigin: '50% 0%' }}
    >
      {paths.map((p) => (
        <path
          key={p.id}
          d={p.d}
          fill="none"
          stroke="#8B5E3C" // rope color
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ filter: 'drop-shadow(0 1px 0 rgba(0,0,0,0.25))' }}
        />
      ))}
      {/* Optional: small knots pattern along the rope */}
      {paths.map((p, i) => (
        <path
          key={`${p.id}-dashes`}
          d={p.d}
          fill="none"
          stroke="#6B4423"
          strokeWidth={1}
          strokeDasharray="4 6"
          strokeLinecap="round"
          opacity={0.4}
        />
      ))}
    </motion.svg>
  );
}