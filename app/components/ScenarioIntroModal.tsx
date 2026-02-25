'use client';

import { useEffect, useCallback } from 'react';
import { Scenario } from '../lib/types';

interface ScenarioIntroModalProps {
  scenario: Scenario;
  onDismiss: () => void;
}

export default function ScenarioIntroModal({ scenario, onDismiss }: ScenarioIntroModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onDismiss();
      }
    },
    [onDismiss]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const bgImage = scenario.introBannerImage || scenario.backgroundImage;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label={`${scenario.title} introduction`}
    >
      {/* Background layer */}
      {bgImage ? (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${bgImage})` }}
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(180deg, rgba(15,17,23,0.88) 0%, rgba(15,17,23,0.72) 40%, rgba(15,17,23,0.78) 70%, rgba(15,17,23,0.95) 100%)',
            }}
          />
        </div>
      ) : (
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at 50% 30%, rgba(212,160,60,0.08) 0%, rgba(15,17,23,1) 70%)',
          }}
        />
      )}

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center px-8 py-16 max-w-3xl mx-auto text-center">
        {/* Category badge */}
        {scenario.category && (
          <span
            className="animate-cinematic rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest mb-6"
            style={{
              background: 'rgba(212,160,60,0.12)',
              color: '#d4a03c',
              border: '1px solid rgba(212,160,60,0.2)',
              animationDelay: '0.1s',
            }}
          >
            {scenario.category}
          </span>
        )}

        {/* Title */}
        <h1
          className="heading-display animate-cinematic text-5xl md:text-6xl font-bold mb-3"
          style={{
            color: '#d4a03c',
            textShadow: '0 2px 20px rgba(212,160,60,0.25)',
            animationDelay: '0.2s',
          }}
        >
          {scenario.title}
        </h1>

        {/* Setting */}
        <p
          className="animate-cinematic text-xl italic mb-8"
          style={{
            color: 'rgba(240, 230, 211, 0.55)',
            animationDelay: '0.35s',
          }}
        >
          {scenario.setting}
        </p>

        {/* Gold divider */}
        <div
          className="animate-cinematic w-24 h-px mb-10"
          style={{
            background: 'linear-gradient(90deg, transparent, #d4a03c, transparent)',
            animationDelay: '0.45s',
          }}
        />

        {/* Narrative text */}
        <p
          className="animate-narrative text-xl md:text-2xl leading-relaxed mb-10"
          style={{
            color: '#f0e6d3',
            fontFamily: 'var(--font-display), Georgia, serif',
            lineHeight: '1.7',
            animationDelay: '0.6s',
          }}
        >
          {scenario.introNarrative}
        </p>

        {/* Central question callout */}
        <div
          className="animate-narrative rounded-2xl px-8 py-5 mb-12 max-w-2xl"
          style={{
            background: 'rgba(212,160,60,0.06)',
            border: '1px solid rgba(212,160,60,0.15)',
            animationDelay: '0.9s',
          }}
        >
          <p
            className="heading-display text-xl md:text-2xl font-semibold"
            style={{ color: '#d4a03c' }}
          >
            {scenario.centralQuestion}
          </p>
        </div>

        {/* Begin button */}
        <button
          onClick={onDismiss}
          className="animate-narrative heading-display rounded-2xl px-12 py-5 text-3xl font-bold transition-all hover:scale-[1.03] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 focus:ring-offset-[var(--background)]"
          style={{
            background: 'linear-gradient(135deg, rgba(212,160,60,0.3), rgba(180,120,40,0.15))',
            color: '#d4a03c',
            border: '1px solid rgba(212,160,60,0.3)',
            boxShadow: '0 0 60px rgba(212,160,60,0.1)',
            animationDelay: '1.1s',
          }}
          autoFocus
        >
          Begin
        </button>
      </div>
    </div>
  );
}
