"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface VoiceNarrationProps {
  text: string;
}

export default function VoiceNarration({ text }: VoiceNarrationProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleNarration = () => {
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.onend = () => setIsPlaying(false);
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleNarration}
      className="bg-green-600 text-white p-2 rounded-md mb-4"
    >
      {isPlaying ? "Stop Narration" : "Listen to Article"}
    </motion.button>
  );
}
