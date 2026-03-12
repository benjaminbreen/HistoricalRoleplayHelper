import { createId } from './createId';
import { SavedSession } from './types';

const STORAGE_KEY = 'hrh-sessions';
const MAX_SESSIONS = 3;

export interface StoredSessionMeta {
  id: string;
  title: string;
  savedAt: string;
  transcriptCount: number;
  stageIndex: number;
  totalStages: number;
}

interface SessionRecord {
  id: string;
  data: SavedSession;
}

function readAll(): SessionRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

function writeAll(records: SessionRecord[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

/** Save a session. If it already exists (same id), update it. Otherwise prepend it.
 *  Enforces MAX_SESSIONS limit by dropping the oldest entries. */
export function saveSession(id: string, data: SavedSession): void {
  try {
    const records = readAll();
    const idx = records.findIndex((r) => r.id === id);
    if (idx >= 0) {
      records[idx] = { id, data };
    } else {
      records.unshift({ id, data });
    }
    // Keep only the most recent MAX_SESSIONS
    const trimmed = records.slice(0, MAX_SESSIONS);
    writeAll(trimmed);
  } catch {
    // localStorage full or unavailable
  }
}

/** Get a specific session by id. */
export function getSession(id: string): SavedSession | null {
  const records = readAll();
  return records.find((r) => r.id === id)?.data ?? null;
}

/** Get the most recent session (for auto-recovery). */
export function getMostRecentSession(): (SavedSession & { sessionId: string }) | null {
  const records = readAll();
  if (records.length === 0) return null;
  const first = records[0];
  if (!first.data?.scenario || !first.data?.transcript) return null;
  return { ...first.data, sessionId: first.id };
}

/** List all saved sessions as lightweight metadata (no full data). */
export function listSessions(): StoredSessionMeta[] {
  return readAll()
    .filter((r) => r.data?.scenario && r.data?.transcript)
    .map((r) => ({
      id: r.id,
      title: r.data.scenario.title,
      savedAt: r.data.savedAt,
      transcriptCount: r.data.transcript.length,
      stageIndex: r.data.currentStageIndex,
      totalStages: r.data.scenario.stages.length,
    }));
}

/** Delete a specific session by id. */
export function deleteSession(id: string): void {
  try {
    const records = readAll().filter((r) => r.id !== id);
    writeAll(records);
  } catch {
    // ignore
  }
}

/** Delete all saved sessions. */
export function clearAllSessions(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

/** Migrate from the old single-key format ('hrh-active-session') if present. */
export function migrateFromLegacy(): void {
  try {
    const OLD_KEY = 'hrh-active-session';
    const raw = localStorage.getItem(OLD_KEY);
    if (!raw) return;
    const parsed: SavedSession = JSON.parse(raw);
    if (parsed.scenario && parsed.transcript) {
      saveSession(createId(), parsed);
    }
    localStorage.removeItem(OLD_KEY);
  } catch {
    // corrupt legacy data — just remove it
    try { localStorage.removeItem('hrh-active-session'); } catch {}
  }
}
