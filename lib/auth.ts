import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

/**
 * Independent single-owner Headquarters sessions.
 * A signed HttpOnly cookie cannot be forged without HQ_SESSION_SECRET.
 * Test-only HTTP mode is deliberately explicit and never enabled by default.
 */
export const SESSION_MAX_AGE_SECONDS = 8 * 60 * 60;
export const isLocalTestMode = () =>
  process.env.HQ_TEST_MODE === "1" && process.env.NODE_ENV === "production";
export const sessionCookieName = () =>
  process.env.NODE_ENV === "production" && !isLocalTestMode() ? "__Host-hq_session" : "hq_session";

export function authConfigured() {
  const secret = process.env.HQ_SESSION_SECRET || "";
  const username = process.env.OWNER_USERNAME || "";
  const password = process.env.OWNER_PASSWORD || "";
  return secret.length >= 32 && username.length >= 3 &&
    password.length >= 16 && password !== "REPLACE_WITH_LONG_RANDOM_SECRET" &&
    (!process.env.HQ_PUBLIC_ORIGIN || process.env.HQ_PUBLIC_ORIGIN.startsWith("https://") || isLocalTestMode());
}
export function timingSafeStringEqual(a: string, b: string) {
  const left = Buffer.from(a), right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}
export function checkOwnerCredentials(username: string, password: string) {
  return authConfigured() &&
    timingSafeStringEqual(username, process.env.OWNER_USERNAME!) &&
    timingSafeStringEqual(password, process.env.OWNER_PASSWORD!);
}
function signature(body: string): Buffer {
  return createHmac("sha256", process.env.HQ_SESSION_SECRET!).update(body).digest();
}
export function issueSession(now = Date.now()) {
  if (!authConfigured()) throw new Error("AUTH_NOT_CONFIGURED");
  const payload = {
    v: 1, u: process.env.OWNER_USERNAME!, i: now,
    e: now + SESSION_MAX_AGE_SECONDS * 1000,
    n: randomBytes(16).toString("hex"),
  };
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return body + "." + signature(body).toString("base64url");
}
export function validateSession(cookie: string | undefined, now = Date.now()) {
  if (!cookie || cookie.length > 1024 || !authConfigured()) return false;
  const [body, mac, extra] = cookie.split(".");
  if (!body || !mac || extra) return false;
  try {
    const received = Buffer.from(mac, "base64url");
    const expected = signature(body);
    if (received.length !== expected.length || !timingSafeEqual(received, expected)) return false;
    const p = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as Record<string, unknown>;
    return p.v === 1 && p.u === process.env.OWNER_USERNAME &&
      Number.isFinite(p.i) && Number.isFinite(p.e) &&
      typeof p.i === "number" && typeof p.e === "number" &&
      p.i <= now && p.e > now && p.e - p.i <= SESSION_MAX_AGE_SECONDS * 1000;
  } catch { return false; }
}
export function sessionCookieOptions() {
  return {
    httpOnly: true, secure: process.env.NODE_ENV === "production" && !isLocalTestMode(),
    sameSite: "strict" as const, path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  };
}
