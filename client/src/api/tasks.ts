import { Task, CreateTaskPayload, UpdateTaskPayload } from '../types/task';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(err.error || 'Request failed');
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export const tasksApi = {
  getAll: (status?: string) =>
    request<Task[]>(`/api/tasks${status ? `?status=${status}` : ''}`),

  create: (payload: CreateTaskPayload) =>
    request<Task>('/api/tasks', { method: 'POST', body: JSON.stringify(payload) }),

  update: (id: number, payload: UpdateTaskPayload) =>
    request<Task>(`/api/tasks/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),

  delete: (id: number) =>
    request<void>(`/api/tasks/${id}`, { method: 'DELETE' }),
};