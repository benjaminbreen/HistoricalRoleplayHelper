/**
 * File-backed store for student self-upload join sessions.
 * Designed for a single long-lived server process (for example, a teacher laptop on LAN).
 * This avoids external infrastructure while remaining far more reliable than in-memory state alone.
 */

import fs from 'node:fs';
import path from 'node:path';

import { CharacterSheet } from './types';

export interface JoinSession {
  code: string;
  scenarioTitle: string;
  students: CharacterSheet[];
  createdAt: number;
}

const SESSION_TTL_MS = 2 * 60 * 60 * 1000; // 2 hours
const MAX_STUDENTS = 100;

// Alphabet without ambiguous characters (O/0/I/1/l)
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const CODE_LENGTH = 4;
const STORE_FILE =
  process.env.JOIN_STORE_FILE || path.join(process.cwd(), '.local-state', 'join-sessions.json');

function ensureStoreDir(): void {
  fs.mkdirSync(path.dirname(STORE_FILE), { recursive: true });
}

function readAll(): Map<string, JoinSession> {
  ensureStoreDir();

  try {
    const raw = fs.readFileSync(STORE_FILE, 'utf8');
    if (!raw.trim()) return new Map();

    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return new Map();

    return new Map(
      parsed
        .filter((entry): entry is [string, JoinSession] => {
          return (
            Array.isArray(entry) &&
            entry.length === 2 &&
            typeof entry[0] === 'string' &&
            !!entry[1] &&
            typeof entry[1] === 'object'
          );
        })
        .map(([code, session]) => [code.toUpperCase(), session])
    );
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return new Map();
    }
    console.error('Failed to read join session store:', error);
    return new Map();
  }
}

function writeAll(store: Map<string, JoinSession>): void {
  ensureStoreDir();
  fs.writeFileSync(STORE_FILE, JSON.stringify(Array.from(store.entries()), null, 2), 'utf8');
}

function cleanExpired(store: Map<string, JoinSession>): boolean {
  const now = Date.now();
  let changed = false;

  for (const [code, session] of store) {
    if (now - session.createdAt > SESSION_TTL_MS) {
      store.delete(code);
      changed = true;
    }
  }

  return changed;
}

function generateCode(store: Map<string, JoinSession>): string {
  for (let attempt = 0; attempt < 50; attempt++) {
    let code = '';
    for (let i = 0; i < CODE_LENGTH; i++) {
      code += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
    }
    if (!store.has(code)) return code;
  }
  throw new Error('Failed to generate unique code');
}

export function createSession(scenarioTitle: string): JoinSession {
  const store = readAll();
  if (cleanExpired(store)) writeAll(store);

  const code = generateCode(store);
  const session: JoinSession = {
    code,
    scenarioTitle,
    students: [],
    createdAt: Date.now(),
  };

  store.set(code, session);
  writeAll(store);
  return session;
}

export function getSession(code: string): JoinSession | null {
  const store = readAll();
  const changed = cleanExpired(store);
  const session = store.get(code.toUpperCase()) ?? null;

  if (changed) writeAll(store);
  return session;
}

export function addStudent(code: string, sheet: CharacterSheet): boolean {
  const store = readAll();
  if (cleanExpired(store)) writeAll(store);

  const session = store.get(code.toUpperCase());
  if (!session) return false;

  const existingIndex = session.students.findIndex((student) => student.id === sheet.id);
  if (existingIndex >= 0) {
    session.students[existingIndex] = sheet;
    writeAll(store);
    return true;
  }

  if (session.students.length >= MAX_STUDENTS) return false;

  session.students.push(sheet);
  writeAll(store);
  return true;
}

export function deleteSession(code: string): void {
  const store = readAll();
  if (store.delete(code.toUpperCase())) {
    writeAll(store);
  }
}
