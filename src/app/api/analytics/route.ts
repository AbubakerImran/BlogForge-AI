import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
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

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [viewsByDate, topPosts, deviceBreakdown, countryBreakdown, trafficSources] =
      await Promise.all([
        prisma.pageView.groupBy({
          by: ["createdAt"],
          where: { createdAt: { gte: thirtyDaysAgo } },
          _count: { id: true },
          orderBy: { createdAt: "asc" },
        }),
        prisma.post.findMany({
          orderBy: { views: "desc" },
          take: 10,
          select: { id: true, title: true, slug: true, views: true },
        }),
        prisma.pageView.groupBy({
          by: ["device"],
          where: { createdAt: { gte: thirtyDaysAgo } },
          _count: { id: true },
        }),
        prisma.pageView.groupBy({
          by: ["country"],
          where: { createdAt: { gte: thirtyDaysAgo } },
          _count: { id: true },
          orderBy: { _count: { id: "desc" } },
          take: 20,
        }),
        prisma.pageView.groupBy({
          by: ["referrer"],
          where: { createdAt: { gte: thirtyDaysAgo } },
          _count: { id: true },
          orderBy: { _count: { id: "desc" } },
          take: 20,
        }),
      ]);

    // Normalize views by date to group by day
    const viewsByDay = viewsByDate.reduce<Record<string, number>>(
      (acc, view) => {
        const date = new Date(view.createdAt).toISOString().split("T")[0];
        acc[date] = (acc[date] || 0) + view._count.id;
        return acc;
      },
      {}
    );

    return NextResponse.json({
      success: true,
      data: {
        viewsByDate: Object.entries(viewsByDay).map(([date, count]) => ({
          date,
          count,
        })),
        topPosts,
        deviceBreakdown: deviceBreakdown.map((d) => ({
          device: d.device || "unknown",
          count: d._count.id,
        })),
        countryBreakdown: countryBreakdown.map((c) => ({
          country: c.country || "unknown",
          count: c._count.id,
        })),
        trafficSources: trafficSources.map((s) => ({
          source: s.referrer || "direct",
          count: s._count.id,
        })),
      },
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
