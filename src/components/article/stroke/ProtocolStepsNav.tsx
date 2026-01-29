import React from 'react';
import { Check, ChevronRight } from 'lucide-react';

export interface Step {
  id: number;
  title: string;
  status: 'completed' | 'active' | 'locked';
}

interface ProtocolStepsNavProps {
  steps: Step[];
  onStepClick?: (stepId: number) => void;
}

export const ProtocolStepsNav: React.FC<ProtocolStepsNavProps> = ({ steps, onStepClick }) => {
  const getStepIcon = (status: Step['status'], stepId: number) => {
    switch (status) {
      case 'completed':
        return (
          <div className="w-6 h-6 rounded-full bg-green-600 text-white flex items-center justify-center flex-shrink-0">
            <Check className="w-4 h-4" />
          </div>
        );
      case 'active':
        return (
          <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 font-bold text-xs">
            {stepId}
          </div>
        );
      case 'locked':
        return (
          <div className="w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 flex items-center justify-center flex-shrink-0 font-bold text-xs">
            {stepId}
          </div>
        );
    }
  };

  const getStepTextColor = (status: Step['status']) => {
    switch (status) {
      case 'completed':
        return 'text-gray-600 dark:text-gray-400';
      case 'active':
        return 'text-blue-600 dark:text-blue-400 font-semibold';
      case 'locked':
        return 'text-gray-400 dark:text-gray-600';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4 space-y-2">
      {/* Header */}
      <h3 className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-3">
        Protocol Steps
      </h3>

      {/* Steps List */}
      <div className="space-y-1">
        {steps.map((step) => (
          <button
            key={step.id}
            onClick={() => onStepClick?.(step.id)}
            disabled={step.status === 'locked'}
            className={`w-full flex items-center gap-3 px-2 py-2 rounded-lg transition-colors text-left ${
              step.status === 'locked'
                ? 'cursor-not-allowed opacity-60'
                : step.status === 'active'
                ? 'bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 cursor-pointer'
                : 'hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer'
            }`}
          >
            {getStepIcon(step.status, step.id)}
            <span className={`text-sm flex-1 ${getStepTextColor(step.status)}`}>
              {step.id}. {step.title}
            </span>
            {step.status === 'active' && (
              <ChevronRight className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
