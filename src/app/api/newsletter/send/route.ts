import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { isSuperAdmin } from "@/lib/permissions";
import { resend } from "@/lib/resend";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }
    if (!isSuperAdmin(session.user.role)) {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { subject, content } = body;

    if (!subject || !content) {
      return NextResponse.json(
        { success: false, error: "Subject and content are required" },
        { status: 400 }
      );
    }

    // Get site settings for from name/email
    const siteSettings = await prisma.siteSettings.findFirst();
    const fromName = siteSettings?.resendFromName || "BlogForge";
    const fromEmail = siteSettings?.resendFromEmail || "noreply@blogforge.dev";

    // Get all active subscribers from DB
    const subscribers = await prisma.newsletter.findMany({
      where: { active: true },
      select: { email: true },
    });

    if (subscribers.length === 0) {
      return NextResponse.json(
        { success: false, error: "No active subscribers" },
        { status: 400 }
      );
    }

    let sent = 0;
    let failed = 0;

    if (resend) {
      // Send one by one to each subscriber without adding to audience
      for (const subscriber of subscribers) {
        try {
          await resend.emails.send({
            from: `${fromName} <${fromEmail}>`,
            to: subscriber.email,
            subject,
            html: content,
          });
          sent++;
        } catch (err) {
          console.error(`Failed to send to ${subscriber.email}:`, err);
          failed++;
        }
      }
    } else {
      // No resend configured, just count
      sent = subscribers.length;
    }

    return NextResponse.json({
      success: true,
      data: { sent, failed, total: subscribers.length },
    });
  } catch (error) {
    console.error("Error sending newsletter:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send newsletter" },
      { status: 500 }
    );
  }
}
