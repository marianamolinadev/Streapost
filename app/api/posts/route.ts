import { getLocale, messages } from "@/lib/messages";
import { getPosts } from "@/lib/services/post.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const author = searchParams.get("author")?.trim() ?? "";
  const lang = getLocale(searchParams.get("lang") ?? undefined);
  const cursorParam = searchParams.get("cursor");
  const cursorId = cursorParam ? parseInt(cursorParam, 10) : undefined;

  try {
    const result = await getPosts({ author: author || undefined, cursor: cursorId });
    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: messages[lang].failedToFetchPosts }, { status: 500 });
  }
}
