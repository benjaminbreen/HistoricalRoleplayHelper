'use client';

import { TranscriptEntry, Stage, ArgumentStance, RhetoricMode, CharacterSheet } from '../lib/types';
import { useEffect, useRef, useMemo, useState, useCallback } from 'react';
import { ChevronUp, ChevronDown, X } from 'lucide-react';

interface TranscriptLogProps {
  entries: TranscriptEntry[];
  stages?: Stage[];
  cast?: CharacterSheet[];
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

export default function TranscriptLog({ entries, stages, cast, onRemove, onVote, onTag }: TranscriptLogProps) {
  const endRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isNearBottom, setIsNearBottom] = useState(true);
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterSheet | null>(null);

  const lastEntryText = entries.length > 0 ? entries[entries.length - 1].text : '';

  // Build portrait + metadata lookup from cast (by ID and by speaker name)
  const portraitMap = useMemo(() => {
    if (!cast?.length) return new Map<string, string>();
    return new Map(cast.filter((c) => c.portraitDataUrl).map((c) => [c.id, c.portraitDataUrl]));
  }, [cast]);

  const castMap = useMemo(() => {
    if (!cast?.length) return new Map<string, CharacterSheet>();
    return new Map(cast.map((c) => [c.id, c]));
  }, [cast]);

  // Also build a speaker-name → CharacterSheet lookup for entries without characterId
  const speakerCastMap = useMemo(() => {
    if (!cast?.length) return new Map<string, CharacterSheet>();
    const map = new Map<string, CharacterSheet>();
    for (const c of cast) {
      map.set(c.characterName.toLowerCase().trim(), c);
      // Also map studentRealName if present
      if (c.studentRealName) {
        map.set(c.studentRealName.toLowerCase().trim(), c);
      }
    }
    return map;
  }, [cast]);

  // Track whether user is scrolled near the bottom
  const handleScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const threshold = 80;
    setIsNearBottom(el.scrollHeight - el.scrollTop - el.clientHeight < threshold);
  }, []);

  // Only auto-scroll when user is already near the bottom
  useEffect(() => {
    if (isNearBottom) {
      endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [entries.length, lastEntryText, isNearBottom]);

  const scrollToBottom = useCallback(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
    setIsNearBottom(true);
  }, []);

  if (entries.length === 0) {
    return (
      <div className="flex min-h-[120px] items-center justify-center rounded-2xl text-lg italic" style={{ color: 'var(--text-muted)' }}>
        No arguments captured yet. Use the microphone or keyboard to begin.
      </div>
    );
  }

  const stageMap = stages ? Object.fromEntries(stages.map((s) => [s.id, s.title])) : {};

  return (
    <div className="relative">
    <div ref={containerRef} onScroll={handleScroll} className="space-y-2.5 overflow-x-hidden pr-1">
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
                    className="flex h-6 w-6 items-center justify-center rounded-md transition-all hover:scale-110"
                    style={{ background: 'var(--subtle-bg)', color: 'var(--text-muted)' }}
                    title="Upvote"
                  >
                    <ChevronUp size={14} />
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
                    className="flex h-6 w-6 items-center justify-center rounded-md transition-all hover:scale-110"
                    style={{ background: 'var(--subtle-bg)', color: 'var(--text-muted)' }}
                    title="Downvote"
                  >
                    <ChevronDown size={14} />
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
                      <>
                        {(() => {
                          // Resolve the CharacterSheet for this entry
                          const char = entry.characterId
                            ? castMap.get(entry.characterId)
                            : speakerCastMap.get(entry.speaker.toLowerCase().trim());
                          const portrait = char?.portraitDataUrl || (entry.characterId ? portraitMap.get(entry.characterId) : undefined);
                          const isClickable = !!char;

                          return (
                            <button
                              type="button"
                              className="flex items-center gap-2 text-left transition-opacity hover:opacity-80"
                              style={{ cursor: isClickable ? 'pointer' : 'default' }}
                              onClick={isClickable ? () => setSelectedCharacter(char) : undefined}
                              disabled={!isClickable}
                            >
                              {portrait && (
                                <img
                                  src={portrait}
                                  alt=""
                                  className="h-7 w-7 rounded-full object-cover flex-shrink-0"
                                  style={{ border: '1.5px solid var(--accent-dim)' }}
                                />
                              )}
                              <span className="text-base font-semibold" style={{ color: 'var(--accent)' }}>
                                {entry.speaker}
                              </span>
                            </button>
                          );
                        })()}
                      </>
                    )}
                    {!isEvent && (() => {
                      const c = entry.characterId ? castMap.get(entry.characterId) : speakerCastMap.get(entry.speaker.toLowerCase().trim());
                      const profession = entry.profession || c?.profession;
                      const age = entry.age || c?.age;
                      if (!profession && !age) return null;
                      return (
                        <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                          {[profession, age ? `age ${age}` : ''].filter(Boolean).join(', ')}
                        </span>
                      );
                    })()}
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
                        className="opacity-0 transition-opacity group-hover:opacity-100"
                        style={{ color: 'rgba(239,68,68,0.5)' }}
                        title="Remove entry"
                      >
                        <X size={12} />
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
                          background: entry.stance === t.value ? t.bg : 'var(--subtle-bg)',
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
                          background: entry.rhetoric === t.value ? t.bg : 'var(--subtle-bg)',
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
    {/* Jump to latest pill — shown when scrolled up */}
    {!isNearBottom && entries.length > 3 && (
      <button
        onClick={scrollToBottom}
        className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 rounded-full px-4 py-1.5 text-xs font-semibold shadow-lg transition-all hover:scale-105"
        style={{
          background: 'var(--accent)',
          color: 'var(--background)',
        }}
      >
        Jump to latest
      </button>
    )}

    {/* Character card modal */}
    {selectedCharacter && (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center"
        style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
        onClick={() => setSelectedCharacter(null)}
        role="dialog"
        aria-modal="true"
        aria-label={`${selectedCharacter.characterName} character card`}
      >
        <div
          className="glass-strong animate-in-scale mx-4 w-full max-w-sm rounded-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Portrait header */}
          <div className="relative flex flex-col items-center pt-8 pb-5 px-6"
            style={{
              background: 'linear-gradient(180deg, rgba(212,160,60,0.12) 0%, transparent 100%)',
            }}
          >
            <button
              onClick={() => setSelectedCharacter(null)}
              className="absolute top-3 right-3 flex h-7 w-7 items-center justify-center rounded-lg transition-all hover:scale-110"
              style={{ background: 'rgba(255,255,255,0.08)', color: 'var(--text-muted)' }}
            >
              <X size={14} />
            </button>

            {selectedCharacter.portraitDataUrl ? (
              <img
                src={selectedCharacter.portraitDataUrl}
                alt={selectedCharacter.characterName}
                className="h-28 w-28 rounded-full object-cover"
                style={{ border: '3px solid var(--accent-dim)', boxShadow: '0 4px 24px rgba(0,0,0,0.3)' }}
              />
            ) : (
              <div
                className="flex h-28 w-28 items-center justify-center rounded-full text-4xl font-bold"
                style={{ background: 'rgba(212,160,60,0.15)', color: 'var(--accent)', border: '3px solid var(--accent-dim)' }}
              >
                {selectedCharacter.characterName.charAt(0)}
              </div>
            )}

            <h3 className="heading-display mt-4 text-xl font-bold text-center" style={{ color: 'var(--accent)' }}>
              {selectedCharacter.characterName}
            </h3>
            {selectedCharacter.studentRealName && (
              <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
                Played by {selectedCharacter.studentRealName}
              </p>
            )}
          </div>

          {/* Details */}
          <div className="px-6 pb-6 space-y-2.5">
            {([
              ['Profession', selectedCharacter.profession],
              ['Age', selectedCharacter.age],
              ['Gender', selectedCharacter.gender],
              ['Social Class', selectedCharacter.socialClass],
              ['Family', selectedCharacter.family],
            ] as const)
              .filter(([, val]) => val)
              .map(([label, val]) => (
                <div key={label} className="flex items-baseline justify-between gap-4">
                  <span className="text-xs font-semibold uppercase tracking-wider flex-shrink-0" style={{ color: 'var(--text-muted)' }}>
                    {label}
                  </span>
                  <span className="text-sm text-right" style={{ color: 'var(--text-primary)' }}>
                    {val}
                  </span>
                </div>
              ))}

            {selectedCharacter.personality && (
              <div className="pt-2" style={{ borderTop: '1px solid var(--panel-border)' }}>
                <span className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{ color: 'var(--text-muted)' }}>
                  Personality
                </span>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {selectedCharacter.personality}
                </p>
              </div>
            )}

            {selectedCharacter.customFields && Object.keys(selectedCharacter.customFields).length > 0 && (
              <div className="pt-2 space-y-2" style={{ borderTop: '1px solid var(--panel-border)' }}>
                {Object.entries(selectedCharacter.customFields).map(([key, val]) => (
                  <div key={key} className="flex items-baseline justify-between gap-4">
                    <span className="text-xs font-semibold uppercase tracking-wider flex-shrink-0" style={{ color: 'var(--text-muted)' }}>
                      {key}
                    </span>
                    <span className="text-sm text-right" style={{ color: 'var(--text-primary)' }}>
                      {val}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    )}
    </div>
  );
}
