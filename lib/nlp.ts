import { redis } from "./redis";
import { WordTokenizer, TfIdf } from "natural";

const tokenizer = new WordTokenizer();

export async function generateSummary(content: string): Promise<string> {
  try {
    const cacheKey = `summary:${Buffer.from(content).toString("base64")}`;
    const cached: any = await redis.get(cacheKey);
    if (cached) return cached;

    const sentences = content
      .split(". ")
      .map((s) => s.trim())
      .filter(Boolean);
    const tfidf = new TfIdf();
    tfidf.addDocument(content);

    const scores = sentences.map((sentence) => {
      const tokens = tokenizer.tokenize(sentence.toLowerCase()) || [];
      let score = 0;
      tokens.forEach((token) => {
        tfidf.tfidfs(token, (i, measure) => {
          if (i === 0) score += measure;
        });
      });
      return score / (tokens.length || 1);
    });

    const topSentence =
      sentences[scores.indexOf(Math.max(...scores))] ||
      content.slice(0, 100) + "...";
    await redis.set(cacheKey, topSentence, { ex: 86400 });
    return topSentence;
  } catch (error) {
    console.error("Summary generation error:", error);
    return content.slice(0, 100) + "...";
  }
}

export async function generateTags(content: string): Promise<string[]> {
  try {
    const cacheKey = `tags:${Buffer.from(content).toString("base64")}`;
    const cached: any = await redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const tfidf = new TfIdf();
    tfidf.addDocument(content);
    const tokens = tokenizer.tokenize(content.toLowerCase()) || [];
    const termScores = new Map<string, number>();

    tokens.forEach((token) => {
      if (token.length > 3) {
        tfidf.tfidfs(token, (i, measure) => {
          if (i === 0)
            termScores.set(token, (termScores.get(token) || 0) + measure);
        });
      }
    });

    const topTerms = Array.from(termScores.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([term]) => term);

    await redis.set(cacheKey, JSON.stringify(topTerms), { ex: 86400 });
    return topTerms;
  } catch (error) {
    console.error("Tag generation error:", error);
    return [];
  }
}
