'use client';

import { useState, useRef, useEffect } from 'react';
import { StudentRole, NpcResponse } from '../lib/types';

interface TaCardProps {
  role: StudentRole;
  responses: NpcResponse[];
  onSubmit: (response: NpcResponse) => void;
  currentStageId: string;
}

export default function TaCard({ role, responses, onSubmit, currentStageId }: TaCardProps) {
  const [showModal, setShowModal] = useState(false);
  const [text, setText] = useState('');
  const [showInput, setShowInput] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const prevResponseCount = useRef(responses.length);

  const latestResponse = responses[responses.length - 1];

  // Auto-open modal when a new response arrives
  useEffect(() => {
    if (responses.length > prevResponseCount.current && latestResponse) {
      setShowModal(true);
    }
    prevResponseCount.current = responses.length;
  }, [responses.length, latestResponse]);

  // Focus textarea when input opens
  useEffect(() => {
    if (showInput) textareaRef.current?.focus();
  }, [showInput]);

  // ESC key closes modal
  useEffect(() => {
    if (!showModal) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowModal(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [showModal]);

  const handleSubmit = () => {
    if (!text.trim()) return;
    onSubmit({
      npcId: role.id,
      text: text.trim(),
      timestamp: Date.now(),
      stageId: currentStageId,
    });
    setText('');
    setShowInput(false);
  };

  const displayName = role.assignedTo
    ? `${role.name} (${role.assignedTo})`
    : role.name;

  return (
    <>
      {/* Compact Card */}
      <div
        className="glass animate-in-scale flex flex-col rounded-2xl p-5 transition-all hover:border-[rgba(99,182,255,0.25)]"
        style={{ minHeight: '180px', borderColor: 'rgba(99,182,255,0.1)' }}
      >
        <div className="mb-3 flex items-center gap-4">
          <div
            className="flex h-16 w-16 items-center justify-center rounded-full text-2xl font-bold"
            style={{ background: 'rgba(99,182,255,0.12)', color: '#63b6ff' }}
          >
            {role.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="heading-display text-xl font-bold truncate" style={{ color: 'var(--text-primary)' }}>
                {role.name}
              </h3>
              <span
                className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase"
                style={{ background: 'rgba(99,182,255,0.15)', color: '#63b6ff' }}
              >
                TA
              </span>
            </div>
            <p className="text-sm truncate" style={{ color: 'var(--text-muted)' }}>
              {role.title}
              {role.assignedTo && ` — ${role.assignedTo}`}
            </p>
          </div>
        </div>

        <p className="mb-4 text-sm leading-relaxed line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
          {role.description}
        </p>

        {/* Text input area */}
        {showInput && (
          <div className="mb-3 space-y-2">
            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSubmit();
              }}
              placeholder={`Record what ${role.name} is saying...`}
              className="w-full rounded-xl px-4 py-3 text-sm placeholder-white/20 focus:outline-none"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(99,182,255,0.2)',
                color: 'var(--text-primary)',
                minHeight: '80px',
                resize: 'vertical',
              }}
            />
            <div className="flex items-center justify-between">
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                Cmd+Enter to submit
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => { setShowInput(false); setText(''); }}
                  className="rounded-lg px-3 py-1.5 text-sm transition-all"
                  style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)' }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!text.trim()}
                  className="rounded-lg px-4 py-1.5 text-sm font-semibold transition-all disabled:opacity-30"
                  style={{
                    background: 'rgba(99,182,255,0.18)',
                    color: '#63b6ff',
                    border: '1px solid rgba(99,182,255,0.2)',
                  }}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="mt-auto flex items-center gap-2">
          <button
            onClick={() => setShowInput((s) => !s)}
            className="flex-1 rounded-xl px-4 py-2.5 text-base font-semibold transition-all hover:scale-[1.02]"
            style={{
              background: showInput ? 'rgba(99,182,255,0.08)' : 'rgba(99,182,255,0.18)',
              color: '#63b6ff',
              border: '1px solid rgba(99,182,255,0.2)',
            }}
          >
            {showInput ? 'Hide' : 'Record'}
          </button>
          {latestResponse && (
            <button
              onClick={() => setShowModal(true)}
              className="rounded-xl px-3 py-2.5 text-sm transition-all hover:scale-[1.02]"
              style={{
                background: 'rgba(255,255,255,0.06)',
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

      {/* Response Modal — same layout as NpcCard */}
      {showModal && latestResponse && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-6"
          style={{ background: 'rgba(0,0,0,0.7)' }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowModal(false);
          }}
          role="dialog"
          aria-modal="true"
          aria-label={`Response from ${displayName}`}
        >
          <div
            className="animate-in-scale w-full max-w-2xl overflow-hidden rounded-3xl"
            style={{
              background: 'rgba(18, 20, 30, 0.95)',
              border: '1px solid rgba(99,182,255,0.2)',
              boxShadow: '0 0 80px rgba(99,182,255,0.06), 0 25px 50px rgba(0,0,0,0.5)',
              maxHeight: '85vh',
            }}
          >
            {/* Modal Header */}
            <div
              className="relative flex items-center gap-5 px-8 py-6"
              style={{
                background: 'linear-gradient(135deg, rgba(99,182,255,0.06), rgba(15,17,23,0.5))',
                borderBottom: '1px solid rgba(99,182,255,0.1)',
              }}
            >
              <div
                className="flex h-24 w-24 items-center justify-center rounded-2xl text-5xl font-bold"
                style={{ background: 'rgba(99,182,255,0.12)', color: '#63b6ff' }}
              >
                {role.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <h2 className="heading-display text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
                    {role.name}
                  </h2>
                  <span
                    className="rounded-full px-2.5 py-0.5 text-xs font-bold uppercase"
                    style={{ background: 'rgba(99,182,255,0.15)', color: '#63b6ff' }}
                  >
                    TA
                  </span>
                </div>
                <p className="mt-1 text-base" style={{ color: 'var(--text-muted)' }}>
                  {role.title}
                  {role.assignedTo && ` — played by ${role.assignedTo}`}
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                aria-label="Close dialog"
                className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full text-lg transition-all hover:scale-110"
                style={{ background: 'rgba(255,255,255,0.08)', color: 'var(--text-muted)' }}
              >
                ×
              </button>
            </div>

            {/* Modal Body — response text */}
            <div className="overflow-y-auto px-8 py-6" style={{ maxHeight: 'calc(85vh - 200px)' }}>
              <p
                className="heading-display text-xl leading-relaxed"
                style={{ color: 'var(--text-primary)', lineHeight: '1.7' }}
              >
                {latestResponse.text}
              </p>
            </div>

            {/* Modal Footer */}
            <div
              className="flex items-center justify-end px-8 py-4"
              style={{ borderTop: '1px solid rgba(99,182,255,0.08)' }}
            >
              {responses.length > 1 && (
                <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
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
