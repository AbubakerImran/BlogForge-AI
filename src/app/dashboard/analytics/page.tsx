"use client";

import { useState, useEffect, useCallback } from "react";
import { DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import ViewsChart from "@/components/dashboard/ViewsChart";
import TopPostsChart from "@/components/dashboard/TopPostsChart";
import TrafficPieChart from "@/components/dashboard/TrafficPieChart";

interface AnalyticsData {
  viewsOverTime: { date: string; views: number }[];
  topPosts: { title: string; views: number }[];
  categoryBreakdown: { name: string; value: number; color: string }[];
  totalViews: number;
}

const deviceData = [
  { name: "Desktop", value: 45, color: "#3b82f6" },
  { name: "Mobile", value: 40, color: "#10b981" },
  { name: "Tablet", value: 15, color: "#f59e0b" },
];

const sourceData = [
  { name: "Organic", value: 55, color: "#3b82f6" },
  { name: "Social", value: 25, color: "#8b5cf6" },
  { name: "Direct", value: 15, color: "#10b981" },
  { name: "Referral", value: 5, color: "#f59e0b" },
];

type DateRange = "7d" | "30d" | "90d";

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState<DateRange>("30d");

  const fetchAnalytics = useCallback(async (r: DateRange) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/analytics?range=${r}`);
      if (res.ok) {
        const json = await res.json();
        const raw = json?.data ?? json;

        // Map API field names to the expected interface
        const totalViews = (raw.viewsByDate ?? raw.viewsOverTime ?? []).reduce(
          (sum: number, v: { count?: number; views?: number }) => sum + (v.count ?? v.views ?? 0),
          0
        );

        setData({
          viewsOverTime: (raw.viewsByDate ?? raw.viewsOverTime ?? []).map(
            (v: { date: string; count?: number; views?: number }) => ({
              date: v.date,
              views: v.count ?? v.views ?? 0,
            })
          ),
          topPosts: (raw.topPosts ?? []).map(
            (p: { title: string; views?: number; count?: number }) => ({
              title: p.title.length > 25 ? p.title.slice(0, 25) + "…" : p.title,
              views: p.views ?? p.count ?? 0,
            })
          ),
          categoryBreakdown: raw.categoryBreakdown ?? [],
          totalViews,
        });
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics(range);
  }, [range, fetchAnalytics]);

  function handleRangeChange(r: DateRange) {
    setRange(r);
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Skeleton className="h-9 w-40" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-20" />
          </div>
        </div>
        <Card>
          <CardHeader><Skeleton className="h-5 w-40" /></CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-32 mb-2" />
            <Skeleton className="h-4 w-48" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><Skeleton className="h-5 w-32" /></CardHeader>
          <CardContent><Skeleton className="h-[300px] w-full" /></CardContent>
        </Card>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader><Skeleton className="h-5 w-28" /></CardHeader>
            <CardContent><Skeleton className="h-[300px] w-full" /></CardContent>
          </Card>
          <Card>
            <CardHeader><Skeleton className="h-5 w-40" /></CardHeader>
            <CardContent><Skeleton className="h-[300px] w-full" /></CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const estimatedRevenue = data ? (data.totalViews * 0.02).toFixed(2) : "0.00";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <div className="flex gap-2">
          {(["7d", "30d", "90d"] as const).map((r) => (
            <Button
              key={r}
              variant={range === r ? "default" : "outline"}
              size="sm"
              onClick={() => handleRangeChange(r)}
            >
              {r === "7d" ? "7 Days" : r === "30d" ? "30 Days" : "90 Days"}
            </Button>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-500" />
            Estimated Revenue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">${estimatedRevenue}</p>
          <p className="text-sm text-muted-foreground">
            Based on {data?.totalViews.toLocaleString() ?? 0} views × $0.02 RPM
          </p>
        </CardContent>
      </Card>

      <ViewsChart data={data?.viewsOverTime ?? []} />

      <div className="grid gap-6 lg:grid-cols-2">
        <TopPostsChart data={data?.topPosts ?? []} />
        <TrafficPieChart title="Category Breakdown" data={data?.categoryBreakdown ?? []} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <TrafficPieChart title="Device Breakdown" data={deviceData} />
        <TrafficPieChart title="Traffic Sources" data={sourceData} />
      </div>
    </div>
  );
}
