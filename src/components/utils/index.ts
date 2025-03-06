export const mapEmotionToCategory = (emotion: string | null): string => {
  if (!emotion) return "neutral";

  const emotionMap: { [key: string]: string } = {
    happy: "happy",
    sad: "sad",
    angry: "angry",
    fear: "fear",
    surprise: "surprised",
    disgust: "disgust",
    neutral: "neutral",
  };

  return emotionMap[emotion.toLowerCase()] || "neutral";
};

export const formatTimeRemaining = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
};