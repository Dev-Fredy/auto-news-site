import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import { captureException } from "@/lib/sentry";

const uri = process.env.MONGODB_URI!;
const client = new MongoClient(uri);

export async function POST(request: Request) {
  try {
    const subscription = await request.json();
    await client.connect();
    const db = client.db("news");
    await db.collection("subscriptions").insertOne({
      subscription,
      createdAt: new Date(),
    });
    return NextResponse.json({ message: "Subscription saved" });
  } catch (error) {
    captureException(error);
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  } finally {
    await client.close();
  }
}