import React, { useState } from 'react';
import { AlertOctagon, ChevronDown, ChevronUp, Printer } from 'lucide-react';

interface HemorrhageProtocolProps {
  isLearningMode?: boolean;
}

export const HemorrhageProtocol: React.FC<HemorrhageProtocolProps> = ({ isLearningMode = false }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-red-50 dark:bg-red-900/20 rounded-xl shadow-sm border-2 border-red-300 dark:border-red-700 p-6">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <AlertOctagon className="w-6 h-6 text-red-600" />
          <div className="text-left">
            <h3 className="text-lg font-bold text-red-900 dark:text-red-100">
              TNK/tPA Hemorrhage Management
            </h3>
            <p className="text-sm text-red-700 dark:text-red-300">
              Emergency protocol for bleeding complications
            </p>
          </div>
        </div>
        {isExpanded ? <ChevronUp className="w-6 h-6 text-red-600" /> : <ChevronDown className="w-6 h-6 text-red-600" />}
      </button>

      {isExpanded && (
        <div className="mt-6 space-y-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-4 space-y-3">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <div className="font-bold text-sm text-slate-900 dark:text-white">Administer Cryoprecipitate</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Give 10 units IV immediately
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <div className="font-bold text-sm text-slate-900 dark:text-white">Check Fibrinogen Level</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  STAT fibrinogen, continue trending until {'>'}150 mg/dL
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  💡 Every 10 units cryo raises fibrinogen ~50 mg/dL
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <div className="font-bold text-sm text-slate-900 dark:text-white">Repeat CT Head</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  CT head in 6 hours to assess progression
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <div className="font-bold text-sm text-slate-900 dark:text-white">Strict BP Control</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Decrease SBP goal to 100-140 mmHg
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-bold">
                5
              </div>
              <div>
                <div className="font-bold text-sm text-slate-900 dark:text-white">Transfuse Platelets</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  If platelets {'<'}100,000/μL
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-bold">
                6
              </div>
              <div>
                <div className="font-bold text-sm text-slate-900 dark:text-white">Consider PCC + Vitamin K</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Especially if patient chronically on warfarin
                </div>
              </div>
            </div>
          </div>

          <button className="w-full py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2">
            <Printer className="w-4 h-4" />
            Print Emergency Protocol
          </button>
        </div>
      )}
    </div>
  );
};
