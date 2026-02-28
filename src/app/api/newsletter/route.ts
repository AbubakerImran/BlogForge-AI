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
      try {
        await resend.emails.send({
          from: process.env.EMAIL_FROM || "BlogForge <noreply@blogforge.dev>",
          to: validated.email,
          subject: "Welcome to BlogForge Newsletter!",
          html: `
            <h1>Welcome to BlogForge!</h1>
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
