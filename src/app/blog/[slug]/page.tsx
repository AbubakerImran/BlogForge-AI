import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { siteConfig } from "@/lib/constants";
import { formatDate, calculateReadTime } from "@/lib/utils";
import { ReadingProgress } from "@/components/blog/ReadingProgress";
import { AISummaryBox } from "@/components/blog/AISummaryBox";
import { TableOfContents } from "@/components/blog/TableOfContents";
import { ShareButtons } from "@/components/blog/ShareButtons";
import { RelatedPosts } from "@/components/blog/RelatedPosts";
import { AdPlaceholder } from "@/components/blog/AdPlaceholder";
import { CategoryBadge } from "@/components/shared/CategoryBadge";
import { JsonLd } from "@/components/shared/JsonLd";
import { TrackView } from "./track-view";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
    include: { author: true },
  });

  if (!post) return { title: "Post Not Found" };

  const url = `${siteConfig.url}/blog/${post.slug}`;

  return {
    title: post.title,
    description: post.excerpt || undefined,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.excerpt || undefined,
      url,
      type: "article",
      images: post.featuredImage ? [{ url: post.featuredImage }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt || undefined,
      images: post.featuredImage ? [post.featuredImage] : undefined,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug, published: true },
    include: {
      author: true,
      category: true,
      tags: true,
    },
  });

  if (!post) notFound();

  const relatedPosts = post.categoryId
    ? await prisma.post.findMany({
        where: {
          published: true,
          categoryId: post.categoryId,
          id: { not: post.id },
        },
        include: { author: true, category: true },
        orderBy: { createdAt: "desc" },
        take: 3,
      })
    : [];

  const readTime = calculateReadTime(post.content);
  const postUrl = `${siteConfig.url}/blog/${post.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt || undefined,
    image: post.featuredImage || undefined,
    datePublished: post.createdAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: {
      "@type": "Person",
      name: post.author.name || "Anonymous",
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": postUrl,
    },
  };

  return (
    <>
      <ReadingProgress />
      <TrackView postId={post.id} slug={post.slug} />
      <JsonLd data={jsonLd} />

      <article className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-muted-foreground">
          <ol className="flex items-center gap-2">
            <li>
              <Link href="/" className="hover:text-primary">
                Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/blog" className="hover:text-primary">
                Blog
              </Link>
            </li>
            <li>/</li>
            <li className="truncate text-foreground">{post.title}</li>
          </ol>
        </nav>

        {/* Article Header */}
        <header className="mb-10">
          {post.category && (
            <div className="mb-4">
              <CategoryBadge
                name={post.category.name}
                color={post.category.color}
                slug={post.category.slug}
              />
            </div>
          )}
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            {post.title}
          </h1>
          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-sm font-bold text-white">
                {(post.author.name || "A").charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-medium text-foreground">
                  {post.author.name || "Anonymous"}
                </p>
                <p>{formatDate(post.createdAt)}</p>
              </div>
            </div>
            <span>·</span>
            <span>{readTime} min read</span>
          </div>
        </header>

        {/* Featured Image */}
        {post.featuredImage && (
          <div className="mb-10 overflow-hidden rounded-xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.featuredImage}
              alt={post.title}
              className="h-auto w-full object-cover"
            />
          </div>
        )}

        {/* AI Summary */}
        {post.aiSummary && (
          <div className="mb-10">
            <AISummaryBox summary={post.aiSummary} />
          </div>
        )}

        {/* Two-column layout */}
        <div className="lg:grid lg:grid-cols-[1fr_300px] lg:gap-10">
          {/* Main Content */}
          <div>
            <div
              className="prose prose-lg max-w-none dark:prose-invert prose-headings:scroll-mt-20 prose-a:text-primary"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            <div className="my-10">
              <AdPlaceholder variant="in-article" />
            </div>

            {/* Share Buttons */}
            <div className="mt-10 border-t pt-6">
              <ShareButtons url={postUrl} title={post.title} />
            </div>

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Link
                    key={tag.id}
                    href={`/tag/${tag.slug}`}
                    className="rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground transition hover:bg-muted/80"
                  >
                    #{tag.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="mt-10 lg:mt-0">
            <div className="sticky top-24 space-y-8">
              <TableOfContents content={post.content} />
              <AdPlaceholder variant="sidebar" />
            </div>
          </aside>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-16 border-t pt-10">
            <RelatedPosts posts={relatedPosts} />
          </div>
        )}
      </article>
    </>
  );
}
