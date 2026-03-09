'use client';

import Link from 'next/link';
import { useLanguage } from '@/app/hooks/useLanguage';

export default function NotFound() {
  const { t } = useLanguage();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <p className="text-8xl font-bold text-brand-500 dark:text-brand-400 mb-4">404</p>
      <h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-2">
        {t.notFoundTitle}
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">
        {t.notFoundMessage}
      </p>
      <Link
        href="/"
        className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-lg transition-colors disabled:opacity-70"
      >
        {t.goBackHome}
      </Link>
    </main>
  );
}
