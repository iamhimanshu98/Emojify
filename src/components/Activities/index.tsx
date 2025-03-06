import { useState, useEffect } from 'react';
import { Check, Clock, Dices } from 'lucide-react';
import { Activity, activitySuggestions, emotionBackgrounds } from '../../constants';
import { mapEmotionToCategory } from '../../utils';

interface ActivitiesProps {
  emotion: string | null;
  onActivityStart: (activities: Activity[]) => void;
}

export function Activities({ emotion, onActivityStart }: ActivitiesProps) {
  const [displayedActivities, setDisplayedActivities] = useState<Activity[]>([]);
  const [selectedActivities, setSelectedActivities] = useState<Activity[]>([]);

  useEffect(() => {
    if (emotion) {
      shuffleActivities();
    }
  }, [emotion]);

  const shuffleActivities = () => {
    const emotionCategory = mapEmotionToCategory(emotion);
    const activities = activitySuggestions[emotionCategory] || activitySuggestions.neutral;
    const shuffled = [...activities].sort(() => 0.5 - Math.random());

    setSelectedActivities([]);
    setDisplayedActivities(
      shuffled.slice(0, 3).map((activity) => ({
        ...activity,
        selected: false,
        time: 5,
      }))
    );
  };

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
      onActivityStart(selectedActivities);
    }
  };

  return (
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
          const emotionCategory = mapEmotionToCategory(emotion);
          const bgClass = activity.selected
            ? "bg-indigo-900/40 border-indigo-500"
            : `${emotionBackgrounds[emotionCategory].replace(
                "border-",
                ""
              )} border-gray-700 hover:bg-gray-700/80`;

          return (
            <div
              key={index}
              className={`rounded-lg p-3 sm:p-4 md:p-6 cursor-pointer transition duration-300 border ${bgClass}`}
              onClick={() => toggleActivitySelection(index)}
            >
              <div className="flex justify-between items-start mb-2 sm:mb-3">
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
                    <Check className="text-white w-3 h-3 sm:w-4 sm:h-4" />
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
                        updateActivityTime(index, (activity.time || 5) - 1);
                      }}
                      className="bg-gray-700 hover:bg-gray-600 w-8 sm:w-9 md:w-10 h-8 sm:h-9 md:h-10 rounded-l flex items-center justify-center"
                    >
                      -
                    </button>
                    <div className="bg-gray-800 w-10 sm:w-12 md:w-14 h-8 sm:h-9 md:h-10 flex items-center justify-center border-t border-b border-gray-700">
                      {activity.time || 5}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updateActivityTime(index, (activity.time || 5) + 1);
                      }}
                      className="bg-gray-700 hover:bg-gray-600 w-8 sm:w-9 md:w-10 h-8 sm:h-9 md:h-10 rounded-r flex items-center justify-center"
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
          className="flex items-center justify-center bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 sm:py-3 px-4 sm:px-6 rounded transition duration-300 sm:w-auto w-full"
        >
          <Dices className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
          Shuffle Activities
        </button>
        <button
          onClick={startActivities}
          disabled={selectedActivities.length === 0}
          className={`flex items-center justify-center font-medium py-2 sm:py-3 px-4 sm:px-6 rounded transition duration-300 sm:w-auto w-full ${
            selectedActivities.length > 0
              ? "bg-green-600 hover:bg-green-700 text-white"
              : "bg-gray-600 text-gray-400 cursor-not-allowed"
          }`}
        >
          <Check className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
          Start {selectedActivities.length > 0 ? `${selectedActivities.length} ` : ""}
          Activities
        </button>
      </div>
    </div>
  );
}