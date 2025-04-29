import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";
import { MongoClient, ObjectId } from "mongodb";
import { Button } from "@/components/ui/button";

const uri = process.env.MONGODB_URI!;
const client = new MongoClient(uri);

export default async function AdminPage() {
  const submissions = await getSubmissions();

  async function handleApprove(id: string) {
    await client.connect();
    const db = client.db("news");
    const submission = await db.collection("submissions").findOne({ _id: new ObjectId(id) });
    if (submission) {
      await db.collection("articles").insertOne({
        ...submission,
        createdAt: new Date(),
        views: 0,
      });
      await db.collection("submissions").updateOne(
        { _id: new ObjectId(id) },
        { $set: { status: "approved" } }
      );
    }
  }

  async function handleReject(id: string) {
    await client.connect();
    const db = client.db("news");
    await db.collection("submissions").updateOne(
      { _id: new ObjectId(id) },
      { $set: { status: "rejected" } }
    );
  }

  return (
    <>
      <SignedIn>
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
        <div className="space-y-4">
          {submissions.map((submission: any) => (
            <div key={submission._id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold">{submission.title}</h3>
              <p>{submission.summary}</p>
              <p className="text-sm text-gray-500">Status: {submission.status}</p>
              <div className="flex space-x-2 mt-2">
                <Button onClick={() => handleApprove(submission._id)} disabled={submission.status !== "pending"}>
                  Approve
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleReject(submission._id)}
                  disabled={submission.status !== "pending"}
                >
                  Reject
                </Button>
              </div>
            </div>
          ))}
        </div>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}

async function getSubmissions() {
  await client.connect();
  const db = client.db("news");
  const submissions = await db.collection("submissions").find({}).toArray();
  return submissions;
}