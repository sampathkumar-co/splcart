import { db } from "./prisma";

type Hit = { hits: number; endAt: Date };
/**
 * Atomic PostgreSQL window rate limiter (no per-instance memory bypass).
 * Not an IP-tracking system: independent single-owner account has globally
 * bounded login and owner API requests, with no customer data in keys.
 */
export async function consumeRateLimit(key: string, max: number, windowMs: number, now = new Date()) {
  if (!/^[a-z-]{2,60}$/.test(key) || max < 1 || windowMs < 1000)
    throw new Error("INVALID_RATE_LIMIT");
  const reset = new Date(now.getTime() + windowMs);
  const rows = await db.$queryRaw<Hit[]> `
    INSERT INTO "RateLimitBucket" ("key", "count", "windowEnd")
    VALUES (${key}, 1, ${reset})
    ON CONFLICT ("key")
    DO UPDATE SET
      "count" = CASE WHEN "RateLimitBucket"."windowEnd" <= ${now}
        THEN 1 ELSE "RateLimitBucket"."count" + 1 END,
      "windowEnd" = CASE WHEN "RateLimitBucket"."windowEnd" <= ${now}
        THEN ${reset} ELSE "RateLimitBucket"."windowEnd" END
    RETURNING "count" AS "hits", "windowEnd" AS "endAt"
  `;
  const row = rows[0];
  if (!row) throw new Error("RATE_LIMIT_UNAVAILABLE");
  return {
    allowed: row.hits <= max,
    remaining: Math.max(0, max - row.hits),
    retryAfterSeconds: Math.max(1, Math.ceil((row.endAt.getTime() - now.getTime()) / 1000)),
  };
}
export function throttled(retryAfterSeconds: number) {
  return Response.json({ error: "RATE_LIMIT_EXCEEDED", retryAfterSeconds },
    { status: 429, headers: { "Retry-After": String(retryAfterSeconds), "Cache-Control": "no-store" } });
}
