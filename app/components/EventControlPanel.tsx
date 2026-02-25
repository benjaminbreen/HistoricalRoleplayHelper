'use client';

import { StageEvent } from '../lib/types';

interface ScheduledEvent {
  event: StageEvent;
  triggerAtElapsed: number | null; // null = skipped (didn't pass probability)
}

interface EventControlPanelProps {
  scheduledEvents: ScheduledEvent[];
  triggeredIds: Set<string>;
  onTrigger: (event: StageEvent) => void;
  elapsed: number;
}

export default function EventControlPanel({
  scheduledEvents,
  triggeredIds,
  onTrigger,
  elapsed,
}: EventControlPanelProps) {
  if (scheduledEvents.length === 0) {
    return (
      <div className="glass animate-in mx-8 mb-2 rounded-2xl p-4">
        <p className="text-sm italic" style={{ color: 'var(--text-muted)' }}>
          No events configured for this stage.
        </p>
      </div>
    );
  }

  return (
    <div className="glass animate-in mx-8 mb-2 rounded-2xl p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3
          className="text-sm font-semibold uppercase tracking-wider"
          style={{ color: 'var(--text-muted)' }}
        >
          Stage Events
        </h3>
        <span className="text-xs tabular-nums" style={{ color: 'var(--text-muted)' }}>
          Elapsed: {Math.floor(elapsed)}s
        </span>
      </div>
      <div className="space-y-2">
        {scheduledEvents.map(({ event, triggerAtElapsed }) => {
          const triggered = triggeredIds.has(event.id);
          const skipped = triggerAtElapsed === null;
          const pending = !triggered && !skipped;

          let statusLabel: string;
          let statusColor: string;
          let statusBg: string;
          if (triggered) {
            statusLabel = 'Triggered';
            statusColor = '#6ee7b7';
            statusBg = 'rgba(110,231,183,0.12)';
          } else if (skipped) {
            statusLabel = 'Skipped';
            statusColor = 'var(--text-muted)';
            statusBg = 'rgba(255,255,255,0.04)';
          } else {
            statusLabel = 'Scheduled';
            statusColor = '#fbbf24';
            statusBg = 'rgba(251,191,36,0.12)';
          }

          return (
            <div
              key={event.id}
              className="flex items-center gap-3 rounded-xl p-3"
              style={{
                background: triggered
                  ? 'rgba(110,231,183,0.04)'
                  : 'rgba(255,255,255,0.03)',
                border: `1px solid ${triggered ? 'rgba(110,231,183,0.12)' : 'var(--panel-border)'}`,
                opacity: skipped ? 0.5 : 1,
              }}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {event.text}
                  </span>
                  <span
                    className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase"
                    style={{ background: statusBg, color: statusColor }}
                  >
                    {statusLabel}
                  </span>
                </div>
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  Window: {event.minDelay}–{event.maxDelay}s · Prob: {Math.round(event.probability * 100)}%
                  {triggerAtElapsed !== null && !triggered && (
                    <> · Fires at {Math.round(triggerAtElapsed)}s</>
                  )}
                </span>
              </div>
              {!triggered && (
                <button
                  onClick={() => onTrigger(event)}
                  className="rounded-lg px-3 py-1.5 text-xs font-semibold transition-all hover:scale-105"
                  style={{
                    background: 'rgba(200,120,30,0.15)',
                    color: '#f59e0b',
                    border: '1px solid rgba(200,120,30,0.25)',
                  }}
                >
                  Trigger
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
