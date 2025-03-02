import { useState, useEffect } from "react";
import {
  Smile,
  Frown,
  Meh,
  AlertTriangle,
  Heart,
  Zap,
  Droplet,
} from "lucide-react";

interface EmotionDisplayProps {
  emotion: string | null;
  confidence: number | null;
}

export function EmotionDisplay({ emotion, confidence }: EmotionDisplayProps) {
  const [emoji, setEmoji] = useState<JSX.Element | null>(null);
  const [color, setColor] = useState("text-gray-400");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (!emotion) {
      setEmoji(null);
      setColor("text-gray-400");
      setDescription("");
      return;
    }

    // Map emotions to emojis, colors, and descriptions
    switch (emotion.toLowerCase()) {
      case "happy":
        setEmoji(<Smile className="w-full h-full" />);
        setColor("text-yellow-500");
        setDescription("You seem happy and joyful!");
        break;
      case "sad":
        setEmoji(<Frown className="w-full h-full" />);
        setColor("text-blue-500");
        setDescription("You appear to be feeling sad.");
        break;
      case "angry":
        setEmoji(<AlertTriangle className="w-full h-full" />);
        setColor("text-red-500");
        setDescription("You seem angry or upset.");
        break;
      case "surprised":
        setEmoji(<Zap className="w-full h-full" />);
        setColor("text-purple-500");
        setDescription("You look surprised!");
        break;
      case "fear":
        setEmoji(<Droplet className="w-full h-full" />);
        setColor("text-indigo-500");
        setDescription("You appear to be feeling fearful.");
        break;
      case "disgust":
        setEmoji(<Meh className="w-full h-full" />);
        setColor("text-green-500");
        setDescription("You seem disgusted.");
        break;
      case "neutral":
        setEmoji(<Meh className="w-full h-full" />);
        setColor("text-gray-500");
        setDescription("You appear neutral.");
        break;
      default:
        setEmoji(<Heart className="w-full h-full" />);
        setColor("text-pink-500");
        setDescription(`Detected: ${emotion}`);
    }
  }, [emotion]);

  if (!emotion) {
    return (
      <div className="flex flex-col items-center justify-center p-6 bg-gray-800 rounded-lg shadow-lg">
        <Meh className="w-16 h-16 text-gray-500" />
        <h3 className="mt-4 text-xl font-bold text-white">
          No Emotion Detected
        </h3>
        <p className="text-gray-400 text-center">
          Try uploading a clearer image or adjusting lighting.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 p-8 rounded-lg h-full flex items-center">
      <div className="flex flex-col items-center w-full">
        <div className={`w-32 h-32 mb-6 ${color}`}>{emoji}</div>
        <h2 className="text-3xl font-bold mb-3 capitalize">{emotion}</h2>
        <p className="text-gray-400 mb-6 text-xl">{description}</p>
        {confidence !== null && (
          <div className="w-full bg-gray-700 rounded-full h-5 mb-3">
            <div
              className="bg-indigo-600 h-5 rounded-full"
              style={{ width: `${confidence * 100}%` }}
            ></div>
          </div>
        )}
        {confidence !== null && (
          <p className="text-base text-gray-400">
            Accuracy: {(confidence * 100).toFixed(1)}%
          </p>
        )}
      </div>
    </div>
  );
}
