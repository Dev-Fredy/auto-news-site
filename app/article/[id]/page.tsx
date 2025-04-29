import { NextSeo } from "next-seo";
import NewsCard from "@/components/NewsCard";
import CommentSection from "@/components/CommentSection";
import SocialShare from "@/components/SocialShare";
import { getArticleById } from "@/lib/db";

export default async function ArticlePage({ params }: { params: { id: string } }) {
  const article = await getArticleById(params.id);
  if (!article) return <div>Article not found</div>;

  return (
    <>
      <NextSeo
        title={`${article.title} | Automated News Site`}
        description={article.summary}
        openGraph={{
          url: `${process.env.NEXT_PUBLIC_BASE_URL}/article/${article._id}`,
          title: article.title,
          description: article.summary,
          images: [{ url: `${process.env.NEXT_PUBLIC_BASE_URL}/og-image.jpg` }],
        }}
      />
      <div className="max-w-3xl mx-auto">
        <NewsCard article={article} />
        <SocialShare url={`${process.env.NEXT_PUBLIC_BASE_URL}/article/${article._id}`} title={article.title} />
        <CommentSection articleId={article._id} />
      </div>
    </>
  );
}