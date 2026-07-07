import { useState, useRef, useEffect, type KeyboardEvent } from 'react';
import type { Task, Priority, DeadlineStatus } from '../../types/task';
import { formatDate, formatDeadline, getDeadlineStatus, isoToLocal, localToISO } from '../../utils/date';
import ConfirmDialog from '../ConfirmDialog';

// ─── Config ───────────────────────────────────────────────────────────────────

const PRIORITY_CONFIG: Record<Priority, { dot: string; label: string; badge: string; border: string }> = {
  none:   { dot: '',   label: '',       badge: '',                                                           border: 'border-l-white/8' },
  medium: { dot: '◑', label: 'Medium', badge: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',      border: 'border-l-yellow-400/60' },
  high:   { dot: '●', label: 'High',   badge: 'bg-red-500/15 text-red-400 border-red-500/30',              border: 'border-l-red-400/70' },
};

const PRIORITY_CYCLE: Priority[] = ['none', 'medium', 'high'];

const DEADLINE_CONFIG: Record<DeadlineStatus, { label: string; badge: string; icon: string }> = {
  overdue:    { label: 'Overdue',  icon: '⚠',  badge: 'bg-red-500/15 text-red-400 border border-red-500/30' },
  'due-soon': { label: 'Due soon', icon: '⏳', badge: 'bg-amber-500/15 text-amber-400 border border-amber-500/30' },
  upcoming:   { label: '',         icon: '📅', badge: 'bg-white/8 text-white/45 border border-white/12' },
};

// ─── Icons ────────────────────────────────────────────────────────────────────

const PencilIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);
const TrashIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
);

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  task: Task;
  onToggle: (id: string) => void;
  onEdit: (id: string, title: string, content: string, priority: Priority, deadline: string | null) => void;
  onDelete: (id: string) => void;
}

const TaskItem = ({ task, onToggle, onEdit, onDelete }: Props) => {
  const [isEditing, setIsEditing]     = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [draftTitle, setDraftTitle]       = useState(task.title);
  const [draftContent, setDraftContent]   = useState(task.content);
  const [draftPriority, setDraftPriority] = useState<Priority>(task.priority);
  const [draftDeadline, setDraftDeadline] = useState(isoToLocal(task.deadline));
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => { if (isEditing) titleRef.current?.focus(); }, [isEditing]);

  // Force-exit edit if task is marked complete while editing
  useEffect(() => {
    if (task.completed && isEditing) { resetDraft(); setIsEditing(false); }
  }, [task.completed]);

  const resetDraft = () => {
    setDraftTitle(task.title);
    setDraftContent(task.content);
    setDraftPriority(task.priority);
    setDraftDeadline(isoToLocal(task.deadline));
  };

  const openEdit = () => {
    if (task.completed) return;
    resetDraft();
    setIsEditing(true);
  };

  const submitEdit = () => {
    if (draftTitle.trim()) {
      onEdit(task.id, draftTitle, draftContent, draftPriority, draftDeadline ? localToISO(draftDeadline) : null);
    } else {
      resetDraft();
    }
    setIsEditing(false);
  };

  const cancelEdit = () => { resetDraft(); setIsEditing(false); };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submitEdit(); }
    if (e.key === 'Escape') cancelEdit();
  };

  const cyclePriority = () => {
    const idx = PRIORITY_CYCLE.indexOf(draftPriority);
    setDraftPriority(PRIORITY_CYCLE[(idx + 1) % PRIORITY_CYCLE.length]);
  };

  const deadlineStatus = getDeadlineStatus(task.deadline, task.completed);
  const priorityCfg    = PRIORITY_CONFIG[task.priority];

  // Left-border color: overdue overrides priority color
  const leftBorder = !task.completed && deadlineStatus === 'overdue'
    ? 'border-l-red-400/80'
    : priorityCfg.border;

  return (
    <>
      <li className={`group flex gap-3 rounded-xl border border-white/[0.08] border-l-[3px] ${leftBorder} px-4 py-3.5 transition-all duration-200 animate-[taskIn_0.2s_ease-out] ${
        task.completed
          ? 'bg-white/[0.02] opacity-60'
          : deadlineStatus === 'overdue'
          ? 'bg-red-500/[0.04] hover:bg-red-500/[0.07]'
          : 'bg-white/[0.04] hover:bg-white/[0.07]'
      }`}>

        {/* ── Checkbox ──────────────────────────────────────────────── */}
        <button
          onClick={() => onToggle(task.id)}
          className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 cursor-pointer ${
            task.completed
              ? 'bg-violet-500 border-violet-500 text-white animate-[checkPop_0.3s_ease-out]'
              : 'border-white/25 hover:border-violet-400/80 hover:bg-violet-400/10'
          }`}
          title={task.completed ? 'Mark as active' : 'Mark as complete'}
        >
          {task.completed && (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </button>

        {/* ── Body ──────────────────────────────────────────────────── */}
        <div className="flex-1 min-w-0">
          {isEditing ? (
            /* Edit mode */
            <div className="flex flex-col gap-2 animate-[taskIn_0.15s_ease-out]">
              <input
                ref={titleRef}
                value={draftTitle}
                onChange={(e) => setDraftTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Task title…"
                className="w-full rounded-lg bg-white/10 border border-violet-400/60 px-3 py-2 text-sm font-semibold text-white outline-none focus:ring-1 focus:ring-violet-400/30"
              />
              <textarea
                value={draftContent}
                onChange={(e) => setDraftContent(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Notes… (optional)"
                rows={2}
                className="w-full rounded-lg bg-white/[0.06] border border-white/12 px-3 py-2 text-xs text-white/80 outline-none focus:border-violet-400/40 resize-none"
              />
              <div className="flex items-center gap-2 flex-wrap">
                <input
                  type="datetime-local"
                  value={draftDeadline}
                  onChange={(e) => setDraftDeadline(e.target.value)}
                  className="flex-1 min-w-0 rounded-lg bg-white/[0.06] border border-white/12 px-2.5 py-1.5 text-xs text-white/65 outline-none focus:border-violet-400/40 [color-scheme:dark]"
                />
                <button
                  onClick={cyclePriority}
                  className={`rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-all cursor-pointer shrink-0 ${
                    PRIORITY_CONFIG[draftPriority].badge || 'border-white/12 text-white/35 bg-white/[0.04]'
                  }`}
                >
                  {draftPriority === 'none' ? '○ None' : `${PRIORITY_CONFIG[draftPriority].dot} ${PRIORITY_CONFIG[draftPriority].label}`}
                </button>
              </div>
              <div className="flex justify-end gap-2">
                <button onClick={cancelEdit} className="text-xs px-3 py-1.5 rounded-lg text-white/40 hover:text-white/70 hover:bg-white/[0.06] transition-all cursor-pointer">
                  Cancel
                </button>
                <button onClick={submitEdit} className="text-xs px-4 py-1.5 rounded-lg bg-violet-500 hover:bg-violet-400 text-white font-semibold transition-all cursor-pointer shadow-md shadow-violet-500/20">
                  Save
                </button>
              </div>
            </div>
          ) : (
            /* View mode */
            <>
              {/* Title row */}
              <div className="flex items-start gap-2 flex-wrap">
                <p className={`text-sm font-semibold leading-snug ${task.completed ? 'line-through text-white/30' : 'text-white/90'}`}>
                  {task.title}
                </p>
                {task.priority !== 'none' && !task.completed && (
                  <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full border shrink-0 ${priorityCfg.badge}`}>
                    {priorityCfg.dot} {priorityCfg.label}
                  </span>
                )}
              </div>

              {/* Content */}
              {task.content && (
                <p className={`mt-1 text-xs leading-relaxed ${task.completed ? 'text-white/20' : 'text-white/50'}`}>
                  {task.content}
                </p>
              )}

              {/* Deadline badge */}
              {task.deadline && deadlineStatus && (
                <div className="mt-1.5">
                  <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-lg ${DEADLINE_CONFIG[deadlineStatus].badge}`}>
                    <span>{DEADLINE_CONFIG[deadlineStatus].icon}</span>
                    {DEADLINE_CONFIG[deadlineStatus].label && (
                      <span className="font-bold">{DEADLINE_CONFIG[deadlineStatus].label}:</span>
                    )}
                    <span>{formatDeadline(task.deadline)}</span>
                  </span>
                </div>
              )}

              {/* Timestamps */}
              <div className="mt-1.5 flex flex-wrap gap-x-2.5 text-[10px] text-white/20">
                <span>Created {formatDate(task.createdAt)}</span>
                {task.updatedAt !== task.createdAt && <span>· Updated {formatDate(task.updatedAt)}</span>}
              </div>
            </>
          )}
        </div>

        {/* ── Action buttons ────────────────────────────────────────── */}
        {!isEditing && (
          <div className="flex flex-col gap-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
            {!task.completed && (
              <button
                onClick={openEdit}
                className="p-1.5 rounded-lg text-white/30 hover:text-violet-300 hover:bg-violet-500/12 transition-all cursor-pointer"
                title="Edit"
              >
                <PencilIcon />
              </button>
            )}
            <button
              onClick={() => setShowConfirm(true)}
              className="p-1.5 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/12 transition-all cursor-pointer"
              title="Delete"
            >
              <TrashIcon />
            </button>
          </div>
        )}
      </li>

      {/* Delete confirmation */}
      {showConfirm && (
        <ConfirmDialog
          title="Delete Task?"
          message={`"${task.title}" will be permanently removed.`}
          confirmLabel="Delete"
          onConfirm={() => { setShowConfirm(false); onDelete(task.id); }}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </>
  );
};

export default TaskItem;
