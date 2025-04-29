import * as cheerio from 'cheerio';
import puppeteer from "puppeteer";
import { summarizeArticle, categorizeArticle, analyzeSentiment, rewriteArticle, generateTags } from "./customNLP";

export async function scrapeNews(url: string) {
  const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"] });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle2" });
  const content = await page.content();
  const $ = cheerio.load(content);
  const articles:any[] = [];
  $("article").each((i:any, element:any) => {
    const title = $(element).find("h2").text().trim();
    const summary = $(element).find("p").text().trim();
    const link = $(element).find("a").attr("href") || "";
    if (title && summary) articles.push({ title, summary, url: link, source: url });
  });
  await browser.close();

  const batchSize = 5;
  for (let i = 0; i < articles.length; i += batchSize) {
    const batch = articles.slice(i, i + batchSize);
    await Promise.all(
      batch.map(async (article) => {
        article.summary = await summarizeArticle(article.summary);
        article.rewritten = await rewriteArticle(article.summary);
        article.category = await categorizeArticle(article.summary);
        article.sentiment = await analyzeSentiment(article.summary);
        article.tags = await generateTags(article.summary);
      })
    );
  }
  return articles;
}