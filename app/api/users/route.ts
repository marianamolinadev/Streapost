import { getLocale, messages } from "@/lib/messages";
import { getUsers } from "@/lib/services/user.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const lang = getLocale(searchParams.get("lang") ?? undefined);
  const cursorParam = searchParams.get("cursor");
  const cursorId = cursorParam ? parseInt(cursorParam, 10) : undefined;
  const search = searchParams.get("search")?.trim() ?? "";

  try {
    const result = await getUsers({ search: search || undefined, cursor: cursorId });
    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: messages[lang].failedToFetchUsers }, { status: 500 });
  }
}
