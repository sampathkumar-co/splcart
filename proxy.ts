import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";

function equal(a: string, b: string) {
  const left = Buffer.from(a); const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === "/api/health") return NextResponse.next();
  const user = process.env.OWNER_USERNAME;
  const password = process.env.OWNER_PASSWORD;
  let authorized = false;
  const value = request.headers.get("authorization") || "";
  if (user && password && password !== "REPLACE_WITH_LONG_RANDOM_SECRET" && value.startsWith("Basic ")) {
    try {
      const decoded = Buffer.from(value.slice(6), "base64").toString("utf8");
      const split = decoded.indexOf(":");
      authorized = split >= 0 && equal(decoded.slice(0, split), user) && equal(decoded.slice(split + 1), password);
    } catch { authorized = false; }
  }
  if (!authorized) return new NextResponse("Owner authentication required. Configure OWNER_USERNAME and OWNER_PASSWORD.", {
    status: 401, headers: { "WWW-Authenticate": 'Basic realm="Prasanth Jewellers HQ", charset="UTF-8"', "Cache-Control": "no-store" }
  });
  // Reject cross-site browser writes even when Basic credentials have been cached.
  if (["POST", "PUT", "PATCH", "DELETE"].includes(request.method)) {
    const origin = request.headers.get("origin");
    if (origin && new URL(origin).host !== request.headers.get("host")) return new NextResponse("Invalid origin", { status: 403 });
    if (request.headers.get("content-type")?.split(";")[0].trim() !== "application/json") return new NextResponse("JSON required", { status: 415 });
  }
  return NextResponse.next();
}
export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"] };
