import { Metadata } from "next";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { PostGrid } from "@/components/blog/PostGrid";
import { Pagination } from "@/components/shared/Pagination";

const POSTS_PER_PAGE = 9;

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const category = await prisma.category.findFirst({
    where: { slug: params.slug },
  });

  if (!category) return { title: "Category Not Found" };

  return {
    title: category.name,
    description:
      category.description || `Browse posts in the ${category.name} category.`,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { page?: string };
}) {
  const category = await prisma.category.findFirst({
    where: { slug: params.slug },
  });

  if (!category) notFound();

  const currentPage = Math.max(1, Number(searchParams.page) || 1);

  const [posts, totalCount] = await Promise.all([
    prisma.post.findMany({
      where: { published: true, categoryId: category.id },
      include: { author: true, category: true },
      orderBy: { createdAt: "desc" },
      skip: (currentPage - 1) * POSTS_PER_PAGE,
      take: POSTS_PER_PAGE,
    }),
    prisma.post.count({
      where: { published: true, categoryId: category.id },
    }),
  ]);

  const totalPages = Math.ceil(totalCount / POSTS_PER_PAGE);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Category Header */}
      <div className="mb-10">
        <div
          className="mb-4 inline-block rounded-full px-4 py-1 text-sm font-semibold text-white"
          style={{ backgroundColor: category.color }}
        >
          Category
        </div>
        <h1 className="text-4xl font-bold tracking-tight">{category.name}</h1>
        {category.description && (
          <p className="mt-2 text-lg text-muted-foreground">
            {category.description}
          </p>
        )}
        <p className="mt-1 text-sm text-muted-foreground">
          {totalCount} {totalCount === 1 ? "post" : "posts"}
        </p>
      </div>

      {/* Posts Grid */}
      {posts.length > 0 ? (
        <PostGrid posts={posts} />
      ) : (
        <div className="py-20 text-center">
          <p className="text-lg text-muted-foreground">
            No posts in this category yet.
          </p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-12">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            baseUrl={`/category/${category.slug}`}
          />
        </div>
      )}
    </div>
  );
}
