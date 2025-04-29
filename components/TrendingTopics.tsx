"use client";
import { useQuery } from "react-query";

export default function TrendingTopics() {
  const { data, isLoading } = useQuery("trending", async () => {
    const res = await fetch("/api/news/trending");
    return res.json();
  });

  if (isLoading) return <div>Loading trending topics...</div>;

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mt-6">
      <h2 className="text-lg font-semibold mb-4">Trending Topics</h2>
      <ul className="list-disc pl-5">
        {data?.trending?.map((topic: string, i: number) => (
          <li key={i} className="text-blue-600 hover:underline">
            {topic}
          </li>
        ))}
      </ul>
    </div>
  );
}