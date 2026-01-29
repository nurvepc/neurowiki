import React, { useState } from 'react';
import { Calendar, Clock, Info, ChevronRight, AlertTriangle } from 'lucide-react';
import { ThrombolysisEligibilityModal, ThrombolysisEligibilityData } from './ThrombolysisEligibilityModal';
import { CompactVitals } from './CompactVitals';

interface EligibilityCheckerV2Props {
  onLkwCalculated?: (lkwTime: Date, hoursElapsed: number) => void;
  onEligibilityComplete?: (data: ThrombolysisEligibilityData) => void;
  onOutsideWindow?: (hoursElapsed: number) => void;
}

export const EligibilityCheckerV2: React.FC<EligibilityCheckerV2Props> = ({ onLkwCalculated, onEligibilityComplete, onOutsideWindow }) => {
  const [hour, setHour] = useState('12');
  const [minute, setMinute] = useState('00');
  const [period, setPeriod] = useState<'AM' | 'PM'>('PM');
  const [calculated, setCalculated] = useState(false);
  const [hoursElapsed, setHoursElapsed] = useState<number | null>(null);
  const [lkwTime, setLkwTime] = useState<Date | null>(null);
  const [showEligibilityModal, setShowEligibilityModal] = useState(false);
  const [savedEligibilityData, setSavedEligibilityData] = useState<ThrombolysisEligibilityData | null>(null);

  const setToCurrentTime = () => {
    const now = new Date();
    const hrs = now.getHours();
    const mins = now.getMinutes();
    setHour(((hrs % 12) || 12).toString());
    setMinute(mins.toString().padStart(2, '0'));
    setPeriod(hrs >= 12 ? 'PM' : 'AM');
  };

  const calculateWindow = () => {
    const now = new Date();
    const calculatedLkwTime = new Date();
    
    let hour24 = parseInt(hour);
    if (period === 'PM' && hour24 !== 12) hour24 += 12;
    if (period === 'AM' && hour24 === 12) hour24 = 0;
    
    calculatedLkwTime.setHours(hour24, parseInt(minute), 0, 0);
    if (calculatedLkwTime > now) calculatedLkwTime.setDate(calculatedLkwTime.getDate() - 1);
    
    const diffHours = (now.getTime() - calculatedLkwTime.getTime()) / (1000 * 60 * 60);
    setHoursElapsed(diffHours);
    setLkwTime(calculatedLkwTime);
    setCalculated(true);
    
    // Open eligibility modal if within 4.5 hour window
    if (diffHours < 4.5) {
      setShowEligibilityModal(true);
    } else if (diffHours > 4.5 && onOutsideWindow) {
      // Notify parent that we're outside the 4.5-hour window
      onOutsideWindow(diffHours);
    }
  };

  const handleEligibilityComplete = (data: ThrombolysisEligibilityData) => {
    setSavedEligibilityData(data);
    setShowEligibilityModal(false);
    // Trigger callback to notify parent
    if (onEligibilityComplete) {
      onEligibilityComplete(data);
    }
  };

  const getStatus = () => {
    if (!calculated || hoursElapsed === null) return null;

    if (hoursElapsed > 24) {
      return { 
        type: 'outside', 
        color: 'red', 
        icon: '❌',
        title: 'Outside Treatment Window',
        message: '>24h from LKW. Thrombolysis not indicated. Focus on supportive care and secondary prevention.' 
      };
    }

    if (hoursElapsed <= 4.5) {
      return { 
        type: 'eligible', 
        color: 'green', 
        icon: '✓',
        title: 'tPA Candidate - Proceed',
        message: 'Within 4.5h window. Complete eligibility assessment to proceed with thrombolysis.' 
      };
    }

    return { 
      type: 'extended', 
      color: 'yellow', 
      icon: 'ⓘ',
      title: 'Extended Window (4.5-24h)',
      message: 'Consider CT perfusion. If mismatch present, patient may be thrombectomy candidate per DAWN/DEFUSE-3 criteria.' 
    };
  };

  const status = getStatus();

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">Eligibility Assessment</h3>
              <p className="text-xs text-gray-500">Treatment window & contraindications</p>
            </div>
          </div>
          
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Time Input and Vitals - Side by Side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Time Input - More Discrete */}
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
              Last Known Well Time
            </label>
            
            <div className="flex items-center gap-2 mb-2">
              <input
                type="number"
                min="1"
                max="12"
                value={hour}
                onChange={(e) => setHour(e.target.value)}
                className="w-12 text-center text-sm font-semibold bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg py-1.5 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-slate-900 dark:text-white"
              />
              <span className="text-sm font-bold text-gray-400">:</span>
              <input
                type="number"
                min="0"
                max="59"
                value={minute}
                onChange={(e) => setMinute(e.target.value.padStart(2, '0'))}
                className="w-12 text-center text-sm font-semibold bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg py-1.5 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-slate-900 dark:text-white"
              />
              
              <div className="flex gap-1">
                <button
                  onClick={() => setPeriod('AM')}
                  className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                    period === 'AM' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  AM
                </button>
                <button
                  onClick={() => setPeriod('PM')}
                  className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                    period === 'PM' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  PM
                </button>
              </div>
            </div>

            <button
              onClick={setToCurrentTime}
              className="flex items-center gap-1 text-xs text-blue-600 hover:underline"
            >
              <Clock className="w-3 h-3" />
              Set to current time
            </button>
          </div>

          {/* Compact Vitals */}
          <div>
            <CompactVitals />
          </div>
        </div>

        <button
          onClick={calculateWindow}
          className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold text-sm hover:bg-blue-700 transition-colors shadow-sm"
        >
          Calculate Treatment Window
        </button>

        {/* Status Display */}
        {status && (
          <div className={`p-4 rounded-lg border-2 ${
            status.color === 'green' ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700' :
            status.color === 'yellow' ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-700' :
            'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700'
          }`}>
            <div className="text-center mb-3">
              <div className={`text-4xl font-black mb-1 ${
                status.color === 'green' ? 'text-green-600' :
                status.color === 'yellow' ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                {hoursElapsed?.toFixed(1)}h
              </div>
              <div className="text-xs font-medium text-gray-600 dark:text-gray-400">
                since last known well
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-sm font-bold mb-1">
                {status.icon} {status.title}
              </div>
              <div className="text-xs leading-relaxed text-gray-700 dark:text-gray-300">
                {status.message}
              </div>
            </div>
          </div>
        )}

        {/* Guidelines */}
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
              <span className="font-semibold">LKW Definition: </span>
              If patient woke with symptoms, LKW is when last seen normal before sleep. 
              Work backwards: when did they go to bed? Be precise - "yesterday" is not sufficient.
            </div>
          </div>
        </div>

        {/* Button to open eligibility modal if within window */}
        {calculated && hoursElapsed !== null && hoursElapsed < 4.5 && (
          <button
            onClick={() => setShowEligibilityModal(true)}
            className="w-full mt-4 py-3 bg-blue-600 text-white rounded-lg font-bold text-sm hover:bg-blue-700 transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            {savedEligibilityData ? 'Review Eligibility Assessment' : 'Complete Eligibility Assessment'}
          </button>
        )}

        {/* Prompt for LVO Screen if outside 4.5 hour window */}
        {calculated && hoursElapsed !== null && hoursElapsed > 4.5 && hoursElapsed <= 24 && (
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-2 border-blue-300 dark:border-blue-700">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="text-sm font-bold text-blue-900 dark:text-blue-200 mb-1">
                  Outside IV tPA Window - Proceed to LVO Screening
                </h4>
                <p className="text-xs leading-relaxed text-blue-800 dark:text-blue-300 mb-3">
                  Patient is outside the 4.5-hour window for IV tPA. However, mechanical thrombectomy may still be an option if LVO is present (up to 24 hours with appropriate imaging). Proceed to LVO screening.
                </p>
                {onOutsideWindow && (
                  <button
                    onClick={() => onOutsideWindow(hoursElapsed)}
                    className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm transition-colors shadow-sm flex items-center justify-center gap-2"
                  >
                    <span>Continue to LVO Screening</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Show saved eligibility summary */}
        {savedEligibilityData && (
          <div className={`mt-4 p-4 rounded-lg border-2 ${
            savedEligibilityData.eligibilityStatus === 'eligible'
              ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700'
              : savedEligibilityData.eligibilityStatus === 'relative-contraindication'
              ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-700'
              : 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700'
          }`}>
            <div className="flex items-start gap-3">
              <div className={`text-2xl ${
                savedEligibilityData.eligibilityStatus === 'eligible' ? 'text-green-600' :
                savedEligibilityData.eligibilityStatus === 'relative-contraindication' ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                {savedEligibilityData.eligibilityStatus === 'eligible' ? '✓' :
                 savedEligibilityData.eligibilityStatus === 'relative-contraindication' ? '⚠' :
                 '✗'}
              </div>
              <div className="flex-1">
                <h4 className={`text-sm font-bold mb-1 ${
                  savedEligibilityData.eligibilityStatus === 'eligible' ? 'text-green-800 dark:text-green-200' :
                  savedEligibilityData.eligibilityStatus === 'relative-contraindication' ? 'text-yellow-800 dark:text-yellow-200' :
                  'text-red-800 dark:text-red-200'
                }`}>
                  Eligibility Assessment Complete
                </h4>
                <p className={`text-xs leading-relaxed ${
                  savedEligibilityData.eligibilityStatus === 'eligible' ? 'text-green-700 dark:text-green-300' :
                  savedEligibilityData.eligibilityStatus === 'relative-contraindication' ? 'text-yellow-700 dark:text-yellow-300' :
                  'text-red-700 dark:text-red-300'
                }`}>
                  Status: {savedEligibilityData.eligibilityStatus === 'eligible' ? 'ELIGIBLE FOR IV tPA' :
                           savedEligibilityData.eligibilityStatus === 'relative-contraindication' ? 'RELATIVE CONTRAINDICATION' :
                           savedEligibilityData.eligibilityStatus === 'absolute-contraindication' ? 'IV tPA CONTRAINDICATED' :
                           'DOES NOT MEET CRITERIA'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Eligibility Modal */}
      <ThrombolysisEligibilityModal
        isOpen={showEligibilityModal}
        onClose={() => setShowEligibilityModal(false)}
        onComplete={handleEligibilityComplete}
        initialData={savedEligibilityData || (lkwTime && hoursElapsed !== null ? {
          lkwTime,
          timeDifferenceHours: hoursElapsed,
          inclusionCriteriaMet: false,
          absoluteContraindications: [],
          relativeContraindications: [],
          eligibilityStatus: 'not-eligible',
          notes: '',
        } : null)}
      />
    </div>
  );
};
