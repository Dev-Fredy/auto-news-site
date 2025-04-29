import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import { captureException } from "../../../lib/sentry";

const uri = process.env.MONGODB_URI!;
const client = new MongoClient(uri);

export async function GET() {
  try {
    await client.connect();
    const db = client.db("news");
    const totalArticles = await db.collection("articles").countDocuments();
    const totalViews = await db.collection("articles").aggregate([
      { $group: { _id: null, totalViews: { $sum: "$views" } } },
    ]).toArray();
    const rewrittenViews = await db.collection("articles").aggregate([
      { $match: { rewritten: { $ne: null } } },
      { $group: { _id: null, totalViews: { $sum: "$views" } } },
    ]).toArray();
    return NextResponse.json({
      totalArticles,
      totalViews: totalViews[0]?.totalViews || 0,
      rewrittenViews: rewrittenViews[0]?.totalViews || 0,
    });
  } catch (error) {
    captureException(error);
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  } finally {
    await client.close();
  }
}