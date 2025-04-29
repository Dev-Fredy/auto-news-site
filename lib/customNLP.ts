import { Redis } from "@upstash/redis";
import { captureException } from "./sentry";
import { Tokenizer, TFIDF, WordTokenizer } from "natural";
import nlp from "compromise";

const redis = new Redis({ url: process.env.REDIS_URL! });
const tokenizer = new WordTokenizer();

// Category keyword dictionary
const categoryDict: { [key: string]: string[] } = {
  Politics: ["government", "election", "policy", "congress", "president", "politics"],
  Sports: ["game", "team", "score", "athlete", "tournament", "sport"],
  Technology: ["tech", "software", "gadget", "innovation", "ai", "technology"],
  Business: ["market", "economy", "company", "profit", "stock", "business"],
  Entertainment: ["movie", "music", "celebrity", "show", "festival", "entertainment"],
};

// Sentiment lexicon
const sentimentDict: { [key: string]: number } = {
  good: 1,
  great: 1,
  excellent: 1,
  bad: -1,
  terrible: -1,
  awful: -1,
  neutral: 0,
};

// Translation dictionary with phrases
const translationDict: { [key: string]: { [key: string]: string } } = {
  spanish: {
    technology: "tecnología",
    government: "gobierno",
    game: "juego",
    market: "mercado",
    movie: "película",
    "breaking news": "noticias de última hora",
    "new technology": "nueva tecnología",
  },
  french: {
    technology: "technologie",
    government: "gouvernement",
    game: "jeu",
    market: "marché",
    movie: "film",
    "breaking news": "nouvelles de dernière heure",
    "new technology": "nouvelle technologie",
  },
  german: {
    technology: "Technologie",
    government: "Regierung",
    game: "Spiel",
    market: "Markt",
    movie: "Film",
    "breaking news": "Eilmeldungen",
    "new technology": "neue Technologie",
  },
};

// Summarize article
export async function summarizeArticle(content: string): Promise<string> {
  try {
    const cacheKey = `summary:${Buffer.from(content).toString("base64")}`;
    const cached = await redis.get(cacheKey);
    if (cached) return cached;

    const sentences = content.split(/[.!?]+/).filter((s) => s.trim().length > 10);
    if (sentences.length === 0) return content.slice(0, 100) + "...";

    const tfidf = new TFIDF();
    sentences.forEach((sentence, i) => tfidf.addDocument(sentence, { vocabularySize: 1000 }));

    const scores = sentences.map((sentence, i) => {
      let score = 0;
      tfidf.tfidfs(sentence, (j, measure) => {
        if (j === i) score += measure;
      });
      score += (sentences.length - i) / sentences.length;
      return { sentence, score };
    });

    const topSentences = scores
      .sort((a, b) => b.score - a.score)
      .slice(0, 2)
      .map((s) => s.sentence)
      .join(". ");
    const result = topSentences.length > 100 ? topSentences.slice(0, 100) + "..." : topSentences;
    await redis.set(cacheKey, result, { ex: 86400 });
    return result;
  } catch (error) {
    captureException(error);
    console.error("Summarization error:", error);
    return content.slice(0, 100) + "...";
  }
}

// Rewrite article
export async function rewriteArticle(content: string): Promise<string> {
  try {
    const cacheKey = `rewrite:${Buffer.from(content).toString("base64")}`;
    const cached = await redis.get(cacheKey);
    if (cached) return cached;

    const doc = nlp(content);
    const terms = doc.terms().data();
    let rewritten = content;

    terms.forEach((term: any) => {
      const word = term.text.toLowerCase();
      const synonyms = nlp(word).nouns().synonyms().data()[0]?.synonyms || [];
      if (synonyms.length > 0) {
        const synonym = synonyms[Math.floor(Math.random() * synonyms.length)];
        rewritten = rewritten.replace(new RegExp(`\\b${word}\\b`, "gi"), synonym);
      }
    });

    const sentences = rewritten.split(/[.!?]+/).filter((s) => s.trim());
    if (sentences.length > 1) {
      const shuffled = sentences.sort(() => Math.random() - 0.5).join(". ");
      rewritten = shuffled;
    }

    const result = rewritten.length > 100 ? rewritten.slice(0, 100) + "..." : rewritten;
    await redis.set(cacheKey, result, { ex: 86400 });
    return result;
  } catch (error) {
    captureException(error);
    console.error("Rewriting error:", error);
    return content;
  }
}

// Categorize article
export async function categorizeArticle(content: string): Promise<string> {
  try {
    const cacheKey = `category:${Buffer.from(content).toString("base64")}`;
    const cached = await redis.get(cacheKey);
    if (cached) return cached;

    const tokens = tokenizer.tokenize(content.toLowerCase());
    let maxScore = 0;
    let category = "General";

    for (const [cat, keywords] of Object.entries(categoryDict)) {
      const score = keywords.reduce((acc, keyword) => {
        return acc + (tokens.includes(keyword) ? 1 : 0);
      }, 0);
      if (score > maxScore) {
        maxScore = score;
        category = cat;
      }
    }

    await redis.set(cacheKey, category, { ex: 86400 });
    return category;
  } catch (error) {
    captureException(error);
    console.error("Categorization error:", error);
    return "General";
  }
}

// Analyze sentiment
export async function analyzeSentiment(content: string): Promise<string> {
  try {
    const cacheKey = `sentiment:${Buffer.from(content).toString("base64")}`;
    const cached = await redis.get(cacheKey);
    if (cached) return cached;

    const tokens = tokenizer.tokenize(content.toLowerCase());
    let score = 0;
    tokens.forEach((token) => {
      if (sentimentDict[token]) score += sentimentDict[token];
    });

    const result = score > 0 ? "Positive" : score < 0 ? "Negative" : "Neutral";
    await redis.set(cacheKey, result, { ex: 86400 });
    return result;
  } catch (error) {
    captureException(error);
    console.error("Sentiment analysis error:", error);
    return "Neutral";
  }
}

// Translate article
export async function translateArticle(content: string, language: string, category: string = "General"): Promise<string> {
  try {
    const cacheKey = `translate:${language}:${Buffer.from(content).toString("base64")}`;
    const cached = await redis.get(cacheKey);
    if (cached) return cached;

    const dict = translationDict[language.toLowerCase()] || {};
    let translated = content.toLowerCase();

    // Context-aware translation
    const contextWords: { [key: string]: { [key: string]: string } } = {
      Politics: { game: language === "spanish" ? "partida" : language === "french" ? "partie" : "Spiel" },
      Sports: { game: language === "spanish" ? "juego" : language === "french" ? "jeu" : "Spiel" },
    };

    // Translate phrases first
    for (const [enPhrase, transPhrase] of Object.entries(dict)) {
      if (enPhrase.includes(" ")) {
        translated = translated.replace(new RegExp(`\\b${enPhrase}\\b`, "g"), transPhrase);
      }
    }

    // Translate single words with context
    const words = translated.split(/\b/);
    translated = words
      .map((word) => {
        if (contextWords[category]?.[word]) return contextWords[category][word];
        return dict[word] || word;
      })
      .join("");

    const result = translated;
    await redis.set(cacheKey, result, { ex: 86400 });
    return result;
  } catch (error) {
    captureException(error);
    console.error("Translation error:", error);
    return content;
  }
}

// Generate tags
export async function generateTags(content: string): Promise<string[]> {
  try {
    const cacheKey = `tags:${Buffer.from(content).toString("base64")}`;
    const cached = await redis.get(cacheKey);
    if (cached) return cached;

    const tfidf = new TFIDF();
    tfidf.addDocument(content, { vocabularySize: 1000 });
    const terms = tfidf.listTerms(0).slice(0, 5).map((item: any) => item.term);
    await redis.set(cacheKey, JSON.stringify(terms), { ex: 86400 });
    return terms;
  } catch (error) {
    captureException(error);
    console.error("Tag generation error:", error);
    return [];
  }
}

// Identify trending topics
export async function getTrendingTopics(articles: string[]): Promise<string[]> {
  try {
    const cacheKey = "trending_topics";
    const cached = await redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const tfidf = new TFIDF();
    articles.forEach((article, i) => tfidf.addDocument(article, { vocabularySize: 1000 }));

    const terms: { term: string; score: number }[] = [];
    tfidf.listTerms(0).forEach((item: any) => {
      terms.push({ term: item.term, score: item.tfidf });
    });

    const topTerms = terms
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map((t) => t.term);
    await redis.set(cacheKey, JSON.stringify(topTerms), { ex: 3600 });
    return topTerms;
  } catch (error) {
    captureException(error);
    console.error("Trending topics error:", error);
    return [];
  }
}