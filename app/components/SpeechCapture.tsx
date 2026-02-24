'use client';

import { useState, useRef, useCallback } from 'react';
import { TranscriptEntry } from '../lib/types';

interface SpeechCaptureProps {
  stageId: string;
  onCapture: (entry: TranscriptEntry) => void;
}

export default function SpeechCapture({ stageId, onCapture }: SpeechCaptureProps) {
  const [isListening, setIsListening] = useState(false);
  const [interimText, setInterimText] = useState('');
  const [speakerName, setSpeakerName] = useState('');
  const [manualText, setManualText] = useState('');
  const [showManual, setShowManual] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const hasSpeechApi =
    typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  const startListening = useCallback(() => {
    if (!hasSpeechApi) {
      setShowManual(true);
      return;
    }

    const SpeechRecognitionCtor =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionCtor) {
      setShowManual(true);
      return;
    }
    const recognition = new SpeechRecognitionCtor();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          const entry: TranscriptEntry = {
            id: crypto.randomUUID(),
            speaker: speakerName || 'Student',
            text: transcript.trim(),
            timestamp: Date.now(),
            stageId,
          };
          onCapture(entry);
          setInterimText('');
        } else {
          interim += transcript;
        }
      }
      setInterimText(interim);
    };

    recognition.onerror = () => {
      setIsListening(false);
      setShowManual(true);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
    recognitionRef.current = recognition;
    setIsListening(true);
  }, [hasSpeechApi, speakerName, stageId, onCapture]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
    setInterimText('');
  }, []);

  const submitManual = useCallback(() => {
    if (!manualText.trim()) return;
    const entry: TranscriptEntry = {
      id: crypto.randomUUID(),
      speaker: speakerName || 'Student',
      text: manualText.trim(),
      timestamp: Date.now(),
      stageId,
    };
    onCapture(entry);
    setManualText('');
  }, [manualText, speakerName, stageId, onCapture]);

  const inputStyle = {
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid var(--panel-border)',
    color: 'var(--text-primary)',
  };

  return (
    <div className="glass-strong rounded-2xl p-4 space-y-3">
      <div className="flex items-center gap-3">
        <input
          type="text"
          value={speakerName}
          onChange={(e) => setSpeakerName(e.target.value)}
          placeholder="Speaker name..."
          className="rounded-xl px-4 py-2.5 text-base placeholder-white/20 focus:outline-none"
          style={inputStyle}
        />
        <button
          onClick={isListening ? stopListening : startListening}
          className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-lg font-semibold transition-all ${
            isListening ? 'animate-pulse' : 'hover:scale-[1.02]'
          }`}
          style={{
            background: isListening ? 'rgba(239,68,68,0.7)' : 'rgba(212,160,60,0.25)',
            color: isListening ? '#fff' : 'var(--accent)',
            border: isListening ? '1px solid rgba(239,68,68,0.5)' : '1px solid rgba(212,160,60,0.3)',
          }}
        >
          {isListening ? '⏹ Stop' : '🎤 Capture Speech'}
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

      {interimText && (
        <div
          className="rounded-xl p-3 text-base italic"
          style={{ background: 'rgba(212,160,60,0.06)', color: 'var(--text-secondary)' }}
        >
          {interimText}...
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
}
