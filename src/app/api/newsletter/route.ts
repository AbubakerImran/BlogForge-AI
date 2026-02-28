import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { newsletterSchema } from "@/lib/validators";
import { resend } from "@/lib/resend";

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
      const fromName = process.env.RESEND_FROM_NAME || "BlogForge";
      const fromEmail = process.env.RESEND_FROM_EMAIL || "noreply@blogforge.dev";
      const fromAddress = `${fromName} <${fromEmail}>`;

      // Add contact to Resend audience if audience ID is configured
      if (process.env.RESEND_AUDIENCE_ID) {
        try {
          await resend.contacts.create({
            email: validated.email,
            audienceId: process.env.RESEND_AUDIENCE_ID,
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

      // Send notification to all existing subscribers about the new content (if configured)
      if (process.env.RESEND_NOTIFY_SUBSCRIBERS === "true") {
        try {
          const subscribers = await prisma.newsletter.findMany({
            where: { active: true, email: { not: validated.email } },
            select: { email: true },
          });

          if (subscribers.length > 0) {
            // Batch send is handled by Resend's batch API
            await resend.emails.send({
              from: fromAddress,
              to: fromEmail,
              bcc: subscribers.map((s) => s.email),
              subject: `New subscriber joined ${fromName}!`,
              html: `
                <h2>A new subscriber has joined!</h2>
                <p>Your newsletter community is growing. Keep creating great content!</p>
              `,
            });
          }
        } catch (notifyError) {
          console.error("Failed to notify subscribers:", notifyError);
        }
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
