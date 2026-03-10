import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET } from '../route';

vi.mock('@/lib/services/post.service', () => ({
  getPosts: vi.fn(),
}));

vi.mock('@/lib/messages', () => ({
  getLocale: vi.fn(() => 'en'),
  messages: { en: {}, es: {} },
}));

const { getPosts } = await import('@/lib/services/post.service');

const mockPosts = {
  posts: [
    {
      id: 1,
      userId: 1,
      title: 'Test',
      body: 'Body',
      user: { id: 1, name: 'Author', username: 'author', email: 'a@b.com', company: null, city: null },
    },
  ],
  nextCursor: null,
};

function createRequest(url = 'http://localhost/api/posts') {
  return new NextRequest(url);
}

describe('GET /api/posts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getPosts).mockResolvedValue(mockPosts);
  });

  it('returns posts with 200', async () => {
    const req = createRequest();
    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data).toEqual(mockPosts);
    expect(getPosts).toHaveBeenCalledWith({ author: undefined, cursor: undefined });
  });

  it('passes author and cursor from query params', async () => {
    const req = createRequest('http://localhost/api/posts?author=testAuthor&cursor=5');
    await GET(req);

    expect(getPosts).toHaveBeenCalledWith({ author: 'testAuthor', cursor: 5 });
  });

  it('returns 500 on service error', async () => {
    vi.mocked(getPosts).mockRejectedValue(new Error('DB error'));

    const req = createRequest();
    const res = await GET(req);

    expect(res.status).toBe(500);
  });
});
