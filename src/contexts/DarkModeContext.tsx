import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';

interface DarkModeContextType {
  isDark: boolean;
  toggleDarkMode: () => void;
}

const DarkModeContext = createContext<DarkModeContextType | undefined>(undefined);

export function DarkModeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === 'undefined') return false;
    const saved = localStorage.getItem('neurowiki-dark-mode');
    if (saved !== null) {
      const isDarkMode = saved === 'true';
      // Apply immediately on mount
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return isDarkMode;
    }
    // Default to light mode if no preference is saved
    document.documentElement.classList.remove('dark');
    return false;
  });

  // Use ref to track current value for immediate DOM updates
  const isDarkRef = useRef(isDark);
  
  // Keep ref in sync with state
  useEffect(() => {
    isDarkRef.current = isDark;
  }, [isDark]);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('neurowiki-dark-mode', String(isDark));
  }, [isDark]);

  const toggleDarkMode = useCallback(() => {
    setIsDark(prev => {
      const newValue = !prev;
      // Immediately update the DOM for instant feedback
      const root = document.documentElement;
      if (newValue) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
      localStorage.setItem('neurowiki-dark-mode', String(newValue));
      // Update ref immediately
      isDarkRef.current = newValue;
      return newValue;
    });
  }, []);

  return (
    <DarkModeContext.Provider value={{ isDark, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
}

export function useDarkMode() {
  const context = useContext(DarkModeContext);
  if (!context) {
    throw new Error('useDarkMode must be used within DarkModeProvider');
  }
  return context;
}
