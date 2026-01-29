import React, { useState } from 'react';
import { AlertCircle, Droplet } from 'lucide-react';

interface LabsAndVitalsSectionProps {
  isLearningMode?: boolean;
}

export const LabsAndVitalsSection: React.FC<LabsAndVitalsSectionProps> = ({ isLearningMode = false }) => {
  const [labs, setLabs] = useState<Record<string, boolean>>({
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
            Laboratory assessment should proceed concurrently with imaging. Only <strong>Blood Glucose</strong> is 
            mandatory before thrombolysis. Other labs can be drawn but should not delay treatment if within the time window.
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 leading-relaxed">
            <strong>Clinical Context:</strong> The "do not delay" principle is critical. Every minute counts in stroke care. 
            While comprehensive labs are ideal, waiting for results can push patients outside the treatment window. Point-of-care 
            glucose is sufficient to rule out hypoglycemia as a stroke mimic.
          </p>
        </div>
      )}

      {/* Critical Alert */}
      <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border-l-4 border-red-500">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-red-900 dark:text-red-100 mb-1">CRITICAL ALERT</h4>
            <p className="text-sm text-red-800 dark:text-red-200">
              Only <strong>Blood Glucose</strong> is mandatory before tPA administration. 
              Do not delay treatment waiting for other labs if patient is within the 4.5-hour window.
            </p>
          </div>
        </div>
      </div>

      {/* Laboratory Workup */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Droplet className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Laboratory Workup</h3>
        </div>

        {/* Secondary Workup */}
        <div>
          <div className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">Secondary Workup</div>
          <div className="grid grid-cols-2 gap-2">
            <label className="flex items-center gap-2 p-2 bg-white dark:bg-gray-900 rounded border border-gray-200 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <input
                type="checkbox"
                checked={labs.pt_inr || labs.ptt}
                onChange={() => {
                  const newValue = !(labs.pt_inr || labs.ptt);
                  setLabs(prev => ({ 
                    ...prev, 
                    pt_inr: newValue,
                    ptt: newValue 
                  }));
                }}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm">PT / INR / PTT</span>
            </label>
            <label className="flex items-center gap-2 p-2 bg-white dark:bg-gray-900 rounded border border-gray-200 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <input
                type="checkbox"
                checked={labs.cbc}
                onChange={() => toggleLab('cbc')}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm">CBC with Platelets</span>
            </label>
            <label className="flex items-center gap-2 p-2 bg-white dark:bg-gray-900 rounded border border-gray-200 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <input
                type="checkbox"
                checked={labs.bmp}
                onChange={() => toggleLab('bmp')}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm">Basic Metabolic Panel</span>
            </label>
            <label className="flex items-center gap-2 p-2 bg-white dark:bg-gray-900 rounded border border-gray-200 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <input
                type="checkbox"
                checked={labs.troponin}
                onChange={() => toggleLab('troponin')}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm">Troponin I</span>
            </label>
            <label className="flex items-center gap-2 p-2 bg-white dark:bg-gray-900 rounded border border-gray-200 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <input
                type="checkbox"
                checked={labs.lipid}
                onChange={() => toggleLab('lipid')}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm">Lipid Panel</span>
            </label>
            <label className="flex items-center gap-2 p-2 bg-white dark:bg-gray-900 rounded border border-gray-200 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <input
                type="checkbox"
                checked={labs.hba1c}
                onChange={() => toggleLab('hba1c')}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm">Hemoglobin A1c</span>
            </label>
          </div>
        </div>
      </div>

    </div>
  );
};
