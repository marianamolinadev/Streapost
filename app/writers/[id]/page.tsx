'use client';

import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Building2, MapPin, Mail, Globe, Phone } from 'lucide-react';
import useSWR from 'swr';
import { useLanguage } from '@/app/hooks/useLanguage';
import { usePosts } from '@/app/hooks/usePosts';
import type { Writer } from '@/app/types';
import PostsGrid from '@/app/components/posts/PostsGrid';
import DeleteModal from '@/app/components/common/DeleteModal';
import LoadingOverlay from '@/app/components/common/LoadingOverlay';
import { SuccessToast } from '@/app/components/common/SuccessToast';

export default function WriterPage() {
  const { lang, t } = useLanguage();
  const { id } = useParams();
  const searchParams = useSearchParams();
  const from = searchParams.get('from') === 'writers' ? 'writers' : 'posts';
  const backHref = from === 'writers' ? '/writers' : '/posts';
  const backLabel = from === 'writers' ? t.backToWriters : t.backToPosts;

  const { data: writer, error: writerError, isLoading: writerLoading } =
    useSWR<Writer>(id ? `/api/users/${id}?lang=${lang}` : null);

  const {
    posts,
    isFirstLoad: isFirstPostsLoad,
    loadingMore: loadingMorePosts,
    error: postsError,
    sentinelRef,
    postToDelete,
    setPostToDelete,
    deletingId,
    successToast,
    handleDelete,
  } = usePosts({ author: id ? String(id) : '' });

  const initials = writer
    ? writer.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : '';

  return (
    <main className="container mx-auto px-4 py-8">
      <Link
        href={backHref}
        className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-brand-500 dark:hover:text-brand-400 transition-colors mb-8"
      >
        <ArrowLeft size={16} />
        {backLabel}
      </Link>

      {writerLoading && <LoadingOverlay />}
      {writerError && <p className="text-red-500 mb-4">{writerError.message}</p>}

      {writer && (
        <>
          <div className="flex flex-col sm:flex-row items-start gap-5 mb-10 p-6 bg-white dark:bg-gray-900 rounded-xl border border-slate-200 dark:border-gray-700 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-brand-500 flex items-center justify-center text-white text-xl font-bold shrink-0 ring-4 ring-brand-100 dark:ring-brand-900">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{writer.name}</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">@{writer.username}</p>
              <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
                {writer.email && (
                  <span className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Mail size={14} className="shrink-0" />
                    <span className="truncate">{writer.email}</span>
                  </span>
                )}
                {writer.company && (
                  <span className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Building2 size={14} className="shrink-0" />
                    {writer.company}
                  </span>
                )}
                {writer.city && (
                  <span className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <MapPin size={14} className="shrink-0" />
                    {writer.city}
                  </span>
                )}
                {writer.phone && (
                  <span className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Phone size={14} className="shrink-0" />
                    {writer.phone}
                  </span>
                )}
                {writer.website && (
                  <a
                    href={writer.website.startsWith('http') ? writer.website : `http://${writer.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-brand-500 dark:text-brand-400 hover:underline"
                  >
                    <Globe size={14} className="shrink-0" />
                    <span className="truncate">{writer.website}</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">Posts</h2>
          <PostsGrid
            posts={posts}
            loading={isFirstPostsLoad}
            error={postsError ? t.failedToFetchPosts : null}
            onDeleteClick={setPostToDelete}
            deletingId={deletingId}
          />

          <div ref={sentinelRef} />

          {loadingMorePosts && (
            <p className="text-center py-6 text-sm text-gray-400 dark:text-gray-500">
              {t.loadingMore}
            </p>
          )}
        </>
      )}

      {postToDelete !== null && (
        <DeleteModal
          onConfirm={() => handleDelete(postToDelete)}
          onCancel={() => setPostToDelete(null)}
        />
      )}
      <SuccessToast show={successToast} message={t.postDeleted} />
    </main>
  );
}
