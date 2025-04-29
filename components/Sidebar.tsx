import Link from "next/link";
import { motion } from "framer-motion";

const categories = ["Politics", "Sports", "Technology", "Business", "Entertainment"];

export default function Sidebar() {
  return (
    <motion.aside
      className="w-64 bg-gray-50 dark:bg-gray-900 p-4 hidden md:block"
      initial={{ x: -100 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-lg font-semibold mb-4">Categories</h2>
      <ul className="space-y-2">
        {categories.map((category) => (
          <li key={category}>
            <Link
              href={`/category/${category.toLowerCase()}`}
              className="block text-blue-600 dark:text-blue-400 hover:underline"
            >
              {category}
            </Link>
          </li>
        ))}
      </ul>
    </motion.aside>
  );
}