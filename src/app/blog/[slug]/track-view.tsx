"use client";

import { useEffect } from "react";
import { useViewerToken } from "@/components/shared/ViewerTokenProvider";

export function TrackView({ postId, slug }: { postId: string; slug: string }) {
  const viewerToken = useViewerToken();

  useEffect(() => {
    if (!viewerToken) return;

    fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId, page: `/blog/${slug}`, viewerToken }),
    }).catch(() => {
      // Silently fail — tracking is non-critical
    });
  }, [postId, slug, viewerToken]);

  return null;
}
