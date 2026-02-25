'use client';

import { useMemo } from 'react';
import { TranscriptEntry, Stage, VotingOption } from '../lib/types';

interface SessionAnalysisProps {
  transcript: TranscriptEntry[];
  stages: Stage[];
  votingOptions: VotingOption[];
}

interface DemoBucket {
  label: string;
  count: number;
  forCount: number;
  againstCount: number;
  mixedCount: number;
}

function Bar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div
      className="h-4 rounded-md transition-all duration-300"
      style={{
        width: `${Math.max(pct, 2)}%`,
        background: `linear-gradient(90deg, ${color}, ${color}80)`,
        border: `1px solid ${color}50`,
      }}
    />
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
        {title}
      </h4>
      {children}
    </div>
  );
}

export default function SessionAnalysis({ transcript, stages, votingOptions }: SessionAnalysisProps) {
  const analysis = useMemo(() => {
    const tagged = transcript.filter((e) => e.stance);
    const forEntries = transcript.filter((e) => e.stance === 'for');
    const againstEntries = transcript.filter((e) => e.stance === 'against');
    const mixedEntries = transcript.filter((e) => e.stance === 'mixed');
    const untagged = transcript.filter((e) => !e.stance);

    // Rhetoric breakdown
    const rhetoricCounts = {
      evidence: transcript.filter((e) => e.rhetoric === 'evidence').length,
      values: transcript.filter((e) => e.rhetoric === 'values').length,
      consequences: transcript.filter((e) => e.rhetoric === 'consequences').length,
      authority: transcript.filter((e) => e.rhetoric === 'authority').length,
    };

    // Top arguments by votes
    const topArgs = [...transcript]
      .filter((e) => (e.votes ?? 0) !== 0)
      .sort((a, b) => (b.votes ?? 0) - (a.votes ?? 0))
      .slice(0, 5);

    // Per-stage sentiment
    const stageBreakdown = stages
      .map((stage) => {
        const stageEntries = transcript.filter((e) => e.stageId === stage.id);
        if (stageEntries.length === 0) return null;
        return {
          title: stage.title,
          total: stageEntries.length,
          for: stageEntries.filter((e) => e.stance === 'for').length,
          against: stageEntries.filter((e) => e.stance === 'against').length,
          mixed: stageEntries.filter((e) => e.stance === 'mixed').length,
        };
      })
      .filter(Boolean) as { title: string; total: number; for: number; against: number; mixed: number }[];

    // Demographics
    const buildDemoBuckets = (
      key: 'profession' | 'gender' | 'age'
    ): DemoBucket[] => {
      const map = new Map<string, DemoBucket>();
      for (const e of transcript) {
        let val = e[key];
        if (!val) continue;
        // Group ages into brackets
        if (key === 'age') {
          const n = parseInt(val, 10);
          if (isNaN(n)) continue;
          if (n < 25) val = 'Under 25';
          else if (n < 35) val = '25-34';
          else if (n < 45) val = '35-44';
          else if (n < 55) val = '45-54';
          else val = '55+';
        }
        const existing = map.get(val) || { label: val, count: 0, forCount: 0, againstCount: 0, mixedCount: 0 };
        existing.count++;
        if (e.stance === 'for') existing.forCount++;
        else if (e.stance === 'against') existing.againstCount++;
        else if (e.stance === 'mixed') existing.mixedCount++;
        map.set(val, existing);
      };
      return [...map.values()].sort((a, b) => b.count - a.count);
    };

    const professionBuckets = buildDemoBuckets('profession');
    const genderBuckets = buildDemoBuckets('gender');
    const ageBuckets = buildDemoBuckets('age');

    // Vote-weighted sentiment
    const forVoteScore = forEntries.reduce((sum, e) => sum + (e.votes ?? 0), 0);
    const againstVoteScore = againstEntries.reduce((sum, e) => sum + (e.votes ?? 0), 0);

    return {
      total: transcript.length,
      tagged: tagged.length,
      forCount: forEntries.length,
      againstCount: againstEntries.length,
      mixedCount: mixedEntries.length,
      untaggedCount: untagged.length,
      rhetoricCounts,
      topArgs,
      stageBreakdown,
      professionBuckets,
      genderBuckets,
      ageBuckets,
      forVoteScore,
      againstVoteScore,
    };
  }, [transcript, stages]);

  const maxStance = Math.max(analysis.forCount, analysis.againstCount, analysis.mixedCount, 1);
  const maxRhetoric = Math.max(...Object.values(analysis.rhetoricCounts), 1);

  return (
    <div className="animate-in space-y-5">
      {/* Stance breakdown */}
      <Section title="Argument Stance">
        <div className="space-y-1.5">
          <div className="flex items-center gap-3">
            <span className="w-16 text-right text-xs font-medium" style={{ color: '#6ee7b7' }}>For</span>
            <div className="flex-1"><Bar value={analysis.forCount} max={maxStance} color="#6ee7b7" /></div>
            <span className="w-8 text-right text-xs tabular-nums" style={{ color: 'var(--text-muted)' }}>{analysis.forCount}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-16 text-right text-xs font-medium" style={{ color: '#f87171' }}>Against</span>
            <div className="flex-1"><Bar value={analysis.againstCount} max={maxStance} color="#f87171" /></div>
            <span className="w-8 text-right text-xs tabular-nums" style={{ color: 'var(--text-muted)' }}>{analysis.againstCount}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-16 text-right text-xs font-medium" style={{ color: '#a5b4fc' }}>Mixed</span>
            <div className="flex-1"><Bar value={analysis.mixedCount} max={maxStance} color="#a5b4fc" /></div>
            <span className="w-8 text-right text-xs tabular-nums" style={{ color: 'var(--text-muted)' }}>{analysis.mixedCount}</span>
          </div>
          {analysis.untaggedCount > 0 && (
            <p className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>
              {analysis.untaggedCount} untagged argument{analysis.untaggedCount !== 1 ? 's' : ''}
            </p>
          )}
        </div>
        {(analysis.forVoteScore !== 0 || analysis.againstVoteScore !== 0) && (
          <div className="mt-2 rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.03)' }}>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Vote-weighted sentiment:{' '}
              <span style={{ color: '#6ee7b7' }}>For {analysis.forVoteScore > 0 ? '+' : ''}{analysis.forVoteScore}</span>
              {' / '}
              <span style={{ color: '#f87171' }}>Against {analysis.againstVoteScore > 0 ? '+' : ''}{analysis.againstVoteScore}</span>
            </p>
          </div>
        )}
      </Section>

      {/* Rhetorical mode */}
      {Object.values(analysis.rhetoricCounts).some((c) => c > 0) && (
        <Section title="Rhetorical Approach">
          <div className="space-y-1.5">
            {([
              { key: 'evidence', label: 'Evidence', color: '#93c5fd' },
              { key: 'values', label: 'Values', color: '#c4b5fd' },
              { key: 'consequences', label: 'Consequences', color: '#fbbf24' },
              { key: 'authority', label: 'Authority', color: '#a78bfa' },
            ] as const).map(({ key, label, color }) => (
              <div key={key} className="flex items-center gap-3">
                <span className="w-24 text-right text-xs font-medium" style={{ color }}>{label}</span>
                <div className="flex-1"><Bar value={analysis.rhetoricCounts[key]} max={maxRhetoric} color={color} /></div>
                <span className="w-8 text-right text-xs tabular-nums" style={{ color: 'var(--text-muted)' }}>{analysis.rhetoricCounts[key]}</span>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Sentiment by stage */}
      {analysis.stageBreakdown.length > 1 && (
        <Section title="Sentiment by Stage">
          <div className="space-y-2">
            {analysis.stageBreakdown.map((stage) => {
              const total = stage.for + stage.against + stage.mixed || 1;
              return (
                <div key={stage.title}>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>{stage.title}</span>
                    <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{stage.total} args</span>
                  </div>
                  <div className="flex h-3 overflow-hidden rounded-full" style={{ background: 'rgba(255,255,255,0.04)' }}>
                    {stage.for > 0 && (
                      <div style={{ width: `${(stage.for / total) * 100}%`, background: '#6ee7b7' }} />
                    )}
                    {stage.mixed > 0 && (
                      <div style={{ width: `${(stage.mixed / total) * 100}%`, background: '#a5b4fc' }} />
                    )}
                    {stage.against > 0 && (
                      <div style={{ width: `${(stage.against / total) * 100}%`, background: '#f87171' }} />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Section>
      )}

      {/* Top arguments */}
      {analysis.topArgs.length > 0 && (
        <Section title="Top Arguments by Votes">
          <div className="space-y-2">
            {analysis.topArgs.map((e) => (
              <div key={e.id} className="flex items-start gap-3 rounded-lg p-2" style={{ background: 'rgba(255,255,255,0.02)' }}>
                <span
                  className="mt-0.5 text-sm font-bold tabular-nums"
                  style={{ color: (e.votes ?? 0) > 0 ? 'var(--accent)' : '#f87171' }}
                >
                  {(e.votes ?? 0) > 0 ? '+' : ''}{e.votes}
                </span>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-semibold" style={{ color: 'var(--accent)' }}>{e.speaker}</span>
                  {e.stance && (
                    <span
                      className="ml-1.5 rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase"
                      style={{
                        background: e.stance === 'for' ? 'rgba(110,231,183,0.12)' : e.stance === 'against' ? 'rgba(248,113,113,0.12)' : 'rgba(165,180,252,0.12)',
                        color: e.stance === 'for' ? '#6ee7b7' : e.stance === 'against' ? '#f87171' : '#a5b4fc',
                      }}
                    >
                      {e.stance}
                    </span>
                  )}
                  <p className="mt-0.5 text-xs leading-snug" style={{ color: 'var(--text-secondary)', overflowWrap: 'break-word' }}>
                    {e.text.length > 150 ? e.text.slice(0, 150) + '...' : e.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Demographic breakdowns */}
      {[
        { buckets: analysis.professionBuckets, title: 'By Profession' },
        { buckets: analysis.genderBuckets, title: 'By Gender' },
        { buckets: analysis.ageBuckets, title: 'By Age Group' },
      ]
        .filter(({ buckets }) => buckets.length > 0)
        .map(({ buckets, title }) => (
          <Section key={title} title={title}>
            <div className="space-y-1">
              {buckets.map((b) => (
                <div key={b.label} className="flex items-center gap-2">
                  <span className="w-20 truncate text-right text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                    {b.label}
                  </span>
                  <div className="flex h-4 flex-1 overflow-hidden rounded-full" style={{ background: 'rgba(255,255,255,0.04)' }}>
                    {b.forCount > 0 && (
                      <div style={{ width: `${(b.forCount / b.count) * 100}%`, background: '#6ee7b7' }} title={`For: ${b.forCount}`} />
                    )}
                    {b.mixedCount > 0 && (
                      <div style={{ width: `${(b.mixedCount / b.count) * 100}%`, background: '#a5b4fc' }} title={`Mixed: ${b.mixedCount}`} />
                    )}
                    {b.againstCount > 0 && (
                      <div style={{ width: `${(b.againstCount / b.count) * 100}%`, background: '#f87171' }} title={`Against: ${b.againstCount}`} />
                    )}
                    {(b.count - b.forCount - b.mixedCount - b.againstCount) > 0 && (
                      <div style={{ width: `${((b.count - b.forCount - b.mixedCount - b.againstCount) / b.count) * 100}%`, background: 'rgba(255,255,255,0.06)' }} />
                    )}
                  </div>
                  <span className="w-6 text-right text-[10px] tabular-nums" style={{ color: 'var(--text-muted)' }}>{b.count}</span>
                </div>
              ))}
            </div>
          </Section>
        ))}

      {/* Legend */}
      <div className="flex flex-wrap gap-3 pt-1 text-[10px]" style={{ color: 'var(--text-muted)' }}>
        <span className="flex items-center gap-1"><span className="inline-block h-2 w-2 rounded-full" style={{ background: '#6ee7b7' }} /> For</span>
        <span className="flex items-center gap-1"><span className="inline-block h-2 w-2 rounded-full" style={{ background: '#f87171' }} /> Against</span>
        <span className="flex items-center gap-1"><span className="inline-block h-2 w-2 rounded-full" style={{ background: '#a5b4fc' }} /> Mixed</span>
        <span className="flex items-center gap-1"><span className="inline-block h-2 w-2 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }} /> Untagged</span>
      </div>
    </div>
  );
}
