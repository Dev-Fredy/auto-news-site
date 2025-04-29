import { motion } from "framer-motion";
import Link from "next/link";
import FactCheckBadge from "@/components/FactCheckBadge";
import SentimentBadge from "./SentimentBadge";
import FeedbackButton from "./FeedbackButton";
import SocialShare from "./SocialShare";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Volume2, Pause } from "lucide-react";

interface Article {
  _id: string;
  title: string;
  summary: string;
  rewritten: string;
  category: string;
  source: string;
  url: string;
  factCheck: { isVerified: boolean; details: string };
  sentiment: string;
  tags: string[];
}

export default function NewsCard({ article }: { article: Article }) {
  const [isPlaying, setIsPlaying] = useState(false);
  let speech: SpeechSynthesisUtterance | null = null;

  const narrate = () => {
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }
    speech = new SpeechSynthesisUtterance(article.rewritten || article.summary);
    speech.lang = "en-US";
    window.speechSynthesis.speak(speech);
    setIsPlaying(true);
    speech.onend = () => setIsPlaying(false);
  };

  return (
    <motion.div
      className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow hover:shadow-lg transition"
      whileHover={{ scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Link href={`/article/${article._id}`}>
        <h2 className="text-xl font-semibold mb-2">{article.title}</h2>
      </Link>
      <p className="text-gray-600 dark:text-gray-300 mb-2">
        {article.rewritten || article.summary}
      </p>
      <div className="flex flex-wrap gap-2 mb-2">
        {article.tags.map((tag) => (
          <span
            key={tag}
            className="text-sm bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100 px-2 py-1 rounded"
          >
            {tag}
          </span>
        ))}
      </div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-500 dark:text-gray-400">{article.category}</span>
        <div className="flex space-x-2">
          <FactCheckBadge factCheck={article.factCheck} />
          <SentimentBadge sentiment={article.sentiment} />
        </div>
      </div>
      <div className="flex space-x-2">
        <Button variant="outline" onClick={narrate} aria-label={isPlaying ? "Pause narration" : "Narrate summary"}>
          {isPlaying ? <Pause className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </Button>
        <SocialShare url={`${process.env.NEXT_PUBLIC_BASE_URL}/article/${article._id}`} title={article.title} />
      </div>
      <a
        href={article.url}
        target="_blank"
        className="text-blue-600 hover:underline mt-2 inline-block"
      >
        Read Original
      </a>
      <FeedbackButton articleId={article._id} />
    </motion.div>
  );
}