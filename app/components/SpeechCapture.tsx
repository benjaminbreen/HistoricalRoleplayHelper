'use client';

import { useState, useRef, useCallback, useEffect, useMemo, forwardRef, useImperativeHandle } from 'react';
import { TranscriptEntry, CharacterSheet } from '../lib/types';
import CharacterQuickBar from './CharacterQuickBar';

interface SpeechCaptureProps {
  stageId: string;
  onCapture: (entry: TranscriptEntry) => void;
  previousSpeakers?: string[];
  cast?: CharacterSheet[];
  selectedCharacterId?: string;
  onCharacterSelect?: (id: string | undefined) => void;
  recentCharacterIds?: string[];
  onOpenCastPanel?: () => void;
}

export interface SpeechCaptureHandle {
  toggleRecording: () => void;
  toggleManual: () => void;
}

const CHUNK_INTERVAL = 15_000; // 15 seconds per chunk

const SpeechCapture = forwardRef<SpeechCaptureHandle, SpeechCaptureProps>(function SpeechCapture(
  { stageId, onCapture, previousSpeakers = [], cast = [], selectedCharacterId, onCharacterSelect, recentCharacterIds = [], onOpenCastPanel },
  ref
) {
  const [isRecording, setIsRecording] = useState(false);
  const [processing, setProcessing] = useState(0); // number of chunks in flight
  const [speakerName, setSpeakerName] = useState('');
  const [profession, setProfession] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [manualText, setManualText] = useState('');
  const [showManual, setShowManual] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [showAutocomplete, setShowAutocomplete] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const speakerNameRef = useRef(speakerName);
  speakerNameRef.current = speakerName;
  const professionRef = useRef(profession);
  professionRef.current = profession;
  const ageRef = useRef(age);
  ageRef.current = age;
  const genderRef = useRef(gender);
  genderRef.current = gender;
  const stageIdRef = useRef(stageId);
  stageIdRef.current = stageId;
  const selectedCharacterIdRef = useRef(selectedCharacterId);
  selectedCharacterIdRef.current = selectedCharacterId;

  // Auto-fill from selected character
  useEffect(() => {
    if (!selectedCharacterId) return;
    const char = cast.find((c) => c.id === selectedCharacterId);
    if (char) {
      setSpeakerName(char.characterName);
      if (char.profession) setProfession(char.profession);
      if (char.age) setAge(char.age);
      if (char.gender) setGender(char.gender);
    }
  }, [selectedCharacterId, cast]);

  const autocompleteSuggestions = useMemo(() => {
    if (!speakerName.trim()) return [];
    const q = speakerName.toLowerCase();
    const suggestions: { name: string; characterId?: string; portrait?: string }[] = [];

    // Cast matches first
    for (const c of cast) {
      if (c.characterName.toLowerCase().includes(q)) {
        suggestions.push({ name: c.characterName, characterId: c.id, portrait: c.portraitDataUrl });
      }
    }
    // Previous speakers
    for (const name of previousSpeakers) {
      if (name.toLowerCase().includes(q) && !suggestions.some((s) => s.name === name)) {
        suggestions.push({ name });
      }
    }
    return suggestions.slice(0, 8);
  }, [speakerName, cast, previousSpeakers]);

  const sendChunk = useCallback(
    async (blob: Blob) => {
      if (blob.size < 1000) return; // skip tiny/silent chunks
      setProcessing((n) => n + 1);
      try {
        const formData = new FormData();
        formData.append('audio', blob, 'audio.webm');

        const res = await fetch('/api/transcribe', {
          method: 'POST',
          body: formData,
        });
        if (!res.ok) {
          throw new Error(`Transcription API returned ${res.status}`);
        }
        const data = await res.json();

        if (data.text && data.text.trim()) {
          onCapture({
            id: crypto.randomUUID(),
            speaker: speakerNameRef.current || 'Student',
            text: data.text.trim(),
            timestamp: Date.now(),
            stageId: stageIdRef.current,
            profession: professionRef.current || undefined,
            age: ageRef.current || undefined,
            gender: genderRef.current || undefined,
            characterId: selectedCharacterIdRef.current || undefined,
          });
        }
      } catch (err) {
        console.error('Transcription failed:', err);
        setError('Transcription failed. Check your API key.');
      } finally {
        setProcessing((n) => n - 1);
      }
    },
    [onCapture]
  );

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    mediaRecorderRef.current = null;
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (timerRef.current) clearInterval(timerRef.current);
    intervalRef.current = null;
    timerRef.current = null;
    setIsRecording(false);
    setElapsed(0);
  }, []);

  const startRecording = useCallback(async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : 'audio/webm';
      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        // send any remaining data
        if (chunksRef.current.length > 0) {
          const blob = new Blob(chunksRef.current, { type: mimeType });
          chunksRef.current = [];
          sendChunk(blob);
        }
      };

      recorder.start();
      setIsRecording(true);
      setElapsed(0);

      // Every CHUNK_INTERVAL, stop and restart recorder to flush a chunk
      intervalRef.current = setInterval(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
          mediaRecorderRef.current.stop();
          // send the accumulated chunk
          const accumulated = chunksRef.current;
          chunksRef.current = [];
          if (accumulated.length > 0) {
            const blob = new Blob(accumulated, { type: mimeType });
            sendChunk(blob);
          }
          // restart recording
          const newRecorder = new MediaRecorder(stream, { mimeType });
          newRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) chunksRef.current.push(e.data);
          };
          newRecorder.onstop = () => {
            if (chunksRef.current.length > 0) {
              const blob = new Blob(chunksRef.current, { type: mimeType });
              chunksRef.current = [];
              sendChunk(blob);
            }
          };
          newRecorder.start();
          mediaRecorderRef.current = newRecorder;
        }
      }, CHUNK_INTERVAL);

      // Elapsed seconds counter
      timerRef.current = setInterval(() => {
        setElapsed((e) => e + 1);
      }, 1000);
    } catch (err) {
      console.error('Microphone access denied:', err);
      setError('Microphone access denied. Please allow microphone access and try again.');
      setShowManual(true);
    }
  }, [sendChunk]);

  useImperativeHandle(ref, () => ({
    toggleRecording: () => {
      if (isRecording) {
        stopRecording();
      } else {
        startRecording();
      }
    },
    toggleManual: () => {
      setShowManual((s) => !s);
    },
  }));

  // cleanup on unmount
  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const submitManual = useCallback(() => {
    if (!manualText.trim()) return;
    onCapture({
      id: crypto.randomUUID(),
      speaker: speakerName || 'Student',
      text: manualText.trim(),
      timestamp: Date.now(),
      stageId,
      profession: profession || undefined,
      age: age || undefined,
      gender: gender || undefined,
      characterId: selectedCharacterId || undefined,
    });
    setManualText('');
  }, [manualText, speakerName, profession, age, gender, stageId, onCapture, selectedCharacterId]);

  const inputStyle = {
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid var(--panel-border)',
    color: 'var(--text-primary)',
  };

  const formatElapsed = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${String(sec).padStart(2, '0')}`;
  };

  return (
    <div className="glass-strong rounded-2xl p-4 space-y-3">
      {/* Character QuickBar */}
      {cast.length > 0 && (
        <CharacterQuickBar
          cast={cast}
          recentCharacterIds={recentCharacterIds}
          selectedCharacterId={selectedCharacterId}
          onSelect={(id) => onCharacterSelect?.(id)}
          onOpenPanel={() => onOpenCastPanel?.()}
        />
      )}
      {/* Speaker info row — wraps on small screens */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-[140px] flex-1">
          <input
            type="text"
            value={speakerName}
            onChange={(e) => {
              setSpeakerName(e.target.value);
              setShowAutocomplete(true);
              // Clear character selection when manually typing
              if (selectedCharacterId) {
                const char = cast.find((c) => c.id === selectedCharacterId);
                if (char && e.target.value !== char.characterName) {
                  onCharacterSelect?.(undefined);
                }
              }
            }}
            onFocus={() => setShowAutocomplete(true)}
            onBlur={() => setTimeout(() => setShowAutocomplete(false), 200)}
            placeholder="Speaker name..."
            className="w-full rounded-xl px-4 py-2.5 text-base placeholder-white/20 focus:outline-none"
            style={inputStyle}
            aria-label="Speaker name"
          />
          {showAutocomplete && autocompleteSuggestions.length > 0 && (
            <div
              className="absolute left-0 right-0 top-full z-30 mt-1 rounded-xl overflow-hidden"
              style={{ background: 'rgba(30,30,40,0.95)', border: '1px solid var(--panel-border)', boxShadow: '0 4px 16px rgba(0,0,0,0.4)' }}
            >
              {autocompleteSuggestions.map((s) => (
                <button
                  key={s.name + (s.characterId || '')}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-all hover:bg-white/5"
                  style={{ color: 'var(--text-primary)' }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setSpeakerName(s.name);
                    setShowAutocomplete(false);
                    if (s.characterId) {
                      onCharacterSelect?.(s.characterId);
                      const char = cast.find((c) => c.id === s.characterId);
                      if (char) {
                        if (char.profession) setProfession(char.profession);
                        if (char.age) setAge(char.age);
                        if (char.gender) setGender(char.gender);
                      }
                    }
                  }}
                >
                  {s.portrait ? (
                    <img src={s.portrait} alt="" className="h-6 w-6 rounded-full object-cover flex-shrink-0" />
                  ) : s.characterId ? (
                    <div className="h-6 w-6 rounded-full flex items-center justify-center text-xs flex-shrink-0"
                      style={{ background: 'rgba(212,160,60,0.1)', color: 'var(--accent)' }}>
                      {s.name.charAt(0)}
                    </div>
                  ) : null}
                  <span>{s.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        <input
          type="text"
          value={profession}
          onChange={(e) => setProfession(e.target.value)}
          placeholder="Profession..."
          className="w-28 rounded-xl px-3 py-2.5 text-sm placeholder-white/20 focus:outline-none"
          style={inputStyle}
          aria-label="Profession"
        />
        <input
          type="text"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          placeholder="Age"
          className="w-14 rounded-xl px-3 py-2.5 text-sm placeholder-white/20 focus:outline-none"
          style={inputStyle}
          aria-label="Age"
        />
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          className="rounded-xl px-3 py-2.5 text-sm focus:outline-none"
          style={inputStyle}
          aria-label="Gender"
        >
          <option value="">Gender</option>
          <option value="M">M</option>
          <option value="F">F</option>
          <option value="Other">Other</option>
        </select>
      </div>
      {/* Action buttons row */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-lg font-semibold transition-all ${
            isRecording ? 'animate-pulse' : 'hover:scale-[1.02]'
          }`}
          style={{
            background: isRecording ? 'rgba(239,68,68,0.7)' : 'rgba(212,160,60,0.25)',
            color: isRecording ? '#fff' : 'var(--accent)',
            border: isRecording ? '1px solid rgba(239,68,68,0.5)' : '1px solid rgba(212,160,60,0.3)',
          }}
        >
          {isRecording ? `⏹ Stop (${formatElapsed(elapsed)})` : '🎤 Capture Speech'}
        </button>
        <button
          onClick={() => setShowManual(!showManual)}
          className="rounded-xl px-4 py-2.5 text-base transition-all"
          style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--text-secondary)' }}
          title="Manual text entry"
        >
          ⌨️ Type
        </button>
      </div>

      {processing > 0 && (
        <div
          className="flex items-center gap-2 rounded-xl p-3 text-base"
          style={{ background: 'rgba(212,160,60,0.06)', color: 'var(--text-secondary)' }}
        >
          <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
          Transcribing audio...
        </div>
      )}

      {error && (
        <div
          className="rounded-xl px-4 py-2 text-sm"
          style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171' }}
        >
          {error}
        </div>
      )}

      {showManual && (
        <div className="flex gap-2">
          <input
            type="text"
            value={manualText}
            onChange={(e) => setManualText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submitManual()}
            placeholder="Type argument here..."
            className="flex-1 rounded-xl px-4 py-3 text-base placeholder-white/20 focus:outline-none"
            style={inputStyle}
          />
          <button
            onClick={submitManual}
            className="rounded-xl px-5 py-3 text-base font-semibold transition-all hover:scale-[1.02]"
            style={{ background: 'rgba(212,160,60,0.2)', color: 'var(--accent)' }}
          >
            Add
          </button>
        </div>
      )}
    </div>
  );
});

export default SpeechCapture;
