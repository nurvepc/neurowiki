import React from 'react';
import { LVOScreenerV2 } from './LVOScreenerV2';

interface LVOSectionProps {
  onComplete?: () => void;
  isLearningMode?: boolean;
  onCorticalSignsYes?: () => void;
}

export const LVOSection: React.FC<LVOSectionProps> = ({ onComplete, isLearningMode = false, onCorticalSignsYes }) => {
  return (
    <div className="space-y-4">
      {isLearningMode && (
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500 mb-4">
          <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
            Screen for large vessel occlusion (LVO) using clinical signs. Cortical signs such as aphasia, 
            hemispatial neglect, gaze deviation, and hemianopia suggest proximal MCA, ICA, or basilar artery 
            occlusion. Patients with LVO benefit from mechanical thrombectomy, which can be performed up to 
            24 hours from last known well with appropriate imaging.
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 leading-relaxed">
            <strong>Clinical Context:</strong> LVO detection is critical because these patients have poor outcomes 
            with IV thrombolysis alone but excellent outcomes with mechanical thrombectomy. The RACE scale and 
            FAST-ED scores can help quantify LVO probability, but clinical judgment based on cortical signs is 
            often sufficient for activation of thrombectomy teams.
          </p>
        </div>
      )}

      {/* LVO Screener Component */}
      <div className="mt-6">
        <LVOScreenerV2 onCorticalSignsYes={onCorticalSignsYes} />
      </div>
    </div>
  );
};
