/**
 * Exponential-backoff retry wrapper.
 * - Honours the server's `Retry-After` header when present.
 * - Retries only on 429 (rate-limit) and 5xx (transient server) errors.
 * - Throws the original error for any other status.
 */
export async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  maxRetries: number = 3,
): Promise<Response> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const response = await fetch(url, options);

    // Success – return immediately
    if (response.ok) return response;

    // Only retry on 429 or 5xx
    if (response.status !== 429 && response.status < 500) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    lastError = new Error(`HTTP error! status: ${response.status}`);

    // If this was the last attempt, don't wait – just fall through to throw
    if (attempt === maxRetries) break;

    // Back-off: honour Retry-After header, otherwise 2^attempt seconds (1 s, 2 s, 4 s …)
    const retryAfter = response.headers.get("Retry-After");
    const waitSeconds = retryAfter
      ? Math.max(Number(retryAfter), 1)
      : Math.pow(2, attempt);

    console.warn(
      `⏳ Rate-limited (${response.status}). Retrying in ${waitSeconds}s… (attempt ${attempt + 1}/${maxRetries})`,
    );
    await new Promise((resolve) => setTimeout(resolve, waitSeconds * 1000));
  }

  throw lastError ?? new Error("Request failed after retries");
}

// ---------------------------------------------------------------------------
// Simple in-memory TTL cache
// ---------------------------------------------------------------------------

interface CacheEntry<T> {
  data: T;
  expiresAt: number; // epoch ms
}

/**
 * Generic TTL cache.  Instantiate once per domain (flights / hotels / attractions).
 *
 * @param defaultTTLms  Default time-to-live in milliseconds (default 30 min).
 */
export class TTLCache<T = unknown> {
  private store = new Map<string, CacheEntry<T>>();
  private defaultTTL: number;

  constructor(defaultTTLms: number = 30 * 60 * 1000) {
    this.defaultTTL = defaultTTLms;
  }

  /** Store a value. Optionally override the TTL for this entry. */
  set(key: string, data: T, ttlMs?: number): void {
    this.store.set(key, {
      data,
      expiresAt: Date.now() + (ttlMs ?? this.defaultTTL),
    });
  }

  /** Retrieve a value if it exists and has not expired. Returns `undefined` on miss/expiry. */
  get(key: string): T | undefined {
    const entry = this.store.get(key);
    if (!entry) return undefined;

    if (Date.now() > entry.expiresAt) {
      this.store.delete(key); // evict stale entry
      return undefined;
    }
    return entry.data;
  }

  /** Check whether a non-expired entry exists. */
  has(key: string): boolean {
    return this.get(key) !== undefined;
  }

  /** Remove a single key. */
  delete(key: string): void {
    this.store.delete(key);
  }

  /** Wipe the entire cache. */
  clear(): void {
    this.store.clear();
  }

  /** Current number of entries (including potentially stale ones). */
  get size(): number {
    return this.store.size;
  }
}
