import Link from "next/link";
import { FileText, Eye, Mail, DollarSign, Plus, ExternalLink } from "lucide-react";
import prisma from "@/lib/prisma";
import KPICard from "@/components/dashboard/KPICard";
import ViewsChart from "@/components/dashboard/ViewsChart";
import TopPostsChart from "@/components/dashboard/TopPostsChart";
import RecentActivity from "@/components/dashboard/RecentActivity";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

export default async function DashboardPage() {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [totalPosts, monthlyViews, subscriberCount, topPosts, recentPosts, recentSubscribers, dailyViews] =
    await Promise.all([
      prisma.post.count(),
      prisma.pageView.count({
        where: { createdAt: { gte: thirtyDaysAgo } },
      }),
      prisma.newsletter.count({ where: { active: true } }),
      prisma.post.findMany({
        orderBy: { views: "desc" },
        take: 5,
        select: { title: true, views: true },
      }),
      prisma.post.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { title: true, createdAt: true },
      }),
      prisma.newsletter.findMany({
        orderBy: { createdAt: "desc" },
        take: 3,
        select: { email: true, createdAt: true },
      }),
      prisma.pageView.groupBy({
        by: ["createdAt"],
        where: { createdAt: { gte: thirtyDaysAgo } },
        _count: { id: true },
      }),
    ]);

  const estimatedRevenue = (monthlyViews * 0.02).toFixed(2);

  // Aggregate views by date
  const viewsByDate = new Map<string, number>();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const key = d.toISOString().slice(0, 10);
    viewsByDate.set(key, 0);
  }
  dailyViews.forEach((row) => {
    const key = new Date(row.createdAt).toISOString().slice(0, 10);
    viewsByDate.set(key, (viewsByDate.get(key) || 0) + row._count.id);
  });

  const viewsChartData = Array.from(viewsByDate.entries()).map(([date, views]) => ({
    date: new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    views,
  }));

  const topPostsData = topPosts.map((p) => ({
    title: p.title.length > 25 ? p.title.slice(0, 25) + "…" : p.title,
    views: p.views,
  }));

  const activities = [
    ...recentPosts.map((p) => ({
      type: "post" as const,
      description: `Published "${p.title}"`,
      time: formatDate(p.createdAt),
    })),
    ...recentSubscribers.map((s) => ({
      type: "subscriber" as const,
      description: `New subscriber: ${s.email}`,
      time: formatDate(s.createdAt),
    })),
  ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/dashboard/posts/new">
              <Plus className="mr-2 h-4 w-4" />
              New Post
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/" target="_blank">
              <ExternalLink className="mr-2 h-4 w-4" />
              View Site
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Posts"
          value={totalPosts}
          change={`${totalPosts} published`}
          changeType="neutral"
          icon={FileText}
        />
        <KPICard
          title="Monthly Views"
          value={monthlyViews.toLocaleString()}
          change="Last 30 days"
          changeType="positive"
          icon={Eye}
        />
        <KPICard
          title="Subscribers"
          value={subscriberCount.toLocaleString()}
          change="Active subscribers"
          changeType="positive"
          icon={Mail}
        />
        <KPICard
          title="Est. Revenue"
          value={`$${estimatedRevenue}`}
          change="Based on views"
          changeType="positive"
          icon={DollarSign}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ViewsChart data={viewsChartData} />
        <TopPostsChart data={topPostsData} />
      </div>

      <RecentActivity activities={activities} />
    </div>
  );
}
