import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronUp, Play, Pause, RotateCcw, Clock } from 'lucide-react';
import { ProtocolStepsNav, Step } from './ProtocolStepsNav';
import { QuickToolsGrid } from './QuickToolsGrid';

interface StickyArticleHeaderProps {
  steps: Step[];
  activeStepNumber: number | null;
  onStepClick: (stepId: number) => void;
}

export const StickyArticleHeader: React.FC<StickyArticleHeaderProps> = ({
  steps,
  activeStepNumber,
  onStepClick,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [startTime, setStartTime] = useState<string>('');
  const headerRef = useRef<HTMLDivElement>(null);

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

  // Expose header height via data attribute for scroll calculations
  useEffect(() => {
    if (headerRef.current) {
      headerRef.current.setAttribute('data-header-height', headerRef.current.offsetHeight.toString());
    }
  }, [isExpanded]);

  return (
    <div 
      ref={headerRef}
      className="sticky top-0 z-30 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm"
      style={{ top: 0, marginTop: 0 }}
    >
      {/* Collapsed View - Always Visible */}
      <div className="px-6 py-3">
        <div className="flex items-center justify-between max-w-5xl mx-auto gap-4">
          {/* Timer - Compact */}
          <div className="flex items-center gap-3">
            <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <div className="text-xl font-black tabular-nums text-gray-900 dark:text-white">
              {minutes}:{seconds.toString().padStart(2, '0')}
            </div>
            <button
              onClick={handleStart}
              className={`px-3 py-1 text-xs font-bold rounded transition-colors ${
                isRunning
                  ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {isRunning ? (
                <>
                  <Pause className="w-3 h-3 inline mr-1" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-3 h-3 inline mr-1" />
                  Start
                </>
              )}
            </button>
            {elapsedSeconds > 0 && (
              <button
                onClick={handleReset}
                className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                title="Reset timer"
              >
                <RotateCcw className="w-3 h-3 text-gray-600 dark:text-gray-400" />
              </button>
            )}
          </div>

          {/* Current Step Indicator */}
          <div className="flex items-center gap-2 flex-1 justify-center">
            <div className="text-xs font-semibold text-gray-500 dark:text-gray-400">
              Step {activeStepNumber || 1} of 6
            </div>
            {steps.find(s => s.id === activeStepNumber) && (
              <div className="text-sm font-bold text-gray-900 dark:text-white">
                {steps.find(s => s.id === activeStepNumber)?.title}
              </div>
            )}
          </div>

          {/* Expand/Collapse Toggle */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {isExpanded ? 'Hide' : 'Show'} Tools
            </span>
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            )}
          </button>
        </div>
      </div>

      {/* Expanded View - Collapsible */}
      {isExpanded && (
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Protocol Steps */}
            <div>
              <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-3">Protocol Steps</h3>
              <ProtocolStepsNav 
                steps={steps.map(step => ({
                  id: step.id,
                  title: step.title,
                  status: step.status
                }))} 
                onStepClick={onStepClick} 
              />
            </div>

            {/* Quick Tools */}
            <div>
              <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-3">Quick Tools</h3>
              <QuickToolsGrid />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
