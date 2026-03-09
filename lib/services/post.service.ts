import { prisma } from '@/lib/prisma';

const POSTS_LIMIT = 50;

const userSelect = {
  id: true,
  name: true,
  username: true,
  email: true,
  company: true,
  city: true,
} as const;

export async function getPosts(options: {
  author?: string;
  cursor?: number;
}) {
  const { author, cursor } = options;
  const orConditions: object[] = [];

  if (author) {
    orConditions.push(
      { user: { name: { contains: author } } },
      { user: { username: { contains: author } } },
      { user: { email: { contains: author } } },
    );
    const authorId = parseInt(author, 10);
    if (!isNaN(authorId)) orConditions.push({ userId: authorId });
  }

  const posts = await prisma.post.findMany({
    where: {
      ...(cursor ? { id: { gt: cursor } } : {}),
      ...(orConditions.length > 0 ? { OR: orConditions } : {}),
    },
    include: { user: { select: userSelect } },
    orderBy: { id: 'asc' },
    take: POSTS_LIMIT,
  });

  const nextCursor = posts.length === POSTS_LIMIT ? posts[posts.length - 1].id : null;
  return { posts, nextCursor };
}

export async function getPostById(id: number) {
  return prisma.post.findUnique({
    where: { id },
    include: { user: { select: userSelect } },
  });
}

export async function deletePost(id: number) {
  await prisma.post.delete({ where: { id } });
}
