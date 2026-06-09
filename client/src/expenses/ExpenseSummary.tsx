import { useMemo } from 'react';
import { Expense, EXPENSE_CATEGORIES, ExpenseCategory } from '../types/expense';

const LABELS: Record<ExpenseCategory, string> = {
  food: 'Food', transport: 'Transport', housing: 'Housing',
  entertainment: 'Entertainment', health: 'Health', other: 'Other',
};

export function ExpenseSummary({ expenses }: { expenses: Expense[] }) {
  const { total, byCategory } = useMemo(() => {
    const tot = expenses.reduce((s, e) => s + e.amount, 0);
    const byCat = EXPENSE_CATEGORIES.reduce((acc, cat) => {
      acc[cat] = expenses.filter((e) => e.category === cat).reduce((s, e) => s + e.amount, 0);
      return acc;
    }, {} as Record<ExpenseCategory, number>);
    return { total: tot, byCategory: byCat };
  }, [expenses]);

  const active = EXPENSE_CATEGORIES.filter((c) => byCategory[c] > 0);

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4" data-testid="expense-summary">
      <div className="flex items-baseline justify-between mb-2">
        <span className="font-semibold text-gray-600 text-sm">Total</span>
        <span className="text-2xl font-bold text-emerald-600" data-testid="summary-total">
          ${total.toFixed(2)}
        </span>
      </div>
      {active.length > 0 && (
        <div className="flex flex-col gap-1 pt-2 border-t">
          {active.map((cat) => (
            <div key={cat} className="flex justify-between text-sm">
              <span className="text-gray-500">{LABELS[cat]}</span>
              <span className="font-medium text-gray-700" data-testid={`summary-category-${cat}`}>
                ${byCategory[cat].toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}