import { useCallback, useRef } from 'react';
import { trackCalculatorUsed } from '../utils/analytics';

/**
 * Hook for tracking calculator usage in Google Analytics
 * 
 * Usage in any calculator:
 * 
 * const { trackResult } = useCalculatorAnalytics('nihss');
 * 
 * // Call when user gets a result:
 * trackResult(calculatedScore);
 */
export const useCalculatorAnalytics = (calculatorName: string) => {
  // Prevent duplicate tracking within same session
  const hasTracked = useRef(false);

  const trackResult = useCallback((resultValue?: string | number) => {
    // Only track once per calculator session (prevents double-tracking)
    if (!hasTracked.current) {
      trackCalculatorUsed(calculatorName, resultValue);
      hasTracked.current = true;
    }
  }, [calculatorName]);

  // Reset tracking (call if user wants to recalculate)
  const resetTracking = useCallback(() => {
    hasTracked.current = false;
  }, []);

  return { trackResult, resetTracking };
};

export default useCalculatorAnalytics;
