import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const articleId = searchParams.get('articleId');

  if (!articleId) {
    return NextResponse.json({ error: 'Article ID required' }, { status: 400 });
  }

  try {
    const cacheKey = `comments:${articleId}`;
    const cached:any = await redis.get(cacheKey);
    if (cached) return NextResponse.json({ comments: JSON.parse(cached) });

    // In a full implementation, fetch from a database
    const comments:any[] = []; // Placeholder
    await redis.set(cacheKey, JSON.stringify(comments), { ex: 300 });
    return NextResponse.json({ comments });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { articleId, comment, userId } = await request.json();

    if (!articleId || !comment || !userId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newComment = {
      _id: Math.random().toString(36).slice(2),
      comment,
      userId,
      createdAt: new Date(),
    };

    const cacheKey = `comments:${articleId}`;
    const cached:any = await redis.get(cacheKey);
    const comments = cached ? JSON.parse(cached) : [];
    comments.push(newComment);
    await redis.set(cacheKey, JSON.stringify(comments), { ex: 300 });

    return NextResponse.json({ message: 'Comment added' }, { status: 200 });
  } catch (error) {
    console.error('Error adding comment:', error);
    return NextResponse.json({ error: 'Failed to add comment' }, { status: 500 });
  }
}