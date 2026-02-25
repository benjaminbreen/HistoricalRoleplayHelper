'use client';

import { useState, useCallback } from 'react';
import { NpcCharacter, NpcResponse, Scenario, StudentRole, TranscriptEntry, VotingOption } from '../lib/types';
import { buildNpcSystemPrompt, buildNpcResponsePrompt, buildVerdictPrompt } from '../lib/prompts';
import NpcCard from './NpcCard';
import TaCard from './TaCard';

interface NpcPanelProps {
  scenario: Scenario;
  npcs: NpcCharacter[];
  transcript: TranscriptEntry[];
  npcResponses: NpcResponse[];
  onNpcResponse: (response: NpcResponse) => void;
  currentStageId: string;
  isVerdictStage: boolean;
  liveVotingOptions?: VotingOption[];
  muted?: boolean;
  taRoles?: StudentRole[];
}

export default function NpcPanel({
  scenario,
  npcs,
  transcript,
  npcResponses,
  onNpcResponse,
  currentStageId,
  isVerdictStage,
  liveVotingOptions,
  muted,
  taRoles = [],
}: NpcPanelProps) {
  const [loadingNpcs, setLoadingNpcs] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  const triggerNpc = useCallback(
    async (npcId: string) => {
      const npc = npcs.find((n) => n.id === npcId);
      if (!npc) return;

      setLoadingNpcs((prev) => new Set(prev).add(npcId));
      setError(null);
      try {
        const systemPrompt = buildNpcSystemPrompt(npc, scenario);
        const userPrompt = isVerdictStage
          ? buildVerdictPrompt(transcript, scenario, liveVotingOptions || scenario.votingOptions)
          : buildNpcResponsePrompt(transcript, scenario);

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
          onNpcResponse({
            npcId,
            text: data.text,
            timestamp: Date.now(),
            stageId: currentStageId,
          });
        }
      } catch (err) {
        console.error('Failed to get NPC response:', err);
        setError(`Failed to generate response for ${npc.name}. Check your API key and try again.`);
      } finally {
        setLoadingNpcs((prev) => {
          const next = new Set(prev);
          next.delete(npcId);
          return next;
        });
      }
    },
    [npcs, scenario, transcript, isVerdictStage, liveVotingOptions, currentStageId, onNpcResponse]
  );

  const triggerAll = useCallback(async () => {
    await Promise.all(npcs.map((npc) => triggerNpc(npc.id)));
  }, [npcs, triggerNpc]);

  const anyLoading = loadingNpcs.size > 0;

  return (
    <div className="space-y-4">
      {error && (
        <div
          className="animate-in rounded-xl px-5 py-3 text-base"
          style={{
            background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.2)',
            color: '#f87171',
          }}
        >
          {error}
        </div>
      )}
      <div className="flex items-center justify-between">
        <h2 className="heading-display text-2xl font-semibold" style={{ color: 'var(--accent)' }}>
          {isVerdictStage ? 'Final Verdicts' : 'Court Characters'}
        </h2>
        <button
          onClick={triggerAll}
          disabled={anyLoading}
          className="rounded-xl px-5 py-2 text-base font-semibold transition-all hover:scale-[1.02] disabled:opacity-40"
          style={{
            background: 'rgba(212,160,60,0.15)',
            color: 'var(--accent)',
            border: '1px solid rgba(212,160,60,0.2)',
          }}
        >
          {anyLoading
            ? `Generating... (${loadingNpcs.size} of ${npcs.length} remaining)`
            : 'All NPCs Speak'}
        </button>
      </div>
      <div
        className="grid gap-5"
        style={{
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        }}
      >
        {npcs.map((npc) => (
          <NpcCard
            key={npc.id}
            npc={npc}
            responses={npcResponses.filter((r) => r.npcId === npc.id)}
            onTrigger={triggerNpc}
            isLoading={loadingNpcs.has(npc.id)}
            muted={muted}
          />
        ))}
        {taRoles.map((role) => (
          <TaCard
            key={role.id}
            role={role}
            responses={npcResponses.filter((r) => r.npcId === role.id)}
            onSubmit={onNpcResponse}
            currentStageId={currentStageId}
          />
        ))}
      </div>
    </div>
  );
}
