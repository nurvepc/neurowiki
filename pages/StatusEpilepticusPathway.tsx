
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Check, RotateCcw, Copy, Info, AlertCircle, ChevronRight, Activity, AlertTriangle, ShieldCheck, ShieldAlert } from 'lucide-react';

// --- Types ---
type Agent = "levetiracetam" | "fosphenytoin" | "valproate" | "lacosamide" | "phenobarbital";

interface PatientData {
  weight: number;
  convulsive: boolean;
  ivAccess: boolean;
  glucoseChecked: boolean;
}

interface Comorbidities {
  hypotension: boolean;
  respiratory: boolean;
  cardiac: boolean; // PR prolongation
  liver: boolean;
  pancreatitis: boolean;
  pregnancy: boolean;
  renal: boolean;
  carbapenem: boolean;
}

// --- Dosing Logic ---
const calculateDose = (agent: Agent | "lorazepam" | "midazolam" | "diazepam", weight: number): string => {
  if (weight <= 0) return "Enter weight";
  
  switch(agent) {
    case "lorazepam":
      return `${Math.min(4, Math.round(0.1 * weight * 10) / 10)} mg IV (0.1 mg/kg, max 4mg)`;
    case "midazolam":
      return `${Math.min(10, Math.round(0.2 * weight * 10) / 10)} mg IM/IV (0.2 mg/kg, max 10mg)`;
    case "diazepam":
      return `${Math.min(10, Math.round(0.15 * weight * 10) / 10)} mg IV (0.15 mg/kg, max 10mg)`;
    case "levetiracetam":
      return `${Math.min(4500, Math.round(60 * weight))} mg IV (60 mg/kg, max 4500mg)`;
    case "fosphenytoin":
      return `${Math.min(1500, Math.round(20 * weight))} mg PE IV (20 mg PE/kg, max 1500mg PE)`;
    case "valproate":
      return `${Math.min(3000, Math.round(40 * weight))} mg IV (40 mg/kg, max 3000mg)`;
    case "lacosamide":
      return `${Math.min(600, Math.round(8 * weight))} mg IV (8 mg/kg, max 600mg)`;
    case "phenobarbital":
      return `${Math.round(20 * weight)} mg IV (20 mg/kg, rate <60mg/min)`;
    default:
      return "-";
  }
};

const StatusEpilepticusPathway: React.FC = () => {
  const [step, setStep] = useState(1);
  
  // State
  const [patient, setPatient] = useState<PatientData>({ weight: 0, convulsive: true, ivAccess: true, glucoseChecked: true });
  const [stage1Agent, setStage1Agent] = useState<"lorazepam" | "diazepam" | "midazolam" | null>(null);
  const [stage1Success, setStage1Success] = useState<boolean | null>(null);
  
  const [comorbidities, setComorbidities] = useState<Comorbidities>({
    hypotension: false, respiratory: false, cardiac: false, liver: false, 
    pancreatitis: false, pregnancy: false, renal: false, carbapenem: false
  });
  const [stage2Agent, setStage2Agent] = useState<Agent | "auto">("auto");
  const [stage2Success, setStage2Success] = useState<boolean | null>(null);
  
  const [refractoryPath, setRefractoryPath] = useState<"non-sedating" | "anesthetic" | null>(null);
  const [evidenceOpen, setEvidenceOpen] = useState(false);

  // Refs for scrolling
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (step > 1 && bottomRef.current) {
        // Small delay to allow render
        setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  }, [step]);

  // --- Auto-Selection Logic ---
  const getRecommendedStage2 = (): { agent: Agent; reason: string; warnings: string[] } => {
    const warnings: string[] = [];
    
    // Constraints
    const avoidValproate = comorbidities.liver || comorbidities.pancreatitis || comorbidities.pregnancy || comorbidities.carbapenem;
    const avoidLacosamide = comorbidities.cardiac;
    const avoidPhenobarbital = comorbidities.hypotension || comorbidities.respiratory;
    const cautionLevetiracetam = comorbidities.renal;
    const cautionPhenytoin = comorbidities.hypotension || comorbidities.cardiac;

    if (comorbidities.pregnancy) warnings.push("Pregnancy: Valproate contraindicated (teratogenic).");
    if (comorbidities.liver) warnings.push("Liver Dz: Valproate avoided.");
    if (comorbidities.carbapenem) warnings.push("Carbapenem: Lowers valproate levels.");
    if (comorbidities.cardiac) warnings.push("Cardiac (PR>200ms): Lacosamide avoided. Caution Phenytoin.");
    if (comorbidities.hypotension) warnings.push("Hypotension: Avoid Phenobarb. Caution Phenytoin.");
    if (comorbidities.renal) warnings.push("Renal: Levetiracetam requires dose adjustment.");

    // Decision Tree
    if (!cautionLevetiracetam) return { agent: "levetiracetam", reason: "Standard first-line (ESETT)", warnings };
    
    // If Renal issue, prefer Fosphenytoin if safe
    if (!cautionPhenytoin) return { agent: "fosphenytoin", reason: "Preferred alternative (Renal sparing)", warnings };
    
    // If Renal + Cardiac/Hypotension... check Valproate
    if (!avoidValproate) return { agent: "valproate", reason: "Safe hemodynamic profile", warnings };
    
    // If Renal + Cardiac + Valproate issue... check Lacosamide (only if cardiac is minor or not absolute)
    if (!avoidLacosamide) return { agent: "lacosamide", reason: "Alternative option", warnings };
    
    // Last resort or specific profile
    if (!avoidPhenobarbital) return { agent: "phenobarbital", reason: "Last line prior to anesthesia", warnings };
    
    // Fallback if everything has flags - pick Levetiracetam with renal warning
    return { agent: "levetiracetam", reason: "Best available (Adjust dose)", warnings: [...warnings, "MUST ADJUST DOSE FOR RENAL FUNCTION"] };
  };

  const finalStage2 = stage2Agent === "auto" ? getRecommendedStage2().agent : stage2Agent;
  const currentRecommendation = getRecommendedStage2();

  const handleReset = () => {
    setStep(1);
    setPatient({ weight: 0, convulsive: true, ivAccess: true, glucoseChecked: true });
    setStage1Agent(null);
    setStage1Success(null);
    setComorbidities({
        hypotension: false, respiratory: false, cardiac: false, liver: false, 
        pancreatitis: false, pregnancy: false, renal: false, carbapenem: false
    });
    setStage2Agent("auto");
    setStage2Success(null);
    setRefractoryPath(null);
  };

  const generateCopyText = () => {
    const parts = [];
    
    // Stage 1
    if (stage1Agent) {
        parts.push(`Stage 1: ${stage1Agent} ${calculateDose(stage1Agent, patient.weight)}`);
        if (stage1Success) parts.push("(Responsive)");
        else parts.push("(Refractory)");
    }

    // Stage 2
    if (!stage1Success && step >= 3) {
        parts.push(`→ Stage 2: ${finalStage2} ${calculateDose(finalStage2, patient.weight)}`);
        
        // Criteria
        const criteria = [];
        if (comorbidities.pregnancy) criteria.push("Pregnancy");
        if (comorbidities.renal) criteria.push("Renal Impairment");
        if (comorbidities.liver) criteria.push("Liver Dz");
        if (comorbidities.cardiac) criteria.push("Cardiac/PR prolonged");
        if (comorbidities.hypotension) criteria.push("Hypotension");
        
        if (criteria.length > 0) parts.push(`Criteria: ${criteria.join(", ")}`);
        else parts.push("Criteria: Standard");
    }

    // Stage 3
    if (step === 4) {
        parts.push("→ Stage 3: Refractory SE");
    }

    parts.push("Source: Glauser T et al. Epilepsy Curr 2016; Kapur J et al. N Engl J Med 2019 (ESETT).");
    
    return parts.join(". ");
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateCopyText());
    alert("Copied to clipboard");
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      
      {/* Header */}
      <div className="mb-8">
        <Link to="/calculators" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-neuro-600 mb-6 group">
            <div className="bg-white p-1.5 rounded-md border border-gray-200 mr-2 shadow-sm group-hover:shadow-md transition-all">
                <ArrowLeft size={16} />
            </div>
            Back to Calculators
        </Link>
        <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-red-100 text-red-700 rounded-lg">
                <Activity size={24} />
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Status Epilepticus Pathway</h1>
        </div>
        <p className="text-slate-500 font-medium">Comorbidity-aware medication selection and dosing guide.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        
        {/* Main Stepper Content */}
        <div className="lg:col-span-2 space-y-6">
            
            {/* Steps Indicator */}
            <div className="flex items-center space-x-2 mb-6 px-1">
                {[1, 2, 3, 4].map((s) => (
                    <div key={s} className="flex-1 flex flex-col items-center relative">
                        <div className={`w-full h-1 absolute top-1/2 -translate-y-1/2 -z-10 ${s === 1 ? 'hidden' : ''} ${step >= s ? 'bg-red-500' : 'bg-gray-200'}`}></div>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors z-10 ${
                            step === s ? 'bg-white border-red-500 text-red-600' : 
                            step > s ? 'bg-red-500 border-red-500 text-white' : 'bg-gray-100 border-gray-200 text-gray-400'
                        }`}>
                            {step > s ? <Check size={14} /> : s}
                        </div>
                    </div>
                ))}
            </div>

            {/* STEP 1: BASICS */}
            {step === 1 && (
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6 animate-in slide-in-from-right-4">
                    <h2 className="text-lg font-bold text-slate-900">Patient Basics</h2>
                    
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Patient Weight (kg)</label>
                        <input 
                            type="number" 
                            className="w-full p-4 bg-slate-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none text-lg font-bold"
                            placeholder="e.g. 70"
                            value={patient.weight || ''}
                            onChange={(e) => setPatient({...patient, weight: parseFloat(e.target.value)})}
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="flex items-center justify-between p-4 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                            <span className="font-medium text-slate-700">Active Convulsions Ongoing?</span>
                            <input type="checkbox" checked={patient.convulsive} onChange={(e) => setPatient({...patient, convulsive: e.target.checked})} className="w-5 h-5 text-red-600 rounded focus:ring-red-500" />
                        </label>
                        <label className="flex items-center justify-between p-4 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                            <span className="font-medium text-slate-700">IV Access Established?</span>
                            <input type="checkbox" checked={patient.ivAccess} onChange={(e) => setPatient({...patient, ivAccess: e.target.checked})} className="w-5 h-5 text-red-600 rounded focus:ring-red-500" />
                        </label>
                        <label className="flex items-center justify-between p-4 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                            <span className="font-medium text-slate-700">Fingerstick Glucose Checked?</span>
                            <input type="checkbox" checked={patient.glucoseChecked} onChange={(e) => setPatient({...patient, glucoseChecked: e.target.checked})} className="w-5 h-5 text-red-600 rounded focus:ring-red-500" />
                        </label>
                    </div>

                    <div className="pt-4 border-t border-gray-100">
                        <button 
                            disabled={!patient.weight}
                            onClick={() => setStep(2)}
                            className="w-full py-4 bg-red-600 text-white rounded-xl font-bold text-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-200 transition-all active:scale-95"
                        >
                            Proceed to Stage 1
                        </button>
                    </div>
                </div>
            )}

            {/* STEP 2: STAGE 1 (BENZO) */}
            {step === 2 && (
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6 animate-in slide-in-from-right-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold text-slate-900">Stage 1: Benzodiazepine</h2>
                        <span className="px-3 py-1 bg-red-50 text-red-600 text-xs font-bold rounded-full">0 - 5 Minutes</span>
                    </div>

                    <div className="grid gap-3">
                        {[
                            { id: "lorazepam", label: "IV Lorazepam", dose: calculateDose("lorazepam", patient.weight) },
                            { id: "midazolam", label: "IM Midazolam", dose: calculateDose("midazolam", patient.weight) },
                            { id: "diazepam", label: "IV Diazepam", dose: calculateDose("diazepam", patient.weight) }
                        ].map((opt) => (
                            <button
                                key={opt.id}
                                onClick={() => setStage1Agent(opt.id as any)}
                                className={`text-left p-4 rounded-xl border-2 transition-all ${
                                    stage1Agent === opt.id 
                                    ? 'border-red-500 bg-red-50' 
                                    : 'border-gray-100 hover:border-gray-300'
                                }`}
                            >
                                <div className="flex justify-between items-center">
                                    <span className={`font-bold ${stage1Agent === opt.id ? 'text-red-900' : 'text-slate-700'}`}>{opt.label}</span>
                                    {stage1Agent === opt.id && <Check size={18} className="text-red-600" />}
                                </div>
                                <div className={`text-sm mt-1 ${stage1Agent === opt.id ? 'text-red-700' : 'text-slate-500'}`}>{opt.dose}</div>
                            </button>
                        ))}
                    </div>

                    {stage1Agent && (
                        <div className="pt-6 border-t border-gray-100 animate-in fade-in slide-in-from-top-2">
                            <h3 className="text-center font-bold text-slate-900 mb-4">Did seizures stop after benzodiazepine?</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <button 
                                    onClick={() => { setStage1Success(true); }}
                                    className={`py-3 rounded-xl font-bold border-2 transition-all ${stage1Success === true ? 'bg-emerald-600 text-white border-emerald-600' : 'border-gray-200 text-slate-600 hover:border-emerald-200 hover:bg-emerald-50'}`}
                                >
                                    Yes, Stopped
                                </button>
                                <button 
                                    onClick={() => { setStage1Success(false); setStep(3); }}
                                    className="py-3 rounded-xl font-bold border-2 border-gray-200 text-slate-600 hover:border-red-200 hover:bg-red-50 transition-all"
                                >
                                    No, Continue
                                </button>
                            </div>
                            {stage1Success && (
                                <div className="mt-4 p-4 bg-emerald-50 text-emerald-800 rounded-xl text-sm font-medium text-center">
                                    Continue to monitor. Initiate maintenance therapy if indicated.
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* STEP 3: STAGE 2 (ESTABLISHED) */}
            {step === 3 && (
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6 animate-in slide-in-from-right-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold text-slate-900">Stage 2: Established SE</h2>
                        <span className="px-3 py-1 bg-red-50 text-red-600 text-xs font-bold rounded-full">5 - 30 Minutes</span>
                    </div>

                    {/* Comorbidities */}
                    <div className="bg-slate-50 p-5 rounded-xl space-y-4">
                        <h3 className="text-xs font-black uppercase tracking-widest text-slate-500">Risk Factors & Comorbidities</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {Object.keys(comorbidities).map((key) => {
                                const k = key as keyof Comorbidities;
                                const labels: Record<string, string> = {
                                    hypotension: "Hypotension / Shock",
                                    respiratory: "Respiratory Compromise",
                                    cardiac: "Cardiac Cond. / PR > 200ms",
                                    liver: "Severe Liver Disease",
                                    pancreatitis: "History of Pancreatitis",
                                    pregnancy: "Pregnancy / Childbearing",
                                    renal: "Renal Impairment",
                                    carbapenem: "On Carbapenem Abx"
                                };
                                return (
                                    <label key={key} className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${comorbidities[k] ? 'bg-red-100 border-red-300 text-red-900' : 'bg-white border-gray-200 text-slate-600 hover:border-gray-300'}`}>
                                        <span className="text-sm font-bold">{labels[key]}</span>
                                        <input 
                                            type="checkbox" 
                                            checked={comorbidities[k]} 
                                            onChange={(e) => setComorbidities({...comorbidities, [k]: e.target.checked})}
                                            className="w-4 h-4 text-red-600 rounded focus:ring-red-500" 
                                        />
                                    </label>
                                );
                            })}
                        </div>
                    </div>

                    {/* Agent Selection */}
                    <div>
                        <h3 className="text-sm font-bold text-slate-900 mb-3">Select Loading Agent</h3>
                        <div className="grid gap-3 mb-4">
                            <button 
                                onClick={() => setStage2Agent("auto")}
                                className={`text-left p-4 rounded-xl border-2 relative overflow-hidden transition-all ${stage2Agent === 'auto' ? 'border-neuro-500 bg-neuro-50' : 'border-gray-100 bg-white hover:border-gray-200'}`}
                            >
                                <div className="flex items-center justify-between relative z-10">
                                    <div>
                                        <div className="font-bold text-slate-900">Auto-Select Best Fit</div>
                                        <div className="text-sm text-slate-500">Based on selected comorbidities</div>
                                    </div>
                                    {stage2Agent === 'auto' && <div className="bg-neuro-500 text-white px-3 py-1 rounded-full text-xs font-bold">Active</div>}
                                </div>
                            </button>
                            
                            {stage2Agent === 'auto' && (
                                <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl animate-in fade-in">
                                    <div className="flex items-start">
                                        <ShieldCheck className="text-emerald-600 mt-0.5 mr-3 flex-shrink-0" size={20} />
                                        <div>
                                            <div className="font-bold text-emerald-900 capitalize text-lg">{finalStage2}</div>
                                            <div className="text-emerald-700 text-sm mt-1">{currentRecommendation.reason}</div>
                                            <div className="font-mono text-emerald-800 font-bold mt-2 bg-white/50 inline-block px-2 py-1 rounded">
                                                {calculateDose(finalStage2, patient.weight)}
                                            </div>
                                            {currentRecommendation.warnings.length > 0 && (
                                                <div className="mt-3 space-y-1">
                                                    {currentRecommendation.warnings.map((w, i) => (
                                                        <div key={i} className="flex items-center text-xs text-amber-700 font-bold">
                                                            <AlertTriangle size={12} className="mr-1.5" /> {w}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Manual Override Dropdown (Optional/Hidden for simplicity unless requested, but here providing the selected agent view is enough) */}
                        <div className="text-xs text-slate-400 text-center cursor-pointer hover:text-slate-600" onClick={() => { /* Could implement manual expansion */ }}>
                            Algorithm preference: Levetiracetam > Fosphenytoin > Valproate > Lacosamide
                        </div>
                    </div>

                    <div className="pt-6 border-t border-gray-100">
                        <h3 className="text-center font-bold text-slate-900 mb-4">Did seizures stop after loading?</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <button 
                                onClick={() => { setStage2Success(true); }}
                                className={`py-3 rounded-xl font-bold border-2 transition-all ${stage2Success === true ? 'bg-emerald-600 text-white border-emerald-600' : 'border-gray-200 text-slate-600 hover:border-emerald-200 hover:bg-emerald-50'}`}
                            >
                                Yes
                            </button>
                            <button 
                                onClick={() => { setStage2Success(false); setStep(4); }}
                                className="py-3 rounded-xl font-bold border-2 border-gray-200 text-slate-600 hover:border-red-200 hover:bg-red-50 transition-all"
                            >
                                No
                            </button>
                        </div>
                        {stage2Success && (
                            <div className="mt-4 p-4 bg-emerald-50 text-emerald-800 rounded-xl text-sm font-medium text-center">
                                Start maintenance therapy with {finalStage2}. Monitor levels if applicable.
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* STEP 4: STAGE 3 (REFRACTORY) */}
            {step === 4 && (
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6 animate-in slide-in-from-right-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold text-slate-900">Stage 3: Refractory SE</h2>
                        <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full">30-60+ Min</span>
                    </div>

                    <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-start space-x-3">
                        <AlertTriangle className="text-red-600 shrink-0 mt-0.5" size={20} />
                        <div className="text-sm text-red-900">
                            <strong>Critical Phase:</strong> Failure of Benzo + 2nd Line Agent defines Refractory SE. Mortality risk increases significantly.
                        </div>
                    </div>

                    <div className="grid gap-4">
                        <button 
                            onClick={() => setRefractoryPath("non-sedating")}
                            className={`p-5 rounded-xl border-2 text-left transition-all ${refractoryPath === 'non-sedating' ? 'border-neuro-500 bg-neuro-50' : 'border-gray-200 hover:border-neuro-200'}`}
                        >
                            <div className="font-bold text-slate-900 text-lg mb-1">Additional Non-Sedating Trial</div>
                            <p className="text-sm text-slate-500 leading-relaxed">
                                Consider if patient is hemodynamically stable and intubation is not yet desired/available. 
                                Options: <strong>Lacosamide, Phenobarbital, Valproate</strong> (if not used).
                            </p>
                        </button>

                        <button 
                            onClick={() => setRefractoryPath("anesthetic")}
                            className={`p-5 rounded-xl border-2 text-left transition-all ${refractoryPath === 'anesthetic' ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-red-200'}`}
                        >
                            <div className="font-bold text-slate-900 text-lg mb-1">Anesthetic Infusion (RSE)</div>
                            <p className="text-sm text-slate-500 leading-relaxed">
                                Requires intubation and ICU monitoring.
                                Options: <strong>Midazolam, Propofol, Pentobarbital, Ketamine</strong>.
                            </p>
                        </button>
                    </div>
                </div>
            )}

            {/* Evidence Accordion */}
            <div className="border border-gray-200 rounded-xl bg-white overflow-hidden" ref={bottomRef}>
                <button 
                    onClick={() => setEvidenceOpen(!evidenceOpen)}
                    className="w-full px-6 py-4 flex items-center justify-between text-sm font-bold text-slate-600 hover:bg-slate-50"
                >
                    <span>Evidence Basis & Guidelines</span>
                    <ChevronRight size={16} className={`transition-transform ${evidenceOpen ? 'rotate-90' : ''}`} />
                </button>
                {evidenceOpen && (
                    <div className="px-6 pb-6 text-xs text-slate-500 space-y-3 leading-relaxed border-t border-gray-100 pt-4">
                        <p><strong>Guidelines:</strong> Based on the American Epilepsy Society (AES) 2016 Guideline for the Treatment of Convulsive Status Epilepticus.</p>
                        <p><strong>Stage 2 Equivalence:</strong> The ESETT Trial (N Engl J Med 2019) found no significant difference in efficacy or safety between Fosphenytoin, Valproate, and Levetiracetam for benzodiazepine-refractory SE.</p>
                        <p><strong>Safety Logic:</strong>
                            <ul className="list-disc list-inside mt-1 ml-2">
                                <li>Valproate avoided in pregnancy (teratogenicity) and liver disease.</li>
                                <li>Lacosamide flagged for PR prolongation (FDA warning).</li>
                                <li>Levetiracetam flagged for renal dose adjustment.</li>
                            </ul>
                        </p>
                    </div>
                )}
            </div>

        </div>

        {/* Sidebar / Bottom Bar Results */}
        <div className="lg:col-span-1 lg:sticky lg:top-6 space-y-4">
            <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl">
                <div className="flex items-center space-x-2 mb-6 border-b border-white/20 pb-4">
                    <Activity className="text-red-400" />
                    <span className="font-bold tracking-wide text-sm uppercase">Current Recommendation</span>
                </div>

                <div className="space-y-6">
                    {/* Stage 1 Display */}
                    <div>
                        <div className="text-xs text-slate-400 font-bold uppercase mb-1">Stage 1 (0-5m)</div>
                        {stage1Agent ? (
                            <div>
                                <div className="text-xl font-bold text-white capitalize">{stage1Agent}</div>
                                <div className="text-sm text-slate-300 font-mono mt-1">{calculateDose(stage1Agent, patient.weight)}</div>
                                {stage1Success !== null && (
                                    <div className={`text-xs font-bold mt-2 ${stage1Success ? 'text-emerald-400' : 'text-red-400'}`}>
                                        {stage1Success ? 'Seizures Stopped' : 'Refractory -> Stage 2'}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-sm text-slate-500 italic">Pending selection...</div>
                        )}
                    </div>

                    {/* Stage 2 Display */}
                    {(step >= 3 || (!stage1Success && stage1Agent)) && (
                        <div className="animate-in fade-in slide-in-from-bottom-2">
                            <div className="text-xs text-slate-400 font-bold uppercase mb-1">Stage 2 (5-30m)</div>
                            {step >= 3 ? (
                                <div>
                                    <div className="text-xl font-bold text-white capitalize">{finalStage2}</div>
                                    <div className="text-sm text-slate-300 font-mono mt-1">{calculateDose(finalStage2, patient.weight)}</div>
                                    {stage2Success !== null && (
                                        <div className={`text-xs font-bold mt-2 ${stage2Success ? 'text-emerald-400' : 'text-red-400'}`}>
                                            {stage2Success ? 'Seizures Stopped' : 'Refractory -> Stage 3'}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-sm text-slate-500 italic">Pending...</div>
                            )}
                        </div>
                    )}

                    {step === 4 && (
                         <div className="animate-in fade-in slide-in-from-bottom-2">
                            <div className="text-xs text-red-400 font-bold uppercase mb-1">Stage 3 (>30m)</div>
                            <div className="font-bold">Refractory SE Protocol</div>
                         </div>
                    )}
                </div>

                <div className="mt-8 pt-6 border-t border-white/20">
                    <button 
                        onClick={copyToClipboard}
                        className="w-full flex items-center justify-center space-x-2 bg-white text-slate-900 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors active:scale-95"
                    >
                        <Copy size={16} />
                        <span>Copy to EMR</span>
                    </button>
                </div>
            </div>

            <button 
                onClick={handleReset} 
                className="w-full py-3 text-slate-400 font-bold text-sm hover:text-slate-600 flex items-center justify-center"
            >
                <RotateCcw size={14} className="mr-2" /> Reset Calculator
            </button>
        </div>

      </div>
    </div>
  );
};

export default StatusEpilepticusPathway;
