import { NextResponse } from "next/server";
import { getTrendingTopics } from "@/lib/customNLP";
import { getNews } from "@/lib/db";
import { captureException } from "@/lib/sentry";

export async function GET() {
  try {
    const news = await getNews();
    const articleSummaries = news.map((article: any) => article.summary);
    const trending = await getTrendingTopics(articleSummaries);
    return NextResponse.json({ trending });
  } catch (error) {
    captureException(error);
    return NextResponse.json({ error: "Failed to fetch trending topics" }, { status: 500 });
  }
}