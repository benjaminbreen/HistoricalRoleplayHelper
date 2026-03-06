'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { CharacterSheet } from '../lib/types';
import { X, Copy, Check } from 'lucide-react';

interface Props {
  scenarioTitle: string;
  onClose: (students: CharacterSheet[]) => void;
}

const POLL_INTERVAL = 2500;

export default function JoinSessionModal({ scenarioTitle, onClose }: Props) {
  const [code, setCode] = useState<string | null>(null);
  const [students, setStudents] = useState<CharacterSheet[]>([]);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const removedIdsRef = useRef<Set<string>>(new Set());

  // Create session on mount
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/join', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ scenarioTitle }),
        });
        if (!res.ok) throw new Error('Failed to create session');
        const data = await res.json();
        if (!cancelled) setCode(data.code);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to create session');
      }
    })();
    return () => { cancelled = true; };
  }, [scenarioTitle]);

  // Poll for students
  useEffect(() => {
    if (!code) return;

    const poll = async () => {
      try {
        const res = await fetch(`/api/join?code=${code}`);
        if (res.ok) {
          const data = await res.json();
          const filtered = (data.students || []).filter(
            (s: CharacterSheet) => !removedIdsRef.current.has(s.id)
          );
          setStudents(filtered);
        }
      } catch {
        // Silently swallow — retry next interval
      }
    };

    poll(); // initial fetch
    pollRef.current = setInterval(poll, POLL_INTERVAL);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [code]);

  const joinUrl = code ? `${window.location.origin}/join/${code}` : '';

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(joinUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [joinUrl]);

  const handleRemoveStudent = useCallback((studentId: string) => {
    removedIdsRef.current.add(studentId);
    setStudents((prev) => prev.filter((s) => s.id !== studentId));
  }, []);

  const handleDone = useCallback(() => {
    if (pollRef.current) clearInterval(pollRef.current);
    onClose(students);
  }, [onClose, students]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)' }}>
      <div
        className="glass-strong rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        style={{ boxShadow: '0 25px 50px rgba(0,0,0,0.5)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 pb-0">
          <h2 className="heading-display text-xl font-bold" style={{ color: 'var(--accent)' }}>
            Student Upload Link
          </h2>
          <button
            onClick={() => { if (pollRef.current) clearInterval(pollRef.current); onClose([]); }}
            className="rounded-lg p-1.5 transition-colors"
            style={{ color: 'var(--text-muted)' }}
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {error && (
            <div className="rounded-xl px-4 py-3 text-sm"
              style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}>
              {error}
            </div>
          )}

          {!code && !error && (
            <div className="flex items-center justify-center py-8">
              <span className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-current border-t-transparent" style={{ color: 'var(--accent)' }} />
              <span className="ml-3 text-sm" style={{ color: 'var(--text-secondary)' }}>Creating session...</span>
            </div>
          )}

          {code && (
            <>
              {/* QR Code */}
              <div className="flex flex-col items-center gap-4">
                <div className="rounded-xl p-4" style={{ background: '#fff' }}>
                  <QRCodeSVG value={joinUrl} size={200} level="M" />
                </div>

                {/* Code display */}
                <div className="text-center">
                  <div className="text-4xl font-mono font-bold tracking-widest" style={{ color: 'var(--accent)' }}>
                    {code}
                  </div>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                    Session code
                  </p>
                </div>

                {/* URL + copy */}
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm transition-all"
                  style={{ background: 'var(--subtle-bg)', border: '1px solid var(--subtle-border)', color: 'var(--text-secondary)' }}
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  <span className="truncate max-w-[280px]">{joinUrl}</span>
                </button>
              </div>

              {/* Student list */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                    Students Joined
                  </h3>
                  <span
                    className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
                    style={{ background: 'rgba(212,160,60,0.15)', color: 'var(--accent)' }}
                  >
                    {students.length}
                  </span>
                </div>

                {students.length === 0 ? (
                  <div className="rounded-xl p-4 text-center text-sm" style={{ background: 'var(--subtle-bg)', color: 'var(--text-muted)' }}>
                    Waiting for students to scan and upload...
                  </div>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {students.map((s, i) => (
                      <div
                        key={s.id || i}
                        className="flex items-center gap-3 rounded-xl px-3 py-2"
                        style={{ background: 'var(--subtle-bg)' }}
                      >
                        <img
                          src={s.portraitDataUrl}
                          alt=""
                          className="w-9 h-9 rounded-full object-cover flex-shrink-0"
                          style={{ border: '2px solid var(--panel-border)' }}
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                              {s.characterName}
                            </span>
                            {s.needsReview && (
                              <span
                                className="flex-shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-bold uppercase"
                                style={{ background: 'rgba(251,191,36,0.15)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.25)' }}
                              >
                                Review
                              </span>
                            )}
                          </div>
                          {s.studentRealName && (
                            <div className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>
                              {s.studentRealName}
                              {s.profession && ` · ${s.profession}`}
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => handleRemoveStudent(s.id)}
                          className="flex-shrink-0 rounded-lg p-1.5 transition-colors"
                          style={{ color: 'var(--text-muted)' }}
                          title="Remove student"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Done button */}
              <button
                onClick={handleDone}
                className="w-full rounded-xl px-4 py-3.5 text-base font-semibold transition-all hover:scale-[1.01] active:scale-[0.98]"
                style={{ background: 'var(--accent)', color: '#000' }}
              >
                Done{students.length > 0 ? ` — Add ${students.length} Student${students.length !== 1 ? 's' : ''}` : ''}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
