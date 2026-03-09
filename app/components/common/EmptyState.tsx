'use client';

import { useLanguage } from '@/app/hooks/useLanguage';
import Image from 'next/image';

export default function EmptyState() {
  const { t } = useLanguage();

  return (
    <div className="flex min-h-0 flex-1 flex-col items-center justify-center py-12">
      <div className="mb-6 relative w-64 h-64">
        <Image
          src="/empty-state.svg"
          alt=""
          fill
          className="object-contain"
        />
      </div>
      <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
        {t.noResultsFound}
      </h3>
      <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
        {t.noPostsMessage}
      </p>
    </div>
  );
}