'use client';

import { useState, useRef } from 'react';
import { NpcCharacter, NpcResponse } from '../lib/types';

interface NpcCardProps {
  npc: NpcCharacter;
  responses: NpcResponse[];
  onTrigger: (npcId: string) => void;
  isLoading: boolean;
}

export default function NpcCard({ npc, responses, onTrigger, isLoading }: NpcCardProps) {
  const [expandedResponse, setExpandedResponse] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const speakText = async (text: string) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
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
      const audio = new Audio(url);
      audioRef.current = audio;

      audio.onended = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(url);
        audioRef.current = null;
      };
      audio.onerror = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(url);
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
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
  };

  const latestResponse = responses[responses.length - 1];

  return (
    <div className="glass animate-in-scale rounded-2xl p-5 transition-all hover:border-[rgba(212,160,60,0.25)]">
      {/* NPC Header */}
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-full text-2xl"
            style={{ background: 'rgba(212,160,60,0.12)' }}
          >
            {npc.avatarEmoji}
          </div>
          <div>
            <h3 className="heading-display text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
              {npc.name}
            </h3>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{npc.title}</p>
          </div>
        </div>
        <button
          onClick={() => onTrigger(npc.id)}
          disabled={isLoading}
          className="rounded-xl px-4 py-2 text-sm font-semibold transition-all hover:scale-[1.03] disabled:opacity-40 disabled:hover:scale-100"
          style={{
            background: isLoading ? 'rgba(255,255,255,0.04)' : 'rgba(212,160,60,0.18)',
            color: isLoading ? 'var(--text-muted)' : 'var(--accent)',
            border: '1px solid ' + (isLoading ? 'transparent' : 'rgba(212,160,60,0.2)'),
          }}
        >
          {isLoading ? 'Thinking...' : 'Speak'}
        </button>
      </div>

      <p className="mb-3 text-sm leading-relaxed italic" style={{ color: 'var(--text-muted)' }}>
        {npc.stance}
      </p>

      {/* Response */}
      {latestResponse && (
        <div
          className="mt-3 rounded-xl p-4"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--panel-border)' }}
        >
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--accent-dim)' }}>
              Response
            </span>
            <button
              onClick={() =>
                isSpeaking ? stopSpeaking() : speakText(latestResponse.text)
              }
              className={`rounded-lg px-3 py-1 text-xs font-medium transition-all ${
                isSpeaking ? 'animate-pulse' : ''
              }`}
              style={{
                background: isSpeaking ? 'rgba(239,68,68,0.2)' : 'rgba(212,160,60,0.12)',
                color: isSpeaking ? '#f87171' : 'var(--accent)',
              }}
              title={isSpeaking ? 'Stop' : 'Read aloud'}
            >
              {isSpeaking ? '⏹ Stop' : '🔊 Listen'}
            </button>
          </div>
          <p
            className={`text-base leading-relaxed ${!expandedResponse ? 'line-clamp-6' : ''}`}
            style={{ color: 'var(--text-primary)' }}
          >
            {latestResponse.text}
          </p>
          {latestResponse.text.length > 300 && (
            <button
              onClick={() =>
                setExpandedResponse(expandedResponse ? null : latestResponse.npcId)
              }
              className="mt-2 text-xs font-medium"
              style={{ color: 'var(--accent-dim)' }}
            >
              {expandedResponse ? 'Show less' : 'Show more'}
            </button>
          )}
        </div>
      )}

      {responses.length > 1 && (
        <div className="mt-2 text-xs" style={{ color: 'var(--text-muted)' }}>
          {responses.length} responses total
        </div>
      )}
    </div>
  );
}
