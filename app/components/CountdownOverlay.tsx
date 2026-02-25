'use client';

import { useEffect, useState } from 'react';

interface CountdownOverlayProps {
  seconds: number;
  running: boolean;
}

export default function CountdownOverlay({ seconds, running }: CountdownOverlayProps) {
  const [showStop, setShowStop] = useState(false);

  // Flash "STOP" for 2 seconds when timer hits 0
  useEffect(() => {
    if (seconds <= 0 && running) {
      setShowStop(true);
      const timeout = setTimeout(() => setShowStop(false), 2500);
      return () => clearTimeout(timeout);
    }
    setShowStop(false);
  }, [seconds <= 0 && running]); // eslint-disable-line react-hooks/exhaustive-deps

  // STOP flash
  if (showStop) {
    return (
      <div
        className="fixed right-8 top-24 z-40 flex items-center justify-center rounded-3xl"
        style={{
          width: '280px',
          height: '180px',
          background: 'rgba(239,68,68,0.2)',
          border: '2px solid rgba(239,68,68,0.5)',
          boxShadow: '0 0 80px rgba(239,68,68,0.3), 0 0 160px rgba(239,68,68,0.1)',
          backdropFilter: 'blur(12px)',
          animation: 'pulse 0.5s ease-in-out infinite',
        }}
      >
        <span
          className="heading-display font-bold"
          style={{
            fontSize: '72px',
            color: '#f87171',
            textShadow: '0 0 30px rgba(239,68,68,0.6)',
          }}
        >
          STOP
        </span>
      </div>
    );
  }

  // Don't show if not running or more than 30 seconds left
  if (!running || seconds > 30 || seconds <= 0) return null;

  // Scale thresholds
  let size: number;
  let fontSize: number;
  let glowIntensity: number;
  let borderColor: string;
  let bgColor: string;

  if (seconds <= 10) {
    size = 260;
    fontSize = 96;
    glowIntensity = 0.4;
    borderColor = 'rgba(239,68,68,0.6)';
    bgColor = 'rgba(239,68,68,0.12)';
  } else if (seconds <= 20) {
    size = 200;
    fontSize = 72;
    glowIntensity = 0.2;
    borderColor = 'rgba(234,179,8,0.5)';
    bgColor = 'rgba(234,179,8,0.08)';
  } else {
    size = 150;
    fontSize = 52;
    glowIntensity = 0.1;
    borderColor = 'rgba(212,160,60,0.3)';
    bgColor = 'rgba(212,160,60,0.06)';
  }

  const textColor = seconds <= 10 ? '#f87171' : seconds <= 20 ? '#eab308' : 'var(--accent)';

  return (
    <div
      className="fixed right-8 top-24 z-40 flex items-center justify-center rounded-3xl transition-all duration-500"
      style={{
        width: `${size}px`,
        height: `${Math.round(size * 0.65)}px`,
        background: bgColor,
        border: `2px solid ${borderColor}`,
        boxShadow: `0 0 ${Math.round(glowIntensity * 200)}px rgba(239,68,68,${glowIntensity})`,
        backdropFilter: 'blur(12px)',
      }}
    >
      <span
        className="heading-display font-bold tabular-nums transition-all duration-300"
        style={{
          fontSize: `${fontSize}px`,
          color: textColor,
          textShadow: seconds <= 10
            ? '0 0 20px rgba(239,68,68,0.5)'
            : seconds <= 20
              ? '0 0 15px rgba(234,179,8,0.3)'
              : 'none',
          lineHeight: 1,
        }}
      >
        {seconds}
      </span>
    </div>
  );
}
