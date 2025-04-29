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

    const { articleId, feedback } = await request.json();
    await client.connect();
    const db = client.db("news");
    await db.collection("feedback").insertOne({
      articleId,
      feedback,
      userId,
      createdAt: new Date(),
    });
    await incrementUserPoints(userId, 5); // Award 5 points for feedback
    return NextResponse.json({ message: "Feedback submitted" });
  } catch (error) {
    captureException(error);
    return NextResponse.json({ error: "Failed to submit feedback" }, { status: 500 });
  } finally {
    await client.close();
  }
}