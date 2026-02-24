'use client';

import { useState } from 'react';
import { Scenario, TranscriptEntry, NpcResponse, VotingOption } from '../lib/types';

interface VerdictProps {
  scenario: Scenario;
  transcript: TranscriptEntry[];
  npcResponses: NpcResponse[];
  votingOptions: VotingOption[];
}

export default function Verdict({
  scenario,
  transcript,
  npcResponses,
  votingOptions,
}: VerdictProps) {
  const [showHistorical, setShowHistorical] = useState(false);

  const totalVotes = votingOptions.reduce((sum, o) => sum + o.votes, 0);
  const winner = [...votingOptions].sort((a, b) => b.votes - a.votes)[0];

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Vote Results Summary */}
      {totalVotes > 0 && (
        <div className="glass animate-in-scale rounded-2xl p-8 text-center">
          <p className="mb-1 text-sm uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
            The Decision
          </p>
          <p className="heading-display text-4xl font-bold" style={{ color: 'var(--accent)' }}>
            {winner.label}
          </p>
          <p className="mt-2 text-base" style={{ color: 'var(--text-secondary)' }}>
            {winner.votes} of {totalVotes} votes ({((winner.votes / totalVotes) * 100).toFixed(0)}%)
          </p>
        </div>
      )}

      {/* Session Stats */}
      <div className="glass rounded-2xl p-6">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
          Session Summary
        </h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="font-mono text-3xl font-bold" style={{ color: 'var(--accent)' }}>{transcript.length}</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Arguments</p>
          </div>
          <div>
            <p className="font-mono text-3xl font-bold" style={{ color: 'var(--accent)' }}>{npcResponses.length}</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>NPC Responses</p>
          </div>
          <div>
            <p className="font-mono text-3xl font-bold" style={{ color: 'var(--accent)' }}>{totalVotes}</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Votes Cast</p>
          </div>
        </div>
      </div>

      {/* Historical Reveal */}
      <div className="text-center">
        <button
          onClick={() => setShowHistorical(!showHistorical)}
          className="heading-display rounded-2xl px-10 py-5 text-2xl font-bold transition-all hover:scale-[1.02]"
          style={{
            background: showHistorical
              ? 'rgba(255,255,255,0.06)'
              : 'linear-gradient(135deg, rgba(212,160,60,0.3), rgba(180,120,40,0.2))',
            color: 'var(--accent)',
            border: '1px solid rgba(212,160,60,0.25)',
            boxShadow: showHistorical ? 'none' : '0 0 40px rgba(212,160,60,0.1)',
          }}
        >
          {showHistorical ? 'Hide Historical Outcome' : 'Reveal: What Actually Happened'}
        </button>
      </div>

      {showHistorical && (
        <div
          className="animate-in-scale rounded-2xl p-8"
          style={{
            background: 'linear-gradient(135deg, rgba(212,160,60,0.08), rgba(15,17,23,0.9))',
            border: '2px solid rgba(212,160,60,0.2)',
          }}
        >
          <h3
            className="heading-display mb-4 text-center text-2xl font-bold"
            style={{ color: 'var(--accent)' }}
          >
            The Historical Outcome
          </h3>
          <p className="text-lg leading-relaxed" style={{ color: 'var(--text-primary)' }}>
            {scenario.historicalOutcome}
          </p>
        </div>
      )}
    </div>
  );
}
