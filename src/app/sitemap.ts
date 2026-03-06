import { MetadataRoute } from "next";
import prisma from "@/lib/prisma";
import { getSiteSettings } from "@/lib/site-settings";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const settings = await getSiteSettings();
  const [posts, categories] = await Promise.all([
    prisma.post.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.category.findMany({
      select: { slug: true, createdAt: true },
    }),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: settings.siteUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${settings.siteUrl}/blog`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${settings.siteUrl}/categories`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${settings.siteUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${settings.siteUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${settings.siteUrl}/privacy-policy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];

  const postPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${settings.siteUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const categoryPages: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${settings.siteUrl}/category/${cat.slug}`,
    lastModified: cat.createdAt,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticPages, ...postPages, ...categoryPages];
}
