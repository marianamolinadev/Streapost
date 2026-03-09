'use client';

import { useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { X, Users, Search } from 'lucide-react';
import type { Writer } from '@/app/types';
import { useLanguage } from '@/app/hooks/useLanguage';
import { useWriters } from '@/app/hooks/useWriters';
import { useIsClient } from '@/app/hooks/useIsClient';

function WriterItem({ writer, onClick }: { writer: Writer; onClick?: () => void }) {
  const initials = writer.name
    .split(' ')
    .map((n: string) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <Link
      href={`/writers/${writer.id}?from=posts`}
      onClick={onClick}
      className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
    >
      <div className="w-9 h-9 rounded-full bg-brand-500 flex items-center justify-center text-white text-xs font-semibold shrink-0">
        {initials}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate">
          {writer.name}
        </p>
        <p className="text-xs text-gray-400 truncate">@{writer.username}</p>
      </div>
    </Link>
  );
}

export default function WritersSidebar() {
  const [open, setOpen] = useState(false);
  const isClient = useIsClient();
  const { t } = useLanguage();
  const { writers, search, setSearch } = useWriters();

  const list = (
    <div className="space-y-1">
      {writers.map((writer) => (
        <WriterItem key={writer.id} writer={writer} onClick={() => setOpen(false)} />
      ))}
    </div>
  );

  const searchInput = (
    <div className="relative mb-3">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={t.searchWriters}
        className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-slate-800 dark:text-slate-100 placeholder:text-gray-400 focus:outline-none focus:border-brand-500 dark:focus:border-brand-400"
      />
    </div>
  );

  return (
    <>
      <div>
        <h2 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
          {t.writers}
        </h2>
        {searchInput}
        {writers.length === 0 ? (
          <p className="text-xs text-gray-500 dark:text-gray-400 py-2">
            {t.noResultsFound}
          </p>
        ) : (
          list
        )}
      </div>

      {isClient &&
        createPortal(
          <>
            <button
              onClick={() => setOpen(true)}
              className="xl:hidden fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-full shadow-lg font-medium text-sm transition-colors"
            >
              <Users size={16} />
              {t.writers}
            </button>

            {open && (
              <div
                className="xl:hidden fixed inset-0 z-40 bg-black/40 animate-fade-in"
                onClick={() => setOpen(false)}
              />
            )}

            <div
              className={`xl:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 rounded-t-2xl shadow-xl transition-transform duration-[350ms] ease-[cubic-bezier(0.32,0.72,0,1)] ${
                open ? 'translate-y-0' : 'translate-y-full'
              }`}
            >
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
              </div>
              <div className="px-6 pb-8 max-h-[70vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-semibold text-slate-800 dark:text-slate-100">
                    {t.writers}
                  </h2>
                  <button
                    onClick={() => setOpen(false)}
                    className="p-1 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
                {searchInput}
                {writers.length === 0 ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400 py-4">
                    {t.noResultsFound}
                  </p>
                ) : (
                  list
                )}
              </div>
            </div>
          </>,
          document.body
        )}
    </>
  );
}
