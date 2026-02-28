"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PostEditor from "@/components/forms/PostEditor";

interface PostFormData {
  title: string;
  slug: string;
  content: string;
  categoryId: string;
  tags: string;
  featuredImage: string;
  excerpt: string;
  published: boolean;
  featured: boolean;
  aiSummary: string;
}

export default function NewPostPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(data: PostFormData) {
    setIsLoading(true);
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        router.push("/dashboard/posts");
        router.refresh();
      } else {
        const err = await res.json();
        alert(err.error || "Failed to create post");
      }
    } catch {
      alert("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Create New Post</h1>
      <PostEditor onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
}
