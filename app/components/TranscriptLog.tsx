'use client';

import { TranscriptEntry } from '../lib/types';
import { useEffect, useRef } from 'react';

interface TranscriptLogProps {
  entries: TranscriptEntry[];
}

export default function TranscriptLog({ entries }: TranscriptLogProps) {
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

  return (
    <div className="space-y-2.5 overflow-y-auto pr-1" style={{ maxHeight: '50vh' }}>
      {entries.map((entry, i) => (
        <div
          key={entry.id}
          className="glass animate-in rounded-xl p-4"
          style={{ animationDelay: `${Math.min(i * 50, 200)}ms` }}
        >
          <div className="mb-1 flex items-center justify-between">
            <span className="text-base font-semibold" style={{ color: 'var(--accent)' }}>
              {entry.speaker}
            </span>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {new Date(entry.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
          <p className="text-lg leading-relaxed" style={{ color: 'var(--text-primary)' }}>
            {entry.text}
          </p>
        </div>
      ))}
      <div ref={endRef} />
    </div>
  );
}
