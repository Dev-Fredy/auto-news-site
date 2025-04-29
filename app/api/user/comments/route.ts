import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { MongoClient } from "mongodb";
import { incrementUserPoints } from "../../../lib/db";
import { captureException } from "../../../lib/sentry";

const uri = process.env.MONGODB_URI!;
const client = new MongoClient(uri);

export async function POST(request: Request) {
  try {
    const { userId } = getAuth(request);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { articleId, comment } = await request.json();
    await client.connect();
    const db = client.db("news");
    await db.collection("comments").insertOne({
      articleId,
      comment,
      userId,
      createdAt: new Date(),
    });
    await incrementUserPoints(userId, 10); // Award 10 points for commenting
    return NextResponse.json({ message: "Comment posted" });
  } catch (error) {
    captureException(error);
    return NextResponse.json({ error: "Failed to post comment" }, { status: 500 });
  } finally {
    await client.close();
  }
}