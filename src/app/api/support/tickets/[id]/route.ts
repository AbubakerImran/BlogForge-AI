import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { isAdminOrAbove, isSuperAdmin } from "@/lib/permissions";

export const dynamic = "force-dynamic";

export async function GET(
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

    const ticket = await prisma.supportTicket.findUnique({
      where: { id: params.id },
      include: {
        user: { select: { id: true, name: true, email: true, image: true } },
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!ticket) {
      return NextResponse.json(
        { success: false, error: "Ticket not found" },
        { status: 404 }
      );
    }

    // Admin can only see their own tickets
    if (!isSuperAdmin(session.user.role) && ticket.userId !== session.user.id) {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    return NextResponse.json({ success: true, data: ticket });
  } catch (error) {
    console.error("Error fetching ticket:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch ticket" },
      { status: 500 }
    );
  }
}

export async function PATCH(
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
    if (!isSuperAdmin(session.user.role)) {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { status } = body;

    if (!["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"].includes(status)) {
      return NextResponse.json(
        { success: false, error: "Invalid status" },
        { status: 400 }
      );
    }

    const ticket = await prisma.supportTicket.update({
      where: { id: params.id },
      data: { status },
    });

    return NextResponse.json({ success: true, data: ticket });
  } catch (error) {
    console.error("Error updating ticket:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update ticket" },
      { status: 500 }
    );
  }
}
