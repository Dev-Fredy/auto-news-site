import { NextResponse } from "next/server";
import { scrapeNews } from "@/lib/scraper";
import { summarizeArticle, categorizeArticle, analyzeSentiment, rewriteArticle, generateTags } from "@/lib/customNLP";
import { factCheckArticle } from "@/lib/factCheck";
import { saveArticle } from "@/lib/db";
import { postToTwitter, postToFacebook } from "@/lib/social";
import { sendNotification } from "@/lib/notifications";
import { captureException } from "@/lib/sentry";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI!;
const client = new MongoClient(uri);

export async function POST() {
  try {
    const sources = ["https://www.bbc.com/news", "https://www.reuters.com"];
    for (const source of sources) {
      const articles = await scrapeNews(source);
      for (const article of articles) {
        const summary = await summarizeArticle(article.summary);
        const rewritten = await rewriteArticle(article.summary);
        const category = await categorizeArticle(article.summary);
        const sentiment = await analyzeSentiment(article.summary);
        const factCheck = await factCheckArticle(article.summary);
        const tags = await generateTags(article.summary);
        const articleData = {
          ...article,
          summary,
          rewritten,
          category,
          sentiment,
          factCheck,
          tags,
          createdAt: new Date(),
          views: 0,
        };
        await saveArticle(articleData);
        await postToTwitter(articleData);
        await postToFacebook(articleData);
        await client.connect();
        const subscriptions = await client
          .db("news")
          .collection("subscriptions")
          .find({})
          .toArray();
        for (const sub of subscriptions) {
          await sendNotification(sub, articleData);
        }
      }
    }
    return NextResponse.json({ message: "News fetched and posted" });
  } catch (error) {
    captureException(error);
    return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 });
  } finally {
    await client.close();
  }
}