import { notFound } from 'next/navigation';
import { getArticleById } from '../../../lib/db';
import CommentSection from '@/components/CommentSection';
import VoiceNarration from '@/components/VoiceNarration';

type ArticlePageProps = {
  params: { id: string };
};

const ArticlePage: any = async ({ params }: ArticlePageProps) => {
  const article = await getArticleById(params.id);

  if (!article) {
    notFound();
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
        Category: {article.category} | Source: {article.source} |{' '}
        {new Date(article.createdAt).toLocaleDateString()}
      </p>
      <p className="text-lg mb-4">{article.summary}</p>
      <VoiceNarration text={article.summary} />
      <a
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline mb-6 block"
      >
        Read full article
      </a>
      <CommentSection articleId={article._id} />
    </div>
  );
}

export default ArticlePage;