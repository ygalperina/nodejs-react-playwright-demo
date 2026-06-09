import { useState } from 'react';
import { EXPENSE_CATEGORIES, ExpenseCategory, CreateExpensePayload } from '../types/expense';

interface Props {
  onSubmit: (payload: CreateExpensePayload) => void;
}

const CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  food: 'Food', transport: 'Transport', housing: 'Housing',
  entertainment: 'Entertainment', health: 'Health', other: 'Other',
};

const today = new Date().toISOString().split('T')[0];

export function ExpenseForm({ onSubmit }: Props) {
  const [amount, setAmount]     = useState('');
  const [title, setTitle]       = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('food');
  const [date, setDate]         = useState(today);
  const [notes, setNotes]       = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !amount || Number(amount) <= 0) return;
    onSubmit({ title: title.trim(), amount: Number(amount), category, date, notes });
    setAmount(''); setTitle(''); setCategory('food'); setDate(today); setNotes('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-4 mb-6" data-testid="expense-form">
      <h2 className="text-lg font-semibold mb-3">Add Expense</h2>
      <div className="grid grid-cols-2 gap-2 mb-2">
        <input
          type="number" step="0.01" min="0.01" placeholder="Amount"
          value={amount} onChange={(e) => setAmount(e.target.value)}
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          data-testid="expense-amount-input" required
        />
        <input
          type="text" placeholder="Title"
          value={title} onChange={(e) => setTitle(e.target.value)}
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          data-testid="expense-title-input" required
        />
        <select
          value={category} onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          data-testid="expense-category-select"
        >
          {EXPENSE_CATEGORIES.map((c) => (
            <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>
          ))}
        </select>
        <input
          type="date" value={date} onChange={(e) => setDate(e.target.value)}
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          data-testid="expense-date-input" required
        />
      </div>
      <textarea
        placeholder="Notes (optional)" value={notes} onChange={(e) => setNotes(e.target.value)}
        className="w-full border rounded px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none"
        rows={2} data-testid="expense-notes-input"
      />
      <button
        type="submit"
        className="bg-emerald-500 text-white px-4 py-2 rounded hover:bg-emerald-600 transition-colors"
        data-testid="add-expense-button"
      >
        Add Expense
      </button>
    </form>
  );
}