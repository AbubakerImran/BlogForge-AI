import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { isAdminOrAbove, isSuperAdmin } from "@/lib/permissions";
import { z } from "zod";

export const dynamic = "force-dynamic";

const createTicketSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  issueType: z.string().min(1, "Issue type is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  attachment: z.string().optional(),
});

export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    // Superadmin sees all tickets, admin sees only their own
    const where = isSuperAdmin(session.user.role)
      ? status ? { status: status as "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED" } : {}
      : { userId: session.user.id, ...(status ? { status: status as "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED" } : {}) };

    const tickets = await prisma.supportTicket.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true, image: true } },
        _count: { select: { messages: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: tickets });
  } catch (error) {
    console.error("Error fetching tickets:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch tickets" },
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
    if (!isAdminOrAbove(session.user.role)) {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validated = createTicketSchema.parse(body);

    const ticket = await prisma.supportTicket.create({
      data: {
        userId: session.user.id,
        name: validated.name,
        email: validated.email,
        issueType: validated.issueType,
        description: validated.description,
        attachment: validated.attachment,
      },
    });

    return NextResponse.json({ success: true, data: ticket }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.issues[0].message },
        { status: 400 }
      );
    }
    console.error("Error creating ticket:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create ticket" },
      { status: 500 }
    );
  }
}
