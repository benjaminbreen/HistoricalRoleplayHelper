'use client';

import { CharacterSheet } from '../lib/types';

interface CharacterQuickBarProps {
  cast: CharacterSheet[];
  recentCharacterIds: string[];
  selectedCharacterId?: string;
  onSelect: (id: string | undefined) => void;
  onOpenPanel: () => void;
}

export default function CharacterQuickBar({
  cast,
  recentCharacterIds,
  selectedCharacterId,
  onSelect,
  onOpenPanel,
}: CharacterQuickBarProps) {
  // Show up to 10 most recent characters
  const recentChars = recentCharacterIds
    .slice(0, 10)
    .map((id) => cast.find((c) => c.id === id))
    .filter((c): c is CharacterSheet => c !== undefined);

  // If fewer than 10 recent, pad with remaining cast members
  const shown = new Set(recentChars.map((c) => c.id));
  const remaining = cast.filter((c) => !shown.has(c.id));
  const displayChars = [...recentChars, ...remaining].slice(0, 10);

  if (displayChars.length === 0) return null;

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
      {displayChars.map((char) => {
        const isSelected = char.id === selectedCharacterId;
        return (
          <button
            key={char.id}
            onClick={() => onSelect(isSelected ? undefined : char.id)}
            className="flex-shrink-0 rounded-full transition-all hover:scale-110"
            style={{
              width: 40,
              height: 40,
              border: isSelected
                ? '2px solid var(--accent)'
                : '2px solid transparent',
              boxShadow: isSelected ? '0 0 8px rgba(212,160,60,0.3)' : 'none',
            }}
            title={char.characterName}
          >
            {char.portraitDataUrl ? (
              <img
                src={char.portraitDataUrl}
                alt={char.characterName}
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              <div
                className="flex h-full w-full items-center justify-center rounded-full text-xs font-semibold"
                style={{ background: 'rgba(212,160,60,0.1)', color: 'var(--accent)' }}
              >
                {char.characterName.charAt(0) || '?'}
              </div>
            )}
          </button>
        );
      })}
      <button
        onClick={onOpenPanel}
        className="flex-shrink-0 flex items-center justify-center rounded-full text-xs transition-all hover:scale-110"
        style={{
          width: 40,
          height: 40,
          background: 'var(--subtle-bg)',
          color: 'var(--text-muted)',
          border: '1px solid var(--panel-border)',
        }}
        title="View all characters"
      >
        ...
      </button>
    </div>
  );
}
