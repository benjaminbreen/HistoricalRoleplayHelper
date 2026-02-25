'use client';

import { useState } from 'react';
import { Scenario } from '../lib/types';

interface PresetMeta {
  preset: Scenario;
  image: string;
  tagline: string;
}

interface ScenarioBrowserProps {
  presets: PresetMeta[];
  onSelect: (scenario: Scenario) => void;
  onClose: () => void;
}

export default function ScenarioBrowser({ presets, onSelect, onClose }: ScenarioBrowserProps) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const selected = presets[selectedIdx];

  const totalMinutes = Math.round(
    selected.preset.stages.reduce((s, st) => s + st.durationSeconds, 0) / 60
  );
  const npcCount = selected.preset.npcs.length;
  const roleCount = selected.preset.studentRoles.length;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      <div
        className="glass animate-in-scale flex w-full max-w-4xl overflow-hidden rounded-2xl"
        style={{ maxHeight: '80vh', border: '1px solid rgba(212,160,60,0.15)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left: scenario list */}
        <div
          className="w-64 flex-shrink-0 overflow-y-auto"
          style={{ borderRight: '1px solid var(--panel-border)', background: 'rgba(0,0,0,0.2)' }}
        >
          <div className="p-4 pb-2">
            <h2
              className="heading-display text-lg font-semibold"
              style={{ color: 'var(--accent)' }}
            >
              Scenarios
            </h2>
            <p className="mt-0.5 text-xs" style={{ color: 'var(--text-muted)' }}>
              {presets.length} available
            </p>
          </div>
          <div className="space-y-1 px-2 pb-4">
            {presets.map((p, i) => {
              const active = i === selectedIdx;
              return (
                <button
                  key={p.preset.title}
                  onClick={() => setSelectedIdx(i)}
                  className="flex w-full items-center gap-3 rounded-xl p-2.5 text-left transition-all"
                  style={{
                    background: active ? 'rgba(212,160,60,0.12)' : 'transparent',
                    border: active
                      ? '1px solid rgba(212,160,60,0.2)'
                      : '1px solid transparent',
                  }}
                >
                  <div
                    className="h-10 w-10 flex-shrink-0 rounded-lg bg-cover bg-center"
                    style={{ backgroundImage: `url(${p.image})` }}
                  />
                  <div className="min-w-0 flex-1">
                    <p
                      className="truncate text-sm font-semibold"
                      style={{ color: active ? 'var(--accent)' : 'var(--text-primary)' }}
                    >
                      {p.preset.title}
                    </p>
                    <p
                      className="truncate text-[11px]"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {p.preset.timePeriod}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: detail view */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Header with image */}
          <div className="mb-5 flex items-start gap-5">
            <div
              className="h-24 w-24 flex-shrink-0 rounded-xl bg-cover bg-center"
              style={{
                backgroundImage: `url(${selected.image})`,
                border: '2px solid rgba(212,160,60,0.15)',
              }}
            />
            <div className="flex-1 min-w-0">
              <p
                className="text-xs font-medium uppercase tracking-widest"
                style={{ color: 'var(--text-muted)' }}
              >
                {selected.preset.timePeriod}
              </p>
              <h3
                className="heading-display mt-1 text-2xl font-bold leading-tight"
                style={{ color: 'var(--accent)' }}
              >
                {selected.preset.title}
              </h3>
              <p className="mt-1 text-sm leading-snug" style={{ color: 'var(--text-secondary)' }}>
                {selected.tagline}
              </p>
            </div>
          </div>

          {/* Central question */}
          <div
            className="mb-4 rounded-xl p-4"
            style={{
              background: 'rgba(212,160,60,0.06)',
              border: '1px solid rgba(212,160,60,0.12)',
            }}
          >
            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
              Central Question
            </p>
            <p className="mt-1 text-base font-medium" style={{ color: 'var(--text-primary)' }}>
              {selected.preset.centralQuestion}
            </p>
          </div>

          {/* Description */}
          <p className="mb-4 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {selected.preset.description}
          </p>

          {/* Stats row */}
          <div className="mb-4 flex gap-3">
            {[
              { label: 'Stages', value: selected.preset.stages.length },
              { label: 'NPCs', value: npcCount },
              { label: 'Roles', value: roleCount },
              { label: 'Minutes', value: totalMinutes },
            ].map((s) => (
              <div
                key={s.label}
                className="flex-1 rounded-lg p-2.5 text-center"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--panel-border)' }}
              >
                <p className="font-mono text-lg font-bold" style={{ color: 'var(--accent)' }}>
                  {s.value}
                </p>
                <p className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>

          {/* Key figures */}
          <div className="mb-5">
            <h4
              className="mb-2 text-xs font-semibold uppercase tracking-wider"
              style={{ color: 'var(--text-muted)' }}
            >
              Key Figures
            </h4>
            <div className="space-y-1.5">
              {selected.preset.npcs.map((npc) => (
                <div key={npc.id} className="flex items-center gap-2.5">
                  {npc.avatarImage ? (
                    <img
                      src={npc.avatarImage}
                      alt={npc.name}
                      className="h-7 w-7 rounded-full object-cover"
                      style={{ border: '1px solid rgba(212,160,60,0.2)' }}
                    />
                  ) : (
                    <span className="flex h-7 w-7 items-center justify-center rounded-full text-sm"
                      style={{ background: 'rgba(212,160,60,0.1)' }}>
                      {npc.avatarEmoji}
                    </span>
                  )}
                  <div className="min-w-0 flex-1">
                    <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {npc.name}
                    </span>
                    <span className="ml-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                      {npc.title}
                    </span>
                  </div>
                  <span
                    className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase"
                    style={{ background: 'rgba(212,160,60,0.08)', color: 'var(--accent)' }}
                  >
                    NPC
                  </span>
                </div>
              ))}
              {selected.preset.studentRoles.map((role) => (
                <div key={role.id} className="flex items-center gap-2.5">
                  <span
                    className="flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold"
                    style={{
                      background: role.suggestedFor === 'ta' ? 'rgba(99,182,255,0.1)' : 'rgba(255,255,255,0.05)',
                      color: role.suggestedFor === 'ta' ? '#63b6ff' : 'var(--text-muted)',
                    }}
                  >
                    {role.suggestedFor === 'ta' ? 'TA' : 'S'}
                  </span>
                  <div className="min-w-0 flex-1">
                    <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {role.name}
                    </span>
                    <span className="ml-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                      {role.title}
                    </span>
                  </div>
                  <span
                    className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase"
                    style={{
                      background: role.suggestedFor === 'ta' ? 'rgba(99,182,255,0.08)' : 'rgba(255,255,255,0.04)',
                      color: role.suggestedFor === 'ta' ? '#63b6ff' : 'var(--text-muted)',
                    }}
                  >
                    {role.suggestedFor === 'ta' ? 'TA' : 'Student'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Voting options preview */}
          <div className="mb-5">
            <h4
              className="mb-2 text-xs font-semibold uppercase tracking-wider"
              style={{ color: 'var(--text-muted)' }}
            >
              Voting Options
            </h4>
            <div className="flex flex-wrap gap-2">
              {selected.preset.votingOptions.map((opt) => (
                <span
                  key={opt.id}
                  className="rounded-full px-3 py-1 text-xs font-medium"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--panel-border)', color: 'var(--text-secondary)' }}
                >
                  {opt.label}
                </span>
              ))}
            </div>
          </div>

          {/* Load button */}
          <button
            onClick={() => {
              onSelect(selected.preset);
              onClose();
            }}
            className="heading-display w-full rounded-xl px-6 py-3.5 text-lg font-bold transition-all hover:scale-[1.01]"
            style={{
              background: 'linear-gradient(135deg, rgba(212,160,60,0.25), rgba(180,120,40,0.12))',
              color: 'var(--accent)',
              border: '1px solid rgba(212,160,60,0.25)',
            }}
          >
            Load This Scenario
          </button>
        </div>
      </div>
    </div>
  );
}
