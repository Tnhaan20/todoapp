import type { Task } from '../types/task';

const STORAGE_KEY = 'todo-app-tasks';

// Migrate tasks across schema versions
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const migrateTask = (raw: any): Task => ({
  id: raw.id ?? crypto.randomUUID(),
  title: raw.title ?? raw.text ?? '(untitled)',
  content: raw.content ?? '',
  completed: raw.completed ?? false,
  priority: raw.priority ?? 'none',
  deadline: raw.deadline ?? null,
  createdAt: raw.createdAt ?? new Date().toISOString(),
  updatedAt: raw.updatedAt ?? new Date().toISOString(),
});

export const loadFromStorage = (): Task[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(migrateTask) : [];
  } catch {
    return [];
  }
};

export const saveToStorage = (tasks: Task[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};
