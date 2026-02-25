'use client';

import { useState, useRef, useCallback } from 'react';
import { CharacterSheet } from '../lib/types';
import { normalizeImage, cropPortrait } from '../lib/imageUtils';

interface CharacterUploaderProps {
  onExtracted: (sheets: CharacterSheet[]) => void;
  existingCount: number;
}

const MAX_CONCURRENT = 5;

export default function CharacterUploader({ onExtracted, existingCount }: CharacterUploaderProps) {
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [failed, setFailed] = useState<{ file: File; error: string }[]>([]);
  const [dragOver, setDragOver] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(async (file: File): Promise<CharacterSheet | null> => {
    try {
      // Normalize: HEIC sent as-is (Gemini native), others resized to ≤1536px JPEG
      const { dataUrl, base64, mimeType } = await normalizeImage(file);

      const res = await fetch('/api/extract-character', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64, mimeType }),
      });

      if (!res.ok) throw new Error(`API returned ${res.status}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      const ext = data.extraction;
      const bounds = ext.portraitBounds || { x: 0, y: 0, width: 0, height: 0 };
      const portrait = await cropPortrait(dataUrl, bounds);

      return {
        id: crypto.randomUUID(),
        studentRealName: ext.studentRealName || '',
        characterName: ext.characterName || file.name.replace(/\.[^.]+$/, ''),
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
    } catch (err) {
      console.error(`Failed to process ${file.name}:`, err);
      return null;
    }
  }, []);

  const processFiles = useCallback(async (files: File[]) => {
    // Accept standard image types + HEIC/HEIF (which browsers sometimes leave MIME-blank)
    const imageFiles = files.filter((f) => {
      if (f.type.startsWith('image/')) return true;
      const ext = f.name.toLowerCase();
      return ext.endsWith('.heic') || ext.endsWith('.heif');
    });
    if (imageFiles.length === 0) return;

    setProcessing(true);
    setProgress({ done: 0, total: imageFiles.length });
    setFailed([]);

    const results: CharacterSheet[] = [];
    const failures: { file: File; error: string }[] = [];

    // Process in batches of MAX_CONCURRENT
    for (let i = 0; i < imageFiles.length; i += MAX_CONCURRENT) {
      const batch = imageFiles.slice(i, i + MAX_CONCURRENT);
      const batchResults = await Promise.all(
        batch.map(async (file) => {
          const result = await processFile(file);
          setProgress((prev) => ({ ...prev, done: prev.done + 1 }));
          if (!result) {
            failures.push({ file, error: 'Extraction failed' });
          }
          return result;
        })
      );
      results.push(...batchResults.filter((r): r is CharacterSheet => r !== null));
    }

    setFailed(failures);
    setProcessing(false);
    if (results.length > 0) {
      onExtracted(results);
    }
  }, [processFile, onExtracted]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  }, [processFiles]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    processFiles(files);
    e.target.value = '';
  }, [processFiles]);

  const retryFailed = useCallback(() => {
    const files = failed.map((f) => f.file);
    setFailed([]);
    processFiles(files);
  }, [failed, processFiles]);

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className="rounded-xl border-2 border-dashed p-6 text-center transition-all"
        style={{
          borderColor: dragOver ? 'rgba(212,160,60,0.5)' : 'rgba(255,255,255,0.1)',
          background: dragOver ? 'rgba(212,160,60,0.05)' : 'rgba(255,255,255,0.02)',
        }}
      >
        <p className="text-base mb-3" style={{ color: 'var(--text-secondary)' }}>
          Drag & drop character sheet images here
        </p>
        <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>
          JPG, PNG, HEIC supported &mdash; images are auto-converted &amp; resized
        </p>
        <div className="flex justify-center gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="rounded-lg px-4 py-2 text-sm font-medium transition-all hover:scale-[1.02]"
            style={{ background: 'rgba(212,160,60,0.12)', color: 'var(--accent)' }}
          >
            Select Files
          </button>
          <button
            onClick={() => folderInputRef.current?.click()}
            className="rounded-lg px-4 py-2 text-sm font-medium transition-all hover:scale-[1.02]"
            style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--text-secondary)' }}
          >
            Select Folder
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.heic,.heif"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />
        <input
          ref={folderInputRef}
          type="file"
          accept="image/*,.heic,.heif"
          multiple
          // @ts-expect-error webkitdirectory is not in React types
          webkitdirectory=""
          onChange={handleFileChange}
          className="hidden"
        />
        {existingCount > 0 && (
          <p className="mt-2 text-xs" style={{ color: 'var(--text-muted)' }}>
            {existingCount} character{existingCount !== 1 ? 's' : ''} already loaded
          </p>
        )}
      </div>

      {/* Progress */}
      {processing && (
        <div className="rounded-xl p-3" style={{ background: 'rgba(212,160,60,0.06)' }}>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" style={{ color: 'var(--accent)' }} />
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Processing {progress.done} of {progress.total}...
            </span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${progress.total > 0 ? (progress.done / progress.total) * 100 : 0}%`,
                background: 'var(--accent)',
              }}
            />
          </div>
        </div>
      )}

      {/* Failed extractions */}
      {failed.length > 0 && (
        <div className="rounded-xl p-3" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)' }}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium" style={{ color: '#f87171' }}>
              {failed.length} file{failed.length !== 1 ? 's' : ''} failed
            </span>
            <button
              onClick={retryFailed}
              className="rounded-lg px-3 py-1 text-xs font-medium"
              style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171' }}
            >
              Retry
            </button>
          </div>
          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {failed.map((f) => f.file.name).join(', ')}
          </div>
        </div>
      )}
    </div>
  );
}
