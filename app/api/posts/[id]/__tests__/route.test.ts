import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET, DELETE } from '../route';

const mockPost = {
  id: 1,
  userId: 1,
  title: 'Test',
  body: 'Body',
  user: { id: 1, name: 'Author', username: 'author', email: 'a@b.com', company: null, city: null },
};

vi.mock('@/lib/services/post.service', () => ({
  getPostById: vi.fn(),
  deletePost: vi.fn(),
}));

vi.mock('@/lib/messages', () => ({
  getLocale: vi.fn(() => 'en'),
  messages: { en: {}, es: {} },
}));

const { getPostById, deletePost } = await import('@/lib/services/post.service');

function createRequest(url = 'http://localhost/api/posts/1') {
  return new NextRequest(url);
}

describe('GET /api/posts/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getPostById).mockResolvedValue(mockPost);
  });

  it('returns post with 200 when found', async () => {
    const req = createRequest();
    const res = await GET(req, { params: Promise.resolve({ id: '1' }) });
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data).toEqual(mockPost);
    expect(getPostById).toHaveBeenCalledWith(1);
  });

  it('returns 404 when post not found', async () => {
    vi.mocked(getPostById).mockResolvedValue(null);

    const req = createRequest('http://localhost/api/posts/999');
    const res = await GET(req, { params: Promise.resolve({ id: '999' }) });

    expect(res.status).toBe(404);
  });

  it('returns 400 for invalid id', async () => {
    const req = createRequest('http://localhost/api/posts/abc');
    const res = await GET(req, { params: Promise.resolve({ id: 'abc' }) });

    expect(res.status).toBe(400);
    expect(getPostById).not.toHaveBeenCalled();
  });

  it('returns 500 on service error', async () => {
    vi.mocked(getPostById).mockRejectedValue(new Error('DB error'));

    const req = createRequest();
    const res = await GET(req, { params: Promise.resolve({ id: '1' }) });

    expect(res.status).toBe(500);
  });
});

describe('DELETE /api/posts/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getPostById).mockResolvedValue(mockPost);
    vi.mocked(deletePost).mockResolvedValue(undefined);
  });

  it('deletes post and returns 204', async () => {
    const req = createRequest();
    const res = await DELETE(req, { params: Promise.resolve({ id: '1' }) });

    expect(res.status).toBe(204);
    expect(deletePost).toHaveBeenCalledWith(1);
  });

  it('returns 404 when post not found', async () => {
    vi.mocked(getPostById).mockResolvedValue(null);

    const req = createRequest('http://localhost/api/posts/999');
    const res = await DELETE(req, { params: Promise.resolve({ id: '999' }) });

    expect(res.status).toBe(404);
    expect(deletePost).not.toHaveBeenCalled();
  });

  it('returns 400 for invalid id', async () => {
    const req = createRequest('http://localhost/api/posts/xyz');
    const res = await DELETE(req, { params: Promise.resolve({ id: 'xyz' }) });

    expect(res.status).toBe(400);
    expect(deletePost).not.toHaveBeenCalled();
  });

  it('returns 500 on delete error', async () => {
    vi.mocked(deletePost).mockRejectedValue(new Error('DB error'));

    const req = createRequest();
    const res = await DELETE(req, { params: Promise.resolve({ id: '1' }) });

    expect(res.status).toBe(500);
  });
});
