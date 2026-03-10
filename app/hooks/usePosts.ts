'use client';

import { useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react';
import useSWRInfinite from 'swr/infinite';
import { useLanguage } from '@/app/hooks/useLanguage';
import type { Post, PostsResponse } from '@/app/types';

interface UsePostsOptions {
  author?: string;
}

export function usePosts({ author }: UsePostsOptions = {}) {
  const { lang } = useLanguage();
  const hasFixedAuthor = author !== undefined;

  const [filterValue, setFilterValue] = useState('');
  const [debouncedFilter, setDebouncedFilter] = useState('');

  const [isMounted, setIsMounted] = useState(false);
  const [postToDelete, setPostToDelete] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [successToast, setSuccessToast] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useLayoutEffect(() => { setIsMounted(true); }, []);

  useEffect(() => {
    if (hasFixedAuthor) return;
    const t = setTimeout(() => setDebouncedFilter(filterValue), 300);
    return () => clearTimeout(t);
  }, [filterValue, hasFixedAuthor]);

  const effectiveAuthor = hasFixedAuthor ? author : debouncedFilter;

  const getKey = useCallback(
    (pageIndex: number, previousPageData: PostsResponse | null): string | null => {
      if (hasFixedAuthor && !author) return null;
      if (previousPageData && previousPageData.nextCursor === null) return null;
      const params = new URLSearchParams({ lang });
      if (effectiveAuthor) params.set('author', effectiveAuthor);
      if (pageIndex > 0 && previousPageData?.nextCursor != null)
        params.set('cursor', String(previousPageData.nextCursor));
      return `/api/posts?${params}`;
    },
    [lang, effectiveAuthor, hasFixedAuthor, author],
  );

  const { data, error, size, setSize, isLoading, isValidating, mutate } =
    useSWRInfinite<PostsResponse>(getKey, {
      revalidateFirstPage: false,
      keepPreviousData: true,
    });

  const posts: Post[] = data ? data.flatMap((p) => p.posts) : [];
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

  const handleDelete = async (postId: number) => {
    setPostToDelete(null);
    setDeletingId(postId);

    // Wait for exit animation before removing from DOM
    await new Promise((r) => setTimeout(r, 300));

    mutate(
      (pages) =>
        pages?.map((page) => ({
          ...page,
          posts: page.posts.filter((p) => p.id !== postId),
        })),
      { revalidate: false },
    );
    setDeletingId(null);

    const res = await fetch(`/api/posts/${postId}?lang=${lang}`, { method: 'DELETE' });
    if (!res.ok) {
      mutate();
    } else {
      setSuccessToast(true);
      setTimeout(() => setSuccessToast(false), 3000);
    }
  };

  return {
    posts,
    isFirstLoad,
    isMounted,
    loadingMore,
    isValidating,
    error,
    filterValue,
    setFilterValue,
    sentinelRef,
    postToDelete,
    setPostToDelete,
    deletingId,
    successToast,
    handleDelete,
  };
}
