# Medical Tooltip System Documentation

## Overview

The Medical Tooltip System provides inline definitions for medical terms throughout NeuroWiki. It consists of reusable components and utilities that automatically detect and wrap medical terms with informative tooltips.

## Components

### 1. MedicalTooltip Component

**Location:** `src/components/MedicalTooltip.tsx`

**Usage:**
```tsx
import { MedicalTooltip } from '../components/MedicalTooltip';

<MedicalTooltip 
  term="p-Value" 
  definition="Probability the result occurred by chance..." 
/>
```

**Features:**
- Info icon (ℹ️) appears inline with text
- Hover on desktop, tap on mobile
- Dark mode support
- Accessible (ARIA labels)
- Click outside or Escape key to close

### 2. Medical Glossary

**Location:** `src/data/medicalGlossary.ts`

**Adding New Terms:**

1. Open `src/data/medicalGlossary.ts`
2. Add entry to `MEDICAL_GLOSSARY` object:
```typescript
'new-term': 'Definition text here. Keep it concise (1-2 sentences).',
```

3. Use kebab-case for keys (e.g., `'p-value'`, `'odds-ratio'`)
4. Include common variations:
```typescript
'p-value': 'Definition...',
'p value': 'Definition...',  // Space variation
'pvalue': 'Definition...',   // No space variation
```

**Term Categories:**
- Statistical measures (p-value, OR, CI, NNT, HR)
- Outcome measures (mRS, NIHSS, sample size)
- Safety outcomes (sICH, PH2, hemorrhagic transformation)
- Trial design (RCT, double-blind, placebo-controlled)
- Imaging terms (ASPECTS, DWI-FLAIR mismatch, CTP)
- Stroke-specific (LVO, LKW, TICI, wake-up stroke)
- Treatments (Alteplase, Thrombectomy, DAPT)

### 3. Auto-Detection Utility

**Location:** `src/utils/addTooltips.tsx`

**Usage:**
```tsx
import { addTooltips } from '../utils/addTooltips';

const content = "The p-value was 0.02 with an odds ratio of 1.61";
const withTooltips = addTooltips(content);
// Returns: React elements with tooltips embedded
```

**How It Works:**
1. Scans text for medical terms from glossary
2. Case-insensitive matching
3. Handles punctuation (removes trailing punctuation for matching)
4. Skips terms inside links or code blocks
5. Returns React elements with tooltips embedded

**Manual Tooltip:**
```tsx
import { wrapTermWithTooltip } from '../utils/addTooltips';

{wrapTermWithTooltip('p-value', 'The p-value')}
```

### 4. TrialStats Component

**Location:** `src/components/TrialStats.tsx`

**Usage:**
```tsx
import { TrialStats } from '../components/TrialStats';

<TrialStats
  sampleSize="503"
  sampleSizeLabel="Randomized Patients"
  primaryEndpoint="mRS 0-1"
  primaryEndpointLabel="at 90 Days"
  pValue="0.02"
  pValueLabel="Statistically Sig."
  effectSize="11.5%"
  effectSizeLabel="Absolute Increase"
/>
```

**Features:**
- Pre-built stats cards with tooltips
- All 4 stats have built-in tooltips
- Consistent styling
- Dark mode support

## Integration Examples

### In Trial Pages

**Stats Cards:**
```tsx
import { TrialStats } from '../../components/TrialStats';

{stats && (
  <TrialStats
    sampleSize={stats.sampleSize}
    primaryEndpoint={stats.primaryEndpoint}
    pValue={stats.pValue}
    effectSize={stats.effectSize}
  />
)}
```

**Text Content:**
```tsx
import { addTooltips } from '../../utils/addTooltips';

<p>{addTooltips(trialMetadata.clinicalContext)}</p>
```

**Markdown Content:**
```tsx
<ReactMarkdown
  components={{
    p: ({node, children, ...props}) => (
      <p {...props}>
        {typeof children === 'string' ? addTooltips(children) : children}
      </p>
    ),
  }}
>
  {content}
</ReactMarkdown>
```

### Manual Tooltip Insertion

```tsx
import { MedicalTooltip } from '../components/MedicalTooltip';
import { MEDICAL_GLOSSARY } from '../data/medicalGlossary';

<span>
  The 
  <MedicalTooltip 
    term="p-value" 
    definition={MEDICAL_GLOSSARY['p-value']} 
  />
  was significant.
</span>
```

## Best Practices

1. **Use Auto-Detection When Possible:**
   - Prefer `addTooltips()` for large text blocks
   - Automatically finds and wraps terms
   - Less manual work

2. **Manual Tooltips for Important Terms:**
   - Use `MedicalTooltip` directly for key concepts
   - Ensures important terms always have tooltips
   - Better control over placement

3. **Keep Definitions Concise:**
   - 1-2 sentences maximum
   - Plain language when possible
   - Focus on practical meaning

4. **Test on Mobile:**
   - Tooltips work on tap (mobile)
   - Ensure touch targets are large enough
   - Test in both light and dark mode

5. **Don't Overuse:**
   - Not every term needs a tooltip
   - Focus on technical/statistical terms
   - Avoid tooltips on common words

## Future Enhancements

- [ ] Add more terms to glossary
- [ ] Support for abbreviations (e.g., "tPA" → "tissue plasminogen activator")
- [ ] Tooltip analytics (track which terms are clicked most)
- [ ] User preferences (show/hide tooltips)
- [ ] Multi-language support

## Files Created

1. `src/components/MedicalTooltip.tsx` - Core tooltip component
2. `src/data/medicalGlossary.ts` - Medical terms dictionary
3. `src/utils/addTooltips.tsx` - Auto-detection utility
4. `src/components/TrialStats.tsx` - Stats cards with tooltips
5. `docs/TOOLTIP_SYSTEM.md` - This documentation

## Integration Status

✅ TrialPageNew component
✅ Stats cards (TrialStats component)
✅ Clinical Context section
✅ Clinical Pearls section
✅ Conclusion section
✅ Markdown content rendering
✅ Sidebar stats

## Examples

See `src/pages/trials/TrialPageNew.tsx` for complete integration examples.
