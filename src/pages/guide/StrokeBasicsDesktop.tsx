import React from 'react';
import { Link } from 'react-router-dom';
import { Calculator, FileText, MessageCircle } from 'lucide-react';
import { SmartTimer } from '../../components/article/stroke/SmartTimer';
import { EligibilityCheckerV2 } from '../../components/article/stroke/EligibilityCheckerV2';
import { LVOScreenerV2 } from '../../components/article/stroke/LVOScreenerV2';
import { VitalsInputV2 } from '../../components/article/stroke/VitalsInputV2';
import { PostTPAOrders } from '../../components/article/stroke/PostTPAOrders';
import { HemorrhageProtocol } from '../../components/article/stroke/HemorrhageProtocol';

export default function StrokeBasicsDesktop() {
  const relatedCalculators = [
    { name: 'NIHSS Score', path: '/calculators/nihss', description: 'Rapid assessment score', icon: Calculator },
    { name: 'ASPECTS Score', path: '/guide/stroke-basics', description: 'CT early ischemic changes', icon: Calculator },
    { name: 'Thrombectomy Pathway', path: '/calculators/evt-pathway', description: 'EVT eligibility', icon: Calculator },
    { name: 'ABCD2 Score', path: '#', description: 'TIA risk stratification', icon: Calculator },
    { name: 'ICH Score', path: '#', description: 'Hemorrhage prognosis', icon: Calculator },
  ];

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen">
      {/* Sticky Timer */}
      <div className="sticky top-0 z-50">
        <SmartTimer />
      </div>

      <main className="max-w-[1400px] mx-auto px-6 py-6">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">
            Stroke Code Basics
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Real-time emergency decision support and monitoring
          </p>
        </div>

        <div className="flex gap-6 items-start">
          {/* Main Content */}
          <div className="flex-1 space-y-6">
            {/* Row 1: Eligibility + LVO */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <EligibilityCheckerV2 />
              <LVOScreenerV2 />
            </div>

            {/* Row 2: Vitals */}
            <VitalsInputV2 />

            {/* Row 3: Orders */}
            <PostTPAOrders />

            {/* Row 4: Hemorrhage */}
            <HemorrhageProtocol />
          </div>

          {/* Sidebar */}
          <aside className="w-80 sticky top-[73px] space-y-4">
            {/* Related Calculators */}
            <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
              <div className="flex items-center gap-2 mb-4">
                <Calculator className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                  Related Calculators
                </h3>
              </div>
              
              <div className="space-y-2">
                {relatedCalculators.map(calc => (
                  <Link
                    key={calc.name}
                    to={calc.path}
                    className="block p-3 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 border border-transparent hover:border-blue-200 dark:hover:border-blue-800 transition-all group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                          {calc.name}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          {calc.description}
                        </div>
                      </div>
                      <span className="text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 ml-2">›</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Protocol Reference */}
            <div className="bg-blue-600 rounded-lg p-4 text-white relative overflow-hidden">
              <div className="absolute -right-6 -bottom-6 opacity-10">
                <FileText className="w-32 h-32" />
              </div>
              <div className="relative">
                <h3 className="text-base font-bold mb-2">Protocol Reference</h3>
                <p className="text-xs opacity-90 mb-4 leading-relaxed">
                  View institutional guidelines for Stroke Code activation and bypass.
                </p>
                <button className="w-full py-2 bg-white text-blue-600 font-bold rounded-lg text-sm hover:bg-gray-100 transition-colors">
                  OPEN PROTOCOL PDF
                </button>
              </div>
            </div>

            {/* Feedback */}
            <button className="w-full flex items-center justify-center gap-2 p-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm font-medium text-gray-700 dark:text-gray-300">
              <MessageCircle className="w-4 h-4" />
              Feedback
            </button>
          </aside>
        </div>
      </main>
    </div>
  );
}
