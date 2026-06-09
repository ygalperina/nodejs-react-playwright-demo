import { request } from './client';
import { Task, CreateTaskPayload, UpdateTaskPayload } from '../types/task';

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