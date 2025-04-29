import NewsCard from '@/components/NewsCard';
import TrendingTopics from '@/components/TrendingTopics';
import { getNews } from '../lib/db';

export default async function Home() {
  const articles = await getNews();

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Latest News</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {articles.map((article: any) => (
          <NewsCard
            key={article._id}
            id={article._id}
            title={article.title}
            summary={article.summary}
            category={article.category}
          />
        ))}
      </div>
      <TrendingTopics />
    </div>
  );
}