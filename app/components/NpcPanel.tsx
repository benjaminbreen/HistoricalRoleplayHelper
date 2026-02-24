'use client';

import { useState, useCallback } from 'react';
import { NpcCharacter, NpcResponse, Scenario, TranscriptEntry } from '../lib/types';
import { buildNpcSystemPrompt, buildNpcResponsePrompt, buildVerdictPrompt } from '../lib/prompts';
import NpcCard from './NpcCard';

interface NpcPanelProps {
  scenario: Scenario;
  npcs: NpcCharacter[];
  transcript: TranscriptEntry[];
  npcResponses: NpcResponse[];
  onNpcResponse: (response: NpcResponse) => void;
  currentStageId: string;
  isVerdictStage: boolean;
}

export default function NpcPanel({
  scenario,
  npcs,
  transcript,
  npcResponses,
  onNpcResponse,
  currentStageId,
  isVerdictStage,
}: NpcPanelProps) {
  const [loadingNpc, setLoadingNpc] = useState<string | null>(null);

  const triggerNpc = useCallback(
    async (npcId: string) => {
      const npc = npcs.find((n) => n.id === npcId);
      if (!npc) return;

      setLoadingNpc(npcId);
      try {
        const systemPrompt = buildNpcSystemPrompt(npc, scenario);
        const userPrompt = isVerdictStage
          ? buildVerdictPrompt(transcript, scenario, scenario.votingOptions)
          : buildNpcResponsePrompt(transcript, scenario);

        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ systemPrompt, userPrompt }),
        });

        const data = await res.json();
        if (data.text) {
          onNpcResponse({
            npcId,
            text: data.text,
            timestamp: Date.now(),
            stageId: currentStageId,
          });
        }
      } catch (error) {
        console.error('Failed to get NPC response:', error);
      } finally {
        setLoadingNpc(null);
      }
    },
    [npcs, scenario, transcript, isVerdictStage, currentStageId, onNpcResponse]
  );

  const triggerAll = useCallback(async () => {
    for (const npc of npcs) {
      await triggerNpc(npc.id);
    }
  }, [npcs, triggerNpc]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="heading-display text-2xl font-semibold" style={{ color: 'var(--accent)' }}>
          {isVerdictStage ? 'Final Verdicts' : 'Court Characters'}
        </h2>
        <button
          onClick={triggerAll}
          disabled={loadingNpc !== null}
          className="rounded-xl px-5 py-2 text-base font-semibold transition-all hover:scale-[1.02] disabled:opacity-40"
          style={{
            background: 'rgba(212,160,60,0.15)',
            color: 'var(--accent)',
            border: '1px solid rgba(212,160,60,0.2)',
          }}
        >
          {loadingNpc ? 'Generating...' : 'All NPCs Speak'}
        </button>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {npcs.map((npc) => (
          <NpcCard
            key={npc.id}
            npc={npc}
            responses={npcResponses.filter((r) => r.npcId === npc.id)}
            onTrigger={triggerNpc}
            isLoading={loadingNpc === npc.id}
          />
        ))}
      </div>
    </div>
  );
}
