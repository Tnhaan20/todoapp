import type { FilterType } from '../../types/task';

const FILTERS: { label: string; value: FilterType }[] = [
  { label: 'All',       value: 'all' },
  { label: 'Active',    value: 'active' },
  { label: 'Completed', value: 'completed' },
];

interface Props {
  current: FilterType;
  onChange: (filter: FilterType) => void;
  activeCount: number;
  completedCount: number;
}

const FilterTabs = ({ current, onChange, activeCount, completedCount }: Props) => {
  const counts: Record<FilterType, number | null> = {
    all: activeCount + completedCount,
    active: activeCount,
    completed: completedCount,
  };

  return (
    <div className="flex gap-1 rounded-xl bg-white/[0.04] border border-white/10 p-1">
      {FILTERS.map(({ label, value }) => {
        const count = counts[value];
        const isActive = current === value;
        return (
          <button
            key={value}
            onClick={() => onChange(value)}
            className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 cursor-pointer ${
              isActive
                ? 'bg-violet-500 text-white shadow-lg shadow-violet-500/25'
                : 'text-white/45 hover:text-white/75 hover:bg-white/5'
            }`}
          >
            <span>{label}</span>
            {count !== null && count > 0 && (
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none ${
                  isActive ? 'bg-white/20 text-white' : 'bg-white/10 text-white/50'
                }`}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default FilterTabs;
