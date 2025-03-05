import { useState, useEffect, useRef } from "react";
import {
  Camera,
  Upload,
  AlertCircle,
  Smile,
  Clock,
  Check,
  MessageSquare,
  Music,
  Lightbulb,
  Dices,
} from "lucide-react";
import { WebcamCapture } from "./components/WebcamCapture";
import { FileUpload } from "./components/FileUpload";
import { EmotionDisplay } from "./components/EmotionDisplay";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// const API_URL = "https://emojify-3amt.onrender.com";
const DEFAULT_IMAGE = "/images/boy.jpg";

const activitySuggestions = {
  happy: [
    {
      title: "Dance Party",
      description:
        "Turn up your favorite music and dance like nobody's watching!",
    },
    {
      title: "Gratitude Journal",
      description: "Write down 5 things you're grateful for today.",
    },
    {
      title: "Random Acts of Kindness",
      description: "Do something nice for someone else to spread the joy.",
    },
    {
      title: "Creative Project",
      description: "Start a fun art project or craft that makes you smile.",
    },
    {
      title: "Nature Walk",
      description: "Take a walk outside and appreciate the beauty around you.",
    },
    {
      title: "Call a Friend",
      description: "Share your good mood with someone you care about.",
    },
  ],
  sad: [
    {
      title: "Comfort Movie",
      description: "Watch a favorite film that always lifts your spirits.",
    },
    {
      title: "Gentle Movement",
      description: "Try some light yoga or stretching to release tension.",
    },
    {
      title: "Cozy Reading",
      description: "Curl up with a good book and a warm drink.",
    },
    {
      title: "Mindful Breathing",
      description:
        "Practice deep breathing for a few minutes to center yourself.",
    },
    {
      title: "Soothing Music",
      description: "Listen to calming music that resonates with you.",
    },
    {
      title: "Warm Bath",
      description: "Take a relaxing bath with essential oils or bath salts.",
    },
  ],
  angry: [
    {
      title: "Physical Release",
      description:
        "Go for a run or do some high-intensity exercise to release energy.",
    },
    {
      title: "Journaling",
      description: "Write down your thoughts to process your feelings.",
    },
    {
      title: "Stress Ball",
      description:
        "Squeeze a stress ball or punch a pillow to release tension safely.",
    },
    {
      title: "Deep Breathing",
      description: "Practice 4-7-8 breathing to calm your nervous system.",
    },
    {
      title: "Nature Break",
      description: "Step outside for fresh air and a change of scenery.",
    },
    {
      title: "Progressive Relaxation",
      description:
        "Tense and release each muscle group to release physical tension.",
    },
  ],
  surprised: [
    {
      title: "Mindful Moment",
      description: "Take a moment to ground yourself and process the surprise.",
    },
    {
      title: "Creative Expression",
      description:
        "Channel your energy into drawing or writing about your feelings.",
    },
    {
      title: "Curiosity Exploration",
      description: "Learn something new about a topic that interests you.",
    },
    {
      title: "Spontaneous Adventure",
      description: "Do something unplanned but fun to embrace the unexpected.",
    },
    {
      title: "Photo Walk",
      description:
        "Take photos of interesting things you normally wouldn't notice.",
    },
    {
      title: "New Recipe",
      description: "Try cooking something you've never made before.",
    },
  ],
  neutral: [
    {
      title: "Skill Building",
      description:
        "Learn something new or practice a skill you've been wanting to improve.",
    },
    {
      title: "Declutter Space",
      description:
        "Organize a small area of your home for a sense of accomplishment.",
    },
    {
      title: "Mindful Walking",
      description: "Take a walk and pay attention to all your senses.",
    },
    {
      title: "Goal Setting",
      description: "Reflect on your goals and plan some next steps.",
    },
    {
      title: "Podcast Time",
      description: "Listen to an interesting podcast on a topic you enjoy.",
    },
    {
      title: "People Watching",
      description: "Sit in a public place and observe the world around you.",
    },
  ],
  // Map other emotions to appropriate activities
  fear: [
    {
      title: "Grounding Exercise",
      description:
        "Practice the 5-4-3-2-1 technique to ground yourself in the present.",
    },
    {
      title: "Calming Visualization",
      description: "Imagine a peaceful place where you feel safe and secure.",
    },
    {
      title: "Gentle Stretching",
      description: "Release tension with slow, gentle stretches.",
    },
    {
      title: "Support Call",
      description: "Call a trusted friend or family member for support.",
    },
    {
      title: "Comfort Object",
      description:
        "Hold or use an object that brings you comfort and security.",
    },
    {
      title: "Positive Affirmations",
      description: "Repeat calming affirmations that help you feel safe.",
    },
  ],
  disgust: [
    {
      title: "Fresh Air",
      description:
        "Open windows or go outside for fresh air to clear your mind.",
    },
    {
      title: "Clean Space",
      description:
        "Tidy up your immediate environment to create a fresh feeling.",
    },
    {
      title: "Pleasant Scents",
      description: "Use essential oils or candles with scents you enjoy.",
    },
    {
      title: "Hand Washing Ritual",
      description: "Practice mindful hand washing as a cleansing ritual.",
    },
    {
      title: "Sensory Reset",
      description:
        "Focus on pleasant textures, sounds, or visuals to reset your senses.",
    },
    {
      title: "Boundary Setting",
      description:
        "Reflect on and write down healthy boundaries you want to maintain.",
    },
  ],
};

// Emotion-based background colors (subtle tints)
const emotionBackgrounds = {
  happy: "bg-indigo-900/5 border-lime-600/30",
  sad: "bg-blue-900/10 border-blue-600/30",
  angry: "bg-red-900/10 border-red-600/30",
  surprised: "bg-purple-900/10 border-purple-600/30",
  neutral: "bg-gray-800 border-gray-700",
  fear: "bg-indigo-900/10 border-indigo-600/30",
  disgust: "bg-green-900/10 border-green-600/30",
};

// Chat prompt suggestions
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

// Map API emotion labels to our activity categories
const mapEmotionToCategory = (emotion: string | null): string => {
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

// Activity type with selection and time properties
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

  // Refs for scrolling
  const chatSectionRef = useRef<HTMLDivElement>(null);

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

  // Initialize or shuffle displayed activities
  const shuffleActivities = () => {
    const emotionCategory = mapEmotionToCategory(emotion);
    const activities =
      activitySuggestions[
        emotionCategory as keyof typeof activitySuggestions
      ] || activitySuggestions.neutral;
    const shuffled = [...activities].sort(() => 0.5 - Math.random());

    // Reset any selections when shuffling
    setSelectedActivities([]);
    setDisplayedActivities(
      shuffled.slice(0, 3).map((activity) => ({
        ...activity,
        selected: false,
        time: 5,
      }))
    );
  };

  // Update activities when emotion changes
  useEffect(() => {
    if (emotion) {
      shuffleActivities();
    }
  }, [emotion]);

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

  // Toggle activity selection
  const toggleActivitySelection = (index: number) => {
    const updatedActivities = [...displayedActivities];
    updatedActivities[index].selected = !updatedActivities[index].selected;
    setDisplayedActivities(updatedActivities);

    // Update selected activities list
    if (updatedActivities[index].selected) {
      setSelectedActivities((prev) => [...prev, updatedActivities[index]]);
    } else {
      setSelectedActivities((prev) =>
        prev.filter((a) => a.title !== updatedActivities[index].title)
      );
    }
  };

  // Update activity time
  const updateActivityTime = (index: number, newTime: number) => {
    const updatedActivities = [...displayedActivities];
    updatedActivities[index].time = Math.max(2, Math.min(30, newTime));
    setDisplayedActivities(updatedActivities);

    // Also update in selected activities if it's there
    setSelectedActivities((prev) =>
      prev.map((activity) =>
        activity.title === updatedActivities[index].title
          ? { ...activity, time: updatedActivities[index].time }
          : activity
      )
    );
  };

  // Start the selected activities
  const startActivities = () => {
    if (selectedActivities.length > 0) {
      // Create a queue of activities to do in sequence
      setActivityQueue([...selectedActivities]);
      setActivityInProgress(true);

      // Start the first activity
      const firstActivity = selectedActivities[0];
      setCurrentActivity(firstActivity);
      setTimeRemaining((firstActivity.time || 5) * 60); // Convert minutes to seconds

      // Start countdown timer
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

  // Format time remaining in MM:SS
  const formatTimeRemaining = () => {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  // Handle chatbot interaction
  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    // Add user message to chat
    const newUserMessage = { text: userInput, sender: "user" };
    setChatMessages((prev) => [...prev, newUserMessage]);

    try {
      const response = await fetch("http://127.0.0.1:5000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userInput }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch AI response");
      }

      const data = await response.json();
      const aiResponse = data.response || "Sorry, I couldn't process that.";

      // Add AI response to chat
      setChatMessages((prev) => [...prev, { text: aiResponse, sender: "ai" }]);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setChatMessages((prev) => [
        ...prev,
        { text: "Error communicating with AI.", sender: "ai" },
      ]);
    }

    setUserInput(""); // Clear input after sending
  };

  // Handle clicking on a chat prompt suggestion
  const handlePromptClick = (promptText: string) => {
    setUserInput(promptText);
  };

  // Get emotion-based background class
  const getEmotionBackground = () => {
    const emotionCategory = mapEmotionToCategory(emotion);
    return (
      emotionBackgrounds[emotionCategory as keyof typeof emotionBackgrounds] ||
      emotionBackgrounds.neutral
    );
  };

  // Handle opening chat and scrolling to it
  const handleOpenChat = () => {
    setShowChatbot(!showChatbot);

    // If opening the chat, scroll to it after a short delay to allow rendering
    if (!showChatbot) {
      setTimeout(() => {
        chatSectionRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
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

            {/* Activity in Progress */}
            {activityInProgress && currentActivity && (
              <div className="bg-gradient-to-r from-green-900/40 to-emerald-900/40 border-l-4 border-green-500 rounded-lg shadow-lg p-4 sm:p-6 md:p-8 mb-6 sm:mb-8 md:mb-12">
                <h2 className="text-xl sm:text-2xl font-semibold text-green-400 mb-2 sm:mb-3">
                  Activity in Progress
                </h2>
                <p className="text-lg sm:text-xl font-medium mb-2 sm:mb-3 text-white">
                  {currentActivity.title}
                </p>
                <p className="text-sm sm:text-base md:text-lg text-gray-300 mb-4 sm:mb-6">
                  {currentActivity.description}
                </p>

                {activityQueue.length > 1 && (
                  <div className="mb-4 sm:mb-6">
                    <p className="text-sm sm:text-base text-gray-400 mb-2 sm:mb-3">
                      Up next:
                    </p>
                    <div className="flex flex-wrap gap-2 sm:gap-3">
                      {activityQueue.slice(1).map((activity, idx) => (
                        <div
                          key={idx}
                          className="bg-gray-800 px-2 sm:px-3 md:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm"
                        >
                          {activity.title} ({activity.time}min)
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center">
                    <Clock className="text-green-400 mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
                    <span className="text-xl sm:text-2xl md:text-3xl font-mono font-bold text-green-400">
                      {formatTimeRemaining()}
                    </span>
                  </div>
                  <button
                    onClick={moveToNextActivity}
                    className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 sm:py-3 px-4 sm:px-6 rounded transition duration-300 w-full sm:w-auto"
                  >
                    Skip Activity
                  </button>
                </div>
              </div>
            )}

            {/* Activity Selection Section */}
            {!activityInProgress && (
              <div className="rounded-lg shadow-lg p-4 sm:p-6 md:p-8 mb-6 sm:mb-8 md:mb-12 border border-gray-700 bg-gray-800/50">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 mb-4 sm:mb-6 md:mb-8">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-white">
                    Suggested Activities for Your Mood
                  </h2>
                  <p className="text-sm sm:text-base md:text-lg text-gray-400">
                    Select one or more activities
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 md:gap-8 mb-6 sm:mb-8">
                  {displayedActivities.map((activity, index) => {
                    // Get emotion-based background for non-selected items
                    const emotionCategory = mapEmotionToCategory(emotion);
                    const bgClass = activity.selected
                      ? "bg-indigo-900/40 border-indigo-500"
                      : `${emotionBackgrounds[
                          emotionCategory as keyof typeof emotionBackgrounds
                        ].replace(
                          "border-",
                          ""
                        )} border-gray-700 hover:bg-gray-700/80`;

                    return (
                      <div
                        key={index}
                        className={`rounded-lg p-3 sm:p-4 md:p-6 cursor-pointer transition duration-300 border ${bgClass}`}
                        onClick={() => toggleActivitySelection(index)}
                      >
                        <div className="flex justify-between items-start mb-2 sm:mb-3 md:mb-">
                          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-indigo-300">
                            {activity.title}
                          </h3>
                          <div
                            className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center ${
                              activity.selected
                                ? "border-indigo-400 bg-indigo-600"
                                : "border-gray-500"
                            }`}
                          >
                            {activity.selected && (
                              <Check
                                size={14}
                                className="text-white w-3 h-3 sm:w-4 sm:h-4"
                              />
                            )}
                          </div>
                        </div>
                        <p className="text-sm sm:text-base md:text-lg text-gray-300 mb-3 sm:mb-4 md:mb-5">
                          {activity.description}
                        </p>

                        {activity.selected && (
                          <div className="mt-2 sm:mt-3 md:mt-4">
                            <p className="text-xs sm:text-sm md:text-base text-gray-400 mb-1 sm:mb-2">
                              Time (minutes):
                            </p>
                            <div className="flex items-center">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updateActivityTime(
                                    index,
                                    (activity.time || 5) - 1
                                  );
                                }}
                                className="bg-gray-700 hover:bg-gray-600 w-8 sm:w-9 md:w-10 h-8 sm:h-9 md:h-10 rounded-l flex items-center justify-center text-sm sm:text-base"
                              >
                                -
                              </button>
                              <div className="bg-gray-800 w-10 sm:w-12 md:w-14 h-8 sm:h-9 md:h-10 flex items-center justify-center border-t border-b border-gray-700 text-sm sm:text-base md:text-lg">
                                {activity.time || 5}
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updateActivityTime(
                                    index,
                                    (activity.time || 5) + 1
                                  );
                                }}
                                className="bg-gray-700 hover:bg-gray-600 w-8 sm:w-9 md:w-10 h-8 sm:h-9 md:h-10 rounded-r flex items-center justify-center text-sm sm:text-base"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-4">
                  <button
                    onClick={shuffleActivities}
                    className="flex items-center justify-center bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 sm:py-3 px-4 sm:px-6 rounded transition duration-300 sm:w-auto w-full text-sm sm:text-base"
                  >
                    <Dices className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    Shuffle Activities
                  </button>
                  <button
                    onClick={startActivities}
                    disabled={selectedActivities.length === 0}
                    className={`flex items-center justify-center font-medium py-2 sm:py-3 px-4 sm:px-6 rounded transition duration-300 sm:w-auto w-full text-sm sm:text-base ${
                      selectedActivities.length > 0
                        ? "bg-green-600 hover:bg-green-700 text-white"
                        : "bg-gray-600 text-gray-400"
                    }`}
                    style={{
                      cursor:
                        selectedActivities.length > 0 ? "pointer" : "default",
                    }}
                  >
                    <Check className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    Start{" "}
                    {selectedActivities.length > 0
                      ? `${selectedActivities.length} `
                      : ""}
                    Activities
                  </button>
                </div>
              </div>
            )}

            {/* AI Chatbot Section */}
            <div
              ref={chatSectionRef}
              className="bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 md:p-8"
            >
              <div
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4 sm:mb-6 cursor-pointer"
                onClick={handleOpenChat}
              >
                <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-white">
                  Need more suggestions?
                </h2>
                <button className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 sm:py-3 px-4 sm:px-6 rounded transition duration-300 text-sm sm:text-base w-full sm:w-auto justify-center sm:justify-start">
                  <MessageSquare className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  {showChatbot ? "Hide Chat" : "Open Chat"}
                </button>
              </div>

              {/* Smooth Transition for Open/Close */}
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  showChatbot
                    ? "max-h-[600px] opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="border border-gray-700 rounded-lg">
                  <div className="h-64 sm:h-80 md:h-96 overflow-y-auto p-3 sm:p-4 md:p-6 bg-gray-900 custom-scrollbar">
                    {chatMessages.length === 0 ? (
                      <div className="text-center text-gray-500 mt-4 sm:mt-6 md:mt-8 mb-5 sm:mb-8 md:mb-10">
                        <MessageSquare className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 mx-auto mb-3 sm:mb-4 opacity-50" />
                        <p className="mb-4 sm:mb-6 md:mb-8 text-sm sm:text-base md:text-lg">
                          Ask for personalized activity suggestions based on
                          your mood!
                        </p>

                        {/* Prompt suggestions */}
                        <div className="flex flex-col gap-2 sm:gap-3">
                          {chatPrompts.map((prompt, idx) => (
                            <button
                              key={idx}
                              onClick={() => handlePromptClick(prompt.text)}
                              className="flex items-center gap-2 sm:gap-3 bg-gray-800 hover:bg-gray-700 text-left text-gray-300 p-3 sm:p-4 rounded-lg transition-colors text-xs sm:text-sm md:text-base"
                            >
                              <span className="text-indigo-400">
                                {prompt.icon}
                              </span>
                              {prompt.text}
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="space-y-3 sm:space-y-4 md:space-y-5 mb-4 sm:mb-5 md:mb-6">
                          {chatMessages.map((msg, index) => (
                            <div
                              key={index}
                              className={`flex ${
                                msg.sender === "user"
                                  ? "justify-end"
                                  : "justify-start"
                              }`}
                            >
                              <div
                                className={`max-w-[80%] px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 md:py-3 rounded-lg text-xs sm:text-sm md:text-base ${
                                  msg.sender === "user"
                                    ? "bg-indigo-600 text-white rounded-br-none"
                                    : "bg-gray-700 text-gray-200 rounded-bl-none"
                                }`}
                              >
                                <div className="chat-message">
                                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Prompt suggestions after messages */}
                        <div className="flex flex-wrap gap-2 sm:gap-3 mt-3 sm:mt-4 md:mt-6">
                          {chatPrompts.map((prompt, idx) => (
                            <button
                              key={idx}
                              onClick={() => handlePromptClick(prompt.text)}
                              className="flex items-center gap-1 sm:gap-2 bg-gray-800 hover:bg-gray-700 text-gray-300 px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-full text-xs sm:text-sm transition-colors"
                            >
                              <span className="text-indigo-400">
                                {prompt.icon}
                              </span>
                              {prompt.text}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  <form
                    onSubmit={handleChatSubmit}
                    className="flex border-t border-gray-700"
                  >
                    <input
                      type="text"
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      placeholder="Ask for more activity suggestions..."
                      className="flex-grow p-2 sm:p-3 md:p-4 bg-gray-800 text-white focus:outline-none text-sm sm:text-base md:text-lg"
                    />
                    <button
                      type="submit"
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 sm:px-4 md:px-6 text-sm sm:text-base"
                    >
                      Send
                    </button>
                  </form>
                </div>
              </div>
            </div>
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
