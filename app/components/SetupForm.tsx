'use client';

import { useState, useCallback, useRef } from 'react';
import { Scenario, Stage, NpcCharacter, StudentRole, VotingOption, StageType, TtsVoice, CharacterSheet, isLeaderRole } from '../lib/types';
import { axumPreset, teotihuacanPreset, pompeiiPreset, trolleyPreset, oppenheimerPreset, facialRecognitionPreset } from '../lib/presets';
import type { RejoinSessionData } from './RejoinView';
import CharacterUploader from './CharacterUploader';
import CharacterReviewGrid from './CharacterReviewGrid';
import ThemeToggle from './ThemeToggle';

interface SetupFormProps {
  onStart: (scenario: Scenario, cast: CharacterSheet[]) => void;
  onRejoin?: (data: RejoinSessionData) => void;
}

const stageTypes: { value: StageType; label: string; icon: string }[] = [
  { value: 'freeform', label: 'Free Discussion', icon: '💬' },
  { value: 'debate', label: 'Structured Debate', icon: '⚔️' },
  { value: 'speech', label: 'Individual Speeches', icon: '🎙️' },
  { value: 'npc_response', label: 'NPC Response', icon: '🏛️' },
  { value: 'vote', label: 'Vote', icon: '🗳️' },
  { value: 'verdict', label: 'Verdict & Reveal', icon: '📜' },
  { value: 'debrief', label: 'Debrief & Reflect', icon: '🔄' },
];

type SectionId = 'details' | 'voting' | 'stages' | 'roles' | 'cast' | 'npcs';

const categoryMeta: Record<string, { label: string; description: string; icon: string }> = {
  'history':          { label: 'History',          description: 'Historical events and turning points',       icon: '📜' },
  'philosophy':       { label: 'Philosophy',       description: 'Ethics, morality, and thought experiments',  icon: '⚖️' },
  'science-ethics':   { label: 'Science & Ethics', description: 'Scientific responsibility and technology',   icon: '⚛️' },
  'criminal-justice': { label: 'Criminal Justice', description: 'Policing, surveillance, and justice reform', icon: '🏛️' },
};

export default function SetupForm({ onStart, onRejoin }: SetupFormProps) {
  const [view, setView] = useState<'landing' | 'category' | 'gallery' | 'editor'>('landing');
  const [selectedMode, setSelectedMode] = useState<'education' | 'civic' | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState<Set<SectionId>>(new Set());
  const [cast, setCast] = useState<CharacterSheet[]>([]);

  const toggleSection = useCallback((id: SectionId) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const [scenario, setScenario] = useState<Scenario>({
    title: '',
    description: '',
    context: '',
    setting: '',
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
    roles: [],
  });

  const allPresets = [
    { preset: axumPreset, image: '/images/axum.png', tagline: 'Should King Ezana convert to Christianity?' },
    { preset: teotihuacanPreset, image: '/images/teotihuacan.png', tagline: 'What is the future of Teotihuacan after the great fire?' },
    { preset: pompeiiPreset, image: '/images/pompeii.png', tagline: 'Should the fleet sail toward Vesuvius to attempt a rescue?' },
    { preset: trolleyPreset, image: '/images/trolley.png', tagline: 'Is it morally permissible to sacrifice one to save five?' },
    { preset: oppenheimerPreset, image: '/images/oppenheimer.png', tagline: 'Should the father of the atomic bomb keep his security clearance?' },
    { preset: facialRecognitionPreset, image: '/images/facial-recognition.png', tagline: 'Should Santa Cruz ban facial recognition technology?' },
  ];

  const [npcPrompt, setNpcPrompt] = useState('');
  const [generatingNpcs, setGeneratingNpcs] = useState(false);
  const [npcGenError, setNpcGenError] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string);
        if (!data.scenario || !data.transcript || !data.votingOptions) {
          setUploadError('Invalid session file. Must contain scenario, transcript, and votingOptions.');
          return;
        }
        if (!data.scenario.npcs || !data.scenario.centralQuestion) {
          setUploadError('Session file is missing full scenario data. Re-export using the latest version.');
          return;
        }
        onRejoin?.(data);
      } catch {
        setUploadError('Could not parse JSON file. Make sure it is a valid session export.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }, [onRejoin]);

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
          context: '',
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

  const addRole = useCallback(() => {
    setScenario((prev) => ({
      ...prev,
      roles: [
        ...prev.roles,
        {
          id: crypto.randomUUID(),
          name: '',
          title: '',
          description: '',
          suggestedFor: 'student',
          assignedTo: '',
        },
      ],
    }));
  }, []);

  const updateRole = useCallback((id: string, updates: Partial<StudentRole>) => {
    setScenario((prev) => ({
      ...prev,
      roles: prev.roles.map((r) => (r.id === id ? { ...r, ...updates } : r)),
    }));
  }, []);

  const removeRole = useCallback((id: string) => {
    setScenario((prev) => ({
      ...prev,
      roles: prev.roles.filter((r) => r.id !== id),
    }));
  }, []);

  const generateNpcs = useCallback(async () => {
    if (!scenario.title && !npcPrompt) return;
    if (scenario.npcs.length > 0 && !window.confirm('This will replace your existing NPCs. Continue?')) return;
    setGeneratingNpcs(true);
    setNpcGenError(null);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemPrompt:
            'You are a historian who creates detailed character profiles for classroom roleplaying. Return ONLY a valid JSON array.',
          userPrompt: `Generate 3 historically accurate NPC characters for a classroom roleplaying activity.

SCENARIO: ${scenario.title || npcPrompt}
SETTING: ${scenario.setting}
CONTEXT: ${scenario.context || npcPrompt}
CENTRAL QUESTION: ${scenario.centralQuestion}

For each character, provide a JSON array with objects containing:
- name: historical or historically plausible name
- title: their role/position
- personality: 2-3 sentence personality description
- context: their historical background
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
                context: n.context || '',
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
      setNpcGenError('Failed to generate NPCs. Check your Gemini API key and try again.');
    } finally {
      setGeneratingNpcs(false);
    }
  }, [scenario, npcPrompt]);

  const canStart =
    scenario.title &&
    scenario.centralQuestion &&
    scenario.stages.length > 0 &&
    (scenario.npcs.length > 0 || scenario.roles.length > 0) &&
    scenario.votingOptions.filter((o) => o.label).length >= 2;

  const inputClass =
    'w-full rounded-xl px-4 py-3 text-base focus:outline-none placeholder-white/15';
  const inputStyle = {
    background: 'var(--subtle-bg)',
    border: '1px solid var(--panel-border)',
    color: 'var(--text-primary)',
  };
  const labelClass = 'block mb-1.5 text-sm font-medium';
  const labelStyle = { color: 'var(--text-secondary)' };
  const sectionClass = 'glass rounded-2xl p-6 space-y-4';
  const addBtnClass = 'rounded-lg px-4 py-2 text-sm font-medium transition-all hover:scale-[1.02]';
  const addBtnStyle = { background: 'rgba(212,160,60,0.12)', color: 'var(--accent)' };

  // ─── Hidden file input (shared between gallery & editor) ─────────
  const fileInput = (
    <input
      ref={fileInputRef}
      type="file"
      accept=".json"
      onChange={handleFileUpload}
      className="hidden"
    />
  );

  // Derived data for filtering
  const filteredPresets = allPresets.filter(({ preset }) => {
    if (selectedMode && preset.mode !== selectedMode) return false;
    if (selectedCategory && preset.category !== selectedCategory) return false;
    return true;
  });

  const availableCategories = [...new Set(
    allPresets
      .filter(({ preset }) => preset.mode === selectedMode)
      .map(({ preset }) => preset.category)
      .filter(Boolean)
  )] as string[];

  const scenarioCountForMode = (m: string) =>
    allPresets.filter(({ preset }) => preset.mode === m).length;

  const scenarioCountForCategory = (cat: string) =>
    allPresets.filter(({ preset }) => preset.mode === selectedMode && preset.category === cat).length;

  // ═══════════════════════════════════════════════════════════════════
  // LANDING SCREEN
  // ═══════════════════════════════════════════════════════════════════
  if (view === 'landing') {
    return (
      <div className="noise mx-auto max-w-3xl space-y-8 p-8">
        {fileInput}

        {/* Theme Toggle */}
        <div className="flex justify-end">
          <ThemeToggle />
        </div>

        {/* Hero */}
        <div className="text-center pt-8 pb-4">
          <h1 className="heading-display mb-3 text-5xl font-bold" style={{ color: 'var(--accent)' }}>
            Deliberation Lab
          </h1>
          <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
            Collaborative deliberation scenarios for education and civic engagement
          </p>
        </div>

        {/* Mode Cards */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Education Card */}
          <button
            onClick={() => { setSelectedMode('education'); setView('category'); }}
            className="glass group cursor-pointer rounded-2xl p-6 text-left transition-all hover:scale-[1.02]"
            style={{ borderColor: 'rgba(212,160,60,0.2)' }}
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-4xl">🎓</span>
              <h2 className="heading-display text-2xl font-bold" style={{ color: 'var(--accent)' }}>
                Education
              </h2>
            </div>
            <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
              History, philosophy, science &amp; ethics
            </p>
            <span
              className="inline-block rounded-full px-3 py-1 text-xs font-semibold"
              style={{ background: 'rgba(212,160,60,0.12)', color: 'var(--accent)' }}
            >
              {scenarioCountForMode('education')} scenario{scenarioCountForMode('education') !== 1 ? 's' : ''}
            </span>
          </button>

          {/* Civic Card */}
          <button
            onClick={() => { setSelectedMode('civic'); setView('category'); }}
            className="glass group cursor-pointer rounded-2xl p-6 text-left transition-all hover:scale-[1.02]"
            style={{ borderColor: 'rgba(99,182,255,0.2)' }}
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-4xl">🏛️</span>
              <h2 className="heading-display text-2xl font-bold" style={{ color: '#63b6ff' }}>
                Civic
              </h2>
            </div>
            <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
              Criminal justice, housing, public health
            </p>
            <span
              className="inline-block rounded-full px-3 py-1 text-xs font-semibold"
              style={{ background: 'rgba(99,182,255,0.12)', color: '#63b6ff' }}
            >
              {scenarioCountForMode('civic')} scenario{scenarioCountForMode('civic') !== 1 ? 's' : ''}
            </span>
          </button>
        </div>

        {/* Bottom Actions */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={() => setView('editor')}
            className="glass flex-1 rounded-2xl px-6 py-4 text-base font-semibold transition-all hover:scale-[1.01] hover:border-[rgba(212,160,60,0.3)]"
            style={{ color: 'var(--accent)' }}
          >
            + Create Custom Scenario
          </button>
          {onRejoin && (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="glass flex-1 rounded-2xl px-6 py-4 text-base font-semibold transition-all hover:scale-[1.01] hover:border-[rgba(99,182,255,0.3)]"
              style={{ color: 'var(--text-secondary)' }}
            >
              Upload &amp; Rejoin
            </button>
          )}
        </div>
        {uploadError && (
          <div className="rounded-xl px-4 py-3 text-sm"
            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}>
            {uploadError}
          </div>
        )}
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════
  // CATEGORY SCREEN
  // ═══════════════════════════════════════════════════════════════════
  if (view === 'category') {
    const isCivic = selectedMode === 'civic';
    const accentColor = isCivic ? '#63b6ff' : 'var(--accent)';
    const accentBg = isCivic ? 'rgba(99,182,255,0.12)' : 'rgba(212,160,60,0.12)';
    const accentBorder = isCivic ? 'rgba(99,182,255,0.2)' : 'rgba(212,160,60,0.2)';

    return (
      <div className="noise mx-auto max-w-3xl space-y-8 p-8">
        {/* Back button */}
        <button
          onClick={() => { setView('landing'); setSelectedMode(null); setSelectedCategory(null); }}
          className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all hover:scale-[1.02]"
          style={{ background: 'var(--subtle-bg)', color: 'var(--text-secondary)' }}
        >
          &larr; Back
        </button>

        {/* Header */}
        <div className="text-center pb-2">
          <h1 className="heading-display mb-2 text-4xl font-bold" style={{ color: accentColor }}>
            {isCivic ? 'Civic' : 'Education'} Scenarios
          </h1>
          <p className="text-base" style={{ color: 'var(--text-secondary)' }}>
            Choose a category to browse scenarios
          </p>
        </div>

        {/* Category Cards */}
        <div className="grid gap-4 md:grid-cols-2">
          {availableCategories.map((cat) => {
            const meta = categoryMeta[cat] || { label: cat, description: '', icon: '📁' };
            const count = scenarioCountForCategory(cat);
            return (
              <button
                key={cat}
                onClick={() => { setSelectedCategory(cat); setView('gallery'); }}
                className="glass group cursor-pointer rounded-2xl p-5 text-left transition-all hover:scale-[1.02]"
                style={{ borderColor: accentBorder }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">{meta.icon}</span>
                  <h2 className="heading-display text-xl font-semibold" style={{ color: accentColor }}>
                    {meta.label}
                  </h2>
                  <span
                    className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
                    style={{ background: accentBg, color: accentColor }}
                  >
                    {count}
                  </span>
                </div>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {meta.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════
  // GALLERY SCREEN (filtered by mode + category)
  // ═══════════════════════════════════════════════════════════════════
  if (view === 'gallery') {
    const isCivic = selectedMode === 'civic';
    const accentColor = isCivic ? '#63b6ff' : 'var(--accent)';
    const catLabel = selectedCategory && categoryMeta[selectedCategory]
      ? categoryMeta[selectedCategory].label
      : selectedCategory || '';

    return (
      <div className="noise mx-auto max-w-3xl space-y-8 p-8">
        {fileInput}

        {/* Back button */}
        <button
          onClick={() => { setView('category'); setSelectedCategory(null); }}
          className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all hover:scale-[1.02]"
          style={{ background: 'var(--subtle-bg)', color: 'var(--text-secondary)' }}
        >
          &larr; Back to Categories
        </button>

        {/* Header */}
        <div className="text-center pb-2">
          <h1 className="heading-display mb-2 text-3xl font-bold" style={{ color: accentColor }}>
            {catLabel}
          </h1>
          <p className="text-base" style={{ color: 'var(--text-secondary)' }}>
            {filteredPresets.length} scenario{filteredPresets.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Scenario Cards */}
        <div className="space-y-4">
          {filteredPresets.map(({ preset, image, tagline }) => {
            const roleCount = preset.roles.length;
            const npcCount = preset.npcs.length;
            const stageCount = preset.stages.length;
            const totalMinutes = Math.round(
              preset.stages.reduce((sum, s) => sum + s.durationSeconds, 0) / 60
            );
            const hasEvents = preset.stages.some((s) => s.events && s.events.length > 0);
            const cardAccent = preset.mode === 'civic' ? '#63b6ff' : 'var(--accent)';
            const cardAccentBg = preset.mode === 'civic' ? 'rgba(99,182,255,0.12)' : 'rgba(212,160,60,0.12)';
            const cardBorderHover = preset.mode === 'civic' ? 'rgba(99,182,255,0.3)' : 'rgba(212,160,60,0.3)';

            return (
              <div
                key={preset.title}
                className="glass group cursor-pointer rounded-2xl p-5 transition-all"
                style={{ borderColor: 'var(--panel-border)' }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = cardBorderHover)}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--panel-border)')}
                onClick={() => { setScenario(preset); setView('editor'); }}
              >
                <div className="flex gap-5">
                  {/* Image or mode icon */}
                  {image ? (
                    <div
                      className="h-24 w-24 flex-shrink-0 rounded-xl bg-cover bg-center"
                      style={{ backgroundImage: `url(${image})` }}
                    />
                  ) : (
                    <div
                      className="h-24 w-24 flex-shrink-0 rounded-xl flex items-center justify-center text-4xl"
                      style={{
                        background: preset.mode === 'civic'
                          ? 'rgba(99,182,255,0.08)'
                          : 'rgba(212,160,60,0.08)',
                        border: `1px solid ${preset.mode === 'civic' ? 'rgba(99,182,255,0.15)' : 'rgba(212,160,60,0.12)'}`,
                      }}
                    >
                      {preset.mode === 'civic' ? '🏛️' : preset.category === 'philosophy' ? '⚖️' : preset.category === 'science-ethics' ? '⚛️' : '📜'}
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h2 className="heading-display text-[1.35rem] font-semibold tracking-wide" style={{ color: 'var(--text-primary)' }}>
                        {preset.title}
                      </h2>
                      {preset.category && (
                        <span
                          className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
                          style={{ background: cardAccentBg, color: cardAccent }}
                        >
                          {categoryMeta[preset.category]?.label || preset.category}
                        </span>
                      )}
                    </div>
                    <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
                      {preset.setting}
                    </p>
                    <p className="text-sm mt-1.5" style={{ color: 'var(--text-secondary)' }}>
                      {tagline}
                    </p>

                    {/* Metadata row */}
                    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                      <span>{roleCount} role{roleCount !== 1 ? 's' : ''}</span>
                      <span style={{ opacity: 0.4 }}>&middot;</span>
                      <span>{npcCount} NPC{npcCount !== 1 ? 's' : ''}</span>
                      <span style={{ opacity: 0.4 }}>&middot;</span>
                      <span>{stageCount} stage{stageCount !== 1 ? 's' : ''}</span>
                      <span style={{ opacity: 0.4 }}>&middot;</span>
                      <span>{totalMinutes} min</span>
                      {hasEvents && (
                        <>
                          <span style={{ opacity: 0.4 }}>&middot;</span>
                          <span
                            className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
                            style={{ background: cardAccentBg, color: cardAccent }}
                          >
                            Live events
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <button
                      onClick={(e) => { e.stopPropagation(); onStart(preset, []); }}
                      className="rounded-xl px-5 py-2.5 text-base font-semibold transition-all hover:scale-[1.03]"
                      style={{
                        background: `linear-gradient(135deg, ${preset.mode === 'civic' ? 'rgba(99,182,255,0.25), rgba(70,140,220,0.12)' : 'rgba(212,160,60,0.25), rgba(180,120,40,0.12)'})`,
                        color: cardAccent,
                        border: `1px solid ${preset.mode === 'civic' ? 'rgba(99,182,255,0.25)' : 'rgba(212,160,60,0.25)'}`,
                      }}
                    >
                      Start &rarr;
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setScenario(preset); setView('editor'); }}
                      className="rounded-lg px-4 py-1.5 text-sm font-medium transition-all hover:scale-[1.03]"
                      style={{
                        background: 'var(--subtle-bg)',
                        color: 'var(--text-secondary)',
                        border: '1px solid var(--subtle-border)',
                      }}
                    >
                      Edit &amp; Customize
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {uploadError && (
          <div className="rounded-xl px-4 py-3 text-sm"
            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}>
            {uploadError}
          </div>
        )}
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════
  // EDITOR MODE
  // ═══════════════════════════════════════════════════════════════════
  return (
    <div className="noise mx-auto max-w-5xl space-y-6 p-8">
      {fileInput}

      {/* Back button */}
      <button
        onClick={() => {
          if (selectedCategory) {
            setView('gallery');
          } else {
            setView('landing');
          }
        }}
        className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all hover:scale-[1.02]"
        style={{ background: 'var(--subtle-bg)', color: 'var(--text-secondary)' }}
      >
        &larr; Back to {selectedCategory ? 'Scenarios' : 'Home'}
      </button>

      {/* Header */}
      <div className="mb-4 text-center">
        <h1 className="heading-display mb-2 text-4xl font-bold" style={{ color: 'var(--accent)' }}>
          {scenario.title ? 'Edit Scenario' : 'Create Scenario'}
        </h1>
        <p className="text-base" style={{ color: 'var(--text-secondary)' }}>
          Configure every detail of your scenario
        </p>
      </div>

      {/* Scenario Details */}
      <section className={sectionClass}>
        <button
          type="button"
          className="flex w-full items-center justify-between"
          onClick={() => toggleSection('details')}
        >
          <div className="flex items-center gap-3">
            <h2 className="heading-display text-xl font-semibold" style={{ color: 'var(--accent)' }}>
              Scenario Details
            </h2>
            {collapsed.has('details') && scenario.title && (
              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                {scenario.title}{scenario.setting ? ` · ${scenario.setting}` : ''}
              </span>
            )}
          </div>
          <span className="text-lg transition-transform" style={{ color: 'var(--text-muted)', transform: collapsed.has('details') ? 'rotate(-90deg)' : 'rotate(0deg)' }}>▾</span>
        </button>
        {!collapsed.has('details') && (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className={labelClass} style={labelStyle}>Title</label>
                <input className={inputClass} style={inputStyle} value={scenario.title}
                  onChange={(e) => updateField('title', e.target.value)}
                  placeholder="e.g., The Conversion of Axum" />
              </div>
              <div>
                <label className={labelClass} style={labelStyle}>Setting</label>
                <input className={inputClass} style={inputStyle} value={scenario.setting}
                  onChange={(e) => updateField('setting', e.target.value)}
                  placeholder="e.g., 340 CE, Kingdom of Axum / Present Day, Portland, OR" />
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
              <label className={labelClass} style={labelStyle}>Background Context</label>
              <textarea className={inputClass + ' min-h-[80px]'} style={inputStyle}
                value={scenario.context}
                onChange={(e) => updateField('context', e.target.value)}
                placeholder="Background information for participants and the LLM..." />
            </div>
            <div>
              <label className={labelClass} style={labelStyle}>Central Question</label>
              <input className={inputClass} style={inputStyle}
                value={scenario.centralQuestion}
                onChange={(e) => updateField('centralQuestion', e.target.value)}
                placeholder="e.g., Should King Ezana convert Axum to Christianity?" />
            </div>
            <div>
              <label className={labelClass} style={labelStyle}>Outcome / Real-World Context (revealed at end)</label>
              <textarea className={inputClass + ' min-h-[80px]'} style={inputStyle}
                value={scenario.outcome || ''}
                onChange={(e) => updateField('outcome', e.target.value)}
                placeholder="What actually happened (optional for civic scenarios)..." />
            </div>
          </div>
        )}
      </section>

      {/* Voting Options */}
      <section className={sectionClass}>
        <button
          type="button"
          className="flex w-full items-center justify-between"
          onClick={() => toggleSection('voting')}
        >
          <div className="flex items-center gap-3">
            <h2 className="heading-display text-xl font-semibold" style={{ color: 'var(--accent)' }}>
              Voting Options
            </h2>
            {collapsed.has('voting') && (
              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                {scenario.votingOptions.filter((o) => o.label).length} option{scenario.votingOptions.filter((o) => o.label).length !== 1 ? 's' : ''}
                {scenario.votingOptions.filter((o) => o.label).length > 0 && (
                  <> — {scenario.votingOptions.filter((o) => o.label).map((o) => o.label).join(', ')}</>
                )}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {!collapsed.has('voting') && (
              <span onClick={(e) => { e.stopPropagation(); addVotingOption(); }} className={addBtnClass} style={addBtnStyle}>
                + Add Option
              </span>
            )}
            <span className="text-lg transition-transform" style={{ color: 'var(--text-muted)', transform: collapsed.has('voting') ? 'rotate(-90deg)' : 'rotate(0deg)' }}>▾</span>
          </div>
        </button>
        {!collapsed.has('voting') && (
          <div className="space-y-4">
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
          </div>
        )}
      </section>

      {/* Stages */}
      <section className={sectionClass}>
        <button
          type="button"
          className="flex w-full items-center justify-between"
          onClick={() => toggleSection('stages')}
        >
          <div className="flex items-center gap-3">
            <h2 className="heading-display text-xl font-semibold" style={{ color: 'var(--accent)' }}>
              Activity Stages
            </h2>
            {collapsed.has('stages') && (
              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                {scenario.stages.length} stage{scenario.stages.length !== 1 ? 's' : ''}
                {scenario.stages.length > 0 && (
                  <> — {scenario.stages.map((s) => s.title || s.type).join(' → ')}</>
                )}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {!collapsed.has('stages') && (
              <span onClick={(e) => { e.stopPropagation(); addStage(); }} className={addBtnClass} style={addBtnStyle}>
                + Add Stage
              </span>
            )}
            <span className="text-lg transition-transform" style={{ color: 'var(--text-muted)', transform: collapsed.has('stages') ? 'rotate(-90deg)' : 'rotate(0deg)' }}>▾</span>
          </div>
        </button>
        {!collapsed.has('stages') && (
          <div className="space-y-4">
            {scenario.stages.map((stage, i) => (
              <div key={stage.id} className="rounded-xl p-4 space-y-3"
                style={{ background: 'var(--subtle-bg)', border: '1px solid var(--panel-border)' }}>
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
          </div>
        )}
      </section>

      {/* Roles */}
      <section className={sectionClass}>
        <button
          type="button"
          className="flex w-full items-center justify-between"
          onClick={() => toggleSection('roles')}
        >
          <div className="flex items-center gap-3">
            <div>
              <h2 className="heading-display text-xl font-semibold text-left" style={{ color: 'var(--accent)' }}>
                Roles
              </h2>
              {!collapsed.has('roles') && (
                <p className="mt-1 text-sm text-left" style={{ color: 'var(--text-muted)' }}>
                  Predefined characters for participants who want active roles
                </p>
              )}
            </div>
            {collapsed.has('roles') && scenario.roles.length > 0 && (
              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                {scenario.roles.length} role{scenario.roles.length !== 1 ? 's' : ''}
                {' — '}{scenario.roles.map((r) => r.name || 'Unnamed').join(', ')}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {!collapsed.has('roles') && (
              <span onClick={(e) => { e.stopPropagation(); addRole(); }} className={addBtnClass} style={addBtnStyle}>
                + Add Role
              </span>
            )}
            <span className="text-lg transition-transform" style={{ color: 'var(--text-muted)', transform: collapsed.has('roles') ? 'rotate(-90deg)' : 'rotate(0deg)' }}>▾</span>
          </div>
        </button>
        {!collapsed.has('roles') && (
          <div className="space-y-4">
            {scenario.roles.map((role) => (
              <div key={role.id} className="rounded-xl p-4 space-y-3"
                style={{ background: 'var(--subtle-bg)', border: '1px solid var(--panel-border)' }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span
                      className="rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider"
                      style={{
                        background: isLeaderRole(role.suggestedFor) ? 'rgba(99,182,255,0.15)' : 'rgba(212,160,60,0.12)',
                        color: isLeaderRole(role.suggestedFor) ? '#63b6ff' : 'var(--accent)',
                      }}
                    >
                      {role.suggestedFor === 'ta' ? 'TA' : role.suggestedFor === 'facilitator' ? 'Facilitator' : role.suggestedFor.charAt(0).toUpperCase() + role.suggestedFor.slice(1)}
                    </span>
                    {role.name && (
                      <span className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
                        {role.name}
                      </span>
                    )}
                  </div>
                  <button onClick={() => removeRole(role.id)}
                    className="text-xs text-red-400/40 transition-colors hover:text-red-400">
                    Remove
                  </button>
                </div>
                <div className="grid gap-3 md:grid-cols-4">
                  <div>
                    <label className={labelClass} style={labelStyle}>Character Name</label>
                    <input className={inputClass} style={inputStyle} value={role.name}
                      onChange={(e) => updateRole(role.id, { name: e.target.value })}
                      placeholder="e.g., King Ezana" />
                  </div>
                  <div>
                    <label className={labelClass} style={labelStyle}>Title / Role</label>
                    <input className={inputClass} style={inputStyle} value={role.title}
                      onChange={(e) => updateRole(role.id, { title: e.target.value })}
                      placeholder="e.g., Negus of Axum" />
                  </div>
                  <div>
                    <label className={labelClass} style={labelStyle}>Suggested For</label>
                    <select className={inputClass} style={inputStyle} value={role.suggestedFor}
                      onChange={(e) => updateRole(role.id, { suggestedFor: e.target.value as StudentRole['suggestedFor'] })}>
                      <option value="student">Student</option>
                      <option value="ta">TA</option>
                      <option value="facilitator">Facilitator</option>
                      <option value="participant">Participant</option>
                      <option value="observer">Observer</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass} style={labelStyle}>Assigned To</label>
                    <input className={inputClass} style={inputStyle} value={role.assignedTo}
                      onChange={(e) => updateRole(role.id, { assignedTo: e.target.value })}
                      placeholder="Name (optional)" />
                  </div>
                </div>
                <div>
                  <label className={labelClass} style={labelStyle}>Character Brief</label>
                  <textarea className={inputClass + ' min-h-[60px]'} style={inputStyle}
                    value={role.description}
                    onChange={(e) => updateRole(role.id, { description: e.target.value })}
                    placeholder="Background, motivations, and suggested arguments..." />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Character Sheets */}
      <section className={sectionClass}>
        <button
          type="button"
          className="flex w-full items-center justify-between"
          onClick={() => toggleSection('cast')}
        >
          <div className="flex items-center gap-3">
            <div>
              <h2 className="heading-display text-xl font-semibold text-left" style={{ color: 'var(--accent)' }}>
                Character Sheets
              </h2>
              {!collapsed.has('cast') && (
                <p className="mt-1 text-sm text-left" style={{ color: 'var(--text-muted)' }}>
                  Upload photos of handwritten character sheets for batch extraction
                </p>
              )}
            </div>
            {collapsed.has('cast') && cast.length > 0 && (
              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                {cast.length} character{cast.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          <span className="text-lg transition-transform" style={{ color: 'var(--text-muted)', transform: collapsed.has('cast') ? 'rotate(-90deg)' : 'rotate(0deg)' }}>▾</span>
        </button>
        {!collapsed.has('cast') && (
          <div className="space-y-4">
            <CharacterUploader
              onExtracted={(sheets) => setCast((prev) => [...prev, ...sheets])}
              existingCount={cast.length}
            />
            {cast.length > 0 && (
              <CharacterReviewGrid
                cast={cast}
                onUpdate={(id, updates) => {
                  setCast((prev) => {
                    // If this is a new manual entry (not yet in array), add it
                    const exists = prev.find((c) => c.id === id);
                    if (!exists) {
                      return [...prev, updates as CharacterSheet];
                    }
                    return prev.map((c) => (c.id === id ? { ...c, ...updates } : c));
                  });
                }}
                onRemove={(id) => setCast((prev) => prev.filter((c) => c.id !== id))}
                mode="review"
              />
            )}
          </div>
        )}
      </section>

      {/* NPCs */}
      <section className={sectionClass}>
        <button
          type="button"
          className="flex w-full items-center justify-between"
          onClick={() => toggleSection('npcs')}
        >
          <div className="flex items-center gap-3">
            <div>
              <h2 className="heading-display text-xl font-semibold text-left" style={{ color: 'var(--accent)' }}>
                LLM Characters
              </h2>
              {!collapsed.has('npcs') && (
                <p className="mt-1 text-sm text-left" style={{ color: 'var(--text-muted)' }}>
                  AI-powered characters that react to student arguments
                </p>
              )}
            </div>
            {collapsed.has('npcs') && scenario.npcs.length > 0 && (
              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                {scenario.npcs.length} character{scenario.npcs.length !== 1 ? 's' : ''}
                {' — '}{scenario.npcs.map((n) => `${n.avatarEmoji} ${n.name || 'Unnamed'}`).join(', ')}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {!collapsed.has('npcs') && (
              <span onClick={(e) => { e.stopPropagation(); addNpc(); }} className={addBtnClass} style={addBtnStyle}>
                + Add Manually
              </span>
            )}
            <span className="text-lg transition-transform" style={{ color: 'var(--text-muted)', transform: collapsed.has('npcs') ? 'rotate(-90deg)' : 'rotate(0deg)' }}>▾</span>
          </div>
        </button>
        {!collapsed.has('npcs') && (
          <div className="space-y-4">
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

            {npcGenError && (
              <div className="rounded-xl px-4 py-3 text-sm"
                style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}>
                {npcGenError}
              </div>
            )}

            {scenario.npcs.map((npc) => (
              <div key={npc.id} className="rounded-xl p-4 space-y-3"
                style={{ background: 'var(--subtle-bg)', border: '1px solid var(--panel-border)' }}>
                <div className="flex items-center justify-between">
                  {npc.avatarImage ? (
                    <img src={npc.avatarImage} alt={npc.name}
                      className="h-10 w-10 rounded-full object-cover"
                      style={{ border: '2px solid rgba(212,160,60,0.2)' }} />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full text-xl"
                      style={{ background: 'rgba(212,160,60,0.1)' }}>
                      {npc.avatarEmoji}
                    </div>
                  )}
                  <button onClick={() => removeNpc(npc.id)}
                    className="text-xs text-red-400/40 transition-colors hover:text-red-400">
                    Remove
                  </button>
                </div>
                <div className="grid gap-3 md:grid-cols-5">
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
                    <label className={labelClass} style={labelStyle}>Portrait URL</label>
                    <input className={inputClass} style={inputStyle} value={npc.avatarImage || ''}
                      onChange={(e) => updateNpc(npc.id, { avatarImage: e.target.value || undefined })}
                      placeholder="/images/name.png" />
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
                  <label className={labelClass} style={labelStyle}>Background</label>
                  <textarea className={inputClass + ' min-h-[60px]'} style={inputStyle}
                    value={npc.context}
                    onChange={(e) => updateNpc(npc.id, { context: e.target.value })}
                    placeholder="Background information..." />
                </div>
                <div>
                  <label className={labelClass} style={labelStyle}>Stance on Central Question</label>
                  <input className={inputClass} style={inputStyle} value={npc.stance}
                    onChange={(e) => updateNpc(npc.id, { stance: e.target.value })}
                    placeholder="Their position..." />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Start */}
      <div className="py-4 text-center">
        <button
          onClick={() => canStart && onStart(scenario, cast)}
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
            background: 'var(--subtle-bg)',
            color: 'var(--text-muted)',
            border: '1px solid var(--subtle-border)',
          }}
        >
          Begin Session
        </button>
        {!canStart && (
          <div className="mt-3 flex flex-wrap justify-center gap-2 text-sm">
            {!scenario.title && (
              <span className="rounded-full px-3 py-1" style={{ background: 'rgba(239,68,68,0.08)', color: '#f87171' }}>Title</span>
            )}
            {!scenario.centralQuestion && (
              <span className="rounded-full px-3 py-1" style={{ background: 'rgba(239,68,68,0.08)', color: '#f87171' }}>Central Question</span>
            )}
            {scenario.votingOptions.filter((o) => o.label).length < 2 && (
              <span className="rounded-full px-3 py-1" style={{ background: 'rgba(239,68,68,0.08)', color: '#f87171' }}>2+ Voting Options</span>
            )}
            {scenario.stages.length === 0 && (
              <span className="rounded-full px-3 py-1" style={{ background: 'rgba(239,68,68,0.08)', color: '#f87171' }}>1+ Stage</span>
            )}
            {scenario.npcs.length === 0 && scenario.roles.length === 0 && (
              <span className="rounded-full px-3 py-1" style={{ background: 'rgba(239,68,68,0.08)', color: '#f87171' }}>1+ NPC or Role</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
