# Neurowiki.ai Development Rules

**Last Updated:** 2026-01-19  
**Purpose:** Guidelines for maintaining codebase integrity and preventing breaking changes

---

## Framework Protection

### ⚠️ CRITICAL: DO NOT MODIFY Without Architectural Review

#### 1. **Layout Component** (`components/Layout.tsx`)
**Status:** IMMUTABLE - Core framework component  
**Reason:** Controls entire app navigation, sidebar, header, mobile nav

**What it Controls:**
- Global navigation structure
- Sidebar behavior (collapsible, content panels)
- Header with search and dark mode
- Mobile bottom navigation
- Tool management
- Route-based conditional rendering

**Modification Rules:**
- ❌ **DO NOT** modify without understanding full routing structure
- ❌ **DO NOT** change navigation items without updating routes
- ✅ **ALLOWED:** Styling changes (colors, spacing)
- ✅ **ALLOWED:** Bug fixes
- ⚠️ **REQUIRES REVIEW:** New features, structural changes

#### 2. **Routing Configuration** (`src/App.tsx`)
**Status:** PROTECTED - Core routing  
**Reason:** Defines all application routes

**Modification Rules:**
- ❌ **DO NOT** remove routes without migration plan
- ❌ **DO NOT** change route paths without redirects
- ✅ **ALLOWED:** Adding new routes
- ⚠️ **REQUIRES REVIEW:** Route structure changes

#### 3. **Dark Mode Context** (`src/contexts/DarkModeContext.tsx`)
**Status:** PROTECTED - Global state  
**Reason:** Manages dark mode state globally

**Modification Rules:**
- ❌ **DO NOT** change API without updating all consumers
- ✅ **ALLOWED:** Bug fixes
- ⚠️ **REQUIRES REVIEW:** API changes

#### 4. **Content Status** (`src/config/contentStatus.ts`)
**Status:** PROTECTED - Content gating  
**Reason:** Controls which content is published

**Modification Rules:**
- ❌ **DO NOT** change without content team approval
- ✅ **ALLOWED:** Adding new published content
- ⚠️ **REQUIRES REVIEW:** Changing publication status

---

## Code Style

### Formatting

**Tool:** (Not specified - consider Prettier)  
**Current State:** Manual formatting

**Recommendations:**
- Use consistent indentation (2 spaces)
- Use semicolons
- Use single quotes for strings (or double, be consistent)
- Trailing commas in objects/arrays

### Linting

**Tool:** (Not configured - consider ESLint)  
**Current State:** No linting configured

**Recommendations:**
- Set up ESLint with React plugin
- Configure TypeScript ESLint
- Add unused imports plugin
- Set up pre-commit hooks

### Naming Conventions

**Components:**
- PascalCase: `Layout.tsx`, `FeedbackButton.tsx`
- File names match component names

**Functions/Variables:**
- camelCase: `toggleDarkMode`, `isNavExpanded`
- Boolean prefixes: `is`, `has`, `should`

**Constants:**
- UPPER_SNAKE_CASE: `GUIDE_CONTENT`, `ALL_TOOLS`
- Or camelCase for objects: `categoryStyles`

**Types/Interfaces:**
- PascalCase: `LayoutProps`, `Tool`
- Interface prefix: `Props` suffix (e.g., `LayoutProps`)

---

## Component Guidelines

### File Naming
- **Components:** PascalCase (e.g., `Layout.tsx`)
- **Utilities:** camelCase (e.g., `analytics.ts`)
- **Data Files:** camelCase (e.g., `guideContent.ts`)
- **Config Files:** kebab-case or camelCase (e.g., `vite.config.ts`)

### Folder Structure
- **Pages:** `/pages` (root level) - Top-level routes
- **Components:** `/components` (root) or `/src/components` - Reusable UI
- **Utilities:** `/src/utils` or `/utils` - Helper functions
- **Data:** `/data` - Static content
- **Hooks:** `/src/hooks` or `/hooks` - Custom React hooks
- **Contexts:** `/src/contexts` - React Context providers

### Import Order
**Recommended Order:**
1. React imports
2. Third-party libraries
3. Internal components
4. Utilities/hooks
5. Types/interfaces
6. Data/constants
7. Styles (if any)

**Example:**
```tsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Moon, Sun } from 'lucide-react';

import { useDarkMode } from '../contexts/DarkModeContext';
import { FeedbackButton } from './FeedbackButton';

import { GUIDE_CONTENT } from '../../data/guideContent';
```

### Component Structure
**Recommended Pattern:**
```tsx
// 1. Imports
import React, { useState } from 'react';

// 2. Types/Interfaces
interface ComponentProps {
  title: string;
}

// 3. Component
export const Component: React.FC<ComponentProps> = ({ title }) => {
  // 4. Hooks
  const [state, setState] = useState();
  
  // 5. Handlers
  const handleClick = () => {};
  
  // 6. Render
  return <div>{title}</div>;
};

// 7. Export
export default Component;
```

---

## Performance Constraints

### Bundle Size Limits
**Current:** Not enforced  
**Recommendation:** Set limits in CI/CD

**Targets:**
- Initial JS bundle: < 200KB (gzipped)
- Total JS: < 500KB (gzipped)
- CSS: < 50KB (gzipped)

### Image Optimization Rules
- **Format:** Use WebP when possible
- **Size:** Compress images before adding
- **Lazy Loading:** Use `loading="lazy"` for below-fold images
- **Responsive:** Use `srcset` for different screen sizes

### Code Splitting Strategy
- **Routes:** Automatic (React Router)
- **Heavy Components:** Lazy load with `React.lazy()`
- **Modals:** Lazy load when possible
- **Large Libraries:** Lazy load (e.g., `react-markdown`)

**Example:**
```tsx
const FeedbackModal = lazy(() => import('./FeedbackModal'));
```

---

## Accessibility Requirements

### Required Practices
1. **Alt Text:** All images must have `alt` attributes
2. **ARIA Labels:** Interactive elements without visible text
3. **Keyboard Navigation:** All interactive elements must be keyboard accessible
4. **Focus States:** Visible focus indicators
5. **Color Contrast:** WCAG AA minimum (4.5:1 for text)

### Touch Targets
- **Minimum Size:** 44x44px (`min-h-[44px] min-w-[44px]`)
- **Spacing:** Adequate spacing between interactive elements

---

## TypeScript Guidelines

### Type Safety
- **Avoid `any`:** Use proper types or `unknown`
- **Interface over Type:** Prefer `interface` for object shapes
- **Explicit Returns:** Type function return values
- **Props Types:** Always type component props

### Type Definitions
- **Global Types:** `/types.ts` (root level)
- **Component Types:** In same file or separate `.types.ts`
- **Shared Types:** `/src/types` or root `/types.ts`

---

## Git Workflow

### Branch Naming
- **Feature:** `feature/description`
- **Bugfix:** `bugfix/description`
- **Hotfix:** `hotfix/description`

### Commit Messages
**Format:** `type: description`

**Types:**
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Formatting, styling
- `refactor:` Code restructuring
- `perf:` Performance improvement
- `test:` Adding tests
- `chore:` Maintenance tasks

**Example:**
```
feat: add dark mode toggle to mobile header
fix: resolve favorites filter not clearing on navigation
docs: update component documentation
```

---

## Testing Requirements

### Current Status: ❌ No Tests

### Recommended Testing Strategy
1. **Unit Tests:** Component logic, utilities
2. **Integration Tests:** Component interactions
3. **E2E Tests:** Critical user flows
4. **Visual Regression:** UI consistency

### Testing Tools
- **Framework:** Vitest or Jest
- **React Testing:** React Testing Library
- **E2E:** Playwright or Cypress

---

## Documentation Requirements

### Required Documentation
1. **Component Props:** JSDoc comments for props
2. **Complex Logic:** Inline comments for non-obvious code
3. **API Changes:** Update relevant docs
4. **Breaking Changes:** Document in CHANGELOG

### Documentation Files
- **Component Docs:** In component file or separate `.md`
- **API Docs:** `/docs` directory
- **Architecture:** `/docs` directory (this file)

---

## Security Guidelines

### Environment Variables
- **Never commit:** `.env` files
- **Use Vite:** `loadEnv` for environment variables
- **Client-side:** Only expose public variables
- **Server-side:** Keep secrets in Netlify environment

### API Keys
- **Storage:** Environment variables only
- **Client Bundle:** Never include in client code
- **Validation:** Validate on server-side

### User Input
- **Sanitize:** All user input (forms, search)
- **XSS Prevention:** Use `react-markdown` (sanitizes by default)
- **CSRF:** Use proper form handling

---

## Content Management

### Content Updates
- **Location:** `/data/guideContent.ts`
- **Process:** Manual code updates
- **Future:** Consider CMS or JSON files

### Content Status
- **Control:** `src/config/contentStatus.ts`
- **Gating:** `PublishGate` component
- **Approval:** Content team approval required

---

## Deployment Rules

### Pre-Deployment Checklist
- [ ] Build succeeds: `npm run build`
- [ ] No TypeScript errors: `tsc --noEmit`
- [ ] No console errors in browser
- [ ] All routes tested
- [ ] Mobile responsiveness verified
- [ ] Dark mode tested
- [ ] Accessibility basics checked

### Deployment Process
1. **Build:** `npm run build`
2. **Test:** Preview build locally
3. **Deploy:** Push to production
4. **Verify:** Test in production environment

---

## Breaking Change Policy

### Definition
Any change that:
- Removes or renames public APIs
- Changes component props
- Modifies route structure
- Changes data formats
- Breaks existing functionality

### Process
1. **Document:** Changes in PR description
2. **Migrate:** Provide migration path
3. **Test:** Thorough testing
4. **Communicate:** Notify team of breaking changes

---

## Code Review Guidelines

### Required Reviews
- **Framework Components:** Architecture review required
- **Routing Changes:** Full team review
- **Breaking Changes:** Team approval
- **Security Changes:** Security review

### Review Checklist
- [ ] Code follows style guidelines
- [ ] Types are properly defined
- [ ] No console.log statements
- [ ] Accessibility requirements met
- [ ] Performance considerations addressed
- [ ] Documentation updated
- [ ] Tests added (if applicable)

---

## Summary

### Critical Rules
1. ❌ **DO NOT** modify `Layout.tsx` without review
2. ❌ **DO NOT** change routes without redirects
3. ❌ **DO NOT** commit API keys or secrets
4. ❌ **DO NOT** break existing functionality without migration

### Best Practices
1. ✅ Follow naming conventions
2. ✅ Use TypeScript properly
3. ✅ Maintain accessibility
4. ✅ Document complex logic
5. ✅ Test before deploying

### Enforcement
- **Automated:** (Not yet implemented - consider pre-commit hooks)
- **Manual:** Code reviews
- **Documentation:** This file and related docs

---

## Questions or Clarifications

If unsure about any rule or guideline:
1. Check this documentation
2. Review similar code in codebase
3. Ask team for clarification
4. Document decision for future reference
