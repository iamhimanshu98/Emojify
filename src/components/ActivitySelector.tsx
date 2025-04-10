import React, { useState, useEffect } from "react";
import { Clock, Check, Dices } from "lucide-react";
import activitySuggestions from "./data/activitySuggestions";

interface Activity {
  title: string;
  description: string;
  selected?: boolean;
  time?: number;
}

interface Props {
  emotion: string;
}

const ActivitySelector: React.FC<Props> = ({ emotion }) => {
  const [displayedActivities, setDisplayedActivities] = useState<Activity[]>(
    []
  );
  const [selectedActivities, setSelectedActivities] = useState<Activity[]>([]);
  const [activityQueue, setActivityQueue] = useState<Activity[]>([]);
  const [activityInProgress, setActivityInProgress] = useState(false);
  const [currentActivity, setCurrentActivity] = useState<Activity | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(0);

  const shuffleActivities = () => {
    const activities =
      activitySuggestions[emotion] || activitySuggestions.neutral;
    const shuffled = [...activities].sort(() => 0.5 - Math.random());
    setSelectedActivities([]);
    setDisplayedActivities(
      shuffled.slice(0, 3).map((activity) => ({
        ...activity,
        selected: false,
        time: activity.time || 5,
      }))
    );
  };

  useEffect(() => {
    if (emotion) {
      shuffleActivities();
    }
  }, [emotion]);

  const toggleActivitySelection = (index: number) => {
    const updatedActivities = [...displayedActivities];
    updatedActivities[index].selected = !updatedActivities[index].selected;
    setDisplayedActivities(updatedActivities);

    if (updatedActivities[index].selected) {
      setSelectedActivities((prev) => [...prev, updatedActivities[index]]);
    } else {
      setSelectedActivities((prev) =>
        prev.filter((a) => a.title !== updatedActivities[index].title)
      );
    }
  };

  const updateActivityTime = (index: number, newTime: number) => {
    const updatedActivities = [...displayedActivities];
    updatedActivities[index].time = Math.max(2, Math.min(30, newTime));
    setDisplayedActivities(updatedActivities);

    setSelectedActivities((prev) =>
      prev.map((activity) =>
        activity.title === updatedActivities[index].title
          ? { ...activity, time: updatedActivities[index].time }
          : activity
      )
    );
  };

  const startActivities = () => {
    if (selectedActivities.length > 0) {
      setActivityQueue([...selectedActivities]);
      setActivityInProgress(true);
      const firstActivity = selectedActivities[0];
      setCurrentActivity(firstActivity);
      setTimeRemaining((firstActivity.time || 5) * 60);

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

  const moveToNextActivity = () => {
    const updatedQueue = [...activityQueue];
    updatedQueue.shift();
    setActivityQueue(updatedQueue);

    if (updatedQueue.length > 0) {
      const nextActivity = updatedQueue[0];
      setCurrentActivity(nextActivity);
      setTimeRemaining((nextActivity.time || 5) * 60);

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
      setActivityInProgress(false);
      setCurrentActivity(null);
    }
  };

  const formatTimeRemaining = () => {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const formatEmotion = (emotion: string | null) =>
    emotion ? `${emotion.charAt(0).toUpperCase()}${emotion.slice(1)}` : ""; 


  // const mapEmotionToCategory = (emotion: string | null): string => {
  //   if (!emotion) return "neutral";

  //   const emotionMap: { [key: string]: string } = {
  //     happy: "happy",
  //     sad: "sad",
  //     angry: "angry",
  //     fear: "fear",
  //     surprise: "surprised",
  //     disgust: "disgust",
  //     neutral: "neutral",
  //   };

  //   // return "neutral";
  //   return emotionMap[emotion.toLowerCase()] || "neutral";
  // };

  const emotionBackgrounds = {
    happy: "bg-indigo-900/5 border-lime-600/30",
    sad: "bg-blue-900/10 border-blue-600/30",
    angry: "bg-red-900/10 border-red-600/30",
    surprised: "bg-purple-900/10 border-purple-600/30",
    neutral: "bg-gray-800 border-gray-700",
    fear: "bg-indigo-900/10 border-indigo-600/30",
    disgust: "bg-green-900/10 border-green-600/30",
  };

  return (
    <div>
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

      {!activityInProgress && (
        <div className="rounded-lg shadow-lg p-4 sm:p-6 md:p-8 mb-6 sm:mb-8 md:mb-12 border border-gray-700 bg-gray-800/50">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 mb-4 sm:mb-6 md:mb-8">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-white">
              Suggested Activities for {formatEmotion(emotion)} Mood
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-400">
              Select one or more activities
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 md:gap-8 mb-6 sm:mb-8">
            {displayedActivities.map((activity, index) => {
              // const emotionCategory = mapEmotionToCategory(emotion);
              const bgClass = activity.selected
                ? "bg-indigo-900/40 border-indigo-500"
                : `${emotionBackgrounds.neutral.replace(
                    "border-",
                    ""
                  )} border-gray-700 hover:bg-gray-700/80`;

              return (
                <div
                  key={index}
                  className={`rounded-lg p-3 sm:p-4 md:p-6 cursor-pointer transition duration-300 border ${bgClass}`}
                  onClick={() => toggleActivitySelection(index)}
                >
                  <div className="flex justify-between items-start mb-2 sm:mb-3 md:mb-4">
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
                        Time (min):
                      </p>
                      <div className="flex items-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            updateActivityTime(index, (activity.time || 5) - 1);
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
                            updateActivityTime(index, (activity.time || 5) + 1);
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
                cursor: selectedActivities.length > 0 ? "pointer" : "default",
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
    </div>
  );
};

export default ActivitySelector;
