import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calculator, Home, FileText, TestTube, Star } from 'lucide-react';
import { SmartTimer } from '../../components/article/stroke/SmartTimer';
import { EligibilityCheckerV2 } from '../../components/article/stroke/EligibilityCheckerV2';
import { LVOScreenerV2 } from '../../components/article/stroke/LVOScreenerV2';
import { VitalsInputV2 } from '../../components/article/stroke/VitalsInputV2';
import { PostTPAOrders } from '../../components/article/stroke/PostTPAOrders';
import { HemorrhageProtocol } from '../../components/article/stroke/HemorrhageProtocol';

type Tab = 'workflow' | 'vitals' | 'orders';

export default function StrokeBasicsMobile() {
  const [activeTab, setActiveTab] = useState<Tab>('workflow');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
      {/* Sticky Timer */}
      <SmartTimer />

      {/* Tab Navigation */}
      <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-[73px] z-30">
        <div className="flex">
          {[
            { id: 'workflow', label: 'Workflow' },
            { id: 'vitals', label: 'Vitals' },
            { id: 'orders', label: 'Orders' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 dark:text-gray-400'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Content */}
      <main className="flex-1 overflow-y-auto p-4 pb-24 space-y-4">
        {activeTab === 'workflow' && (
          <>
            <EligibilityCheckerV2 />
            <LVOScreenerV2 />
          </>
        )}
        
        {activeTab === 'vitals' && (
          <VitalsInputV2 />
        )}
        
        {activeTab === 'orders' && (
          <>
            <PostTPAOrders />
            <HemorrhageProtocol />
          </>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 z-40 safe-area-pb">
        <div className="flex justify-around py-2">
          {[
            { icon: Home, label: 'Home', path: '/' },
            { icon: TestTube, label: 'Guide', path: '/guide' },
            { icon: FileText, label: 'Trials', path: '/trials' },
            { icon: Calculator, label: 'Calcs', path: '/calculators' },
            { icon: Star, label: 'Favorites', path: '/calculators?favorites=true' },
          ].map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className="flex flex-col items-center gap-1 px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
