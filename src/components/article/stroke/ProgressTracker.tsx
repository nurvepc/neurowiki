import React from 'react';

interface ProgressTrackerProps {
  totalSteps: number;
  completedSteps: number;
  currentStep: number;
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  totalSteps,
  completedSteps,
  currentStep,
}) => {
  const percentage = (completedSteps / totalSteps) * 100;

  return (
    <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Progress: Step {currentStep} of {totalSteps}
        </span>
        <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
          {completedSteps}/{totalSteps} completed
        </span>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-green-500 to-blue-600 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
