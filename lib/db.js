import { redis } from "./redis";
import { contentfulClient, contentfulManagementClient } from "./contentful";
import { generateTags } from "./nlp";

export async function saveArticle(article) {
  try {
    const environment = await contentfulManagementClient
      .getSpace(process.env.CONTENTFUL_SPACE_ID)
      .then((space) =>
        space.getEnvironment(
          process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT || "master"
        )
      );

    const tags = await generateTags(article.summary); // Use JS-based NLP

    const entry = await environment.createEntry("article", {
      fields: {
        title: { "en-US": article.title },
        summary: { "en-US": article.summary },
        category: { "en-US": article.category },
        url: { "en-US": article.url },
        source: { "en-US": article.source },
        createdAt: { "en-US": article.createdAt.toISOString() },
        views: { "en-US": article.views },
        sentiment: { "en-US": article.sentiment },
        tags: { "en-US": tags.join(",") },
      },
    });

    await entry.publish();
  } catch (error) {
    console.error("Contentful save error:", error);
    throw error;
  }
}

export async function getNews() {
  try {
    const cacheKey = "news";
    const cached = await redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const response = await contentfulClient.getEntries({
      content_type: "article",
      order: "-fields.createdAt",
      limit: 20,
    });

    const news = response.items.map((item) => ({
      _id: item.sys.id,
      title: item.fields.title?.["en-US"] || "",
      summary: item.fields.summary?.["en-US"] || "",
      category: item.fields.category?.["en-US"] || "General",
      url: item.fields.url?.["en-US"] || "",
      source: item.fields.source?.["en-US"] || "",
      createdAt: new Date(item.fields.createdAt?.["en-US"] || Date.now()),
      views: item.fields.views?.["en-US"] || 0,
      sentiment: item.fields.sentiment?.["en-US"] || "Neutral",
      tags: item.fields.tags?.["en-US"]?.split(",") || [],
    }));

    await redis.set(cacheKey, JSON.stringify(news), { ex: 300 });
    return news;
  } catch (error) {
    console.error("Contentful fetch error:", error);
    return [];
  }
}

export async function getArticleById(id) {
  try {
    const item = await contentfulClient.getEntry(id);
    return {
      _id: item.sys.id,
      title: item.fields.title?.["en-US"] || "",
      summary: item.fields.summary?.["en-US"] || "",
      category: item.fields.category?.["en-US"] || "General",
      url: item.fields.url?.["en-US"] || "",
      source: item.fields.source?.["en-US"] || "",
      createdAt: new Date(item.fields.createdAt?.["en-US"] || Date.now()),
      views: item.fields.views?.["en-US"] || 0,
      sentiment: item.fields.sentiment?.["en-US"] || "Neutral",
      tags: item.fields.tags?.["en-US"]?.split(",") || [],
    };
  } catch (error) {
    console.error("Contentful article fetch error:", error);
    return null;
  }
}
