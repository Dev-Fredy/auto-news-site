import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { MongoClient } from "mongodb";
import { scrapeNews } from "../../../lib/scraper";
import { summarizeArticle, categorizeArticle, analyzeSentiment, rewriteArticle, generateTags } from "../../../lib/customNLP";
import { factCheckArticle } from "../../../lib/factCheck";
import { incrementUserPoints } from "../../../lib/db";
import { captureException } from "../../../lib/sentry";

const uri = process.env.MONGODB_URI!;
const client = new MongoClient(uri);

export async function POST(request: Request) {
  try {
    const { userId } = getAuth(request);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { url } = await request.json();
    const articles = await scrapeNews(url);
    if (!articles.length) return NextResponse.json({ error: "No articles found" }, { status: 400 });

    const article = articles[0];
    const summary = await summarizeArticle(article.summary);
    const rewritten = await rewriteArticle(article.summary);
    const category = await categorizeArticle(article.summary);
    const sentiment = await analyzeSentiment(article.summary);
    const factCheck = await factCheckArticle(article.summary);
    const tags = await generateTags(article.summary);

    await client.connect();
    const db = client.db("news");
    await db.collection("submissions").insertOne({
      userId,
      url,
      title: article.title,
      summary,
      rewritten,
      category,
      sentiment,
      factCheck,
      tags,
      status: "pending",
      createdAt: new Date(),
    });
    await incrementUserPoints(userId, 20); // Award 20 points for submission
    return NextResponse.json({ message: "Submission received" });
  } catch (error) {
    captureException(error);
    return NextResponse.json({ error: "Failed to submit article" }, { status: 500 });
  } finally {
    await client.close();
  }
}