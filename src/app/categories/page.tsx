import { Metadata } from "next";
import Link from "next/link";
import prisma from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Categories",
  description: "Browse all blog categories.",
};

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    include: {
      _count: { select: { posts: { where: { published: true } } } },
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight">Categories</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Browse posts by category.
        </p>
      </div>

      {categories.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className="group rounded-lg border p-6 transition hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <span
                  className="inline-block h-4 w-4 rounded-full"
                  style={{ backgroundColor: cat.color }}
                />
                <h2 className="text-xl font-semibold group-hover:text-primary transition-colors">
                  {cat.name}
                </h2>
              </div>
              {cat.description && (
                <p className="mt-2 text-sm text-muted-foreground">
                  {cat.description}
                </p>
              )}
              <p className="mt-3 text-sm text-muted-foreground">
                {cat._count.posts} {cat._count.posts === 1 ? "post" : "posts"}
              </p>
            </Link>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center">
          <p className="text-lg text-muted-foreground">
            No categories yet.
          </p>
        </div>
      )}
    </div>
  );
}
