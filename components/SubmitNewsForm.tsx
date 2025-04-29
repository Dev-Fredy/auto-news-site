"use client";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SubmitNewsForm() {
  const { user } = useUser();
  const [url, setUrl] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    if (!user) {
      setMessage("Please sign in to submit news.");
      return;
    }
    const res = await fetch("/api/news/submit", {
      method: "POST",
      body: JSON.stringify({ url }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    setMessage(data.message || data.error);
    if (res.ok) setUrl("");
  };

  return (
    <div className="mt-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">Submit a News Article</h2>
      <Input
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter article URL"
        className="mb-4"
      />
      <Button onClick={handleSubmit}>Submit</Button>
      {message && <p className="mt-2 text-sm">{message}</p>}
    </div>
  );
}