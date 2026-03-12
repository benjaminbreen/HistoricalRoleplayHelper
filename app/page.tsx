'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Scenario, CharacterSheet } from './lib/types';
import { migrateFromLegacy, getMostRecentSession, getSession, listSessions, deleteSession, StoredSessionMeta } from './lib/sessionStore';
import SetupForm, { NavRequest } from './components/SetupForm';
import SessionView, { SessionInitialState } from './components/SessionView';
import RejoinView, { RejoinSessionData } from './components/RejoinView';
import CastLobbyScreen from './components/CastLobbyScreen';
import ThemeToggle from './components/ThemeToggle';
import EnrichSessionView from './components/EnrichSessionView';
import { createId } from './lib/createId';
import { pathToRoute, stateToPath, type SetupView } from './lib/routing';

export default function Home() {
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [sessionId, setSessionId] = useState('');
  const [rejoinData, setRejoinData] = useState<RejoinSessionData | null>(null);
  const [savedSessions, setSavedSessions] = useState<StoredSessionMeta[]>([]);
  const [initialState, setInitialState] = useState<SessionInitialState | undefined>();
  const [cast, setCast] = useState<CharacterSheet[]>([]);
  const [showLobby, setShowLobby] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showEnrich, setShowEnrich] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // ── URL routing state ──
  const [initialRoute, setInitialRoute] = useState<{ view: SetupView; mode: 'education' | 'civic' | null; category: string | null; scenarioSlug: string | null } | undefined>();
  const [navRequest, setNavRequest] = useState<NavRequest | null>(null);
  const currentPathRef = useRef('/');
  const routeInitRef = useRef(false);

  /** Push a URL unless it matches the current one. */
  const pushUrl = useCallback((path: string) => {
    if (path !== currentPathRef.current) {
      currentPathRef.current = path;
      window.history.pushState(null, '', path);
    }
  }, []);

  // Initialize route from URL on mount
  useEffect(() => {
    if (routeInitRef.current) return;
    routeInitRef.current = true;
    const route = pathToRoute(window.location.pathname);
    if (route.requiresState) {
      // Non-bookmarkable — replace with /
      window.history.replaceState(null, '', '/');
      currentPathRef.current = '/';
    } else if (route.page === 'enrich') {
      setShowEnrich(true);
      currentPathRef.current = '/enrich';
    } else if (route.setupView !== 'landing' || route.mode || route.category || route.scenarioSlug) {
      // Only set initialRoute if it differs from default (landing)
      setInitialRoute({ view: route.setupView, mode: route.mode, category: route.category, scenarioSlug: route.scenarioSlug });
      // Also send a navRequest so SetupForm picks it up even after initial render
      setNavRequest({ view: route.setupView, mode: route.mode, category: route.category, scenarioSlug: route.scenarioSlug, _ts: Date.now() });
      currentPathRef.current = window.location.pathname;
    }
  }, []);

  // Listen for popstate (back/forward)
  useEffect(() => {
    const handlePopState = () => {
      const route = pathToRoute(window.location.pathname);
      currentPathRef.current = window.location.pathname;

      if (route.requiresState) {
        // Shouldn't normally happen — redirect to /
        window.history.replaceState(null, '', '/');
        currentPathRef.current = '/';
      }

      // Reset page-level states
      setShowEnrich(route.page === 'enrich');
      setRejoinData(null);
      setScenario(null);
      setShowLobby(false);
      setSessionId('');
      setInitialState(undefined);
      setCast([]);

      if (route.page === 'setup') {
        setNavRequest({ view: route.setupView, mode: route.mode, category: route.category, scenarioSlug: route.scenarioSlug, _ts: Date.now() });
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Migrate legacy storage and load session list on mount
  useEffect(() => {
    migrateFromLegacy();
    setSavedSessions(listSessions());
  }, []);

  // Close hamburger menu on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    }
    if (showMenu) {
      document.addEventListener('mousedown', handleClick);
      return () => document.removeEventListener('mousedown', handleClick);
    }
  }, [showMenu]);

  const refreshSessions = useCallback(() => {
    setSavedSessions(listSessions());
  }, []);

  const handleResumeSession = useCallback((id: string) => {
    const session = getSession(id);
    if (!session) return;
    setInitialState({
      currentStageIndex: session.currentStageIndex,
      timerSeconds: session.timerSeconds,
      transcript: session.transcript,
      npcResponses: session.npcResponses,
      votingOptions: session.votingOptions,
      triggeredEventIds: session.triggeredEventIds,
    });
    setCast(session.cast ?? []);
    setSessionId(id);
    setScenario(session.scenario);
    pushUrl('/session');
  }, [pushUrl]);

  const handleDeleteSession = useCallback((id: string) => {
    deleteSession(id);
    refreshSessions();
  }, [refreshSessions]);

  const handleEndSession = useCallback(() => {
    setScenario(null);
    setSessionId('');
    setInitialState(undefined);
    setCast([]);
    setShowLobby(false);
    refreshSessions();
    pushUrl('/');
  }, [refreshSessions, pushUrl]);

  const handleStart = (s: Scenario, newCast: CharacterSheet[]) => {
    setCast(newCast);
    setSessionId(createId());
    setScenario(s);
    if (newCast.length > 0) {
      setShowLobby(true);
      pushUrl('/lobby');
    } else {
      pushUrl('/session');
    }
  };

  /** Callback from SetupForm when user navigates within setup views. */
  const handleSetupNavigate = useCallback((view: SetupView, mode: 'education' | 'civic' | null, category: string | null, scenarioSlug: string | null) => {
    pushUrl(stateToPath({ page: 'setup', setupView: view, mode, category, scenarioSlug }));
  }, [pushUrl]);

  if (showEnrich) {
    return <EnrichSessionView onBack={() => { setShowEnrich(false); pushUrl('/'); }} />;
  }

  if (rejoinData) {
    return (
      <RejoinView
        sessionData={rejoinData}
        onBack={() => { setRejoinData(null); pushUrl('/'); }}
      />
    );
  }

  if (scenario && showLobby) {
    return (
      <CastLobbyScreen
        scenario={scenario}
        cast={cast}
        onStart={() => { setShowLobby(false); pushUrl('/session'); }}
        onBack={() => { setScenario(null); setShowLobby(false); pushUrl('/'); }}
      />
    );
  }

  if (scenario) {
    return (
      <SessionView
        scenario={scenario}
        sessionId={sessionId}
        onEnd={handleEndSession}
        initialState={initialState}
        initialCast={cast}
      />
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--background)' }}>
      {/* Top-right controls */}
      <div className="fixed top-4 right-4 z-40 flex items-center gap-2">
        <div ref={menuRef} className="relative">
          <button
            onClick={() => setShowMenu((v) => !v)}
            className="group flex h-11 w-11 sm:h-9 sm:w-9 items-center justify-center rounded-xl transition-all duration-300 hover:scale-110"
            style={{
              background: showMenu ? 'rgba(212,160,60,0.12)' : 'var(--subtle-bg)',
              border: showMenu ? '1px solid rgba(212,160,60,0.25)' : '1px solid var(--subtle-border)',
            }}
            title="Menu"
            aria-label="Menu"
          >
            <svg
              className="transition-colors duration-300"
              style={{ color: showMenu ? 'var(--accent)' : 'var(--text-secondary)' }}
              width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
            >
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="18" x2="20" y2="18" />
            </svg>
          </button>
          {showMenu && (
            <div
              className="absolute right-0 top-11 min-w-[180px] rounded-xl overflow-hidden shadow-lg"
              style={{
                background: 'var(--panel)',
                border: '1px solid var(--panel-border)',
                backdropFilter: 'blur(12px)',
              }}
            >
              <button
                onClick={() => { setShowMenu(false); setShowAbout(true); }}
                className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium transition-colors text-left"
                style={{ color: 'var(--text-primary)' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--subtle-hover)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                  style={{ color: 'var(--text-muted)' }}>
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
                About
              </button>
              <div style={{ height: '1px', background: 'var(--subtle-border)' }} />
              <button
                onClick={() => { setShowMenu(false); setShowEnrich(true); pushUrl('/enrich'); }}
                className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium transition-colors text-left"
                style={{ color: 'var(--text-primary)' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--subtle-hover)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                  style={{ color: 'var(--text-muted)' }}>
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="12" y1="18" x2="12" y2="12" />
                  <line x1="9" y1="15" x2="15" y2="15" />
                </svg>
                Enrich Session
              </button>
            </div>
          )}
        </div>
        <ThemeToggle />
      </div>

      {/* About Modal */}
      {showAbout && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
          onClick={() => setShowAbout(false)}
          role="dialog"
          aria-modal="true"
          aria-label="About Deliberation Lab"
        >
          <div
            className="glass-strong animate-in-scale mx-4 max-w-md rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header band */}
            <div className="px-8 pt-8 pb-5" style={{ borderBottom: '1px solid var(--panel-border)' }}>
              <div className="flex items-center gap-3 mb-1">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                  style={{ color: 'var(--accent)' }}>
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
                <h2 className="heading-display text-2xl font-bold" style={{ color: 'var(--accent)' }}>
                  Deliberation Lab
                </h2>
              </div>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                Prototype by Benjamin Breen
              </p>
            </div>

            {/* Body */}
            <div className="px-8 py-6 space-y-4">
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                Designed for use in classes at UC Santa Cruz, but intended for use by anyone interested in structured deliberation.
              </p>

              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                  How it works
                </p>
                <div className="space-y-2.5">
                  {[
                    { icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253', text: 'Choose a preset scenario or create your own with custom stages, roles, and AI characters.' },
                    { icon: 'M19 11a7 7 0 0 1-7 7m0 0a7 7 0 0 1-7-7m7 7v4m0-11V3m-3.5 8a3.5 3.5 0 1 0 7 0 3.5 3.5 0 0 0-7 0z', text: 'Capture student arguments via speech-to-text or keyboard. Tag stances, track participation.' },
                    { icon: 'M17 8h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2v4l-4-4H9a2 2 0 0 1-2-2v-1m2-7h6a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H9l-4 4V10a2 2 0 0 1 2-2z', text: 'AI-powered characters respond to the debate in real time with historically grounded arguments.' },
                  ].map(({ icon, text }) => (
                    <div key={text} className="flex gap-3 items-start">
                      <svg className="flex-shrink-0 mt-0.5" style={{ color: 'var(--accent-dim)' }}
                        width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d={icon} />
                      </svg>
                      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-8 pb-6">
              <button
                onClick={() => setShowAbout(false)}
                className="w-full rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-300 hover:scale-[1.02]"
                style={{ background: 'rgba(212,160,60,0.12)', color: 'var(--accent)', border: '1px solid rgba(212,160,60,0.15)' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Saved Sessions */}
      {savedSessions.length > 0 && (
        <div
          className="glass-strong animate-in mx-auto mt-6 max-w-2xl rounded-2xl p-5"
          style={{ border: '1px solid rgba(212,160,60,0.25)' }}
        >
          <h3 className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
            Saved Sessions
          </h3>
          <div className="space-y-2">
            {savedSessions.map((s) => (
              <div key={s.id} className="flex items-center justify-between rounded-xl px-4 py-3" style={{ background: 'var(--subtle-bg)' }}>
                <div>
                  <p className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {s.title}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    {new Date(s.savedAt).toLocaleString()} &middot; Stage {s.stageIndex + 1}/{s.totalStages} &middot; {s.transcriptCount} argument{s.transcriptCount !== 1 ? 's' : ''}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDeleteSession(s.id)}
                    className="rounded-xl px-3 py-1.5 text-xs font-medium transition-all"
                    style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--text-secondary)' }}
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleResumeSession(s.id)}
                    className="rounded-xl px-3 py-1.5 text-xs font-semibold transition-all"
                    style={{ background: 'rgba(212,160,60,0.2)', color: 'var(--accent)', border: '1px solid rgba(212,160,60,0.3)' }}
                  >
                    Resume
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <SetupForm
        onStart={handleStart}
        onRejoin={(data) => { setRejoinData(data); pushUrl('/rejoin'); }}
        initialRoute={initialRoute}
        navRequest={navRequest}
        onNavigate={handleSetupNavigate}
      />
    </div>
  );
}
