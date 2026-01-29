import React, { useState, useMemo, useEffect } from 'react';
import { X, CheckCircle2, XCircle, AlertTriangle, Info, ChevronRight, Clock, Calendar, Copy, Check } from 'lucide-react';

export interface ThrombolysisEligibilityData {
  lkwTime: Date | null;
  timeDifferenceHours: number | null;
  inclusionCriteriaMet: boolean;
  absoluteContraindications: string[];
  relativeContraindications: string[];
  eligibilityStatus: 'eligible' | 'relative-contraindication' | 'absolute-contraindication' | 'not-eligible';
  notes: string;
}

interface ThrombolysisEligibilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: ThrombolysisEligibilityData) => void;
  initialData?: ThrombolysisEligibilityData | null;
}

interface Contraindication {
  id: string;
  label: string;
  type: 'absolute' | 'relative';
  evidence?: string;
  reference?: string;
}

const ABSOLUTE_CONTRAINDICATIONS: Contraindication[] = [
  {
    id: 'intracranial_hemorrhage',
    label: 'Intracranial hemorrhage on CT/MRI',
    evidence: 'Finding of ICH on brain imaging is an absolute contraindication per 2013 AHA guidelines and Activase drug label.',
    reference: 'AHA/ASA Guidelines 2013',
  },
  {
    id: 'prior_ich',
    label: 'History of prior intracranial hemorrhage',
    evidence: 'History of ICH associated with 3x increased rebleed risk (amyloid angiopathy, vascular malformations).',
    reference: 'Cochrane Review 2014; Fugate & Rabinstein 2015',
  },
  {
    id: 'severe_hypertension',
    label: 'Severe uncontrolled hypertension',
    evidence: 'Uncontrolled HTN (SBP >185 or DBP >110) is exclusion per 2013 AHA guidelines.',
    reference: 'SITS Registry 2012; Fugate & Rabinstein 2015',
  },
  {
    id: 'head_trauma',
    label: 'Serious head trauma in past 3 months',
    evidence: 'Significant head trauma within 3 months is exclusion per 2013 AHA guidelines.',
    reference: 'AHA/ASA Guidelines 2013; Fugate & Rabinstein 2015',
  },
  {
    id: 'recent_stroke',
    label: 'Ischemic stroke in past 3 months',
    evidence: 'Ischemic stroke within 3 months is exclusion per 2013 AHA guidelines.',
    reference: 'AHA/ASA Guidelines 2013; Fugate & Rabinstein 2015',
  },
  {
    id: 'low_platelets',
    label: 'Platelets <100,000/mm³',
    evidence: 'Platelet count <100,000/mm³ is exclusion per 2013 AHA guidelines.',
    reference: 'AHA/ASA Guidelines 2013',
  },
  {
    id: 'elevated_inr',
    label: 'INR >1.7 or PT >15 seconds',
    evidence: 'INR >1.7 or PT >15 seconds is exclusion per 2013 AHA guidelines.',
    reference: 'AHA/ASA Guidelines 2013',
  },
  {
    id: 'elevated_aptt',
    label: 'Elevated aPTT (if on heparin)',
    evidence: 'Elevated aPTT indicating therapeutic heparin anticoagulation is exclusion per 2013 AHA guidelines.',
    reference: 'AHA/ASA Guidelines 2013',
  },
  {
    id: 'lmwh_24h',
    label: 'Therapeutic LMWH within 24 hours',
    evidence: 'Therapeutic LMWH within 24 hours is exclusion per 2013 AHA guidelines.',
    reference: 'AHA/ASA Guidelines 2013',
  },
  {
    id: 'doac_48h',
    label: 'Direct oral anticoagulant within 48 hours',
    evidence: 'DOAC (dabigatran, rivaroxaban, apixaban, edoxaban) within 48 hours is exclusion per 2013 AHA guidelines.',
    reference: 'AHA/ASA Guidelines 2013',
  },
  {
    id: 'severe_hypoglycemia',
    label: 'Severe hypoglycemia (<50 mg/dL) uncorrected',
    evidence: 'Severe hypoglycemia (<50 mg/dL) uncorrected is exclusion per 2013 AHA guidelines.',
    reference: 'AHA/ASA Guidelines 2013',
  },
  {
    id: 'large_infarct',
    label: 'Early ischemic changes >1/3 MCA territory',
    evidence: 'Early ischemic changes >1/3 MCA territory on CT is exclusion per 2013 AHA guidelines.',
    reference: 'ECASS-1 Trial; AHA/ASA Guidelines 2013',
  },
];

const RELATIVE_CONTRAINDICATIONS: Contraindication[] = [
  {
    id: 'age_over_80',
    label: 'Age >80 years',
    evidence: 'IST-3 trial showed benefit in patients >80 years (OR 1.27) but higher symptomatic ICH (27% vs 18%).',
    reference: 'IST-3 Trial 2012; ECASS-3 Trial; SITS Registry; Fugate & Rabinstein 2015',
  },
  {
    id: 'mild_stroke',
    label: 'Mild or rapidly improving symptoms (NIHSS ≤4)',
    evidence: 'PRISMS trial: tPA not superior for NIHSS 0-5, but 20-30% of mild strokes still disabled at 3 months.',
    reference: 'PRISMS Trial 2018; Smith et al. 2011; Fugate & Rabinstein 2015',
  },
  {
    id: 'severe_stroke',
    label: 'Severe stroke (NIHSS >25)',
    evidence: 'Large territory strokes have 17% symptomatic ICH vs 6% baseline, but still net benefit if eligible.',
    reference: 'Pooled Analysis 2012; NINDS Trial; Fugate & Rabinstein 2015',
  },
  {
    id: 'major_surgery',
    label: 'Major surgery within 14 days',
    evidence: 'Post-surgical patients have 15% symptomatic ICH rate vs 6% baseline (NINDS 1995).',
    reference: 'NINDS rt-PA Trial 1995; Fugate & Rabinstein 2015',
  },
  {
    id: 'arterial_puncture',
    label: 'Arterial puncture of noncompressible vessel <7 days',
    evidence: 'Arterial puncture of noncompressible vessel (subclavian, internal jugular) within 7 days is relative contraindication.',
    reference: 'AHA/ASA Guidelines 2013',
  },
  {
    id: 'gi_gu_bleeding',
    label: 'GI or GU hemorrhage within 21 days',
    evidence: 'Active internal bleeding increases symptomatic ICH risk 10-fold post-thrombolysis (SITS-MOST 2007).',
    reference: 'SITS-MOST 2007; Fugate & Rabinstein 2015',
  },
  {
    id: 'seizure_onset',
    label: 'Seizure at stroke onset',
    evidence: "Must distinguish Todd's paralysis (postictal deficit) from true stroke. Stroke mimics have low sICH risk when thrombolyzed.",
    reference: 'Selim et al. 2002; Winkler et al. 2009; Fugate & Rabinstein 2015',
  },
  {
    id: 'acute_mi',
    label: 'Acute MI within 3 months',
    evidence: 'Risk of cardiac rupture, highest on days 2-5 post-MI. Case reports of hemopericardium and cardiac tamponade after thrombolysis.',
    reference: 'De Silva et al. 2011; Dhand et al. 2010; Fugate & Rabinstein 2015',
  },
  {
    id: 'pregnancy',
    label: 'Pregnancy',
    evidence: 'Must balance maternal vs fetal risk. Limited data on thrombolysis in pregnancy.',
    reference: 'Case Reports; Fugate & Rabinstein 2015',
  },
  {
    id: 'dementia',
    label: 'Pre-existing dementia',
    evidence: 'Pre-existing dementia does NOT increase ICH risk. Studies show dementia patients have similar sICH rates.',
    reference: 'Alshekhlee et al. 2011; Saposnik et al. 2011; Fugate & Rabinstein 2015',
  },
  {
    id: 'intracranial_lesion',
    label: 'Known intracranial neoplasm, AVM, or unruptured aneurysm',
    evidence: 'Saccular unruptured aneurysms: studies show IV rtPA not associated with increased hemorrhage risk.',
    reference: 'Mittal et al. 2013; Sheth et al. 2012; Fugate & Rabinstein 2015',
  },
];

export const ThrombolysisEligibilityModal: React.FC<ThrombolysisEligibilityModalProps> = ({
  isOpen,
  onClose,
  onComplete,
  initialData,
}) => {
  // LKW Time Input State
  const [hour, setHour] = useState('12');
  const [minute, setMinute] = useState('00');
  const [period, setPeriod] = useState<'AM' | 'PM'>('PM');
  const [calculated, setCalculated] = useState(false);
  const [lkwTime, setLkwTime] = useState<Date | null>(initialData?.lkwTime || null);
  const [timeDifferenceHours, setTimeDifferenceHours] = useState<number | null>(initialData?.timeDifferenceHours || null);
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);

  // Eligibility State
  const [inclusionCriteria, setInclusionCriteria] = useState<Record<string, boolean>>({
    within_4_5_hours: initialData?.timeDifferenceHours ? initialData.timeDifferenceHours <= 4.5 : false,
    ct_completed: false,
    disabling_deficit: false,
  });
  const [absoluteContraindications, setAbsoluteContraindications] = useState<Record<string, boolean>>(
    initialData?.absoluteContraindications.reduce((acc, id) => ({ ...acc, [id]: true }), {}) || {}
  );
  const [relativeContraindications, setRelativeContraindications] = useState<Record<string, boolean>>(
    initialData?.relativeContraindications.reduce((acc, id) => ({ ...acc, [id]: true }), {}) || {}
  );
  const [showEvidence, setShowEvidence] = useState<Record<string, boolean>>({});
  const [notes, setNotes] = useState(initialData?.notes || '');

  useEffect(() => {
    if (initialData) {
      setLkwTime(initialData.lkwTime);
      setTimeDifferenceHours(initialData.timeDifferenceHours);
      setCalculated(initialData.timeDifferenceHours !== null);
      setNotes(initialData.notes || '');
    }
  }, [initialData]);

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
    setTimeDifferenceHours(diffHours);
    setLkwTime(calculatedLkwTime);
    setCalculated(true);
    
    // Auto-update inclusion criteria
    setInclusionCriteria(prev => ({
      ...prev,
      within_4_5_hours: diffHours <= 4.5,
    }));
  };

  const toggleEvidence = (id: string) => {
    setShowEvidence(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const eligibilityStatus = useMemo(() => {
    const inclusionMet = Object.values(inclusionCriteria).every(val => val === true);
    const absoluteContras = Object.entries(absoluteContraindications)
      .filter(([_, checked]) => checked)
      .map(([id]) => id);
    const relativeContras = Object.entries(relativeContraindications)
      .filter(([_, checked]) => checked)
      .map(([id]) => id);

    if (!inclusionMet) {
      return {
        status: 'not-eligible' as const,
        title: 'DOES NOT MEET CRITERIA',
        message: 'Not all inclusion criteria are satisfied.',
        color: 'red',
        icon: '✗',
      };
    }

    if (absoluteContras.length > 0) {
      return {
        status: 'absolute-contraindication' as const,
        title: 'IV tPA CONTRAINDICATED',
        message: `Absolute contraindication present. Do not administer IV tPA. Consider mechanical thrombectomy.`,
        color: 'red',
        icon: '✗',
      };
    }

    if (relativeContras.length > 0) {
      return {
        status: 'relative-contraindication' as const,
        title: 'RELATIVE CONTRAINDICATION',
        message: 'Consider risks vs benefits. May proceed with caution or consider endovascular therapy.',
        color: 'yellow',
        icon: '⚠',
      };
    }

    return {
      status: 'eligible' as const,
      title: 'ELIGIBLE FOR IV tPA',
      message: 'Patient meets criteria for thrombolysis. Proceed if no other concerns.',
      color: 'green',
      icon: '✓',
    };
  }, [inclusionCriteria, absoluteContraindications, relativeContraindications]);

  const handleComplete = () => {
    const absoluteContras = Object.entries(absoluteContraindications)
      .filter(([_, checked]) => checked)
      .map(([id]) => id);
    const relativeContras = Object.entries(relativeContraindications)
      .filter(([_, checked]) => checked)
      .map(([id]) => id);

    onComplete({
      lkwTime,
      timeDifferenceHours,
      inclusionCriteriaMet: Object.values(inclusionCriteria).every(val => val === true),
      absoluteContraindications: absoluteContras,
      relativeContraindications: relativeContras,
      eligibilityStatus: eligibilityStatus.status,
      notes,
    });
  };

  const copyToEMR = () => {
    const absoluteContras = Object.entries(absoluteContraindications)
      .filter(([_, checked]) => checked)
      .map(([id]) => ABSOLUTE_CONTRAINDICATIONS.find(c => c.id === id)?.label)
      .filter(Boolean);
    const relativeContras = Object.entries(relativeContraindications)
      .filter(([_, checked]) => checked)
      .map(([id]) => RELATIVE_CONTRAINDICATIONS.find(c => c.id === id)?.label)
      .filter(Boolean);

    const emrText = `IV tPA ELIGIBILITY ASSESSMENT
${'='.repeat(50)}

LAST KNOWN WELL TIME: ${lkwTime ? lkwTime.toLocaleString() : 'Not calculated'}
TIME FROM LKW: ${timeDifferenceHours !== null ? `${timeDifferenceHours.toFixed(1)} hours` : 'N/A'}

INCLUSION CRITERIA:
${inclusionCriteria.within_4_5_hours ? '✓' : '✗'} Symptom onset (LKW) within 4.5 hours
${inclusionCriteria.ct_completed ? '✓' : '✗'} Non-contrast CT scan completed
${inclusionCriteria.disabling_deficit ? '✓' : '✗'} Disabling neurological deficit present

ELIGIBILITY STATUS: ${eligibilityStatus.title}
${eligibilityStatus.message}

${absoluteContras.length > 0 ? `ABSOLUTE CONTRAINDICATIONS:\n${absoluteContras.map(c => `- ${c}`).join('\n')}\n` : ''}
${relativeContras.length > 0 ? `RELATIVE CONTRAINDICATIONS:\n${relativeContras.map(c => `- ${c}`).join('\n')}\n` : ''}
${notes ? `NOTES:\n${notes}\n` : ''}

Assessment Date: ${new Date().toLocaleString()}`;

    navigator.clipboard.writeText(emrText).then(() => {
      setCopiedToClipboard(true);
      setTimeout(() => setCopiedToClipboard(false), 2000);
    });
  };

  // Handle body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} aria-hidden />
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col" role="dialog" aria-labelledby="modal-title">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 id="modal-title" className="text-xl font-bold text-gray-900">IV tPA Eligibility Assessment</h2>
              <p className="text-sm text-gray-500">Treatment window & contraindications</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {/* Last Known Well Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="w-6 h-6 text-blue-600" />
              <div>
                <h3 className="text-lg font-bold text-gray-900">Last Known Well</h3>
                <p className="text-sm text-gray-500">Eligibility & Treatment Window</p>
              </div>
            </div>

            {!calculated ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max="12"
                    value={hour}
                    onChange={(e) => setHour(e.target.value)}
                    className="w-20 text-center text-2xl font-bold bg-gray-50 border-2 border-gray-300 rounded-xl py-3 focus:border-blue-600 focus:ring-2 focus:ring-blue-600 text-gray-900"
                  />
                  <span className="text-2xl font-bold text-gray-400">:</span>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={minute}
                    onChange={(e) => setMinute(e.target.value.padStart(2, '0'))}
                    className="w-20 text-center text-2xl font-bold bg-gray-50 border-2 border-gray-300 rounded-xl py-3 focus:border-blue-600 focus:ring-2 focus:ring-blue-600 text-gray-900"
                  />
                  <div className="flex gap-1 ml-auto">
                    <button
                      onClick={() => setPeriod('AM')}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                        period === 'AM' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      AM
                    </button>
                    <button
                      onClick={() => setPeriod('PM')}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                        period === 'PM' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      PM
                    </button>
                  </div>
                </div>
                <button
                  onClick={setToCurrentTime}
                  className="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:underline"
                >
                  <Clock className="w-4 h-4" />
                  Set to current time
                </button>
                <button
                  onClick={calculateWindow}
                  className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold text-base hover:bg-blue-700 transition-colors shadow-sm"
                >
                  Calculate Treatment Window
                </button>
              </div>
            ) : (
              <div className={`p-6 rounded-xl border-2 ${
                timeDifferenceHours !== null && timeDifferenceHours <= 4.5
                  ? 'bg-green-50 border-green-300'
                  : timeDifferenceHours !== null && timeDifferenceHours <= 24
                  ? 'bg-yellow-50 border-yellow-300'
                  : 'bg-red-50 border-red-300'
              }`}>
                <div className="text-center">
                  <div className={`text-5xl font-black mb-2 ${
                    timeDifferenceHours !== null && timeDifferenceHours <= 4.5 ? 'text-green-600' :
                    timeDifferenceHours !== null && timeDifferenceHours <= 24 ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {timeDifferenceHours?.toFixed(1)}h
                  </div>
                  <div className="text-sm font-medium text-gray-600 mb-3">
                    SINCE LAST KNOWN WELL
                  </div>
                  {timeDifferenceHours !== null && timeDifferenceHours <= 4.5 && (
                    <div className="flex items-center justify-center gap-2 text-green-700 font-bold">
                      <CheckCircle2 className="w-5 h-5" />
                      <span>tPA Candidate - Proceed</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Eligibility Assessment - Only show if within 4.5 hour window */}
          {calculated && timeDifferenceHours !== null && timeDifferenceHours < 4.5 && (
            <>
              {/* Inclusion Criteria */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  Inclusion Criteria
                </h3>
                <div className="space-y-3">
                  <label className="flex items-start gap-3 p-3 rounded-lg border-2 border-gray-200 hover:border-green-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={inclusionCriteria.within_4_5_hours}
                      disabled
                      className="mt-1 rounded border-gray-300 text-green-600 h-5 w-5"
                    />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">
                        Symptom onset (LKW) within 4.5 hours
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Time from LKW: {timeDifferenceHours.toFixed(1)} hours
                      </div>
                    </div>
                  </label>
                  <label className="flex items-start gap-3 p-3 rounded-lg border-2 border-gray-200 hover:border-green-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={inclusionCriteria.ct_completed}
                      onChange={(e) => setInclusionCriteria(prev => ({ ...prev, ct_completed: e.target.checked }))}
                      className="mt-1 rounded border-gray-300 text-green-600 h-5 w-5"
                    />
                    <div className="text-sm font-medium text-gray-900">
                      Non-contrast CT scan completed
                    </div>
                  </label>
                  <label className="flex items-start gap-3 p-3 rounded-lg border-2 border-gray-200 hover:border-green-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={inclusionCriteria.disabling_deficit}
                      onChange={(e) => setInclusionCriteria(prev => ({ ...prev, disabling_deficit: e.target.checked }))}
                      className="mt-1 rounded border-gray-300 text-green-600 h-5 w-5"
                    />
                    <div className="text-sm font-medium text-gray-900">
                      Disabling neurological deficit present
                    </div>
                  </label>
                </div>
              </div>

              {/* Contraindications List */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
                <h3 className="text-sm font-bold text-red-600 uppercase tracking-wider">Absolute Contraindications</h3>
                <div className="space-y-2">
                  {ABSOLUTE_CONTRAINDICATIONS.map((contra) => (
                    <div key={contra.id} className="space-y-2">
                      <label
                        className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 hover:border-red-300 cursor-pointer bg-gray-50"
                      >
                        <input
                          type="checkbox"
                          checked={absoluteContraindications[contra.id] || false}
                          onChange={(e) => setAbsoluteContraindications(prev => ({ ...prev, [contra.id]: e.target.checked }))}
                          className="mt-0.5 rounded border-gray-300 text-red-600 h-4 w-4"
                        />
                        <div className="flex-1 flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-900">{contra.label}</span>
                          {contra.evidence && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                toggleEvidence(contra.id);
                              }}
                              className="p-1 rounded hover:bg-purple-100 transition-colors"
                            >
                              <Info className="w-4 h-4 text-purple-600" />
                            </button>
                          )}
                        </div>
                      </label>
                      {showEvidence[contra.id] && contra.evidence && (
                        <div className="ml-7 p-3 bg-purple-50 rounded-lg border border-purple-200">
                          <div className="font-medium text-purple-700 mb-1 text-sm">Evidence:</div>
                          <div className="text-xs text-gray-700 mb-2 leading-relaxed">{contra.evidence}</div>
                          {contra.reference && (
                            <a
                              href={`/trials?search=${encodeURIComponent(contra.reference)}`}
                              className="inline-flex items-center gap-1 text-xs text-purple-600 hover:underline font-medium"
                            >
                              <span>{contra.reference}</span>
                              <ChevronRight className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <h3 className="text-sm font-bold text-yellow-600 uppercase tracking-wider pt-4">Relative Contraindications</h3>
                <div className="space-y-2">
                  {RELATIVE_CONTRAINDICATIONS.map((contra) => (
                    <div key={contra.id} className="space-y-2">
                      <label
                        className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 hover:border-yellow-300 cursor-pointer bg-yellow-50"
                      >
                        <input
                          type="checkbox"
                          checked={relativeContraindications[contra.id] || false}
                          onChange={(e) => setRelativeContraindications(prev => ({ ...prev, [contra.id]: e.target.checked }))}
                          className="mt-0.5 rounded border-gray-300 text-yellow-600 h-4 w-4"
                        />
                        <div className="flex-1 flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-900">{contra.label}</span>
                          {contra.evidence && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                toggleEvidence(contra.id);
                              }}
                              className="p-1 rounded hover:bg-purple-100 transition-colors"
                            >
                              <Info className="w-4 h-4 text-purple-600" />
                            </button>
                          )}
                        </div>
                      </label>
                      {showEvidence[contra.id] && contra.evidence && (
                        <div className="ml-7 p-3 bg-purple-50 rounded-lg border border-purple-200">
                          <div className="font-medium text-purple-700 mb-1 text-sm">Evidence:</div>
                          <div className="text-xs text-gray-700 mb-2 leading-relaxed">{contra.evidence}</div>
                          {contra.reference && (
                            <a
                              href={`/trials?search=${encodeURIComponent(contra.reference)}`}
                              className="inline-flex items-center gap-1 text-xs text-purple-600 hover:underline font-medium"
                            >
                              <span>{contra.reference}</span>
                              <ChevronRight className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Clinical Notes (Optional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Document any additional considerations..."
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={3}
                />
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
          <button
            onClick={copyToEMR}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold transition-colors"
          >
            {copiedToClipboard ? (
              <>
                <Check className="w-4 h-4" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy to EMR</span>
              </>
            )}
          </button>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleComplete}
              disabled={!calculated || timeDifferenceHours === null || timeDifferenceHours >= 4.5}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-bold transition-colors"
            >
              Complete Assessment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
