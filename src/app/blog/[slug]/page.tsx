import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { getSiteSettings } from "@/lib/site-settings";
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
import { Github, Twitter, Linkedin } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
    include: { author: true, tags: true, category: true },
  });
  const settings = await getSiteSettings();

  if (!post) return { title: "Post Not Found" };

  const url = `${settings.siteUrl}/blog/${post.slug}`;
  const description = post.excerpt || post.title;
  const keywords = post.tags.map((tag) => tag.name);

  return {
    title: post.title,
    description,
    authors: [{ name: post.author.name || settings.siteAuthor }],
    keywords: keywords.length > 0 ? keywords : undefined,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description,
      url,
      siteName: settings.siteName,
      type: "article",
      publishedTime: post.createdAt.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      authors: [post.author.name || settings.siteAuthor],
      section: post.category?.name,
      tags: keywords.length > 0 ? keywords : undefined,
      images: post.featuredImage ? [{ url: post.featuredImage }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
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

  const settings = await getSiteSettings();

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
  const postUrl = `${settings.siteUrl}/blog/${post.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt || post.title,
    image: post.featuredImage || undefined,
    datePublished: post.createdAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    wordCount: post.content.replace(/<[^>]*>/g, "").split(/\s+/).filter(Boolean).length,
    keywords: post.tags.length > 0 ? post.tags.map((tag) => tag.name).join(", ") : undefined,
    articleSection: post.category?.name || undefined,
    author: {
      "@type": "Person",
      name: post.author.name || "Anonymous",
    },
    publisher: {
      "@type": "Organization",
      name: settings.siteName,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": postUrl,
    },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: settings.siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${settings.siteUrl}/blog`,
      },
      ...(post.category
        ? [
            {
              "@type": "ListItem",
              position: 3,
              name: post.category.name,
              item: `${settings.siteUrl}/category/${post.category.slug}`,
            },
            {
              "@type": "ListItem",
              position: 4,
              name: post.title,
              item: postUrl,
            },
          ]
        : [
            {
              "@type": "ListItem",
              position: 3,
              name: post.title,
              item: postUrl,
            },
          ]),
    ],
  };

  return (
    <>
      <ReadingProgress />
      <TrackView postId={post.id} slug={post.slug} />
      <JsonLd data={jsonLd} />
      <JsonLd data={breadcrumbLd} />

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
            {(post.author.twitterUrl || post.author.githubUrl || post.author.linkedinUrl) && (
              <div className="flex items-center gap-2">
                <span>·</span>
                {post.author.twitterUrl && (
                  <a href={post.author.twitterUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Twitter">
                    <Twitter className="h-4 w-4" />
                  </a>
                )}
                {post.author.githubUrl && (
                  <a href={post.author.githubUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="GitHub">
                    <Github className="h-4 w-4" />
                  </a>
                )}
                {post.author.linkedinUrl && (
                  <a href={post.author.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="LinkedIn">
                    <Linkedin className="h-4 w-4" />
                  </a>
                )}
              </div>
            )}
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
