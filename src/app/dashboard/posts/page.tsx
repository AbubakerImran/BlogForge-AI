import Link from "next/link";
import { Plus } from "lucide-react";
import prisma from "@/lib/prisma";
import PostsTable from "@/components/dashboard/PostsTable";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Posts | Dashboard | BlogForge AI",
};

export default async function PostsPage() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { name: true } },
      category: { select: { name: true } },
    },
  });

  const formattedPosts = posts.map((post) => ({
    id: post.id,
    title: post.title,
    slug: post.slug,
    published: post.published,
    featured: post.featured,
    views: post.views,
    category: post.category?.name ?? "Uncategorized",
    createdAt: post.createdAt.toISOString(),
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Posts</h1>
        <Button asChild>
          <Link href="/dashboard/posts/new">
            <Plus className="mr-2 h-4 w-4" />
            Create New Post
          </Link>
        </Button>
      </div>

      <PostsTable posts={formattedPosts} />
    </div>
  );
}
