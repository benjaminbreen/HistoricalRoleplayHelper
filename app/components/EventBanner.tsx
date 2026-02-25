'use client';

import { useEffect, useState } from 'react';
import { StageEvent } from '../lib/types';

interface EventBannerProps {
  event: StageEvent | null;
  onDismiss: () => void;
}

export default function EventBanner({ event, onDismiss }: EventBannerProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!event) {
      setVisible(false);
      return;
    }
    // Animate in
    const showTimer = setTimeout(() => setVisible(true), 50);
    // Auto-dismiss after 8 seconds
    const dismissTimer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDismiss, 400); // wait for fade-out
    }, 8000);
    return () => {
      clearTimeout(showTimer);
      clearTimeout(dismissTimer);
    };
  }, [event, onDismiss]);

  if (!event) return null;

  return (
    <div
      className="fixed left-1/2 top-6 z-50 w-full max-w-lg -translate-x-1/2 transition-all duration-400"
      style={{
        opacity: visible ? 1 : 0,
        transform: `translateX(-50%) ${visible ? 'translateY(0)' : 'translateY(-20px)'}`,
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
      <div
        className="rounded-2xl p-5 backdrop-blur-xl"
        style={{
          background: 'linear-gradient(135deg, rgba(180,60,40,0.85), rgba(200,120,30,0.75))',
          border: '1px solid rgba(255,180,80,0.4)',
          boxShadow: '0 0 60px rgba(200,80,30,0.3), 0 8px 32px rgba(0,0,0,0.4)',
        }}
      >
        <div className="mb-1.5 flex items-center gap-2">
          <span
            className="rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest"
            style={{ background: 'rgba(255,255,255,0.2)', color: '#fff' }}
          >
            Breaking Event
          </span>
        </div>
        <h3
          className="heading-display text-xl font-bold"
          style={{ color: '#fff', textShadow: '0 1px 4px rgba(0,0,0,0.3)' }}
        >
          {event.text}
        </h3>
        <p className="mt-1.5 text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.9)' }}>
          {event.description}
        </p>
      </div>
    </div>
  );
}
