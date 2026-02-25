'use client';

import { useState, useMemo } from 'react';
import { CharacterSheet, TranscriptEntry } from '../lib/types';
import CharacterReviewGrid from './CharacterReviewGrid';

interface CastPanelProps {
  cast: CharacterSheet[];
  transcript: TranscriptEntry[];
  isOpen: boolean;
  onClose: () => void;
  onSelectCharacter: (characterId: string) => void;
}

export default function CastPanel({ cast, transcript, isOpen, onClose, onSelectCharacter }: CastPanelProps) {
  const [search, setSearch] = useState('');

  const filteredCast = useMemo(() => {
    if (!search.trim()) return cast;
    const q = search.toLowerCase();
    return cast.filter(
      (c) =>
        c.characterName.toLowerCase().includes(q) ||
        c.studentRealName.toLowerCase().includes(q) ||
        (c.profession?.toLowerCase().includes(q))
    );
  }, [cast, search]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed right-0 top-0 z-40 flex h-full w-[380px] flex-col glass-strong animate-in"
      style={{
        borderLeft: '1px solid var(--panel-border)',
        boxShadow: '-4px 0 24px rgba(0,0,0,0.3)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid var(--panel-border)' }}>
        <h3 className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
          Cast ({cast.length})
        </h3>
        <button
          onClick={onClose}
          className="rounded-lg px-2 py-1 text-sm transition-all"
          style={{ color: 'var(--text-muted)' }}
        >
          ✕
        </button>
      </div>

      {/* Search */}
      <div className="px-4 py-2">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search characters..."
          className="w-full rounded-lg px-3 py-2 text-sm placeholder-white/20 focus:outline-none"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid var(--panel-border)',
            color: 'var(--text-primary)',
          }}
        />
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto px-4 py-2">
        <CharacterReviewGrid
          cast={filteredCast}
          onUpdate={() => {}}
          onRemove={() => {}}
          mode="panel"
          transcript={transcript}
          onSelectCharacter={onSelectCharacter}
        />
      </div>
    </div>
  );
}
