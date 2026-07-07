import { useState, useRef, useEffect, type KeyboardEvent, type FocusEvent } from 'react';
import type { Priority } from '../../types/task';
import { localToISO } from '../../utils/date';

const PRIORITY_OPTIONS: { value: Priority; label: string; color: string }[] = [
  { value: 'none',   label: 'No Priority', color: 'text-white/40 border-white/20' },
  { value: 'medium', label: 'Medium',      color: 'text-yellow-400 border-yellow-500/50 bg-yellow-500/10' },
  { value: 'high',   label: 'High',        color: 'text-red-400 border-red-500/50 bg-red-500/10' },
];

const PRIORITY_DOT: Record<Priority, string> = { none: '○', medium: '◑', high: '●' };

interface Props {
  onAdd: (title: string, content: string, priority: Priority, deadline: string | null) => void;
}

const TaskInput = ({ onAdd }: Props) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState<Priority>('none');
  const [deadlineLocal, setDeadlineLocal] = useState('');
  const [expanded, setExpanded] = useState(false);

  const formRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => { titleRef.current?.focus(); }, []);

  const collapse = () => {
    setExpanded(false);
    setTitle('');
    setContent('');
    setPriority('none');
    setDeadlineLocal('');
  };

  const handleSubmit = () => {
    if (!title.trim()) return;
    onAdd(title, content, priority, deadlineLocal ? localToISO(deadlineLocal) : null);
    collapse();
    setTimeout(() => titleRef.current?.focus(), 50);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(); }
    if (e.key === 'Escape') { collapse(); }
  };

  // Collapse only if focus leaves the entire form and title is empty
  const handleBlur = (e: FocusEvent<HTMLDivElement>) => {
    if (!formRef.current?.contains(e.relatedTarget as Node) && !title.trim()) {
      setExpanded(false);
    }
  };

  const cyclePriority = () => {
    const idx = PRIORITY_OPTIONS.findIndex((p) => p.value === priority);
    setPriority(PRIORITY_OPTIONS[(idx + 1) % PRIORITY_OPTIONS.length].value);
  };

  const currentPriority = PRIORITY_OPTIONS.find((p) => p.value === priority)!;

  return (
    <div ref={formRef} onBlur={handleBlur} className="flex flex-col gap-2">
      {/* ── Row 1: Title + actions ──────────────────────────────────────── */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25 text-base pointer-events-none select-none">+</span>
          <input
            ref={titleRef}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onFocus={() => setExpanded(true)}
            onKeyDown={handleKeyDown}
            placeholder="What needs to be done?"
            className="w-full rounded-xl bg-white/[0.06] border border-white/15 pl-9 pr-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-violet-400/70 focus:bg-white/[0.08] focus:ring-2 focus:ring-violet-400/15 transition-all duration-200"
          />
        </div>

        {expanded ? (
          <button
            onClick={handleSubmit}
            tabIndex={0}
            className="rounded-xl bg-violet-500 hover:bg-violet-400 active:scale-95 px-5 py-3 text-sm font-semibold text-white transition-all duration-150 cursor-pointer shrink-0 shadow-md shadow-violet-500/25"
          >
            Add
          </button>
        ) : (
          <button
            onClick={() => { setExpanded(true); setTimeout(() => titleRef.current?.focus(), 10); }}
            className="rounded-xl border border-white/15 bg-white/[0.06] hover:bg-white/10 px-4 py-3 text-white/40 hover:text-white/70 transition-all duration-150 cursor-pointer shrink-0 text-lg leading-none"
            title="Expand task form"
          >
            ↓
          </button>
        )}
      </div>

      {/* ── Expanded fields ─────────────────────────────────────────────── */}
      {expanded && (
        <div className="flex flex-col gap-2 animate-[expandDown_0.2s_ease-out]">
          {/* Content */}
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add notes or description… (Shift+Enter for new line)"
            rows={2}
            className="w-full rounded-xl bg-white/[0.06] border border-white/15 px-4 py-2.5 text-sm text-white/80 placeholder-white/25 outline-none focus:border-violet-400/50 focus:ring-1 focus:ring-violet-400/15 transition-all duration-200 resize-none"
          />

          {/* Deadline + Priority row */}
          <div className="flex gap-2 items-center">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-white/30 pointer-events-none">📅</span>
              <input
                type="datetime-local"
                value={deadlineLocal}
                onChange={(e) => setDeadlineLocal(e.target.value)}
                className="w-full rounded-xl bg-white/[0.06] border border-white/15 pl-9 pr-3 py-2.5 text-sm text-white/70 outline-none focus:border-violet-400/50 focus:ring-1 focus:ring-violet-400/15 transition-all duration-200 [color-scheme:dark]"
              />
            </div>

            <button
              onClick={cyclePriority}
              tabIndex={0}
              className={`rounded-xl border px-3 py-2.5 text-xs font-semibold transition-all duration-200 cursor-pointer flex items-center gap-1.5 shrink-0 bg-white/[0.04] hover:bg-white/[0.08] ${currentPriority.color}`}
              title="Cycle priority"
            >
              <span>{PRIORITY_DOT[priority]}</span>
              <span className="hidden sm:inline">{currentPriority.label}</span>
            </button>

            <button
              onClick={collapse}
              className="rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] px-3 py-2.5 text-xs text-white/30 hover:text-white/60 transition-all duration-150 cursor-pointer shrink-0"
              title="Cancel"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskInput;
