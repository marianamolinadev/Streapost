'use client';

import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import useSWR from 'swr';
import { useLanguage } from '@/app/hooks/useLanguage';
import type { Post } from '@/app/types';
import LoadingOverlay from '@/app/components/common/LoadingOverlay';

export default function PostPage() {
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const from = searchParams.get('from') || 'posts';
  const { t } = useLanguage();

  const { data: post, error, isLoading } = useSWR<Post>(
    id ? `/api/posts/${id}` : null,
  );

  const isNotFound = error?.status === 404 || error?.status === 400;

  if (isLoading) {
    return <LoadingOverlay />;
  }

  if (isNotFound || (!isLoading && !post)) {
    return (
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-brand-500 dark:hover:text-brand-400 mb-8"
        >
          <ArrowLeft size={16} />
          {t.back}
        </Link>
        <p className="text-gray-500 dark:text-gray-400 mt-8">{t.postNotFound}</p>
      </main>
    );
  }

  const backHref = from === 'home' ? '/#posts' : '/posts';

  return (
    <main className="container mx-auto px-4 py-8 max-w-2xl">
      <Link
        href={backHref}
        className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-brand-500 dark:hover:text-brand-400 mb-8"
      >
        <ArrowLeft size={16} />
        {t.back}
      </Link>

      {post && (
        <article>
          {post.user && (
            <Link
              href={`/writers/${post.user.id}?from=posts`}
              className="flex w-full items-center rounded-lg p-3 mb-6 transition-all hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              <div className="mr-4 shrink-0">
                <div className="h-12 w-12 rounded-full bg-brand-500 flex items-center justify-center ring-2 ring-brand-300 dark:ring-brand-700">
                  <span className="text-white font-bold text-sm select-none">
                    {post.user.name.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase()}
                  </span>
                </div>
              </div>
              <div>
                <h6 className="text-slate-800 dark:text-slate-100 font-medium">
                  {post.user.name}
                </h6>
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                  @{post.user.username} · {post.user.email}
                </p>
              </div>
            </Link>
          )}

          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-6 capitalize">
            {post.title}
          </h1>

          <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-base">
            {post.body}
          </p>
        </article>
      )}
    </main>
  );
}
