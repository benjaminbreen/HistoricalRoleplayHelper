'use client';

import { useState, useCallback } from 'react';
import {
  Scenario,
  TranscriptEntry,
  NpcResponse,
  VotingOption,
  NpcCharacter,
} from '../lib/types';
import { buildNpcSystemPrompt, buildRejoinPrompt } from '../lib/prompts';
import TranscriptLog from './TranscriptLog';
import NpcCard from './NpcCard';

export interface RejoinSessionData {
  scenario: Scenario;
  transcript: TranscriptEntry[];
  npcResponses: NpcResponse[];
  votingOptions: VotingOption[];
  exportedAt: string;
}

interface RejoinViewProps {
  sessionData: RejoinSessionData;
  onBack: () => void;
}

const barColors = [
  'rgba(212, 160, 60, 0.8)',
  'rgba(100, 160, 230, 0.75)',
  'rgba(120, 190, 120, 0.7)',
  'rgba(200, 120, 180, 0.7)',
];

function downloadFile(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function RejoinView({ sessionData, onBack }: RejoinViewProps) {
  const { scenario } = sessionData;

  // Original data (read-only)
  const originalTranscript = sessionData.transcript;
  const originalNpcResponses = sessionData.npcResponses;
  const originalVotingOptions = sessionData.votingOptions;

  // Student contribution state
  const [studentName, setStudentName] = useState('');
  const [argumentText, setArgumentText] = useState('');
  const [newArguments, setNewArguments] = useState<TranscriptEntry[]>([]);

  // Voting state
  const [studentVote, setStudentVote] = useState<string | null>(null);

  // NPC re-run state
  const [newNpcResponses, setNewNpcResponses] = useState<NpcResponse[]>([]);
  const [loadingNpcs, setLoadingNpcs] = useState<Set<string>>(new Set());
  const [npcError, setNpcError] = useState<string | null>(null);
  const [hasRerun, setHasRerun] = useState(false);

  // Historical outcome
  const [showHistorical, setShowHistorical] = useState(false);

  // Collapsible sections
  const [showOriginalNpc, setShowOriginalNpc] = useState(false);

  // Derived: updated voting with student's vote
  const updatedVotingOptions: VotingOption[] = originalVotingOptions.map((o) => ({
    ...o,
    votes: o.votes + (studentVote === o.id ? 1 : 0),
  }));
  const totalOriginalVotes = originalVotingOptions.reduce((s, o) => s + o.votes, 0);
  const totalUpdatedVotes = updatedVotingOptions.reduce((s, o) => s + o.votes, 0);

  const addArgument = useCallback(() => {
    if (!argumentText.trim() || !studentName.trim()) return;
    setNewArguments((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        speaker: studentName.trim(),
        text: argumentText.trim(),
        timestamp: Date.now(),
        stageId: 'rejoin',
      },
    ]);
    setArgumentText('');
  }, [argumentText, studentName]);

  const removeArgument = useCallback((id: string) => {
    setNewArguments((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const triggerNpc = useCallback(
    async (npcId: string) => {
      const npc = scenario.npcs.find((n: NpcCharacter) => n.id === npcId);
      if (!npc) return;

      setLoadingNpcs((prev) => new Set(prev).add(npcId));
      setNpcError(null);
      try {
        const systemPrompt = buildNpcSystemPrompt(npc, scenario);
        const userPrompt = buildRejoinPrompt(
          originalTranscript,
          newArguments,
          scenario,
          updatedVotingOptions.map((o) => ({ label: o.label, votes: o.votes }))
        );

        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ systemPrompt, userPrompt }),
        });

        if (!res.ok) {
          throw new Error(`API returned ${res.status}`);
        }
        const data = await res.json();
        if (data.text) {
          setNewNpcResponses((prev) => {
            const filtered = prev.filter((r) => r.npcId !== npcId);
            return [
              ...filtered,
              {
                npcId,
                text: data.text,
                timestamp: Date.now(),
                stageId: 'rejoin',
              },
            ];
          });
        }
      } catch (err) {
        console.error('NPC re-run failed:', err);
        setNpcError(`Failed to generate response for ${npc.name}.`);
      } finally {
        setLoadingNpcs((prev) => {
          const next = new Set(prev);
          next.delete(npcId);
          return next;
        });
      }
    },
    [scenario, originalTranscript, newArguments, updatedVotingOptions]
  );

  const triggerAll = useCallback(async () => {
    setHasRerun(true);
    await Promise.all(scenario.npcs.map((npc: NpcCharacter) => triggerNpc(npc.id)));
  }, [scenario.npcs, triggerNpc]);

  const handleSaveUpdated = useCallback(() => {
    const slug = scenario.title.replace(/\s+/g, '_').replace(/[^\w]/g, '');
    downloadFile(
      JSON.stringify(
        {
          scenario,
          transcript: [...originalTranscript, ...newArguments],
          npcResponses: [...originalNpcResponses, ...newNpcResponses],
          votingOptions: updatedVotingOptions,
          exportedAt: new Date().toISOString(),
          rejoinSession: {
            studentName,
            studentVote,
            originalExportedAt: sessionData.exportedAt,
          },
        },
        null,
        2
      ),
      `${slug}_rejoin.json`,
      'application/json'
    );
  }, [
    scenario,
    originalTranscript,
    newArguments,
    originalNpcResponses,
    newNpcResponses,
    updatedVotingOptions,
    studentName,
    studentVote,
    sessionData.exportedAt,
  ]);

  const inputClass =
    'w-full rounded-xl px-4 py-3 text-base focus:outline-none placeholder-white/15';
  const inputStyle = {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid var(--panel-border)',
    color: 'var(--text-primary)',
  };

  return (
    <div className="relative min-h-screen" style={{ background: 'var(--background)' }}>
      {/* Background image */}
      {scenario.backgroundImage && (
        <div className="pointer-events-none fixed inset-0" style={{ zIndex: 0 }}>
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${scenario.backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: 0.15,
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to bottom, var(--background) 0%, transparent 40%, transparent 70%, var(--background) 100%)`,
            }}
          />
        </div>
      )}

      <div className="relative mx-auto max-w-3xl space-y-8 p-8" style={{ zIndex: 1 }}>
        {/* Back button */}
        <button
          onClick={onBack}
          className="rounded-lg px-4 py-2 text-sm font-medium transition-all hover:scale-[1.02]"
          style={{
            background: 'rgba(255,255,255,0.06)',
            color: 'var(--text-secondary)',
            border: '1px solid var(--panel-border)',
          }}
        >
          &larr; Back to Setup
        </button>

        {/* Header */}
        <div className="text-center">
          <p
            className="mb-2 text-sm font-medium uppercase tracking-widest"
            style={{ color: 'var(--text-muted)' }}
          >
            Async Session Rejoin &middot; {scenario.timePeriod}
          </p>
          <h1
            className="heading-display mb-3 text-4xl font-bold"
            style={{ color: 'var(--accent)' }}
          >
            {scenario.title}
          </h1>
          <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
            {scenario.centralQuestion}
          </p>
        </div>

        {/* ─── SECTION 1: SESSION RECAP ─── */}
        <section className="glass rounded-2xl p-6 space-y-5">
          <h2
            className="heading-display text-xl font-semibold"
            style={{ color: 'var(--accent)' }}
          >
            Session Recap
          </h2>

          {/* Original transcript */}
          <div>
            <h3
              className="mb-3 text-sm font-semibold uppercase tracking-widest"
              style={{ color: 'var(--text-muted)' }}
            >
              Original Discussion ({originalTranscript.length} arguments)
            </h3>
            <TranscriptLog entries={originalTranscript} stages={scenario.stages} />
          </div>

          {/* Original NPC responses (collapsible) */}
          {originalNpcResponses.length > 0 && (
            <div>
              <button
                onClick={() => setShowOriginalNpc(!showOriginalNpc)}
                className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-left transition-all"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--panel-border)',
                }}
              >
                <span
                  className="text-sm font-semibold uppercase tracking-widest"
                  style={{ color: 'var(--text-muted)' }}
                >
                  Original NPC Responses ({originalNpcResponses.length})
                </span>
                <span style={{ color: 'var(--text-muted)' }}>
                  {showOriginalNpc ? '▾' : '▸'}
                </span>
              </button>
              {showOriginalNpc && (
                <div className="mt-3 space-y-3">
                  {originalNpcResponses.map((r, i) => {
                    const npc = scenario.npcs.find(
                      (n: NpcCharacter) => n.id === r.npcId
                    );
                    return (
                      <div
                        key={i}
                        className="rounded-xl p-4"
                        style={{
                          background: 'rgba(255,255,255,0.03)',
                          border: '1px solid var(--panel-border)',
                        }}
                      >
                        <div className="mb-2 flex items-center gap-2">
                          <span className="text-xl">
                            {npc?.avatarEmoji || '👤'}
                          </span>
                          <span
                            className="text-base font-semibold"
                            style={{ color: 'var(--accent)' }}
                          >
                            {npc?.name || r.npcId}
                          </span>
                          <span
                            className="text-sm"
                            style={{ color: 'var(--text-muted)' }}
                          >
                            {npc?.title}
                          </span>
                        </div>
                        <p
                          className="text-base leading-relaxed"
                          style={{ color: 'var(--text-primary)' }}
                        >
                          {r.text}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Original vote results */}
          {totalOriginalVotes > 0 && (
            <div>
              <h3
                className="mb-3 text-sm font-semibold uppercase tracking-widest"
                style={{ color: 'var(--text-muted)' }}
              >
                Original Vote Results
              </h3>
              <div className="space-y-3">
                {[...originalVotingOptions]
                  .sort((a, b) => b.votes - a.votes)
                  .map((option, i) => {
                    const pct =
                      totalOriginalVotes > 0
                        ? (option.votes / totalOriginalVotes) * 100
                        : 0;
                    return (
                      <div key={option.id} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span
                            className="text-base font-semibold"
                            style={{ color: 'var(--text-primary)' }}
                          >
                            {option.label}
                          </span>
                          <span
                            className="font-mono text-sm"
                            style={{ color: 'var(--text-muted)' }}
                          >
                            {option.votes} votes ({pct.toFixed(0)}%)
                          </span>
                        </div>
                        <div
                          className="h-5 w-full overflow-hidden rounded-full"
                          style={{ background: 'rgba(255,255,255,0.04)' }}
                        >
                          <div
                            className="flex h-full items-center rounded-full px-2 transition-all duration-700 ease-out"
                            style={{
                              width: `${Math.max(pct, option.votes > 0 ? 5 : 0)}%`,
                              background: barColors[i % barColors.length],
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                <p
                  className="text-center text-sm"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {totalOriginalVotes} total votes
                </p>
              </div>
            </div>
          )}
        </section>

        {/* ─── SECTION 2: YOUR CONTRIBUTION ─── */}
        <section className="glass rounded-2xl p-6 space-y-5">
          <h2
            className="heading-display text-xl font-semibold"
            style={{ color: 'var(--accent)' }}
          >
            Your Contribution
          </h2>

          <div>
            <label
              className="mb-1.5 block text-sm font-medium"
              style={{ color: 'var(--text-secondary)' }}
            >
              Your Name
            </label>
            <input
              className={inputClass}
              style={inputStyle}
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="Enter your name..."
            />
          </div>

          <div>
            <label
              className="mb-1.5 block text-sm font-medium"
              style={{ color: 'var(--text-secondary)' }}
            >
              Your Argument
            </label>
            <textarea
              className={inputClass + ' min-h-[100px]'}
              style={inputStyle}
              value={argumentText}
              onChange={(e) => setArgumentText(e.target.value)}
              placeholder="Make your case. What position do you take on this question, and why?"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.metaKey) {
                  e.preventDefault();
                  addArgument();
                }
              }}
            />
          </div>

          <button
            onClick={addArgument}
            disabled={!argumentText.trim() || !studentName.trim()}
            className="rounded-xl px-6 py-3 text-base font-semibold transition-all hover:scale-[1.02] disabled:opacity-30 disabled:hover:scale-100"
            style={{
              background:
                argumentText.trim() && studentName.trim()
                  ? 'rgba(212,160,60,0.18)'
                  : 'rgba(255,255,255,0.04)',
              color:
                argumentText.trim() && studentName.trim()
                  ? 'var(--accent)'
                  : 'var(--text-muted)',
              border: `1px solid ${
                argumentText.trim() && studentName.trim()
                  ? 'rgba(212,160,60,0.2)'
                  : 'rgba(255,255,255,0.06)'
              }`,
            }}
          >
            Add Argument
          </button>

          {/* List of added arguments */}
          {newArguments.length > 0 && (
            <div className="space-y-3">
              <h3
                className="text-sm font-semibold uppercase tracking-widest"
                style={{ color: 'var(--text-muted)' }}
              >
                Your Arguments ({newArguments.length})
              </h3>
              {newArguments.map((arg) => (
                <div
                  key={arg.id}
                  className="rounded-xl p-4"
                  style={{
                    background: 'rgba(212,160,60,0.06)',
                    border: '2px solid rgba(212,160,60,0.15)',
                  }}
                >
                  <div className="mb-1 flex items-center justify-between">
                    <span
                      className="text-base font-semibold"
                      style={{ color: 'var(--accent)' }}
                    >
                      {arg.speaker}
                    </span>
                    <button
                      onClick={() => removeArgument(arg.id)}
                      className="text-xs transition-colors hover:text-red-400"
                      style={{ color: 'rgba(239,68,68,0.4)' }}
                    >
                      Remove
                    </button>
                  </div>
                  <p
                    className="text-base leading-relaxed"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {arg.text}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ─── SECTION 3: YOUR VOTE ─── */}
        <section className="glass rounded-2xl p-6 space-y-5">
          <h2
            className="heading-display text-xl font-semibold"
            style={{ color: 'var(--accent)' }}
          >
            Your Vote
          </h2>

          <div className="space-y-3">
            {updatedVotingOptions.map((option, i) => {
              const isSelected = studentVote === option.id;
              const pct =
                totalUpdatedVotes > 0
                  ? (option.votes / totalUpdatedVotes) * 100
                  : 0;
              return (
                <button
                  key={option.id}
                  onClick={() =>
                    setStudentVote(isSelected ? null : option.id)
                  }
                  className="w-full rounded-xl p-4 text-left transition-all hover:scale-[1.005]"
                  style={{
                    background: isSelected
                      ? 'rgba(212,160,60,0.1)'
                      : 'rgba(255,255,255,0.03)',
                    border: isSelected
                      ? '2px solid rgba(212,160,60,0.3)'
                      : '1px solid var(--panel-border)',
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-5 w-5 items-center justify-center rounded-full"
                        style={{
                          border: isSelected
                            ? '2px solid var(--accent)'
                            : '2px solid var(--text-muted)',
                          background: isSelected
                            ? 'var(--accent)'
                            : 'transparent',
                        }}
                      >
                        {isSelected && (
                          <div
                            className="h-2 w-2 rounded-full"
                            style={{ background: 'var(--background)' }}
                          />
                        )}
                      </div>
                      <span
                        className="text-lg font-semibold"
                        style={{
                          color: isSelected
                            ? 'var(--accent)'
                            : 'var(--text-primary)',
                        }}
                      >
                        {option.label}
                      </span>
                    </div>
                    <span
                      className="font-mono text-sm"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {option.votes} votes
                    </span>
                  </div>
                  <div
                    className="h-4 w-full overflow-hidden rounded-full"
                    style={{ background: 'rgba(255,255,255,0.04)' }}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-500 ease-out"
                      style={{
                        width: `${Math.max(pct, option.votes > 0 ? 4 : 0)}%`,
                        background: barColors[i % barColors.length],
                      }}
                    />
                  </div>
                </button>
              );
            })}
          </div>

          {studentVote && (
            <p
              className="text-center text-sm"
              style={{ color: 'var(--text-muted)' }}
            >
              {totalUpdatedVotes} total votes (including yours)
            </p>
          )}
        </section>

        {/* ─── SECTION 4: NPC RE-RUN ─── */}
        <section className="glass rounded-2xl p-6 space-y-5">
          <h2
            className="heading-display text-xl font-semibold"
            style={{ color: 'var(--accent)' }}
          >
            The Court Responds
          </h2>

          <p className="text-base" style={{ color: 'var(--text-secondary)' }}>
            {newArguments.length === 0
              ? 'Add your arguments above, then trigger the NPCs to hear how they respond to the combined debate.'
              : `The NPCs will consider all ${originalTranscript.length} original arguments plus your ${newArguments.length} new contribution${newArguments.length !== 1 ? 's' : ''}.`}
          </p>

          {npcError && (
            <div
              className="rounded-xl px-5 py-3 text-base"
              style={{
                background: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.2)',
                color: '#f87171',
              }}
            >
              {npcError}
            </div>
          )}

          <div className="text-center">
            <button
              onClick={triggerAll}
              disabled={loadingNpcs.size > 0 || newArguments.length === 0}
              className="heading-display rounded-2xl px-10 py-4 text-xl font-bold transition-all hover:scale-[1.02] disabled:opacity-30 disabled:hover:scale-100"
              style={{
                background:
                  newArguments.length > 0
                    ? 'linear-gradient(135deg, rgba(212,160,60,0.25), rgba(180,120,40,0.15))'
                    : 'rgba(255,255,255,0.04)',
                color:
                  newArguments.length > 0
                    ? 'var(--accent)'
                    : 'var(--text-muted)',
                border: `1px solid ${
                  newArguments.length > 0
                    ? 'rgba(212,160,60,0.25)'
                    : 'rgba(255,255,255,0.06)'
                }`,
                boxShadow:
                  newArguments.length > 0
                    ? '0 0 40px rgba(212,160,60,0.08)'
                    : 'none',
              }}
            >
              {loadingNpcs.size > 0
                ? 'Generating Responses...'
                : hasRerun
                  ? 'Re-run NPC Responses'
                  : "Hear the Court's Response"}
            </button>
          </div>

          {/* NPC response cards */}
          {newNpcResponses.length > 0 && (
            <div
              className="grid gap-5"
              style={{
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              }}
            >
              {scenario.npcs.map((npc: NpcCharacter) => (
                <NpcCard
                  key={npc.id}
                  npc={npc}
                  responses={newNpcResponses.filter((r) => r.npcId === npc.id)}
                  onTrigger={triggerNpc}
                  isLoading={loadingNpcs.has(npc.id)}
                />
              ))}
            </div>
          )}

          {/* Updated verdict summary */}
          {hasRerun && newNpcResponses.length > 0 && studentVote && (
            <div className="glass rounded-2xl p-6 text-center">
              <p
                className="mb-1 text-sm uppercase tracking-widest"
                style={{ color: 'var(--text-muted)' }}
              >
                Updated Result
              </p>
              {(() => {
                const sorted = [...updatedVotingOptions].sort(
                  (a, b) => b.votes - a.votes
                );
                const winner = sorted[0];
                const isTie =
                  sorted.length > 1 &&
                  sorted[0].votes === sorted[1].votes &&
                  sorted[0].votes > 0;
                return isTie ? (
                  <p
                    className="heading-display text-3xl font-bold"
                    style={{ color: 'var(--accent)' }}
                  >
                    Tied Vote
                  </p>
                ) : (
                  <>
                    <p
                      className="heading-display text-3xl font-bold"
                      style={{ color: 'var(--accent)' }}
                    >
                      {winner.label}
                    </p>
                    <p
                      className="mt-1 text-base"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {winner.votes} of {totalUpdatedVotes} votes (
                      {((winner.votes / totalUpdatedVotes) * 100).toFixed(0)}%)
                    </p>
                  </>
                );
              })()}
            </div>
          )}
        </section>

        {/* ─── SECTION 5: HISTORICAL OUTCOME ─── */}
        <section className="space-y-4">
          <div className="text-center">
            <button
              onClick={() => setShowHistorical(!showHistorical)}
              className="heading-display rounded-2xl px-10 py-5 text-2xl font-bold transition-all hover:scale-[1.02]"
              style={{
                background: showHistorical
                  ? 'rgba(255,255,255,0.06)'
                  : 'linear-gradient(135deg, rgba(212,160,60,0.3), rgba(180,120,40,0.2))',
                color: 'var(--accent)',
                border: '1px solid rgba(212,160,60,0.25)',
                boxShadow: showHistorical
                  ? 'none'
                  : '0 0 40px rgba(212,160,60,0.1)',
              }}
            >
              {showHistorical
                ? 'Hide Historical Outcome'
                : 'Reveal: What Actually Happened'}
            </button>
          </div>

          {showHistorical && (
            <div
              className="animate-in-scale rounded-2xl p-8"
              style={{
                background:
                  'linear-gradient(135deg, rgba(212,160,60,0.08), rgba(15,17,23,0.9))',
                border: '2px solid rgba(212,160,60,0.2)',
              }}
            >
              <h3
                className="heading-display mb-4 text-center text-2xl font-bold"
                style={{ color: 'var(--accent)' }}
              >
                The Historical Outcome
              </h3>
              <p
                className="text-lg leading-relaxed"
                style={{ color: 'var(--text-primary)' }}
              >
                {scenario.historicalOutcome}
              </p>
            </div>
          )}

          {/* Save updated session */}
          <div className="pt-2 text-center">
            <button
              onClick={handleSaveUpdated}
              className="rounded-xl px-8 py-3 text-base font-semibold transition-all hover:scale-[1.02]"
              style={{
                background: 'rgba(99,182,255,0.1)',
                color: '#7db8f0',
                border: '1px solid rgba(99,182,255,0.2)',
              }}
            >
              Save Updated Session
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
