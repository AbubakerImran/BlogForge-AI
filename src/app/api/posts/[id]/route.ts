import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { postSchema } from "@/lib/validators";
import { slugify } from "@/lib/utils";
import { isAdminOrAbove, isSuperAdmin } from "@/lib/permissions";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const post = await prisma.post.findUnique({
      where: { id: params.id },
      include: {
        author: { select: { id: true, name: true, image: true, email: true } },
        category: true,
        tags: true,
      },
    });

    if (!post) {
      return NextResponse.json(
        { success: false, error: "Post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: post });
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json(
      { success: false, error: "Post not found" },
      { status: 404 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }
    if (!isAdminOrAbove(session.user.role)) {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    // Admin can only edit their own posts
    if (!isSuperAdmin(session.user.role)) {
      const existingPost = await prisma.post.findUnique({
        where: { id: params.id },
        select: { authorId: true },
      });
      if (!existingPost || existingPost.authorId !== session.user.id) {
        return NextResponse.json(
          { success: false, error: "Forbidden: You can only edit your own posts" },
          { status: 403 }
        );
      }
    }

    const body = await request.json();
    const validated = postSchema.partial().parse(body);

    // Extract tags from validated data and handle separately
    const { tags: tagsString, ...postData } = validated;

    // Handle tags if provided
    let tagConnection = undefined;
    if (tagsString !== undefined) {
      const tagNames = tagsString
        ? tagsString.split(",").map((t) => t.trim()).filter(Boolean)
        : [];

      const tagRecords = await Promise.all(
        tagNames.map(async (name) => {
          const tagSlug = slugify(name);
          return prisma.tag.upsert({
            where: { slug: tagSlug },
            update: {},
            create: { name, slug: tagSlug },
          });
        })
      );

      tagConnection = {
        set: tagRecords.map((tag) => ({ id: tag.id })),
      };
    }

    // Admin cannot feature posts
    if (!isSuperAdmin(session.user.role)) {
      delete postData.featured;
    }

    // Do NOT change authorId - post remains the property of original author
    const post = await prisma.post.update({
      where: { id: params.id },
      data: {
        ...postData,
        categoryId: postData.categoryId || undefined,
        ...(tagConnection ? { tags: tagConnection } : {}),
      },
      include: {
        author: { select: { id: true, name: true, image: true, email: true } },
        category: true,
        tags: true,
      },
    });

    return NextResponse.json({ success: true, data: post });
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: error },
        { status: 400 }
      );
    }
    console.error("Error updating post:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update post" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }
    if (!isAdminOrAbove(session.user.role)) {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    // Admin can only delete their own posts
    if (!isSuperAdmin(session.user.role)) {
      const existingPost = await prisma.post.findUnique({
        where: { id: params.id },
        select: { authorId: true },
      });
      if (!existingPost || existingPost.authorId !== session.user.id) {
        return NextResponse.json(
          { success: false, error: "Forbidden: You can only delete your own posts" },
          { status: 403 }
        );
      }
    }

    await prisma.post.delete({ where: { id: params.id } });

    return NextResponse.json({ success: true, data: { deleted: true } });
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete post" },
      { status: 500 }
    );
  }
}
