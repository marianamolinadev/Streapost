const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 60; // 60 requests per minute per IP

export const RATE_LIMIT_RETRY_AFTER_SECONDS = RATE_LIMIT_WINDOW_MS / 1000;

type Entry = { count: number; resetAt: number };

const store = new Map<string, Entry>();

function getClientIdentifier(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  return forwarded?.split(",")[0]?.trim() ?? realIp ?? "unknown";
}

export function isRateLimited(request: Request): boolean {
  const id = getClientIdentifier(request);
  const now = Date.now();

  let entry = store.get(id);

  if (!entry) {
    store.set(id, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  if (now >= entry.resetAt) {
    entry = { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS };
    store.set(id, entry);
    return false;
  }

  entry.count++;
  return entry.count > RATE_LIMIT_MAX_REQUESTS;
}
