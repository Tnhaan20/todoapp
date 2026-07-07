export type FilterType = 'all' | 'active' | 'completed';

export type Priority = 'none' | 'medium' | 'high';

export type DeadlineStatus = 'overdue' | 'due-soon' | 'upcoming';

export interface Task {
  id: string;
  title: string;
  content: string;
  completed: boolean;
  priority: Priority;
  deadline: string | null; // ISO 8601 or null (no deadline)
  createdAt: string;       // ISO 8601
  updatedAt: string;       // ISO 8601
}
