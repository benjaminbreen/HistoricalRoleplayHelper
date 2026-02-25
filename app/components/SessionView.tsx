'use client';

import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { Scenario, TranscriptEntry, NpcResponse, VotingOption, SavedSession, ArgumentStance, RhetoricMode, StageEvent, CharacterSheet, isVerdictStage, isLeaderRole } from '../lib/types';
import Timer from './Timer';
import StageManager from './StageManager';
import SpeechCapture, { SpeechCaptureHandle } from './SpeechCapture';
import TranscriptLog from './TranscriptLog';
import NpcPanel from './NpcPanel';
import VotingPanel from './VotingPanel';
import Verdict from './Verdict';
import ParticipationStats from './ParticipationStats';
import CountdownOverlay from './CountdownOverlay';
import EventBanner from './EventBanner';
import EventControlPanel from './EventControlPanel';
import CastPanel from './CastPanel';
import ScenarioIntroModal from './ScenarioIntroModal';
import ThemeToggle from './ThemeToggle';

const STORAGE_KEY = 'hrh-active-session';
const SAVE_DEBOUNCE_MS = 2000;

interface ScheduledEventItem {
  event: StageEvent;
  triggerAtElapsed: number | null;
}

export interface SessionInitialState {
  currentStageIndex: number;
  timerSeconds: number;
  transcript: TranscriptEntry[];
  npcResponses: NpcResponse[];
  votingOptions: VotingOption[];
  triggeredEventIds?: string[];
}

interface SessionViewProps {
  scenario: Scenario;
  onEnd: () => void;
  initialState?: SessionInitialState;
  initialCast?: CharacterSheet[];
}

export default function SessionView({ scenario, onEnd, initialState, initialCast }: SessionViewProps) {
  const [currentStageIndex, setCurrentStageIndex] = useState(
    initialState?.currentStageIndex ?? 0
  );
  const [timerSeconds, setTimerSeconds] = useState(
    initialState?.timerSeconds ?? (scenario.stages[0]?.durationSeconds || 300)
  );
  const [timerRunning, setTimerRunning] = useState(false);
  const [transcript, setTranscript] = useState<TranscriptEntry[]>(
    initialState?.transcript ?? []
  );
  const [npcResponses, setNpcResponses] = useState<NpcResponse[]>(
    initialState?.npcResponses ?? []
  );
  const [votingOptions, setVotingOptions] = useState(
    initialState?.votingOptions ?? scenario.votingOptions.map((o) => ({ ...o, votes: 0 }))
  );
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showRoles, setShowRoles] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [muted, setMuted] = useState(false);
  const [showEventPanel, setShowEventPanel] = useState(false);
  const [cast] = useState<CharacterSheet[]>(initialCast ?? []);
  const [showCast, setShowCast] = useState(false);
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | undefined>();
  const [showIntro, setShowIntro] = useState(
    () => !!scenario.introNarrative && !initialState
  );

  // Event system state
  const [scheduledEvents, setScheduledEvents] = useState<ScheduledEventItem[]>([]);
  const [triggeredEventIds, setTriggeredEventIds] = useState<Set<string>>(
    () => new Set(initialState?.triggeredEventIds ?? [])
  );
  const [activeEvent, setActiveEvent] = useState<StageEvent | null>(null);

  const speechCaptureRef = useRef<SpeechCaptureHandle>(null);

  const currentStage = scenario.stages[currentStageIndex];

  // ── localStorage auto-save (debounced) ──
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      try {
        const payload: SavedSession = {
          scenario,
          currentStageIndex,
          timerSeconds,
          transcript,
          npcResponses,
          votingOptions,
          savedAt: new Date().toISOString(),
          triggeredEventIds: [...triggeredEventIds],
          cast: cast.length > 0 ? cast : undefined,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      } catch {
        // localStorage full or unavailable — silently ignore
      }
    }, SAVE_DEBOUNCE_MS);
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [scenario, currentStageIndex, timerSeconds, transcript, npcResponses, votingOptions, triggeredEventIds, cast]);

  // ── Event scheduling (on stage change) ──
  useEffect(() => {
    const stage = scenario.stages[currentStageIndex];
    if (!stage?.events || !['debate', 'freeform', 'speech'].includes(stage.type)) {
      setScheduledEvents([]);
      return;
    }
    const scheduled: ScheduledEventItem[] = stage.events.map((event) => {
      if (triggeredEventIds.has(event.id)) {
        // Already triggered in a previous visit — keep it but don't re-schedule
        return { event, triggerAtElapsed: null };
      }
      const passes = Math.random() < event.probability;
      if (!passes) return { event, triggerAtElapsed: null };
      const triggerAt = event.minDelay + Math.random() * (event.maxDelay - event.minDelay);
      return { event, triggerAtElapsed: triggerAt };
    });
    scheduled.sort((a, b) => (a.triggerAtElapsed ?? Infinity) - (b.triggerAtElapsed ?? Infinity));
    setScheduledEvents(scheduled);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStageIndex, scenario.stages]);

  // ── Event triggering (on timer tick) ──
  useEffect(() => {
    if (!timerRunning || scheduledEvents.length === 0) return;
    const stage = scenario.stages[currentStageIndex];
    if (!stage) return;
    const elapsed = stage.durationSeconds - timerSeconds;
    const next = scheduledEvents.find(
      (s) => s.triggerAtElapsed !== null && s.triggerAtElapsed <= elapsed && !triggeredEventIds.has(s.event.id)
    );
    if (next) {
      fireEvent(next.event);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timerSeconds]);

  const fireEvent = useCallback((event: StageEvent) => {
    setTriggeredEventIds((prev) => new Set(prev).add(event.id));
    setActiveEvent(event);
    const stage = scenario.stages[currentStageIndex];
    const entry: TranscriptEntry = {
      id: `event-${event.id}-${Date.now()}`,
      speaker: '[EVENT]',
      text: `${event.text}: ${event.description}`,
      timestamp: Date.now(),
      stageId: stage?.id || '',
      isSystemEvent: true,
    };
    setTranscript((prev) => [...prev, entry]);
  }, [currentStageIndex, scenario.stages]);

  const dismissEvent = useCallback(() => {
    setActiveEvent(null);
  }, []);

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

  const autoTagEntry = useCallback((entry: TranscriptEntry) => {
    fetch('/api/tag', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: entry.text, centralQuestion: scenario.centralQuestion }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.stance || data.rhetoric) {
          setTranscript((prev) =>
            prev.map((e) => {
              if (e.id !== entry.id) return e;
              // Only auto-fill if the user hasn't manually tagged
              return {
                ...e,
                stance: e.stance ?? data.stance ?? undefined,
                rhetoric: e.rhetoric ?? data.rhetoric ?? undefined,
              };
            })
          );
        }
      })
      .catch(() => {
        // Silently ignore — tagging is best-effort
      });
  }, [scenario.centralQuestion]);

  const handleCapture = useCallback((entry: TranscriptEntry) => {
    setTranscript((prev) => [...prev, entry]);
    autoTagEntry(entry);
  }, [autoTagEntry]);

  const handleRemoveEntry = useCallback((id: string) => {
    setTranscript((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const handleVoteEntry = useCallback((id: string, delta: number) => {
    setTranscript((prev) =>
      prev.map((e) => (e.id === id ? { ...e, votes: (e.votes ?? 0) + delta } : e))
    );
  }, []);

  const handleTagEntry = useCallback((id: string, stance?: ArgumentStance, rhetoric?: RhetoricMode) => {
    setTranscript((prev) =>
      prev.map((e) => {
        if (e.id !== id) return e;
        return {
          ...e,
          stance: stance !== undefined ? (e.stance === stance ? undefined : stance) : e.stance,
          rhetoric: rhetoric !== undefined ? (e.rhetoric === rhetoric ? undefined : rhetoric) : e.rhetoric,
        };
      })
    );
  }, []);

  const handleNpcResponse = useCallback((response: NpcResponse) => {
    setNpcResponses((prev) => [...prev, response]);
  }, []);

  const handleUpdateVotes = useCallback((optionId: string, votes: number) => {
    setVotingOptions((prev) =>
      prev.map((o) => (o.id === optionId ? { ...o, votes } : o))
    );
  }, []);

  // Clear localStorage on normal session end
  const handleEnd = useCallback(() => {
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
    onEnd();
  }, [onEnd]);

  const exportTranscript = useCallback(() => {
    const lines: string[] = [
      scenario.title,
      scenario.setting,
      `Central Question: ${scenario.centralQuestion}`,
      '',
      '--- TRANSCRIPT ---',
      '',
    ];
    for (const entry of transcript) {
      const time = new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      lines.push(`[${time}] ${entry.speaker}: ${entry.text}`);
    }
    if (npcResponses.length > 0) {
      lines.push('', '--- NPC RESPONSES ---', '');
      for (const r of npcResponses) {
        const npc = scenario.npcs.find((n) => n.id === r.npcId);
        lines.push(`${npc?.name || r.npcId}: ${r.text}`);
        lines.push('');
      }
    }
    const totalVotes = votingOptions.reduce((sum, o) => sum + o.votes, 0);
    if (totalVotes > 0) {
      lines.push('--- VOTE RESULTS ---', '');
      for (const o of votingOptions) {
        lines.push(`${o.label}: ${o.votes} votes`);
      }
    }
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${scenario.title.replace(/\s+/g, '_')}_transcript.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }, [scenario, transcript, npcResponses, votingOptions]);

  // Warn before leaving with unsaved data
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (transcript.length > 0 || npcResponses.length > 0) {
        e.preventDefault();
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [transcript.length, npcResponses.length]);

  // ── Keyboard shortcuts ──
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Intro modal handles its own keyboard events
      if (showIntro) return;

      const tag = (e.target as HTMLElement).tagName?.toLowerCase();
      const inInput = tag === 'input' || tag === 'textarea' || tag === 'select';

      // Always-active shortcuts
      if (e.key === '?') {
        e.preventDefault();
        setShowShortcuts((s) => !s);
        return;
      }
      if (e.key === 'Escape') {
        if (showShortcuts) { setShowShortcuts(false); return; }
        if (showEndConfirm) { setShowEndConfirm(false); return; }
        return;
      }

      // Skip remaining shortcuts when in an input
      if (inInput) return;

      if (e.key === ' ') {
        e.preventDefault();
        setTimerRunning((r) => !r);
      } else if (e.key === 'ArrowRight' || e.key === 'n') {
        e.preventDefault();
        nextStage();
      } else if (e.key === 'ArrowLeft' || e.key === 'p') {
        e.preventDefault();
        prevStage();
      } else if (e.key === 'r') {
        e.preventDefault();
        speechCaptureRef.current?.toggleRecording();
      } else if (e.key === 't') {
        e.preventDefault();
        speechCaptureRef.current?.toggleManual();
      } else if (e.key === 'm') {
        e.preventDefault();
        setMuted((m) => !m);
      } else if (e.key === 'e') {
        e.preventDefault();
        setShowEventPanel((s) => !s);
      } else if (e.key === 'c') {
        e.preventDefault();
        setShowCast((s) => !s);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextStage, prevStage, showShortcuts, showEndConfirm, showIntro]);

  const previousSpeakers = useMemo(() => {
    return [...new Set(transcript.map((e) => e.speaker))];
  }, [transcript]);

  const recentCharacterIds = useMemo(() => {
    const seen = new Set<string>();
    const ids: string[] = [];
    // Walk transcript in reverse to get most recent first
    for (let i = transcript.length - 1; i >= 0; i--) {
      const cid = transcript[i].characterId;
      if (cid && !seen.has(cid)) {
        seen.add(cid);
        ids.push(cid);
      }
    }
    return ids;
  }, [transcript]);

  const taRoles = useMemo(() => {
    return scenario.roles.filter((r) => isLeaderRole(r.suggestedFor));
  }, [scenario.roles]);

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
      {/* Background image — only on verdict/debrief stage */}
      {scenario.backgroundImage && currentStage && isVerdictStage(currentStage.type) && (
        <div
          className="scenario-bg"
          style={{ backgroundImage: `url(${scenario.backgroundImage})` }}
        />
      )}

      {/* Content layer */}
      <div className="relative z-10 flex min-h-screen flex-col">
        {/* Top Bar */}
        <header className="glass-strong flex items-center justify-between px-8 py-4">
          <div className="flex flex-1 items-center gap-4">
            {scenario.backgroundImage && (
              <div
                className="h-12 w-12 flex-shrink-0 rounded-xl bg-cover bg-center"
                style={{
                  backgroundImage: `url(${scenario.backgroundImage})`,
                  border: '1px solid rgba(212,160,60,0.2)',
                }}
              />
            )}
            <div>
              <h1 className="heading-display text-3xl font-bold" style={{ color: 'var(--accent)' }}>
                {scenario.title}
              </h1>
              <p className="mt-0.5 text-sm" style={{ color: 'var(--text-secondary)' }}>
                {scenario.setting}
              </p>
            </div>
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
          <button
            onClick={() => setMuted((m) => !m)}
            className="ml-4 rounded-xl px-4 py-2 text-sm font-medium transition-all"
            style={{
              background: muted ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.06)',
              color: muted ? '#f87171' : 'var(--text-secondary)',
              border: muted ? '1px solid rgba(239,68,68,0.25)' : '1px solid transparent',
            }}
            title={muted ? 'Unmute NPC voices' : 'Mute NPC voices'}
          >
            {muted ? '🔇 Muted' : '🔊'}
          </button>
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

        {/* Student Roles Panel */}
        {showRoles && scenario.roles.length > 0 && (
          <div className="glass animate-in mx-8 mt-2 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                Assigned Roles
              </h3>
              <button onClick={() => setShowRoles(false)} className="text-xs" style={{ color: 'var(--text-muted)' }}>
                Hide
              </button>
            </div>
            <div className="flex flex-wrap gap-3">
              {scenario.roles.map((role) => (
                <div key={role.id} className="flex items-center gap-2 rounded-xl px-3 py-2"
                  style={{
                    background: isLeaderRole(role.suggestedFor) ? 'rgba(99,182,255,0.08)' : 'rgba(212,160,60,0.08)',
                    border: `1px solid ${isLeaderRole(role.suggestedFor) ? 'rgba(99,182,255,0.15)' : 'rgba(212,160,60,0.12)'}`,
                  }}>
                  <span className="rounded-full px-1.5 py-0.5 text-[10px] font-bold uppercase"
                    style={{
                      background: isLeaderRole(role.suggestedFor) ? 'rgba(99,182,255,0.2)' : 'rgba(212,160,60,0.15)',
                      color: isLeaderRole(role.suggestedFor) ? '#63b6ff' : 'var(--accent)',
                    }}>
                    {role.suggestedFor}
                  </span>
                  <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {role.name}
                  </span>
                  {role.assignedTo && (
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      — {role.assignedTo}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Participation Stats Panel */}
        {showStats && (
          <ParticipationStats transcript={transcript} studentRoles={scenario.roles} />
        )}

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
                <TranscriptLog entries={transcript} stages={scenario.stages} onRemove={handleRemoveEntry} onVote={handleVoteEntry} onTag={handleTagEntry} />
                <SpeechCapture
                  ref={speechCaptureRef}
                  stageId={currentStage.id}
                  onCapture={handleCapture}
                  previousSpeakers={previousSpeakers}
                  cast={cast}
                  selectedCharacterId={selectedCharacterId}
                  onCharacterSelect={setSelectedCharacterId}
                  recentCharacterIds={recentCharacterIds}
                  onOpenCastPanel={() => setShowCast(true)}
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
                liveVotingOptions={votingOptions}
                muted={muted}
                taRoles={taRoles}
              />
              <TranscriptLog entries={transcript} stages={scenario.stages} onVote={handleVoteEntry} onTag={handleTagEntry} />
            </div>
          )}

          {currentStage && currentStage.type === 'vote' && (
            <VotingPanel
              centralQuestion={scenario.centralQuestion}
              options={votingOptions}
              onUpdateVotes={handleUpdateVotes}
            />
          )}

          {currentStage && isVerdictStage(currentStage.type) && (
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
                liveVotingOptions={votingOptions}
                muted={muted}
                taRoles={taRoles}
              />
            </div>
          )}
        </main>

        {/* Event Control Panel */}
        {showEventPanel && (
          <EventControlPanel
            scheduledEvents={scheduledEvents}
            triggeredIds={triggeredEventIds}
            onTrigger={fireEvent}
            elapsed={currentStage ? currentStage.durationSeconds - timerSeconds : 0}
          />
        )}

        {/* Bottom Controls */}
        <footer className="glass-strong flex items-center justify-between px-8 py-3">
          <div className="flex gap-2">
            <button
              onClick={prevStage}
              disabled={currentStageIndex === 0}
              className="rounded-xl px-5 py-2.5 text-base font-medium transition-all disabled:opacity-20"
              style={{ background: 'var(--subtle-bg)', color: 'var(--text-primary)' }}
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
            {cast.length > 0 && (
              <button
                onClick={() => setShowCast((s) => !s)}
                className="rounded-xl px-4 py-2.5 text-base transition-all"
                style={{
                  background: showCast ? 'rgba(212,160,60,0.15)' : 'rgba(255,255,255,0.06)',
                  color: showCast ? 'var(--accent)' : 'var(--text-secondary)',
                }}
                title="Toggle cast panel (c)"
              >
                Cast
              </button>
            )}
            {currentStage?.events && currentStage.events.length > 0 && (
              <button
                onClick={() => setShowEventPanel((s) => !s)}
                className="rounded-xl px-4 py-2.5 text-base transition-all"
                style={{
                  background: showEventPanel ? 'rgba(200,120,30,0.15)' : 'rgba(255,255,255,0.06)',
                  color: showEventPanel ? '#f59e0b' : 'var(--text-secondary)',
                }}
              >
                Events
              </button>
            )}
            <button
              onClick={() => setShowStats((s) => !s)}
              className="rounded-xl px-4 py-2.5 text-base transition-all"
              style={{
                background: showStats ? 'rgba(212,160,60,0.15)' : 'rgba(255,255,255,0.06)',
                color: showStats ? 'var(--accent)' : 'var(--text-secondary)',
              }}
            >
              Stats
            </button>
            {scenario.roles.length > 0 && (
              <button
                onClick={() => setShowRoles((s) => !s)}
                className="rounded-xl px-4 py-2.5 text-base transition-all"
                style={{
                  background: showRoles ? 'rgba(212,160,60,0.15)' : 'rgba(255,255,255,0.06)',
                  color: showRoles ? 'var(--accent)' : 'var(--text-secondary)',
                }}
              >
                Roles
              </button>
            )}
            <button
              onClick={exportTranscript}
              disabled={transcript.length === 0}
              className="rounded-xl px-4 py-2.5 text-base transition-all disabled:opacity-20"
              style={{ background: 'var(--subtle-bg)', color: 'var(--text-secondary)' }}
              title="Export transcript"
            >
              Export
            </button>
            <ThemeToggle />
            <button
              onClick={toggleFullscreen}
              className="rounded-xl px-4 py-2.5 text-base transition-all"
              style={{ background: 'var(--subtle-bg)', color: 'var(--text-secondary)' }}
              title="Toggle fullscreen"
            >
              {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            </button>
            <button
              onClick={() => setShowShortcuts((s) => !s)}
              className="rounded-xl px-3 py-2.5 text-base transition-all"
              style={{ background: 'var(--subtle-bg)', color: 'var(--text-muted)' }}
              title="Keyboard shortcuts (?)"
            >
              ?
            </button>
            <button
              onClick={() => setShowEndConfirm(true)}
              className="rounded-xl px-4 py-2.5 text-base text-red-400/60 transition-all hover:text-red-400"
              style={{ background: 'var(--subtle-bg)' }}
            >
              End
            </button>
          </div>
        </footer>
      </div>

      {/* Cast Panel */}
      {cast.length > 0 && (
        <CastPanel
          cast={cast}
          transcript={transcript}
          isOpen={showCast}
          onClose={() => setShowCast(false)}
          onSelectCharacter={(id) => {
            setSelectedCharacterId(id);
            setShowCast(false);
          }}
        />
      )}

      {/* Event Banner */}
      <EventBanner event={activeEvent} onDismiss={dismissEvent} />

      {/* Scenario Intro Modal */}
      {showIntro && (
        <ScenarioIntroModal scenario={scenario} onDismiss={() => setShowIntro(false)} />
      )}

      {/* Countdown Overlay */}
      <CountdownOverlay seconds={timerSeconds} running={timerRunning} />

      {/* Keyboard Shortcuts Help Overlay */}
      {showShortcuts && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.5)' }}
          onClick={() => setShowShortcuts(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Keyboard shortcuts"
        >
          <div
            className="glass-strong animate-in-scale mx-4 max-w-sm rounded-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="heading-display text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              Keyboard Shortcuts
            </h3>
            <div className="space-y-2 text-sm">
              {[
                ['Space', 'Toggle timer'],
                ['\u2192 / n', 'Next stage'],
                ['\u2190 / p', 'Previous stage'],
                ['r', 'Toggle recording'],
                ['t', 'Toggle text entry'],
                ['m', 'Mute/unmute NPC voices'],
                ['c', 'Toggle cast panel'],
                ['e', 'Toggle events panel'],
                ['?', 'Toggle this help'],
                ['Esc', 'Close overlay'],
              ].map(([key, desc]) => (
                <div key={key} className="flex items-center justify-between gap-4">
                  <kbd
                    className="rounded-lg px-2.5 py-1 text-xs font-mono font-semibold"
                    style={{ background: 'var(--subtle-border)', color: 'var(--text-primary)', border: '1px solid var(--subtle-hover)' }}
                  >
                    {key}
                  </kbd>
                  <span style={{ color: 'var(--text-secondary)' }}>{desc}</span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs" style={{ color: 'var(--text-muted)' }}>
              Shortcuts are disabled while typing in input fields.
            </p>
          </div>
        </div>
      )}

      {/* End Session Confirmation */}
      {showEndConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.6)' }} role="dialog" aria-modal="true" aria-label="End session confirmation">
          <div className="glass-strong animate-in-scale mx-4 max-w-md rounded-2xl p-8 text-center">
            <h3 className="heading-display text-2xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
              End Session?
            </h3>
            <p className="text-base mb-6" style={{ color: 'var(--text-secondary)' }}>
              This will end the current roleplaying session. All transcript data will be lost.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setShowEndConfirm(false)}
                className="rounded-xl px-6 py-2.5 text-base font-medium transition-all"
                style={{ background: 'var(--subtle-border)', color: 'var(--text-primary)' }}
              >
                Cancel
              </button>
              <button
                onClick={handleEnd}
                className="rounded-xl px-6 py-2.5 text-base font-semibold transition-all"
                style={{ background: 'rgba(239,68,68,0.2)', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)' }}
              >
                End Session
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
