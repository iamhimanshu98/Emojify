import { Clock } from 'lucide-react';
import { Activity } from '../../constants';

interface ActivityProgressProps {
  currentActivity: Activity;
  activityQueue: Activity[];
  timeRemaining: number;
  onSkip: () => void;
}

export function ActivityProgress({
  currentActivity,
  activityQueue,
  timeRemaining,
  onSkip,
}: ActivityProgressProps) {
  const formatTimeRemaining = () => {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  };

  return (
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
          onClick={onSkip}
          className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 sm:py-3 px-4 sm:px-6 rounded transition duration-300 w-full sm:w-auto"
        >
          Skip Activity
        </button>
      </div>
    </div>
  );
}