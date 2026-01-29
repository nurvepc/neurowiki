// SIMPLIFIED VERSION - Use this if the full version causes errors
import React from 'react';
import type { ClinicalPearl } from '../../../data/strokeClinicalPearls';

interface SectionPearlsProps {
  sectionId: string;
  quickPearls: ClinicalPearl[];
  deepPearls: ClinicalPearl[];
  isLearningMode: boolean;
}

export const SectionPearls: React.FC<SectionPearlsProps> = ({
  isLearningMode,
  quickPearls,
}) => {
  // Early return if learning mode is off
  if (!isLearningMode) {
    return null;
  }

  // Safety check
  if (!quickPearls || quickPearls.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
      <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Clinical Pearls</h3>
      <div className="space-y-2">
        {quickPearls.map((pearl) => (
          <div key={pearl.id} className="p-3 bg-white dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-800">
            <h4 className="text-sm font-bold text-gray-900 dark:text-white">{pearl.title}</h4>
            <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{pearl.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
