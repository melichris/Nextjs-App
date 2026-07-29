import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/posts - Fetch all blog posts
export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: true, // Includes associated User data
      },
    });

    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 },
    );
  }
}

// POST /api/posts - Create a test user and blog post
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. Create or find a test author
    const author = await prisma.user.upsert({
      where: { email: body.authorEmail || "dev@example.com" },
      update: {},
      create: {
        email: body.authorEmail || "dev@example.com",
        name: body.authorName || "Dev User",
        role: "ADMIN",
      },
    });

    // 2. Create the post linked to the author
    const post = await prisma.post.create({
      data: {
        title: body.title,
        slug: body.slug,
        content: body.content,
        published: body.published ?? true,
        authorId: author.id,
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("Post creation error:", error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 },
    );
  }
}
