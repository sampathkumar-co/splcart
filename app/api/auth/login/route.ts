import { NextResponse } from "next/server";
import { z } from "zod";
import { authConfigured, checkOwnerCredentials, issueSession, sessionCookieName, sessionCookieOptions } from "@/lib/auth";
import { consumeRateLimit, throttled } from "@/lib/rate-limit";
export const runtime = "nodejs";
const schema = z.object({
  username: z.string().min(1).max(100),
  password: z.string().min(1).max(300),
}).strict();
export async function POST(req: Request) {
  try {
    if (!authConfigured()) return NextResponse.json({ error: "OWNER_LOGIN_NOT_CONFIGURED" }, { status: 503 });
    const cap = await consumeRateLimit("owner-login", 8, 15 * 60_000);
    if (!cap.allowed) return throttled(cap.retryAfterSeconds);
    const parsed = schema.safeParse(await req.json());
    if (!parsed.success || !checkOwnerCredentials(parsed.data.username, parsed.data.password))
      return NextResponse.json({ error: "INVALID_OWNER_CREDENTIALS" }, { status: 401, headers: { "Cache-Control": "no-store" } });
    const response = NextResponse.json({ authenticated: true }, { headers: { "Cache-Control": "no-store" } });
    response.cookies.set(sessionCookieName(), issueSession(), sessionCookieOptions());
    return response;
  } catch {
    return NextResponse.json({ error: "OWNER_LOGIN_UNAVAILABLE" }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
