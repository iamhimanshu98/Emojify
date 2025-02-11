// import React from "react";
import {
  Smile,
  Frown,
  Angry,
  Meh,
  Heart,
  Pocket as Shocked,
  Cone as Confused,
} from "lucide-react";

interface EmotionDisplayProps {
  emotion: string | null;
  confidence?: number | null;
}

export function EmotionDisplay({ emotion, confidence }: EmotionDisplayProps) {
  const getEmotionIcon = () => {
    switch (emotion?.toLowerCase()) {
      case "happy":
        return <Smile className="w-16 h-16 text-yellow-400" />;
      case "sad":
        return <Frown className="w-16 h-16 text-blue-400" />;
      case "angry":
        return <Angry className="w-16 h-16 text-red-400" />;
      case "neutral":
        return <Meh className="w-16 h-16 text-gray-400" />;
      case "love":
        return <Heart className="w-16 h-16 text-pink-400" />;
      case "surprise":
        return <Shocked className="w-16 h-16 text-purple-400" />;
      default:
        return <Confused className="w-16 h-16 text-gray-400" />;
    }
  };

  if (!emotion) return null;

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-gray-800 rounded-lg shadow-lg">
      {getEmotionIcon()}
      <h3 className="mt-4 text-xl font-bold text-white capitalize">
        {emotion}
      </h3>
      {confidence && (
        <p className="text-gray-400">
          Confidence: {(confidence * 100).toFixed(1)}%
        </p>
      )}
    </div>
  );
}
