# Calculator Development Guidelines

## Analytics Tracking

All calculators MUST include analytics tracking. This is how:

### Step 1: Import the hook
```typescript
import { useCalculatorAnalytics } from '../src/hooks/useCalculatorAnalytics';
```

### Step 2: Initialize with calculator name
```typescript
const { trackResult } = useCalculatorAnalytics('your_calculator_name');
```

Use lowercase with underscores: `nihss`, `gca_pathway`, `my_new_calculator`

### Step 3: Track when result is calculated
```typescript
const handleCalculate = () => {
  const result = calculateResult();
  trackResult(result); // <-- Add this line
};
```

That's it! The hook handles everything else.

## Calculator Naming Convention

Use lowercase with underscores:
- ✅ `nihss`
- ✅ `gca_pathway`
- ✅ `status_epilepticus`
- ❌ `NIHSS` (no uppercase)
- ❌ `gca-pathway` (use underscores, not hyphens)

## Examples

### Simple Calculator (with result state)
```typescript
const MyCalculator = () => {
  const { trackResult } = useCalculatorAnalytics('my_calculator');
  const [result, setResult] = useState<number | null>(null);

  useEffect(() => {
    const calculated = doCalculation();
    setResult(calculated);
    if (calculated !== null) {
      trackResult(calculated);
    }
  }, [inputs, trackResult]);

  return <div>Result: {result}</div>;
};
```

### Pathway Calculator (step-based)
```typescript
const MyPathway = () => {
  const { trackResult } = useCalculatorAnalytics('my_pathway');
  const [step, setStep] = useState(1);

  // Track when reaching final step
  useEffect(() => {
    if (step === 4) { // final step
      trackResult('completed');
    }
  }, [step, trackResult]);

  return <div>Step {step}</div>;
};
```

## Future Calculator Workflow

When creating a NEW calculator, always include analytics tracking using the `useCalculatorAnalytics` hook. This ensures all calculator usage is automatically tracked in Google Analytics without additional work.
