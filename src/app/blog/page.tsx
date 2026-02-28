import { Metadata } from "next";
import prisma from "@/lib/prisma";
import { PostGrid } from "@/components/blog/PostGrid";
import { Pagination } from "@/components/shared/Pagination";
import { CategoryBadge } from "@/components/shared/CategoryBadge";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Explore the latest articles on technology, AI, web development, and more.",
};

const POSTS_PER_PAGE = 9;

export default async function BlogPage({
  searchParams,
}: {
  searchParams: { page?: string; category?: string };
}) {
  const currentPage = Math.max(1, Number(searchParams.page) || 1);
  const categorySlug = searchParams.category;

  const where = {
    published: true,
    ...(categorySlug ? { category: { slug: categorySlug } } : {}),
  };

  const [posts, totalCount, categories] = await Promise.all([
    prisma.post.findMany({
      where,
      include: { author: true, category: true },
      orderBy: { createdAt: "desc" },
      skip: (currentPage - 1) * POSTS_PER_PAGE,
      take: POSTS_PER_PAGE,
    }),
    prisma.post.count({ where }),
    prisma.category.findMany({
      include: {
        _count: { select: { posts: { where: { published: true } } } },
      },
      orderBy: { name: "asc" },
    }),
  ]);

  const totalPages = Math.ceil(totalCount / POSTS_PER_PAGE);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight">Blog</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Explore our latest articles and insights.
        </p>
      </div>

      {/* Category Filters */}
      {categories.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2">
          <a
            href="/blog"
            className={`inline-flex items-center rounded-full px-4 py-1.5 text-sm font-medium transition ${
              !categorySlug
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            All
          </a>
          {categories.map((cat) => (
            <a
              key={cat.id}
              href={`/blog?category=${cat.slug}`}
              className={`transition ${
                categorySlug === cat.slug ? "opacity-100" : "opacity-80 hover:opacity-100"
              }`}
            >
              <CategoryBadge
                name={`${cat.name} (${cat._count.posts})`}
                color={cat.color}
                className="cursor-pointer"
              />
            </a>
          ))}
        </div>
      )}

      {/* Posts Grid */}
      {posts.length > 0 ? (
        <PostGrid posts={posts} />
      ) : (
        <div className="py-20 text-center">
          <p className="text-lg text-muted-foreground">No posts found.</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-12">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            baseUrl={categorySlug ? `/blog?category=${categorySlug}` : "/blog"}
          />
        </div>
      )}
    </div>
  );
}
