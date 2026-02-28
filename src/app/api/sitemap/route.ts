import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://blogforge.dev";

    const [posts, categories] = await Promise.all([
      prisma.post.findMany({
        where: { published: true },
        select: { slug: true, updatedAt: true },
        orderBy: { updatedAt: "desc" },
      }),
      prisma.category.findMany({
        select: { slug: true },
      }),
    ]);

    const staticPages = [
      { url: "", priority: "1.0" },
      { url: "/blog", priority: "0.9" },
      { url: "/about", priority: "0.7" },
      { url: "/contact", priority: "0.7" },
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages
  .map(
    (page) => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join("\n")}
${posts
  .map(
    (post) => `  <url>
    <loc>${baseUrl}/blog/${post.slug}</loc>
    <lastmod>${post.updatedAt.toISOString()}</lastmod>
    <priority>0.8</priority>
  </url>`
  )
  .join("\n")}
${categories
  .map(
    (cat) => `  <url>
    <loc>${baseUrl}/categories/${cat.slug}</loc>
    <priority>0.6</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

    return new NextResponse(xml, {
      headers: { "Content-Type": "application/xml" },
    });
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate sitemap" },
      { status: 500 }
    );
  }
}
