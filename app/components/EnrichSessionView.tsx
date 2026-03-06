'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { CharacterSheet, TranscriptEntry, Scenario } from '../lib/types';
import CharacterUploader from './CharacterUploader';
import CharacterReviewGrid from './CharacterReviewGrid';

interface EnrichSessionViewProps {
  onBack: () => void;
}

interface ParsedSession {
  scenario: Scenario;
  transcript: TranscriptEntry[];
  votingOptions?: { id: string; label: string; votes: number }[];
  npcResponses?: { npcId: string; text: string; timestamp: number; stageId: string }[];
  [key: string]: unknown;
}

type MatchResult = {
  characterId: string;
  characterName: string;
  matchedSpeakers: string[];
};

function normalize(name: string): string {
  return name.toLowerCase().trim();
}

function autoMatch(
  characters: CharacterSheet[],
  speakers: string[]
): { matches: Map<string, string>; unmatched: string[] } {
  const matches = new Map<string, string>(); // speaker -> characterId

  for (const speaker of speakers) {
    const normSpeaker = normalize(speaker);

    // Pass 1: exact match
    const exact = characters.find((c) => normalize(c.characterName) === normSpeaker);
    if (exact) {
      matches.set(speaker, exact.id);
      continue;
    }

    // Pass 2: substring contains (either direction)
    const contains = characters.find((c) => {
      const normChar = normalize(c.characterName);
      return normChar.includes(normSpeaker) || normSpeaker.includes(normChar);
    });
    if (contains) {
      matches.set(speaker, contains.id);
    }
  }

  const unmatched = speakers.filter((s) => !matches.has(s));
  return { matches, unmatched };
}

export default function EnrichSessionView({ onBack }: EnrichSessionViewProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [session, setSession] = useState<ParsedSession | null>(null);
  const [speakers, setSpeakers] = useState<string[]>([]);
  const [cast, setCast] = useState<CharacterSheet[]>([]);
  const [matches, setMatches] = useState<Map<string, string>>(new Map());
  const [unmatched, setUnmatched] = useState<string[]>([]);
  const [manualAssignments, setManualAssignments] = useState<Record<string, string>>({});
  const [parseError, setParseError] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Step 1: parse JSON
  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setParseError('');

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string);
        if (!data.scenario || !data.transcript) {
          setParseError('Invalid file: must contain "scenario" and "transcript" fields.');
          return;
        }

        // Normalize legacy field names from older exports
        const s = data.scenario;
        if (!s.setting && s.timePeriod) s.setting = s.timePeriod;
        if (!s.context && s.historicalContext) s.context = s.historicalContext;
        if (!s.roles && s.studentRoles) s.roles = s.studentRoles;
        if (!s.outcome && s.historicalOutcome) s.outcome = s.historicalOutcome;
        if (!s.roles) s.roles = [];
        if (Array.isArray(s.npcs)) {
          for (const npc of s.npcs) {
            if (!npc.context && npc.historicalContext) npc.context = npc.historicalContext;
          }
        }

        setSession(data as ParsedSession);
        const uniqueSpeakers = [...new Set(
          (data.transcript as TranscriptEntry[])
            .filter((e: TranscriptEntry) => !e.isSystemEvent)
            .map((e: TranscriptEntry) => e.speaker)
        )];
        setSpeakers(uniqueSpeakers);
      } catch {
        setParseError('Failed to parse JSON file.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }, []);

  // Step 2: receive OCR results
  const handleExtracted = useCallback((sheets: CharacterSheet[]) => {
    setCast((prev) => [...prev, ...sheets]);
  }, []);

  const handleUpdateChar = useCallback((id: string, updates: Partial<CharacterSheet>) => {
    setCast((prev) => {
      const exists = prev.find((c) => c.id === id);
      if (!exists) return [...prev, { ...updates, id } as CharacterSheet];
      return prev.map((c) => (c.id === id ? { ...c, ...updates } : c));
    });
  }, []);

  const handleRemoveChar = useCallback((id: string) => {
    setCast((prev) => prev.filter((c) => c.id !== id));
  }, []);

  // Step 3: run matching
  const runMatch = useCallback(() => {
    const result = autoMatch(cast, speakers);
    setMatches(result.matches);
    setUnmatched(result.unmatched);
    setManualAssignments({});
    setStep(3);
  }, [cast, speakers]);

  // Build match results for display
  const matchResults: MatchResult[] = cast.map((c) => ({
    characterId: c.id,
    characterName: c.characterName,
    matchedSpeakers: speakers.filter((s) => matches.get(s) === c.id),
  }));

  // Download enriched JSON
  const downloadEnriched = useCallback(() => {
    if (!session) return;

    // Combine auto matches + manual assignments
    const allMatches = new Map(matches);
    for (const [speaker, charId] of Object.entries(manualAssignments)) {
      if (charId) allMatches.set(speaker, charId);
    }

    const enrichedTranscript = session.transcript.map((entry) => ({
      ...entry,
      characterId: allMatches.get(entry.speaker) || entry.characterId || undefined,
    }));

    const enriched = {
      ...session,
      transcript: enrichedTranscript,
      cast: cast,
    };

    const blob = new Blob([JSON.stringify(enriched, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${session.scenario.title.replace(/[^a-zA-Z0-9]/g, '_')}_enriched.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [session, matches, manualAssignments, cast]);

  return (
    <div className="min-h-screen" style={{ background: 'var(--background)' }}>
      {/* Header */}
      <div className="mx-auto max-w-3xl px-4 pt-8 pb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-medium transition-colors mb-6"
          style={{ color: 'var(--text-secondary)' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        <h1 className="heading-display text-2xl font-bold mb-1" style={{ color: 'var(--accent)' }}>
          Enrich Session
        </h1>
        <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
          Add character portraits to a session that was recorded before character sheets were set up.
        </p>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all"
                style={{
                  background: step >= s ? 'rgba(212,160,60,0.2)' : 'var(--subtle-bg)',
                  color: step >= s ? 'var(--accent)' : 'var(--text-muted)',
                  border: step === s ? '2px solid var(--accent)' : '1px solid var(--subtle-border)',
                }}
              >
                {s}
              </div>
              {s < 3 && (
                <div
                  className="h-px w-8"
                  style={{ background: step > s ? 'var(--accent-dim)' : 'var(--subtle-border)' }}
                />
              )}
            </div>
          ))}
          <span className="ml-3 text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
            {step === 1 ? 'Upload JSON' : step === 2 ? 'Upload Character Sheets' : 'Match & Download'}
          </span>
        </div>
      </div>

      {/* Step content */}
      <div className="mx-auto max-w-3xl px-4 pb-16">

        {/* ── STEP 1: Upload JSON ── */}
        {step === 1 && (
          <div className="glass-strong rounded-2xl p-6" style={{ border: '1px solid var(--panel-border)' }}>
            <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
              Upload Session JSON
            </h2>
            <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
              Select the exported JSON file from a previous session. It must contain <code style={{ color: 'var(--accent)', fontSize: '0.8em' }}>scenario</code> and <code style={{ color: 'var(--accent)', fontSize: '0.8em' }}>transcript</code> fields.
            </p>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="rounded-xl px-5 py-2.5 text-sm font-semibold transition-all hover:scale-[1.02]"
              style={{
                background: 'rgba(212,160,60,0.12)',
                color: 'var(--accent)',
                border: '1px solid rgba(212,160,60,0.2)',
              }}
            >
              Select JSON File
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />

            {parseError && (
              <p className="mt-3 text-sm font-medium" style={{ color: '#f87171' }}>
                {parseError}
              </p>
            )}

            {session && (
              <div className="mt-5 space-y-4">
                <div className="rounded-xl p-4" style={{ background: 'var(--subtle-bg)', border: '1px solid var(--subtle-border)' }}>
                  <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                    {session.scenario.title}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    {session.transcript.length} transcript entries &middot; {speakers.length} unique speakers
                  </p>
                </div>

                {/* Speaker chips */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
                    Speakers Found
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {speakers.map((s) => (
                      <span
                        key={s}
                        className="rounded-full px-3 py-1 text-xs font-medium"
                        style={{
                          background: 'rgba(212,160,60,0.1)',
                          color: 'var(--accent)',
                          border: '1px solid rgba(212,160,60,0.15)',
                        }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setStep(2)}
                  className="rounded-xl px-5 py-2.5 text-sm font-semibold transition-all hover:scale-[1.02]"
                  style={{
                    background: 'var(--accent)',
                    color: '#0f1117',
                  }}
                >
                  Next: Upload Character Sheets
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── STEP 2: Upload Character Sheets ── */}
        {step === 2 && (
          <div className="space-y-5">
            <div className="glass-strong rounded-2xl p-6" style={{ border: '1px solid var(--panel-border)' }}>
              <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                Upload Character Sheets
              </h2>
              <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                Upload photos of character sheets. They&apos;ll be OCR&apos;d via Gemini to extract character names, portraits, and details.
              </p>
              <CharacterUploader onExtracted={handleExtracted} existingCount={cast.length} />
            </div>

            {cast.length > 0 && (
              <div className="glass-strong rounded-2xl p-6" style={{ border: '1px solid var(--panel-border)' }}>
                <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                  Extracted Characters ({cast.length})
                </h3>
                <CharacterReviewGrid
                  cast={cast}
                  onUpdate={handleUpdateChar}
                  onRemove={handleRemoveChar}
                  mode="review"
                />
                <div className="mt-5 flex gap-3">
                  <button
                    onClick={() => setStep(1)}
                    className="rounded-xl px-4 py-2 text-sm font-medium transition-all"
                    style={{ background: 'var(--subtle-bg)', color: 'var(--text-secondary)', border: '1px solid var(--subtle-border)' }}
                  >
                    Back
                  </button>
                  <button
                    onClick={runMatch}
                    className="rounded-xl px-5 py-2.5 text-sm font-semibold transition-all hover:scale-[1.02]"
                    style={{
                      background: 'var(--accent)',
                      color: '#0f1117',
                    }}
                  >
                    Match Characters to Speakers
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── STEP 3: Match & Download ── */}
        {step === 3 && (
          <div className="space-y-5">
            {/* Match results */}
            <div className="glass-strong rounded-2xl p-6" style={{ border: '1px solid var(--panel-border)' }}>
              <h2 className="text-base font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                Match Results
              </h2>

              <div className="space-y-2">
                {matchResults.map((mr) => (
                  <div
                    key={mr.characterId}
                    className="flex items-center gap-3 rounded-xl px-4 py-3"
                    style={{ background: 'var(--subtle-bg)' }}
                  >
                    {/* Portrait thumbnail */}
                    {(() => {
                      const sheet = cast.find((c) => c.id === mr.characterId);
                      return sheet?.portraitDataUrl ? (
                        <img
                          src={sheet.portraitDataUrl}
                          alt={mr.characterName}
                          className="h-10 w-10 rounded-lg object-cover flex-shrink-0"
                        />
                      ) : (
                        <div
                          className="flex h-10 w-10 items-center justify-center rounded-lg text-sm flex-shrink-0"
                          style={{ background: 'rgba(212,160,60,0.1)', color: 'var(--accent)' }}
                        >
                          {mr.characterName.charAt(0) || '?'}
                        </div>
                      );
                    })()}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                        {mr.characterName}
                      </p>
                      {mr.matchedSpeakers.length > 0 ? (
                        <p className="text-xs" style={{ color: 'var(--accent-dim)' }}>
                          Matched to: {mr.matchedSpeakers.join(', ')}
                        </p>
                      ) : (
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                          No speaker matched
                        </p>
                      )}
                    </div>
                    {mr.matchedSpeakers.length > 0 && (
                      <svg
                        width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                        style={{ color: '#22c55e' }}
                      >
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Unmatched speakers */}
            {unmatched.length > 0 && (
              <div className="glass-strong rounded-2xl p-6" style={{ border: '1px solid rgba(234,179,8,0.25)' }}>
                <h3 className="text-sm font-semibold mb-3" style={{ color: '#eab308' }}>
                  Unmatched Speakers ({unmatched.length})
                </h3>
                <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
                  These speakers couldn&apos;t be automatically matched. Assign them manually or leave unmatched.
                </p>
                <div className="space-y-2">
                  {unmatched.map((speaker) => (
                    <div
                      key={speaker}
                      className="flex items-center gap-3 rounded-xl px-4 py-3"
                      style={{ background: 'rgba(234,179,8,0.04)', border: '1px solid rgba(234,179,8,0.1)' }}
                    >
                      <span className="text-sm font-medium flex-1" style={{ color: 'var(--text-primary)' }}>
                        {speaker}
                      </span>
                      <select
                        value={manualAssignments[speaker] || ''}
                        onChange={(e) =>
                          setManualAssignments((prev) => ({ ...prev, [speaker]: e.target.value }))
                        }
                        className="rounded-lg px-3 py-1.5 text-sm focus:outline-none"
                        style={{
                          background: 'var(--subtle-bg)',
                          border: '1px solid var(--panel-border)',
                          color: 'var(--text-primary)',
                        }}
                      >
                        <option value="">— Leave unmatched —</option>
                        {cast.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.characterName}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="rounded-xl px-4 py-2 text-sm font-medium transition-all"
                style={{ background: 'var(--subtle-bg)', color: 'var(--text-secondary)', border: '1px solid var(--subtle-border)' }}
              >
                Back
              </button>
              <button
                onClick={downloadEnriched}
                className="rounded-xl px-5 py-2.5 text-sm font-semibold transition-all hover:scale-[1.02]"
                style={{
                  background: 'var(--accent)',
                  color: '#0f1117',
                }}
              >
                Download Enriched JSON
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
