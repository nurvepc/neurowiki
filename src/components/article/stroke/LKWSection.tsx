import React from 'react';
import { EligibilityCheckerV2 } from './EligibilityCheckerV2';

interface LKWSectionProps {
  onComplete?: () => void;
  isLearningMode?: boolean;
  onOutsideWindow?: (hoursElapsed: number) => void;
}

export const LKWSection: React.FC<LKWSectionProps> = ({ onComplete, isLearningMode = false, onOutsideWindow }) => {
  return (
    <div className="space-y-4">
      {isLearningMode && (
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500 mb-4">
          <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
            Establish the precise time the patient was last known to be at their baseline neurological function. 
            This determines eligibility for thrombolytic therapy and mechanical thrombectomy. The treatment window 
            is critical: <strong>within 4.5 hours</strong> for IV thrombolysis and <strong>up to 24 hours</strong> 
            for thrombectomy with appropriate imaging.
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 leading-relaxed">
            <strong>Clinical Context:</strong> The "last known well" time is the most critical piece of information 
            in acute stroke management. It determines whether a patient is eligible for time-sensitive treatments. 
            Always verify with family, witnesses, or medical records. If the exact time is unknown, use the most 
            conservative estimate (earliest possible time).
          </p>
        </div>
      )}

      {/* Eligibility Checker Component */}
      <div className="mt-6">
        <EligibilityCheckerV2 onOutsideWindow={onOutsideWindow} />
      </div>
    </div>
  );
};
