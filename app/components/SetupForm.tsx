'use client';

import { useState, useCallback } from 'react';
import { Scenario, Stage, NpcCharacter, VotingOption, StageType, TtsVoice } from '../lib/types';
import { axumPreset } from '../lib/presets';

interface SetupFormProps {
  onStart: (scenario: Scenario) => void;
}

const stageTypes: { value: StageType; label: string; icon: string }[] = [
  { value: 'freeform', label: 'Free Discussion', icon: '💬' },
  { value: 'debate', label: 'Structured Debate', icon: '⚔️' },
  { value: 'speech', label: 'Individual Speeches', icon: '🎙️' },
  { value: 'npc_response', label: 'NPC Response', icon: '🏛️' },
  { value: 'vote', label: 'Vote', icon: '🗳️' },
  { value: 'verdict', label: 'Verdict & Reveal', icon: '📜' },
];

export default function SetupForm({ onStart }: SetupFormProps) {
  const [scenario, setScenario] = useState<Scenario>({
    title: '',
    description: '',
    historicalContext: '',
    timePeriod: '',
    centralQuestion: '',
    votingOptions: [
      { id: '1', label: '', votes: 0 },
      { id: '2', label: '', votes: 0 },
    ],
    stages: [
      {
        id: '1',
        type: 'freeform',
        title: 'Opening Discussion',
        description: '',
        durationSeconds: 300,
      },
    ],
    npcs: [],
    historicalOutcome: '',
  });

  const [npcPrompt, setNpcPrompt] = useState('');
  const [generatingNpcs, setGeneratingNpcs] = useState(false);

  const loadPreset = useCallback(() => {
    setScenario(axumPreset);
  }, []);

  const updateField = useCallback(
    <K extends keyof Scenario>(field: K, value: Scenario[K]) => {
      setScenario((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const addVotingOption = useCallback(() => {
    setScenario((prev) => ({
      ...prev,
      votingOptions: [
        ...prev.votingOptions,
        { id: crypto.randomUUID(), label: '', votes: 0 },
      ],
    }));
  }, []);

  const updateVotingOption = useCallback((id: string, label: string) => {
    setScenario((prev) => ({
      ...prev,
      votingOptions: prev.votingOptions.map((o) =>
        o.id === id ? { ...o, label } : o
      ),
    }));
  }, []);

  const removeVotingOption = useCallback((id: string) => {
    setScenario((prev) => ({
      ...prev,
      votingOptions: prev.votingOptions.filter((o) => o.id !== id),
    }));
  }, []);

  const addStage = useCallback(() => {
    setScenario((prev) => ({
      ...prev,
      stages: [
        ...prev.stages,
        {
          id: crypto.randomUUID(),
          type: 'freeform',
          title: '',
          description: '',
          durationSeconds: 300,
        },
      ],
    }));
  }, []);

  const updateStage = useCallback((id: string, updates: Partial<Stage>) => {
    setScenario((prev) => ({
      ...prev,
      stages: prev.stages.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    }));
  }, []);

  const removeStage = useCallback((id: string) => {
    setScenario((prev) => ({
      ...prev,
      stages: prev.stages.filter((s) => s.id !== id),
    }));
  }, []);

  const addNpc = useCallback(() => {
    setScenario((prev) => ({
      ...prev,
      npcs: [
        ...prev.npcs,
        {
          id: crypto.randomUUID(),
          name: '',
          title: '',
          personality: '',
          historicalContext: '',
          stance: '',
          avatarEmoji: '👤',
          voice: 'onyx',
        },
      ],
    }));
  }, []);

  const updateNpc = useCallback((id: string, updates: Partial<NpcCharacter>) => {
    setScenario((prev) => ({
      ...prev,
      npcs: prev.npcs.map((n) => (n.id === id ? { ...n, ...updates } : n)),
    }));
  }, []);

  const removeNpc = useCallback((id: string) => {
    setScenario((prev) => ({
      ...prev,
      npcs: prev.npcs.filter((n) => n.id !== id),
    }));
  }, []);

  const generateNpcs = useCallback(async () => {
    if (!scenario.title && !npcPrompt) return;
    setGeneratingNpcs(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemPrompt:
            'You are a historian who creates detailed character profiles for classroom roleplaying. Return ONLY a valid JSON array.',
          userPrompt: `Generate 3 historically accurate NPC characters for a classroom roleplaying activity.

SCENARIO: ${scenario.title || npcPrompt}
TIME PERIOD: ${scenario.timePeriod}
CONTEXT: ${scenario.historicalContext || npcPrompt}
CENTRAL QUESTION: ${scenario.centralQuestion}

For each character, provide a JSON array with objects containing:
- name: historical or historically plausible name
- title: their role/position
- personality: 2-3 sentence personality description
- historicalContext: their historical background
- stance: their position on the central question
- avatarEmoji: a single emoji representing them

Return ONLY valid JSON array, no markdown formatting or code blocks.`,
        }),
      });
      const data = await res.json();
      if (data.text) {
        const cleaned = data.text.replace(/```json?\n?/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleaned);
        if (Array.isArray(parsed)) {
          setScenario((prev) => ({
            ...prev,
            npcs: parsed.map((n: Partial<NpcCharacter>, i: number) => {
              const voices: TtsVoice[] = ['onyx', 'fable', 'echo', 'nova', 'alloy', 'shimmer'];
              return {
                id: crypto.randomUUID(),
                name: n.name || '',
                title: n.title || '',
                personality: n.personality || '',
                historicalContext: n.historicalContext || '',
                stance: n.stance || '',
                avatarEmoji: n.avatarEmoji || '👤',
                voice: voices[i % voices.length],
              };
            }),
          }));
        }
      }
    } catch (error) {
      console.error('Failed to generate NPCs:', error);
    } finally {
      setGeneratingNpcs(false);
    }
  }, [scenario, npcPrompt]);

  const canStart =
    scenario.title &&
    scenario.centralQuestion &&
    scenario.stages.length > 0 &&
    scenario.npcs.length > 0 &&
    scenario.votingOptions.filter((o) => o.label).length >= 2;

  const inputClass =
    'w-full rounded-xl px-4 py-3 text-base focus:outline-none placeholder-white/15';
  const inputStyle = {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid var(--panel-border)',
    color: 'var(--text-primary)',
  };
  const labelClass = 'block mb-1.5 text-sm font-medium';
  const labelStyle = { color: 'var(--text-secondary)' };
  const sectionClass = 'glass rounded-2xl p-6 space-y-4';
  const addBtnClass = 'rounded-lg px-4 py-2 text-sm font-medium transition-all hover:scale-[1.02]';
  const addBtnStyle = { background: 'rgba(212,160,60,0.12)', color: 'var(--accent)' };

  return (
    <div className="noise mx-auto max-w-5xl space-y-6 p-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="heading-display mb-3 text-5xl font-bold" style={{ color: 'var(--accent)' }}>
          Historical Roleplaying Helper
        </h1>
        <p className="mb-6 text-lg" style={{ color: 'var(--text-secondary)' }}>
          Configure a scenario for your classroom
        </p>

        {/* Preset Card */}
        <button
          onClick={loadPreset}
          className="glass group mx-auto flex max-w-lg items-center gap-5 rounded-2xl p-4 text-left transition-all hover:scale-[1.01] hover:border-[rgba(212,160,60,0.3)]"
        >
          <div
            className="h-20 w-20 flex-shrink-0 rounded-xl bg-cover bg-center"
            style={{ backgroundImage: 'url(/images/axum.png)' }}
          />
          <div>
            <p className="text-xs font-medium uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
              Demo Scenario
            </p>
            <p className="heading-display text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              The Conversion of Axum
            </p>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              340 CE — Should King Ezana convert to Christianity?
            </p>
          </div>
          <span className="ml-auto text-xl" style={{ color: 'var(--text-muted)' }}>→</span>
        </button>
      </div>

      {/* Scenario Details */}
      <section className={sectionClass}>
        <h2 className="heading-display text-xl font-semibold" style={{ color: 'var(--accent)' }}>
          Scenario Details
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className={labelClass} style={labelStyle}>Title</label>
            <input className={inputClass} style={inputStyle} value={scenario.title}
              onChange={(e) => updateField('title', e.target.value)}
              placeholder="e.g., The Conversion of Axum" />
          </div>
          <div>
            <label className={labelClass} style={labelStyle}>Time Period</label>
            <input className={inputClass} style={inputStyle} value={scenario.timePeriod}
              onChange={(e) => updateField('timePeriod', e.target.value)}
              placeholder="e.g., 340 CE, Kingdom of Axum" />
          </div>
        </div>
        <div>
          <label className={labelClass} style={labelStyle}>Description</label>
          <textarea className={inputClass + ' min-h-[80px]'} style={inputStyle}
            value={scenario.description}
            onChange={(e) => updateField('description', e.target.value)}
            placeholder="Brief overview of the scenario..." />
        </div>
        <div>
          <label className={labelClass} style={labelStyle}>Historical Context</label>
          <textarea className={inputClass + ' min-h-[80px]'} style={inputStyle}
            value={scenario.historicalContext}
            onChange={(e) => updateField('historicalContext', e.target.value)}
            placeholder="Background information for students and the LLM..." />
        </div>
        <div>
          <label className={labelClass} style={labelStyle}>Central Question</label>
          <input className={inputClass} style={inputStyle}
            value={scenario.centralQuestion}
            onChange={(e) => updateField('centralQuestion', e.target.value)}
            placeholder="e.g., Should King Ezana convert Axum to Christianity?" />
        </div>
        <div>
          <label className={labelClass} style={labelStyle}>Historical Outcome (revealed at end)</label>
          <textarea className={inputClass + ' min-h-[80px]'} style={inputStyle}
            value={scenario.historicalOutcome}
            onChange={(e) => updateField('historicalOutcome', e.target.value)}
            placeholder="What actually happened historically..." />
        </div>
      </section>

      {/* Voting Options */}
      <section className={sectionClass}>
        <div className="flex items-center justify-between">
          <h2 className="heading-display text-xl font-semibold" style={{ color: 'var(--accent)' }}>
            Voting Options
          </h2>
          <button onClick={addVotingOption} className={addBtnClass} style={addBtnStyle}>
            + Add Option
          </button>
        </div>
        {scenario.votingOptions.map((option) => (
          <div key={option.id} className="flex items-center gap-2">
            <input className={inputClass} style={inputStyle} value={option.label}
              onChange={(e) => updateVotingOption(option.id, e.target.value)}
              placeholder="Voting option label..." />
            {scenario.votingOptions.length > 2 && (
              <button onClick={() => removeVotingOption(option.id)}
                className="text-red-400/40 transition-colors hover:text-red-400">
                ✕
              </button>
            )}
          </div>
        ))}
      </section>

      {/* Stages */}
      <section className={sectionClass}>
        <div className="flex items-center justify-between">
          <h2 className="heading-display text-xl font-semibold" style={{ color: 'var(--accent)' }}>
            Activity Stages
          </h2>
          <button onClick={addStage} className={addBtnClass} style={addBtnStyle}>
            + Add Stage
          </button>
        </div>
        {scenario.stages.map((stage, i) => (
          <div key={stage.id} className="rounded-xl p-4 space-y-3"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--panel-border)' }}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
                Stage {i + 1}
              </span>
              {scenario.stages.length > 1 && (
                <button onClick={() => removeStage(stage.id)}
                  className="text-xs text-red-400/40 transition-colors hover:text-red-400">
                  Remove
                </button>
              )}
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              <div>
                <label className={labelClass} style={labelStyle}>Type</label>
                <select className={inputClass} style={inputStyle} value={stage.type}
                  onChange={(e) => updateStage(stage.id, { type: e.target.value as StageType })}>
                  {stageTypes.map((t) => (
                    <option key={t.value} value={t.value}>{t.icon} {t.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass} style={labelStyle}>Title</label>
                <input className={inputClass} style={inputStyle} value={stage.title}
                  onChange={(e) => updateStage(stage.id, { title: e.target.value })}
                  placeholder="Stage title..." />
              </div>
              <div>
                <label className={labelClass} style={labelStyle}>Duration (minutes)</label>
                <input type="number" className={inputClass} style={inputStyle}
                  value={stage.durationSeconds / 60}
                  onChange={(e) => updateStage(stage.id, { durationSeconds: Number(e.target.value) * 60 })}
                  min={1} max={60} />
              </div>
            </div>
            <div>
              <label className={labelClass} style={labelStyle}>Description</label>
              <input className={inputClass} style={inputStyle} value={stage.description}
                onChange={(e) => updateStage(stage.id, { description: e.target.value })}
                placeholder="What happens in this stage..." />
            </div>
          </div>
        ))}
      </section>

      {/* NPCs */}
      <section className={sectionClass}>
        <div className="flex items-center justify-between">
          <h2 className="heading-display text-xl font-semibold" style={{ color: 'var(--accent)' }}>
            NPC Characters
          </h2>
          <button onClick={addNpc} className={addBtnClass} style={addBtnStyle}>
            + Add Manually
          </button>
        </div>

        {/* AI Generation */}
        <div className="flex gap-2">
          <input className={inputClass} style={inputStyle} value={npcPrompt}
            onChange={(e) => setNpcPrompt(e.target.value)}
            placeholder="Describe the scenario for AI NPC generation (or leave blank)..." />
          <button onClick={generateNpcs} disabled={generatingNpcs}
            className="whitespace-nowrap rounded-xl px-5 py-3 text-base font-semibold transition-all hover:scale-[1.02] disabled:opacity-50"
            style={{ background: 'rgba(212,160,60,0.2)', color: 'var(--accent)', border: '1px solid rgba(212,160,60,0.2)' }}>
            {generatingNpcs ? 'Generating...' : 'Generate NPCs'}
          </button>
        </div>

        {scenario.npcs.map((npc) => (
          <div key={npc.id} className="rounded-xl p-4 space-y-3"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--panel-border)' }}>
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-full text-xl"
                style={{ background: 'rgba(212,160,60,0.1)' }}>
                {npc.avatarEmoji}
              </div>
              <button onClick={() => removeNpc(npc.id)}
                className="text-xs text-red-400/40 transition-colors hover:text-red-400">
                Remove
              </button>
            </div>
            <div className="grid gap-3 md:grid-cols-4">
              <div>
                <label className={labelClass} style={labelStyle}>Name</label>
                <input className={inputClass} style={inputStyle} value={npc.name}
                  onChange={(e) => updateNpc(npc.id, { name: e.target.value })}
                  placeholder="Character name" />
              </div>
              <div>
                <label className={labelClass} style={labelStyle}>Title / Role</label>
                <input className={inputClass} style={inputStyle} value={npc.title}
                  onChange={(e) => updateNpc(npc.id, { title: e.target.value })}
                  placeholder="e.g., High Priest" />
              </div>
              <div>
                <label className={labelClass} style={labelStyle}>Emoji</label>
                <input className={inputClass} style={inputStyle} value={npc.avatarEmoji}
                  onChange={(e) => updateNpc(npc.id, { avatarEmoji: e.target.value })}
                  placeholder="👤" />
              </div>
              <div>
                <label className={labelClass} style={labelStyle}>Voice</label>
                <select className={inputClass} style={inputStyle} value={npc.voice || 'onyx'}
                  onChange={(e) => updateNpc(npc.id, { voice: e.target.value as TtsVoice })}>
                  <option value="onyx">Onyx (deep)</option>
                  <option value="echo">Echo (warm)</option>
                  <option value="fable">Fable (expressive)</option>
                  <option value="alloy">Alloy (balanced)</option>
                  <option value="nova">Nova (warm, female)</option>
                  <option value="shimmer">Shimmer (clear, female)</option>
                </select>
              </div>
            </div>
            <div>
              <label className={labelClass} style={labelStyle}>Personality</label>
              <textarea className={inputClass + ' min-h-[60px]'} style={inputStyle}
                value={npc.personality}
                onChange={(e) => updateNpc(npc.id, { personality: e.target.value })}
                placeholder="Character personality description..." />
            </div>
            <div>
              <label className={labelClass} style={labelStyle}>Historical Context</label>
              <textarea className={inputClass + ' min-h-[60px]'} style={inputStyle}
                value={npc.historicalContext}
                onChange={(e) => updateNpc(npc.id, { historicalContext: e.target.value })}
                placeholder="Historical background..." />
            </div>
            <div>
              <label className={labelClass} style={labelStyle}>Stance on Central Question</label>
              <input className={inputClass} style={inputStyle} value={npc.stance}
                onChange={(e) => updateNpc(npc.id, { stance: e.target.value })}
                placeholder="Their position..." />
            </div>
          </div>
        ))}
      </section>

      {/* Start */}
      <div className="py-4 text-center">
        <button
          onClick={() => canStart && onStart(scenario)}
          disabled={!canStart}
          className={`heading-display rounded-2xl px-14 py-5 text-3xl font-bold transition-all ${
            canStart ? 'hover:scale-[1.02]' : 'cursor-not-allowed opacity-30'
          }`}
          style={canStart ? {
            background: 'linear-gradient(135deg, rgba(212,160,60,0.3), rgba(180,120,40,0.15))',
            color: 'var(--accent)',
            border: '1px solid rgba(212,160,60,0.3)',
            boxShadow: '0 0 60px rgba(212,160,60,0.1)',
          } : {
            background: 'rgba(255,255,255,0.04)',
            color: 'var(--text-muted)',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          Begin Session
        </button>
        {!canStart && (
          <p className="mt-3 text-sm" style={{ color: 'var(--text-muted)' }}>
            Need: title, central question, 2+ voting options, 1+ stages, 1+ NPCs
          </p>
        )}
      </div>
    </div>
  );
}
