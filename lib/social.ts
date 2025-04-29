import { TwitterApi } from "twitter-api-v2";
import fetch from "node-fetch";

const twitterClient = new TwitterApi(process.env.TWITTER_BEARER_TOKEN!);

export async function postToTwitter(article: {
  title: string;
  summary: string;
  rewritten: string;
  url: string;
}) {
  try {
    await twitterClient.v2.tweet(
      `${article.title}\n${article.rewritten.slice(0, 200)}...\nRead more: ${article.url}`
    );
  } catch (error) {
    console.error("Twitter posting error:", error);
  }
}

export async function postToFacebook(article: {
  title: string;
  summary: string;
  rewritten: string;
  url: string;
}) {
  try {
    await fetch(
      `https://graph.facebook.com/v12.0/me/feed?message=${encodeURIComponent(
        `${article.title}\n${article.rewritten.slice(0, 200)}...\nRead more: ${article.url}`
      )}&access_token=${process.env.FACEBOOK_ACCESS_TOKEN}`,
      { method: "POST" }
    );
  } catch (error) {
    console.error("Facebook posting error:", error);
  }
}