import Link from "next/link";
import { Metadata } from "next";
import prisma from "@/lib/prisma";
import { siteConfig } from "@/lib/constants";
import { FeaturedPost } from "@/components/blog/FeaturedPost";
import { PostCard } from "@/components/blog/PostCard";
import { PostGrid } from "@/components/blog/PostGrid";
import { AdPlaceholder } from "@/components/blog/AdPlaceholder";
import NewsletterForm from "@/components/forms/NewsletterForm";

export const metadata: Metadata = {
  title: `${siteConfig.name} — AI-Powered Content Platform`,
  description: siteConfig.description,
};

export default async function HomePage() {
  const [featuredPosts, trendingPosts, categories, latestPosts] =
    await Promise.all([
      prisma.post.findMany({
        where: { published: true, featured: true },
        include: { author: true, category: true },
        orderBy: { createdAt: "desc" },
        take: 3,
      }),
      prisma.post.findMany({
        where: { published: true },
        include: { author: true, category: true },
        orderBy: { views: "desc" },
        take: 6,
      }),
      prisma.category.findMany({
        include: { _count: { select: { posts: { where: { published: true } } } } },
        take: 6,
      }),
      prisma.post.findMany({
        where: { published: true },
        include: { author: true, category: true },
        orderBy: { createdAt: "desc" },
        take: 6,
      }),
    ]);

  const categoryColors = [
    "border-blue-500",
    "border-purple-500",
    "border-green-500",
    "border-orange-500",
    "border-pink-500",
    "border-teal-500",
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 text-white">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              {siteConfig.name}
            </h1>
            <p className="mt-4 text-xl font-semibold text-blue-100">
              AI-Powered Content Platform
            </p>
            <p className="mt-6 text-lg leading-relaxed text-blue-100/90">
              Discover insightful articles enhanced by artificial intelligence.
              From technology to lifestyle, explore content that&apos;s
              intelligently curated, summarized, and optimized for you.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/blog"
                className="inline-flex h-12 items-center justify-center rounded-lg bg-white px-8 text-base font-semibold text-blue-700 shadow-lg transition hover:bg-blue-50"
              >
                Read Blog
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex h-12 items-center justify-center rounded-lg border-2 border-white/30 px-8 text-base font-semibold text-white transition hover:bg-white/10"
              >
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-3xl font-bold tracking-tight">
            Featured Posts
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {featuredPosts.map((post) => (
              <FeaturedPost key={post.id} post={post} />
            ))}
          </div>
        </section>
      )}

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AdPlaceholder variant="banner" />
      </div>

      {/* Trending Now */}
      {trendingPosts.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">
              🔥 Trending Now
            </h2>
            <Link
              href="/blog"
              className="text-sm font-medium text-primary hover:underline"
            >
              View all →
            </Link>
          </div>
          <PostGrid posts={trendingPosts} />
        </section>
      )}

      {/* Categories */}
      {categories.length > 0 && (
        <section className="bg-muted/50 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-8 text-center text-3xl font-bold tracking-tight">
              Explore Categories
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((category, i) => (
                <Link
                  key={category.id}
                  href={`/category/${category.slug}`}
                  className={`group rounded-xl border-l-4 ${categoryColors[i % categoryColors.length]} bg-card p-6 shadow-sm transition hover:shadow-md`}
                >
                  <h3 className="text-lg font-semibold group-hover:text-primary">
                    {category.name}
                  </h3>
                  {category.description && (
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                      {category.description}
                    </p>
                  )}
                  <p className="mt-3 text-sm font-medium text-muted-foreground">
                    {category._count.posts}{" "}
                    {category._count.posts === 1 ? "post" : "posts"}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AdPlaceholder variant="banner" />
      </div>

      {/* Latest Posts */}
      {latestPosts.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">Latest Posts</h2>
            <Link
              href="/blog"
              className="text-sm font-medium text-primary hover:underline"
            >
              View all →
            </Link>
          </div>
          <PostGrid posts={latestPosts} />
        </section>
      )}

      {/* Newsletter CTA */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-16 text-white">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight">
            Stay in the Loop
          </h2>
          <p className="mt-4 text-lg text-blue-100">
            Get the latest articles, AI insights, and updates delivered straight
            to your inbox. No spam, ever.
          </p>
          <div className="mt-8">
            <NewsletterForm />
          </div>
        </div>
      </section>
    </>
  );
}
