export const EXPENSE_CATEGORIES = ['food', 'transport', 'housing', 'entertainment', 'health', 'other'] as const;
export type ExpenseCategory = typeof EXPENSE_CATEGORIES[number];

export interface Expense {
  id: number;
  title: string;
  amount: number;
  category: ExpenseCategory;
  date: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface CreateExpensePayload {
  title: string;
  amount: number;
  category: ExpenseCategory;
  date: string;
  notes?: string;
}

export interface UpdateExpensePayload {
  title?: string;
  amount?: number;
  category?: ExpenseCategory;
  date?: string;
  notes?: string;
}