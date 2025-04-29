"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";

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
    try {
      const res = await fetch(`/api/comments?articleId=${articleId}`);
      if (!res.ok) throw new Error("Failed to fetch comments");
      const data = await res.json();
      setComments(data.comments);
    } catch (error) {
      console.error("Fetch comments error:", error);
    }
  };

  const handleSubmit = async () => {
    if (!user || !newComment) return;
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        body: JSON.stringify({
          articleId,
          comment: newComment,
          userId: user.id,
        }),
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        setNewComment("");
        fetchComments();
      } else {
        throw new Error("Failed to post comment");
      }
    } catch (error) {
      console.error("Post comment error:", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="mt-6"
    >
      <h2 className="text-lg font-semibold mb-4">Comments</h2>
      {user ? (
        <div className="flex space-x-2 mb-4">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
            className="bg-blue-600 text-white p-2 rounded-md"
          >
            Post
          </motion.button>
        </div>
      ) : (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Sign in to comment.
        </p>
      )}
      <div className="space-y-4">
        {comments.map((comment) => (
          <div
            key={comment._id}
            className="bg-gray-100 dark:bg-gray-700 p-4 rounded"
          >
            <p>{comment.comment}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Posted on {new Date(comment.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
