import PostsList from '@/app/components/posts/PostsList';
import WritersSidebar from '@/app/components/writers/WritersSidebar';

export default function PostsPage() {
  return (
    <div className="container mx-auto px-4 py-8 pb-24 sm:px-6 lg:px-8 xl:pb-8">
      <div className="flex flex-col gap-8 xl:flex-row xl:items-start">
        <main className="flex min-h-[calc(100vh-5rem)] min-w-0 flex-1 flex-col">
          <PostsList />
        </main>
        <aside className="hidden shrink-0 xl:block xl:w-60 2xl:w-72 sticky top-6">
          <WritersSidebar />
        </aside>
      </div>
    </div>
  );
}
