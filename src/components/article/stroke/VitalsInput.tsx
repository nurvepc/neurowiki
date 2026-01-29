import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export const VitalsInput: React.FC = () => {
  const [glucose, setGlucose] = useState('');
  const [systolic, setSystolic] = useState('');
  const [diastolic, setDiastolic] = useState('');
  const [showBPProtocol, setShowBPProtocol] = useState(false);
  const [showBPEducation, setShowBPEducation] = useState(false);

  const glucoseValue = parseInt(glucose) || 0;
  const systolicValue = parseInt(systolic) || 0;
  const diastolicValue = parseInt(diastolic) || 0;

  const isGlucoseLow = glucoseValue > 0 && glucoseValue < 70;
  const isGlucoseHigh = glucoseValue > 180;
  const isBPHigh = systolicValue > 185 || diastolicValue > 110;
  const isBPVeryHigh = systolicValue > 220 || diastolicValue > 120;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-600">
          <span className="text-2xl">🩺</span>
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Vital Signs</h3>
          <p className="text-sm text-slate-500 dark:text-gray-400">Critical parameters monitoring</p>
        </div>
      </div>

      {/* Glucose Input */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
            Glucose (mg/dL)
          </label>
          <input
            type="number"
            value={glucose}
            onChange={(e) => setGlucose(e.target.value)}
            placeholder="Enter glucose"
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-blue-600 focus:ring-0 text-lg font-semibold text-slate-900 dark:text-white"
          />
          {isGlucoseLow && (
            <div className="mt-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="text-sm font-bold text-red-700 dark:text-red-300">
                ⚠️ Hypoglycemia - Treat immediately!
              </div>
              <div className="text-xs text-red-600 dark:text-red-400 mt-1">
                Give D50 or oral glucose. Recheck in 15 minutes.
              </div>
            </div>
          )}
          {isGlucoseHigh && (
            <div className="mt-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <div className="text-sm text-yellow-700 dark:text-yellow-300">
                Goal glucose {'<'}180 mg/dL for stroke patients
              </div>
            </div>
          )}
        </div>

        {/* Blood Pressure Input */}
        <div>
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
            Blood Pressure (mmHg)
          </label>
          <div className="flex gap-3 items-center">
            <input
              type="number"
              value={systolic}
              onChange={(e) => setSystolic(e.target.value)}
              placeholder="SBP"
              className="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-blue-600 focus:ring-0 text-lg font-semibold text-slate-900 dark:text-white"
            />
            <span className="text-2xl font-bold text-gray-400">/</span>
            <input
              type="number"
              value={diastolic}
              onChange={(e) => setDiastolic(e.target.value)}
              placeholder="DBP"
              className="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-blue-600 focus:ring-0 text-lg font-semibold text-slate-900 dark:text-white"
            />
          </div>

          {isBPHigh && (
            <div className="mt-3 space-y-3">
              <div className={`p-3 border-2 rounded-lg ${
                isBPVeryHigh 
                  ? 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700'
                  : 'bg-orange-50 dark:bg-orange-900/20 border-orange-300 dark:border-orange-700'
              }`}>
                <div className="font-bold text-sm mb-1">
                  {isBPVeryHigh ? '🚨 Critical BP - Immediate Control Required' : '⚠️ BP Elevated - Control Before tPA'}
                </div>
                <div className="text-sm">
                  Goal: {'<'}185/110 mmHg before thrombolysis
                </div>
              </div>

              <button
                onClick={() => setShowBPProtocol(!showBPProtocol)}
                className="w-full flex items-center justify-between p-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors"
              >
                <span>BP Management Protocol</span>
                {showBPProtocol ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>

              {showBPProtocol && (
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-4">
                  <div>
                    <div className="font-bold text-sm mb-2">Option 1: Labetalol</div>
                    <div className="text-sm space-y-1 text-gray-700 dark:text-gray-300">
                      <div>• 10 mg IV over 1-2 minutes</div>
                      <div>• May repeat or double every 10 min</div>
                      <div>• Maximum dose: 300 mg</div>
                      <div>• OR start drip at 2-8 mg/min</div>
                    </div>
                  </div>

                  <div>
                    <div className="font-bold text-sm mb-2">Option 2: Nicardipine</div>
                    <div className="text-sm space-y-1 text-gray-700 dark:text-gray-300">
                      <div>• Start: 5 mg/h IV infusion</div>
                      <div>• Titrate by 2.5 mg/h every 5 min</div>
                      <div>• Maximum: 15 mg/h</div>
                    </div>
                  </div>

                  <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <div className="text-xs font-bold text-yellow-700 dark:text-yellow-300 mb-1">
                      ⚠️ If uncontrolled by above:
                    </div>
                    <div className="text-xs text-yellow-600 dark:text-yellow-400">
                      Consider sodium nitroprusside drip
                    </div>
                  </div>

                  <button
                    onClick={() => setShowBPEducation(!showBPEducation)}
                    className="w-full text-left p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-sm hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                  >
                    <span className="font-medium">📚 Why BP Control Matters</span>
                  </button>

                  {showBPEducation && (
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm text-gray-700 dark:text-gray-300">
                      Elevated BP increases risk of hemorrhagic transformation after thrombolysis. 
                      Goal BP {'<'}185/110 before tPA, then {'<'}180/105 for 24 hours post-tPA.
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
