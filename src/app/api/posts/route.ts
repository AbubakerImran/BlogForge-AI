import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { postSchema } from "@/lib/validators";
import { slugify } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const category = searchParams.get("category");
    const tag = searchParams.get("tag");
    const published = searchParams.get("published");
    const featured = searchParams.get("featured");
    const search = searchParams.get("search");

    const where: Record<string, unknown> = {};

    if (published !== null) {
      where.published = published === "true";
    }
    if (featured !== null) {
      where.featured = featured === "true";
    }
    if (category) {
      where.categoryId = category;
    }
    if (tag) {
      where.tags = { some: { slug: tag } };
    }
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
        { excerpt: { contains: search, mode: "insensitive" } },
      ];
    }

    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        include: {
          author: { select: { id: true, name: true, image: true } },
          category: true,
          tags: true,
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.post.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        posts,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }
    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validated = postSchema.parse(body);

    const slug =
      validated.slug ||
      validated.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    // Parse tags from comma-separated string
    const tagNames = validated.tags
      ? validated.tags.split(",").map((t) => t.trim()).filter(Boolean)
      : [];

    const tagConnections = await Promise.all(
      tagNames.map(async (name) => {
        const tagSlug = slugify(name);
        return prisma.tag.upsert({
          where: { slug: tagSlug },
          update: {},
          create: { name, slug: tagSlug },
        });
      })
    );

    const post = await prisma.post.create({
      data: {
        title: validated.title,
        content: validated.content,
        slug,
        excerpt: validated.excerpt,
        categoryId: validated.categoryId || undefined,
        published: validated.published ?? false,
        featured: validated.featured ?? false,
        featuredImage: validated.featuredImage,
        readTime: validated.readTime,
        aiSummary: validated.aiSummary,
        authorId: session.user.id,
        tags: {
          connect: tagConnections.map((tag) => ({ id: tag.id })),
        },
      },
      include: {
        author: { select: { id: true, name: true, image: true } },
        category: true,
        tags: true,
      },
    });

    return NextResponse.json({ success: true, data: post }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: error },
        { status: 400 }
      );
    }
    console.error("Error creating post:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create post" },
      { status: 500 }
    );
  }
}
