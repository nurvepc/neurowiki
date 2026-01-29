import React from 'react';
import { X, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { ClinicalPearl } from '../../../data/strokeClinicalPearls';
import { PearlDetailView } from './PearlDetailView';

interface DeepLearningModalProps {
  isOpen: boolean;
  onClose: () => void;
  sectionTitle: string;
  pearls: ClinicalPearl[];
}

export const DeepLearningModal: React.FC<DeepLearningModalProps> = ({
  isOpen,
  onClose,
  sectionTitle,
  pearls,
}) => {
  // State to track expanded pearl
  const [expandedPearlId, setExpandedPearlId] = React.useState<string | null>(null);

  // Handler to close expanded view
  const handleBackToPearls = () => {
    setExpandedPearlId(null);
  };

  // Reset expanded pearl when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setExpandedPearlId(null);
    }
  }, [isOpen]);

  // Close on escape key
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setExpandedPearlId(null);
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const expandedPearl = expandedPearlId ? pearls.find(p => p.id === expandedPearlId) : null;

  return (
    <>
      {/* Main Pearl List Modal */}
      <div
        className="fixed inset-0 bg-black/40 z-40 transition-opacity"
        onClick={onClose}
      />

      <div className="fixed bg-white dark:bg-gray-900 shadow-2xl z-50 lg:top-0 lg:right-0 lg:h-screen lg:w-[400px] bottom-0 left-0 right-0 h-[90vh] lg:h-screen rounded-t-2xl lg:rounded-none overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b-2 border-purple-200 dark:border-purple-800 p-4 z-10">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>

          <div className="pr-12">
            <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              🔬 Deep Learning
            </h3>
            <p className="text-sm font-bold text-gray-900 dark:text-white mt-1">
              {sectionTitle}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {pearls.length} {pearls.length === 1 ? 'pearl' : 'pearls'} • Evidence-based
            </p>
          </div>
        </div>

        {/* Pearl List - Always visible in this modal */}
        <div className="overflow-y-auto h-full pb-20 p-4">
          <div className="space-y-3">
            {pearls.map((pearl) => (
              <button
                key={pearl.id}
                onClick={() => setExpandedPearlId(pearl.id)}
                className="w-full text-left p-4 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 rounded-lg border border-purple-200 dark:border-purple-800 hover:shadow-md transition-all hover:scale-[1.01] cursor-pointer"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                    {pearl.title}
                  </h4>
                  <span className={`px-2 py-0.5 text-xs font-semibold rounded flex-shrink-0 ${
                    pearl.type === 'trial'
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                      : 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                  }`}>
                    {pearl.type === 'trial' ? 'TRIAL' : 'PEARL'}
                  </span>
                </div>

                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed line-clamp-3">
                  {pearl.content}
                </p>

                <div className="mt-3 flex items-center gap-2 text-xs text-purple-600 dark:text-purple-400 font-medium">
                  <span>Tap to expand</span>
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Pearl Detail Modal - Renders on top when pearl is expanded */}
      {expandedPearl && (
        <PearlDetailView
          pearl={expandedPearl}
          isOpen={!!expandedPearlId}
          onClose={onClose}
          onBack={handleBackToPearls}
        />
      )}
    </>
  );
};
