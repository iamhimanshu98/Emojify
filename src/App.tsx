import React, { useState } from "react";
import { ChatSection } from "./components/ChatSection";
import { ImageCapture } from "./components/ImageCapture";
import { Activities } from "./components/Activities";
import { ActivityProgress } from "./components/ActivityProgress";
import { EmotionDisplay } from "./components/EmotionDisplay";

function App() {
  const [emotion, setEmotion] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<number | null>(null);

  const handleImage = async (imageData: string) => {
    try {
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageData }),
      });

      if (!response.ok) throw new Error("Failed to process image");

      const data = await response.json();
      setEmotion(data.emotion);
      setConfidence(data.confidence);
    } catch (error) {
      console.error("Error analyzing image:", error);
      setEmotion("no emotion"); // Default fallback
      setConfidence(null);
    }
  };

  return (
    <div>
      <ImageCapture onCapture={handleImage} />
      <EmotionDisplay emotion={emotion} confidence={confidence} />
      <Activities emotion={emotion} />
      <ActivityProgress />
      <ChatSection emotion={emotion} />
    </div>
  );
}
