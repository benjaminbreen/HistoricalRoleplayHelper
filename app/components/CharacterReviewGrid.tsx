'use client';

import { useState, useCallback } from 'react';
import { CharacterSheet, TranscriptEntry } from '../lib/types';

interface CharacterReviewGridProps {
  cast: CharacterSheet[];
  onUpdate: (id: string, updates: Partial<CharacterSheet>) => void;
  onRemove: (id: string) => void;
  mode: 'review' | 'lobby' | 'panel';
  transcript?: TranscriptEntry[];
  onSelectCharacter?: (id: string) => void;
}

export default function CharacterReviewGrid({
  cast,
  onUpdate,
  onRemove,
  mode,
  transcript = [],
  onSelectCharacter,
}: CharacterReviewGridProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = useCallback((id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  }, []);

  const addManual = useCallback(() => {
    const newSheet: CharacterSheet = {
      id: crypto.randomUUID(),
      studentRealName: '',
      characterName: '',
      portraitDataUrl: '',
      needsReview: true,
    };
    onUpdate(newSheet.id, newSheet);
  }, [onUpdate]);

  const portraitSize = mode === 'lobby' ? 120 : mode === 'panel' ? 48 : 80;

  // ── PANEL MODE ──
  if (mode === 'panel') {
    return (
      <div className="space-y-2">
        <div className="grid grid-cols-4 gap-2">
          {cast.map((sheet) => {
            const isExpanded = expandedId === sheet.id;
            const charEntries = transcript.filter((e) => e.characterId === sheet.id);

            return (
              <div key={sheet.id} className={isExpanded ? 'col-span-4' : ''}>
                <button
                  onClick={() => {
                    toggleExpand(sheet.id);
                    onSelectCharacter?.(sheet.id);
                  }}
                  className="rounded-lg p-1 transition-all hover:scale-105"
                  style={{
                    background: isExpanded ? 'rgba(212,160,60,0.12)' : 'transparent',
                    border: isExpanded ? '1px solid rgba(212,160,60,0.25)' : '1px solid transparent',
                  }}
                  title={sheet.characterName}
                >
                  {sheet.portraitDataUrl ? (
                    <img
                      src={sheet.portraitDataUrl}
                      alt={sheet.characterName}
                      className="rounded-lg object-cover"
                      style={{ width: portraitSize, height: portraitSize }}
                    />
                  ) : (
                    <div
                      className="flex items-center justify-center rounded-lg text-lg"
                      style={{
                        width: portraitSize,
                        height: portraitSize,
                        background: 'rgba(212,160,60,0.1)',
                        color: 'var(--accent)',
                      }}
                    >
                      {sheet.characterName.charAt(0) || '?'}
                    </div>
                  )}
                </button>
                {isExpanded && (
                  <div className="mt-2 rounded-xl p-3 space-y-2" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--panel-border)' }}>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                        {sheet.characterName}
                      </span>
                      {sheet.profession && (
                        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                          {sheet.profession}
                        </span>
                      )}
                    </div>
                    {sheet.personality && (
                      <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                        {sheet.personality}
                      </p>
                    )}
                    {sheet.studentRealName && (
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        Student: {sheet.studentRealName}
                      </p>
                    )}
                    {charEntries.length > 0 && (
                      <div className="mt-2 space-y-1">
                        <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                          Dialogue ({charEntries.length}):
                        </p>
                        <div className="max-h-32 overflow-y-auto space-y-1">
                          {charEntries.map((entry) => (
                            <p key={entry.id} className="text-xs rounded-lg px-2 py-1" style={{ background: 'rgba(255,255,255,0.03)', color: 'var(--text-secondary)' }}>
                              {entry.text.length > 100 ? entry.text.slice(0, 100) + '...' : entry.text}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ── LOBBY MODE ──
  if (mode === 'lobby') {
    return (
      <div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {cast.map((sheet) => (
            <div key={sheet.id} className="flex flex-col items-center gap-2 rounded-xl p-3"
              style={{ background: 'rgba(255,255,255,0.03)' }}>
              {sheet.portraitDataUrl ? (
                <img
                  src={sheet.portraitDataUrl}
                  alt={sheet.characterName}
                  className="rounded-xl object-cover"
                  style={{ width: portraitSize, height: portraitSize, border: '2px solid rgba(212,160,60,0.2)' }}
                />
              ) : (
                <div
                  className="flex items-center justify-center rounded-xl text-3xl"
                  style={{
                    width: portraitSize,
                    height: portraitSize,
                    background: 'rgba(212,160,60,0.1)',
                    color: 'var(--accent)',
                    border: '2px solid rgba(212,160,60,0.2)',
                  }}
                >
                  {sheet.characterName.charAt(0) || '?'}
                </div>
              )}
              <span className="text-sm font-semibold text-center" style={{ color: 'var(--text-primary)' }}>
                {sheet.characterName}
              </span>
              {sheet.profession && (
                <span className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
                  {sheet.profession}
                </span>
              )}
            </div>
          ))}
        </div>
        <p className="mt-4 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
          {cast.length} character{cast.length !== 1 ? 's' : ''} ready
        </p>
      </div>
    );
  }

  // ── REVIEW MODE ──
  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {cast.map((sheet) => {
          const isExpanded = expandedId === sheet.id;
          return (
            <div
              key={sheet.id}
              className="rounded-xl p-3 transition-all cursor-pointer"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: sheet.needsReview
                  ? '2px solid rgba(234,179,8,0.3)'
                  : '1px solid var(--panel-border)',
              }}
              onClick={() => toggleExpand(sheet.id)}
            >
              <div className="flex items-start gap-3">
                {sheet.portraitDataUrl ? (
                  <img
                    src={sheet.portraitDataUrl}
                    alt={sheet.characterName}
                    className="flex-shrink-0 rounded-lg object-cover"
                    style={{ width: portraitSize, height: portraitSize }}
                  />
                ) : (
                  <div
                    className="flex-shrink-0 flex items-center justify-center rounded-lg text-xl"
                    style={{
                      width: portraitSize,
                      height: portraitSize,
                      background: 'rgba(212,160,60,0.1)',
                      color: 'var(--accent)',
                    }}
                  >
                    {sheet.characterName.charAt(0) || '?'}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                    {sheet.characterName || 'Unnamed Character'}
                  </p>
                  {sheet.profession && (
                    <p className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>
                      {sheet.profession}
                    </p>
                  )}
                  {sheet.studentRealName && (
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                      {sheet.studentRealName}
                    </p>
                  )}
                  {sheet.needsReview && (
                    <span
                      className="inline-block mt-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase"
                      style={{ background: 'rgba(234,179,8,0.15)', color: '#eab308' }}
                    >
                      Needs review
                    </span>
                  )}
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); onRemove(sheet.id); }}
                  className="text-xs text-red-400/40 transition-colors hover:text-red-400 flex-shrink-0"
                >
                  ✕
                </button>
              </div>

              {/* Expanded edit form */}
              {isExpanded && (
                <div className="mt-3 space-y-2" onClick={(e) => e.stopPropagation()}>
                  {([
                    ['characterName', 'Character Name'],
                    ['studentRealName', 'Student Name'],
                    ['profession', 'Profession'],
                    ['age', 'Age'],
                    ['gender', 'Gender'],
                    ['family', 'Family'],
                    ['socialClass', 'Social Class'],
                    ['personality', 'Personality'],
                  ] as const).map(([field, label]) => (
                    <div key={field}>
                      <label className="block text-xs mb-0.5" style={{ color: 'var(--text-muted)' }}>
                        {label}
                      </label>
                      <input
                        type="text"
                        value={(sheet[field] as string) || ''}
                        onChange={(e) => onUpdate(sheet.id, { [field]: e.target.value })}
                        className="w-full rounded-lg px-3 py-1.5 text-sm focus:outline-none"
                        style={{
                          background: 'rgba(255,255,255,0.05)',
                          border: '1px solid var(--panel-border)',
                          color: 'var(--text-primary)',
                        }}
                      />
                    </div>
                  ))}
                  {sheet.needsReview && (
                    <button
                      onClick={() => onUpdate(sheet.id, { needsReview: false })}
                      className="rounded-lg px-3 py-1.5 text-xs font-medium"
                      style={{ background: 'rgba(34,197,94,0.1)', color: '#22c55e' }}
                    >
                      Mark as reviewed
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <button
        onClick={addManual}
        className="rounded-lg px-4 py-2 text-sm font-medium transition-all hover:scale-[1.02]"
        style={{ background: 'rgba(212,160,60,0.12)', color: 'var(--accent)' }}
      >
        + Add Manually
      </button>
    </div>
  );
}
