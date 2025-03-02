import { useState, useEffect } from "react";
import {
  Camera,
  Upload,
  AlertCircle,
  Smile,
  Shuffle,
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

const API_URL = "https://emojify-3amt.onrender.com";
const DEFAULT_IMAGE = "/images/boy.jpg";

// Activity suggestions based on emotions
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
  happy: "bg-yellow-900/20 border-yellow-600/30",
  sad: "bg-blue-900/20 border-blue-600/30",
  angry: "bg-red-900/20 border-red-600/30",
  surprised: "bg-purple-900/20 border-purple-600/30",
  neutral: "bg-gray-800 border-gray-700",
  fear: "bg-indigo-900/20 border-indigo-600/30",
  disgust: "bg-green-900/20 border-green-600/30",
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
  const [showChatbot, setShowChatbot] = useState(false);
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
  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    // Add user message
    const newUserMessage = { text: userInput, sender: "user" };
    setChatMessages((prev) => [...prev, newUserMessage]);

    // Generate AI response based on emotion
    setTimeout(() => {
      let response = "";
      const emotionCategory = mapEmotionToCategory(emotion);

      switch (emotionCategory) {
        case "happy":
          response =
            "Since you're feeling happy, you might also enjoy calling a friend to share your good mood, starting a creative project, or planning something fun for the weekend!";
          break;
        case "sad":
          response =
            "I understand you're feeling down. Sometimes gentle self-care like a warm drink, a comfort show, or wrapping yourself in a cozy blanket can help. Would you like more suggestions?";
          break;
        case "angry":
          response =
            "When feeling angry, it can help to try physical activities to release tension, like a brisk walk or some push-ups. Would you like me to suggest some calming techniques?";
          break;
        case "surprised":
          response =
            "Surprise can be energizing! You might channel that energy into trying something new or spontaneous today. Would you like some ideas for quick adventures?";
          break;
        case "fear":
          response =
            "When feeling fearful, grounding exercises can help bring you back to the present moment. Would you like me to suggest some techniques?";
          break;
        case "disgust":
          response =
            "For feelings of disgust, creating a clean, fresh environment can help reset your senses. Would you like more ideas for sensory reset activities?";
          break;
        case "neutral":
          response =
            "A neutral mood is a great time for reflection or planning. You might try journaling about your goals or organizing something that's been on your mind. What interests you?";
          break;
        default:
          response =
            "I'd be happy to suggest more activities based on how you're feeling. What kinds of activities do you usually enjoy?";
      }

      setChatMessages((prev) => [...prev, { text: response, sender: "ai" }]);
    }, 1000);

    setUserInput("");
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

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-8 md:px-12 lg:px-16 py-8">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Smile className="w-12 h-12 text-indigo-500" />
            <h1 className="text-5xl pb-2 font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
              Emojify
            </h1>
          </div>
          <p className="text-xl text-gray-400 mb-4">
            Transform your expressions into emotions with AI
          </p>
          <div className="flex flex-col items-center gap-2 text-gray-400 max-w-2xl mx-auto">
            <p className="text-sm">
              Experience real-time emotion detection powered by advanced AI.
              Whether you're using your webcam or uploading a photo, Emojify
              instantly analyzes facial expressions and matches them with the
              perfect emoji and suggests activities to match your mood.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="font-semibold text-indigo-400 mb-2">
                  Real-time Detection
                </h3>
                <p className="text-xs">
                  Instant emotion analysis through your webcam
                </p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-400 mb-2">
                  Photo Upload
                </h3>
                <p className="text-xs">Upload and analyze photos with ease</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="font-semibold text-pink-400 mb-2">
                  Mood Activities
                </h3>
                <p className="text-xs">
                  Get personalized activity suggestions based on your mood
                </p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="font-semibold text-green-400 mb-2">
                  AI Assistant
                </h3>
                <p className="text-xs">
                  Chat for more personalized recommendations
                </p>
              </div>
            </div>
          </div>
        </header>

        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setMode("webcam")}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors ${
              mode === "webcam"
                ? "bg-indigo-600 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            <Camera size={20} />
            Webcam
          </button>
          <button
            onClick={() => setMode("upload")}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors ${
              mode === "upload"
                ? "bg-indigo-600 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            <Upload size={20} />
            Upload Photo
          </button>
        </div>

        {/* Main content area with fixed heights */}
        <div className="max-w-full mx-auto">
          {/* Webcam/Upload Section - Full width */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
            <div className="flex flex-col md:flex-row gap-8">
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
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
              <div className="flex flex-col md:flex-row gap-8">
                {/* Image with fixed height */}
                {image && (
                  <div className="md:w-1/2">
                    <div className="h-64 md:h-80 overflow-hidden rounded-lg">
                      <img
                        src={image}
                        alt="Captured"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}

                {/* Emotion Display */}
                <div className="md:w-1/2 flex flex-col justify-center">
                  {error ? (
                    <div className="flex items-center gap-2 text-red-400 bg-red-900/20 p-4 rounded-lg">
                      <AlertCircle size={20} />
                      {error}
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
          <div className="mt-12">
            <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
              Mood-Based Activities
            </h2>

            {/* Activity in Progress */}
            {activityInProgress && currentActivity && (
              <div className="bg-gradient-to-r from-green-900/40 to-emerald-900/40 border-l-4 border-green-500 rounded-lg shadow-lg p-6 mb-8">
                <h2 className="text-2xl font-semibold text-green-400 mb-2">
                  Activity in Progress
                </h2>
                <p className="text-xl font-medium mb-2 text-white">
                  {currentActivity.title}
                </p>
                <p className="text-gray-300 mb-4">
                  {currentActivity.description}
                </p>

                {activityQueue.length > 1 && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-400 mb-2">Up next:</p>
                    <div className="flex flex-wrap gap-2">
                      {activityQueue.slice(1).map((activity, idx) => (
                        <div
                          key={idx}
                          className="bg-gray-800 px-3 py-1 rounded-full text-xs"
                        >
                          {activity.title} ({activity.time}min)
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Clock className="text-green-400 mr-2" />
                    <span className="text-2xl font-mono font-bold text-green-400">
                      {formatTimeRemaining()}
                    </span>
                  </div>
                  <button
                    onClick={moveToNextActivity}
                    className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded transition duration-300"
                  >
                    Skip Activity
                  </button>
                </div>
              </div>
            )}

            {/* Activity Selection Section */}
            {!activityInProgress && (
              <div
                className={`rounded-lg shadow-lg p-6 mb-8 border ${getEmotionBackground()}`}
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold text-white">
                    Suggested Activities for Your Mood
                  </h2>
                  <p className="text-gray-400">
                    Select one or more activities to start
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  {displayedActivities.map((activity, index) => (
                    <div
                      key={index}
                      className={`rounded-lg p-5 cursor-pointer transition duration-300 border ${
                        activity.selected
                          ? "bg-indigo-900/40 border-indigo-500"
                          : "bg-gray-800/80 border-gray-700 hover:bg-gray-700/80"
                      }`}
                      onClick={() => toggleActivitySelection(index)}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-xl font-bold text-indigo-300">
                          {activity.title}
                        </h3>
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            activity.selected
                              ? "border-indigo-400 bg-indigo-600"
                              : "border-gray-500"
                          }`}
                        >
                          {activity.selected && (
                            <Check size={14} className="text-white" />
                          )}
                        </div>
                      </div>
                      <p className="text-gray-300 mb-4">
                        {activity.description}
                      </p>

                      {activity.selected && (
                        <div className="mt-3">
                          <p className="text-sm text-gray-400 mb-2">
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
                              className="bg-gray-700 hover:bg-gray-600 w-8 h-8 rounded-l flex items-center justify-center"
                            >
                              -
                            </button>
                            <div className="bg-gray-800 w-12 h-8 flex items-center justify-center border-t border-b border-gray-700">
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
                              className="bg-gray-700 hover:bg-gray-600 w-8 h-8 rounded-r flex items-center justify-center"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <button
                    onClick={shuffleActivities}
                    className="flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-6 rounded transition duration-300 sm:w-auto w-full"
                  >
                    <Dices className="mr-2 h-5 w-5" />
                    Shuffle Activities
                  </button>
                  <button
                    onClick={startActivities}
                    disabled={selectedActivities.length === 0}
                    className={`flex items-center justify-center font-medium py-3 px-6 rounded transition duration-300 sm:w-auto w-full ${
                      selectedActivities.length > 0
                        ? "bg-green-600 hover:bg-green-700 text-white"
                        : "bg-gray-600 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    <Check className="mr-2 h-5 w-5" />
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
            <div className="bg-gray-800 rounded-lg shadow-lg p-6">
              <div
                className="flex justify-between items-center mb-4 cursor-pointer"
                onClick={() => setShowChatbot(!showChatbot)}
              >
                <h2 className="text-2xl font-semibold text-white">
                  Need more suggestions?
                </h2>
                <button className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded transition duration-300">
                  <MessageSquare className="mr-2 h-5 w-5" />
                  {showChatbot ? "Hide Chat" : "Open Chat"}
                </button>
              </div>

              {showChatbot && (
                <div className="border border-gray-700 rounded-lg">
                  <div className="h-64 overflow-y-auto p-4 bg-gray-900">
                    {chatMessages.length === 0 ? (
                      <div className="text-center text-gray-500 mt-6 mb-8">
                        <MessageSquare className="h-10 w-10 mx-auto mb-2 opacity-50" />
                        <p className="mb-6">
                          Ask for personalized activity suggestions based on
                          your mood!
                        </p>

                        {/* Prompt suggestions */}
                        <div className="flex flex-col gap-2">
                          {chatPrompts.map((prompt, idx) => (
                            <button
                              key={idx}
                              onClick={() => handlePromptClick(prompt.text)}
                              className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-left text-gray-300 p-3 rounded-lg transition-colors"
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
                        <div className="space-y-4 mb-4">
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
                                className={`max-w-[80%] px-4 py-2 rounded-lg ${
                                  msg.sender === "user"
                                    ? "bg-indigo-600 text-white rounded-br-none"
                                    : "bg-gray-700 text-gray-200 rounded-bl-none"
                                }`}
                              >
                                {msg.text}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Prompt suggestions after messages */}
                        <div className="flex flex-wrap gap-2 mt-4">
                          {chatPrompts.map((prompt, idx) => (
                            <button
                              key={idx}
                              onClick={() => handlePromptClick(prompt.text)}
                              className="flex items-center gap-1 bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-xs transition-colors"
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
                      className="flex-grow p-3 bg-gray-800 text-white focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4"
                    >
                      Send
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        )}

        <footer className="mt-16 text-center text-gray-400 text-sm">
          <p>© 2025 Emojify. All rights reserved.</p>
          <p className="mt-2">Powered by advanced Emotion Detection Model</p>
        </footer>
      </div>
    </div>
  );
}

export default App;

/*

dont add the scale effect on the hero section items its not good keep it simple.
also when I click on get started it should scroll to that section smoothly.

*/
