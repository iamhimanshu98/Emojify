import React, { useState } from "react";
import { ChatSection } from "./components/ChatSection";
import { ImageCapture } from "./components/ImageCapture";
import { Activities } from "./components/Activities";
import { ActivityProgress } from "./components/ActivityProgress";
import { EmotionDisplay } from "./components/EmotionDisplay";

function App() {
  // State for detected emotion
  const [emotion, setEmotion] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<number | null>(null);

  // State for activity progress
  const [currentActivity, setCurrentActivity] = useState<Activity | null>(null);
  const [activityQueue, setActivityQueue] = useState<string[]>([]);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);

  // State for chatbot
  const [chatMessages, setChatMessages] = useState<
    { text: string; sender: string }[]
  >([]);
  const [showChatbot, setShowChatbot] = useState<boolean>(true);

  // Function to handle image capture/upload
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
      setEmotion("no emotion"); // Fallback when no emotion is detected
      setConfidence(null);
    }
  };

  // Function to handle activity start
  const handleActivityStart = () => {
    console.log("Activity started!");
  };

  // Function to handle activity skipping
  const handleSkipActivity = () => {
    if (activityQueue.length > 0) {
      setCurrentActivity(activityQueue[0]); // Move to next activity
      setActivityQueue(activityQueue.slice(1)); // Remove first activity from queue
      setTimeRemaining(0); // Reset timer
    } else {
      setCurrentActivity(null); // No more activities left
    }
  };

  // Function to send messages in chat
  const handleSendMessage = (message: string) => {
    setChatMessages([...chatMessages, { text: message, sender: "user" }]);
  };

  return (
    <div>
      {/* <ImageCapture onCapture={handleImage} /> */}
      <EmotionDisplay emotion={emotion} confidence={confidence} />
      <Activities emotion={emotion} onActivityStart={handleActivityStart} />
      <ActivityProgress
        currentActivity={currentActivity}
        activityQueue={activityQueue}
        timeRemaining={timeRemaining}
        onSkip={handleSkipActivity}
      />
      <ChatSection
        emotion={emotion}
        onSendMessage={handleSendMessage}
        chatMessages={chatMessages}
        showChatbot={showChatbot}
        setShowChatbot={setShowChatbot}
      />
    </div>
  );
}

export default App;
