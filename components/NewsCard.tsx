import { motion } from "framer-motion";

interface NewsCardProps {
  id: string;
  title: string;
  summary: string;
  category: string;
}

export default function NewsCard({
  id,
  title,
  summary,
  category,
}: NewsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow hover:shadow-lg transition-shadow"
    >
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
        Category: {category}
      </p>
      <p className="text-gray-700 dark:text-gray-300 mb-4">
        {summary.slice(0, 100)}...
      </p>
      <a href={`/article/${id}`} className="text-blue-600 hover:underline">
        Read more
      </a>
    </motion.div>
  );
}
