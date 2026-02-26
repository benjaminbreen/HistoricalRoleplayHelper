'use client';

import { useEffect, useRef, useCallback } from 'react';

interface TimerProps {
  seconds: number;
  running: boolean;
  onTick: (seconds: number) => void;
  onComplete: () => void;
  onToggle: () => void;
  onReset: (seconds: number) => void;
  defaultDuration: number;
}

export default function Timer({
  seconds,
  running,
  onTick,
  onComplete,
  onToggle,
  onReset,
  defaultDuration,
}: TimerProps) {
  const audioRef = useRef<AudioContext | null>(null);
  const hasPlayedWarning = useRef(false);

  const playBeep = useCallback(() => {
    try {
      if (!audioRef.current) {
        audioRef.current = new AudioContext();
      }
      const ctx = audioRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 880;
      gain.gain.value = 0.3;
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch {}
  }, []);

  useEffect(() => {
    if (!running || seconds <= 0) return;
    const interval = setInterval(() => {
      const next = seconds - 1;
      onTick(next);
      if (next <= 30 && next > 0 && !hasPlayedWarning.current) {
        hasPlayedWarning.current = true;
        playBeep();
      }
      if (next <= 0) {
        clearInterval(interval);
        playBeep();
        onComplete();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [running, seconds, onTick, onComplete, playBeep]);

  useEffect(() => {
    hasPlayedWarning.current = false;
  }, [defaultDuration]);

  const mins = Math.floor(Math.max(0, seconds) / 60);
  const secs = Math.max(0, seconds) % 60;
  const isWarning = seconds <= 30 && seconds > 0;
  const isExpired = seconds <= 0;

  return (
    <div className="flex items-center gap-3">
      <div
        role="timer"
        aria-live={isWarning || isExpired ? 'assertive' : 'off'}
        aria-label={`${mins} minutes ${secs} seconds remaining`}
        className={`font-mono text-4xl font-bold tabular-nums tracking-wider transition-colors ${
          isExpired
            ? 'text-red-400'
            : isWarning
              ? 'animate-pulse'
              : ''
        }`}
        style={{ color: isExpired ? undefined : isWarning ? '#e8a840' : 'var(--accent)' }}
      >
        {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
      </div>
      <div className="flex gap-1">
        <button
          onClick={onToggle}
          className="rounded-lg px-3 py-2 text-lg transition-all hover:scale-105"
          style={{ background: 'rgba(212,160,60,0.12)', color: 'var(--accent)' }}
          title={running ? 'Pause' : 'Start'}
        >
          {running ? '⏸' : '▶'}
        </button>
        <button
          onClick={() => onReset(defaultDuration)}
          className="rounded-lg px-3 py-2 text-lg transition-all hover:scale-105"
          style={{ background: 'var(--subtle-bg)', color: 'var(--text-secondary)' }}
          title="Reset timer"
        >
          ↺
        </button>
        <button
          onClick={() => onTick(seconds + 60)}
          className="rounded-lg px-3 py-2 text-sm transition-all hover:scale-105"
          style={{ background: 'var(--subtle-bg)', color: 'var(--text-secondary)' }}
          title="Add 1 minute"
        >
          +1m
        </button>
      </div>
    </div>
  );
}
