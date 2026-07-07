import { useEffect, useState } from 'react';
import type { ToastItem } from '../../hooks/useToast';

const TYPE_CONFIG = {
  alarm: {
    icon: '⏰',
    bar: 'bg-red-400',
    border: 'border-red-500/40',
    iconBg: 'bg-red-500/20 text-red-300',
    title: 'text-red-300',
  },
  success: {
    icon: '✓',
    bar: 'bg-emerald-400',
    border: 'border-emerald-500/40',
    iconBg: 'bg-emerald-500/20 text-emerald-300',
    title: 'text-emerald-300',
  },
  info: {
    icon: 'ℹ',
    bar: 'bg-violet-400',
    border: 'border-violet-500/40',
    iconBg: 'bg-violet-500/20 text-violet-300',
    title: 'text-violet-300',
  },
};

// ─── Single Toast ─────────────────────────────────────────────────────────────

interface ToastProps {
  toast: ToastItem;
  onRemove: (id: string) => void;
}

const Toast = ({ toast, onRemove }: ToastProps) => {
  const [visible, setVisible] = useState(false);
  const cfg = TYPE_CONFIG[toast.type];

  // Animate in
  useEffect(() => {
    const t = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(t);
  }, []);

  const dismiss = () => {
    setVisible(false);
    setTimeout(() => onRemove(toast.id), 300);
  };

  return (
    <div
      className={`relative w-80 rounded-2xl bg-[#1a1630]/95 backdrop-blur-xl border ${cfg.border} shadow-2xl overflow-hidden transition-all duration-300 ${
        visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
      }`}
    >
      {/* Progress bar */}
      <div className={`absolute top-0 left-0 h-0.5 w-full ${cfg.bar} animate-[shrink_8s_linear_forwards]`} />

      <div className="flex items-start gap-3 p-4">
        {/* Icon */}
        <div className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-lg ${cfg.iconBg}`}>
          {cfg.icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pt-0.5">
          <p className={`text-xs font-bold uppercase tracking-wider ${cfg.title}`}>
            {toast.title}
          </p>
          <p className="mt-0.5 text-sm text-white/80 break-words">{toast.message}</p>
        </div>

        {/* Dismiss */}
        <button
          onClick={dismiss}
          className="flex-shrink-0 mt-0.5 w-5 h-5 flex items-center justify-center rounded-full text-white/30 hover:text-white/70 hover:bg-white/10 transition-all cursor-pointer text-xs"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

// ─── Toast Container ──────────────────────────────────────────────────────────

interface ContainerProps {
  toasts: ToastItem[];
  onRemove: (id: string) => void;
}

export const ToastContainer = ({ toasts, onRemove }: ContainerProps) => (
  <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
    {toasts.map((t) => (
      <div key={t.id} className="pointer-events-auto">
        <Toast toast={t} onRemove={onRemove} />
      </div>
    ))}
  </div>
);

export default Toast;
