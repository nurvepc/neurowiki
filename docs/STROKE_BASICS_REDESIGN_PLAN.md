# Stroke Basics Wikipedia-Style Redesign Execution Plan

## Overview
Transform the current sequential workflow interface into a Wikipedia-style layout while preserving the existing navigation bar and header from `Layout.tsx`. This design incorporates a left sidebar (timer, step navigation, quick tools), main content area (detailed protocol sections), and right sidebar (clinical pearls).

---

## Design Analysis: Stitch vs Current

### Stitch Design (Target)
- **Left Sidebar (Fixed):**
  - Stroke Timer (compact, always visible)
  - Protocol Steps (numbered list, shows current step)
  - Quick Tools (4-button grid: NIHSS Calc, tPA Dosing, Vitals Log, Consults)
- **Main Content (Scrollable):**
  - Wikipedia-style sections with detailed content
  - Inline descriptions and instructions
  - Checkboxes and interactive elements within content
  - Blue vertical line indicator for active section
  - Status tags (IN PROGRESS, PENDING)
- **Right Sidebar (Sticky):**
  - Clinical Pearls section
  - Trial summaries with links
  - Educational content
  - Guidelines references

### Current Design
- Sequential workflow with collapsible cards
- Progress tracker at top
- Bottom drawer for tools
- Single column layout
- Steps unlock sequentially

---

## Execution Plan

### PHASE 1: Layout Structure Setup
**Goal:** Create the 3-column Wikipedia-style layout structure

#### Step 1.1: Create Layout Wrapper Component
- **File:** `src/pages/guide/StrokeBasicsLayout.tsx`
- **Purpose:** Wrapper that provides the 3-column structure
- **Components:**
  - Left sidebar (fixed, ~280px)
  - Main content (flexible, max-width ~900px)
  - Right sidebar (fixed, ~320px)
- **Responsive:** 
  - Desktop: 3 columns
  - Tablet: Hide right sidebar, show as drawer
  - Mobile: Single column, sidebars as overlays

#### Step 1.2: Integrate with Existing Layout
- **File:** `src/pages/guide/StrokeBasics.tsx`
- **Changes:** 
  - Wrap content in new layout component
  - Ensure existing header/navbar from `Layout.tsx` remains unchanged
  - Pass through all existing props/context

**Deliverable:** 3-column layout structure working, existing navbar/header intact

---

### PHASE 2: Left Sidebar Components
**Goal:** Build the left sidebar with timer, step navigation, and quick tools

#### Step 2.1: Compact Timer Component
- **File:** `src/components/article/stroke/SidebarTimer.tsx`
- **Features:**
  - Compact display (smaller than current)
  - Green dot indicator when active
  - "Started [time]" text
  - Start/pause controls (minimal)
  - Collapse/expand button for desktop
- **Design:** Match Stitch's compact timer style
- **Mobile:** Part of left sidebar overlay

#### Step 2.2: Protocol Steps Navigation
- **File:** `src/components/article/stroke/ProtocolStepsNav.tsx`
- **Features:**
  - Numbered list (1-5 steps)
  - Current step highlighted in blue
  - Completed steps show checkmark
  - Click to scroll to section
  - Smooth scroll behavior
  - Collapsible on desktop (icon-only when collapsed)
- **Design:** Match Stitch's step list style
- **Mobile:** Part of left sidebar overlay

#### Step 2.3: Quick Tools Grid
- **File:** `src/components/article/stroke/QuickToolsGrid.tsx`
- **Features:**
  - 4-button grid (2x2)
  - Icons: NIHSS Calc, tPA Dosing, Vitals Log, Consults
  - Each button opens calculator/modal
  - Hover states
  - Collapsible on desktop (icon-only when collapsed)
- **Design:** Match Stitch's square button grid
- **Mobile:** Part of left sidebar overlay

**Deliverable:** Complete left sidebar with all three sections

---

### PHASE 3: Main Content Redesign
**Goal:** Transform main content into Wikipedia-style sections

#### Step 3.1: Section Component
- **File:** `src/components/article/stroke/ProtocolSection.tsx`
- **Features:**
  - Numbered section header (e.g., "3. Laboratory Workup")
  - Blue vertical line indicator for active section
  - Status tag (IN PROGRESS, PENDING, COMPLETED)
  - Description text (Wikipedia-style)
  - Inline content (not collapsible cards)
- **Design:** Match Stitch's section styling

#### Step 3.2: Content Components
- **Files:** 
  - `src/components/article/stroke/LKWSection.tsx`
  - `src/components/article/stroke/LVOSection.tsx`
  - `src/components/article/stroke/LabsSection.tsx`
  - `src/components/article/stroke/VitalsSection.tsx`
  - `src/components/article/stroke/TreatmentSection.tsx`
- **Features:**
  - Wikipedia-style formatting
  - Inline checkboxes
  - Alert boxes (orange/yellow for warnings)
  - Form inputs within content
  - **"Next" button at bottom** (instead of "Mark Complete & Continue")
  - Sections remain editable after completion

#### Step 3.3: Scroll Spy Integration
- **File:** `src/hooks/useScrollSpy.ts`
- **Purpose:** Highlight current section in left sidebar as user scrolls
- **Features:**
  - Intersection Observer API
  - Update active step in sidebar
  - Smooth scroll to section on click

**Deliverable:** Wikipedia-style main content with all sections

---

### PHASE 4: Right Sidebar (Clinical Pearls)
**Goal:** Build the educational right sidebar

#### Step 4.1: Clinical Pearls Component
- **File:** `src/components/article/stroke/ClinicalPearls.tsx`
- **Features:**
  - Sticky positioning
  - Section title "CLINICAL PEARLS"
  - **Toggle at top:** Quick Learning vs Deep Learning
    - Quick: Essential pearls only (compact view)
    - Deep: Full educational content (expanded view)
  - Trial summaries (e.g., STROKE-AF Trial)
  - Guidelines links
  - Images/diagrams support
  - External link icons
  - Collapsible on desktop
- **Design:** Match Stitch's right sidebar style
- **Mobile:** Popup modal (non-navigating), triggered by button in header

#### Step 4.2: Dynamic Content Loading
- **File:** `src/data/strokeClinicalPearls.ts`
- **Purpose:** Data structure for clinical pearls
- **Features:**
  - Context-aware content (show relevant pearls for current section)
  - Trial summaries with links
  - Guideline references
  - Image support

**Deliverable:** Right sidebar with contextual clinical pearls

---

### PHASE 5: Integration & Polish
**Goal:** Integrate all components and polish the experience

#### Step 5.1: State Management
- **File:** `src/pages/guide/StrokeBasicsWorkflow.tsx` (refactor)
- **Changes:**
  - Remove collapsible card logic
  - Add scroll spy state
  - Manage section completion state
  - Track active section

#### Step 5.2: Responsive Behavior
- **Files:** All layout components
- **Features:**
  - **Desktop (>1024px):** 
    - 3 columns visible
    - Left sidebar collapsible (toggle button)
    - Right sidebar always visible, collapsible
  - **Tablet (768px - 1024px):** 
    - Left sidebar collapsible
    - Right sidebar as modal popup (button in header)
    - Main content flexible
  - **Mobile (<768px):** 
    - Single column layout
    - Left sidebar: Slide-in overlay/drawer (hamburger menu trigger)
    - Right sidebar: Modal popup (button in header, doesn't navigate)
    - Main content: Full width when sidebars hidden

#### Step 5.3: Animations & Transitions
- **Files:** CSS and component files
- **Features:**
  - Smooth scroll to sections
  - Section highlight transitions
  - Sidebar slide-in/out animations
  - Status tag transitions

#### Step 5.4: Testing & Refinement
- **Checklist:**
  - [ ] All sections render correctly
  - [ ] Scroll spy works
  - [ ] Left sidebar navigation works
  - [ ] Right sidebar sticky positioning works
  - [ ] Responsive breakpoints work
  - [ ] Existing navbar/header unchanged
  - [ ] All interactive elements work
  - [ ] Dark mode support

**Deliverable:** Fully integrated Wikipedia-style interface

---

## File Structure

```
src/
├── pages/guide/
│   ├── StrokeBasics.tsx (updated)
│   └── out.tsx (new)
├── components/article/stroke/
│   ├── SidebarTimer.tsx (new)
│   ├── ProtocolStepsNav.tsx (new)
│   ├── QuickToolsGrid.tsx (new)
│   ├── ProtocolSection.tsx (new)
│   ├── LKWSection.tsx (new)
│   ├── LVOSection.tsx (new)
│   ├── LabsSection.tsx (new)
│   ├── VitalsSection.tsx (new)
│   ├── TreatmentSection.tsx (new)
│   └── ClinicalPearls.tsx (new)
├── hooks/
│   └── useScrollSpy.ts (new)
└── data/
    └── strokeClinicalPearls.ts (new)
```

---

## Design Specifications

### Left Sidebar
- **Width:** 280px (desktop)
- **Background:** White (light) / Gray-900 (dark)
- **Padding:** 16px
- **Sections:**
  1. Timer: ~80px height
  2. Protocol Steps: Flexible
  3. Quick Tools: ~200px height

### Main Content
- **Max Width:** 900px
- **Padding:** 32px (desktop), 16px (mobile)
- **Section Spacing:** 48px between sections
- **Active Indicator:** Blue vertical line (4px width, full section height)

### Right Sidebar
- **Width:** 320px (desktop)
- **Sticky:** Yes (stays visible while scrolling)
- **Background:** White (light) / Gray-900 (dark)
- **Padding:** 24px

### Colors
- **Active Section:** Blue-600 (#2563EB)
- **Completed:** Green-600 (#10B981)
- **Pending:** Gray-400 (#9CA3AF)
- **Alert:** Orange-500 (#F59E0B)

---

## Step-by-Step Execution

### ✅ STEP 1: Layout Structure (Phase 1)
**Status:** Pending approval
**Estimated Time:** 1-2 hours
**Dependencies:** None

### ⏳ STEP 2: Left Sidebar (Phase 2)
**Status:** Waiting for Step 1
**Estimated Time:** 2-3 hours
**Dependencies:** Step 1 complete

### ⏳ STEP 3: Main Content (Phase 3)
**Status:** Waiting for Step 2
**Estimated Time:** 3-4 hours
**Dependencies:** Step 2 complete

### ⏳ STEP 4: Right Sidebar (Phase 4)
**Status:** Waiting for Step 3
**Estimated Time:** 2-3 hours
**Dependencies:** Step 3 complete

### ⏳ STEP 5: Integration (Phase 5)
**Status:** Waiting for Step 4
**Estimated Time:** 2-3 hours
**Dependencies:** Step 4 complete

---

## Success Criteria

- [ ] 3-column Wikipedia-style layout implemented
- [ ] Existing navbar/header unchanged
- [ ] Left sidebar with timer, steps, and tools
- [ ] Main content with Wikipedia-style sections
- [ ] Right sidebar with clinical pearls
- [ ] Scroll spy highlights active section
- [ ] Responsive design (desktop/tablet/mobile)
- [ ] All interactive elements work
- [ ] Dark mode support
- [ ] Smooth animations and transitions

---

## Notes

- **Preserve Existing:** Navigation bar and header from `Layout.tsx` must remain unchanged
- **Progressive Enhancement:** Build desktop first, then add responsive behavior
- **Component Reuse:** Reuse existing logic from `EligibilityCheckerV2`, `LVOScreenerV2`, etc., but adapt UI
- **Testing:** Test each phase before moving to next
- **Approval:** Get approval after each step before proceeding

---

## Questions for Approval

1. ✅ **Left sidebar collapsible on desktop?** YES - Collapsible with toggle button
   - **Mobile solution:** Slide-in overlay/drawer from left side. Hamburger menu button in header to open. Swipe to close or tap backdrop.
   
2. ✅ **Right sidebar visibility?** Always visible, collapsible with toggle
   - **Quick vs Deep Learning toggle:** Add toggle at top of right sidebar
     - Quick mode: Shows essential pearls only (compact)
     - Deep mode: Shows full educational content (expanded)
   - **Mobile solution:** Popup modal (doesn't navigate away). Button in header to open. Modal shows full clinical pearls content.

3. ✅ **Button text:** Change to "Next" (instead of "Mark Complete & Continue")

4. ✅ **Mobile layout:** Overlays (not stacked)

5. **Section editability:** Sections remain editable after completion (can go back and modify)

---

## Approved Decisions Summary

### Left Sidebar
- **Desktop:** Collapsible with toggle button (collapsed = icon-only, expanded = full width)
- **Mobile:** Slide-in overlay/drawer from left, triggered by hamburger menu

### Right Sidebar
- **Desktop:** Always visible, collapsible
- **Toggle:** Quick Learning (compact) vs Deep Learning (expanded) at top
- **Mobile:** Popup modal (non-navigating), triggered by button in header

### Buttons
- Completion buttons: "Next" (instead of "Mark Complete & Continue")

### Mobile Behavior
- Left sidebar: Overlay/drawer
- Right sidebar: Modal popup
- Main content: Full width when sidebars hidden

---

**Last Updated:** 2025-01-XX
**Status:** ✅ Approved - Ready for Implementation
