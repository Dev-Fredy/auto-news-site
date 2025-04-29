import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import { captureException } from "../../lib/sentry";

const uri = process.env.MONGODB_URI!;
const client = new MongoClient(uri);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";
    await client.connect();
    const db = client.db("news");
    const results = await db
      .collection("articles")
      .find({ $text: { $search: query } })
      .limit(20)
      .toArray();
    return NextResponse.json({ results });
  } catch (error) {
    captureException(error);
    return NextResponse.json({ error: "Failed to search" }, { status: 500 });
  } finally {
    await client.close();
  }
}