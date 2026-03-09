import { getLocale, messages } from "@/lib/messages";
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
    return NextResponse.json({ error: messages[lang].invalidPostId }, { status: 400 });
  }

  try {
    const post = await getPostById(postId);

    if (!post) {
      return NextResponse.json({ error: messages[lang].postNotFound }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: messages[lang].failedToFetchPosts }, { status: 500 });
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
    return NextResponse.json({ error: messages[lang].invalidPostId }, { status: 400 });
  }

  try {
    const existing = await getPostById(postId);

    if (!existing) {
      return NextResponse.json({ error: messages[lang].postNotFound }, { status: 404 });
    }

    await deletePost(postId);

    return NextResponse.json({ message: messages[lang].postDeleted }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: messages[lang].failedToDeletePost }, { status: 500 });
  }
}
