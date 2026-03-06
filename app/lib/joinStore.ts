/**
 * In-memory server-side store for student self-upload join sessions.
 * Uses globalThis to survive Next.js hot reloads in dev.
 * Fine for Vercel serverless — teacher polling keeps the function warm.
 */

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

const globalStore = globalThis as unknown as {
  __joinSessions?: Map<string, JoinSession>;
};

function getStore(): Map<string, JoinSession> {
  if (!globalStore.__joinSessions) {
    globalStore.__joinSessions = new Map();
  }
  return globalStore.__joinSessions;
}

function cleanExpired() {
  const store = getStore();
  const now = Date.now();
  for (const [code, session] of store) {
    if (now - session.createdAt > SESSION_TTL_MS) {
      store.delete(code);
    }
  }
}

function generateCode(): string {
  const store = getStore();
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
  cleanExpired();
  const code = generateCode();
  const session: JoinSession = {
    code,
    scenarioTitle,
    students: [],
    createdAt: Date.now(),
  };
  getStore().set(code, session);
  return session;
}

export function getSession(code: string): JoinSession | null {
  cleanExpired();
  return getStore().get(code.toUpperCase()) ?? null;
}

export function addStudent(code: string, sheet: CharacterSheet): boolean {
  cleanExpired();
  const session = getStore().get(code.toUpperCase());
  if (!session) return false;
  if (session.students.length >= MAX_STUDENTS) return false;
  session.students.push(sheet);
  return true;
}

export function deleteSession(code: string): void {
  getStore().delete(code.toUpperCase());
}
