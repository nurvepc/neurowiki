import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Copy } from 'lucide-react';
import { StrokeBasicsLayout } from './StrokeBasicsLayout';
import { ProtocolSection } from '../../components/article/stroke/ProtocolSection';
import { LKWSection } from '../../components/article/stroke/LKWSection';
import { LVOSection } from '../../components/article/stroke/LVOSection';
import { LabsAndVitalsSection } from '../../components/article/stroke/LabsAndVitalsSection';
import { TreatmentSection } from '../../components/article/stroke/TreatmentSection';
import { HemorrhageProtocol } from '../../components/article/stroke/HemorrhageProtocol';
import { SidebarTimer } from '../../components/article/stroke/SidebarTimer';
import { ProtocolStepsNav, Step as ProtocolStep } from '../../components/article/stroke/ProtocolStepsNav';
import { QuickToolsGrid } from '../../components/article/stroke/QuickToolsGrid';
import { STROKE_CLINICAL_PEARLS } from '../../data/strokeClinicalPearls';
import { StickyArticleHeader } from '../../components/article/stroke/StickyArticleHeader';
import { DeepLearningModal } from '../../components/article/stroke/DeepLearningModal';
import { ThrombectomyPathwayModal } from '../../components/article/stroke/ThrombectomyPathwayModal';

type StepStatus = 'completed' | 'active' | 'locked';

interface Step {
  id: number;
  title: string;
  subtitle: string;
  status: StepStatus;
  isExpanded: boolean;
  completionSummary?: string;
}

// Main content component that uses the layout hook (must be inside StrokeBasicsLayout)
const MainContent: React.FC<{
  isLearningMode: boolean;
  setIsLearningMode: (value: boolean) => void;
  steps: Step[];
  toggleStep: (id: number) => void;
  completeStep: (id: number, summary?: string) => void;
  activeStepNumber: number | null;
  getProtocolStatus: (step: Step) => 'in-progress' | 'pending' | 'completed';
  handleStepClick: (stepId: number) => void;
  step1ModalOpen: boolean;
  setStep1ModalOpen: (value: boolean) => void;
  step2ModalOpen: boolean;
  setStep2ModalOpen: (value: boolean) => void;
  step3ModalOpen: boolean;
  setStep3ModalOpen: (value: boolean) => void;
  step4ModalOpen: boolean;
  setStep4ModalOpen: (value: boolean) => void;
  step5ModalOpen: boolean;
  setStep5ModalOpen: (value: boolean) => void;
  thrombectomyModalOpen: boolean;
  setThrombectomyModalOpen: (value: boolean) => void;
  onThrombectomyRecommendation?: (recommendation: string) => void;
  thrombectomyRecommendation: string | null;
}> = ({ isLearningMode, setIsLearningMode, steps, toggleStep, completeStep, activeStepNumber, getProtocolStatus, handleStepClick, step1ModalOpen, setStep1ModalOpen, step2ModalOpen, setStep2ModalOpen, step3ModalOpen, setStep3ModalOpen, step4ModalOpen, setStep4ModalOpen, step5ModalOpen, setStep5ModalOpen, thrombectomyModalOpen, setThrombectomyModalOpen, onThrombectomyRecommendation, thrombectomyRecommendation }) => {

      return (
        <>
          {/* Sticky Header with Timer, Steps, Tools */}
          <StickyArticleHeader
            steps={steps.map(step => ({
              id: step.id,
              title: step.title,
              status: step.status === 'completed' ? 'completed' : step.status === 'active' ? 'active' : 'locked'
            }))}
            activeStepNumber={activeStepNumber}
            onStepClick={handleStepClick}
          />

          {/* Back Button */}
          <div className="mb-6 px-6 pt-6">
            <Link
              to="/guide"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors border border-slate-200 dark:border-slate-700 mb-4"
            >
              <ArrowLeft size={18} />
              <span>Back to Resident Guide</span>
            </Link>
          </div>

          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-3xl font-black text-gray-900 dark:text-white">
                Stroke Code Basics
              </h1>
          <div className="flex items-center gap-2">
            {/* Learning Mode Toggle */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Learning
              </span>
              <button
                onClick={() => setIsLearningMode(!isLearningMode)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
                  isLearningMode ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'
                }`}
                role="switch"
                aria-checked={isLearningMode}
                aria-label="Toggle learning mode"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isLearningMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Real-time emergency decision support • Complete each step sequentially
        </p>
      </div>

      {/* Wikipedia-Style Protocol Sections */}
      <div className="space-y-12">
        {/* Step 1: Last Known Well */}
        <div id="step-1">
          <ProtocolSection
            number={1}
            title={steps[0].title}
            status={getProtocolStatus(steps[0])}
            isActive={activeStepNumber === 1}
            showCompleteButton={steps[0].status === 'active'}
            onComplete={() => completeStep(1, 'LKW established • Eligibility assessed')}
            showDeepLearningBadge={isLearningMode}
            pearlCount={STROKE_CLINICAL_PEARLS['step-1']?.deep?.length || 0}
            onDeepLearningClick={() => setStep1ModalOpen(true)}
          >
            <LKWSection 
              isLearningMode={isLearningMode}
              onOutsideWindow={(hoursElapsed) => {
                // Auto-advance to LVO Screen if outside 4.5 hour window
                completeStep(1, `LKW established • Outside 4.5h window (${hoursElapsed.toFixed(1)}h) • Proceed to LVO screening`);
                // completeStep already handles scrolling, but add extra scroll as backup
                scrollToStep(2, 400);
              }}
            />
          </ProtocolSection>

          {/* Modal */}
          {isLearningMode && (
            <DeepLearningModal
              isOpen={step1ModalOpen}
              onClose={() => setStep1ModalOpen(false)}
              sectionTitle="1. Last Known Well & Eligibility"
              pearls={STROKE_CLINICAL_PEARLS['step-1']?.deep || []}
            />
          )}
        </div>

        {/* Step 2: LVO Screening */}
        <div id="step-2">
          <ProtocolSection
            number={2}
            title={steps[1].title}
            status={getProtocolStatus(steps[1])}
            isActive={activeStepNumber === 2}
            showCompleteButton={steps[1].status === 'active'}
            onComplete={() => completeStep(2, 'LVO screening completed')}
            showDeepLearningBadge={isLearningMode}
            pearlCount={STROKE_CLINICAL_PEARLS['step-2']?.deep?.length || 0}
            onDeepLearningClick={() => setStep2ModalOpen(true)}
          >
            <LVOSection 
              isLearningMode={isLearningMode} 
              onCorticalSignsYes={() => setThrombectomyModalOpen(true)}
            />
          </ProtocolSection>

          {isLearningMode && (
            <DeepLearningModal
              isOpen={step2ModalOpen}
              onClose={() => setStep2ModalOpen(false)}
              sectionTitle="2. LVO Screening"
              pearls={STROKE_CLINICAL_PEARLS['step-2']?.deep || []}
            />
          )}

          {/* Thrombectomy Pathway Modal */}
          <ThrombectomyPathwayModal
            isOpen={thrombectomyModalOpen}
            onClose={() => setThrombectomyModalOpen(false)}
            onRecommendation={onThrombectomyRecommendation}
          />
        </div>

        {/* Step 3: Labs */}
        <div id="step-3">
          <ProtocolSection
            number={3}
            title={steps[2].title}
            status={getProtocolStatus(steps[2])}
            isActive={activeStepNumber === 3}
            showCompleteButton={steps[2].status === 'active'}
            onComplete={() => completeStep(3, 'Labs ordered • Vitals checked')}
            showDeepLearningBadge={isLearningMode}
            pearlCount={STROKE_CLINICAL_PEARLS['step-3']?.deep?.length || 0}
            onDeepLearningClick={() => setStep3ModalOpen(true)}
          >
            <LabsAndVitalsSection isLearningMode={isLearningMode} />
          </ProtocolSection>

          {isLearningMode && (
            <DeepLearningModal
              isOpen={step3ModalOpen}
              onClose={() => setStep3ModalOpen(false)}
              sectionTitle="3. Labs & Vitals"
              pearls={STROKE_CLINICAL_PEARLS['step-3']?.deep || []}
            />
          )}
        </div>

        {/* Step 4: Treatment Orders */}
        <div id="step-4">
          <ProtocolSection
            number={4}
            title={steps[3].title}
            status={getProtocolStatus(steps[3])}
            isActive={activeStepNumber === 4}
            showCompleteButton={steps[3].status === 'active'}
            onComplete={() => completeStep(4, 'Orders placed • Post-tPA monitoring active')}
            showDeepLearningBadge={isLearningMode}
            pearlCount={STROKE_CLINICAL_PEARLS['step-4']?.deep?.length || 0}
            onDeepLearningClick={() => setStep4ModalOpen(true)}
          >
            <TreatmentSection isLearningMode={isLearningMode} />
          </ProtocolSection>

          {isLearningMode && (
            <DeepLearningModal
              isOpen={step4ModalOpen}
              onClose={() => setStep4ModalOpen(false)}
              sectionTitle="4. Treatment Orders"
              pearls={STROKE_CLINICAL_PEARLS['step-4']?.deep || []}
            />
          )}
        </div>

        {/* Step 5: Complications */}
        <div id="step-5">
          <ProtocolSection
            number={5}
            title={steps[4].title}
            status={getProtocolStatus(steps[4])}
            isActive={activeStepNumber === 5}
            showCompleteButton={false}
            showDeepLearningBadge={isLearningMode}
            pearlCount={STROKE_CLINICAL_PEARLS['step-5']?.deep?.length || 0}
            onDeepLearningClick={() => setStep5ModalOpen(true)}
          >
            {isLearningMode && (
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500 mb-4">
                <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                  Hemorrhage management protocol for symptomatic intracranial hemorrhage post-thrombolysis.
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 leading-relaxed">
                  <strong>Clinical Context:</strong> Symptomatic ICH (sICH) is the most feared complication of thrombolysis, 
                  occurring in 1-7% of patients. Immediate recognition and management are critical. The ECASS-3 definition 
                  requires neurological deterioration (NIHSS increase ≥4) plus evidence of hemorrhage on imaging. Immediate 
                  reversal of coagulopathy and neurosurgical consultation are mandatory.
                </p>
              </div>
            )}
            <HemorrhageProtocol isLearningMode={isLearningMode || false} />
            <div className="mt-6">
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border-2 border-green-300 dark:border-green-700 text-center mb-4">
                <div className="text-lg font-bold text-green-700 dark:text-green-300 mb-2">
                  ✓ Stroke Code Workflow Complete
                </div>
                <div className="text-sm text-green-600 dark:text-green-400">
                  Continue monitoring patient per protocol. Review complications management as needed.
                </div>
              </div>
              
              {/* Copy to EMR Button */}
              <div className="flex justify-center">
                <button
                  onClick={() => {
                    // Generate comprehensive EMR summary
                    let emrText = `--- STROKE CODE WORKFLOW SUMMARY ---\n`;
                    emrText += `Assessment Date: ${new Date().toLocaleString()}\n\n`;
                    
                    // Step 1: Last Known Well & Eligibility
                    const step1 = steps.find(s => s.id === 1);
                    if (step1?.completionSummary) {
                      emrText += `--- Step 1: Last Known Well & Eligibility ---\n`;
                      emrText += `${step1.completionSummary}\n\n`;
                    }
                    
                    // Step 2: LVO Screening
                    const step2 = steps.find(s => s.id === 2);
                    if (step2?.completionSummary) {
                      emrText += `--- Step 2: LVO Screening ---\n`;
                      emrText += `${step2.completionSummary}\n\n`;
                    }
                    
                    // Step 3: Labs & Vitals
                    const step3 = steps.find(s => s.id === 3);
                    if (step3?.completionSummary) {
                      emrText += `--- Step 3: Labs & Vitals ---\n`;
                      emrText += `${step3.completionSummary}\n\n`;
                    }
                    
                    // Step 4: Treatment Orders
                    const step4 = steps.find(s => s.id === 4);
                    if (step4?.completionSummary) {
                      emrText += `--- Step 4: Treatment Orders ---\n`;
                      emrText += `${step4.completionSummary}\n\n`;
                    }
                    
                    // Step 5: Complications
                    const step5 = steps.find(s => s.id === 5);
                    if (step5?.completionSummary) {
                      emrText += `--- Step 5: Complications ---\n`;
                      emrText += `${step5.completionSummary}\n\n`;
                    }
                    
                    // Thrombectomy Recommendation (if available)
                    if (thrombectomyRecommendation) {
                      emrText += `--- Thrombectomy Pathway Assessment ---\n`;
                      emrText += `Recommendation: ${thrombectomyRecommendation}\n\n`;
                    }
                    
                    emrText += `-------------------------------------\n`;
                    emrText += `Generated by NeuroWiki Stroke Code Workflow\n`;
                    
                    navigator.clipboard.writeText(emrText).then(() => {
                      alert('Workflow summary copied to clipboard!');
                    }).catch(err => {
                      console.error('Failed to copy to EMR:', err);
                      alert('Failed to copy to clipboard');
                    });
                  }}
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-colors shadow-lg flex items-center justify-center gap-2"
                >
                  <Copy size={18} />
                  Copy to EMR
                </button>
              </div>
            </div>
          </ProtocolSection>

          {isLearningMode && (
            <DeepLearningModal
              isOpen={step5ModalOpen}
              onClose={() => setStep5ModalOpen(false)}
              sectionTitle="5. Complications"
              pearls={STROKE_CLINICAL_PEARLS['step-5']?.deep || []}
            />
          )}
        </div>
      </div>

      {/* Bottom Spacing for Mobile */}
      <div className="h-24" />
    </>
  );
};

export default function StrokeBasicsWorkflowV2() {
  const [isLearningMode, setIsLearningMode] = useState(false);
  const [step1ModalOpen, setStep1ModalOpen] = useState(false);
  const [step2ModalOpen, setStep2ModalOpen] = useState(false);
  const [step3ModalOpen, setStep3ModalOpen] = useState(false);
  const [step4ModalOpen, setStep4ModalOpen] = useState(false);
  const [step5ModalOpen, setStep5ModalOpen] = useState(false);
  const [thrombectomyModalOpen, setThrombectomyModalOpen] = useState(false);
  const [thrombectomyRecommendation, setThrombectomyRecommendation] = useState<string | null>(null);
  
  const [steps, setSteps] = useState<Step[]>([
    { id: 1, title: 'Last Known Well & Eligibility', subtitle: 'Treatment window & eligibility assessment', status: 'active', isExpanded: true },
    { id: 2, title: 'LVO Screening', subtitle: 'Large vessel occlusion detection', status: 'locked', isExpanded: false },
    { id: 3, title: 'Labs', subtitle: 'Essential laboratory workup', status: 'locked', isExpanded: false },
    { id: 4, title: 'Treatment Orders', subtitle: 'Post-tPA management', status: 'locked', isExpanded: false },
    { id: 5, title: 'Complications', subtitle: 'Hemorrhage protocol', status: 'locked', isExpanded: false },
  ]);

  // Find the active step (the one that's "active" or in-progress)
  const activeStep = steps.find(s => s.status === 'active') || steps[0];
  const activeStepNumber = activeStep.id;

  const toggleStep = (id: number) => {
    setSteps(prev => prev.map(step => {
      if (step.id === id && step.status !== 'locked') {
        return { ...step, isExpanded: !step.isExpanded };
      }
      return step;
    }));
  };

  const handleThrombectomyRecommendation = (recommendation: string) => {
    setThrombectomyRecommendation(recommendation);
    // Update step 2 completion summary to include the recommendation
    setSteps(prev => prev.map(step => {
      if (step.id === 2) {
        return {
          ...step,
          completionSummary: `LVO screening completed • Thrombectomy recommendation: ${recommendation}`
        };
      }
      return step;
    }));
  };

  const completeStep = (id: number, summary?: string) => {
    setSteps(prev => {
      const newSteps = prev.map(step => {
        if (step.id === id) {
          // If this is step 2 and we have a thrombectomy recommendation, include it
          const finalSummary = (id === 2 && thrombectomyRecommendation && !summary?.includes('Thrombectomy recommendation'))
            ? `${summary || 'LVO screening completed'} • Thrombectomy recommendation: ${thrombectomyRecommendation}`
            : summary;
          return { 
            ...step, 
            status: 'completed' as StepStatus, 
            isExpanded: false,
            completionSummary: finalSummary 
          };
        }
        // Unlock next step
        if (step.id === id + 1) {
          return { ...step, status: 'active' as StepStatus, isExpanded: true };
        }
        return step;
      });
      return newSteps;
    });
    
    // Auto-scroll to next step if it exists - use longer delay to ensure DOM updates
    if (id < 5) {
      scrollToStep(id + 1, 300);
    }
  };

  // Utility function to scroll to a step - works on both web and mobile
  // Scrolls so the bottom of the clock (sticky header) aligns with the top of the next section
  const scrollToStep = (stepId: number, delay: number = 150) => {
    setTimeout(() => {
      const element = document.getElementById(`step-${stepId}`);
      if (element) {
        // Dynamically measure the sticky header height (bottom of clock)
        // Look for the sticky header by data attribute or class
        const stickyHeader = document.querySelector('[data-header-height]') as HTMLElement || 
                            document.querySelector('.sticky.top-0') as HTMLElement;
        let headerOffset = 120; // Default fallback
        
        if (stickyHeader) {
          // Get the actual height of the sticky header (this includes the clock row)
          // Use data attribute if available, otherwise measure directly
          const dataHeight = stickyHeader.getAttribute('data-header-height');
          headerOffset = dataHeight ? parseInt(dataHeight, 10) : stickyHeader.offsetHeight;
        }
        
        // Calculate target scroll position
        const elementRect = element.getBoundingClientRect();
        const currentScrollY = window.pageYOffset || document.documentElement.scrollTop || window.scrollY || 0;
        const elementTop = elementRect.top + currentScrollY;
        // Use the bottom of the clock (header height) as the stop point
        const targetScroll = Math.max(0, elementTop - headerOffset);
        
        // Use requestAnimationFrame for smoother scrolling
        requestAnimationFrame(() => {
          window.scrollTo({
            top: targetScroll,
            behavior: 'smooth'
          });
          
          // Double-check and force scroll if needed (for mobile browsers)
          setTimeout(() => {
            const actualScroll = window.pageYOffset || document.documentElement.scrollTop || 0;
            if (Math.abs(actualScroll - targetScroll) > 100) {
              // Force scroll using scrollIntoView as fallback
              element.scrollIntoView({ behavior: 'smooth', block: 'start' });
              // Adjust for header
              requestAnimationFrame(() => {
                window.scrollBy({ top: -headerOffset, behavior: 'smooth' });
              });
            }
          }, 300);
        });
      }
    }, delay);
  };

  // Handler for step navigation clicks
  const handleStepClick = (stepId: number) => {
    const step = steps.find(s => s.id === stepId);
    if (step && step.status !== 'locked') {
      // Mark this step as active and update others
      setSteps(prev => prev.map(s => ({
        ...s,
        status: s.id === stepId ? 'active' : (s.status === 'active' ? 'completed' : s.status)
      })));
      
      // Scroll to the step section
      scrollToStep(stepId);
    }
  };

  // Convert step status to protocol section status
  const getProtocolStatus = (step: Step): 'in-progress' | 'pending' | 'completed' => {
    if (step.status === 'completed') return 'completed';
    if (step.status === 'active') return 'in-progress';
    return 'pending';
  };

  return (
    <StrokeBasicsLayout
      leftSidebar={null}
      mainContent={
        <MainContent
          isLearningMode={isLearningMode}
          setIsLearningMode={setIsLearningMode}
          steps={steps}
          toggleStep={toggleStep}
          completeStep={completeStep}
          activeStepNumber={activeStepNumber}
          getProtocolStatus={getProtocolStatus}
          handleStepClick={handleStepClick}
          step1ModalOpen={step1ModalOpen}
          setStep1ModalOpen={setStep1ModalOpen}
          step2ModalOpen={step2ModalOpen}
          setStep2ModalOpen={setStep2ModalOpen}
          step3ModalOpen={step3ModalOpen}
          setStep3ModalOpen={setStep3ModalOpen}
          step4ModalOpen={step4ModalOpen}
          setStep4ModalOpen={setStep4ModalOpen}
          step5ModalOpen={step5ModalOpen}
          setStep5ModalOpen={setStep5ModalOpen}
          thrombectomyModalOpen={thrombectomyModalOpen}
          setThrombectomyModalOpen={setThrombectomyModalOpen}
          onThrombectomyRecommendation={handleThrombectomyRecommendation}
          thrombectomyRecommendation={thrombectomyRecommendation}
        />
      }
    />
  );
}
