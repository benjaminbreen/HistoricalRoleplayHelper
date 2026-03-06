'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
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
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Animated progress bar during processing
  useEffect(() => {
    if (phase === 'processing') {
      setProgress(0);
      let current = 0;
      progressIntervalRef.current = setInterval(() => {
        // Simulate progress: fast to 60%, slow to 90%
        const remaining = 90 - current;
        const increment = remaining > 30 ? 3 : remaining > 10 ? 1 : 0.3;
        current = Math.min(90, current + increment);
        setProgress(current);
      }, 200);
    } else if (phase === 'confirming' || phase === 'done') {
      // Jump to 100% briefly
      setProgress(100);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    } else {
      setProgress(0);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [phase]);

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

  /** Update an editable field on the confirmation screen */
  const updateField = useCallback((field: keyof CharacterSheet, value: string) => {
    setSheet((prev) => {
      if (!prev) return prev;
      // characterName is required — never set to undefined
      if (field === 'characterName') return { ...prev, [field]: value };
      return { ...prev, [field]: value || undefined };
    });
  }, []);

  // Shared styles
  const cardStyle = {
    background: 'var(--panel)',
    border: '1px solid var(--panel-border)',
  };

  const inputStyle = {
    background: 'var(--subtle-bg)',
    border: '1px solid var(--subtle-border)',
    color: 'var(--text-primary)',
  };

  // --- DONE ---
  if (phase === 'done') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 sm:p-6" style={{ background: 'var(--background)' }}>
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
      <div className="min-h-screen flex flex-col items-center p-4 sm:p-6" style={{ background: 'var(--background)' }}>
        <div className="w-full max-w-sm space-y-4 sm:space-y-5 mt-6 sm:mt-8">
          <h1 className="heading-display text-xl font-bold text-center" style={{ color: 'var(--accent)' }}>
            Review &amp; Edit
          </h1>
          <p className="text-sm text-center" style={{ color: 'var(--text-muted)' }}>
            Correct any mistakes before submitting.
          </p>

          <div className="rounded-2xl p-4 sm:p-5 space-y-4" style={cardStyle}>
            {/* Portrait */}
            <div className="flex justify-center">
              <img
                src={sheet.portraitDataUrl}
                alt="Portrait"
                className="w-24 h-24 rounded-full object-cover"
                style={{ border: '3px solid var(--accent)' }}
              />
            </div>

            {/* Editable fields */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Character Name</label>
                <input
                  type="text"
                  value={sheet.characterName}
                  onChange={(e) => updateField('characterName', e.target.value)}
                  className="w-full rounded-lg px-3 py-2.5 text-base font-semibold outline-none"
                  style={inputStyle}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Profession</label>
                  <input
                    type="text"
                    value={sheet.profession || ''}
                    onChange={(e) => updateField('profession', e.target.value)}
                    className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Age</label>
                  <input
                    type="text"
                    value={sheet.age || ''}
                    onChange={(e) => updateField('age', e.target.value)}
                    className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                    style={inputStyle}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Gender</label>
                  <input
                    type="text"
                    value={sheet.gender || ''}
                    onChange={(e) => updateField('gender', e.target.value)}
                    className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Social Class</label>
                  <input
                    type="text"
                    value={sheet.socialClass || ''}
                    onChange={(e) => updateField('socialClass', e.target.value)}
                    className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                    style={inputStyle}
                  />
                </div>
              </div>
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
              {phase === 'submitting' ? 'Sending...' : "Submit"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- IDLE / PROCESSING ---
  return (
    <div className="min-h-screen flex flex-col items-center p-4 sm:p-6" style={{ background: 'var(--background)' }}>
      <div className="w-full max-w-sm space-y-5 mt-6 sm:mt-8">
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
            style={inputStyle}
            disabled={phase === 'processing'}
          />
        </div>

        {phase === 'processing' ? (
          /* Progress indicator */
          <div className="space-y-3">
            <div className="w-full rounded-full h-2 overflow-hidden" style={{ background: 'var(--subtle-bg)' }}>
              <div
                className="h-full rounded-full transition-all duration-300 ease-out"
                style={{
                  width: `${progress}%`,
                  background: 'var(--accent)',
                }}
              />
            </div>
            <div className="flex items-center justify-center gap-3 py-3">
              <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" style={{ color: 'var(--accent)' }} />
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Reading your character sheet...
              </span>
            </div>
          </div>
        ) : (
          /* Camera + Gallery buttons */
          <div className="space-y-2.5">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full rounded-xl px-4 py-5 text-lg font-semibold transition-all active:scale-[0.97]"
              style={{ background: 'var(--accent)', color: '#000' }}
            >
              📷  Photograph Your Sheet
            </button>
            <button
              onClick={() => galleryInputRef.current?.click()}
              className="w-full rounded-xl px-4 py-4 text-base font-medium transition-all active:scale-[0.97]"
              style={{ background: 'var(--subtle-bg)', color: 'var(--text-secondary)', border: '1px solid var(--subtle-border)' }}
            >
              🖼️  Upload from Gallery
            </button>
          </div>
        )}

        {/* Camera input (with capture for mobile camera) */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          className="hidden"
        />
        {/* Gallery input (no capture — opens photo picker) */}
        <input
          ref={galleryInputRef}
          type="file"
          accept="image/*"
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
