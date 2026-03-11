import { getLocale, messages } from "@/lib/messages";
import { cacheableHeaders, noStoreHeaders } from "@/lib/api-headers";
import { getPostById, deletePost } from "@/lib/services/post.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const searchParams = request.nextUrl.searchParams;
  const lang = getLocale(searchParams.get("lang") ?? undefined);

  const postId = parseInt(id);
  if (isNaN(postId)) {
    return NextResponse.json(
      { error: messages[lang].invalidPostId },
      { status: 400, headers: noStoreHeaders }
    );
  }

  try {
    const post = await getPostById(postId);

    if (!post) {
      return NextResponse.json(
        { error: messages[lang].postNotFound },
        { status: 404, headers: noStoreHeaders }
      );
    }

    return NextResponse.json(post, { headers: cacheableHeaders });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
        { error: messages[lang].failedToFetchPost },
        { status: 500, headers: noStoreHeaders }
      );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const searchParams = request.nextUrl.searchParams;
  const lang = getLocale(searchParams.get("lang") ?? undefined);

  const postId = parseInt(id);
  if (isNaN(postId)) {
    return NextResponse.json(
      { error: messages[lang].invalidPostId },
      { status: 400, headers: noStoreHeaders }
    );
  }

  try {
    const existing = await getPostById(postId);

    if (!existing) {
      return NextResponse.json(
        { error: messages[lang].postNotFound },
        { status: 404, headers: noStoreHeaders }
      );
    }

    await deletePost(postId);

    return new NextResponse(null, { status: 204, headers: noStoreHeaders });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: messages[lang].failedToDeletePost },
      { status: 500, headers: noStoreHeaders }
    );
  }
}
