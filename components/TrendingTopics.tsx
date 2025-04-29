"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function TrendingTopics() {
  const [topics, setTopics] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        const res = await fetch("/api/trending");
        if (!res.ok) throw new Error("Failed to fetch trends");
        const data = await res.json();
        setTopics(data.trending);
      } catch (error) {
        console.error("Error fetching trends:", error);
        setTopics([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTrends();
  }, []);

  if (isLoading) return <div>Loading trending topics...</div>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mt-6"
    >
      <h2 className="text-lg font-semibold mb-4">Trending Topics</h2>
      <ul className="list-disc pl-5">
        {topics.map((topic, i) => (
          <li key={i} className="text-blue-600 hover:underline">
            {topic}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
