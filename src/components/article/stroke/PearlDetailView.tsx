import React from 'react';
import { X, ArrowLeft, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { ClinicalPearl } from '../../../data/strokeClinicalPearls';
import { TrialEmbed } from './TrialEmbed';

interface PearlDetailViewProps {
  pearl: ClinicalPearl;
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
}

export const PearlDetailView: React.FC<PearlDetailViewProps> = ({
  pearl,
  isOpen,
  onClose,
  onBack,
}) => {
  // Close on escape key
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
    }
    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isLinkedTrial = pearl.type === 'trial' && pearl.trialSlug;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 z-[60]"
        onClick={onBack}
      />

      {/* Modal Container - Centered with Flexbox */}
      <div className="fixed inset-0 z-[70] overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 sm:p-6 md:p-8">
          {/* Modal Content */}
          <div 
            className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-white dark:bg-gray-900 border-b-2 border-purple-200 dark:border-purple-800 p-4 sm:p-6 flex-shrink-0 rounded-t-2xl">
              {/* Back and Close Buttons */}
              <div className="flex items-center justify-between mb-3">
                <button
                  onClick={onBack}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Pearls</span>
                </button>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  aria-label="Close all"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Title and Badge */}
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  {pearl.title}
                </h3>
                <span className={`px-3 py-1 text-sm font-semibold rounded-full flex-shrink-0 ${
                  pearl.type === 'trial'
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                    : 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                }`}>
                  {pearl.type === 'trial' ? 'TRIAL' : 'PEARL'}
                </span>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              {isLinkedTrial ? (
                <TrialEmbed trialSlug={pearl.trialSlug!} />
              ) : (
                /* Regular pearl content - keep existing code */
                <>
                  {pearl.detailedContent ? (
                    <>
                      {/* Overview Section */}
                      {pearl.detailedContent.overview && (
                        <div className="mb-6">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-2xl">📖</span>
                            <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                              Overview
                            </h4>
                          </div>
                          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500">
                            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                              {pearl.detailedContent.overview}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Clinical Tips Section */}
                      {pearl.detailedContent.clinicalTips && pearl.detailedContent.clinicalTips.length > 0 && (
                        <div className="mb-6">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-2xl">💡</span>
                            <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                              Clinical Tips
                            </h4>
                          </div>
                          <div className="space-y-2">
                            {pearl.detailedContent.clinicalTips.map((tip, index) => (
                              <div
                                key={index}
                                className="flex gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg"
                              >
                                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-bold">
                                  {index + 1}
                                </div>
                                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                  {tip}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Evidence Section */}
                      {pearl.detailedContent.evidence && (
                        <div className="mb-6">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-2xl">📚</span>
                            <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                              Evidence
                            </h4>
                          </div>
                          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                              {pearl.detailedContent.evidence}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Reference Section */}
                      {pearl.detailedContent.reference && (
                        <div className="mb-6">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-2xl">🔗</span>
                            <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                              Reference
                            </h4>
                          </div>
                          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                              {pearl.detailedContent.reference}
                            </p>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    /* Fallback if no detailed content */
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        {pearl.content}
                      </p>
                      {pearl.evidence && (
                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            <span className="font-semibold">Evidence:</span> {pearl.evidence}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 bg-gradient-to-t from-white dark:from-gray-900 to-transparent border-t border-gray-200 dark:border-gray-800 flex-shrink-0 rounded-b-2xl">
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                Evidence-based clinical guidance
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
