import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface Contraindication {
  id: string;
  label: string;
  type: 'absolute' | 'relative';
}

const CONTRAINDICATIONS: Contraindication[] = [
  { id: 'active_bleeding', label: 'Active internal bleeding', type: 'absolute' },
  { id: 'recent_surgery', label: 'Recent surgery (<14 days)', type: 'absolute' },
  { id: 'recent_stroke', label: 'Recent stroke (<3 months)', type: 'absolute' },
  { id: 'ich_history', label: 'Intracranial hemorrhage history', type: 'absolute' },
  { id: 'uncontrolled_bp', label: 'BP >185/110 (uncontrolled)', type: 'absolute' },
  { id: 'age_over_80', label: 'Age >80 years', type: 'relative' },
  { id: 'anticoagulant', label: 'On anticoagulants', type: 'relative' },
  { id: 'nihss_extreme', label: 'NIHSS <6 or >25', type: 'relative' },
];

export const EligibilityChecker: React.FC = () => {
  const [hour, setHour] = useState('12');
  const [minute, setMinute] = useState('00');
  const [period, setPeriod] = useState<'AM' | 'PM'>('AM');
  const [calculatedHours, setCalculatedHours] = useState<number | null>(null);
  const [contraindications, setContraindications] = useState<Record<string, boolean>>({});
  const [showChecklist, setShowChecklist] = useState(false);

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
    const lkwTime = new Date();
    
    let hour24 = parseInt(hour);
    if (period === 'PM' && hour24 !== 12) hour24 += 12;
    if (period === 'AM' && hour24 === 12) hour24 = 0;
    
    lkwTime.setHours(hour24, parseInt(minute), 0, 0);
    
    if (lkwTime > now) {
      lkwTime.setDate(lkwTime.getDate() - 1);
    }
    
    const diffMs = now.getTime() - lkwTime.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    
    setCalculatedHours(diffHours);
    setShowChecklist(true);
  };

  const toggleContraindication = (id: string) => {
    setContraindications(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const hasAbsoluteContraindications = CONTRAINDICATIONS
    .filter(c => c.type === 'absolute')
    .some(c => contraindications[c.id]);

  const hasRelativeContraindications = CONTRAINDICATIONS
    .filter(c => c.type === 'relative')
    .some(c => contraindications[c.id]);

  const getEligibilityStatus = () => {
    if (calculatedHours === null) return null;

    if (hasAbsoluteContraindications) {
      return {
        type: 'contraindicated',
        title: '❌ Absolute Contraindication',
        message: 'TNK/tPA NOT eligible. Consider alternative treatments.',
        color: 'red'
      };
    }

    if (calculatedHours > 24) {
      return {
        type: 'outside_window',
        title: '❌ Outside Treatment Window',
        message: '>24 hours from last known well. Standard thrombolysis not indicated.',
        color: 'red'
      };
    }

    if (calculatedHours <= 4.5) {
      if (hasRelativeContraindications) {
        return {
          type: 'relative_warning',
          title: '⚠️ Eligible with Cautions',
          message: 'Within 4.5h window but has relative contraindications. Discuss risks/benefits.',
          color: 'yellow'
        };
      }
      return {
        type: 'eligible',
        title: '✅ TNK/tPA Candidate',
        message: 'Within 4.5 hour window. Proceed with administration.',
        color: 'green'
      };
    }

    if (calculatedHours <= 24) {
      return {
        type: 'extended',
        title: '⚠️ Extended Window (4.5-24h)',
        message: 'Consider CT perfusion for thrombectomy eligibility (DAWN/DEFUSE-3).',
        color: 'yellow'
      };
    }

    return null;
  };

  const status = getEligibilityStatus();

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600">
            <span className="text-2xl">📅</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Eligibility Checker</h3>
            <p className="text-sm text-slate-500 dark:text-gray-400">Treatment windows assessment</p>
          </div>
        </div>
      </div>

      {/* Time Input */}
      <div className="space-y-3">
        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">
          Last Known Well (LKW)
        </label>
        
        <div className="flex gap-3 items-center">
          <input
            type="number"
            min="1"
            max="12"
            value={hour}
            onChange={(e) => setHour(e.target.value)}
            className="w-20 text-center text-2xl font-bold bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg py-2 focus:border-blue-600 focus:ring-0 text-slate-900 dark:text-white"
          />
          <span className="text-2xl font-bold">:</span>
          <input
            type="number"
            min="0"
            max="59"
            value={minute}
            onChange={(e) => setMinute(e.target.value.padStart(2, '0'))}
            className="w-20 text-center text-2xl font-bold bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg py-2 focus:border-blue-600 focus:ring-0 text-slate-900 dark:text-white"
          />
          
          <div className="flex gap-2 ml-auto">
            <button
              onClick={() => setPeriod('AM')}
              className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${
                period === 'AM'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              AM
            </button>
            <button
              onClick={() => setPeriod('PM')}
              className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${
                period === 'PM'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              PM
            </button>
          </div>
        </div>

        <button
          onClick={setToCurrentTime}
          className="w-full flex items-center justify-center gap-2 text-blue-600 font-medium py-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors text-sm"
        >
          🕐 Set to Current Time
        </button>

        <button
          onClick={calculateWindow}
          className="w-full py-3 bg-orange-500 text-white text-base font-bold rounded-lg shadow-lg hover:bg-orange-600 transition-colors"
        >
          CALCULATE WINDOW
        </button>
      </div>

      {/* Result Display */}
      {status && (
        <div className="mt-6 space-y-4">
          <div className={`p-4 rounded-lg border-2 ${
            status.color === 'green' ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700' :
            status.color === 'yellow' ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-700' :
            'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700'
          }`}>
            <div className="text-center mb-3">
              <div className={`text-3xl font-bold ${
                status.color === 'green' ? 'text-green-600' :
                status.color === 'yellow' ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                {calculatedHours?.toFixed(1)} hours
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                since last known well
              </div>
            </div>
            <div className="text-center">
              <div className="font-bold text-sm mb-1">{status.title}</div>
              <div className="text-sm">{status.message}</div>
            </div>
          </div>

          {/* Contraindications Checklist */}
          {showChecklist && (
            <div className="space-y-3">
              <button
                onClick={() => setShowChecklist(!showChecklist)}
                className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <span className="font-bold text-sm">Contraindications Checklist</span>
                {showChecklist ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>

              <div className="space-y-2">
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Absolute Contraindications
                </div>
                {CONTRAINDICATIONS.filter(c => c.type === 'absolute').map(contra => (
                  <label
                    key={contra.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <span className="text-sm">{contra.label}</span>
                    <input
                      type="checkbox"
                      checked={contraindications[contra.id] || false}
                      onChange={() => toggleContraindication(contra.id)}
                      className="rounded text-blue-600 focus:ring-blue-600 h-5 w-5"
                    />
                  </label>
                ))}

                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-4">
                  Relative Contraindications (TNK)
                </div>
                {CONTRAINDICATIONS.filter(c => c.type === 'relative').map(contra => (
                  <label
                    key={contra.id}
                    className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg cursor-pointer hover:bg-yellow-100 dark:hover:bg-yellow-900/30"
                  >
                    <span className="text-sm">{contra.label}</span>
                    <input
                      type="checkbox"
                      checked={contraindications[contra.id] || false}
                      onChange={() => toggleContraindication(contra.id)}
                      className="rounded text-yellow-600 focus:ring-yellow-600 h-5 w-5"
                    />
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* LKW Guidelines */}
      <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <div className="flex items-center gap-2 text-blue-600 mb-2">
          <span className="text-lg">ℹ️</span>
          <span className="font-bold text-sm">LKW Guidelines</span>
        </div>
        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
          If patient woke up with symptoms, LKW is the time they were last seen normal before sleep. 
          Work backwards: when did they go to bed?
        </p>
      </div>
    </div>
  );
};
