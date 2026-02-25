'use client';

import { TranscriptEntry, Stage, ArgumentStance, RhetoricMode } from '../lib/types';
import { useEffect, useRef } from 'react';

interface TranscriptLogProps {
  entries: TranscriptEntry[];
  stages?: Stage[];
  onRemove?: (id: string) => void;
  onVote?: (id: string, delta: number) => void;
  onTag?: (id: string, stance?: ArgumentStance, rhetoric?: RhetoricMode) => void;
}

const stanceTags: { value: ArgumentStance; label: string; color: string; bg: string }[] = [
  { value: 'for', label: 'For', color: '#6ee7b7', bg: 'rgba(110,231,183,0.12)' },
  { value: 'against', label: 'Against', color: '#f87171', bg: 'rgba(248,113,113,0.12)' },
  { value: 'mixed', label: 'Mixed', color: '#a5b4fc', bg: 'rgba(165,180,252,0.12)' },
];

const rhetoricTags: { value: RhetoricMode; label: string; abbr: string; color: string; bg: string }[] = [
  { value: 'evidence', label: 'Evidence', abbr: 'Ev', color: '#93c5fd', bg: 'rgba(147,197,253,0.12)' },
  { value: 'values', label: 'Values', abbr: 'Va', color: '#c4b5fd', bg: 'rgba(196,181,253,0.12)' },
  { value: 'consequences', label: 'Consequences', abbr: 'Co', color: '#fbbf24', bg: 'rgba(251,191,36,0.12)' },
  { value: 'authority', label: 'Authority', abbr: 'Au', color: '#a78bfa', bg: 'rgba(167,139,250,0.12)' },
];

export default function TranscriptLog({ entries, stages, onRemove, onVote, onTag }: TranscriptLogProps) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [entries.length]);

  if (entries.length === 0) {
    return (
      <div className="flex min-h-[120px] items-center justify-center rounded-2xl text-lg italic" style={{ color: 'var(--text-muted)' }}>
        No arguments captured yet. Use the microphone or keyboard to begin.
      </div>
    );
  }

  const stageMap = stages ? Object.fromEntries(stages.map((s) => [s.id, s.title])) : {};

  return (
    <div className="space-y-2.5 overflow-y-auto overflow-x-hidden pr-1" style={{ maxHeight: '50vh' }}>
      {entries.map((entry, i) => {
        const prevStageId = i > 0 ? entries[i - 1].stageId : null;
        const showDivider = stages && prevStageId && entry.stageId !== prevStageId;
        const voteCount = entry.votes ?? 0;
        const isEvent = entry.isSystemEvent || entry.speaker === '[EVENT]';

        return (
          <div key={entry.id}>
            {showDivider && (
              <div className="flex items-center gap-3 py-2">
                <div className="flex-1 h-px" style={{ background: 'var(--panel-border)' }} />
                <span className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                  {stageMap[entry.stageId] || entry.stageId}
                </span>
                <div className="flex-1 h-px" style={{ background: 'var(--panel-border)' }} />
              </div>
            )}
            <div
              className={`animate-in group flex gap-3 rounded-xl p-4 ${isEvent ? '' : 'glass'}`}
              style={{
                animationDelay: `${Math.min(i * 50, 200)}ms`,
                ...(isEvent
                  ? {
                      background: 'linear-gradient(135deg, rgba(180,60,40,0.12), rgba(200,120,30,0.08))',
                      border: '1px solid rgba(200,120,30,0.2)',
                    }
                  : {}),
              }}
            >
              {/* Vote controls — hidden for events */}
              {onVote && !isEvent && (
                <div className="flex flex-col items-center gap-0.5 pt-0.5">
                  <button
                    onClick={() => onVote(entry.id, 1)}
                    className="flex h-6 w-6 items-center justify-center rounded-md text-xs transition-all hover:scale-110"
                    style={{ background: 'rgba(255,255,255,0.04)', color: 'var(--text-muted)' }}
                    title="Upvote"
                  >
                    ▲
                  </button>
                  <span
                    className="text-xs font-semibold tabular-nums"
                    style={{
                      color: voteCount > 0
                        ? 'var(--accent)'
                        : voteCount < 0
                          ? '#f87171'
                          : 'var(--text-muted)',
                    }}
                  >
                    {voteCount}
                  </span>
                  <button
                    onClick={() => onVote(entry.id, -1)}
                    className="flex h-6 w-6 items-center justify-center rounded-md text-xs transition-all hover:scale-110"
                    style={{ background: 'rgba(255,255,255,0.04)', color: 'var(--text-muted)' }}
                    title="Downvote"
                  >
                    ▼
                  </button>
                </div>
              )}

              {/* Entry content */}
              <div className="flex-1 min-w-0 overflow-hidden">
                <div className="mb-1 flex flex-wrap items-center justify-between gap-x-2">
                  <div className="flex items-center gap-2">
                    {isEvent ? (
                      <span
                        className="rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest"
                        style={{ background: 'rgba(200,120,30,0.2)', color: '#f59e0b' }}
                      >
                        Event
                      </span>
                    ) : (
                      <span className="text-base font-semibold" style={{ color: 'var(--accent)' }}>
                        {entry.speaker}
                      </span>
                    )}
                    {!isEvent && (entry.profession || entry.age || entry.gender) && (
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        {[entry.profession, entry.age ? `age ${entry.age}` : '', entry.gender].filter(Boolean).join(', ')}
                      </span>
                    )}
                    {/* Active stance tag */}
                    {!isEvent && entry.stance && (
                      <span
                        className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase"
                        style={{
                          background: stanceTags.find((t) => t.value === entry.stance)?.bg,
                          color: stanceTags.find((t) => t.value === entry.stance)?.color,
                        }}
                      >
                        {entry.stance}
                      </span>
                    )}
                    {/* Active rhetoric tag */}
                    {!isEvent && entry.rhetoric && (
                      <span
                        className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase"
                        style={{
                          background: rhetoricTags.find((t) => t.value === entry.rhetoric)?.bg,
                          color: rhetoricTags.find((t) => t.value === entry.rhetoric)?.color,
                        }}
                      >
                        {rhetoricTags.find((t) => t.value === entry.rhetoric)?.label}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {onRemove && (
                      <button
                        onClick={() => onRemove(entry.id)}
                        className="text-xs opacity-0 transition-opacity group-hover:opacity-100"
                        style={{ color: 'rgba(239,68,68,0.5)' }}
                        title="Remove entry"
                      >
                        ✕
                      </button>
                    )}
                    <span className="text-xs whitespace-nowrap" style={{ color: 'var(--text-muted)' }}>
                      {new Date(entry.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
                <p
                  className="text-lg leading-relaxed"
                  style={{
                    color: isEvent ? '#f59e0b' : 'var(--text-primary)',
                    fontStyle: isEvent ? 'italic' : undefined,
                    overflowWrap: 'break-word',
                    wordBreak: 'break-word',
                  }}
                >
                  {entry.text}
                </p>

                {/* Tag buttons — shown on hover, hidden for events */}
                {onTag && !isEvent && (
                  <div className="mt-2 flex flex-wrap items-center gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                    {stanceTags.map((t) => (
                      <button
                        key={t.value}
                        onClick={() => onTag(entry.id, t.value, undefined)}
                        className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase transition-all hover:scale-105"
                        style={{
                          background: entry.stance === t.value ? t.bg : 'rgba(255,255,255,0.04)',
                          color: entry.stance === t.value ? t.color : 'var(--text-muted)',
                          border: `1px solid ${entry.stance === t.value ? t.color + '40' : 'transparent'}`,
                        }}
                      >
                        {t.label}
                      </button>
                    ))}
                    <span className="mx-0.5 text-[10px]" style={{ color: 'var(--text-muted)' }}>|</span>
                    {rhetoricTags.map((t) => (
                      <button
                        key={t.value}
                        onClick={() => onTag(entry.id, undefined, t.value)}
                        className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase transition-all hover:scale-105"
                        style={{
                          background: entry.rhetoric === t.value ? t.bg : 'rgba(255,255,255,0.04)',
                          color: entry.rhetoric === t.value ? t.color : 'var(--text-muted)',
                          border: `1px solid ${entry.rhetoric === t.value ? t.color + '40' : 'transparent'}`,
                        }}
                        title={t.label}
                      >
                        {t.abbr}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
      <div ref={endRef} />
    </div>
  );
}
