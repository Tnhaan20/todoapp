import { useState, useEffect, useCallback } from 'react';
import type { Task, FilterType, Priority } from '../types/task';
import { now } from '../utils/date';
import { loadFromStorage, saveToStorage } from '../utils/storage';

// Higher number = lower priority in sort
const PRIORITY_RANK: Record<Priority, number> = { high: 0, medium: 1, none: 2 };

const sortTasks = (tasks: Task[]): Task[] =>
  [...tasks].sort((a, b) => {
    // Incomplete before completed
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    // Among incomplete: overdue first
    if (!a.completed) {
      const aOverdue = a.deadline && new Date(a.deadline).getTime() < Date.now();
      const bOverdue = b.deadline && new Date(b.deadline).getTime() < Date.now();
      if (aOverdue !== bOverdue) return aOverdue ? -1 : 1;
      // Then by priority
      const pd = PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority];
      if (pd !== 0) return pd;
    }
    // Finally by newest created
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>(loadFromStorage);
  const [filter, setFilter] = useState<FilterType>('all');

  useEffect(() => { saveToStorage(tasks); }, [tasks]);

  const addTask = useCallback(
    (title: string, content: string = '', priority: Priority = 'none', deadline: string | null = null) => {
      const trimmedTitle = title.trim();
      if (!trimmedTitle) return;
      setTasks((prev) => [
        {
          id: crypto.randomUUID(),
          title: trimmedTitle,
          content: content.trim(),
          completed: false,
          priority,
          deadline,
          createdAt: now(),
          updatedAt: now(),
        },
        ...prev,
      ]);
    },
    []
  );

  const editTask = useCallback(
    (id: string, title: string, content: string, priority: Priority, deadline: string | null) => {
      const trimmedTitle = title.trim();
      if (!trimmedTitle) return;
      setTasks((prev) =>
        prev.map((task) =>
          task.id === id && !task.completed
            ? { ...task, title: trimmedTitle, content: content.trim(), priority, deadline, updatedAt: now() }
            : task
        )
      );
    },
    []
  );

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }, []);

  const toggleTask = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed, updatedAt: now() } : task
      )
    );
  }, []);

  const filteredTasks = sortTasks(
    tasks.filter((task) => {
      if (filter === 'active') return !task.completed;
      if (filter === 'completed') return task.completed;
      return true;
    })
  );

  const activeCount = tasks.filter((t) => !t.completed).length;
  const completedCount = tasks.filter((t) => t.completed).length;

  return {
    tasks: filteredTasks,
    allTasks: tasks,
    filter,
    setFilter,
    activeCount,
    completedCount,
    addTask,
    editTask,
    deleteTask,
    toggleTask,
  };
};
