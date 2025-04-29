"use client";
import { useQuery } from "react-query";

export default function AnalyticsDashboard() {
  const { data, isLoading } = useQuery("analytics", async () => {
    const res = await fetch("/api/analytics");
    return res.json();
  });

  if (isLoading) return <div>Loading analytics...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold">Total Articles</h3>
        <p className="text-2xl">{data?.totalArticles}</p>
      </div>
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold">Total Views</h3>
        <p className="text-2xl">{data?.totalViews}</p>
      </div>
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold">Rewritten Views</h3>
        <p className="text-2xl">{data?.rewrittenViews}</p>
      </div>
    </div>
  );
}