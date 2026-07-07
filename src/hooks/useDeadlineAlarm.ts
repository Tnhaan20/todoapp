import { useEffect, useRef } from 'react';
import type { Task } from '../types/task';

const CHECK_INTERVAL = 30_000; // 30 seconds

/**
 * Polls deadlines on an interval AND immediately whenever `tasks` changes.
 * Resets the "already alarmed" flag for a task when its deadline is edited,
 * so a new alarm fires correctly after a deadline update.
 */
export const useDeadlineAlarm = (
  tasks: Task[],
  onAlarm: (task: Task) => void
) => {
  // Keep callback ref fresh without resetting the interval
  const onAlarmRef = useRef(onAlarm);
  useEffect(() => { onAlarmRef.current = onAlarm; }, [onAlarm]);

  // Task IDs that have already triggered an alarm this session
  const alarmedIds = useRef<Set<string>>(new Set());

  // Track the last known deadline per task so we can detect changes
  const prevDeadlines = useRef<Map<string, string | null>>(new Map());

  // Request browser notification permission once on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Core check function — accepts tasks directly so it always uses the latest list
  const fireCheck = useRef((currentTasks: Task[]) => {
    const now = Date.now();

    currentTasks.forEach((task) => {
      // ── Deadline-change detection ──────────────────────────────────────────
      // If the stored deadline differs from what we saw last time,
      // clear the "already alarmed" flag so the task can trigger again.
      const prev = prevDeadlines.current.get(task.id);
      if (prev !== undefined && prev !== task.deadline) {
        alarmedIds.current.delete(task.id);
      }
      prevDeadlines.current.set(task.id, task.deadline);

      // ── Alarm logic ───────────────────────────────────────────────────────
      if (!task.deadline || task.completed) return;
      if (alarmedIds.current.has(task.id)) return;

      const deadlineMs = new Date(task.deadline).getTime();
      if (now >= deadlineMs) {
        alarmedIds.current.add(task.id);
        onAlarmRef.current(task);

        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('⏰ Deadline Reached!', {
            body: task.title,
            tag: task.id, // deduplicates browser notifications
          });
        }
      }
    });
  });

  // Keep a ref to the latest tasks for the interval callback
  const tasksRef = useRef(tasks);
  useEffect(() => { tasksRef.current = tasks; }, [tasks]);

  // ── Interval-based polling (always runs, uses ref for latest tasks) ──────
  useEffect(() => {
    fireCheck.current(tasksRef.current); // immediate check on mount
    const id = setInterval(() => fireCheck.current(tasksRef.current), CHECK_INTERVAL);
    return () => clearInterval(id);
  }, []);

  // ── Instant check whenever tasks change (catches deadline edits immediately) ──
  useEffect(() => {
    fireCheck.current(tasks);
  }, [tasks]);
};
