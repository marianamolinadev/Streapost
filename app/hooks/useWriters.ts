'use client';

import { useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react';
import useSWRInfinite from 'swr/infinite';
import { useLanguage } from '@/app/hooks/useLanguage';
import type { Writer, WritersResponse } from '@/app/types';

export function useWriters() {
  const { lang } = useLanguage();
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => { setIsMounted(true); }, []);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const getKey = useCallback(
    (pageIndex: number, previousPageData: WritersResponse | null): string | null => {
      if (previousPageData && previousPageData.nextCursor === null) return null;
      const params = new URLSearchParams({ lang });
      if (debouncedSearch) params.set('search', debouncedSearch);
      if (pageIndex > 0 && previousPageData?.nextCursor != null)
        params.set('cursor', String(previousPageData.nextCursor));
      return `/api/users?${params}`;
    },
    [lang, debouncedSearch],
  );

  const { data, size, setSize, isLoading, isValidating } =
    useSWRInfinite<WritersResponse>(getKey, {
      revalidateFirstPage: false,
      keepPreviousData: true,
    });

  const writers: Writer[] = data ? data.flatMap((p) => p.users) : [];
  const lastPage = data?.[data.length - 1];
  const hasMore = lastPage ? lastPage.nextCursor !== null : true;
  const isFirstLoad = isLoading && !data;
  const loadingMore = isMounted && !!data && isValidating && size > (data?.length ?? 0);

  const loadMore = useCallback(() => {
    if (hasMore && !isValidating) setSize((s) => s + 1);
  }, [hasMore, isValidating, setSize]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) loadMore(); },
      { rootMargin: '200px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [loadMore]);

  return {
    writers,
    isFirstLoad,
    isMounted,
    loadingMore,
    isValidating,
    search,
    setSearch,
    sentinelRef,
  };
}
