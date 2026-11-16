/** CI-only real owner session bootstrap for isolated HTTP/Postgres tests.
 * Never run these scripts against a live deployment or real business records.
 */
import assert from "node:assert/strict";
export const base = process.env.HQ_E2E_URL || "http://127.0.0.1:3000";
if (process.env.HQ_TEST_MODE !== "1" || !/^http:\/\/(127\.0\.0\.1|localhost):\d+$/.test(base))
  throw new Error("CI_AUTH_ONLY_ALLOWED_ON_LOCAL_TEST_SERVER");

export async function authenticateOwner() {
  const response = await fetch(base + "/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: base },
    body: JSON.stringify({
      username: process.env.OWNER_USERNAME || "ci-owner",
      password: process.env.OWNER_PASSWORD || "ci-not-a-real-secret",
    }),
    redirect: "manual",
  });
  const body = await response.json();
  assert.equal(response.status, 200, JSON.stringify(body));
  const setCookie = response.headers.get("set-cookie") || "";
  assert.match(setCookie, /hq_session=/);
  assert.match(setCookie, /httponly/i);
  assert.match(setCookie, /samesite=strict/i);
  return setCookie.split(";")[0];
}
export function authHeaders(cookie, writing = false) {
  return { Cookie: cookie, ...(writing ? { Origin: base, "Content-Type": "application/json" } : {}) };
}
