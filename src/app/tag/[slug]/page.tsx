import { Metadata } from "next";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { PostGrid } from "@/components/blog/PostGrid";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const tag = await prisma.tag.findUnique({
    where: { slug: params.slug },
  });

  if (!tag) return { title: "Tag Not Found" };

  return {
    title: `#${tag.name}`,
    description: `Browse all posts tagged with #${tag.name}.`,
  };
}

export default async function TagPage({
  params,
}: {
  params: { slug: string };
}) {
  const tag = await prisma.tag.findUnique({
    where: { slug: params.slug },
    include: {
      posts: {
        where: { published: true },
        include: { author: true, category: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!tag) notFound();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Tag Header */}
      <div className="mb-10">
        <div className="mb-4 inline-block rounded-full bg-muted px-4 py-1 text-sm font-semibold">
          Tag
        </div>
        <h1 className="text-4xl font-bold tracking-tight">#{tag.name}</h1>
        <p className="mt-2 text-muted-foreground">
          {tag.posts.length} {tag.posts.length === 1 ? "post" : "posts"} tagged
          with #{tag.name}
        </p>
      </div>

      {/* Posts Grid */}
      {tag.posts.length > 0 ? (
        <PostGrid posts={tag.posts} />
      ) : (
        <div className="py-20 text-center">
          <p className="text-lg text-muted-foreground">
            No posts with this tag yet.
          </p>
        </div>
      )}
    </div>
  );
}
