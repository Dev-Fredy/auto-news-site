import { NextSeo } from "next-seo";
import NewsCard from "@/components/NewsCard";
import { getNewsByCategory } from "@/lib/db";

export async function generateStaticParams() {
  return [
    { slug: "politics" },
    { slug: "sports" },
    { slug: "technology" },
    { slug: "business" },
    { slug: "entertainment" },
  ];
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const news = await getNewsByCategory(params.slug);

  return (
    <>
      <NextSeo
        title={`${params.slug.charAt(0).toUpperCase() + params.slug.slice(1)} News | Automated News Site`}
        description={`Latest AI-generated news summaries in ${params.slug}.`}
      />
      <h1 className="text-2xl font-bold mb-6 capitalize">{params.slug} News</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.map((article: any) => (
          <NewsCard key={article._id} article={article} />
        ))}
      </div>
    </>
  );
}