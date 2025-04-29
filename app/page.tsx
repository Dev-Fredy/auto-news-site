import { NextSeo } from "next-seo";
import HeroSection from "../components/HeroSection";
import NewsCard from "../components/NewsCard";
import TrendingTopics from "../components/TrendingTopics";
import SubmitNewsForm from "../components/SubmitNewsForm";
import SearchBar from "../components/SearchBar";
import { getNews } from "../lib/db";

export const revalidate = 300;

export default async function Home() {
  const news = await getNews();

  return (
    <>
      <NextSeo
        title="Latest News | Automated News Site"
        description="Discover AI-generated news summaries with voice narration and user submissions."
      />
      <HeroSection news={news.slice(0, 3)} />
      <SearchBar />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {news.map((article: any) => (
          <NewsCard key={article._id} article={article} />
        ))}
      </div>
      <TrendingTopics />
      <SubmitNewsForm />
    </>
  );
}