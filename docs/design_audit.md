# Neurowiki Design Audit

**Date:** January 2026  
**Auditor:** Senior UI/UX Designer & Frontend Architect  
**Scope:** Complete codebase analysis for mobile responsiveness, visual hierarchy, and design consistency

---

## Executive Summary

Neurowiki demonstrates **good mobile-first thinking** with responsive breakpoints (`md:`, `lg:`) used throughout. The design system uses a consistent color palette (neuro blue) and Inter font family. However, there are **critical issues with arbitrary sizing values**, inconsistent typography scales, and some mobile layout problems with fixed bottom action bars overlapping content. The overall structure is solid but needs standardization of spacing, typography, and touch target sizes.

**Overall Grade:** B+ (Good foundation, needs refinement)

---

## Critical Issues (Top 5)

### Issue 1: Arbitrary Text Sizes Breaking Typography Scale
- **Location:** Multiple files (`Layout.tsx`, `GCAPathway.tsx`, `StatusEpilepticusPathway.tsx`, `AspectsCalculator.tsx`)
- **Problem:** Extensive use of arbitrary text sizes like `text-[10px]` instead of Tailwind's typography scale. This creates:
  - Inconsistent visual hierarchy
  - Poor accessibility (10px is below WCAG minimum readable size)
  - Maintenance difficulty (hard to update globally)
- **Mobile Impact:** Text becomes unreadable on small screens without zooming. Users with visual impairments cannot read step labels, build numbers, and navigation text.
- **Suggested Fix:** 
  - Replace `text-[10px]` with `text-xs` (12px) minimum
  - Create a typography scale in `tailwind.config.js` with custom sizes if needed
  - Use semantic sizes: `text-xs`, `text-sm`, `text-base`, `text-lg`, etc.

**Files Affected:**
- `components/Layout.tsx` (line 122, 218): Build version and mobile nav labels
- `pages/GCAPathway.tsx` (line 362): Step labels
- `pages/StatusEpilepticusPathway.tsx` (line 190): Step labels  
- `pages/MigrainePathway.tsx` (line 326): Step labels
- `pages/AspectsCalculator.tsx` (line 101): Score label

---

### Issue 2: Fixed Bottom Action Bars Overlapping Content on Mobile
- **Location:** All pathway calculators (`EvtPathway.tsx`, `GCAPathway.tsx`, `MigrainePathway.tsx`, `StatusEpilepticusPathway.tsx`)
- **Problem:** Fixed bottom action bars (`fixed bottom-[4.5rem]`) are positioned above the mobile bottom nav (4.5rem height), but content padding (`pb-32`) may not be sufficient. This causes:
  - Action buttons covering important content
  - Users unable to scroll to see final inputs/results
  - Inconsistent spacing between different pathway pages
- **Mobile Impact:** Critical - users cannot access all content or action buttons may be hidden behind keyboard on iOS.
- **Suggested Fix:**
  - Standardize bottom padding: Use `pb-40` or `pb-safe` consistently
  - Add `scroll-margin-bottom` to last content sections
  - Consider using `sticky` instead of `fixed` for better scroll behavior
  - Test on actual devices (especially iOS Safari with keyboard)

**Example Problem Pattern:**
```tsx
// Current (problematic):
<div className="pb-32 md:pb-20"> {/* Content */}
<div className="fixed bottom-[4.5rem] ..."> {/* Action bar */}

// Should be:
<div className="pb-40 md:pb-20 safe-area-bottom"> {/* More padding */}
<div className="fixed bottom-[4.5rem] safe-area-bottom ..."> {/* Action bar */}
```

---

### Issue 3: Inconsistent Touch Target Sizes
- **Location:** Multiple components, especially `Home.tsx` and calculator buttons
- **Problem:** Some interactive elements are below the 44px minimum touch target:
  - Back buttons: `p-2` = 32px (too small)
  - Icon buttons: `p-1.5` = 24px (too small)
  - Quick tool links: `px-4 py-2.5` = ~40px height (borderline)
- **Mobile Impact:** Users struggle to tap buttons accurately, leading to frustration and accidental clicks.
- **Suggested Fix:**
  - Enforce minimum `min-h-[44px]` or `p-3` (48px) for all interactive elements
  - Use `touch-manipulation` class (already present, good!)
  - Add `active:scale-95` for visual feedback (already present in some places)
  - Create a reusable button component with guaranteed touch target size

**WCAG 2.5.5 Target Size (Level AAA):** Touch targets should be at least 44x44 CSS pixels.

---

### Issue 4: Typography Scale Inconsistencies
- **Location:** Throughout codebase
- **Problem:** No standardized typography scale. Mix of:
  - Standard Tailwind: `text-sm`, `text-base`, `text-lg`, `text-xl`, `text-2xl`, `text-3xl`, `text-5xl`
  - Arbitrary values: `text-[10px]`
  - Inconsistent heading hierarchy (h1 uses `text-3xl md:text-5xl` in Home, `text-2xl` in pathways)
- **Mobile Impact:** Visual hierarchy breaks down, making it hard to scan content quickly.
- **Suggested Fix:**
  - Define a typography scale in `tailwind.config.js`:
    ```js
    fontSize: {
      'xs': ['0.75rem', { lineHeight: '1rem' }],      // 12px
      'sm': ['0.875rem', { lineHeight: '1.25rem' }],  // 14px
      'base': ['1rem', { lineHeight: '1.5rem' }],     // 16px
      'lg': ['1.125rem', { lineHeight: '1.75rem' }],  // 18px
      'xl': ['1.25rem', { lineHeight: '1.75rem' }],   // 20px
      '2xl': ['1.5rem', { lineHeight: '2rem' }],      // 24px
      '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px
      '4xl': ['2.25rem', { lineHeight: '2.5rem' }],   // 36px
      '5xl': ['3rem', { lineHeight: '1' }],          // 48px
    }
    ```
  - Use semantic heading sizes consistently:
    - Page titles: `text-3xl md:text-4xl` or `text-4xl md:text-5xl`
    - Section headings: `text-xl md:text-2xl`
    - Subsection: `text-lg md:text-xl`
    - Body: `text-base` or `text-sm`

---

### Issue 5: Spacing Scale Inconsistencies
- **Location:** All components
- **Problem:** Mix of standard Tailwind spacing and arbitrary values:
  - Standard: `p-4`, `p-6`, `gap-3`, `space-y-4`
  - Responsive: `md:p-8`, `md:p-10`, `md:gap-6`
  - Inconsistent: Some use `p-6 md:p-8`, others use `p-4 md:p-6`
- **Mobile Impact:** Visual rhythm feels inconsistent, making the interface feel less polished.
- **Suggested Fix:**
  - Standardize spacing scale:
    - Mobile padding: `p-4` (16px) for cards, `p-6` (24px) for sections
    - Desktop padding: `md:p-6` (24px) for cards, `md:p-8` (32px) for sections
    - Gaps: `gap-3` (12px) mobile, `md:gap-4` (16px) or `md:gap-6` (24px) desktop
  - Document spacing system in design tokens
  - Create spacing utility classes if needed

---

## Component Inventory

### ✅ Mobile-Ready Components

1. **Layout.tsx**
   - ✅ Responsive sidebar (hidden on mobile, shown on desktop)
   - ✅ Mobile bottom navigation (4.5rem height, good touch targets)
   - ✅ Mobile search overlay (full-screen, accessible)
   - ⚠️ Minor: Logo text size could be larger on mobile

2. **Home.tsx**
   - ✅ Responsive grid layouts (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`)
   - ✅ Responsive typography (`text-3xl md:text-5xl`)
   - ✅ Touch-friendly buttons (`touch-manipulation`, `active:scale-95`)
   - ⚠️ Hero section padding could be more consistent

3. **DisclaimerModal.tsx**
   - ✅ Responsive padding (`p-6 md:p-8`)
   - ✅ Mobile-friendly role selection (2-column grid)
   - ✅ Proper modal backdrop and z-index
   - ✅ Good touch targets for buttons

### ⚠️ Needs Mobile Improvements

4. **AspectsCalculator.tsx**
   - ✅ Mobile-optimized layout (`max-w-md mx-auto`)
   - ✅ Sticky header
   - ⚠️ **Issue:** `text-[10px]` for label (too small)
   - ⚠️ **Issue:** Fixed footer may overlap content on very small screens
   - ✅ Good touch targets for brain map regions

5. **EvtPathway.tsx / GCAPathway.tsx / MigrainePathway.tsx / StatusEpilepticusPathway.tsx**
   - ✅ Step progress indicators (mobile-friendly)
   - ✅ Responsive grids for selection cards
   - ⚠️ **Critical:** Fixed bottom action bars with inconsistent padding
   - ⚠️ **Issue:** `text-[10px]` for step labels (too small)
   - ⚠️ Long form inputs may need better mobile keyboard handling

6. **Calculators.tsx**
   - ✅ Responsive calculator grid
   - ✅ Mobile-friendly NIHSS calculator interface
   - ⚠️ Some calculator cards may need larger touch targets
   - ⚠️ Long dropdown lists may overflow on mobile

### ❌ Needs Major Mobile Refactoring

7. **ResidentGuide.tsx / Wiki.tsx / TrialsPage.tsx**
   - ⚠️ Need to verify mobile readability of long-form content
   - ⚠️ Check table responsiveness (if any tables exist)
   - ⚠️ Verify code block/markdown rendering on mobile

---

## Typography Audit

### Current Font Usage

**Primary Font:** Inter (Google Fonts)
- Weights: 300, 400, 500, 600, 700
- Applied via: `fontFamily: { sans: ['Inter', 'sans-serif'] }` in Tailwind config

### Font Weight Usage Patterns

- `font-black` (900): Used for headings, strong emphasis
- `font-bold` (700): Used for buttons, labels, important text
- `font-semibold` (600): Used for subheadings
- `font-medium` (500): Used for body text emphasis
- `font-normal` (400): Default, used implicitly

**Issue:** No clear hierarchy. `font-black` and `font-bold` are used interchangeably.

### Font Size Inconsistencies

| Component | Mobile | Desktop | Issue |
|-----------|--------|---------|-------|
| Page Title (Home) | `text-3xl` (30px) | `text-5xl` (48px) | ✅ Good |
| Page Title (Pathways) | `text-2xl` (24px) | `text-2xl` (24px) | ⚠️ Too small on mobile |
| Section Heading | `text-xl` (20px) | `text-2xl` (24px) | ✅ Good |
| Body Text | `text-sm` (14px) | `text-base` (16px) | ⚠️ Body should be `text-base` on mobile |
| Labels | `text-[10px]` (10px) | `text-[10px]` (10px) | ❌ Too small, inaccessible |
| Small Text | `text-xs` (12px) | `text-xs` (12px) | ✅ Acceptable minimum |

### Recommended Typography Scale

```typescript
// Standardized Typography System
const typography = {
  // Headings
  h1: 'text-3xl md:text-4xl font-black',      // Page titles
  h2: 'text-2xl md:text-3xl font-bold',        // Section headings
  h3: 'text-xl md:text-2xl font-bold',         // Subsection headings
  h4: 'text-lg md:text-xl font-semibold',       // Card titles
  
  // Body
  body: 'text-base font-normal',                // Default body
  bodySmall: 'text-sm font-normal',             // Secondary body
  bodyLarge: 'text-lg font-normal',             // Emphasized body
  
  // UI Elements
  label: 'text-xs font-bold uppercase tracking-wider',  // Form labels
  caption: 'text-xs font-medium',               // Captions, metadata
  button: 'text-sm md:text-base font-bold',     // Button text
  nav: 'text-sm font-medium',                  // Navigation items
}
```

---

## Spacing Audit

### Current Spacing Patterns

**Padding:**
- Cards: `p-4` (mobile) → `p-6` or `p-8` (desktop)
- Sections: `p-6` (mobile) → `p-8` or `p-10` (desktop)
- Modals: `p-6 md:p-8`
- Inconsistent: Some use `p-4`, others `p-6` for same element type

**Margins:**
- Section spacing: `space-y-8 md:space-y-10`
- Element spacing: `space-y-4`, `space-y-6`
- Gaps: `gap-3`, `gap-4`, `gap-6` (inconsistent)

**Gaps:**
- Grid gaps: `gap-4 md:gap-6` (most common)
- Flex gaps: `gap-3` (mobile), `gap-4` or `gap-6` (desktop)

### Recommended Spacing Scale

```typescript
// Standardized Spacing System
const spacing = {
  // Container Padding
  containerMobile: 'p-4',           // 16px - Cards, modals
  containerDesktop: 'md:p-6',       // 24px - Cards, modals
  sectionMobile: 'p-6',             // 24px - Page sections
  sectionDesktop: 'md:p-8',         // 32px - Page sections
  
  // Element Spacing
  tight: 'space-y-2',              // 8px - Related items
  normal: 'space-y-4',             // 16px - Default spacing
  relaxed: 'space-y-6',            // 24px - Section spacing
  loose: 'space-y-8 md:space-y-10', // 32px/40px - Page sections
  
  // Gaps
  gapTight: 'gap-2',               // 8px - Dense grids
  gapNormal: 'gap-3 md:gap-4',     // 12px/16px - Default grids
  gapRelaxed: 'gap-4 md:gap-6',    // 16px/24px - Spacious grids
}
```

### Inconsistencies Found

1. **Home.tsx:**
   - Hero: `p-6 md:p-10` (inconsistent with other sections)
   - Should be: `p-6 md:p-8`

2. **Pathway Calculators:**
   - Content padding: `p-4 md:p-8` (inconsistent)
   - Should standardize to: `p-4 md:p-6` or `p-6 md:p-8`

3. **Action Bars:**
   - Mobile: `p-4` (16px)
   - Desktop: `p-0` (no padding)
   - Should be consistent: `p-4 md:p-6`

---

## Color System Audit

### Current Color Usage

**Primary Palette (Neuro Blue):**
- `neuro-50` through `neuro-900` - Well-defined scale ✅
- Used consistently for primary actions, links, highlights ✅

**Semantic Colors:**
- Success: `emerald-600`, `emerald-50` (ASPECTS calculator)
- Warning: `amber-600`, `amber-50` (ASPECTS calculator)
- Danger: `red-600`, `red-50` (ASPECTS calculator, alerts)
- Neutral: `slate-*` scale (text, backgrounds, borders)

**Issue:** Some components use `blue-500`, `blue-50` (DisclaimerModal role selection) instead of `neuro-*` palette. Should standardize to neuro colors for consistency.

---

## Accessibility Issues

### WCAG Compliance Gaps

1. **Text Size:** `text-[10px]` violates WCAG 2.1 Level AA (minimum 12px recommended)
2. **Touch Targets:** Some buttons < 44px violate WCAG 2.5.5 Level AAA
3. **Color Contrast:** Need to verify all text/background combinations meet 4.5:1 ratio
4. **Focus States:** Most components have `focus:outline-none` - need to verify visible focus indicators

### Missing Accessibility Features

- No `aria-label` on icon-only buttons (some have, but inconsistent)
- No skip-to-content link
- Modal focus trap may need verification
- Keyboard navigation for complex calculators needs testing

---

## Priority Recommendations

### 🔴 Priority 1: Critical Mobile Fixes (Do First)

1. **Replace all `text-[10px]` with `text-xs` (12px minimum)**
   - Impact: Accessibility compliance, readability
   - Effort: Low (find/replace)
   - Files: 5+ files

2. **Fix fixed bottom action bar padding**
   - Impact: Users can access all content
   - Effort: Medium (test on devices)
   - Standardize: `pb-40 md:pb-8` for content, verify on iOS Safari

3. **Enforce minimum 44px touch targets**
   - Impact: Usability, WCAG compliance
   - Effort: Medium (audit all buttons)
   - Add: `min-h-[44px]` or `p-3` to all interactive elements

### 🟡 Priority 2: Design System Standardization (Do Next)

4. **Create typography scale in Tailwind config**
   - Impact: Consistency, maintainability
   - Effort: Low
   - Define: Custom font sizes, line heights, weights

5. **Standardize spacing scale**
   - Impact: Visual consistency
   - Effort: Medium
   - Document: Spacing tokens, update components

6. **Unify color usage (replace `blue-*` with `neuro-*`)**
   - Impact: Brand consistency
   - Effort: Low
   - Find/replace: `blue-500` → `neuro-500`, etc.

### 🟢 Priority 3: Polish & Enhancement (Nice to Have)

7. **Create reusable button component**
   - Impact: Consistency, maintainability
   - Effort: Medium
   - Include: Touch target enforcement, variants, states

8. **Add focus visible states**
   - Impact: Keyboard navigation accessibility
   - Effort: Low
   - Add: `focus-visible:ring-2 focus-visible:ring-neuro-500`

9. **Optimize long-form content pages**
   - Impact: Readability on mobile
   - Effort: Medium
   - Check: ResidentGuide, Wiki, TrialsPage for mobile optimization

---

## Component-Specific Recommendations

### Layout.tsx
- ✅ Good mobile navigation structure
- ⚠️ Consider larger logo text on mobile (`text-xl` → `text-2xl`)
- ⚠️ Search input could be taller on mobile for better touch target

### Home.tsx
- ✅ Excellent responsive design
- ⚠️ Hero padding: `p-6 md:p-10` → `p-6 md:p-8` (consistency)
- ✅ Good use of `touch-manipulation` and `active:scale-95`

### Calculator Components
- ⚠️ All need: Standardized bottom padding, larger touch targets
- ⚠️ Consider: Sticky action bars instead of fixed (better scroll behavior)
- ✅ Good: Step progress indicators, selection cards

### Modal Components
- ✅ Good: Backdrop, z-index, focus management
- ⚠️ Role selection buttons: Use `neuro-*` colors instead of `blue-*`
- ✅ Good: Responsive padding, mobile-friendly layout

---

## Testing Recommendations

### Device Testing Required

1. **iOS Safari (iPhone 12/13/14)**
   - Test fixed bottom bars with keyboard open
   - Verify safe area insets (`pb-safe`)
   - Test touch target sizes

2. **Android Chrome (Pixel 5/6)**
   - Test bottom navigation bar overlap
   - Verify scrolling behavior
   - Test form inputs with keyboard

3. **iPad (Tablet)**
   - Test responsive breakpoints (`md:` at 768px)
   - Verify sidebar behavior
   - Test grid layouts

### Browser Testing

- Chrome (desktop & mobile)
- Safari (iOS & macOS)
- Firefox
- Edge

### Accessibility Testing

- Screen reader (VoiceOver, NVDA)
- Keyboard-only navigation
- Color contrast checker (WebAIM)
- Touch target size validator

---

## Design System Recommendations

### Create Design Tokens File

```typescript
// design-tokens.ts (recommended)
export const tokens = {
  typography: {
    fontFamily: 'Inter, sans-serif',
    sizes: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',  // 14px
      base: '1rem',    // 16px
      lg: '1.125rem',  // 18px
      xl: '1.25rem',   // 20px
      '2xl': '1.5rem', // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem',  // 36px
      '5xl': '3rem',     // 48px
    },
    weights: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      black: 900,
    }
  },
  spacing: {
    mobile: {
      tight: '0.5rem',   // 8px
      normal: '1rem',    // 16px
      relaxed: '1.5rem', // 24px
    },
    desktop: {
      tight: '0.75rem',  // 12px
      normal: '1.5rem',  // 24px
      relaxed: '2rem',   // 32px
    }
  },
  touchTargets: {
    minimum: '2.75rem', // 44px
    comfortable: '3rem', // 48px
  }
}
```

---

## Conclusion

Neurowiki has a **solid foundation** with good mobile-first thinking and consistent color usage. The main issues are:

1. **Accessibility violations** (text size, touch targets)
2. **Inconsistent design tokens** (spacing, typography)
3. **Mobile layout bugs** (fixed bottom bars)

**Estimated Fix Time:** 2-3 days for Priority 1 issues, 1 week for full standardization.

**Next Steps:**
1. Fix critical mobile issues (Priority 1)
2. Standardize design tokens (Priority 2)
3. Create component library documentation
4. Implement automated accessibility testing

---

**End of Audit**
