import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getPosts, getPostById, deletePost } from '../post.service';

vi.mock('@/lib/prisma', () => ({
  prisma: {
    post: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

const { prisma } = await import('@/lib/prisma');

const mockPost = {
  id: 1,
  userId: 1,
  title: 'Test Post',
  body: 'Test body',
  user: {
    id: 1,
    name: 'Leanne Graham',
    username: 'Bret',
    email: 'leanne@example.com',
    company: null,
    city: null,
  },
};

describe('post.service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getPosts', () => {
    it('returns posts and nextCursor when no options', async () => {
      vi.mocked(prisma.post.findMany).mockResolvedValue([mockPost]);

      const result = await getPosts({});

      expect(prisma.post.findMany).toHaveBeenCalledWith({
        where: {},
        include: { user: { select: expect.any(Object) } },
        orderBy: { id: 'asc' },
        take: 50,
      });
      expect(result).toEqual({
        posts: [mockPost],
        nextCursor: null,
      });
    });

    it('filters by author when provided', async () => {
      vi.mocked(prisma.post.findMany).mockResolvedValue([]);

      await getPosts({ author: 'Leanne' });

      expect(prisma.post.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            OR: [
              { user: { name: { contains: 'Leanne' } } },
              { user: { username: { contains: 'Leanne' } } },
              { user: { email: { contains: 'Leanne' } } },
            ],
          },
        })
      );
    });

    it('adds userId filter when author is numeric', async () => {
      vi.mocked(prisma.post.findMany).mockResolvedValue([]);

      await getPosts({ author: '5' });

      expect(prisma.post.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: expect.arrayContaining([{ userId: 5 }]),
          }),
        })
      );
    });

    it('uses cursor for pagination', async () => {
      vi.mocked(prisma.post.findMany).mockResolvedValue([mockPost]);

      await getPosts({ cursor: 10 });

      expect(prisma.post.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: { gt: 10 } },
        })
      );
    });

    it('returns nextCursor null when fewer than limit', async () => {
      vi.mocked(prisma.post.findMany).mockResolvedValue([mockPost]);

      const result = await getPosts({});

      expect(result.nextCursor).toBeNull();
    });

    it('returns nextCursor when full page', async () => {
      const manyPosts = Array.from({ length: 50 }, (_, i) => ({
        ...mockPost,
        id: i + 1,
      }));
      vi.mocked(prisma.post.findMany).mockResolvedValue(manyPosts);

      const result = await getPosts({});

      expect(result.nextCursor).toBe(50);
    });
  });

  describe('getPostById', () => {
    it('returns post when found', async () => {
      vi.mocked(prisma.post.findUnique).mockResolvedValue(mockPost);

      const result = await getPostById(1);

      expect(prisma.post.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: { user: { select: expect.any(Object) } },
      });
      expect(result).toEqual(mockPost);
    });

    it('returns null when not found', async () => {
      vi.mocked(prisma.post.findUnique).mockResolvedValue(null);

      const result = await getPostById(999);

      expect(result).toBeNull();
    });
  });

  describe('deletePost', () => {
    it('deletes post by id', async () => {
      vi.mocked(prisma.post.delete).mockResolvedValue(mockPost);

      await deletePost(1);

      expect(prisma.post.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });
});
