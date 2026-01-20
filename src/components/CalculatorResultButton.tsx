import React from 'react';
import { trackCalculatorUsed } from '../utils/analytics';

interface CalculatorResultButtonProps {
  calculatorName: string;
  resultValue?: string | number;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
}

/**
 * A button that automatically tracks calculator usage when clicked.
 * 
 * Usage:
 * <CalculatorResultButton
 *   calculatorName="nihss"
 *   resultValue={score}
 *   onClick={handleCalculate}
 * >
 *   Calculate Score
 * </CalculatorResultButton>
 */
export const CalculatorResultButton: React.FC<CalculatorResultButtonProps> = ({
  calculatorName,
  resultValue,
  onClick,
  disabled = false,
  children,
  className = '',
}) => {
  const handleClick = () => {
    onClick(); // Run the actual calculation first
    trackCalculatorUsed(calculatorName, resultValue);
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={className}
    >
      {children}
    </button>
  );
};

export default CalculatorResultButton;
