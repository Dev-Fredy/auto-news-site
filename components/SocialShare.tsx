"use client";
import { Button } from "@/components/ui/button";
import { Share } from "lucide-react";

export default function SocialShare({ url, title }: { url: string; title: string }) {
  const share = async () => {
    if (navigator.share) {
      await navigator.share({
        title,
        url,
      });
    } else {
      // Fallback: Copy URL to clipboard
      navigator.clipboard.write(url);
      alert("URL copied to clipboard!");
    }
  };

  return (
    <Button variant="outline" onClick={share} aria-label="Share article">
      <Share className="w-4 h-4 mr-2" />
      Share
    </Button>
  );
}