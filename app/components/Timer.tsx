'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

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
  const [flash, setFlash] = useState(false);

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
        setFlash(true);
        setTimeout(() => setFlash(false), 1500);
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
      {/* Screen-edge flash on 30-second warning */}
      {flash && (
        <div
          className="pointer-events-none fixed inset-0 z-[100]"
          style={{
            boxShadow: 'inset 0 0 80px 20px rgba(232,168,64,0.35)',
            animation: 'timer-flash 1.5s ease-out forwards',
          }}
        />
      )}
      <div
        role="timer"
        aria-live={isWarning || isExpired ? 'assertive' : 'off'}
        aria-label={`${mins} minutes ${secs} seconds remaining`}
        className={`font-mono text-2xl sm:text-3xl md:text-4xl font-bold tabular-nums tracking-wider transition-colors ${
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
          className="rounded-lg p-2.5 sm:px-3 sm:py-2 text-lg transition-all hover:scale-105 min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 flex items-center justify-center"
          style={{ background: 'rgba(212,160,60,0.12)', color: 'var(--accent)' }}
          title={running ? 'Pause' : 'Start'}
        >
          {running ? <Pause size={18} /> : <Play size={18} />}
        </button>
        <button
          onClick={() => onReset(defaultDuration)}
          className="rounded-lg p-2.5 sm:px-3 sm:py-2 text-lg transition-all hover:scale-105 min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 flex items-center justify-center"
          style={{ background: 'var(--subtle-bg)', color: 'var(--text-secondary)' }}
          title="Reset timer"
        >
          <RotateCcw size={18} />
        </button>
        <button
          onClick={() => onTick(seconds + 60)}
          className="rounded-lg p-2.5 sm:px-3 sm:py-2 text-sm transition-all hover:scale-105 min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 flex items-center justify-center"
          style={{ background: 'var(--subtle-bg)', color: 'var(--text-secondary)' }}
          title="Add 1 minute"
        >
          +1m
        </button>
      </div>
    </div>
  );
}
