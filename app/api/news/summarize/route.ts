import { NextResponse } from "next/server";
import { summarizeArticle } from "@/lib/customNLP";
import { captureException } from "@/lib/sentry";

export async function POST(request: Request) {
  try {
    const { content } = await request.json();
    const summary = await summarizeArticle(content);
    return NextResponse.json({ summary });
  } catch (error) {
    captureException(error);
    return NextResponse.json({ error: "Failed to summarize" }, { status: 500 });
  }
}