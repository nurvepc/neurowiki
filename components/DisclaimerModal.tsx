
import React, { useState, useEffect } from 'react';
import { ShieldCheck, LogOut } from 'lucide-react';

const DisclaimerModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if the user has already agreed
    const hasConsented = localStorage.getItem('neurowiki_consent');
    if (!hasConsented) {
      setIsOpen(true);
      // Prevent background scrolling while modal is open
      document.body.style.overflow = 'hidden';
    }
  }, []);

  const handleAgree = () => {
    localStorage.setItem('neurowiki_consent', 'true');
    setIsOpen(false);
    // Restore scrolling
    document.body.style.overflow = 'unset';
  };

  const handleLeave = () => {
    // Redirect away from the site
    window.location.href = 'https://www.google.com';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300">
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-300"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header decoration */}
        <div className="bg-neuro-50 p-6 flex flex-col items-center justify-center border-b border-neuro-100 text-center">
          <div className="bg-white p-3 rounded-full shadow-sm mb-4">
            <ShieldCheck className="text-neuro-600 w-8 h-8" />
          </div>
          <h2 id="modal-title" className="text-xl font-bold text-slate-900">
            Welcome to Neurowiki
          </h2>
          <p className="text-slate-500 text-sm mt-1 font-medium">
            Clinical Decision Support & Education
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 md:p-8 space-y-4 text-slate-600 text-sm md:text-base leading-relaxed">
          <p className="font-semibold text-slate-800">
            Neurowiki is designed to support learning and clinical thinking — not to replace it.
          </p>
          
          <p>
            The information on this site is for educational and informational purposes only and should not be considered medical advice. It’s meant to complement, not substitute, the judgment, training, and experience of qualified healthcare professionals.
          </p>

          <p>
            We work hard to keep content accurate and up to date, but medicine is nuanced. Please verify information and apply clinical judgment before using anything in patient care or decision-making.
          </p>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs md:text-sm text-slate-500">
            By continuing, you acknowledge that Neurowiki is a reference and decision-support tool, and that clinical responsibility always remains with the user.
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row gap-3 justify-end">
          <button
            onClick={handleLeave}
            className="px-5 py-3 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-700 font-medium transition-colors text-sm flex items-center justify-center"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Leave Site
          </button>
          <button
            onClick={handleAgree}
            className="px-6 py-3 rounded-xl bg-neuro-600 hover:bg-neuro-700 text-white font-bold shadow-lg shadow-neuro-200 transition-all transform active:scale-95 text-sm flex-1 sm:flex-none"
          >
            I Agree & Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default DisclaimerModal;
