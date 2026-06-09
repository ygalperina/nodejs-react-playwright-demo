interface Props {
  from: string;
  to: string;
  onFromChange: (v: string) => void;
  onToChange: (v: string) => void;
  onClear: () => void;
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export function DateRangeFilter({ from, to, onFromChange, onToChange, onClear }: Props) {
  const hasFilter = DATE_RE.test(from) || DATE_RE.test(to);
  return (
    <div className="flex items-center gap-2 mb-4 flex-wrap" data-testid="date-range-filter">
      <span className="text-sm text-gray-500">Date:</span>
      <input
        type="date" value={from} onChange={(e) => onFromChange(e.target.value)}
        className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
        data-testid="date-from-input" aria-label="From date"
      />
      <span className="text-gray-400 text-sm">–</span>
      <input
        type="date" value={to} onChange={(e) => onToChange(e.target.value)}
        className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
        data-testid="date-to-input" aria-label="To date"
      />
      {hasFilter && (
        <button
          onClick={onClear}
          className="text-xs text-gray-500 hover:text-red-500 transition-colors"
          data-testid="clear-date-filter"
        >
          Clear
        </button>
      )}
    </div>
  );
}