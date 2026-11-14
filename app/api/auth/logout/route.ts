import { NextResponse } from "next/server";
import { sessionCookieName, sessionCookieOptions } from "@/lib/auth";
export const runtime = "nodejs";
/** Clears the local bearer session cookie. Rotate HQ_SESSION_SECRET to invalidate all sessions. */
export async function POST() {
  const response = NextResponse.json({ authenticated: false }, { headers: { "Cache-Control": "no-store" } });
  response.cookies.set(sessionCookieName(), "", { ...sessionCookieOptions(), maxAge: 0 });
  return response;
}
