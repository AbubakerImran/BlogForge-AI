"use client";

import { useEffect } from "react";

export function TrackView({ postId, slug }: { postId: string; slug: string }) {
  useEffect(() => {
    fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId, page: `/blog/${slug}` }),
    }).catch(() => {
      // Silently fail — tracking is non-critical
    });
  }, [postId, slug]);

  return null;
}
