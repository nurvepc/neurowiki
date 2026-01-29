import React, { useState, useEffect } from 'react';

interface Milestone {
  name: string;
  targetMinutes: number;
  achieved: boolean;
}

export const StrokeTimer: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [arrivalTime, setArrivalTime] = useState<string>('');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const handleStart = () => {
    if (!isRunning && elapsedSeconds === 0) {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours % 12 || 12;
      setArrivalTime(`${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`);
    }
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setElapsedSeconds(0);
    setArrivalTime('');
  };

  const elapsedMinutes = elapsedSeconds / 60;
  const minutes = Math.floor(elapsedMinutes);
  const seconds = elapsedSeconds % 60;

  const milestones: Milestone[] = [
    { name: 'Time to CT', targetMinutes: 25, achieved: elapsedMinutes >= 25 },
    { name: 'Door to Needle', targetMinutes: 60, achieved: elapsedMinutes >= 60 },
  ];

  const getTimerColor = () => {
    if (!isRunning) return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300';
    if (elapsedMinutes < 25) return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
    if (elapsedMinutes < 60) return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
    return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
  };

  return (
    <div className="relative">
      <div className={`rounded-lg px-4 py-3 flex items-center justify-between ${getTimerColor()} transition-colors duration-500`}>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">⏱️ Code Timer:</span>
            <span className="text-2xl font-black tabular-nums">
              {minutes}:{seconds.toString().padStart(2, '0')}
            </span>
            <span className="text-xs font-semibold">elapsed</span>
          </div>
          {arrivalTime && (
            <span className="text-xs">
              Arrival: {arrivalTime}
            </span>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleStart}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold text-sm hover:bg-blue-700 transition-colors"
          >
            {isRunning ? 'Pause' : 'Start'}
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-bold text-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      {isRunning && milestones.some(m => m.achieved) && (
        <div className="absolute left-0 right-0 -bottom-12 mt-2 flex gap-2 px-4">
          {milestones.map(milestone => milestone.achieved && (
            <div key={milestone.name} className="flex-1 px-3 py-2 bg-red-100 dark:bg-red-900/30 border-2 border-red-500 rounded-lg text-center">
              <div className="text-xs font-bold text-red-700 dark:text-red-300">
                ⚠️ {milestone.name} target exceeded
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
