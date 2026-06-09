import { TaskStatus } from '../types/task';

export type Filter = 'all' | TaskStatus;

interface Props {
  active: Filter;
  onChange: (filter: Filter) => void;
}

const FILTERS: { label: string; value: Filter }[] = [
  { label: 'All', value: 'all' },
  { label: 'To Do', value: 'todo' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Done', value: 'done' },
];

export function FilterTabs({ active, onChange }: Props) {
  return (
    <div className="flex gap-2 mb-4" data-testid="filter-tabs">
      {FILTERS.map(({ label, value }) => (
        <button
          key={value}
          onClick={() => onChange(value)}
          data-testid={`filter-${value}`}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
            active === value
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}