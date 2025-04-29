import { NextResponse } from 'next/server';
import { TwitterApi } from 'twitter-api-v2';
import { redis } from '@/lib/redis';

export async function GET() {
  try {
    const cacheKey = 'trending';
    const cached:any = await redis.get(cacheKey);
    if (cached) return NextResponse.json({ trending: JSON.parse(cached) });

    const twitterClient = new TwitterApi(process.env.TWITTER_BEARER_TOKEN!);
    const trends = await twitterClient.v1.trendsAvailable();
    const topics = trends.slice(0, 5).map((trend) => trend.name);
    
    await redis.set(cacheKey, JSON.stringify(topics), { ex: 300 });
    return NextResponse.json({ trending: topics });
  } catch (error) {
    console.error('Error fetching trending topics:', error);
    return NextResponse.json({ trending: [] }, { status: 500 });
  }
}