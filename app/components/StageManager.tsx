'use client';

import { Stage } from '../lib/types';

interface StageManagerProps {
  stages: Stage[];
  currentIndex: number;
  onNavigate: (index: number) => void;
}

const stageTypeLabels: Record<string, string> = {
  freeform: 'Discussion',
  debate: 'Debate',
  speech: 'Speeches',
  npc_response: 'NPC Response',
  vote: 'Vote',
  verdict: 'Verdict',
};

const stageTypeIcons: Record<string, string> = {
  freeform: '💬',
  debate: '⚔️',
  speech: '🎙️',
  npc_response: '🏛️',
  vote: '🗳️',
  verdict: '📜',
};

export default function StageManager({
  stages,
  currentIndex,
  onNavigate,
}: StageManagerProps) {
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto py-2">
      {stages.map((stage, i) => {
        const isCurrent = i === currentIndex;
        const isPast = i < currentIndex;
        return (
          <div key={stage.id} className="flex items-center">
            <button
              onClick={() => onNavigate(i)}
              className={`flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                isCurrent
                  ? 'animate-glow shadow-lg'
                  : isPast
                    ? 'hover:opacity-80'
                    : 'hover:opacity-70'
              }`}
              style={{
                background: isCurrent
                  ? 'rgba(212, 160, 60, 0.2)'
                  : isPast
                    ? 'rgba(255,255,255,0.06)'
                    : 'rgba(255,255,255,0.03)',
                color: isCurrent
                  ? 'var(--accent)'
                  : isPast
                    ? 'var(--text-secondary)'
                    : 'var(--text-muted)',
                border: isCurrent ? '1px solid rgba(212,160,60,0.35)' : '1px solid transparent',
              }}
            >
              <span className="text-base">{stageTypeIcons[stage.type] || '📌'}</span>
              <span>{stage.title || stageTypeLabels[stage.type]}</span>
              {isPast && <span className="text-emerald-400/70">✓</span>}
            </button>
            {i < stages.length - 1 && (
              <div
                className="mx-1 h-px w-4"
                style={{
                  background: i < currentIndex
                    ? 'rgba(212,160,60,0.3)'
                    : 'rgba(255,255,255,0.08)',
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
