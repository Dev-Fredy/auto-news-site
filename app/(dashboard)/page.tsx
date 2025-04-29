import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";
import PreferencesModal from "../../components/PreferencesModal";
import NewsCard from "../../components/NewsCard";
import { getPersonalizedNews } from "../../lib/db";
import { useUser } from "@clerk/nextjs";

export default async function Dashboard() {
  return (
    <>
      <SignedIn>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Your Personalized News</h1>
          <PreferencesModal />
        </div>
        <UserPoints />
        <NewsList />
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}

async function UserPoints() {
  const { user } = useUser();
  const client = await clientPromise;
  const db = client.db("news");
  const userData = await db.collection("users").findOne({ clerkId: user?.id });
  return (
    <div className="mb-6">
      <p className="text-lg font-semibold">Your Points: {userData?.points || 0}</p>
    </div>
  );
}

async function NewsList() {
  const news = await getPersonalizedNews();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {news.map((article: any) => (
        <NewsCard key={article._id} article={article} />
      ))}
    </div>
  );
}