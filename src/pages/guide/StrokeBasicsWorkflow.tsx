import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calculator, BookOpen, FileText, MessageCircle } from 'lucide-react';
import { SmartTimer } from '../../components/article/stroke/SmartTimer';
import { ProgressTracker } from '../../components/article/stroke/ProgressTracker';
import { WorkflowStep } from '../../components/article/stroke/WorkflowStep';
import { QuickToolsDrawer } from '../../components/article/stroke/QuickToolsDrawer';
import { EligibilityCheckerV2 } from '../../components/article/stroke/EligibilityCheckerV2';
import { LVOScreenerV2 } from '../../components/article/stroke/LVOScreenerV2';
import { VitalsInputV2 } from '../../components/article/stroke/VitalsInputV2';
import { PostTPAOrders } from '../../components/article/stroke/PostTPAOrders';
import { HemorrhageProtocol } from '../../components/article/stroke/HemorrhageProtocol';

type StepStatus = 'completed' | 'active' | 'locked';

interface Step {
  id: number;
  title: string;
  subtitle: string;
  status: StepStatus;
  isExpanded: boolean;
  completionSummary?: string;
}

export default function StrokeBasicsWorkflow() {
  const [isLearningMode, setIsLearningMode] = useState(false);
  const [isToolsDrawerOpen, setIsToolsDrawerOpen] = useState(false);
  
  const [steps, setSteps] = useState<Step[]>([
    { id: 1, title: 'Last Known Well', subtitle: 'Establish treatment window & contraindications', status: 'active', isExpanded: true },
    { id: 2, title: 'LVO Screening', subtitle: 'Assess for large vessel occlusion', status: 'locked', isExpanded: false },
    { id: 3, title: 'Vital Signs', subtitle: 'Check glucose and blood pressure', status: 'locked', isExpanded: false },
    { id: 4, title: 'Treatment Orders', subtitle: 'Post-tPA management checklist', status: 'locked', isExpanded: false },
    { id: 5, title: 'Complications', subtitle: 'Hemorrhage management protocol', status: 'locked', isExpanded: false },
  ]);

  const completedSteps = steps.filter(s => s.status === 'completed').length;
  const currentStep = steps.findIndex(s => s.status === 'active') + 1 || steps.length;

  const toggleStep = (id: number) => {
    setSteps(prev => prev.map(step => {
      if (step.id === id && step.status !== 'locked') {
        return { ...step, isExpanded: !step.isExpanded };
      }
      return step;
    }));
  };

  const completeStep = (id: number, summary?: string) => {
    setSteps(prev => {
      const newSteps = prev.map(step => {
        if (step.id === id) {
          return { 
            ...step, 
            status: 'completed' as StepStatus, 
            isExpanded: false,
            completionSummary: summary 
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
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
      {/* Compact Timer */}
      <SmartTimer />

      {/* Progress Bar */}
      <ProgressTracker
        totalSteps={steps.length}
        completedSteps={completedSteps}
        currentStep={currentStep}
      />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-3xl font-black text-gray-900 dark:text-white">
                Stroke Code Basics
              </h1>
              <button
                onClick={() => setIsLearningMode(!isLearningMode)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-colors ${
                  isLearningMode
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                Learning {isLearningMode ? 'ON' : 'OFF'}
              </button>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Real-time emergency decision support • Complete each step sequentially
            </p>
          </div>

          {/* Workflow Steps */}
          <div className="space-y-4">
            {/* Step 1: Last Known Well */}
            <WorkflowStep
              number={1}
              title={steps[0].title}
              subtitle={steps[0].subtitle}
              status={steps[0].status}
              isExpanded={steps[0].isExpanded}
              onToggle={() => toggleStep(1)}
              completionSummary={steps[0].completionSummary}
            >
              <EligibilityCheckerV2 />
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => completeStep(1, 'LKW established • Treatment window confirmed')}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold transition-colors"
                >
                  Mark Complete & Continue →
                </button>
              </div>
            </WorkflowStep>

            {/* Step 2: LVO Screening */}
            <WorkflowStep
              number={2}
              title={steps[1].title}
              subtitle={steps[1].subtitle}
              status={steps[1].status}
              isExpanded={steps[1].isExpanded}
              onToggle={() => toggleStep(2)}
              completionSummary={steps[1].completionSummary}
            >
              <LVOScreenerV2 />
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => completeStep(2, 'LVO screening completed')}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold transition-colors"
                >
                  Mark Complete & Continue →
                </button>
              </div>
            </WorkflowStep>

            {/* Step 3: Vital Signs */}
            <WorkflowStep
              number={3}
              title={steps[2].title}
              subtitle={steps[2].subtitle}
              status={steps[2].status}
              isExpanded={steps[2].isExpanded}
              onToggle={() => toggleStep(3)}
              completionSummary={steps[2].completionSummary}
            >
              <VitalsInputV2 />
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => completeStep(3, 'Vitals checked • BP & glucose controlled')}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold transition-colors"
                >
                  Mark Complete & Continue →
                </button>
              </div>
            </WorkflowStep>

            {/* Step 4: Treatment Orders */}
            <WorkflowStep
              number={4}
              title={steps[3].title}
              subtitle={steps[3].subtitle}
              status={steps[3].status}
              isExpanded={steps[3].isExpanded}
              onToggle={() => toggleStep(4)}
              completionSummary={steps[3].completionSummary}
            >
              <PostTPAOrders />
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => completeStep(4, 'Orders placed • Post-tPA monitoring active')}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold transition-colors"
                >
                  Mark Complete & Continue →
                </button>
              </div>
            </WorkflowStep>

            {/* Step 5: Complications Protocol */}
            <WorkflowStep
              number={5}
              title={steps[4].title}
              subtitle={steps[4].subtitle}
              status={steps[4].status}
              isExpanded={steps[4].isExpanded}
              onToggle={() => toggleStep(5)}
              completionSummary={steps[4].completionSummary}
            >
              <HemorrhageProtocol />
              <div className="mt-4">
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border-2 border-green-300 dark:border-green-700 text-center">
                  <div className="text-lg font-bold text-green-700 dark:text-green-300 mb-2">
                    ✓ Stroke Code Workflow Complete
                  </div>
                  <div className="text-sm text-green-600 dark:text-green-400">
                    Continue monitoring patient per protocol. Review complications management as needed.
                  </div>
                </div>
              </div>
            </WorkflowStep>
          </div>

          {/* Bottom Spacing for Mobile */}
          <div className="h-24" />
        </div>
      </main>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 z-40 safe-area-pb">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <button
            onClick={() => setIsToolsDrawerOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-sm transition-colors"
          >
            <Calculator className="w-4 h-4" />
            Quick Tools
          </button>

          <div className="flex items-center gap-2">
            <Link
              to="#"
              className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-semibold text-sm transition-colors"
            >
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Protocol</span>
            </Link>
            
            <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-semibold text-sm transition-colors">
              <MessageCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Feedback</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Tools Drawer */}
      <QuickToolsDrawer
        isOpen={isToolsDrawerOpen}
        onClose={() => setIsToolsDrawerOpen(false)}
      />
    </div>
  );
}
