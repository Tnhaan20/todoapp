import type { DeadlineStatus } from '../types/task';

export const now = (): string => new Date().toISOString();

export const formatDate = (iso: string): string =>
  new Date(iso).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

export const formatDeadline = (iso: string): string =>
  new Date(iso).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

/**
 * Returns null if no deadline or task is completed,
 * otherwise 'overdue' | 'due-soon' (< 24h) | 'upcoming'
 */
export const getDeadlineStatus = (
  deadline: string | null,
  completed: boolean
): DeadlineStatus | null => {
  if (!deadline || completed) return null;
  const diffMs = new Date(deadline).getTime() - Date.now();
  if (diffMs < 0) return 'overdue';
  if (diffMs < 24 * 60 * 60 * 1000) return 'due-soon';
  return 'upcoming';
};

/** Convert a local datetime-local string to ISO */
export const localToISO = (local: string): string =>
  local ? new Date(local).toISOString() : '';

/** Convert an ISO string to the format required by <input type="datetime-local"> */
export const isoToLocal = (iso: string | null): string => {
  if (!iso) return '';
  const d = new Date(iso);
  // Format: YYYY-MM-DDTHH:MM
  return new Date(d.getTime() - d.getTimezoneOffset() * 60_000)
    .toISOString()
    .slice(0, 16);
};
