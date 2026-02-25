'use client';

import { useState, useEffect } from 'react';
import { Scenario, SavedSession } from './lib/types';
import SetupForm from './components/SetupForm';
import SessionView, { SessionInitialState } from './components/SessionView';
import RejoinView, { RejoinSessionData } from './components/RejoinView';

const STORAGE_KEY = 'hrh-active-session';

export default function Home() {
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [rejoinData, setRejoinData] = useState<RejoinSessionData | null>(null);
  const [recoveredSession, setRecoveredSession] = useState<SavedSession | null>(null);
  const [initialState, setInitialState] = useState<SessionInitialState | undefined>();

  // Check for saved session on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: SavedSession = JSON.parse(raw);
        if (parsed.scenario && parsed.transcript) {
          setRecoveredSession(parsed);
        }
      }
    } catch {
      // corrupt data — ignore
    }
  }, []);

  const handleResume = () => {
    if (!recoveredSession) return;
    setInitialState({
      currentStageIndex: recoveredSession.currentStageIndex,
      timerSeconds: recoveredSession.timerSeconds,
      transcript: recoveredSession.transcript,
      npcResponses: recoveredSession.npcResponses,
      votingOptions: recoveredSession.votingOptions,
      triggeredEventIds: recoveredSession.triggeredEventIds,
    });
    setScenario(recoveredSession.scenario);
    setRecoveredSession(null);
  };

  const handleDiscard = () => {
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
    setRecoveredSession(null);
  };

  const handleEndSession = () => {
    setScenario(null);
    setInitialState(undefined);
  };

  if (rejoinData) {
    return (
      <RejoinView
        sessionData={rejoinData}
        onBack={() => setRejoinData(null)}
      />
    );
  }

  if (scenario) {
    return (
      <SessionView
        scenario={scenario}
        onEnd={handleEndSession}
        initialState={initialState}
      />
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--background)' }}>
      {/* Recovery Banner */}
      {recoveredSession && (
        <div
          className="glass-strong animate-in mx-auto mt-6 max-w-2xl rounded-2xl p-5"
          style={{ border: '1px solid rgba(212,160,60,0.25)' }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
                Unsaved session found
              </h3>
              <p className="mt-0.5 text-sm" style={{ color: 'var(--text-muted)' }}>
                &ldquo;{recoveredSession.scenario.title}&rdquo; &mdash;{' '}
                {new Date(recoveredSession.savedAt).toLocaleString()} &middot;{' '}
                {recoveredSession.transcript.length} argument{recoveredSession.transcript.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleDiscard}
                className="rounded-xl px-4 py-2 text-sm font-medium transition-all"
                style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--text-secondary)' }}
              >
                Discard
              </button>
              <button
                onClick={handleResume}
                className="rounded-xl px-4 py-2 text-sm font-semibold transition-all"
                style={{ background: 'rgba(212,160,60,0.2)', color: 'var(--accent)', border: '1px solid rgba(212,160,60,0.3)' }}
              >
                Resume
              </button>
            </div>
          </div>
        </div>
      )}
      <SetupForm onStart={setScenario} onRejoin={setRejoinData} />
    </div>
  );
}
