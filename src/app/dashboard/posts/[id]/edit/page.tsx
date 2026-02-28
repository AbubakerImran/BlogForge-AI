"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import PostEditor from "@/components/forms/PostEditor";

interface PostData {
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

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [initialData, setInitialData] = useState<PostData | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchPost() {
      try {
        const res = await fetch(`/api/posts/${id}`);
        if (!res.ok) {
          setNotFound(true);
          return;
        }
        const post = await res.json();
        setInitialData({
          title: post.title || "",
          slug: post.slug || "",
          content: post.content || "",
          categoryId: post.categoryId || "",
          tags: post.tags?.map((t: { name: string }) => t.name).join(", ") || "",
          featuredImage: post.featuredImage || "",
          excerpt: post.excerpt || "",
          published: post.published ?? false,
          featured: post.featured ?? false,
          aiSummary: post.aiSummary || "",
        });
      } catch {
        setNotFound(true);
      }
    }
    fetchPost();
  }, [id]);

  async function handleSubmit(data: PostData) {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        router.push("/dashboard/posts");
        router.refresh();
      } else {
        const err = await res.json();
        alert(err.error || "Failed to update post");
      }
    } catch {
      alert("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  if (notFound) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-lg text-muted-foreground">Post not found.</p>
      </div>
    );
  }

  if (!initialData) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Edit Post</h1>
      <PostEditor
        initialData={initialData}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}
