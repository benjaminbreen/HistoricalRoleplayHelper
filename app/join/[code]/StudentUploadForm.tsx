'use client';

import { useState, useRef, useCallback } from 'react';
import { CharacterSheet } from '../../lib/types';
import { normalizeImage, cropPortrait } from '../../lib/imageUtils';

type Phase = 'idle' | 'processing' | 'confirming' | 'submitting' | 'done';

interface Props {
  code: string;
  scenarioTitle: string;
}

export default function StudentUploadForm({ code, scenarioTitle }: Props) {
  const [phase, setPhase] = useState<Phase>('idle');
  const [studentName, setStudentName] = useState('');
  const [error, setError] = useState('');
  const [sheet, setSheet] = useState<CharacterSheet | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processPhoto = useCallback(async (file: File) => {
    setError('');
    setPhase('processing');

    try {
      const { dataUrl, base64, mimeType } = await normalizeImage(file);

      const res = await fetch('/api/extract-character', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64, mimeType }),
      });

      if (!res.ok) throw new Error(`Server error (${res.status})`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      const ext = data.extraction;
      const bounds = ext.portraitBounds || { x: 0, y: 0, width: 0, height: 0 };
      const portrait = await cropPortrait(dataUrl, bounds);

      const built: CharacterSheet = {
        id: crypto.randomUUID(),
        studentRealName: studentName || ext.studentRealName || '',
        characterName: ext.characterName || 'Unknown Character',
        profession: ext.profession || undefined,
        age: ext.age || undefined,
        gender: ext.gender || undefined,
        family: ext.family || undefined,
        socialClass: ext.socialClass || undefined,
        personality: ext.personality || undefined,
        customFields: ext.customFields && Object.keys(ext.customFields).length > 0
          ? ext.customFields
          : undefined,
        portraitDataUrl: portrait,
        needsReview: (ext.confidence ?? 0) < 0.7,
      };

      // Override with typed name if student entered one
      if (studentName) built.studentRealName = studentName;

      setSheet(built);
      setPhase('confirming');
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error('Photo processing failed:', msg);
      setError(msg);
      setPhase('idle');
    }
  }, [studentName]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processPhoto(file);
    e.target.value = '';
  }, [processPhoto]);

  const handleSubmit = useCallback(async () => {
    if (!sheet) return;
    setPhase('submitting');
    setError('');

    try {
      const res = await fetch('/api/join/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, characterSheet: sheet }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Upload failed (${res.status})`);
      }

      setPhase('done');
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
      setPhase('confirming');
    }
  }, [code, sheet]);

  const handleRetake = useCallback(() => {
    setSheet(null);
    setError('');
    setPhase('idle');
  }, []);

  // Shared styles
  const cardStyle = {
    background: 'var(--panel)',
    border: '1px solid var(--panel-border)',
  };

  // --- DONE ---
  if (phase === 'done') {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'var(--background)' }}>
        <div className="text-center max-w-sm">
          <div className="text-6xl mb-4">✓</div>
          <h1 className="heading-display text-2xl font-bold mb-2" style={{ color: 'var(--accent)' }}>
            You&apos;re In!
          </h1>
          <p className="text-base mb-1" style={{ color: 'var(--text-secondary)' }}>
            <strong style={{ color: 'var(--text-primary)' }}>{sheet?.characterName}</strong> has been submitted.
          </p>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Your teacher will see you on their screen. You can close this page.
          </p>
        </div>
      </div>
    );
  }

  // --- CONFIRMING / SUBMITTING ---
  if ((phase === 'confirming' || phase === 'submitting') && sheet) {
    return (
      <div className="min-h-screen flex flex-col items-center p-6" style={{ background: 'var(--background)' }}>
        <div className="w-full max-w-sm space-y-5 mt-8">
          <h1 className="heading-display text-xl font-bold text-center" style={{ color: 'var(--accent)' }}>
            Does this look right?
          </h1>

          <div className="rounded-2xl p-5 space-y-4" style={cardStyle}>
            {/* Portrait */}
            <div className="flex justify-center">
              <img
                src={sheet.portraitDataUrl}
                alt="Portrait"
                className="w-24 h-24 rounded-full object-cover"
                style={{ border: '3px solid var(--accent)' }}
              />
            </div>

            {/* Fields */}
            <div className="text-center">
              <div className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                {sheet.characterName}
              </div>
              {sheet.profession && (
                <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {sheet.profession}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm">
              {sheet.age && (
                <div className="rounded-lg px-3 py-2" style={{ background: 'var(--subtle-bg)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Age: </span>
                  <span style={{ color: 'var(--text-primary)' }}>{sheet.age}</span>
                </div>
              )}
              {sheet.gender && (
                <div className="rounded-lg px-3 py-2" style={{ background: 'var(--subtle-bg)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Gender: </span>
                  <span style={{ color: 'var(--text-primary)' }}>{sheet.gender}</span>
                </div>
              )}
              {sheet.socialClass && (
                <div className="rounded-lg px-3 py-2" style={{ background: 'var(--subtle-bg)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Class: </span>
                  <span style={{ color: 'var(--text-primary)' }}>{sheet.socialClass}</span>
                </div>
              )}
              {sheet.family && (
                <div className="rounded-lg px-3 py-2" style={{ background: 'var(--subtle-bg)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Family: </span>
                  <span style={{ color: 'var(--text-primary)' }}>{sheet.family}</span>
                </div>
              )}
            </div>
          </div>

          {error && (
            <div className="rounded-xl px-4 py-3 text-sm text-center"
              style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}>
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleRetake}
              className="flex-1 rounded-xl px-4 py-4 text-base font-medium transition-all active:scale-[0.97]"
              style={{ background: 'var(--subtle-bg)', color: 'var(--text-secondary)', border: '1px solid var(--subtle-border)' }}
            >
              Retake
            </button>
            <button
              onClick={handleSubmit}
              disabled={phase === 'submitting'}
              className="flex-1 rounded-xl px-4 py-4 text-base font-semibold transition-all active:scale-[0.97] disabled:opacity-50"
              style={{ background: 'var(--accent)', color: '#000' }}
            >
              {phase === 'submitting' ? 'Sending...' : "Looks Good!"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- IDLE / PROCESSING ---
  return (
    <div className="min-h-screen flex flex-col items-center p-6" style={{ background: 'var(--background)' }}>
      <div className="w-full max-w-sm space-y-5 mt-8">
        <div className="text-center">
          <h1 className="heading-display text-2xl font-bold mb-1" style={{ color: 'var(--accent)' }}>
            Join Session
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            {scenarioTitle}
          </p>
        </div>

        {/* Name input */}
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
            Your Name
          </label>
          <input
            type="text"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            placeholder="First and last name"
            className="w-full rounded-xl px-4 py-3.5 text-base outline-none"
            style={{
              background: 'var(--subtle-bg)',
              border: '1px solid var(--subtle-border)',
              color: 'var(--text-primary)',
            }}
            disabled={phase === 'processing'}
          />
        </div>

        {/* Camera button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={phase === 'processing'}
          className="w-full rounded-xl px-4 py-5 text-lg font-semibold transition-all active:scale-[0.97] disabled:opacity-50"
          style={{
            background: phase === 'processing' ? 'var(--subtle-bg)' : 'var(--accent)',
            color: phase === 'processing' ? 'var(--text-secondary)' : '#000',
            border: phase === 'processing' ? '1px solid var(--subtle-border)' : 'none',
          }}
        >
          {phase === 'processing' ? (
            <span className="flex items-center justify-center gap-3">
              <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Processing...
            </span>
          ) : (
            '📷  Photograph Your Sheet'
          )}
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          className="hidden"
        />

        {error && (
          <div className="rounded-xl px-4 py-3 text-sm text-center"
            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}>
            {error}
            <button
              onClick={() => { setError(''); setPhase('idle'); }}
              className="block mx-auto mt-2 underline text-sm"
              style={{ color: '#f87171' }}
            >
              Try Again
            </button>
          </div>
        )}

        <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
          Take a clear photo of your handwritten character sheet.
          <br />The app will read it automatically.
        </p>
      </div>
    </div>
  );
}
