import type { Post } from '@/app/types';
import PostCard from './PostCard';
import LoadingOverlay from '../common/LoadingOverlay';
import EmptyState from '../common/EmptyState';

interface PostsGridProps {
  posts: Post[];
  loading: boolean;
  error: string | null;
  onDeleteClick: (id: number) => void;
  deletingId?: number | null;
}

export default function PostsGrid({ posts, loading, error, onDeleteClick, deletingId }: PostsGridProps) {
  if (loading) {
    return <LoadingOverlay />;
  }

  if (error) {
    return <div className="bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-4 rounded-lg mb-4">{error}</div>;
  }

  if (posts.length === 0) {
    return (
      <div className="flex min-h-0 flex-1 flex-col">
        <EmptyState />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
      {posts.map(post => (
        <PostCard
          key={post.id}
          post={post}
          onDeleteClick={() => onDeleteClick(post.id)}
          isDeleting={deletingId === post.id}
        />
      ))}
    </div>
  );
}
