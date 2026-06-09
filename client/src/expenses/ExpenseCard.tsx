import { Expense, ExpenseCategory } from '../types/expense';

interface Props {
  expense: Expense;
  onDelete: (id: number) => void;
}

const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  food: 'bg-orange-100 text-orange-700',
  transport: 'bg-blue-100 text-blue-700',
  housing: 'bg-purple-100 text-purple-700',
  entertainment: 'bg-pink-100 text-pink-700',
  health: 'bg-green-100 text-green-700',
  other: 'bg-gray-100 text-gray-700',
};

function formatDate(d: string) {
  return new Date(`${d}T00:00:00`).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

export function ExpenseCard({ expense, onDelete }: Props) {
  return (
    <div
      className="bg-white rounded-lg shadow p-4 flex items-start justify-between gap-3"
      data-testid="expense-card"
      data-expense-id={expense.id}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className="font-semibold text-gray-900" data-testid="expense-amount">
            ${expense.amount.toFixed(2)}
          </span>
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full ${CATEGORY_COLORS[expense.category]}`}
            data-testid="expense-category"
          >
            {expense.category}
          </span>
          <span className="text-xs text-gray-400" data-testid="expense-date">
            {formatDate(expense.date)}
          </span>
        </div>
        <p className="text-sm text-gray-700 truncate" data-testid="expense-title">
          {expense.title}
        </p>
        {expense.notes && (
          <p className="text-xs text-gray-400 mt-0.5 truncate" data-testid="expense-notes">
            {expense.notes}
          </p>
        )}
      </div>
      <button
        onClick={() => onDelete(expense.id)}
        className="text-gray-400 hover:text-red-500 transition-colors shrink-0"
        data-testid="delete-expense-button"
        aria-label="Delete expense"
      >
        ✕
      </button>
    </div>
  );
}