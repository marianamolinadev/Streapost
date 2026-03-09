'use client';

import { ChevronDown } from 'lucide-react';
import { useLanguage } from '@/app/hooks/useLanguage';
import PostsList from '@/app/components/posts/PostsList';

export default function HomePage() {
  const { t } = useLanguage();

  return (
    <>
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <span className="mb-6 px-4 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-sm font-medium rounded-full">
          {t.blog}
        </span>

        <h1 className="text-5xl font-bold text-slate-800 dark:text-slate-100 mb-4 leading-tight">
          {t.welcomeToStreapost}
        </h1>

        <p className="text-lg text-slate-500 dark:text-slate-400 max-w-xl mb-10">
          {t.explorePostsFromOurCommunity}
        </p>

        <a
          href="#posts"
          className="flex flex-col items-center gap-2 text-sm text-gray-400 dark:text-gray-500 hover:text-brand-500 dark:hover:text-brand-400 transition-colors animate-bounce"
        >
          {t.scrollToExplore}
          <ChevronDown size={20} />
        </a>
      </section>

      <section id="posts" className="container mx-auto px-4 py-12">
        <PostsList />
      </section>
    </>
  );
}
