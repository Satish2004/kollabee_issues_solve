"use client";

import { useState, useEffect } from "react";

const MAX_RECENT_EMOJIS = 16;

export function useRecentEmojis() {
  const [recentEmojis, setRecentEmojis] = useState<string[]>([]);

  // Load recent emojis from localStorage on component mount
  useEffect(() => {
    const stored = localStorage.getItem("recentEmojis");
    if (stored) {
      try {
        setRecentEmojis(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse recent emojis", e);
      }
    }
  }, []);

  // Add an emoji to recent list
  const addRecentEmoji = (emoji: string) => {
    setRecentEmojis((prev) => {
      // Remove the emoji if it already exists
      const filtered = prev.filter((e) => e !== emoji);
      // Add to the beginning and limit the array length
      const updated = [emoji, ...filtered].slice(0, MAX_RECENT_EMOJIS);
      // Save to localStorage
      localStorage.setItem("recentEmojis", JSON.stringify(updated));
      return updated;
    });
  };

  return { recentEmojis, addRecentEmoji };
}

interface RecentEmojisProps {
  onEmojiSelect: (emoji: string) => void;
}

export default function RecentEmojis({ onEmojiSelect }: RecentEmojisProps) {
  const { recentEmojis, addRecentEmoji } = useRecentEmojis();

  const handleEmojiClick = (emoji: string) => {
    addRecentEmoji(emoji);
    onEmojiSelect(emoji);
  };

  if (recentEmojis.length === 0) {
    return (
      <div className="text-center py-2 text-sm text-gray-500">
        No recent emojis
      </div>
    );
  }

  return (
    <div className="p-2">
      <div className="text-xs text-gray-500 mb-1">Recently Used</div>
      <div className="grid grid-cols-8 gap-1">
        {recentEmojis.map((emoji, index) => (
          <button
            key={index}
            className="text-xl hover:bg-gray-100 rounded p-1 transition-colors"
            onClick={() => handleEmojiClick(emoji)}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
}
