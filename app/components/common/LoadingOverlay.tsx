'use client';

import { useLanguage } from '@/app/hooks/useLanguage';
import Image from 'next/image';

export default function LoadingOverlay() {
  const { t } = useLanguage();

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/60">
      <Image
        src="/3-dots-bounce.svg"
        alt=""
        width={48}
        height={48}
        className="mb-3"
      />
      <p className="text-white text-sm font-medium">{t.loading}</p>
    </div>
  );
}
