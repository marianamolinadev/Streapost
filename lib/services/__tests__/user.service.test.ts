import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getUsers, getUserById } from '../user.service';

vi.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
    },
  },
}));

const { prisma } = await import('@/lib/prisma');

const mockUser = {
  id: 1,
  name: 'Leanne Graham',
  username: 'Bret',
  email: 'leanne@example.com',
  phone: null,
  website: null,
  company: null,
  city: null,
};

describe('user.service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getUsers', () => {
    it('returns users and nextCursor when no options', async () => {
      vi.mocked(prisma.user.findMany).mockResolvedValue([mockUser]);

      const result = await getUsers({});

      expect(prisma.user.findMany).toHaveBeenCalledWith({
        where: {},
        orderBy: { id: 'asc' },
        take: 20,
      });
      expect(result).toEqual({
        users: [mockUser],
        nextCursor: null,
      });
    });

    it('filters by search when provided', async () => {
      vi.mocked(prisma.user.findMany).mockResolvedValue([]);

      await getUsers({ search: 'Leanne' });

      expect(prisma.user.findMany).toHaveBeenCalledWith({
        where: {
          OR: [
            { name: { contains: 'Leanne' } },
            { username: { contains: 'Leanne' } },
            { email: { contains: 'Leanne' } },
          ],
        },
        orderBy: { id: 'asc' },
        take: 20,
      });
    });

    it('uses cursor for pagination', async () => {
      vi.mocked(prisma.user.findMany).mockResolvedValue([mockUser]);

      await getUsers({ cursor: 5 });

      expect(prisma.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: { gt: 5 } },
        })
      );
    });

    it('returns nextCursor null when fewer than limit', async () => {
      vi.mocked(prisma.user.findMany).mockResolvedValue([mockUser]);

      const result = await getUsers({});

      expect(result.nextCursor).toBeNull();
    });

    it('returns nextCursor when full page', async () => {
      const manyUsers = Array.from({ length: 20 }, (_, i) => ({
        ...mockUser,
        id: i + 1,
      }));
      vi.mocked(prisma.user.findMany).mockResolvedValue(manyUsers);

      const result = await getUsers({});

      expect(result.nextCursor).toBe(20);
    });
  });

  describe('getUserById', () => {
    it('returns user when found', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser);

      const result = await getUserById(1);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(mockUser);
    });

    it('returns null when not found', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

      const result = await getUserById(999);

      expect(result).toBeNull();
    });
  });
});
