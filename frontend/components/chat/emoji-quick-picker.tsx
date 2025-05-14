"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { popularEmojis } from "./emoji-utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface EmojiQuickPickerProps {
  onEmojiSelect: (emoji: string) => void;
}

export default function EmojiQuickPicker({
  onEmojiSelect,
}: EmojiQuickPickerProps) {
  const [activeTab, setActiveTab] = useState("smileys");

  const handleEmojiClick = (emoji: string) => {
    onEmojiSelect(emoji);
  };

  return (
    <Tabs defaultValue="smileys" className="w-64" onValueChange={setActiveTab}>
      <TabsList className="grid grid-cols-5 h-10">
        <TabsTrigger value="smileys" className="text-lg p-0">
          😊
        </TabsTrigger>
        <TabsTrigger value="gestures" className="text-lg p-0">
          👍
        </TabsTrigger>
        <TabsTrigger value="hearts" className="text-lg p-0">
          ❤️
        </TabsTrigger>
        <TabsTrigger value="animals" className="text-lg p-0">
          🐶
        </TabsTrigger>
        <TabsTrigger value="food" className="text-lg p-0">
          🍎
        </TabsTrigger>
      </TabsList>

      <ScrollArea className="h-40">
        {Object.entries(popularEmojis).map(([category, emojis]) => (
          <TabsContent key={category} value={category} className="mt-2">
            <div className="grid grid-cols-6 gap-2">
              {emojis.map((emoji, index) => (
                <button
                  key={index}
                  className="text-2xl hover:bg-gray-100 rounded p-1 transition-colors"
                  onClick={() => handleEmojiClick(emoji)}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </TabsContent>
        ))}
      </ScrollArea>
    </Tabs>
  );
}
