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
  const [activityQueue, setActivityQueue] = useState<Activity[]>([]);
  const [activityInProgress, setActivityInProgress] = useState(false);
  const [currentActivity, setCurrentActivity] = useState<Activity | null>(null);
  const [selectedActivities, setSelectedActivities] = useState<Activity[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(0);

  useEffect(() => {
    if (emotion && activitySuggestions[emotion]) {
      setActivityQueue(activitySuggestions[emotion]);
    }
  }, [emotion]);

  const formatTimeRemaining = () => {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const toggleActivitySelection = (index: number) => {
    const updatedActivities = [...activityQueue];
    updatedActivities[index].selected = !updatedActivities[index].selected;
    setSelectedActivities(updatedActivities.filter((act) => act.selected));
  };

  const startActivities = () => {
    if (selectedActivities.length > 0) {
      setActivityQueue(selectedActivities);
      setCurrentActivity(selectedActivities[0]);
      setActivityInProgress(true);
      setTimeRemaining((selectedActivities[0].time || 5) * 60);
    }
  };

  const moveToNextActivity = () => {
    if (activityQueue.length > 1) {
      const nextActivities = activityQueue.slice(1);
      setActivityQueue(nextActivities);
      setCurrentActivity(nextActivities[0]);
      setTimeRemaining((nextActivities[0].time || 5) * 60);
    } else {
      setActivityInProgress(false);
      setCurrentActivity(null);
    }
  };

  useEffect(() => {
    if (timeRemaining > 0 && activityInProgress) {
      const timer = setTimeout(() => setTimeRemaining(timeRemaining - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeRemaining, activityInProgress]);

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-gray-800 border border-gray-700 rounded-lg shadow-lg">
      {activityInProgress && currentActivity && (
        <div className="bg-green-900/40 border-l-4 border-green-500 p-6 mb-6 rounded-lg">
          <h2 className="text-green-400 text-xl sm:text-2xl font-semibold mb-2">
            Activity in Progress
          </h2>
          <p className="text-lg font-medium text-white mb-2">
            {currentActivity.title}
          </p>
          <p className="text-sm text-gray-300 mb-4">
            {currentActivity.description}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Clock className="text-green-400 mr-2" />
              <span className="text-xl font-mono font-bold text-green-400">
                {formatTimeRemaining()}
              </span>
            </div>
            <button
              onClick={moveToNextActivity}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition"
            >
              Skip Activity
            </button>
          </div>
        </div>
      )}

      {!activityInProgress && (
        <div>
          <h2 className="text-white text-2xl font-semibold mb-4">
            Suggested Activities for Your Mood
          </h2>
          <p className="text-gray-400 text-sm mb-6">
            Select one or more activities
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {activityQueue.map((activity, index) => (
              <div
                key={index}
                className={`p-4 border rounded-lg cursor-pointer transition ${
                  activity.selected
                    ? "bg-indigo-900 border-indigo-500"
                    : "border-gray-700"
                }`}
                onClick={() => toggleActivitySelection(index)}
              >
                <h3 className="text-indigo-300 text-lg font-bold">
                  {activity.title}
                </h3>
                <p className="text-gray-300 text-sm mb-3">
                  {activity.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-xs">
                    Time: {activity.time || 5} min
                  </span>
                  {activity.selected && <Check className="text-green-400" />}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between mt-6">
            <button
              onClick={startActivities}
              disabled={selectedActivities.length === 0}
              className={`px-6 py-2 rounded text-white transition ${
                selectedActivities.length > 0
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-gray-600"
              }`}
            >
              Start Activities
            </button>
            <button
              onClick={() =>
                setActivityQueue([...activitySuggestions[emotion]])
              }
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded transition"
            >
              <Dices className="mr-2" /> Shuffle
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivitySelector;
