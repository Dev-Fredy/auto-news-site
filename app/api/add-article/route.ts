import { NextResponse } from 'next/server';
import { saveArticle } from '../../../lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, summary, category, url, source, createdAt, views, sentiment, tags } = body;

    if (!title || !summary || !url || !source) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await saveArticle({
      title,
      summary,
      category: category || 'General',
      url,
      source,
      createdAt: new Date(createdAt),
      views: views || 0,
      sentiment: sentiment || 'Neutral',
      tags: tags || [],
    });

    return NextResponse.json({ message: 'Article added successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error adding article:', error);
    return NextResponse.json({ error: 'Failed to add article' }, { status: 500 });
  }
}