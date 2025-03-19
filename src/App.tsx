import { useState, useEffect } from "react";
import {
  Camera,
  Upload,
  AlertCircle,
  Smile,
  Clock,
  Music,
  Lightbulb,
} from "lucide-react";
import { WebcamCapture } from "./components/WebcamCapture";
import { FileUpload } from "./components/FileUpload";
import { EmotionDisplay } from "./components/EmotionDisplay";
import { Chatbot } from "./components/Chatbot";
import ActivitySelector from "./components/ActivitySelector";

// const API_URL = "https://emojify-3amt.onrender.com";
const DEFAULT_IMAGE = "/images/boy.jpg";

const chatPrompts = [
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

interface Activity {
  title: string;
  description: string;
  selected?: boolean;
  time?: number;
}

function App() {
  const [mode, setMode] = useState<"webcam" | "upload">("webcam");
  const [image, setImage] = useState<string | null>(null);
  const [emotion, setEmotion] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Activity suggestion states
  const [displayedActivities, setDisplayedActivities] = useState<Activity[]>(
    []
  );
  const [selectedActivities, setSelectedActivities] = useState<Activity[]>([]);
  const [activityQueue, setActivityQueue] = useState<Activity[]>([]);
  const [currentActivity, setCurrentActivity] = useState<Activity | null>(null);
  const [showChatbot, setShowChatbot] = useState(true);
  const [chatMessages, setChatMessages] = useState<
    Array<{ text: string; sender: string }>
  >([]);
  const [userInput, setUserInput] = useState("");
  const [activityInProgress, setActivityInProgress] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [showActivities, setShowActivities] = useState(false);

  useEffect(() => {
    const loadDefaultImage = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const img = new Image();
        img.crossOrigin = "anonymous";

        img.onerror = () => {
          setError("Failed to load default image");
          setIsLoading(false);
        };

        img.onload = async () => {
          try {
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d");

            if (!ctx) {
              throw new Error("Failed to get canvas context");
            }

            ctx.drawImage(img, 0, 0);
            const base64Image = canvas.toDataURL("image/jpeg");

            setImage(base64Image);
            await analyzeImage(base64Image);
          } catch (err) {
            console.error("Error processing default image:", err);
            setError("Failed to process default image");
          } finally {
            setIsLoading(false);
          }
        };

        img.src = DEFAULT_IMAGE;
      } catch (err) {
        console.error("Error in loadDefaultImage:", err);
        setError("Failed to initialize default image");
        setIsLoading(false);
      }
    };

    loadDefaultImage();
  }, []);

  const analyzeImage = async (imageData: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`http://127.0.0.1:5000/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: imageData }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to process image");
      }

      const data = await response.json();
      setEmotion(data.emotion);
      setConfidence(data.confidence);

      // Reset activity states when new emotion is detected
      setSelectedActivities([]);
      setActivityQueue([]);
      setCurrentActivity(null);
      setActivityInProgress(false);

      // Show activities section after emotion detection
      setShowActivities(true);
    } catch (err) {
      console.error("Error analyzing image:", err);
      setError(err instanceof Error ? err.message : "Failed to detect emotion");
      setEmotion(null);
      setConfidence(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImage = async (imageData: string) => {
    try {
      if (!imageData) {
        throw new Error("No image data received");
      }
      setImage(imageData);
      await analyzeImage(imageData);
    } catch (err) {
      console.error("Error handling image:", err);
      setError(err instanceof Error ? err.message : "Failed to process image");
    }
  };

  // Move to the next activity in the queue
  const moveToNextActivity = () => {
    // Remove the current activity from the queue
    const updatedQueue = [...activityQueue];
    updatedQueue.shift();
    setActivityQueue(updatedQueue);

    if (updatedQueue.length > 0) {
      // Start the next activity
      const nextActivity = updatedQueue[0];
      setCurrentActivity(nextActivity);
      setTimeRemaining((nextActivity.time || 5) * 60);

      // Start countdown timer for next activity
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            moveToNextActivity();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      // All activities completed
      setActivityInProgress(false);
      setCurrentActivity(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section - Full Height */}
      <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-gray-900 via-indigo-900/30 to-gray-900 px-4 sm:px-6 md:px-8 py-10 overflow-hidden relative">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -inset-[10px] opacity-30">
            {/* Animated background elements */}
            <div className="absolute top-1/4 left-1/4 w-32 sm:w-48 md:w-64 h-32 sm:h-48 md:h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute bottom-1/4 right-1/4 w-36 sm:w-56 md:w-72 h-36 sm:h-56 md:h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute top-1/4 right-0 w-40 sm:w-60 md:w-80 h-40 sm:h-60 md:h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
          </div>
        </div>

        <div className="container mx-auto text-center z-10 max-w-5xl">
          <div className="flex items-center justify-center gap-2 sm:gap-3 md:gap-5 mb-4 sm:mb-6 md:mb-8">
            <Smile className="w-10 h-10 sm:w-14 sm:h-14 md:w-20 md:h-20 text-indigo-500" />
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text pb-1 sm:pb-2">
              Emojify
            </h1>
          </div>
          <p className="text-xl sm:text-2xl md:text-4xl text-gray-300 mb-4 sm:mb-6 md:mb-8 font-light">
            Transform your expressions into emotions with AI
          </p>
          <div className="flex flex-col items-center gap-4 sm:gap-6 text-gray-300 mx-auto">
            <p className="text-base sm:text-lg md:text-xl text-center sm:text-justify">
              Experience AI-powered real-time emotion detection. Use your
              webcam, and Emojify will instantly analyze your expressions, match
              them with the perfect emoji, and suggest mood-boosting activities!
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mt-6 sm:mt-8 md:mt-12 w-full">
              <div className="bg-slate-800/50 p-3 sm:p-4 md:p-6 rounded-xl">
                <h3 className="font-semibold text-indigo-400 text-base sm:text-lg md:text-xl mb-1 sm:mb-2 md:mb-3">
                  Real-time Detection
                </h3>
                <p className="text-sm sm:text-base">
                  Instant emotion analysis through your webcam
                </p>
              </div>
              <div className="bg-slate-800/50 p-3 sm:p-4 md:p-6 rounded-xl">
                <h3 className="font-semibold text-purple-400 text-base sm:text-lg md:text-xl mb-1 sm:mb-2 md:mb-3">
                  Photo Upload
                </h3>
                <p className="text-sm sm:text-base">
                  Upload and analyze photos with ease
                </p>
              </div>
              <div className="bg-slate-800/50 p-3 sm:p-4 md:p-6 rounded-xl">
                <h3 className="font-semibold text-pink-400 text-base sm:text-lg md:text-xl mb-1 sm:mb-2 md:mb-3">
                  Mood Activities
                </h3>
                <p className="text-sm sm:text-base">
                  Get personalized activity suggestions based on your mood
                </p>
              </div>
              <div className="bg-slate-800/50 p-3 sm:p-4 md:p-6 rounded-xl">
                <h3 className="font-semibold text-green-400 text-base sm:text-lg md:text-xl mb-1 sm:mb-2 md:mb-3">
                  AI Assistant
                </h3>
                <p className="text-sm sm:text-base">
                  Chat for more personalized recommendations
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 sm:mt-12 md:mt-16">
            <button
              onClick={() =>
                document
                  .getElementById("app-section")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-base sm:text-lg md:text-xl font-medium py-2 sm:py-3 md:py-4 px-4 sm:px-6 md:px-8 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-indigo-600/20"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>

      <div
        id="app-section"
        className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-8 sm:py-12 md:py-12"
      >
        <div className="flex  flex-wrap justify-center gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8 md:mb-12">
          <button
            onClick={() => setMode("webcam")}
            className={`flex items-center gap-2 md:gap-3 px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 rounded-lg text-sm sm:text-base md:text-lg transition-colors ${
              mode === "webcam"
                ? "bg-indigo-600 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            <Camera size={20} className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
            Webcam
          </button>
          <button
            onClick={() => setMode("upload")}
            className={`flex items-center gap-2 md:gap-3 px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 rounded-lg text-sm sm:text-base md:text-lg transition-colors ${
              mode === "upload"
                ? "bg-indigo-600 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            <Upload size={20} className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
            Upload Photo
          </button>
        </div>

        {/* Main content area with responsive design */}
        <div className="max-w-full mx-auto">
          {/* Webcam/Upload Section - Full width */}
          <div className="bg-gray-800/50 p-4 sm:p-6 md:p-8 rounded-lg shadow-lg mb-6 sm:mb-8 md:mb-12">
            <div className="flex flex-col md:flex-row gap-4 sm:gap-6 md:gap-8">
              <div className="w-full">
                {mode === "webcam" ? (
                  <WebcamCapture onCapture={handleImage} />
                ) : (
                  <FileUpload onUpload={handleImage} />
                )}
              </div>
            </div>
          </div>

          {/* Results Section */}
          {(image || error) && (
            <div className="bg-gray-800/50 p-4 sm:p-6 md:p-8 rounded-lg shadow-lg mb-6 sm:mb-8 md:mb-12">
              <div className="flex flex-col md:flex-row gap-4 sm:gap-6 md:gap-8">
                {/* Image with responsive height */}
                {image && (
                  <div className="w-full md:w-3/5">
                    <div className="max-h-[50vh] md:max-h-[80vh] overflow-auto rounded-lg custom-scrollbar">
                      <img
                        src={image}
                        alt="Captured"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}

                {/* Emotion Display - responsive width */}
                <div className="w-full md:w-2/5 flex flex-col justify-center">
                  {error ? (
                    <div className="flex items-center gap-2 text-red-400 bg-red-900/20 p-3 sm:p-4 md:p-6 rounded-lg">
                      <AlertCircle
                        size={20}
                        className="w-5 h-5 sm:w-6 sm:h-6 md:w-6 md:h-6"
                      />
                      <span className="text-sm sm:text-base md:text-base">
                        {error}
                      </span>
                    </div>
                  ) : (
                    <EmotionDisplay emotion={emotion} confidence={confidence} />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Activity Suggestions Section */}
        {showActivities && emotion && (
          <div className="mt-8 sm:mt-12 md:mt-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-5 sm:mb-8 md:mb-10 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
              Mood-Based Activities
            </h2>

            {/* Activity Selector Component */}
            {showActivities && emotion && (
              <ActivitySelector emotion={emotion} />
            )}

            {/* AI Chatbot Section */}
            <Chatbot
              chatMessages={chatMessages}
              setChatMessages={setChatMessages}
              userInput={userInput}
              setUserInput={setUserInput}
              showChatbot={showChatbot}
              setShowChatbot={setShowChatbot}
              chatPrompts={chatPrompts}
            />
          </div>
        )}

        <footer className="mt-10 sm:mt-16 md:mt-20 text-center text-gray-400 text-xs sm:text-sm md:text-base">
          <p>© 2025 Emojify. All rights reserved.</p>
          <p className="mt-2 sm:mt-3">
            Powered by advanced Emotion Detection Model
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
