'use client';

import { useState, useRef, useCallback, useEffect, forwardRef, useImperativeHandle } from 'react';
import { TranscriptEntry } from '../lib/types';

interface SpeechCaptureProps {
  stageId: string;
  onCapture: (entry: TranscriptEntry) => void;
  previousSpeakers?: string[];
}

export interface SpeechCaptureHandle {
  toggleRecording: () => void;
  toggleManual: () => void;
}

const CHUNK_INTERVAL = 15_000; // 15 seconds per chunk

const SpeechCapture = forwardRef<SpeechCaptureHandle, SpeechCaptureProps>(function SpeechCapture(
  { stageId, onCapture, previousSpeakers = [] },
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
    });
    setManualText('');
  }, [manualText, speakerName, profession, age, gender, stageId, onCapture]);

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
      {/* Speaker info row — wraps on small screens */}
      <div className="flex flex-wrap items-center gap-2">
        <input
          type="text"
          list="speaker-names"
          value={speakerName}
          onChange={(e) => setSpeakerName(e.target.value)}
          placeholder="Speaker name..."
          className="min-w-[140px] flex-1 rounded-xl px-4 py-2.5 text-base placeholder-white/20 focus:outline-none"
          style={inputStyle}
          aria-label="Speaker name"
        />
        {previousSpeakers.length > 0 && (
          <datalist id="speaker-names">
            {previousSpeakers.map((name) => (
              <option key={name} value={name} />
            ))}
          </datalist>
        )}
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
