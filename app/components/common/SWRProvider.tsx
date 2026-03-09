'use client';

import { SWRConfig } from 'swr';

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    const info = await res.json().catch(() => ({}));
    const err = Object.assign(new Error(info.error ?? `HTTP ${res.status}`), {
      status: res.status,
      info,
    });
    throw err;
  }
  return res.json();
};

export function SWRProvider({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig
      value={{
        fetcher,
        revalidateOnFocus: false,
        revalidateOnReconnect: true,
        shouldRetryOnError: true,
        errorRetryCount: 3,
        errorRetryInterval: 2000,
        isPaused: () => typeof navigator !== 'undefined' && !navigator.onLine,
      }}
    >
      {children}
    </SWRConfig>
  );
}
