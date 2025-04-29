import { NextResponse } from "next/server";
import { getNews } from "../../../lib/db";

export async function GET() {
  const news = await getNews();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  ${news
    .map(
      (article: any) => `
  <url>
    <loc>${baseUrl}/article/${article._id}</loc>
    <lastmod>${article.createdAt.toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
    )
    .join("")}
</urlset>`;

  return new NextResponse(sitemap, {
    headers: { "Content-Type": "application/xml" },
  });
}