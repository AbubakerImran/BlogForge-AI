import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { isAdminOrAbove, isSuperAdmin } from "@/lib/permissions";
import { z } from "zod";

export const dynamic = "force-dynamic";

const optionalUrl = z.string().url("Invalid URL").optional().or(z.literal(""));
const optionalEmail = z.string().email("Invalid email").optional().or(z.literal(""));

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(6, "Password must be at least 6 characters").optional(),
  twitterUrl: optionalUrl,
  githubUrl: optionalUrl,
  linkedinUrl: optionalUrl,
});

const siteSettingsSchema = z.object({
  siteName: z.string().min(1, "Site name is required").optional(),
  siteDescription: z.string().optional(),
  siteAuthor: z.string().optional(),
  adsenseId: z.string().optional(),
  resendFromName: z.string().optional(),
  resendFromEmail: optionalEmail,
  resendAudienceId: z.string().optional(),
  twitterUrl: optionalUrl,
  githubUrl: optionalUrl,
  linkedinUrl: optionalUrl,
  analyticsId: z.string().optional(),
});

export async function GET() {
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

    // Get user profile
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        twitterUrl: true,
        githubUrl: true,
        linkedinUrl: true,
      },
    });

    // Get site settings (only for superadmin)
    let siteSettings = null;
    if (isSuperAdmin(session.user.role)) {
      siteSettings = await prisma.siteSettings.findFirst();
    }

    return NextResponse.json({
      success: true,
      data: { user, siteSettings },
    });
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
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

    const body = await request.json();
    const { type } = body;

    if (type === "profile") {
      const validated = profileSchema.parse(body);

      const updateData: Record<string, unknown> = {
        name: validated.name,
        twitterUrl: validated.twitterUrl || null,
        githubUrl: validated.githubUrl || null,
        linkedinUrl: validated.linkedinUrl || null,
      };

      // Handle password change
      if (validated.newPassword) {
        if (!validated.currentPassword) {
          return NextResponse.json(
            { success: false, error: "Current password is required" },
            { status: 400 }
          );
        }
        const user = await prisma.user.findUnique({
          where: { id: session.user.id },
          select: { password: true },
        });
        if (!user?.password) {
          return NextResponse.json(
            { success: false, error: "Cannot change password for OAuth accounts" },
            { status: 400 }
          );
        }
        const isValid = await bcrypt.compare(validated.currentPassword, user.password);
        if (!isValid) {
          return NextResponse.json(
            { success: false, error: "Current password is incorrect" },
            { status: 400 }
          );
        }
        updateData.password = await bcrypt.hash(validated.newPassword, 12);
      } else if (validated.currentPassword) {
        return NextResponse.json(
          { success: false, error: "New password is required when providing current password" },
          { status: 400 }
        );
      }

      await prisma.user.update({
        where: { id: session.user.id },
        data: updateData,
      });

      return NextResponse.json({ success: true, data: { message: "Profile updated" } });
    }

    if (type === "site" && isSuperAdmin(session.user.role)) {
      const validated = siteSettingsSchema.parse(body);

      const existing = await prisma.siteSettings.findFirst();
      if (existing) {
        await prisma.siteSettings.update({
          where: { id: existing.id },
          data: validated,
        });
      } else {
        await prisma.siteSettings.create({ data: validated });
      }

      return NextResponse.json({ success: true, data: { message: "Site settings updated" } });
    }

    return NextResponse.json(
      { success: false, error: "Invalid settings type" },
      { status: 400 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.issues[0].message },
        { status: 400 }
      );
    }
    console.error("Error updating settings:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
