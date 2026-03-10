import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET } from '../route';

vi.mock('@/lib/services/user.service', () => ({
  getUsers: vi.fn(),
}));

vi.mock('@/lib/messages', () => ({
  getLocale: vi.fn(() => 'en'),
  messages: { en: {}, es: {} },
}));

const { getUsers } = await import('@/lib/services/user.service');

const mockUsers = {
  users: [
    {
      id: 1,
      name: 'Leanne Graham',
      username: 'Bret',
      email: 'leanne@example.com',
      phone: null,
      website: null,
      company: null,
      city: null,
    },
  ],
  nextCursor: null,
};

function createRequest(url = 'http://localhost/api/users') {
  return new NextRequest(url);
}

describe('GET /api/users', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getUsers).mockResolvedValue(mockUsers);
  });

  it('returns users with 200', async () => {
    const req = createRequest();
    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data).toEqual(mockUsers);
    expect(getUsers).toHaveBeenCalledWith({ search: undefined, cursor: undefined });
  });

  it('passes search and cursor from query params', async () => {
    const req = createRequest('http://localhost/api/users?search=Leanne&cursor=3');
    await GET(req);

    expect(getUsers).toHaveBeenCalledWith({ search: 'Leanne', cursor: 3 });
  });

  it('returns 500 on service error', async () => {
    vi.mocked(getUsers).mockRejectedValue(new Error('DB error'));

    const req = createRequest();
    const res = await GET(req);

    expect(res.status).toBe(500);
  });
});
