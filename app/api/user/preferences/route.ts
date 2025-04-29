import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { MongoClient } from "mongodb";
import { captureException } from "../../../lib/sentry";

const uri = process.env.MONGODB_URI!;
const client = new MongoClient(uri);

export async function POST(request: Request) {
  try {
    const { userId } = getAuth(request);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { categories, language } = await request.json();
    await client.connect();
    const db = client.db("news");
    await db.collection("users").updateOne(
      { clerkId: userId },
      { $set: { categories, language } },
      { upsert: true }
    );
    return NextResponse.json({ message: "Preferences saved" });
  } catch (error) {
    captureException(error);
    return NextResponse.json({ error: "Failed to save preferences" }, { status: 500 });
  } finally {
    await client.close();
  }
}