'use client';

import Link from 'next/link';
import { Search } from 'lucide-react';
import { useLanguage } from '@/app/hooks/useLanguage';
import { useWriters } from '@/app/hooks/useWriters';
import type { Writer } from '@/app/types';
import LoadingOverlay from '@/app/components/common/LoadingOverlay';
import EmptyState from '../components/common/EmptyState';

function WriterCard({ writer }: { writer: Writer }) {
  const initials = writer.name
    .split(' ')
    .map((n: string) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <Link
      href={`/writers/${writer.id}?from=writers`}
      className="flex items-center gap-4 p-4 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md hover:border-brand-300 dark:hover:border-brand-400 transition-all"
    >
      <div className="w-12 h-12 rounded-full bg-brand-500 flex items-center justify-center text-white text-sm font-bold shrink-0 ring-2 ring-brand-100 dark:ring-brand-900">
        {initials}
      </div>
      <div className="min-w-0">
        <p className="font-semibold text-slate-800 dark:text-slate-100 truncate">{writer.name}</p>
        <p className="text-sm text-gray-400 truncate">@{writer.username}</p>
        <p className="text-xs text-gray-400 truncate">{writer.email}</p>
      </div>
    </Link>
  );
}

export default function WritersPage() {
  const { t } = useLanguage();
  const { writers, isFirstLoad, loadingMore, isValidating, search, setSearch, sentinelRef } =
    useWriters();

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6">
        {t.writers}
      </h1>

      <div className="mb-6">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.searchWriters}
            className="w-full pl-9 pr-3 py-2.5 border border-slate-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-slate-800 dark:text-slate-100 placeholder:text-gray-400 focus:outline-none focus:border-brand-500 dark:focus:border-brand-400"
          />
        </div>
      </div>

      {isFirstLoad && <LoadingOverlay />}

      {!isFirstLoad && writers.length === 0 && !isValidating && <EmptyState />}

      {writers.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {writers.map((writer) => (
            <WriterCard key={writer.id} writer={writer} />
          ))}
        </div>
      )}

      <div ref={sentinelRef} />

      {loadingMore && (
        <p className="text-center py-6 text-sm text-gray-400 dark:text-gray-500">
          {t.loadingMore}
        </p>
      )}
    </main>
  );
}
