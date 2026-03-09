'use client';

import { usePathname } from 'next/navigation';
import { useLanguage } from '@/app/hooks/useLanguage';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import type { Post } from '@/app/types';
import PostCardMenu from './PostCardMenu';

interface PostCardProps {
  post: Post;
  onDeleteClick: () => void;
  isDeleting?: boolean;
}

export default function PostCard({ post, onDeleteClick, isDeleting = false }: PostCardProps) {
  const { t } = useLanguage();
  const pathname = usePathname();
  const user = post.user;
  const from = pathname === '/' ? 'home' : 'posts';

  return (
    <div className={`relative flex min-h-0 min-w-0 flex-col bg-white dark:bg-gray-900 shadow-sm border border-slate-200 dark:border-gray-700 rounded-lg w-full p-4 sm:p-6 transition-all duration-300 ${isDeleting ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
      <div className="flex justify-between items-center gap-2 mb-4 min-w-0">
        {user?.company ? (
          <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs font-medium rounded truncate min-w-0">
            {user.company}
          </span>
        ) : (
          <span />
        )}
        <div className="flex items-center gap-2 shrink-0 min-w-0">
          {user?.city && (
            <span className="text-xs text-gray-600 dark:text-gray-400 truncate">
              {user.city}
            </span>
          )}
          <PostCardMenu onDeleteClick={onDeleteClick} />
        </div>
      </div>

      <h5 className="text-slate-800 dark:text-slate-100 text-lg sm:text-xl font-bold mb-3 leading-snug break-words">
        {post.title}
      </h5>

      <p className="text-slate-600 dark:text-slate-400 leading-normal font-light mb-4 line-clamp-3">
        {post.body}
      </p>

      <div className="flex justify-between items-center mt-auto pt-4 border-t border-slate-100 dark:border-gray-800">
        <div className="flex items-center gap-2">
          {user && (
            <>
              <div className="h-8 w-8 rounded-full bg-slate-600 dark:bg-gray-600 flex items-center justify-center shrink-0">
                <span className="text-white text-xs font-semibold">
                  {user.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()}
                </span>
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                {user.name}
              </span>
            </>
          )}
        </div>
        <Link
          href={`/posts/${post.id}?from=${from}`}
          className="text-brand-500 dark:text-brand-400 font-semibold text-sm hover:underline flex items-center"
        >
          {t.readMore}
          <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
