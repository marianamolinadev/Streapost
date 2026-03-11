import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { noStoreHeaders } from "@/lib/api-headers";
import { getLocale, messages } from "@/lib/messages";
import { isRateLimited, RATE_LIMIT_RETRY_AFTER_SECONDS } from "@/lib/rate-limit";

export function proxy(request: NextRequest) {
  if (isRateLimited(request)) {
    const lang = getLocale(request.nextUrl.searchParams.get("lang") ?? undefined);
    return NextResponse.json(
      { error: messages[lang].tooManyRequests },
      {
        status: 429,
        headers: {
          ...noStoreHeaders,
          "Retry-After": String(RATE_LIMIT_RETRY_AFTER_SECONDS),
        },
      }
    );
  }
  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
