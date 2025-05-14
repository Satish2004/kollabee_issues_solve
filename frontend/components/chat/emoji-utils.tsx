// Utility functions for emoji handling

import React from "react";

// Function to detect if a string contains emoji
export function containsEmoji(text: string): boolean {
  // This regex pattern matches most common emoji unicode ranges
  const emojiRegex =
    /[\u{1F300}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
  return emojiRegex.test(text);
}

// Function to make emojis larger in text
export function enhanceEmojis(text: string): JSX.Element[] {
  if (!text) return [<span key="empty"></span>];

  // This regex captures emoji characters
  const emojiRegex =
    /([\u{1F300}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}])/gu;

  const parts = text.split(emojiRegex);

  return parts.map((part, index) => {
    if (part.match(emojiRegex)) {
      return (
        <span key={index} className="text-xl inline-block align-middle mx-0.5">
          {part}
        </span>
      );
    }
    return <span key={index}>{part}</span>;
  });
}

// Popular emoji categories for quick access
export const popularEmojis = {
  smileys: ["😀", "😁", "😂", "🤣", "😃", "😄", "😅", "😆", "😉", "😊"],
  gestures: ["👍", "👎", "👌", "👏", "🙌", "🤝", "👊", "✌️", "🤞", "🤟"],
  hearts: ["❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💖"],
  animals: ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐨", "🐯"],
  food: ["🍎", "🍐", "🍊", "🍋", "🍌", "🍉", "🍇", "🍓", "🍈", "🍒"],
};
