'use client';

import { Scenario, CharacterSheet } from '../lib/types';
import CharacterReviewGrid from './CharacterReviewGrid';

interface CastLobbyScreenProps {
  scenario: Scenario;
  cast: CharacterSheet[];
  onStart: () => void;
  onBack: () => void;
}

export default function CastLobbyScreen({ scenario, cast, onStart, onBack }: CastLobbyScreenProps) {
  return (
    <div className="noise flex min-h-screen flex-col items-center justify-center p-8">
      {/* Header */}
      <div className="text-center mb-8 max-w-3xl">
        <h1
          className="heading-display text-5xl font-bold mb-3"
          style={{ color: 'var(--accent)', textShadow: '0 2px 12px rgba(212,160,60,0.2)' }}
        >
          {scenario.title}
        </h1>
        <p className="text-xl" style={{ color: 'var(--text-secondary)' }}>
          {scenario.setting}
        </p>
        <p
          className="heading-display mt-4 text-2xl font-semibold"
          style={{ color: 'var(--text-primary)' }}
        >
          {scenario.centralQuestion}
        </p>
      </div>

      {/* Character Grid */}
      <div className="w-full max-w-5xl mb-8">
        <CharacterReviewGrid
          cast={cast}
          onUpdate={() => {}}
          onRemove={() => {}}
          mode="lobby"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="rounded-xl px-6 py-3 text-base font-medium transition-all hover:scale-[1.02]"
          style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--text-secondary)' }}
        >
          &larr; Back
        </button>
        <button
          onClick={onStart}
          className="heading-display rounded-2xl px-12 py-5 text-3xl font-bold transition-all hover:scale-[1.03]"
          style={{
            background: 'linear-gradient(135deg, rgba(212,160,60,0.3), rgba(180,120,40,0.15))',
            color: 'var(--accent)',
            border: '1px solid rgba(212,160,60,0.3)',
            boxShadow: '0 0 60px rgba(212,160,60,0.1)',
          }}
        >
          Begin Debate
        </button>
      </div>
    </div>
  );
}
