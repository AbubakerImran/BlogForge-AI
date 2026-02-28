import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

const trackSchema = z.object({
  postId: z.string().optional(),
  page: z.string().min(1, "Page is required"),
  referrer: z.string().optional(),
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

    await prisma.pageView.create({
      data: {
        postId: validated.postId,
        page: validated.page,
        referrer: validated.referrer,
        device,
      },
    });

    // Increment the post's view counter if a postId is provided
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
