"use client";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Comment {
  _id: string;
  comment: string;
  userId: string;
  createdAt: Date;
}

interface CommentSectionProps {
  articleId: string;
}

export default function CommentSection({ articleId }: CommentSectionProps) {
  const { user } = useUser();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    fetchComments();
  }, [articleId]);

  const fetchComments = async () => {
    const res = await fetch(`/api/user/comments?articleId=${articleId}`);
    const data = await res.json();
    setComments(data.comments);
  };

  const handleSubmit = async () => {
    if (!user) return;
    const res = await fetch("/api/user/comments", {
      method: "POST",
      body: JSON.stringify({ articleId, comment: newComment }),
      headers: { "Content-Type": "application/json" },
    });
    if (res.ok) {
      setNewComment("");
      fetchComments();
    }
  };

  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold mb-4">Comments</h2>
      {user ? (
        <div className="flex space-x-2 mb-4">
          <Input
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
          />
          <Button onClick={handleSubmit}>Post</Button>
        </div>
      ) : (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Sign in to comment.</p>
      )}
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment._id} className="bg-gray-100 dark:bg-gray-700 p-4 rounded">
            <p>{comment.comment}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Posted on {new Date(comment.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}