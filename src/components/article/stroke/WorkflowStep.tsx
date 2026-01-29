import React, { ReactNode } from 'react';
import { Check, Lock, ChevronDown, ChevronUp } from 'lucide-react';

interface WorkflowStepProps {
  number: number;
  title: string;
  subtitle: string;
  status: 'completed' | 'active' | 'locked';
  isExpanded: boolean;
  onToggle: () => void;
  children: ReactNode;
  completionSummary?: string;
}

export const WorkflowStep: React.FC<WorkflowStepProps> = ({
  number,
  title,
  subtitle,
  status,
  isExpanded,
  onToggle,
  children,
  completionSummary,
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'completed': return 'border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/10';
      case 'active': return 'border-blue-600 bg-blue-50 dark:bg-blue-900/10';
      case 'locked': return 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800';
    }
  };

  const getNumberBadge = () => {
    switch (status) {
      case 'completed':
        return (
          <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center flex-shrink-0">
            <Check className="w-5 h-5" />
          </div>
        );
      case 'active':
        return (
          <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
            {number}
          </div>
        );
      case 'locked':
        return (
          <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 flex items-center justify-center flex-shrink-0">
            <Lock className="w-5 h-5" />
          </div>
        );
    }
  };

  const getStatusBadge = () => {
    switch (status) {
      case 'completed':
        return (
          <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-bold rounded">
            DONE
          </span>
        );
      case 'active':
        return (
          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-bold rounded">
            IN PROGRESS
          </span>
        );
      case 'locked':
        return (
          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-xs font-bold rounded">
            LOCKED
          </span>
        );
    }
  };

  return (
    <div className={`rounded-lg border-2 transition-all ${getStatusColor()}`}>
      {/* Header - Always Visible */}
      <button
        onClick={onToggle}
        disabled={status === 'locked'}
        className={`w-full p-4 flex items-center gap-4 text-left ${
          status === 'locked' ? 'cursor-not-allowed' : 'cursor-pointer hover:bg-opacity-80'
        }`}
      >
        {getNumberBadge()}
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              {title}
            </h3>
            {getStatusBadge()}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {status === 'completed' && completionSummary ? completionSummary : subtitle}
          </p>
        </div>

        {status !== 'locked' && (
          <div className="flex-shrink-0">
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </div>
        )}
      </button>

      {/* Content - Expandable */}
      {isExpanded && status !== 'locked' && (
        <div className="px-4 pb-4 border-t border-gray-200 dark:border-gray-700 pt-4">
          {children}
        </div>
      )}

      {/* Locked Message */}
      {status === 'locked' && isExpanded && (
        <div className="px-4 pb-4 border-t border-gray-200 dark:border-gray-700 pt-4">
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center italic">
            Complete previous steps to unlock
          </p>
        </div>
      )}
    </div>
  );
};
