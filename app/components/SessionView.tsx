'use client';

import { useState, useCallback } from 'react';
import { Scenario, TranscriptEntry, NpcResponse } from '../lib/types';
import Timer from './Timer';
import StageManager from './StageManager';
import SpeechCapture from './SpeechCapture';
import TranscriptLog from './TranscriptLog';
import NpcPanel from './NpcPanel';
import VotingPanel from './VotingPanel';
import Verdict from './Verdict';

interface SessionViewProps {
  scenario: Scenario;
  onEnd: () => void;
}

export default function SessionView({ scenario, onEnd }: SessionViewProps) {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(
    scenario.stages[0]?.durationSeconds || 300
  );
  const [timerRunning, setTimerRunning] = useState(false);
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [npcResponses, setNpcResponses] = useState<NpcResponse[]>([]);
  const [votingOptions, setVotingOptions] = useState(
    scenario.votingOptions.map((o) => ({ ...o, votes: 0 }))
  );
  const [isFullscreen, setIsFullscreen] = useState(false);

  const currentStage = scenario.stages[currentStageIndex];

  const goToStage = useCallback(
    (index: number) => {
      if (index >= 0 && index < scenario.stages.length) {
        setCurrentStageIndex(index);
        setTimerSeconds(scenario.stages[index].durationSeconds);
        setTimerRunning(false);
      }
    },
    [scenario.stages]
  );

  const nextStage = useCallback(() => {
    goToStage(currentStageIndex + 1);
  }, [currentStageIndex, goToStage]);

  const prevStage = useCallback(() => {
    goToStage(currentStageIndex - 1);
  }, [currentStageIndex, goToStage]);

  const handleCapture = useCallback((entry: TranscriptEntry) => {
    setTranscript((prev) => [...prev, entry]);
  }, []);

  const handleNpcResponse = useCallback((response: NpcResponse) => {
    setNpcResponses((prev) => [...prev, response]);
  }, []);

  const handleUpdateVotes = useCallback((optionId: string, votes: number) => {
    setVotingOptions((prev) =>
      prev.map((o) => (o.id === optionId ? { ...o, votes } : o))
    );
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  return (
    <div className="noise flex min-h-screen flex-col">
      {/* Background image */}
      {scenario.backgroundImage && (
        <div
          className="scenario-bg"
          style={{ backgroundImage: `url(${scenario.backgroundImage})` }}
        />
      )}

      {/* Content layer */}
      <div className="relative z-10 flex min-h-screen flex-col">
        {/* Top Bar */}
        <header className="glass-strong flex items-center justify-between px-8 py-4">
          <div className="flex-1">
            <h1 className="heading-display text-3xl font-bold" style={{ color: 'var(--accent)' }}>
              {scenario.title}
            </h1>
            <p className="mt-0.5 text-sm" style={{ color: 'var(--text-secondary)' }}>
              {scenario.timePeriod}
            </p>
          </div>
          <Timer
            seconds={timerSeconds}
            running={timerRunning}
            onTick={setTimerSeconds}
            onComplete={nextStage}
            onToggle={() => setTimerRunning((r) => !r)}
            onReset={(s) => {
              setTimerSeconds(s);
              setTimerRunning(false);
            }}
            defaultDuration={currentStage?.durationSeconds || 300}
          />
        </header>

        {/* Stage Progress */}
        <div className="glass border-t-0 px-8 py-2">
          <StageManager
            stages={scenario.stages}
            currentIndex={currentStageIndex}
            onNavigate={goToStage}
          />
        </div>

        {/* Stage Header */}
        <div className="px-8 py-5">
          <h2 className="heading-display text-3xl font-semibold" style={{ color: 'var(--text-primary)' }}>
            {currentStage?.title || 'Session'}
          </h2>
          <p className="mt-1 text-lg" style={{ color: 'var(--text-secondary)' }}>
            {currentStage?.description || ''}
          </p>
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto px-8 pb-6">
          {currentStage &&
            ['freeform', 'debate', 'speech'].includes(currentStage.type) && (
              <div className="space-y-5">
                {currentStage.type === 'debate' && (
                  <div className="glass animate-in-scale rounded-2xl p-6 text-center">
                    <p className="heading-display text-2xl font-semibold" style={{ color: 'var(--accent)' }}>
                      {scenario.centralQuestion}
                    </p>
                  </div>
                )}
                <TranscriptLog entries={transcript} />
                <SpeechCapture
                  stageId={currentStage.id}
                  onCapture={handleCapture}
                />
              </div>
            )}

          {currentStage && currentStage.type === 'npc_response' && (
            <div className="space-y-6">
              <NpcPanel
                scenario={scenario}
                npcs={scenario.npcs}
                transcript={transcript}
                npcResponses={npcResponses}
                onNpcResponse={handleNpcResponse}
                currentStageId={currentStage.id}
                isVerdictStage={false}
              />
              <TranscriptLog entries={transcript} />
            </div>
          )}

          {currentStage && currentStage.type === 'vote' && (
            <VotingPanel
              centralQuestion={scenario.centralQuestion}
              options={votingOptions}
              onUpdateVotes={handleUpdateVotes}
            />
          )}

          {currentStage && currentStage.type === 'verdict' && (
            <div className="space-y-6">
              <Verdict
                scenario={scenario}
                transcript={transcript}
                npcResponses={npcResponses}
                votingOptions={votingOptions}
              />
              <NpcPanel
                scenario={scenario}
                npcs={scenario.npcs}
                transcript={transcript}
                npcResponses={npcResponses}
                onNpcResponse={handleNpcResponse}
                currentStageId={currentStage.id}
                isVerdictStage={true}
              />
            </div>
          )}
        </main>

        {/* Bottom Controls */}
        <footer className="glass-strong flex items-center justify-between px-8 py-3">
          <div className="flex gap-2">
            <button
              onClick={prevStage}
              disabled={currentStageIndex === 0}
              className="rounded-xl px-5 py-2.5 text-base font-medium transition-all disabled:opacity-20"
              style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--text-primary)' }}
            >
              Previous
            </button>
            <button
              onClick={nextStage}
              disabled={currentStageIndex >= scenario.stages.length - 1}
              className="rounded-xl px-5 py-2.5 text-base font-semibold transition-all disabled:opacity-20"
              style={{ background: 'rgba(212, 160, 60, 0.2)', color: 'var(--accent)' }}
            >
              Next Stage
            </button>
          </div>

          <div className="flex items-center gap-4 text-sm" style={{ color: 'var(--text-muted)' }}>
            <span>Stage {currentStageIndex + 1}/{scenario.stages.length}</span>
            <span className="opacity-40">|</span>
            <span>{transcript.length} arguments</span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={toggleFullscreen}
              className="rounded-xl px-4 py-2.5 text-base transition-all"
              style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--text-secondary)' }}
              title="Toggle fullscreen"
            >
              {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            </button>
            <button
              onClick={onEnd}
              className="rounded-xl px-4 py-2.5 text-base text-red-400/60 transition-all hover:text-red-400"
              style={{ background: 'rgba(255,255,255,0.04)' }}
            >
              End
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
