import { EXPENSE_CATEGORIES, ExpenseCategory } from '../types/expense';

export type CategorySelection = 'all' | ExpenseCategory;

interface Props {
  active: CategorySelection;
  onChange: (v: CategorySelection) => void;
}

const LABELS: Record<CategorySelection, string> = {
  all: 'All', food: 'Food', transport: 'Transport', housing: 'Housing',
  entertainment: 'Entertainment', health: 'Health', other: 'Other',
};

export function CategoryFilter({ active, onChange }: Props) {
  const options: CategorySelection[] = ['all', ...EXPENSE_CATEGORIES];
  return (
    <div className="flex flex-wrap gap-2 mb-3" data-testid="category-filter">
      {options.map((c) => (
        <button
          key={c}
          onClick={() => onChange(c)}
          data-testid={`category-filter-${c}`}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            active === c ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {LABELS[c]}
        </button>
      ))}
    </div>
  );
}