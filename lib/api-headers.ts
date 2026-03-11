const CACHE_MAX_AGE = 30; // seconds - fresh window
const CACHE_STALE_WHILE_REVALIDATE = 60; // seconds - serve stale while revalidating in background

// Headers for cacheable GET responses. Enables offline/slow-network resilience.
export const cacheableHeaders = {
  "Cache-Control": `public, max-age=${CACHE_MAX_AGE}, s-maxage=${CACHE_MAX_AGE}, stale-while-revalidate=${CACHE_STALE_WHILE_REVALIDATE}`,
} as const;

// Headers for non-cacheable responses (mutations, errors).
export const noStoreHeaders = {
  "Cache-Control": "no-store, no-cache, must-revalidate",
} as const;
