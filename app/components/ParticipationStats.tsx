'use client';

import { useMemo } from 'react';
import { TranscriptEntry, StudentRole } from '../lib/types';

interface ParticipationStatsProps {
  transcript: TranscriptEntry[];
  studentRoles: StudentRole[];
}

interface SpeakerStat {
  name: string;
  count: number;
  totalChars: number;
}

export default function ParticipationStats({ transcript, studentRoles }: ParticipationStatsProps) {
  const { speakers, uniqueCount, silent } = useMemo(() => {
    const map = new Map<string, SpeakerStat>();
    for (const entry of transcript) {
      const existing = map.get(entry.speaker);
      if (existing) {
        existing.count++;
        existing.totalChars += entry.text.length;
      } else {
        map.set(entry.speaker, {
          name: entry.speaker,
          count: 1,
          totalChars: entry.text.length,
        });
      }
    }
    const sorted = [...map.values()].sort((a, b) => b.count - a.count);
    const speakerNames = new Set(map.keys());

    // Find students who haven't spoken
    const silent: string[] = [];
    for (const role of studentRoles) {
      if (role.assignedTo && !speakerNames.has(role.assignedTo)) {
        silent.push(role.assignedTo);
      }
    }

    return { speakers: sorted, uniqueCount: map.size, silent };
  }, [transcript, studentRoles]);

  const maxCount = speakers[0]?.count || 1;

  return (
    <div className="glass animate-in mx-8 mt-2 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3
          className="text-sm font-semibold uppercase tracking-wider"
          style={{ color: 'var(--text-muted)' }}
        >
          Participation
        </h3>
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
          {transcript.length} argument{transcript.length !== 1 ? 's' : ''} &middot;{' '}
          {uniqueCount} speaker{uniqueCount !== 1 ? 's' : ''}
        </span>
      </div>

      {speakers.length === 0 ? (
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          No arguments recorded yet.
        </p>
      ) : (
        <div className="space-y-1.5">
          {speakers.map((s) => (
            <div key={s.name} className="flex items-center gap-3">
              <div className="flex-1 flex items-center gap-2">
                <div
                  className="h-5 rounded-md transition-all duration-300"
                  style={{
                    width: `${Math.max((s.count / maxCount) * 100, 8)}%`,
                    background: 'linear-gradient(90deg, rgba(212,160,60,0.35), rgba(212,160,60,0.15))',
                    border: '1px solid rgba(212,160,60,0.25)',
                  }}
                />
                <span className="text-sm font-medium whitespace-nowrap" style={{ color: 'var(--text-primary)' }}>
                  {s.name}
                </span>
              </div>
              <span className="text-xs tabular-nums" style={{ color: 'var(--text-muted)' }}>
                {s.count}
              </span>
            </div>
          ))}
        </div>
      )}

      {silent.length > 0 && (
        <div
          className="mt-3 rounded-xl px-3 py-2 text-sm"
          style={{ background: 'rgba(234,179,8,0.08)', color: 'rgba(234,179,8,0.8)' }}
        >
          Haven&apos;t spoken: {silent.join(', ')}
        </div>
      )}
    </div>
  );
}
