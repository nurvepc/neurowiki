# Immutable Framework Components

**Last Updated:** 2026-01-19  
**Status:** READ-ONLY Documentation - DO NOT MODIFY without architectural review

---

## Layout Components (DO NOT MODIFY)

### 1. **Global Layout Wrapper**
**File:** `components/Layout.tsx`  
**Type:** Default export, React Functional Component  
**Props:**
```typescript
interface LayoutProps {
  children: React.ReactNode;
}
```

**Dependencies:**
- `react-router-dom` (useLocation, useNavigate, Link)
- `lucide-react` (icons: Brain, Search, Calculator, etc.)
- `../src/contexts/DarkModeContext` (useDarkMode hook)
- `../src/components/FeedbackButton`
- `./ToolManagerModal`
- `../data/guideContent` (GUIDE_CONTENT, GUIDE_NAVIGATION, TRIAL_STRUCTURE)

**Used on pages:** ALL pages (wraps entire app via `src/App.tsx`)

**Critical Functionality:**
- **Sidebar Navigation:** Collapsible sidebar with icon strip + expandable content panel
- **Header:** Global header with search, logo, dark mode toggle
- **Mobile Navigation:** Bottom navigation bar (Home, Guide, Trials, Calcs, Favourites)
- **Content Panel:** Dynamic sidebar content for Guide/Trials pages
- **Search:** Global search functionality (currently navigates to search results)
- **Dark Mode:** Integrated dark mode toggle in header
- **Tool Management:** Pinned tools sidebar section

**Conditional Rendering Logic:**
- `isOnGuidePage` - Detects `/guide` routes
- `isOnTrialsPage` - Detects `/trials` routes
- `isOnCalculatorsPage` - Detects `/calculators` routes
- `showContentPanel` - Shows content panel on Guide/Trials pages
- `isNavExpanded` - Controls sidebar expansion state

**State Management:**
- `isMobileSearchOpen` - Mobile search overlay visibility
- `isToolModalOpen` - Tool manager modal visibility
- `searchQuery` - Global search input value
- `sidebarSearchQuery` - Sidebar-specific search (Guide/Trials)
- `selectedTools` - Pinned tools (persisted in localStorage)
- `isNavExpanded` - Sidebar expansion state
- `expandedCategories` - Guide categories expansion state
- `expandedTrialsSubcategories` - Trials subcategories expansion state

**⚠️ WARNING:** Modifying this component affects ALL pages. Test thoroughly before changes.

---

### 2. **Header Component** (within Layout.tsx)
**Location:** Lines 688-773 in `components/Layout.tsx`  
**Purpose:** Global header with search, logo, dark mode toggle

**Features:**
- **Mobile:** Logo + Search button + Dark mode toggle
- **Desktop:** Logo + Search bar + Quick Calc link + Dark mode toggle
- **Mobile Search Overlay:** Full-screen search overlay on mobile

**Dependencies:** None (self-contained within Layout)

---

### 3. **Sidebar Navigation** (within Layout.tsx)
**Location:** Lines 200-683 in `components/Layout.tsx`  
**Purpose:** Main navigation sidebar with collapsible sections

**Structure:**
1. **Icon Strip (64px):** Always visible, contains:
   - Expand/collapse button (Menu/PanelLeftClose)
   - Main nav icons (Home, Guide, Trials, Calculators)
   - Dark mode toggle (bottom)
   
2. **Expanded Navigation (256px):** When `isNavExpanded === true`:
   - NeuroWiki logo
   - Full navigation with labels
   - Pinned Tools section (nested under Calculators)
   - Collapse button (bottom)

3. **Content Panel (256px):** When `showContentPanel === true`:
   - Guide/Trials navigation with categories
   - Search bar for filtering
   - Expandable accordion sections

**Conditional Logic:**
- Auto-collapses when content panel opens (Guide/Trials pages)
- Auto-expands categories when navigating to article
- Default state: `isNavExpanded = true`

---

### 4. **Mobile Bottom Navigation**
**Location:** Lines 792-811 in `components/Layout.tsx`  
**Purpose:** Mobile-only bottom navigation bar

**Navigation Items:**
- Home (`/`)
- Guide (`/guide`)
- Trials (`/trials`)
- Calcs (`/calculators`)
- Favourites (`/calculators?favorites=true`)

**Styling:** Fixed bottom, backdrop blur, safe area padding

---

### 5. **Footer**
**Status:** No dedicated footer component  
**Note:** Footer content may be embedded in individual pages

---

## Shared UI Components

### Article Components (`src/components/article/`)

#### **ArticleLayout.tsx**
**Purpose:** Layout wrapper for article pages  
**Props:** `children: React.ReactNode`  
**Used on:** Guide article pages, trial pages  
**Features:** Article-specific layout with table of contents

#### **Callouts.tsx**
**Purpose:** Renders callout boxes (info, warning, note)  
**Used in:** Markdown content via custom components

#### **Section.tsx**
**Purpose:** Article section wrapper  
**Used in:** Article markdown rendering

#### **Paragraph.tsx**
**Purpose:** Custom paragraph rendering  
**Used in:** Article markdown rendering

#### **Term.tsx**
**Purpose:** Medical term highlighting/linking  
**Used in:** Article content

#### **Trial.tsx**
**Purpose:** Trial-specific rendering  
**Used in:** Trial article pages

---

### General UI Components

#### **PublishGate.tsx**
**File:** `src/components/PublishGate.tsx`  
**Purpose:** Content gating - shows "Coming Soon" for unpublished content  
**Props:**
```typescript
interface PublishGateProps {
  children: React.ReactNode;
  path?: string; // Optional override
}
```
**Dependencies:**
- `../config/contentStatus` (isPublished function)
- `./ComingSoon` component
- `react-router-dom` (useLocation)

**Used on:** All protected routes (calculators, guide articles, trials)

**Logic:** Checks `isPublished(path)` - if false, renders `<ComingSoon />`

---

#### **FeedbackButton.tsx**
**File:** `src/components/FeedbackButton.tsx`  
**Purpose:** Floating feedback button (bottom-right)  
**Props:**
```typescript
interface FeedbackButtonProps {
  pageTitle?: string;
  pageType?: 'article' | 'calculator' | 'pathway' | 'trial';
  pagePath?: string;
}
```
**Dependencies:**
- `./FeedbackModal`
- `react-router-dom` (useLocation)

**Used on:** All pages (rendered in Layout.tsx)

**Features:**
- Auto-detects page type from pathname
- Opens FeedbackModal on click
- Fixed positioning (bottom-right)

---

#### **FeedbackModal.tsx**
**File:** `src/components/FeedbackModal.tsx`  
**Purpose:** Feedback form modal  
**Props:**
```typescript
interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  pageTitle: string;
  pageType: PageType;
  pagePath: string;
}
```
**Dependencies:** Netlify function `/functions/api/feedback.ts`

---

#### **DisclaimerModal.tsx**
**File:** `src/components/DisclaimerModal.tsx` (root) + `src/components/DisclaimerModal.tsx`  
**Purpose:** Legal disclaimer modal  
**Used on:** App initialization (rendered in App.tsx)

---

#### **SelectionCard.tsx**
**File:** `src/components/SelectionCard.tsx`  
**Purpose:** Selectable card component  
**Used in:** Various selection interfaces

---

#### **CollapsibleSection.tsx**
**File:** `src/components/CollapsibleSection.tsx`  
**Purpose:** Accordion-style collapsible section  
**Used in:** Article pages, mobile views

---

#### **CalculatorResultButton.tsx**
**File:** `src/components/CalculatorResultButton.tsx`  
**Purpose:** Button for calculator results  
**Used in:** Calculator pages

---

#### **ComingSoon.tsx**
**File:** `src/components/ComingSoon.tsx`  
**Purpose:** "Coming Soon" placeholder  
**Used by:** PublishGate component

---

#### **Seo.tsx**
**File:** `src/components/Seo.tsx`  
**Purpose:** SEO metadata component  
**Used in:** Page components for dynamic metadata

---

### Root-Level Components

#### **ToolManagerModal.tsx**
**File:** `components/ToolManagerModal.tsx`  
**Purpose:** Modal for managing pinned tools in sidebar  
**Props:**
```typescript
interface ToolManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTools: string[];
  onToolsChange: (tools: string[]) => void;
}
```
**Used in:** Layout.tsx sidebar

---

#### **MarkdownRenderer.tsx**
**File:** `components/MarkdownRenderer.tsx`  
**Purpose:** Custom markdown rendering  
**Used in:** Article pages

---

#### **LearningPearl.tsx**
**File:** `components/LearningPearl.tsx`  
**Purpose:** Learning pearl callout component  
**Used in:** Article content

---

#### **NihssItemRow.tsx** & **NihssPearl.tsx**
**File:** `components/NihssItemRow.tsx`, `components/NihssPearl.tsx`  
**Purpose:** NIHSS calculator-specific components  
**Used in:** NihssCalculator.tsx

---

## Route Structure

### Main Routes (from `src/App.tsx`)

| Route | Component | Purpose | Protected |
|-------|-----------|---------|-----------|
| `/` | `Home` | Landing page | No |
| `/wiki/:topic` | `Wiki` | Legacy wiki route | No |
| `/calculators` | `Calculators` | Tool listing page | No |
| `/calculators/nihss` | `NihssCalculator` | NIHSS calculator | Yes (PublishGate) |
| `/calculators/elan-pathway` | `ElanPathway` | ELAN protocol pathway | Yes (PublishGate) |
| `/calculators/evt-pathway` | `EvtPathway` | Thrombectomy pathway | Yes (PublishGate) |
| `/calculators/se-pathway` | `StatusEpilepticusPathway` | Status epilepticus pathway | Yes (PublishGate) |
| `/calculators/migraine-pathway` | `MigrainePathway` | Migraine pathway | Yes (PublishGate) |
| `/calculators/gca-pathway` | `GCAPathway` | GCA/PMR pathway | Yes (PublishGate) |
| `/guide` | `ResidentGuide` | Guide landing page | No |
| `/guide/:topicId` | `ResidentGuide` | Individual guide article | Yes (PublishGate) |
| `/guide/stroke-basics` | `StrokeBasics` | Stroke basics article | Yes (PublishGate) |
| `/guide/iv-tpa` | `IvTpa` | IV tPA article | Yes (PublishGate) |
| `/guide/tpa-eligibility` | `IvTpa` | tPA eligibility (alias) | Yes (PublishGate) |
| `/guide/thrombectomy` | `Thrombectomy` | Thrombectomy article | Yes (PublishGate) |
| `/guide/acute-stroke-mgmt` | `AcuteStrokeMgmt` | Acute stroke management | Yes (PublishGate) |
| `/guide/status-epilepticus` | `StatusEpilepticus` | Status epilepticus article | Yes (PublishGate) |
| `/guide/ich-management` | `IchManagement` | ICH management article | Yes (PublishGate) |
| `/guide/meningitis` | `Meningitis` | Meningitis article | Yes (PublishGate) |
| `/guide/gbs` | `Gbs` | GBS article | Yes (PublishGate) |
| `/guide/myasthenia-gravis` | `MyastheniaGravis` | Myasthenia gravis article | Yes (PublishGate) |
| `/guide/multiple-sclerosis` | `MultipleSclerosis` | MS article | Yes (PublishGate) |
| `/guide/seizure-workup` | `SeizureWorkup` | Seizure workup article | Yes (PublishGate) |
| `/guide/altered-mental-status` | `AlteredMentalStatus` | AMS article | Yes (PublishGate) |
| `/guide/headache-workup` | `HeadacheWorkup` | Headache workup article | Yes (PublishGate) |
| `/guide/vertigo` | `Vertigo` | Vertigo article | Yes (PublishGate) |
| `/guide/weakness-workup` | `WeaknessWorkup` | Weakness workup article | Yes (PublishGate) |
| `/trials` | `TrialsPage` | Trials landing page | No |
| `/trials/:topicId` | `ResidentGuide` (context="trials") | Individual trial | Yes (PublishGate) |
| `*` | `Navigate to="/"` | 404 redirect | No |

---

## Component Usage Patterns

### Protected Routes Pattern
```tsx
<Route 
  path="/guide/article" 
  element={
    <PublishGate>
      <ArticleComponent />
    </PublishGate>
  } 
/>
```

### Layout Wrapping Pattern
All routes are wrapped in `<Layout>` component:
```tsx
<Layout>
  <Routes>
    {/* All routes */}
  </Routes>
</Layout>
```

### Context Providers
```tsx
<DarkModeProvider>
  <Router>
    <DisclaimerModal />
    <Layout>
      {/* Routes */}
    </Layout>
  </Router>
</DarkModeProvider>
```

---

## Component Dependencies Graph

```
App.tsx
├── DarkModeProvider (Context)
├── Router
│   ├── DisclaimerModal
│   └── Layout
│       ├── Sidebar (internal)
│       ├── Header (internal)
│       ├── Mobile Nav (internal)
│       ├── FeedbackButton
│       └── ToolManagerModal
│       └── {children} (Page Components)
│           ├── PublishGate (many pages)
│           └── Page-specific components
```

---

## Critical Notes

1. **Layout.tsx is the single source of truth** for navigation, sidebar, header, and mobile nav
2. **PublishGate** controls content visibility - check `src/config/contentStatus.ts` before modifying
3. **DarkModeContext** is required at app root - all components depend on it
4. **Route changes** must be reflected in:
   - `src/App.tsx` (routing)
   - `src/config/contentStatus.ts` (publication status)
   - `src/seo/routeMeta.ts` (SEO metadata)
5. **Mobile navigation** is hardcoded in Layout.tsx - modify with caution

---

## Component Export Patterns

### Default Exports
- `Layout.tsx` → `export default Layout`
- `App.tsx` → `export default App`
- Most page components

### Named Exports
- `PublishGate.tsx` → `export const PublishGate` + `export default PublishGate`
- `FeedbackButton.tsx` → `export const FeedbackButton` + `export default FeedbackButton`
- Context providers → `export function DarkModeProvider`

### Barrel Exports
- `src/components/article/index.ts` - Re-exports article components
- `src/components/index.ts` - Re-exports general components
