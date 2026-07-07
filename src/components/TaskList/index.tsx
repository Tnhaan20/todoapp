import type { Task, FilterType, Priority } from '../../types/task';
import TaskItem from '../TaskItem';

interface Props {
  tasks: Task[];
  filter: FilterType;
  onToggle: (id: string) => void;
  onEdit: (id: string, title: string, content: string, priority: Priority, deadline: string | null) => void;
  onDelete: (id: string) => void;
}

// ── Section label ──────────────────────────────────────────────────────────────
const SectionLabel = ({ label, count }: { label: string; count: number }) => (
  <div className="flex items-center gap-2 mt-1">
    <span className="text-[11px] font-semibold uppercase tracking-widest text-white/25">{label}</span>
    <span className="text-[11px] text-white/20">({count})</span>
    <div className="flex-1 border-t border-white/[0.06]" />
  </div>
);

// ── Empty state ────────────────────────────────────────────────────────────────
const EMPTY: Record<FilterType, { icon: string; text: string }> = {
  all:       { icon: '✓', text: 'No tasks yet — add one above!' },
  active:    { icon: '🎉', text: 'All done! Nothing active right now.' },
  completed: { icon: '○', text: 'No completed tasks yet.' },
};

const TaskList = ({ tasks, filter, onToggle, onEdit, onDelete }: Props) => {
  if (tasks.length === 0) {
    const { icon, text } = EMPTY[filter];
    return (
      <div className="py-12 text-center">
        <p className="text-3xl mb-2">{icon}</p>
        <p className="text-sm text-white/30">{text}</p>
      </div>
    );
  }

  // In "All" view, split incomplete / completed with a visual separator
  if (filter === 'all') {
    const incomplete = tasks.filter((t) => !t.completed);
    const completed  = tasks.filter((t) => t.completed);

    return (
      <div className="flex flex-col gap-2">
        {incomplete.map((task) => (
          <TaskItem key={task.id} task={task} onToggle={onToggle} onEdit={onEdit} onDelete={onDelete} />
        ))}

        {incomplete.length > 0 && completed.length > 0 && (
          <SectionLabel label="Completed" count={completed.length} />
        )}

        {completed.map((task) => (
          <TaskItem key={task.id} task={task} onToggle={onToggle} onEdit={onEdit} onDelete={onDelete} />
        ))}

        {incomplete.length === 0 && completed.length > 0 && (
          <div className="pt-1 text-center text-sm text-white/30">All tasks done 🎉</div>
        )}
      </div>
    );
  }

  // Flat list for Active / Completed views
  return (
    <ul className="flex flex-col gap-2">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} onToggle={onToggle} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </ul>
  );
};

export default TaskList;
