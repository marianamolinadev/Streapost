'use client';

import { useState, useEffect } from 'react';
import { WifiOff, Wifi } from 'lucide-react';
import { useOnlineStatus } from '@/app/hooks/useOnlineStatus';
import { useLanguage } from '@/app/hooks/useLanguage';

type BannerState = 'hidden' | 'offline' | 'back-online';

export function OfflineBanner() {
  const isOnline = useOnlineStatus();
  const { t } = useLanguage();
  const [banner, setBanner] = useState<BannerState>('hidden');

  useEffect(() => {
    if (!isOnline) {
      setBanner('offline');
    } else if (banner === 'offline') {
      setBanner('back-online');
      const timer = setTimeout(() => setBanner('hidden'), 3000);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOnline]);

  if (banner === 'hidden') return null;

  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2.5 text-white text-sm font-medium rounded-full shadow-lg transition-colors ${
        banner === 'offline'
          ? 'bg-slate-900 dark:bg-slate-700 border border-slate-700 dark:border-slate-600'
          : 'bg-green-600 dark:bg-green-500'
      }`}
    >
      {banner === 'offline' ? (
        <WifiOff size={15} className="shrink-0 text-orange-400" />
      ) : (
        <Wifi size={15} className="shrink-0" />
      )}
      <span>{banner === 'offline' ? t.youreOffline : t.backOnline}</span>
    </div>
  );
}
