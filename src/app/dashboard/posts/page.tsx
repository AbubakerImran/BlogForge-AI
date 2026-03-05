import Link from "next/link";
import { Plus } from "lucide-react";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isSuperAdmin } from "@/lib/permissions";
import PostsTable from "@/components/dashboard/PostsTable";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Posts | Dashboard",
};

export default async function PostsPage() {
  const session = await getServerSession(authOptions);
  const isSA = session?.user ? isSuperAdmin(session.user.role) : false;

  // Admin sees only their own posts, superadmin sees all
  const postFilter = isSA ? {} : { authorId: session?.user?.id };

  const posts = await prisma.post.findMany({
    where: postFilter,
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { name: true, email: true } },
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
    author: post.author?.name ?? "Unknown",
    authorEmail: post.author?.email ?? "",
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

      <PostsTable posts={formattedPosts} isSuperAdmin={isSA} />
    </div>
  );
}
