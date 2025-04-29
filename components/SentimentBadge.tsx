interface SentimentBadgeProps {
    sentiment: string;
  }
  
  export default function SentimentBadge({ sentiment }: SentimentBadgeProps) {
    const colorMap: { [key: string]: string } = {
      Positive: "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100",
      Negative: "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100",
      Neutral: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100",
    };
  
    return (
      <span className={`text-sm px-2 py-1 rounded ${colorMap[sentiment] || colorMap.Neutral}`}>
        {sentiment}
      </span>
    );
  }