import React, { createContext, useContext, useState, ReactNode } from 'react';

interface TrialModalContextType {
  isOpen: boolean;
  trialSlug: string | null;
  openTrial: (slug: string) => void;
  closeTrial: () => void;
}

const TrialModalContext = createContext<TrialModalContextType | undefined>(undefined);

export const TrialModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [trialSlug, setTrialSlug] = useState<string | null>(null);

  const openTrial = (slug: string) => {
    // Remove /trials/ prefix if present (normalize slug format)
    const normalizedSlug = slug.replace('/trials/', '').replace(/^\//, '');
    setTrialSlug(normalizedSlug);
    setIsOpen(true);
  };

  const closeTrial = () => {
    setIsOpen(false);
    // Delay clearing slug to allow exit animation
    setTimeout(() => setTrialSlug(null), 300);
  };

  return (
    <TrialModalContext.Provider value={{ isOpen, trialSlug, openTrial, closeTrial }}>
      {children}
    </TrialModalContext.Provider>
  );
};

export const useTrialModal = () => {
  const context = useContext(TrialModalContext);
  if (!context) {
    throw new Error('useTrialModal must be used within TrialModalProvider');
  }
  return context;
};
