import { useCallback, useEffect, useState } from 'react';
import { useTasks } from './hooks/useTasks';
import { useToast } from './hooks/useToast';
import { useDeadlineAlarm } from './hooks/useDeadlineAlarm';
import TaskInput from './components/TaskInput';
import FilterTabs from './components/FilterTabs';
import TaskList from './components/TaskList';
import { ToastContainer } from './components/Toast';
import type { Task } from './types/task';

// Format today's date for the header
const formatToday = () =>
  new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });

const App = () => {
  // Live deadline badge tick (every 60s)
  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((n) => n + 1), 60_000);
    return () => clearInterval(id);
  }, []);

  const { tasks, allTasks, filter, setFilter, activeCount, completedCount, addTask, editTask, deleteTask, toggleTask } = useTasks();
  const { toasts, addToast, removeToast } = useToast();

  const handleAlarm = useCallback((task: Task) => {
    addToast({ type: 'alarm', title: 'Deadline Reached!', message: task.title });
  }, [addToast]);

  useDeadlineAlarm(allTasks, handleAlarm);

  const totalCount = activeCount + completedCount;

  return (
    <>
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] flex flex-col items-center px-4 py-12">
        <div className="w-full max-w-xl">

          {/* ── Header ─────────────────────────────────────────────────── */}
          <header className="mb-7 flex items-end justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">My Tasks</h1>
              <p className="mt-0.5 text-xs text-white/35">{formatToday()}</p>
            </div>

            {/* Stats pills */}
            {totalCount > 0 && (
              <div className="flex gap-2 text-xs mb-0.5">
                <span className="px-2.5 py-1 rounded-full bg-violet-500/20 border border-violet-500/30 text-violet-300 font-medium">
                  {activeCount} active
                </span>
                {completedCount > 0 && (
                  <span className="px-2.5 py-1 rounded-full bg-white/8 border border-white/12 text-white/40 font-medium">
                    {completedCount} done
                  </span>
                )}
              </div>
            )}
          </header>

          {/* ── Main card ──────────────────────────────────────────────── */}
          <main className="rounded-2xl bg-white/[0.035] backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden">
            {/* Input section */}
            <div className="px-5 pt-5 pb-4">
              <TaskInput onAdd={addTask} />
            </div>

            {/* Divider */}
            <div className="mx-5 border-t border-white/[0.07]" />

            {/* Filter tabs */}
            <div className="px-5 py-3">
              <FilterTabs
                current={filter}
                onChange={setFilter}
                activeCount={activeCount}
                completedCount={completedCount}
              />
            </div>

            {/* Divider */}
            <div className="mx-5 border-t border-white/[0.07]" />

            {/* Task list — scrollable */}
            <div className="px-5 py-3 max-h-[60vh] overflow-y-auto">
              <TaskList
                tasks={tasks}
                filter={filter}
                onToggle={toggleTask}
                onEdit={editTask}
                onDelete={deleteTask}
              />
            </div>

            {/* Footer stripe */}
            {totalCount > 0 && (
              <div className="px-5 py-2.5 border-t border-white/[0.05] flex items-center justify-between">
                <p className="text-[11px] text-white/20">
                  {activeCount === 0 ? 'All done 🎉' : `${activeCount} of ${totalCount} remaining`}
                </p>
                <p className="text-[11px] text-white/15">Auto-saved · Alarms active</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
};

export default App;
