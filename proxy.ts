import { NextRequest, NextResponse } from "next/server";
import { authConfigured, sessionCookieName, validateSession } from "./lib/auth";

function secureHeaders(response: NextResponse, req: NextRequest) {
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "no-referrer");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  response.headers.set("Cache-Control", "no-store");
  if (process.env.HQ_PUBLIC_ORIGIN?.startsWith("https://"))
    response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  return response;
}
function denied(req: NextRequest, status: number, error: string) {
  return secureHeaders(NextResponse.json({ error }, { status }), req);
}
function isWrite(method: string) { return ["POST", "PATCH", "PUT", "DELETE"].includes(method); }
function validateWrite(req: NextRequest) {
  if (!isWrite(req.method)) return null;
  const origin = req.headers.get("origin");
  const configured = process.env.HQ_PUBLIC_ORIGIN || req.nextUrl.origin;
  if (!origin || origin !== configured) return "INVALID_REQUEST_ORIGIN";
  if (req.headers.get("sec-fetch-site") === "cross-site") return "CROSS_SITE_REQUEST_BLOCKED";
  if (req.headers.get("content-type")?.split(";")[0].trim() !== "application/json")
    return "JSON_REQUIRED";
  const contentLength = Number(req.headers.get("content-length"));
  const maxBody = req.nextUrl.pathname === "/api/creative/assets" ? 4_350_000 : 32_768;
  if (Number.isFinite(contentLength) && contentLength > maxBody)
    return "REQUEST_TOO_LARGE";
  return null;
}

/** This Next.js 16 proxy runs only for independent HQ; no SPLCART credentials. */
export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const health = path === "/api/health";
  const login = path === "/login" || path === "/api/auth/login";
  const writeError = validateWrite(request);
  if (writeError) return denied(request, writeError === "REQUEST_TOO_LARGE" ? 413 : 403, writeError);
  if (health || login) return secureHeaders(NextResponse.next(), request);
  if (!authConfigured()) return denied(request, 503, "OWNER_AUTH_NOT_CONFIGURED");
  const cookie = request.cookies.get(sessionCookieName())?.value;
  if (!validateSession(cookie)) {
    if (path.startsWith("/api/")) return denied(request, 401, "OWNER_SESSION_REQUIRED");
    return secureHeaders(NextResponse.redirect(new URL("/login", request.url)), request);
  }
  return secureHeaders(NextResponse.next(), request);
}
export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"] };
