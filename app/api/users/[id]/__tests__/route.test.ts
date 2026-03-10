import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET } from '../route';

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

vi.mock('@/lib/services/user.service', () => ({
  getUserById: vi.fn(),
}));

vi.mock('@/lib/messages', () => ({
  getLocale: vi.fn(() => 'en'),
  messages: { en: {}, es: {} },
}));

const { getUserById } = await import('@/lib/services/user.service');

function createRequest(url = 'http://localhost/api/users/1') {
  return new NextRequest(url);
}

describe('GET /api/users/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getUserById).mockResolvedValue(mockUser);
  });

  it('returns user with 200 when found', async () => {
    const req = createRequest();
    const res = await GET(req, { params: Promise.resolve({ id: '1' }) });
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data).toEqual(mockUser);
    expect(getUserById).toHaveBeenCalledWith(1);
  });

  it('returns 404 when user not found', async () => {
    vi.mocked(getUserById).mockResolvedValue(null);

    const req = createRequest('http://localhost/api/users/999');
    const res = await GET(req, { params: Promise.resolve({ id: '999' }) });

    expect(res.status).toBe(404);
  });

  it('returns 400 for invalid id', async () => {
    const req = createRequest('http://localhost/api/users/abc');
    const res = await GET(req, { params: Promise.resolve({ id: 'abc' }) });

    expect(res.status).toBe(400);
    expect(getUserById).not.toHaveBeenCalled();
  });

  it('returns 500 on service error', async () => {
    vi.mocked(getUserById).mockRejectedValue(new Error('DB error'));

    const req = createRequest();
    const res = await GET(req, { params: Promise.resolve({ id: '1' }) });

    expect(res.status).toBe(500);
  });
});
