# Current Issues & Warnings

**Last Updated:** 2026-01-19  
**Status:** Documentation of known issues and potential problems

---

## Console Errors

### Status: ⚠️ Manual Testing Required

**To Check:**
1. Run `npm run dev`
2. Open browser DevTools Console
3. Navigate through all major pages
4. Check for errors/warnings

**Common Issues to Look For:**
- React hydration mismatches
- Missing key props in lists
- Unhandled promise rejections
- Deprecated API usage

---

## TypeScript Errors

### Status: ⚠️ Manual Check Required

**Check Command:**
```bash
npx tsc --noEmit
```

**Known Type Issues:**
- Some components may have `any` types
- Props interfaces may be incomplete

**Files to Review:**
- `components/Layout.tsx` - Large file, complex types
- `data/guideContent.ts` - Large data structure
- Article components - Markdown component types

---

## Build Warnings

### Status: ⚠️ Manual Check Required

**Check Command:**
```bash
npm run build
```

**Common Warnings to Look For:**
- Unused imports
- Missing dependencies
- Deprecated APIs
- Large bundle size warnings

---

## Accessibility Issues

### Known Issues

#### 1. **Missing Alt Text**
**Status:** ⚠️ Potential Issue  
**Location:** Image elements throughout codebase  
**Check:** All `<img>` tags should have `alt` attributes

**Files to Review:**
- Article pages with images
- Calculator pages with diagrams
- Home page images

#### 2. **ARIA Labels**
**Status:** ✅ Mostly Implemented  
**Location:** Interactive elements  
**Notes:** Most buttons have `aria-label` attributes

**Files with Good ARIA:**
- `components/Layout.tsx` - Navigation buttons
- `src/components/FeedbackButton.tsx` - Feedback button

#### 3. **Color Contrast**
**Status:** ⚠️ Manual Testing Required  
**Tool:** Use browser DevTools Accessibility panel

**Areas to Check:**
- Text on colored backgrounds
- Dark mode text contrast
- Link colors on backgrounds

#### 4. **Keyboard Navigation**
**Status:** ✅ Generally Good  
**Notes:**
- Focus states implemented (`focus:ring-2 focus:ring-neuro-500`)
- Tab order should be logical

**Potential Issues:**
- Modal focus trapping (check FeedbackModal, ToolManagerModal)
- Skip links for main content

---

## Mobile Responsiveness

### Tested Breakpoints

| Device | Width | Status |
|--------|-------|--------|
| iPhone SE | 375px | ⚠️ Manual test required |
| iPhone 12/13 | 390px | ⚠️ Manual test required |
| iPad | 768px | ⚠️ Manual test required |
| Desktop | 1024px+ | ⚠️ Manual test required |

### Known Mobile Issues

#### 1. **Bottom Navigation Spacing**
**Status:** ✅ Fixed  
**Location:** `components/Layout.tsx`  
**Solution:** Added `pb-20` to main content for mobile bottom nav

#### 2. **Touch Target Sizes**
**Status:** ✅ Implemented  
**Location:** Interactive elements  
**Implementation:** `min-h-[44px] min-w-[44px]` on buttons

#### 3. **Mobile Search Overlay**
**Status:** ✅ Implemented  
**Location:** `components/Layout.tsx`  
**Features:** Full-screen overlay with proper touch targets

---

## Broken Links

### Status: ⚠️ Manual Check Required

**Check Method:**
1. Navigate through all routes
2. Test all internal links
3. Check external links (if any)

**Routes to Verify:**
- All `/guide/*` routes
- All `/calculators/*` routes
- All `/trials/*` routes
- Navigation links in sidebar
- Mobile bottom navigation

**Potential Issues:**
- Legacy routes (`/wiki/:topic`) - May need redirects
- Hash-based URLs - Handled by `legacyHashRedirect.ts`

---

## Code Quality Issues

### 1. **Large Files**

**File:** `components/Layout.tsx`  
**Size:** ~818 lines  
**Status:** ⚠️ Consider Refactoring  
**Recommendation:** Split into smaller components:
- `Sidebar.tsx`
- `Header.tsx`
- `MobileNav.tsx`

**File:** `data/guideContent.ts`  
**Size:** ~1000+ lines  
**Status:** ⚠️ Consider Splitting  
**Recommendation:** Split by category or content type

### 2. **Unused Code**

**Status:** ⚠️ Manual Review Required  
**Tools:** 
- `ts-prune` for TypeScript
- ESLint with unused imports plugin

**Potential Unused:**
- Unused imports in components
- Unused utility functions
- Unused type definitions

### 3. **Console.log Statements**

**Status:** ⚠️ Found in Code  
**Location:** `components/Layout.tsx` (lines 61-62, 756-758)  
**Issue:** Debug logging left in production code

**Action Required:** Remove or replace with proper logging

---

## Security Issues

### 1. **API Keys**

**Status:** ✅ Properly Configured  
**Location:** `vite.config.ts`  
**Implementation:** Environment variables via `loadEnv`

**Files:**
- `GEMINI_API_KEY` - Loaded from environment
- Not exposed in client bundle

### 2. **XSS Vulnerabilities**

**Status:** ⚠️ Review Required  
**Location:** Markdown rendering  
**Implementation:** `react-markdown` (should sanitize by default)

**Check:**
- User-generated content (feedback forms)
- Markdown content rendering
- HTML injection in forms

### 3. **Dependencies with Vulnerabilities**

**Status:** ⚠️ Check Required  
**Command:**
```bash
npm audit
```

**Action:** Review and update vulnerable packages

---

## Performance Issues

### 1. **Large Initial Bundle**

**Status:** ⚠️ Not Measured  
**Issue:** All components loaded upfront  
**Solution:** Implement lazy loading (see PERFORMANCE_AUDIT.md)

### 2. **No Code Splitting for Heavy Components**

**Status:** ⚠️ Issue  
**Components:**
- `react-markdown` - Large library
- Modal components - Not lazy loaded
- Article components - Large markdown renderers

### 3. **ESM.sh CDN in HTML**

**Status:** ❌ Critical Issue  
**Location:** `index.html` (lines 73-85)  
**Problem:** Dependencies loaded via CDN instead of bundled  
**Impact:** External dependency, slower loads, reliability issues

**Action Required:** Remove import map, ensure Vite bundles dependencies

---

## Browser Compatibility

### Status: ⚠️ Manual Testing Required

**Browsers to Test:**
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile Safari (iOS)
- Chrome Mobile (Android)

**Known Issues:**
- None documented (manual testing required)

**Potential Issues:**
- CSS Grid/Flexbox support (should be fine for modern browsers)
- Dark mode class support (should be fine)
- ES6+ features (should be fine with Vite)

---

## Data Issues

### 1. **Large Data File**

**File:** `data/guideContent.ts`  
**Status:** ⚠️ Performance Concern  
**Size:** ~1000+ lines  
**Impact:** Increases bundle size, slower initial load

**Recommendation:** Split into multiple files or lazy load

### 2. **Content Updates**

**Status:** ⚠️ Manual Process  
**Location:** `data/guideContent.ts`  
**Issue:** Content updates require code changes

**Recommendation:** Consider CMS or JSON files for easier updates

---

## Routing Issues

### 1. **Legacy Route Handling**

**Status:** ✅ Implemented  
**Location:** `src/utils/legacyHashRedirect.ts`  
**Implementation:** Handles hash-based URLs

### 2. **404 Handling**

**Status:** ✅ Implemented  
**Location:** `src/App.tsx`  
**Implementation:** `<Route path="*" element={<Navigate to="/" replace />} />`

### 3. **Route Protection**

**Status:** ✅ Implemented  
**Location:** `src/components/PublishGate.tsx`  
**Implementation:** Checks `contentStatus.ts` for published content

---

## State Management Issues

### 1. **Local Storage Usage**

**Status:** ✅ Properly Implemented  
**Keys Used:**
- `neurowiki-dark-mode` - Dark mode preference
- `neurowiki-favorites` - User favorites
- `neurowiki-sidebar-tools` - Pinned tools

**Potential Issues:**
- No error handling for localStorage quota exceeded
- No migration strategy for data format changes

### 2. **Context Usage**

**Status:** ✅ Properly Implemented  
**Context:** `DarkModeContext`  
**Implementation:** Proper provider/consumer pattern

---

## Testing Coverage

### Status: ❌ No Tests Found

**Missing:**
- Unit tests
- Integration tests
- E2E tests
- Component tests

**Recommendation:** Add testing framework (Jest, Vitest, React Testing Library)

---

## Documentation Issues

### Status: ✅ Being Addressed

**Current Documentation:**
- `docs/design_system.md` - Design guidelines
- `docs/CALCULATOR_GUIDELINES.md` - Calculator guidelines
- `docs/FEEDBACK_SETUP.md` - Feedback setup
- This documentation suite

**Missing:**
- API documentation
- Component API docs
- Contribution guidelines

---

## Summary

### Critical Issues (Fix Immediately)
1. ❌ **ESM.sh CDN in production** - Remove import map, bundle dependencies
2. ⚠️ **Console.log in production** - Remove debug statements

### High Priority (Fix Soon)
1. ⚠️ **No lazy loading** - Implement for heavy components
2. ⚠️ **Large data file** - Split `guideContent.ts`
3. ⚠️ **No bundle analysis** - Set up monitoring

### Medium Priority (Plan to Fix)
1. ⚠️ **Large Layout.tsx** - Refactor into smaller components
2. ⚠️ **No tests** - Add testing framework
3. ⚠️ **Accessibility audit** - Complete manual testing

### Low Priority (Nice to Have)
1. ⚠️ **Documentation** - Add API docs
2. ⚠️ **Performance monitoring** - Set up Lighthouse CI

---

## Action Items

1. **Run Manual Tests:**
   - [ ] Console errors check
   - [ ] TypeScript compilation
   - [ ] Build warnings
   - [ ] Accessibility audit
   - [ ] Mobile responsiveness test
   - [ ] Browser compatibility test

2. **Fix Critical Issues:**
   - [ ] Remove ESM.sh import map
   - [ ] Remove console.log statements
   - [ ] Verify Vite bundles all dependencies

3. **Performance Improvements:**
   - [ ] Implement lazy loading
   - [ ] Split large data file
   - [ ] Set up bundle monitoring

4. **Code Quality:**
   - [ ] Refactor large files
   - [ ] Remove unused code
   - [ ] Add tests
