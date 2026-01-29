import React, { useState, useEffect } from 'react';
import { Clock, Play, Pause, RotateCcw } from 'lucide-react';

export const SidebarTimer: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [startTime, setStartTime] = useState<string>('');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => setElapsedSeconds(prev => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const handleStart = () => {
    if (!isRunning && elapsedSeconds === 0) {
      const now = new Date();
      setStartTime(now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      }));
    }
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    if (confirm('Reset timer? This will clear elapsed time.')) {
      setIsRunning(false);
      setElapsedSeconds(0);
      setStartTime('');
    }
  };

  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = elapsedSeconds % 60;
  const hours = Math.floor(minutes / 60);
  const displayMinutes = minutes % 60;

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
          Stroke Timer
        </h3>
        {isRunning && (
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        )}
      </div>

      {/* Timer Display */}
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-black tabular-nums text-gray-900 dark:text-white">
          {hours > 0 ? `${hours}:${displayMinutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}` : `${displayMinutes}:${seconds.toString().padStart(2, '0')}`}
        </span>
      </div>

      {/* Start Time */}
      {startTime && (
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Started {startTime}
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleStart}
          className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
            isRunning
              ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isRunning ? (
            <>
              <Pause className="w-3 h-3" />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Play className="w-3 h-3" />
              <span>Start</span>
            </>
          )}
        </button>
        
        {elapsedSeconds > 0 && (
          <button
            onClick={handleReset}
            className="p-1.5 rounded bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            title="Reset timer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" />
          </button>
        )}
      </div>
    </div>
  );
};
