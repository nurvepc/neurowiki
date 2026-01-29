import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { SectionPearls } from './SectionPearls';
import { STROKE_CLINICAL_PEARLS } from '../../../data/strokeClinicalPearls';

interface LabsSectionProps {
  onComplete?: () => void;
  isLearningMode?: boolean;
}

export const LabsSection: React.FC<LabsSectionProps> = ({ onComplete, isLearningMode = false }) => {
  const [labs, setLabs] = useState<Record<string, boolean>>({
    glucose: false,
    pt_inr: false,
    ptt: false,
    cbc: false,
    bmp: false,
    troponin: false,
    lipid: false,
    hba1c: false,
  });

  const toggleLab = (id: string) => {
    setLabs(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6">
      {isLearningMode && (
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500 mb-4">
          <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
            Laboratory and cardiac evaluation should proceed concurrently with imaging. Only <strong>Blood Glucose</strong> is 
            mandatory before thrombolysis. Other labs can be drawn but should not delay treatment if within the time window.
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 leading-relaxed">
            <strong>Clinical Context:</strong> The "do not delay" principle is critical. Every minute counts in stroke care. 
            While comprehensive labs are ideal, waiting for results can push patients outside the treatment window. Point-of-care 
            glucose is sufficient to rule out hypoglycemia as a stroke mimic. INR/PTT can be checked but should not delay tPA 
            if the patient has no history of anticoagulation.
          </p>
        </div>
      )}

      {/* Critical Alert */}
      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 rounded-r-lg">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-yellow-900 dark:text-yellow-100 mb-1">CRITICAL ALERT</div>
            <div className="text-sm text-yellow-800 dark:text-yellow-200">
              Only Blood Glucose is mandatory before tPA administration. Do not delay treatment waiting for other labs 
              if patient is within the 4.5-hour window.
            </div>
          </div>
        </div>
      </div>

      {/* STAT - IMMEDIATE */}
      <div>
        <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wide mb-3">
          STAT - IMMEDIATE
        </h3>
        <div className="space-y-2">
          {[
            { id: 'glucose', label: 'Point of Care Glucose' },
            { id: 'pt_inr', label: 'PT / INR' },
            { id: 'ptt', label: 'PTT' },
            { id: 'cbc', label: 'CBC with Platelets' },
          ].map((lab) => (
            <label key={lab.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={labs[lab.id]}
                onChange={() => toggleLab(lab.id)}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-900 dark:text-white">{lab.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* SECONDARY WORKUP */}
      <div>
        <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wide mb-3">
          SECONDARY WORKUP
        </h3>
        <div className="space-y-2">
          {[
            { id: 'bmp', label: 'Basic Metabolic Panel' },
            { id: 'troponin', label: 'Troponin I' },
            { id: 'lipid', label: 'Lipid Panel' },
            { id: 'hba1c', label: 'Hemoglobin A1c' },
          ].map((lab) => (
            <label key={lab.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={labs[lab.id]}
                onChange={() => toggleLab(lab.id)}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-900 dark:text-white">{lab.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Clinical Pearls for Laboratory Workup */}
      {STROKE_CLINICAL_PEARLS['step-3'] && (
        <SectionPearls
          sectionId="step-3"
          quickPearls={STROKE_CLINICAL_PEARLS['step-3'].quick}
          deepPearls={STROKE_CLINICAL_PEARLS['step-3'].deep}
          isLearningMode={isLearningMode || false}
        />
      )}
    </div>
  );
};
