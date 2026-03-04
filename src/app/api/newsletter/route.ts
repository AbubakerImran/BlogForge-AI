import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { newsletterSchema } from "@/lib/validators";
import { resend } from "@/lib/resend";
import { isSuperAdmin } from "@/lib/permissions";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = newsletterSchema.parse(body);

    const existing = await prisma.newsletter.findUnique({
      where: { email: validated.email },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: "Email is already subscribed" },
        { status: 409 }
      );
    }

    await prisma.newsletter.create({
      data: { email: validated.email },
    });

    if (resend) {
      // Get site settings for from name/email
      const siteSettings = await prisma.siteSettings.findFirst({
        select: {
          resendFromName: true,
          resendFromEmail: true,
          resendAudienceId: true,
        },
      });
      const fromName = siteSettings?.resendFromName || "BlogForge";
      const fromEmail = siteSettings?.resendFromEmail || "noreply@blogforge.dev";
      const fromAddress = `${fromName} <${fromEmail}>`;

      // Add contact to Resend audience if audience ID is configured
      if (siteSettings?.resendAudienceId) {
        try {
          await resend.contacts.create({
            email: validated.email,
            audienceId: siteSettings.resendAudienceId,
          });
        } catch (contactError) {
          console.error("Failed to add contact to Resend audience:", contactError);
        }
      }

      // Send welcome email
      try {
        await resend.emails.send({
          from: fromAddress,
          to: validated.email,
          subject: `Welcome to ${fromName} Newsletter!`,
          html: `
            <h1>Welcome to ${fromName}!</h1>
            <p>Thank you for subscribing to our newsletter. You'll receive the latest blog posts and updates directly in your inbox.</p>
            <p>Stay tuned for great content!</p>
          `,
        });
      } catch (emailError) {
        console.error("Failed to send welcome email:", emailError);
      }
    }

    return NextResponse.json(
      { success: true, data: { message: "Successfully subscribed" } },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: error },
        { status: 400 }
      );
    }
    console.error("Error subscribing to newsletter:", error);
    return NextResponse.json(
      { success: false, error: "Failed to subscribe" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Subscriber ID is required" },
        { status: 400 }
      );
    }

    await prisma.newsletter.delete({ where: { id } });

    return NextResponse.json({ success: true, data: { deleted: true } });
  } catch (error) {
    console.error("Error removing subscriber:", error);
    return NextResponse.json(
      { success: false, error: "Failed to remove subscriber" },
      { status: 500 }
    );
  }
}
