import { motion } from "framer-motion";
import Link from "next/link";

interface HeroSectionProps {
  news: any[];
}

export default function HeroSection({ news }: HeroSectionProps) {
  return (
    <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 text-white p-8 rounded-lg shadow-lg">
      <motion.h1
        className="text-4xl font-bold mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        Top Stories
      </motion.h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {news.map((article) => (
          <motion.div
            key={article._id}
            className="bg-white text-black p-4 rounded-lg shadow"
            whileHover={{ scale: 1.05 }}
          >
            <Link href={`/article/${article._id}`}>
              <h2 className="text-xl font-semibold">{article.title}</h2>
              <p className="text-gray-600">{article.summary.slice(0, 50)}...</p>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}