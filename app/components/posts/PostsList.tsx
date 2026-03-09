'use client';

import { memo } from 'react';
import { useLanguage } from '@/app/hooks/useLanguage';
import { usePosts } from '@/app/hooks/usePosts';
import PostsFilter from './PostsFilter';
import PostsGrid from './PostsGrid';
import DeleteModal from '../common/DeleteModal';
import { SuccessToast } from '../common/SuccessToast';

const MemoizedFilter = memo(PostsFilter);

export default function PostsList() {
  const { t } = useLanguage();
  const {
    posts,
    isFirstLoad,
    loadingMore,
    error,
    filterValue,
    setFilterValue,
    sentinelRef,
    postToDelete,
    setPostToDelete,
    deletingId,
    successToast,
    handleDelete,
  } = usePosts();

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <MemoizedFilter
        filterValue={filterValue}
        onFilterValueChange={setFilterValue}
      />
      <PostsGrid
        posts={posts}
        loading={isFirstLoad}
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

      {postToDelete !== null && (
        <DeleteModal
          onConfirm={() => handleDelete(postToDelete)}
          onCancel={() => setPostToDelete(null)}
        />
      )}
      <SuccessToast show={successToast} message={t.postDeleted} />
    </div>
  );
}
