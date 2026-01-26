# Performance Analysis

**Last Updated:** 2026-01-19  
**Build Tool:** Vite 6.2.0  
**Framework:** React 19.2.3

---

## Bundle Analysis

### Build Command
```bash
npm run build
```

### Expected Output Structure
- **Output Directory:** `/dist`
- **Entry Point:** `index.html`
- **Asset Organization:** Vite handles automatic code splitting

### Bundle Strategy
- **Route-based splitting:** Automatic via React Router
- **Component splitting:** Manual (via dynamic imports if needed)
- **Vendor chunks:** Automatic separation of node_modules

---

## Import Analysis

### Barrel Imports Found

**Files with barrel imports:**
1. **`tailwind.config.js`**
   - Uses `export default` (not a barrel import issue)
   - Status: ✅ OK

2. **`data/guideContent.ts`**
   - Large data file with multiple exports
   - Status: ⚠️ Large file (~1000+ lines) - consider splitting by category

### Unused Imports
**Status:** Manual review recommended  
**Tools:** Use ESLint with `eslint-plugin-unused-imports` or `ts-prune`

**Common patterns to check:**
- Unused React imports
- Unused icon imports from `lucide-react`
- Unused utility functions

### Heavy Libraries

**Dependencies >100KB (estimated):**

| Package | Version | Size Estimate | Purpose |
|---------|---------|---------------|---------|
| `react` | ^19.2.3 | ~130KB | Core framework |
| `react-dom` | ^19.2.3 | ~130KB | DOM renderer |
| `react-router-dom` | ^7.11.0 | ~50KB | Routing |
| `react-markdown` | ^10.1.0 | ~80KB | Markdown rendering |
| `lucide-react` | ^0.562.0 | ~200KB+ | Icon library (tree-shakeable) |
| `@google/genai` | ^1.34.0 | ~150KB | AI API client |

**Optimization Notes:**
- `lucide-react` is tree-shakeable (only imports used icons)
- `react-markdown` could be lazy-loaded for article pages
- `@google/genai` only loaded when needed (not in main bundle)

---

## Image Assets

### Inventory

**Location:** `/public`

| File | Format | Purpose |
|------|--------|---------|
| `og-image.png` | PNG | Open Graph default image |
| `favicon.png` | PNG | Site favicon |

**Total Count:** 2 image files

### Image Optimization Status

**Current Implementation:**
- ❌ **Not using `next/image`** (Next.js not used)
- ❌ **No image optimization** (using standard `<img>` tags)
- ✅ **Small file count** (only 2 images)

**Recommendations:**
1. Use Vite's asset handling for optimization
2. Consider WebP format for better compression
3. Implement lazy loading for images below fold
4. Add `loading="lazy"` attribute to images

### Unoptimized Images
- `og-image.png` - Should be optimized (target: <200KB)
- `favicon.png` - Should be optimized (target: <50KB)

---

## Code Splitting Status

### Dynamic Imports
**Status:** ❌ **Not Currently Used**

**Current Pattern:**
- All components imported statically
- All routes loaded upfront

**Opportunities:**
1. **Article Pages:** Lazy load `react-markdown` and article components
2. **Calculator Pages:** Lazy load calculator-specific components
3. **Modal Components:** Lazy load modals (FeedbackModal, ToolManagerModal)

**Example Implementation:**
```tsx
// Current (static)
import FeedbackModal from './FeedbackModal';

// Optimized (dynamic)
const FeedbackModal = lazy(() => import('./FeedbackModal'));
```

### Route-Based Splitting
**Status:** ✅ **Automatic** (React Router handles this)

**How it works:**
- Each route component is automatically code-split
- Only loads when route is accessed
- Vite handles chunk generation

### Component Lazy Loading
**Status:** ❌ **Not Implemented**

**Components that could be lazy-loaded:**
- `FeedbackModal` - Only needed when button clicked
- `ToolManagerModal` - Only needed when managing tools
- `DisclaimerModal` - Only needed on first visit
- Article components - Large markdown renderers

---

## Third-Party Scripts

### External Scripts Loaded

#### 1. **Google Analytics**
**Location:** `index.html` (lines 5-11)  
**Script:**
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-0PD4HYYNTP"></script>
```
**Impact:**
- ✅ Async loading (non-blocking)
- ⚠️ External dependency
- 📊 Analytics tracking

#### 2. **Google Fonts (Inter)**
**Location:** `index.html` (line 46)  
**Link:**
```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```
**Impact:**
- ✅ `display=swap` (prevents FOIT)
- ⚠️ External CDN dependency
- 📝 Font loading strategy is optimal

#### 3. **ESM.sh CDN (Development)**
**Location:** `index.html` (lines 73-85)  
**Purpose:** Import map for ESM modules  
**Status:** ⚠️ Development only (should not be in production build)

**Packages loaded via CDN:**
- `react-router-dom`
- `react-markdown`
- `react-dom`
- `lucide-react`
- `@google/genai`
- `react`

**⚠️ CRITICAL:** This import map should be removed in production builds. Vite should bundle these dependencies.

---

## Performance Optimizations Implemented

### CSS Optimizations
**File:** `index.css`

1. **GPU Acceleration:**
   ```css
   .transform-gpu {
     transform: translateZ(0);
     backface-visibility: hidden;
     perspective: 1000px;
   }
   ```

2. **Tap Highlight Removal:**
   ```css
   * {
     -webkit-tap-highlight-color: transparent;
   }
   ```

3. **Scrollbar Hiding:**
   ```css
   .scrollbar-hide {
     -ms-overflow-style: none;
     scrollbar-width: none;
   }
   ```

### React Optimizations

1. **Memoization:**
   - `useMemo` used in Layout.tsx for filtered navigation
   - `useCallback` used in DarkModeContext for toggle function

2. **Ref Usage:**
   - `useRef` for DOM references (search input, main content)
   - `useRef` for tracking dark mode state (immediate DOM updates)

3. **State Management:**
   - Local storage for persistence (dark mode, favorites, tools)
   - Context API for global state (dark mode)

---

## Performance Metrics (Targets)

### Core Web Vitals Targets

| Metric | Target | Current Status |
|--------|--------|---------------|
| **LCP** (Largest Contentful Paint) | < 2.5s | ⚠️ Not measured |
| **FID** (First Input Delay) | < 100ms | ⚠️ Not measured |
| **CLS** (Cumulative Layout Shift) | < 0.1 | ⚠️ Not measured |

### Bundle Size Targets

| Bundle Type | Target | Current Status |
|-------------|--------|---------------|
| **Initial JS** | < 200KB (gzipped) | ⚠️ Not measured |
| **Total JS** | < 500KB (gzipped) | ⚠️ Not measured |
| **CSS** | < 50KB (gzipped) | ⚠️ Not measured |

**Measurement Command:**
```bash
npm run build
# Check dist/ directory for bundle sizes
```

---

## Performance Recommendations

### High Priority

1. **Remove ESM.sh Import Map from Production**
   - Current: Import map in `index.html` loads dependencies via CDN
   - Action: Ensure Vite bundles all dependencies in production
   - Impact: Reduces external requests, improves reliability

2. **Implement Lazy Loading for Heavy Components**
   - `react-markdown` - Lazy load on article pages
   - Modal components - Lazy load when needed
   - Impact: Reduces initial bundle size

3. **Optimize Images**
   - Convert PNG to WebP
   - Compress `og-image.png`
   - Impact: Faster page loads

### Medium Priority

4. **Split Large Data Files**
   - `data/guideContent.ts` is very large (~1000+ lines)
   - Consider splitting by category
   - Impact: Better code splitting, faster initial load

5. **Implement Route Prefetching**
   - Prefetch routes on hover/focus
   - Impact: Faster navigation

6. **Add Service Worker for Caching**
   - Cache static assets
   - Impact: Offline support, faster repeat visits

### Low Priority

7. **Implement Virtual Scrolling**
   - For long lists (trials, guides)
   - Impact: Better performance on low-end devices

8. **Optimize Font Loading**
   - Consider self-hosting Inter font
   - Impact: Faster font loading, no external dependency

---

## Build Analysis Commands

### Generate Bundle Report
```bash
npm run build
# Analyze dist/ directory
du -sh dist/*
```

### Check for Large Dependencies
```bash
npm ls --depth=0
# Review package.json for large packages
```

### Analyze Bundle Composition
```bash
# Install bundle analyzer (if needed)
npm install --save-dev rollup-plugin-visualizer
# Add to vite.config.ts and rebuild
```

---

## Current Performance Status

### ✅ Strengths
- Route-based code splitting (automatic)
- Tree-shakeable icon library (lucide-react)
- GPU-accelerated transforms
- Optimized font loading (display=swap)
- Async analytics loading

### ⚠️ Areas for Improvement
- No lazy loading of heavy components
- Large data file (guideContent.ts)
- ESM.sh import map in HTML (should be removed in production)
- No image optimization
- No bundle size monitoring

### ❌ Critical Issues
- **ESM.sh CDN in production** - Dependencies should be bundled
- **No performance monitoring** - No Lighthouse CI or bundle analysis

---

## Next Steps

1. **Run Build Analysis:**
   ```bash
   npm run build
   # Analyze output in dist/
   ```

2. **Measure Core Web Vitals:**
   - Use Lighthouse in Chrome DevTools
   - Target: 90+ Performance score

3. **Implement Lazy Loading:**
   - Start with modal components
   - Then article components

4. **Remove ESM.sh Import Map:**
   - Verify Vite bundles all dependencies
   - Remove import map from index.html

5. **Set Up Bundle Monitoring:**
   - Add bundle size limits to CI/CD
   - Track bundle size over time
