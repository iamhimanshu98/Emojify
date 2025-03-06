import { ReactNode } from 'react';
import { Lightbulb, Music, Clock } from 'lucide-react';

export interface Activity {
  title: string;
  description: string;
  selected?: boolean;
  time?: number;
}

export const activitySuggestions: Record<string, Activity[]> = {
  happy: [
    {
      title: "Dance Party",
      description: "Turn up your favorite music and dance like nobody's watching!",
    },
    // ... (rest of the activities)
  ],
  // ... (rest of the emotion categories)
};

export const emotionBackgrounds: Record<string, string> = {
  happy: "bg-indigo-900/5 border-lime-600/30",
  sad: "bg-blue-900/10 border-blue-600/30",
  angry: "bg-red-900/10 border-red-600/30",
  surprised: "bg-purple-900/10 border-purple-600/30",
  neutral: "bg-gray-800 border-gray-700",
  fear: "bg-indigo-900/10 border-indigo-600/30",
  disgust: "bg-green-900/10 border-green-600/30",
};

export interface ChatPrompt {
  text: string;
  icon: ReactNode;
}

export const defaultChatPrompts: ChatPrompt[] = [
  {
    text: "Tell me interesting facts about my current mood",
    icon: <Lightbulb size={16} />,
  },
  {
    text: "Suggest music that matches how I'm feeling",
    icon: <Music size={16} />,
  },
  {
    text: "What activities would help improve my mood?",
    icon: <Clock size={16} />,
  },
];

export const API_URL = "http://127.0.0.1:5000";
export const DEFAULT_IMAGE = "/images/boy.jpg";