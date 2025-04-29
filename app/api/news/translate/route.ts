import { NextResponse } from "next/server";
import { translateArticle } from "@/lib/customNLP";
import { captureException } from "@/lib/sentry";

export async function POST(request: Request) {
  try {
    const { content, language, category } = await request.json();
    const translated = await translateArticle(content, language, category);
    return NextResponse.json({ translated });
  } catch (error) {
    captureException(error);
    return NextResponse.json({ error: "Failed to translate" }, { status: 500 });
  }
}