import { getLocale, messages } from "@/lib/messages";
import { cacheableHeaders, noStoreHeaders } from "@/lib/api-headers";
import { getUserById } from "@/lib/services/user.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const searchParams = request.nextUrl.searchParams;
  const lang = getLocale(searchParams.get("lang") ?? undefined);

  const userId = parseInt(id);
  if (isNaN(userId)) {
    return NextResponse.json(
      { error: messages[lang].invalidUserId },
      { status: 400, headers: noStoreHeaders }
    );
  }

  try {
    const user = await getUserById(userId);

    if (!user) {
      return NextResponse.json(
      { error: messages[lang].writerNotFound },
      { status: 404, headers: noStoreHeaders }
    );
    }

    return NextResponse.json(user, { headers: cacheableHeaders });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: messages[lang].failedToFetchWriter },
      { status: 500, headers: noStoreHeaders }
    );
  }
}
