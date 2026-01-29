import React from 'react';
import { Link } from 'react-router-dom';
import { Calculator, Syringe, Activity, Phone } from 'lucide-react';

interface Tool {
  id: string;
  name: string;
  icon: React.ReactNode;
  path: string;
  description: string;
}

const TOOLS: Tool[] = [
  {
    id: 'nihss',
    name: 'NIHSS Calc',
    icon: <Calculator className="w-5 h-5" />,
    path: '/calculators/nihss',
    description: 'Rapid assessment score',
  },
  {
    id: 'tpa-dosing',
    name: 'tPA Dosing',
    icon: <Syringe className="w-5 h-5" />,
    path: '/calculators/tpa-dosing',
    description: 'Thrombolytic dosing calculator',
  },
  {
    id: 'vitals-log',
    name: 'Vitals Log',
    icon: <Activity className="w-5 h-5" />,
    path: '#',
    description: 'Track vital signs',
  },
  {
    id: 'consults',
    name: 'Consults',
    icon: <Phone className="w-5 h-5" />,
    path: '#',
    description: 'Contact specialists',
  },
];

export const QuickToolsGrid: React.FC = () => {
  const handleToolClick = (tool: Tool) => {
    if (tool.path === '#') {
      // Placeholder - could open modal or show coming soon
      return;
    }
    // Store referrer for back navigation
    sessionStorage.setItem('calculator-referrer', window.location.href);
  };

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4 space-y-3">
      {/* Header */}
      <h3 className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
        Quick Tools
      </h3>

      {/* Tools Grid (2x2) */}
      <div className="grid grid-cols-2 gap-2">
        {TOOLS.map((tool) => {
          const content = (
            <div
              onClick={() => handleToolClick(tool)}
              className={`flex flex-col items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all ${
                tool.path === '#'
                  ? 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 cursor-not-allowed opacity-60'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer'
              }`}
            >
              <div className={`${tool.path === '#' ? 'text-gray-400 dark:text-gray-600' : 'text-blue-600 dark:text-blue-400'}`}>
                {tool.icon}
              </div>
              <span className={`text-xs font-medium text-center ${tool.path === '#' ? 'text-gray-400 dark:text-gray-600' : 'text-gray-700 dark:text-gray-300'}`}>
                {tool.name}
              </span>
            </div>
          );

          if (tool.path === '#') {
            return <div key={tool.id}>{content}</div>;
          }

          return (
            <Link
              key={tool.id}
              to={tool.path}
              onClick={() => handleToolClick(tool)}
              className="block"
            >
              {content}
            </Link>
          );
        })}
      </div>
    </div>
  );
};
