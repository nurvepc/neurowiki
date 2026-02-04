import React from 'react';
import { Link } from 'react-router-dom';
import { Calculator, X, ChevronRight } from 'lucide-react';

interface Tool {
  name: string;
  description: string;
  path: string;
}

interface QuickToolsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const TOOLS: Tool[] = [
  { name: 'NIHSS Score', description: 'Rapid assessment score', path: '/calculators/nihss' },
  { name: 'ASPECTS Score', description: 'CT early ischemic changes', path: '/guide/stroke-basics' },
  { name: 'Thrombectomy Pathway', description: 'EVT eligibility', path: '/calculators/evt-pathway' },
  { name: 'ABCD2 Score', description: 'TIA risk stratification', path: '#' },
  { name: 'ICH Score', description: 'Hemorrhage prognosis', path: '#' },
];

export const QuickToolsDrawer: React.FC<QuickToolsDrawerProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 rounded-t-2xl shadow-2xl z-50 max-h-[80vh] overflow-hidden animate-slide-up">
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Quick Access Tools
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Tools List */}
        <div className="overflow-y-auto max-h-[calc(80vh-80px)] p-4">
          <div className="space-y-2">
            {TOOLS.map((tool) => (
              <Link
                key={tool.name}
                to={tool.path}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 border border-transparent hover:border-blue-200 dark:hover:border-blue-800 transition-all group"
                onClick={() => {
                  // Store referrer for back navigation
                  sessionStorage.setItem('calculator-referrer', window.location.href);
                  onClose();
                }}
              >
                <div className="flex-1">
                  <div className="text-base font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    {tool.name}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {tool.description}
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
