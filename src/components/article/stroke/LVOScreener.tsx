import React, { useState } from 'react';

const CORTICAL_SIGNS = [
  { id: 'aphasia', label: 'Aphasia (language impairment)', description: 'Difficulty speaking or understanding language' },
  { id: 'neglect', label: 'Neglect (inattention)', description: 'Ignoring one side of space or body' },
  { id: 'gaze', label: 'Gaze deviation', description: 'Eyes looking persistently to one side' },
  { id: 'visual', label: 'Visual field defects', description: 'Loss of half of visual field (hemianopia)' },
  { id: 'sensory', label: 'Cortical sensory loss', description: 'Loss of sensation on one side' },
  { id: 'apraxia', label: 'Apraxia', description: 'Cannot perform learned movements' },
];

export const LVOScreener: React.FC = () => {
  const [showExplanation, setShowExplanation] = useState(false);
  const [decision, setDecision] = useState<'yes' | 'no' | null>(null);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-orange-50 dark:bg-orange-900/20 text-orange-600">
          <span className="text-2xl">👁️</span>
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">LVO Screen</h3>
          <p className="text-sm text-slate-500 dark:text-gray-400">Large Vessel Occlusion</p>
        </div>
      </div>

      {/* Explanation Button */}
      <button
        onClick={() => setShowExplanation(!showExplanation)}
        className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors mb-4"
      >
        <span className="font-medium text-sm">ℹ️ What are Cortical Signs?</span>
        <span className="text-xs text-gray-500">{showExplanation ? 'Hide' : 'Show'}</span>
      </button>

      {/* Explanation Modal */}
      {showExplanation && (
        <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg space-y-2">
          <div className="font-bold text-sm text-blue-900 dark:text-blue-100 mb-3">
            Cortical signs suggest Large Vessel Occlusion (LVO):
          </div>
          {CORTICAL_SIGNS.map(sign => (
            <div key={sign.id} className="flex items-start gap-2 text-sm">
              <span className="text-blue-600 mt-1">•</span>
              <div>
                <span className="font-medium">{sign.label}</span>
                <span className="text-gray-600 dark:text-gray-400"> - {sign.description}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Decision Buttons */}
      <div className="space-y-3 mb-6">
        <div className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
          Are cortical signs present?
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setDecision('yes')}
            className={`py-4 rounded-lg font-bold text-base transition-all ${
              decision === 'yes'
                ? 'bg-orange-600 text-white shadow-lg'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            YES - Signs Present
          </button>
          <button
            onClick={() => setDecision('no')}
            className={`py-4 rounded-lg font-bold text-base transition-all ${
              decision === 'no'
                ? 'bg-gray-600 text-white shadow-lg'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            NO - No Signs
          </button>
        </div>
      </div>

      {/* Results */}
      {decision === 'yes' && (
        <div className="p-4 bg-orange-50 dark:bg-orange-900/20 border-2 border-orange-300 dark:border-orange-700 rounded-lg">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div className="flex-1">
              <div className="font-bold text-orange-900 dark:text-orange-100 mb-2">
                High Clinical Suspicion for LVO
              </div>
              <div className="text-sm text-orange-800 dark:text-orange-200 space-y-1">
                <div>• Order CTA Head and Neck immediately</div>
                <div>• Consider CT Perfusion if extended window</div>
                <div>• Alert Interventional Radiology NOW</div>
                <div>• Time is brain - expedite imaging</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {decision === 'no' && (
        <div className="p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            No cortical signs identified. LVO less likely, but still obtain CTA if NIHSS ≥6 or clinical concern persists.
          </div>
        </div>
      )}
    </div>
  );
};
