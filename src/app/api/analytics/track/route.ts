import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

const trackSchema = z.object({
  postId: z.string().optional(),
  page: z.string().min(1, "Page is required"),
  referrer: z.string().optional(),
  viewerToken: z.string().optional(),
});

function detectDevice(userAgent: string): string {
  const ua = userAgent.toLowerCase();
  if (/tablet|ipad|playbook|silk/.test(ua)) return "tablet";
  if (/mobile|iphone|ipod|android.*mobile|windows phone/.test(ua))
    return "mobile";
  return "desktop";
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = trackSchema.parse(body);

    const userAgent = request.headers.get("user-agent") || "";
    const device = detectDevice(userAgent);

    // Get the session to check if user is viewing their own post
    const session = await getServerSession(authOptions);

    // If a postId is provided, check for unique views
    if (validated.postId && validated.viewerToken) {
      // Check if user is the author of this post (don't count own views)
      if (session?.user?.id) {
        const post = await prisma.post.findUnique({
          where: { id: validated.postId },
          select: { authorId: true },
        });
        if (post && post.authorId === session.user.id) {
          return NextResponse.json({
            success: true,
            data: { message: "Own post view not counted" },
          });
        }
      }

      // Check if this viewer already viewed this post
      const existingView = await prisma.pageView.findFirst({
        where: {
          postId: validated.postId,
          viewerToken: validated.viewerToken,
        },
      });

      if (existingView) {
        return NextResponse.json({
          success: true,
          data: { message: "View already counted" },
        });
      }
    }

    await prisma.pageView.create({
      data: {
        postId: validated.postId,
        page: validated.page,
        referrer: validated.referrer,
        device,
        viewerToken: validated.viewerToken,
      },
    });

    // Increment the post's view counter if a postId is provided (unique view)
    if (validated.postId) {
      await prisma.post.update({
        where: { id: validated.postId },
        data: { views: { increment: 1 } },
      }).catch(() => {
        // Silently fail if post not found — tracking should still succeed
      });
    }

    return NextResponse.json({
      success: true,
      data: { message: "Page view tracked" },
    });
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: error },
        { status: 400 }
      );
    }
    console.error("Error tracking page view:", error);
    return NextResponse.json(
      { success: false, error: "Failed to track page view" },
      { status: 500 }
    );
  }
}
