import React from 'react';
import { PostTPAOrders } from './PostTPAOrders';

interface TreatmentSectionProps {
  onComplete?: () => void;
  isLearningMode?: boolean;
}

export const TreatmentSection: React.FC<TreatmentSectionProps> = ({ onComplete, isLearningMode = false }) => {
  return (
    <div className="space-y-4">
      {isLearningMode && (
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500 mb-4">
          <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
            After thrombolytic administration, implement strict monitoring protocols. Monitor for signs of 
            symptomatic intracranial hemorrhage (sICH), maintain blood pressure control, and continue 
            neurological assessments. Do not give antiplatelets or anticoagulants for 24 hours.
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 leading-relaxed">
            <strong>Clinical Context:</strong> The first 24 hours post-tPA are critical. sICH typically presents within 
            6-12 hours with sudden neurological deterioration, headache, or elevated BP. Immediate CT and neurosurgical 
            consultation are required. The SITS-MOST registry showed 1.7% sICH rate with strict protocol adherence. 
            Monitoring every 15 minutes for the first 2 hours, then hourly, is standard.
          </p>
        </div>
      )}

      {/* Post-tPA Orders Component */}
      <div className="mt-6">
        <PostTPAOrders />
      </div>
    </div>
  );
};
