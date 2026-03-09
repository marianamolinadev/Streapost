'use client';

import { Search } from 'lucide-react';
import { useLanguage } from '@/app/hooks/useLanguage';

interface PostsFilterProps {
  filterValue: string;
  onFilterValueChange: (value: string) => void;
}

export default function PostsFilter({
  filterValue,
  onFilterValueChange,
}: PostsFilterProps) {
  const { t } = useLanguage();

  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:gap-4">
      <div className="relative flex-1 w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          value={filterValue}
          onChange={(e) => onFilterValueChange(e.target.value)}
          placeholder={t.filterByNameUsernameEmailId}
          autoComplete="off"
          className="w-full pl-9 pr-3 py-2.5 border border-slate-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-slate-800 dark:text-slate-100 placeholder:text-gray-400 focus:outline-none focus:border-brand-500 dark:focus:border-brand-400"
        />
      </div>
      {filterValue && (
        <button
          onClick={() => onFilterValueChange('')}
          className="px-4 py-2.5 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 text-slate-700 dark:text-slate-300 font-medium transition-colors shrink-0"
        >
          {t.clear}
        </button>
      )}
    </div>
  );
}