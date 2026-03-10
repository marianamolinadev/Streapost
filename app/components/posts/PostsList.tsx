'use client';

import { memo } from 'react';
import { useLanguage } from '@/app/hooks/useLanguage';
import { usePosts } from '@/app/hooks/usePosts';
import PostsFilter from './PostsFilter';
import PostsGrid from './PostsGrid';
import DeleteModal from '../common/DeleteModal';
import LoadingOverlay from '../common/LoadingOverlay';
import { SuccessToast } from '../common/SuccessToast';
import { ErrorToast } from '../common/ErrorToast';

const MemoizedFilter = memo(PostsFilter);

export default function PostsList() {
  const { t } = useLanguage();
  const {
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
    deletingInProgress,
    successToast,
    errorToast,
    handleDelete,
  } = usePosts();

  // Show loading until mounted (server/client match) or while first load. Avoids hydration
  // mismatch and prevents EmptyState from flashing before the overlay.
  const showLoading = !isMounted || isFirstLoad;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <MemoizedFilter
        filterValue={filterValue}
        onFilterValueChange={setFilterValue}
      />
      <PostsGrid
        posts={posts}
        loading={showLoading}
        isFilterLoading={isValidating && !loadingMore}
        error={error ? t.failedToFetchPosts : null}
        onDeleteClick={setPostToDelete}
        deletingId={deletingId}
      />

      <div ref={sentinelRef} />

      {loadingMore && (
        <p className="text-center py-6 text-sm text-gray-400 dark:text-gray-500">
          {t.loadingMore}
        </p>
      )}

      {deletingInProgress !== null && <LoadingOverlay />}
      {postToDelete !== null && (
        <DeleteModal
          onConfirm={() => handleDelete(postToDelete)}
          onCancel={() => setPostToDelete(null)}
        />
      )}
      <SuccessToast show={successToast} message={t.postDeleted} />
      <ErrorToast show={errorToast} message={t.failedToDeletePost} />
    </div>
  );
}
