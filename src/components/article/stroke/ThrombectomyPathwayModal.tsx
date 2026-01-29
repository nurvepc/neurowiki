import React, { useState, useEffect } from 'react';
import { X, ArrowLeft } from 'lucide-react';
import EvtPathway from '../../../pages/EvtPathway';

interface ThrombectomyPathwayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRecommendation?: (recommendation: string) => void;
}

export const ThrombectomyPathwayModal: React.FC<ThrombectomyPathwayModalProps> = ({
  isOpen,
  onClose,
  onRecommendation,
}) => {
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

  const handleResultChange = (result: any) => {
    if (result && onRecommendation) {
      // Format the recommendation string
      const recommendation = `${result.status}${result.criteriaName ? ` (${result.criteriaName})` : ''}: ${result.reason}`;
      onRecommendation(recommendation);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-6xl max-h-[95vh] bg-white dark:bg-gray-900 rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Thrombectomy Pathway</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Modal Content - EvtPathway Component */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 pb-8">
            <EvtPathway 
              hideHeader={true}
              isInModal={true}
              onResultChange={handleResultChange}
              customActionButton={{
                label: 'Return to Stroke Workflow',
                onClick: onClose,
                icon: <ArrowLeft size={16} className="mr-2" />
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
