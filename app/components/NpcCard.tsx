'use client';

import { useState, useRef, useEffect } from 'react';
import { NpcCharacter, NpcResponse } from '../lib/types';

interface NpcCardProps {
  npc: NpcCharacter;
  responses: NpcResponse[];
  onTrigger: (npcId: string) => void;
  isLoading: boolean;
  muted?: boolean;
}

export default function NpcCard({ npc, responses, onTrigger, isLoading, muted }: NpcCardProps) {
  const [showModal, setShowModal] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const prevResponseCount = useRef(responses.length);

  const latestResponse = responses[responses.length - 1];

  // Auto-open modal when a new response arrives
  useEffect(() => {
    if (responses.length > prevResponseCount.current && latestResponse) {
      setShowModal(true);
    }
    prevResponseCount.current = responses.length;
  }, [responses.length, latestResponse]);

  // ESC key closes modal
  useEffect(() => {
    if (!showModal) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowModal(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [showModal]);

  const audioUrlRef = useRef<string | null>(null);

  const speakText = async (text: string) => {
    if (muted) return;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = null;
    }
    setIsSpeaking(true);
    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voice: npc.voice || 'onyx' }),
      });
      if (!res.ok) throw new Error('TTS failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      audioUrlRef.current = url;
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onended = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(url);
        audioUrlRef.current = null;
        audioRef.current = null;
      };
      audio.onerror = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(url);
        audioUrlRef.current = null;
        audioRef.current = null;
      };
      await audio.play();
    } catch {
      setIsSpeaking(false);
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        utterance.onend = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  const stopSpeaking = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = null;
    }
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
  };

  // Stop audio when muted
  useEffect(() => {
    if (muted && isSpeaking) {
      stopSpeaking();
    }
  }, [muted]); // eslint-disable-line react-hooks/exhaustive-deps

  // Cleanup blob URLs on unmount
  useEffect(() => {
    return () => {
      if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current);
      if (audioRef.current) audioRef.current.pause();
    };
  }, []);

  const avatar = npc.avatarImage ? (
    <img
      src={npc.avatarImage}
      alt={npc.name}
      className="h-16 w-16 rounded-full object-cover"
      style={{ border: '2px solid rgba(212,160,60,0.3)' }}
    />
  ) : (
    <div
      className="flex h-16 w-16 items-center justify-center rounded-full text-3xl"
      style={{ background: 'rgba(212,160,60,0.12)' }}
    >
      {npc.avatarEmoji}
    </div>
  );

  return (
    <>
      {/* Compact Card */}
      <div
        className="glass animate-in-scale flex flex-col rounded-2xl p-5 transition-all hover:border-[rgba(212,160,60,0.25)]"
        style={{ minHeight: '180px' }}
      >
        <div className="mb-3 flex items-center gap-4">
          {avatar}
          <div className="flex-1 min-w-0">
            <h3 className="heading-display text-xl font-bold truncate" style={{ color: 'var(--text-primary)' }}>
              {npc.name}
            </h3>
            <p className="text-sm truncate" style={{ color: 'var(--text-muted)' }}>{npc.title}</p>
          </div>
        </div>

        <p className="mb-4 text-sm leading-relaxed line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
          {npc.stance}
        </p>

        <div className="mt-auto flex items-center gap-2">
          <button
            onClick={() => onTrigger(npc.id)}
            disabled={isLoading}
            className="flex-1 rounded-xl px-4 py-2.5 text-base font-semibold transition-all hover:scale-[1.02] disabled:opacity-40 disabled:hover:scale-100"
            style={{
              background: isLoading ? 'var(--subtle-bg)' : 'rgba(212,160,60,0.18)',
              color: isLoading ? 'var(--text-muted)' : 'var(--accent)',
              border: '1px solid ' + (isLoading ? 'transparent' : 'rgba(212,160,60,0.2)'),
            }}
          >
            {isLoading ? 'Thinking...' : 'Speak'}
          </button>
          {latestResponse && (
            <button
              onClick={() => setShowModal(true)}
              className="rounded-xl px-3 py-2.5 text-sm transition-all hover:scale-[1.02]"
              style={{
                background: 'var(--subtle-bg)',
                color: 'var(--text-secondary)',
              }}
              title="View response"
            >
              View
            </button>
          )}
        </div>

        {responses.length > 0 && (
          <p className="mt-2 text-xs" style={{ color: 'var(--text-muted)' }}>
            {responses.length} {responses.length === 1 ? 'response' : 'responses'}
          </p>
        )}
      </div>

      {/* Response Modal */}
      {showModal && latestResponse && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-6"
          style={{ background: 'rgba(0,0,0,0.7)' }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowModal(false);
          }}
          role="dialog"
          aria-modal="true"
          aria-label={`Response from ${npc.name}`}
        >
          <div
            className="animate-in-scale w-full max-w-2xl overflow-hidden rounded-3xl"
            style={{
              background: 'rgba(18, 20, 30, 0.95)',
              border: '1px solid rgba(212,160,60,0.2)',
              boxShadow: '0 0 80px rgba(212,160,60,0.08), 0 25px 50px rgba(0,0,0,0.5)',
              maxHeight: '85vh',
            }}
          >
            {/* Modal Header with portrait */}
            <div
              className="relative flex items-center gap-5 px-8 py-6"
              style={{
                background: 'linear-gradient(135deg, rgba(212,160,60,0.08), rgba(15,17,23,0.5))',
                borderBottom: '1px solid rgba(212,160,60,0.12)',
              }}
            >
              {npc.avatarImage ? (
                <img
                  src={npc.avatarImage}
                  alt={npc.name}
                  className="h-24 w-24 rounded-2xl object-cover"
                  style={{
                    border: '2px solid rgba(212,160,60,0.3)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                  }}
                />
              ) : (
                <div
                  className="flex h-24 w-24 items-center justify-center rounded-2xl text-5xl"
                  style={{ background: 'rgba(212,160,60,0.12)' }}
                >
                  {npc.avatarEmoji}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h2 className="heading-display text-3xl font-bold" style={{ color: '#f0e6d3' }}>
                  {npc.name}
                </h2>
                <p className="mt-1 text-base" style={{ color: 'rgba(212, 160, 60, 0.6)' }}>
                  {npc.title}
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                aria-label="Close dialog"
                className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full text-lg transition-all hover:scale-110"
                style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(240, 230, 211, 0.3)' }}
              >
                ×
              </button>
            </div>

            {/* Modal Body — response text */}
            <div className="overflow-y-auto px-8 py-6" style={{ maxHeight: 'calc(85vh - 200px)' }}>
              <p
                className="heading-display text-xl leading-relaxed"
                style={{ color: '#f0e6d3', lineHeight: '1.7' }}
              >
                {latestResponse.text}
              </p>
            </div>

            {/* Modal Footer */}
            <div
              className="flex items-center justify-between px-8 py-4"
              style={{ borderTop: '1px solid rgba(212,160,60,0.1)' }}
            >
              <div className="flex gap-2">
                <button
                  onClick={() => isSpeaking ? stopSpeaking() : speakText(latestResponse.text)}
                  className={`rounded-xl px-5 py-2.5 text-base font-semibold transition-all ${
                    isSpeaking ? 'animate-pulse' : 'hover:scale-[1.02]'
                  }`}
                  style={{
                    background: isSpeaking ? 'rgba(239,68,68,0.2)' : 'rgba(212,160,60,0.18)',
                    color: isSpeaking ? '#f87171' : '#d4a03c',
                    border: `1px solid ${isSpeaking ? 'rgba(239,68,68,0.3)' : 'rgba(212,160,60,0.2)'}`,
                  }}
                >
                  {isSpeaking ? '⏹ Stop' : '🔊 Listen'}
                </button>
              </div>
              {responses.length > 1 && (
                <span className="text-sm" style={{ color: 'rgba(240, 230, 211, 0.3)' }}>
                  Showing latest of {responses.length} responses
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
