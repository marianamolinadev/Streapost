import { getLocale, messages } from "@/lib/messages";
import { cacheableHeaders, noStoreHeaders } from "@/lib/api-headers";
import { getPosts } from "@/lib/services/post.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const author = searchParams.get("author")?.trim() ?? "";
  const lang = getLocale(searchParams.get("lang") ?? undefined);
  const cursorParam = searchParams.get("cursor");
  const parsedCursor = cursorParam ? parseInt(cursorParam, 10) : NaN;
  const cursorId =
    !isNaN(parsedCursor) && parsedCursor >= 0 && Number.isInteger(parsedCursor)
      ? parsedCursor
      : undefined;

  try {
    const result = await getPosts({ author: author || undefined, cursor: cursorId });
    return NextResponse.json(result, { headers: cacheableHeaders });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: messages[lang].failedToFetchPosts },
      { status: 500, headers: noStoreHeaders }
    );
  }
}
