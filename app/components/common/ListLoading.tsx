'use client';

import { useLanguage } from '@/app/hooks/useLanguage';
import Image from 'next/image';

export default function ListLoading() {
  const { t } = useLanguage();

  return (
    <div className="flex min-h-[200px] flex-1 flex-col items-center justify-center py-12">
      <Image
        src="/3-dots-bounce.svg"
        alt=""
        width={48}
        height={48}
        className="mb-3"
      />
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t.loading}</p>
    </div>
  );
}
