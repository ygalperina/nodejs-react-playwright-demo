import { useEffect, useState, useCallback } from 'react';
import { Expense, ExpenseCategory, CreateExpensePayload } from '../types/expense';
import { expensesApi, ExpenseFilters } from '../api/expenses';
import { ExpenseForm } from './ExpenseForm';
import { ExpenseCard } from './ExpenseCard';
import { ExpenseSummary } from './ExpenseSummary';
import { CategoryFilter, CategorySelection } from './CategoryFilter';
import { DateRangeFilter } from './DateRangeFilter';

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export function ExpensesView() {
  const [expenses, setExpenses]   = useState<Expense[]>([]);
  const [category, setCategory]   = useState<CategorySelection>('all');
  const [dateFrom, setDateFrom]   = useState('');
  const [dateTo, setDateTo]       = useState('');
  const [error, setError]         = useState<string | null>(null);

  const loadExpenses = useCallback(async () => {
    try {
      const filters: ExpenseFilters = {};
      if (category !== 'all')        filters.category = category as ExpenseCategory;
      if (DATE_RE.test(dateFrom))    filters.from = dateFrom;
      if (DATE_RE.test(dateTo))      filters.to = dateTo;
      setExpenses(await expensesApi.getAll(filters));
    } catch {
      setError('Failed to load expenses');
    }
  }, [category, dateFrom, dateTo]);

  useEffect(() => { loadExpenses(); }, [loadExpenses]);

  const handleCreate = async (payload: CreateExpensePayload) => {
    try {
      await expensesApi.create(payload);
      await loadExpenses();
    } catch {
      setError('Failed to add expense');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await expensesApi.delete(id);
      setExpenses((prev) => prev.filter((e) => e.id !== id));
    } catch {
      setError('Failed to delete expense');
    }
  };

  return (
    <div>
      {error && (
        <div className="bg-red-50 text-red-700 px-4 py-2 rounded mb-4" role="alert">
          {error}
          <button onClick={() => setError(null)} className="ml-2 font-bold">×</button>
        </div>
      )}

      <ExpenseForm onSubmit={handleCreate} />
      <ExpenseSummary expenses={expenses} />
      <CategoryFilter active={category} onChange={setCategory} />
      <DateRangeFilter
        from={dateFrom} to={dateTo}
        onFromChange={setDateFrom} onToChange={setDateTo}
        onClear={() => { setDateFrom(''); setDateTo(''); }}
      />

      <div className="flex flex-col gap-3" data-testid="expense-list">
        {expenses.length === 0 && (
          <p className="text-center text-gray-400 py-8" data-testid="expense-empty-state">
            No expenses yet. Add one above!
          </p>
        )}
        {expenses.map((expense) => (
          <ExpenseCard key={expense.id} expense={expense} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
}