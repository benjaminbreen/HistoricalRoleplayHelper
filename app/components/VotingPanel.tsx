'use client';

import { VotingOption } from '../lib/types';

interface VotingPanelProps {
  centralQuestion: string;
  options: VotingOption[];
  onUpdateVotes: (optionId: string, votes: number) => void;
}

const barColors = [
  'rgba(212, 160, 60, 0.8)',
  'rgba(168, 130, 60, 0.7)',
  'rgba(140, 110, 70, 0.65)',
  'rgba(120, 100, 80, 0.6)',
];

export default function VotingPanel({
  centralQuestion,
  options,
  onUpdateVotes,
}: VotingPanelProps) {
  const totalVotes = options.reduce((sum, o) => sum + o.votes, 0);
  const maxVotes = Math.max(...options.map((o) => o.votes), 1);

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <h2
        className="heading-display text-center text-3xl font-bold"
        style={{ color: 'var(--accent)' }}
      >
        {centralQuestion}
      </h2>

      <div className="space-y-6">
        {options.map((option, i) => {
          const pct = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
          return (
            <div key={option.id} className="glass rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="heading-display text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {option.label}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onUpdateVotes(option.id, Math.max(0, option.votes - 1))}
                    className="flex h-10 w-10 items-center justify-center rounded-lg text-lg font-bold transition-all hover:scale-105"
                    style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--text-secondary)' }}
                  >
                    −
                  </button>
                  <span
                    className="w-14 text-center font-mono text-3xl font-bold tabular-nums"
                    style={{ color: 'var(--accent)' }}
                  >
                    {option.votes}
                  </span>
                  <button
                    onClick={() => onUpdateVotes(option.id, option.votes + 1)}
                    className="flex h-10 w-10 items-center justify-center rounded-lg text-lg font-bold transition-all hover:scale-105"
                    style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--text-secondary)' }}
                  >
                    +
                  </button>
                </div>
              </div>
              <div
                className="h-8 w-full overflow-hidden rounded-full"
                style={{ background: 'rgba(255,255,255,0.04)' }}
              >
                <div
                  className="flex h-full items-center rounded-full px-3 transition-all duration-700 ease-out"
                  style={{
                    width: `${Math.max((option.votes / maxVotes) * 100, option.votes > 0 ? 8 : 0)}%`,
                    background: barColors[i % barColors.length],
                  }}
                >
                  {option.votes > 0 && (
                    <span className="text-sm font-bold text-white/90">
                      {pct.toFixed(0)}%
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {totalVotes > 0 && (
        <div className="text-center text-base" style={{ color: 'var(--text-muted)' }}>
          {totalVotes} votes cast
        </div>
      )}
    </div>
  );
}
