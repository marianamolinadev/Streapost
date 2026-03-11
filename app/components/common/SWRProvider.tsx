'use client';

import { SWRConfig } from 'swr';
import { getApiResponse, putApiResponse } from '@/lib/offline/db';

const fetcher = async (url: string) => {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      const info = await res.json().catch(() => ({}));
      const err = Object.assign(new Error(info.error ?? `HTTP ${res.status}`), {
        status: res.status,
        info,
      });
      throw err;
    }
    const data = await res.json();
    if (typeof navigator !== 'undefined' && navigator.onLine) {
      putApiResponse(url, data).catch(() => {});
    }
    return data;
  } catch (e) {
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      const cached = await getApiResponse<unknown>(url);
      if (cached) return cached;
    }
    throw e;
  }
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
