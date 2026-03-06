import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  saveSession,
  getSession,
  getMostRecentSession,
  listSessions,
  deleteSession,
  clearAllSessions,
  migrateFromLegacy,
} from '../sessionStore';
import { SavedSession } from '../types';

function makeSavedSession(overrides: Partial<SavedSession> = {}): SavedSession {
  return {
    scenario: {
      title: 'Test Scenario',
      description: 'A test',
      context: 'context',
      setting: 'Rome, 300 AD',
      centralQuestion: 'Should we adopt Christianity?',
      votingOptions: [],
      stages: [
        { id: 's1', type: 'debate', title: 'Debate', description: 'Debate phase', durationSeconds: 300 },
        { id: 's2', type: 'vote', title: 'Vote', description: 'Vote phase', durationSeconds: 120 },
      ],
      npcs: [],
      roles: [],
    },
    currentStageIndex: 0,
    timerSeconds: 300,
    transcript: [
      { id: 't1', speaker: 'Student A', text: 'I argue for...', timestamp: Date.now(), stageId: 's1' },
    ],
    npcResponses: [],
    votingOptions: [],
    savedAt: new Date().toISOString(),
    ...overrides,
  };
}

describe('sessionStore', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('saveSession / getSession', () => {
    it('saves and retrieves a session by id', () => {
      const session = makeSavedSession();
      saveSession('abc', session);

      const retrieved = getSession('abc');
      expect(retrieved).not.toBeNull();
      expect(retrieved!.scenario.title).toBe('Test Scenario');
      expect(retrieved!.transcript).toHaveLength(1);
    });

    it('updates an existing session in-place', () => {
      saveSession('abc', makeSavedSession({ timerSeconds: 300 }));
      saveSession('abc', makeSavedSession({ timerSeconds: 150 }));

      const retrieved = getSession('abc');
      expect(retrieved!.timerSeconds).toBe(150);

      // Should still be only one session
      expect(listSessions()).toHaveLength(1);
    });

    it('returns null for non-existent session', () => {
      expect(getSession('nonexistent')).toBeNull();
    });
  });

  describe('MAX_SESSIONS limit', () => {
    it('keeps only 3 most recent sessions', () => {
      saveSession('a', makeSavedSession({ savedAt: '2026-01-01T00:00:00Z' }));
      saveSession('b', makeSavedSession({ savedAt: '2026-01-02T00:00:00Z' }));
      saveSession('c', makeSavedSession({ savedAt: '2026-01-03T00:00:00Z' }));
      saveSession('d', makeSavedSession({ savedAt: '2026-01-04T00:00:00Z' }));

      const sessions = listSessions();
      expect(sessions).toHaveLength(3);

      // Newest should be first, oldest ('a') should be dropped
      expect(sessions[0].id).toBe('d');
      expect(getSession('a')).toBeNull();
    });
  });

  describe('getMostRecentSession', () => {
    it('returns the most recent session with sessionId', () => {
      saveSession('first', makeSavedSession({ savedAt: '2026-01-01T00:00:00Z' }));
      saveSession('second', makeSavedSession({ savedAt: '2026-01-02T00:00:00Z' }));

      const recent = getMostRecentSession();
      expect(recent).not.toBeNull();
      expect(recent!.sessionId).toBe('second');
    });

    it('returns null when no sessions exist', () => {
      expect(getMostRecentSession()).toBeNull();
    });
  });

  describe('listSessions', () => {
    it('returns lightweight metadata without full data', () => {
      saveSession('abc', makeSavedSession({
        savedAt: '2026-02-15T10:30:00Z',
        currentStageIndex: 1,
      }));

      const list = listSessions();
      expect(list).toHaveLength(1);
      expect(list[0]).toEqual({
        id: 'abc',
        title: 'Test Scenario',
        savedAt: '2026-02-15T10:30:00Z',
        transcriptCount: 1,
        stageIndex: 1,
        totalStages: 2,
      });
    });

    it('returns empty array when no sessions exist', () => {
      expect(listSessions()).toEqual([]);
    });
  });

  describe('deleteSession', () => {
    it('removes a specific session', () => {
      saveSession('a', makeSavedSession());
      saveSession('b', makeSavedSession());

      deleteSession('a');

      expect(getSession('a')).toBeNull();
      expect(getSession('b')).not.toBeNull();
      expect(listSessions()).toHaveLength(1);
    });

    it('does nothing when deleting non-existent session', () => {
      saveSession('a', makeSavedSession());
      deleteSession('nonexistent');
      expect(listSessions()).toHaveLength(1);
    });
  });

  describe('clearAllSessions', () => {
    it('removes all sessions', () => {
      saveSession('a', makeSavedSession());
      saveSession('b', makeSavedSession());

      clearAllSessions();
      expect(listSessions()).toEqual([]);
    });
  });

  describe('migrateFromLegacy', () => {
    it('migrates from old hrh-active-session key', () => {
      const oldSession = makeSavedSession({ savedAt: '2026-01-01T00:00:00Z' });
      localStorage.setItem('hrh-active-session', JSON.stringify(oldSession));

      migrateFromLegacy();

      // Old key should be removed
      expect(localStorage.getItem('hrh-active-session')).toBeNull();

      // Session should now be in the new store
      const sessions = listSessions();
      expect(sessions).toHaveLength(1);
      expect(sessions[0].title).toBe('Test Scenario');
    });

    it('does nothing when no legacy session exists', () => {
      migrateFromLegacy();
      expect(listSessions()).toEqual([]);
    });

    it('cleans up corrupt legacy data', () => {
      localStorage.setItem('hrh-active-session', 'not valid json{{{');

      migrateFromLegacy();

      expect(localStorage.getItem('hrh-active-session')).toBeNull();
      expect(listSessions()).toEqual([]);
    });
  });

  describe('edge cases', () => {
    it('handles corrupt storage gracefully', () => {
      localStorage.setItem('hrh-sessions', 'garbage');
      expect(listSessions()).toEqual([]);
      expect(getMostRecentSession()).toBeNull();
    });

    it('handles non-array storage gracefully', () => {
      localStorage.setItem('hrh-sessions', JSON.stringify({ notAnArray: true }));
      expect(listSessions()).toEqual([]);
    });
  });
});
