import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CalculatorDefinition, CalculatorInput } from '../types';
import { Calculator, ChevronRight, RefreshCw, CheckCircle2, Circle, Check, ArrowLeft, Grid } from 'lucide-react';

// --- CALCULATOR DEFINITIONS ---
// (Definitions remain unchanged as they were already correct in the source)

const GCS_CALC: CalculatorDefinition = {
  id: 'gcs',
  name: 'Glasgow Coma Scale (GCS)',
  description: 'A neurological scale which aims to give a reliable and objective way of recording the state of a person\'s consciousness.',
  inputs: [
    {
      id: 'eye',
      label: 'Eye Opening Response',
      type: 'select',
      options: [
        { value: 4, label: 'Spontaneously (4)' },
        { value: 3, label: 'To speech (3)' },
        { value: 2, label: 'To pain (2)' },
        { value: 1, label: 'No response (1)' }
      ]
    },
    {
      id: 'verbal',
      label: 'Verbal Response',
      type: 'select',
      options: [
        { value: 5, label: 'Oriented to time, place, and person (5)' },
        { value: 4, label: 'Confused (4)' },
        { value: 3, label: 'Inappropriate words (3)' },
        { value: 2, label: 'Incomprehensible sounds (2)' },
        { value: 1, label: 'No response (1)' }
      ]
    },
    {
      id: 'motor',
      label: 'Motor Response',
      type: 'select',
      options: [
        { value: 6, label: 'Obeys commands (6)' },
        { value: 5, label: 'Moves to localized pain (5)' },
        { value: 4, label: 'Flexion withdrawal from pain (4)' },
        { value: 3, label: 'Abnormal flexion (decorticate) (3)' },
        { value: 2, label: 'Abnormal extension (decerebrate) (2)' },
        { value: 1, label: 'No response (1)' }
      ]
    }
  ],
  calculate: (values) => {
    const score = (Number(values.eye) || 0) + (Number(values.verbal) || 0) + (Number(values.motor) || 0);
    let interp = "Severe Brain Injury (Coma)";
    if (score >= 13) interp = "Minor Brain Injury";
    else if (score >= 9) interp = "Moderate Brain Injury";
    
    return { score, interpretation: interp };
  }
};

const ABCD2_CALC: CalculatorDefinition = {
  id: 'abcd2',
  name: 'ABCD² Score for TIA',
  description: 'Estimates the risk of stroke within 2 days after a Transient Ischemic Attack (TIA).',
  inputs: [
    { id: 'age', label: 'Age >= 60 years', type: 'boolean' },
    { id: 'bp', label: 'BP >= 140/90 mmHg', type: 'boolean' },
    {
      id: 'clinical',
      label: 'Clinical Features',
      type: 'select',
      options: [
        { value: 2, label: 'Unilateral weakness (2)' },
        { value: 1, label: 'Speech impairment without weakness (1)' },
        { value: 0, label: 'Other symptoms (0)' }
      ]
    },
    {
      id: 'duration',
      label: 'Duration of Symptoms',
      type: 'select',
      options: [
        { value: 2, label: '>= 60 minutes (2)' },
        { value: 1, label: '10-59 minutes (1)' },
        { value: 0, label: '< 10 minutes (0)' }
      ]
    },
    { id: 'diabetes', label: 'Diabetes', type: 'boolean' }
  ],
  calculate: (values) => {
    let score = 0;
    if (values.age) score += 1;
    if (values.bp) score += 1;
    if (values.diabetes) score += 1;
    score += Number(values.clinical || 0);
    score += Number(values.duration || 0);
    let risk = "Low Risk (1.0% 2-day stroke risk)";
    if (score >= 6) risk = "High Risk (8.1% 2-day stroke risk)";
    else if (score >= 4) risk = "Moderate Risk (4.1% 2-day stroke risk)";
    return { score, interpretation: risk };
  }
};

const NIHSS_CALC: CalculatorDefinition = {
  id: 'nihss',
  name: 'NIH Stroke Scale (NIHSS)',
  description: 'Quantifies the impairment caused by a stroke. Scores range from 0 to 42.',
  inputs: [
    {
      id: '1a',
      label: '1a. Level of Consciousness',
      type: 'select',
      options: [
        { value: 0, label: '0 - Alert' },
        { value: 1, label: '1 - Not alert; aroused with minor stimulation' },
        { value: 2, label: '2 - Not alert; requires repeated stimulation' },
        { value: 3, label: '3 - Unresponsive or reflex movements only' }
      ]
    },
    {
      id: '1b',
      label: '1b. LOC Questions (Month & Age)',
      type: 'select',
      options: [
        { value: 0, label: '0 - Answers both correctly' },
        { value: 1, label: '1 - Answers one correctly' },
        { value: 2, label: '2 - Answers neither correctly' }
      ]
    },
    {
      id: '1c',
      label: '1c. LOC Commands (Open/Close Eyes, Grip)',
      type: 'select',
      options: [
        { value: 0, label: '0 - Performs both tasks correctly' },
        { value: 1, label: '1 - Performs one task correctly' },
        { value: 2, label: '2 - Performs neither task correctly' }
      ]
    },
    {
      id: '2',
      label: '2. Best Gaze',
      type: 'select',
      options: [
        { value: 0, label: '0 - Normal' },
        { value: 1, label: '1 - Partial gaze palsy' },
        { value: 2, label: '2 - Forced deviation' }
      ]
    },
    {
      id: '3',
      label: '3. Visual Fields',
      type: 'select',
      options: [
        { value: 0, label: '0 - No visual loss' },
        { value: 1, label: '1 - Partial hemianopia' },
        { value: 2, label: '2 - Complete hemianopia' },
        { value: 3, label: '3 - Bilateral hemianopia (blind)' }
      ]
    },
    {
      id: '4',
      label: '4. Facial Palsy',
      type: 'select',
      options: [
        { value: 0, label: '0 - Normal symmetry' },
        { value: 1, label: '1 - Minor paralysis (flat nasolabial fold)' },
        { value: 2, label: '2 - Partial paralysis (lower face)' },
        { value: 3, label: '3 - Complete paralysis (upper and lower)' }
      ]
    },
    {
      id: '5a',
      label: '5a. Motor Left Arm',
      type: 'select',
      options: [
        { value: 0, label: '0 - No drift (holds 10s)' },
        { value: 1, label: '1 - Drift, but does not hit bed' },
        { value: 2, label: '2 - Some effort against gravity' },
        { value: 3, label: '3 - No effort against gravity' },
        { value: 4, label: '4 - No movement' }
      ]
    },
    {
      id: '5b',
      label: '5b. Motor Right Arm',
      type: 'select',
      options: [
        { value: 0, label: '0 - No drift (holds 10s)' },
        { value: 1, label: '1 - Drift, but does not hit bed' },
        { value: 2, label: '2 - Some effort against gravity' },
        { value: 3, label: '3 - No effort against gravity' },
        { value: 4, label: '4 - No movement' }
      ]
    },
    {
      id: '6a',
      label: '6a. Motor Left Leg',
      type: 'select',
      options: [
        { value: 0, label: '0 - No drift (holds 5s)' },
        { value: 1, label: '1 - Drift, but does not hit bed' },
        { value: 2, label: '2 - Some effort against gravity' },
        { value: 3, label: '3 - No effort against gravity' },
        { value: 4, label: '4 - No movement' }
      ]
    },
    {
      id: '6b',
      label: '6b. Motor Right Leg',
      type: 'select',
      options: [
        { value: 0, label: '0 - No drift (holds 5s)' },
        { value: 1, label: '1 - Drift, but does not hit bed' },
        { value: 2, label: '2 - Some effort against gravity' },
        { value: 3, label: '3 - No effort against gravity' },
        { value: 4, label: '4 - No movement' }
      ]
    },
    {
      id: '7',
      label: '7. Limb Ataxia',
      type: 'select',
      options: [
        { value: 0, label: '0 - Absent' },
        { value: 1, label: '1 - Present in one limb' },
        { value: 2, label: '2 - Present in two or more limbs' }
      ]
    },
    {
      id: '8',
      label: '8. Sensory',
      type: 'select',
      options: [
        { value: 0, label: '0 - Normal' },
        { value: 1, label: '1 - Mild-to-moderate loss' },
        { value: 2, label: '2 - Severe to total sensory loss' }
      ]
    },
    {
      id: '9',
      label: '9. Best Language',
      type: 'select',
      options: [
        { value: 0, label: '0 - No aphasia' },
        { value: 1, label: '1 - Mild-to-moderate aphasia' },
        { value: 2, label: '2 - Severe aphasia' },
        { value: 3, label: '3 - Mute, global aphasia' }
      ]
    },
    {
      id: '10',
      label: '10. Dysarthria',
      type: 'select',
      options: [
        { value: 0, label: '0 - Normal' },
        { value: 1, label: '1 - Mild-to-moderate dysarthria' },
        { value: 2, label: '2 - Severe dysarthria' }
      ]
    },
    {
      id: '11',
      label: '11. Extinction and Inattention',
      type: 'select',
      options: [
        { value: 0, label: '0 - No abnormality' },
        { value: 1, label: '1 - Visual, tactile, auditory, spatial, or personal inattention' },
        { value: 2, label: '2 - Profound hemi-inattention or extinction' }
      ]
    }
  ],
  calculate: (values) => {
    const fields = ['1a', '1b', '1c', '2', '3', '4', '5a', '5b', '6a', '6b', '7', '8', '9', '10', '11'];
    let score = 0;
    fields.forEach(f => { score += Number(values[f] || 0); });
    let interpretation = "";
    if (score === 0) interpretation = "No stroke symptoms";
    else if (score <= 4) interpretation = "Minor stroke";
    else if (score <= 15) interpretation = "Moderate stroke";
    else if (score <= 20) interpretation = "Moderate to severe stroke";
    else interpretation = "Severe stroke";
    return { score, interpretation };
  }
};

const HASBLED_CALC: CalculatorDefinition = {
  id: 'hasbled',
  name: 'HAS-BLED Score',
  description: 'Estimates 1-year risk of major bleeding for patients with atrial fibrillation.',
  inputs: [
    { id: 'h', label: 'Hypertension (Systolic >160 mmHg)', type: 'boolean' },
    { id: 'a_renal', label: 'Abnormal Renal Function (Dialysis, Transplant, Cr >2.26 mg/dL)', type: 'boolean' },
    { id: 'a_liver', label: 'Abnormal Liver Function (Cirrhosis, Bilirubin >2x, AST/ALT/ALP >3x)', type: 'boolean' },
    { id: 's', label: 'History of Stroke', type: 'boolean' },
    { id: 'b', label: 'History of Bleeding or Predisposition', type: 'boolean' },
    { id: 'l', label: 'Labile INR (Time in range < 60%)', type: 'boolean' },
    { id: 'e', label: 'Elderly (Age > 65)', type: 'boolean' },
    { id: 'd_drugs', label: 'Drugs (Antiplatelets, NSAIDs)', type: 'boolean' },
    { id: 'd_alcohol', label: 'Alcohol Usage (>= 8 drinks/week)', type: 'boolean' }
  ],
  calculate: (values) => {
    let score = 0;
    Object.keys(values).forEach(k => { if (values[k]) score++; });
    let risk = "Low Risk (1.13 bleeds/100 patient-years)";
    if (score >= 3) risk = "High Risk (Use caution)";
    else if (score >= 2) risk = "Moderate Risk (1.88 - 3.74 bleeds/100 patient-years)";
    return { score, interpretation: risk };
  }
};

const MRS_CALC: CalculatorDefinition = {
  id: 'mrs',
  name: 'Modified Rankin Scale (mRS)',
  description: 'Measures the degree of disability or dependence in the daily activities of people who have suffered a stroke.',
  inputs: [
    {
      id: 'mrs_val',
      label: 'Patient Status',
      type: 'select',
      options: [
        { value: 0, label: '0 - No symptoms at all' },
        { value: 1, label: '1 - No significant disability despite symptoms; able to carry out all usual duties' },
        { value: 2, label: '2 - Slight disability; unable to carry out all previous activities, but able to look after own affairs without assistance' },
        { value: 3, label: '3 - Moderate disability; requiring some help, but able to walk without assistance' },
        { value: 4, label: '4 - Moderately severe disability; unable to walk without assistance and unable to attend to own bodily needs' },
        { value: 5, label: '5 - Severe disability; bedridden, incontinent and requiring constant nursing care' },
        { value: 6, label: '6 - Dead' }
      ]
    }
  ],
  calculate: (values) => {
    const score = Number(values.mrs_val);
    let interp = "Independent";
    if (score === 6) interp = "Deceased";
    else if (score >= 3) interp = "Dependent";
    return { score, interpretation: interp };
  }
};

const HUNT_HESS_CALC: CalculatorDefinition = {
  id: 'hunthess',
  name: 'Hunt & Hess Score',
  description: 'Classifies the severity of a subarachnoid hemorrhage to predict mortality.',
  inputs: [
    {
      id: 'grade',
      label: 'Clinical Grade',
      type: 'select',
      options: [
        { value: 1, label: 'Grade 1 - Asymptomatic or mild headache/nuchal rigidity' },
        { value: 2, label: 'Grade 2 - Moderate to severe headache, nuchal rigidity, cranial nerve palsy' },
        { value: 3, label: 'Grade 3 - Drowsiness, confusion, mild focal deficit' },
        { value: 4, label: 'Grade 4 - Stupor, moderate to severe hemiparesis, early decerebrate rigidity' },
        { value: 5, label: 'Grade 5 - Deep coma, decerebrate rigidity, moribund' }
      ]
    }
  ],
  calculate: (values) => {
    const score = Number(values.grade);
    const mortality = ['30%', '40%', '50%', '80%', '90%'][score - 1] || 'Unknown';
    return { score, interpretation: `Approx. Mortality: ${mortality}` };
  }
};

const ICH_CALC: CalculatorDefinition = {
  id: 'ich',
  name: 'ICH Score',
  description: 'Predicts 30-day mortality for patients with intracerebral hemorrhage.',
  inputs: [
    {
      id: 'gcs_ich',
      label: 'GCS Score',
      type: 'select',
      options: [
        { value: 2, label: '3-4 (2 points)' },
        { value: 1, label: '5-12 (1 point)' },
        { value: 0, label: '13-15 (0 points)' }
      ]
    },
    { id: 'volume', label: 'ICH Volume >= 30 cm³', type: 'boolean' },
    { id: 'ivh', label: 'Intraventricular Hemorrhage (IVH)', type: 'boolean' },
    { id: 'infratentorial', label: 'Infratentorial Origin', type: 'boolean' },
    { id: 'age80', label: 'Age >= 80', type: 'boolean' }
  ],
  calculate: (values) => {
    let score = Number(values.gcs_ich || 0);
    if (values.volume) score += 1;
    if (values.ivh) score += 1;
    if (values.infratentorial) score += 1;
    if (values.age80) score += 1;
    const mortality = { 0: '0%', 1: '13%', 2: '26%', 3: '72%', 4: '97%', 5: '100%', 6: '100%' }[score] || 'Unknown';
    return { score, interpretation: `Est. 30-day Mortality: ${mortality}` };
  }
};

const OTTAWA_SAH_CALC: CalculatorDefinition = {
  id: 'ottawa_sah',
  name: 'Ottawa SAH Rule',
  description: 'High sensitivity rule to rule OUT subarachnoid hemorrhage in headache patients.',
  inputs: [
    { id: 'age40', label: 'Age >= 40', type: 'boolean' },
    { id: 'neck', label: 'Neck pain or stiffness', type: 'boolean' },
    { id: 'loc', label: 'Witnessed loss of consciousness', type: 'boolean' },
    { id: 'exertion', label: 'Onset during exertion', type: 'boolean' },
    { id: 'thunder', label: 'Thunderclap (instantly peaking)', type: 'boolean' },
    { id: 'flexion', label: 'Limited neck flexion on exam', type: 'boolean' }
  ],
  calculate: (values) => {
    let hasRisk = false;
    Object.keys(values).forEach(k => { if (values[k]) hasRisk = true; });
    return { 
        score: hasRisk ? "POSITIVE" : "NEGATIVE", 
        interpretation: hasRisk 
            ? "Rule NOT met. SAH cannot be ruled out. Investigate." 
            : "Rule Met (Sensitivity 100%). SAH Ruled Out."
    };
  }
};

const ROPE_CALC: CalculatorDefinition = {
  id: 'rope',
  name: 'RoPE Score',
  description: 'Estimates probability that a Patent Foramen Ovale (PFO) is pathogenic in cryptogenic stroke.',
  inputs: [
    { id: 'no_htn', label: 'No History of Hypertension', type: 'boolean' },
    { id: 'no_dm', label: 'No History of Diabetes', type: 'boolean' },
    { id: 'no_stroke', label: 'No History of Stroke/TIA', type: 'boolean' },
    { id: 'nonsmoker', label: 'Non-Smoker', type: 'boolean' },
    { id: 'cortical', label: 'Cortical Infarct on Imaging', type: 'boolean' },
    {
      id: 'age_grp',
      label: 'Age Group',
      type: 'select',
      options: [
        { value: 5, label: '18 - 29 years (5 pts)' },
        { value: 4, label: '30 - 39 years (4 pts)' },
        { value: 3, label: '40 - 49 years (3 pts)' },
        { value: 2, label: '50 - 59 years (2 pts)' },
        { value: 1, label: '60 - 69 years (1 pts)' },
        { value: 0, label: '>= 70 years (0 pts)' }
      ]
    }
  ],
  calculate: (values) => {
    let score = Number(values.age_grp || 0);
    if (values.no_htn) score += 1;
    if (values.no_dm) score += 1;
    if (values.no_stroke) score += 1;
    if (values.nonsmoker) score += 1;
    if (values.cortical) score += 1;
    let prob = "0% (PFO likely incidental)";
    if (score >= 9) prob = "88% (PFO likely pathogenic)";
    else if (score === 8) prob = "84%";
    else if (score === 7) prob = "72%";
    else if (score === 6) prob = "62%";
    else if (score === 5) prob = "34%";
    else if (score === 4) prob = "38%";
    return { score, interpretation: `PFO Pathogenicity: ${prob}` };
  }
};

const THROMBECTOMY_CALC: CalculatorDefinition = {
  id: 'evt',
  name: 'Thrombectomy Calculator',
  description: 'Stratifies mechanical thrombectomy eligibility and relevant clinical trials based on time window and imaging.',
  inputs: [
    {
      id: 'time',
      label: 'Time from Last Known Well',
      type: 'select',
      options: [
        { value: 'early', label: '0 - 6 Hours' },
        { value: 'late', label: '6 - 24 Hours' },
        { value: 'out', label: '> 24 Hours' }
      ]
    },
    {
      id: 'mrs',
      label: 'Premorbid mRS (Function)',
      type: 'select',
      options: [
        { value: 'independent', label: '0-1 (Independent)' },
        { value: 'dependent', label: '> 1 (Dependent/Disabled)' }
      ]
    },
    {
      id: 'location',
      label: 'Occlusion Location',
      type: 'select',
      options: [
        { value: 'ant', label: 'Anterior LVO (ICA/M1)' },
        { value: 'post', label: 'Basilar Artery' },
        { value: 'distal', label: 'Distal / Medium Vessel' }
      ]
    },
    {
      id: 'imaging',
      label: 'Imaging / Core Size',
      type: 'select',
      options: [
        { value: 'small', label: 'Small Core (ASPECTS ≥ 6)' },
        { value: 'large', label: 'Large Core (ASPECTS 3-5 / >50cc)' },
        { value: 'massive', label: 'Massive Core (ASPECTS < 3 / >70-100cc)' }
      ]
    },
    {
      id: 'mismatch',
      label: 'Perfusion Mismatch (DAWN/DEFUSE-3)',
      type: 'select',
      options: [
        { value: 'present', label: 'Mismatch Present' },
        { value: 'absent', label: 'No Mismatch' },
        { value: 'na', label: 'Not Performed / Not Applicable' }
      ]
    }
  ],
  calculate: (values) => {
    if (values.time === 'out') return { score: 'N/A', interpretation: 'Generally outside standard treatment window (>24h).' };
    if (values.mrs === 'dependent') return { score: 'Review', interpretation: 'Patient was dependent (mRS > 1). Standard trials excluded these patients. Weigh individual risk/benefit.' };
    if (values.location === 'post') return { score: 'Eligible', interpretation: 'Basilar Occlusion: Treat up to 24h based on ATTENTION and BAOCHE trials.' };
    if (values.location === 'distal') return { score: 'Consider', interpretation: 'Distal Occlusion: Consider EVT based on technical feasibility and deficit severity.' };
    if (values.time === 'early') {
        if (values.imaging === 'small') return { score: 'Eligible', interpretation: 'Standard of Care (0-6h). Strong evidence (HERMES meta-analysis).' };
        else if (values.imaging === 'large') return { score: 'Eligible', interpretation: 'Large Core: Eligible based on SELECT2, ANGEL-ASPECT, RESCUE-Japan trials.' };
        else return { score: 'Futile', interpretation: 'Massive Core: Likely futile. Generally excluded from trials.' };
    } else if (values.time === 'late') {
        if (values.mismatch === 'present') return { score: 'Eligible', interpretation: 'Late Window: Eligible per DAWN / DEFUSE-3 criteria.' };
        else return { score: 'Not Eligible', interpretation: 'No target mismatch identified. Medical management preferred.' };
    }
    return { score: 'Unknown', interpretation: 'Clinical correlation required.' };
  }
};

const CALCULATORS = [
    GCS_CALC, 
    NIHSS_CALC, 
    ABCD2_CALC,
    THROMBECTOMY_CALC,
    HASBLED_CALC, 
    MRS_CALC, 
    HUNT_HESS_CALC, 
    ICH_CALC, 
    OTTAWA_SAH_CALC, 
    ROPE_CALC
];

// --- COMPONENTS ---

const Calculators: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeId = searchParams.get('id');
  const returnTo = searchParams.get('returnTo');
  
  const activeCalc = CALCULATORS.find(c => c.id === activeId);
  const [values, setValues] = useState<Record<string, any>>({});
  const [openInputId, setOpenInputId] = useState<string | null>(null);

  useEffect(() => {
    setValues({});
    setOpenInputId(null);
  }, [activeId]);

  const inputs = activeCalc?.inputs || [];
  const firstUnansweredIndex = inputs.findIndex(input => values[input.id] === undefined);
  const isComplete = firstUnansweredIndex === -1 && inputs.length > 0;
  
  const activeIndex = useMemo(() => {
     if (openInputId) return inputs.findIndex(i => i.id === openInputId);
     if (isComplete) return -1;
     return firstUnansweredIndex === -1 ? 0 : firstUnansweredIndex;
  }, [openInputId, firstUnansweredIndex, isComplete, inputs]);

  const handleSelect = (inputId: string, value: any) => {
    setValues(prev => ({ ...prev, [inputId]: value }));
    setOpenInputId(null);
  };

  const handleToggle = (id: string, index: number) => {
      if (values[id] !== undefined || index === firstUnansweredIndex) {
         setOpenInputId(openInputId === id ? null : id);
      }
  };

  const handleSelectCalc = (id: string) => {
    setSearchParams({ id });
  };

  const handleBackToCalculators = () => {
      setSearchParams({});
  };

  const result = (isComplete && activeCalc) ? activeCalc.calculate(values) : null;

  const getLabelForValue = (input: CalculatorInput, val: any) => {
      if (input.type === 'boolean') return val ? 'Yes' : 'No';
      if (input.options) return input.options.find(o => o.value == val)?.label || val;
      return val;
  };

  // If no calculator is selected, show the directory view
  if (!activeCalc) {
    return (
      <div className="max-w-4xl mx-auto py-6">
        <div className="flex items-center space-x-3 mb-8">
            <div className="bg-neuro-500 p-2 rounded-lg text-white">
                <Calculator size={24} />
            </div>
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Clinical Calculators</h1>
                <p className="text-slate-500">Select a validated tool to begin assessment</p>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {CALCULATORS.map(calc => (
            <button
              key={calc.id}
              onClick={() => handleSelectCalc(calc.id)}
              className="group w-full text-left p-6 bg-white rounded-2xl border border-gray-200 shadow-sm hover:border-neuro-300 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-neuro-600 transition-colors">
                    {calc.name}
                  </h3>
                  <p className="text-sm text-slate-500 mt-2 line-clamp-2">
                    {calc.description}
                  </p>
              </div>
              <div className="mt-4 flex items-center text-neuro-500 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                  Open Tool <ChevronRight size={16} className="ml-1" />
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Active Calculator View (The "Dedicated Interface")
  return (
    <div className="max-w-3xl mx-auto py-2 space-y-6 animate-in fade-in duration-300">
      {/* Header Navigation */}
      <div className="flex items-center justify-between mb-2">
        <button 
            onClick={handleBackToCalculators}
            className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-neuro-600 transition-colors group"
        >
            <div className="bg-white p-1.5 rounded-md border border-gray-200 mr-2 shadow-sm group-hover:border-neuro-200 group-hover:shadow-md transition-all">
                <ArrowLeft size={16} />
            </div>
            Back to Calculators
        </button>

        {returnTo && (
            <Link to={returnTo} className="inline-flex items-center text-sm font-semibold text-neuro-600 hover:text-neuro-800 bg-neuro-50 px-3 py-1.5 rounded-lg transition-colors border border-neuro-100 hover:border-neuro-200">
                View Protocol Article
            </Link>
        )}
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-start justify-between mb-4">
              <div>
                  <h1 className="text-3xl font-bold text-slate-900 leading-tight">{activeCalc.name}</h1>
                  <p className="text-slate-500 mt-2 max-w-xl leading-relaxed">{activeCalc.description}</p>
              </div>
              <button 
                onClick={() => { setValues({}); setOpenInputId(null); }} 
                className="p-2 text-slate-400 hover:text-neuro-500 hover:bg-neuro-50 rounded-full transition-all" 
                title="Reset Calculator"
              >
                  <RefreshCw size={22} />
              </button>
          </div>
          
          <div className="mt-6 flex items-center text-sm text-slate-400">
              <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                      className="h-full bg-neuro-500 transition-all duration-500 ease-out"
                      style={{ width: `${(Object.keys(values).length / inputs.length) * 100}%` }}
                  />
              </div>
              <span className="ml-4 font-bold text-slate-500">{Object.keys(values).length} / {inputs.length}</span>
          </div>
      </div>

      {/* Step-by-Step Questions Accordion */}
      <div className="space-y-3">
        {inputs.map((input, index) => {
          const isAnswered = values[input.id] !== undefined;
          const isCurrent = index === activeIndex;
          const isDisabled = !isAnswered && index > (firstUnansweredIndex === -1 ? inputs.length : firstUnansweredIndex);
          
          return (
              <div 
                  key={input.id} 
                  className={`bg-white border rounded-2xl transition-all duration-300 ${
                      isCurrent ? 'ring-2 ring-neuro-500 border-transparent shadow-lg' : 'border-gray-100'
                  } ${isDisabled ? 'opacity-40 grayscale pointer-events-none' : 'opacity-100'}`}
              >
                  {/* Header */}
                  <button
                      onClick={() => !isDisabled && handleToggle(input.id, index)}
                      disabled={isDisabled}
                      className="w-full text-left p-5 flex items-center justify-between"
                  >
                      <div className="flex items-center space-x-4">
                          <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${
                              isAnswered ? 'bg-neuro-500 text-white' : 
                              isCurrent ? 'bg-neuro-600 text-white shadow-md' : 'bg-gray-50 text-gray-300 border border-gray-100'
                          }`}>
                              {isAnswered ? <Check size={16} strokeWidth={3} /> : index + 1}
                          </div>
                          <span className={`text-base font-bold ${isCurrent ? 'text-slate-900' : 'text-slate-600'}`}>
                              {input.label}
                          </span>
                      </div>
                      
                      {isAnswered && !isCurrent && (
                          <div className="flex items-center space-x-2 text-neuro-600">
                             <span className="text-sm font-bold bg-neuro-50 px-3 py-1 rounded-full border border-neuro-100 max-w-[200px] truncate">
                                {getLabelForValue(input, values[input.id])}
                             </span>
                             <div className="w-5 h-5 rounded-full border-2 border-neuro-500 flex items-center justify-center">
                                 <div className="w-2.5 h-2.5 rounded-full bg-neuro-500" />
                             </div>
                          </div>
                      )}
                  </button>

                  {/* Expanded Options */}
                  <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isCurrent ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                      <div className="p-5 pt-0 border-t border-gray-50 mt-2">
                          <div className="space-y-2">
                              {input.type === 'boolean' ? (
                                  <div className="grid grid-cols-2 gap-4">
                                      {[true, false].map((opt) => (
                                          <button
                                              key={String(opt)}
                                              onClick={() => handleSelect(input.id, opt)}
                                              className={`p-5 rounded-xl border-2 text-center transition-all ${
                                                  values[input.id] === opt 
                                                      ? 'border-neuro-500 bg-neuro-50 text-neuro-700 font-bold ring-2 ring-neuro-200 ring-offset-2' 
                                                      : 'border-gray-50 bg-gray-50/50 hover:border-neuro-200 hover:bg-white text-slate-600'
                                              }`}
                                          >
                                              {opt ? 'Yes' : 'No'}
                                          </button>
                                      ))}
                                  </div>
                              ) : (
                                  <div className="space-y-2">
                                      {input.options?.map((opt) => (
                                          <button
                                              key={opt.value}
                                              onClick={() => handleSelect(input.id, opt.value)}
                                              className={`w-full p-5 rounded-xl border-2 text-left transition-all flex items-center justify-between group ${
                                                  values[input.id] === opt.value 
                                                      ? 'border-neuro-500 bg-neuro-50 shadow-sm' 
                                                      : 'border-gray-50 bg-gray-50/50 hover:border-neuro-100 hover:bg-white'
                                              }`}
                                          >
                                              <span className={`text-base font-semibold ${values[input.id] === opt.value ? 'text-neuro-900' : 'text-slate-700'}`}>
                                                  {opt.label}
                                              </span>
                                              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                                                  values[input.id] === opt.value ? 'border-neuro-500 bg-neuro-500 shadow-inner' : 'border-gray-200 group-hover:border-neuro-300'
                                              }`}>
                                                  {values[input.id] === opt.value && <Check size={14} className="text-white" strokeWidth={4} />}
                                              </div>
                                          </button>
                                      ))}
                                  </div>
                              )}
                          </div>
                      </div>
                  </div>
              </div>
          );
        })}
      </div>

      {/* Result Card */}
      {isComplete && result && (
          <div className="sticky bottom-6 mt-10 bg-slate-900 rounded-3xl p-8 text-white flex items-center justify-between shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-500 ring-4 ring-white">
              <div className="flex items-center space-x-6">
                  <div className="bg-neuro-500 p-4 rounded-2xl shadow-lg ring-4 ring-slate-800">
                      <CheckCircle2 size={32} className="text-white" />
                  </div>
                  <div>
                      <p className="text-slate-400 text-xs font-black uppercase tracking-[0.2em] mb-1">Assessment Result</p>
                      <p className="text-4xl font-black text-white tracking-tight">{result.score}</p>
                  </div>
              </div>
              <div className="text-right max-w-[45%] border-l border-slate-700 pl-8">
                  <p className="text-neuro-400 text-sm font-black uppercase tracking-wider mb-2">Interpretation</p>
                  <p className="text-lg font-bold text-slate-100 leading-snug">
                      {result.interpretation}
                  </p>
              </div>
          </div>
      )}
      
      {!isComplete && (
          <div className="mt-12 py-10 bg-white rounded-3xl border border-dashed border-gray-200 text-center text-slate-400 shadow-inner">
              <Calculator size={32} className="mx-auto mb-3 opacity-20" />
              <p className="font-semibold">Complete assessment to view result</p>
          </div>
      )}
    </div>
  );
};

export default Calculators;