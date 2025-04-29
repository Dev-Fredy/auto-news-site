"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function FeedbackButton({ articleId }: { articleId: string }) {
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);

  const submitFeedback = async (value: "up" | "down") => {
    setFeedback(value);
    await fetch("/api/user/feedback", {
      method: "POST",
      body: JSON.stringify({ articleId, feedback: value }),
      headers: { "Content-Type": "application/json" },
    });
  };

  return (
    <div className="flex space-x-2 mt-2">
      <Button
        variant="outline"
        onClick={() => submitFeedback("up")}
        disabled={feedback !== null}
        aria-label="Upvote summary"
      >
        👍
      </Button>
      <Button
        variant="outline"
        onClick={() => submitFeedback("down")}
        disabled={feedback !== null}
        aria-label="Downvote summary"
      >
        👎
      </Button>
    </div>
  );
}