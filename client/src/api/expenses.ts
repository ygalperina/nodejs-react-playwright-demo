import { request } from './client';
import { Expense, CreateExpensePayload, UpdateExpensePayload } from '../types/expense';

export interface ExpenseFilters {
  category?: string;
  from?: string;
  to?: string;
}

function toParams(f: ExpenseFilters): string {
  const q = new URLSearchParams();
  if (f.category && f.category !== 'all') q.set('category', f.category);
  if (f.from) q.set('from', f.from);
  if (f.to)   q.set('to', f.to);
  const s = q.toString();
  return s ? `?${s}` : '';
}

export const expensesApi = {
  getAll: (filters: ExpenseFilters = {}) =>
    request<Expense[]>(`/api/expenses${toParams(filters)}`),

  create: (payload: CreateExpensePayload) =>
    request<Expense>('/api/expenses', { method: 'POST', body: JSON.stringify(payload) }),

  update: (id: number, payload: UpdateExpensePayload) =>
    request<Expense>(`/api/expenses/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),

  delete: (id: number) =>
    request<void>(`/api/expenses/${id}`, { method: 'DELETE' }),
};