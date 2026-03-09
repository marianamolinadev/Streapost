import { prisma } from '@/lib/prisma';

const USERS_LIMIT = 20;

export async function getUsers(options: {
  search?: string;
  cursor?: number;
}) {
  const { search, cursor } = options;

  const users = await prisma.user.findMany({
    where: {
      ...(cursor ? { id: { gt: cursor } } : {}),
      ...(search
        ? {
            OR: [
              { name: { contains: search } },
              { username: { contains: search } },
              { email: { contains: search } },
            ],
          }
        : {}),
    },
    orderBy: { id: 'asc' },
    take: USERS_LIMIT,
  });

  const nextCursor = users.length === USERS_LIMIT ? users[users.length - 1].id : null;
  return { users, nextCursor };
}

export async function getUserById(id: number) {
  return prisma.user.findUnique({ where: { id } });
}
