'use client';

import { Stage } from '../lib/types';
import { MessageCircle, Swords, Mic, Landmark, Vote, Scroll, RotateCcw, Check, type LucideIcon } from 'lucide-react';

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
  debrief: 'Debrief',
};

const stageTypeIcons: Record<string, LucideIcon> = {
  freeform: MessageCircle,
  debate: Swords,
  speech: Mic,
  npc_response: Landmark,
  vote: Vote,
  verdict: Scroll,
  debrief: RotateCcw,
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
              className={`group flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
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
                    ? 'var(--subtle-bg)'
                    : 'var(--subtle-bg)',
                color: isCurrent
                  ? 'var(--accent)'
                  : isPast
                    ? 'var(--text-secondary)'
                    : 'var(--text-muted)',
                border: isCurrent ? '1px solid rgba(212,160,60,0.35)' : '1px solid transparent',
              }}
            >
              {(() => { const Icon = stageTypeIcons[stage.type]; return Icon ? <Icon size={16} className="shrink-0 transition-transform duration-150 group-hover:scale-110" /> : null; })()}
              <span>{stage.title || stageTypeLabels[stage.type]}</span>
              {isPast && <Check size={14} className="text-emerald-400/70 shrink-0" />}
            </button>
            {i < stages.length - 1 && (
              <div
                className="mx-1 h-px w-4"
                style={{
                  background: i < currentIndex
                    ? 'rgba(212,160,60,0.3)'
                    : 'var(--subtle-border)',
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
