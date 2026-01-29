# Stroke Basics Wikipedia-Style Design Artifact

## Visual Layout Structure

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  [Existing Navbar & Header from Layout.tsx - UNCHANGED]                     │
├──────────┬──────────────────────────────────────────────┬───────────────────┤
│          │                                              │                   │
│  LEFT    │           MAIN CONTENT                       │   RIGHT           │
│  SIDEBAR │           (Wikipedia Style)                  │   SIDEBAR         │
│          │                                              │                   │
│ ┌──────┐ │  ┌──────────────────────────────────────┐  │  ┌──────────────┐ │
│ │TIMER │ │  │  Stroke Code Basics                   │  │  │ CLINICAL     │ │
│ │00:32 │ │  │  Real-time emergency decision...     │  │  │ PEARLS       │ │
│ │      │ │  │                                       │  │  │              │ │
│ │🟢    │ │  │  ┌─────────────────────────────────┐ │  │  │ • STROKE-AF  │ │
│ └──────┘ │  │  │ 1. Last Known Well              │ │  │  │   Trial      │ │
│          │  │  │ [IN PROGRESS]                   │ │  │  │              │ │
│ ┌──────┐ │  │  │                                 │ │  │  │ • PFO &      │ │
│ │STEPS │ │  │  │ Establish the precise time...   │ │  │  │   Cryptogenic│ │
│ │      │ │  │  │                                 │ │  │  │              │ │
│ │✓ 1   │ │  │  │ [Time Input Fields]            │ │  │  │ [Images]     │ │
│ │✓ 2   │ │  │  │                                 │ │  │  │              │ │
│ │● 3   │ │  │  │ [Status: Within 4.5h window]   │ │  │  │ [Links]      │ │
│ │○ 4   │ │  │  │                                 │ │  │  │              │ │
│ │○ 5   │ │  │  │ [Mark Complete & Continue →]    │ │  │  │              │ │
│ └──────┘ │  │  └─────────────────────────────────┘ │  │  └──────────────┘ │
│          │  │                                       │  │                   │
│ ┌──────┐ │  │  ┌─────────────────────────────────┐ │  │                   │
│ │TOOLS │ │  │  │ 2. LVO Screening                │ │  │                   │
│ │      │ │  │  │ [PENDING]                       │ │  │                   │
│ │[NIHSS│ │  │  │                                 │ │  │                   │
│ │ Calc]│ │  │  │ Screen for Large Vessel...      │ │  │                   │
│ │      │ │  │  │                                 │ │  │                   │
│ │[tPA  │ │  │  │ [Assessment checkboxes]         │ │  │                   │
│ │Dosing]│ │  │  │                                 │ │  │                   │
│ │      │ │  │  └─────────────────────────────────┘ │  │                   │
│ │[Vitals│ │  │                                       │  │                   │
│ │ Log] │ │  │  ┌─────────────────────────────────┐ │  │                   │
│ │      │ │  │  │ 3. Labs & Cardiac              │ │  │                   │
│ │[Cons]│ │  │  │ [IN PROGRESS]                  │ │  │                   │
│ └──────┘ │  │  │                                 │ │  │                   │
│          │  │  │ ⚠️ Alert: Only Blood Glucose... │ │  │                   │
│          │  │  │                                 │ │  │                   │
│          │  │  │ STAT - IMMEDIATE:               │ │  │                   │
│          │  │  │ ☐ Point of Care Glucose         │ │  │                   │
│          │  │  │ ☐ PT / INR                      │ │  │                   │
│          │  │  │                                 │ │  │                   │
│          │  │  │ SECONDARY WORKUP:               │ │  │                   │
│          │  │  │ ☐ Basic Metabolic Panel        │ │  │                   │
│          │  │  │ ☐ Troponin I                    │ │  │                   │
│          │  │  └─────────────────────────────────┘ │  │                   │
│          │  │                                       │  │                   │
│          │  │  [More sections continue...]         │  │                   │
│          │  │                                       │  │                   │
└──────────┴──────────────────────────────────────────────┴───────────────────┘
```

## Component Breakdown

### Left Sidebar (280px width)

#### 1. Stroke Timer
```
┌─────────────────┐
│ STROKE TIMER    │
│ 🟢 00:32:15     │
│ Started 09:41 AM│
│ [Start] [Pause] │
└─────────────────┘
```

#### 2. Protocol Steps
```
┌─────────────────┐
│ PROTOCOL STEPS  │
│                 │
│ ✓ 1 Last Known  │
│    Well         │
│ ✓ 2 LVO Screen  │
│ ● 3 Labs &      │
│    Cardiac      │
│ ○ 4 CT Imaging  │
│ ○ 5 Treatment   │
│    Decision     │
└─────────────────┘
```

#### 3. Quick Tools
```
┌─────────────────┐
│ QUICK TOOLS     │
│                 │
│ ┌────┐ ┌────┐  │
│ │NIHSS│ │tPA │  │
│ │Calc │ │Dose│  │
│ └────┘ └────┘  │
│ ┌────┐ ┌────┐  │
│ │Vital│ │Cons│  │
│ │Log  │ │ults│  │
│ └────┘ └────┘  │
└─────────────────┘
```

### Main Content (Wikipedia Style)

#### Section Structure
```
┌─────────────────────────────────────────────┐
│ │ 3. Laboratory Workup          [IN PROGRESS]│
│ │                                            │
│ │ Laboratory and cardiac evaluation should   │
│ │ proceed concurrently with imaging...       │
│ │                                            │
│ │ ⚠️ CRITICAL ALERT                          │
│ │ Only Blood Glucose is mandatory before...  │
│ │                                            │
│ │ STAT - IMMEDIATE:                          │
│ │ ☐ Point of Care Glucose                    │
│ │ ☐ PT / INR                                 │
│ │ ☐ PTT                                      │
│ │ ☐ CBC with Platelets                       │
│ │                                            │
│ │ SECONDARY WORKUP:                          │
│ │ ☐ Basic Metabolic Panel                    │
│ │ ☐ Troponin I                               │
│ │ ☐ Lipid Panel                              │
│ │ ☐ Hemoglobin A1c                           │
│ │                                            │
│ │ [Mark Complete & Continue →]               │
└─────────────────────────────────────────────┘
```

**Key Features:**
- Blue vertical line (│) on left for active section
- Status tag on right (IN PROGRESS, PENDING, COMPLETED)
- Wikipedia-style descriptive text
- Inline checkboxes and form elements
- Alert boxes for critical information
- Completion button at bottom

### Right Sidebar (320px width, sticky)

```
┌──────────────────────┐
│ CLINICAL PEARLS       │
│                       │
│ • STROKE-AF Trial     │
│   A randomized trial  │
│   demonstrating...    │
│   [View Study →]      │
│                       │
│ • PFO & Cryptogenic   │
│   [Image: PFO diagram]│
│   A Patent Foramen... │
│   [Read Guidelines →] │
│                       │
│ [More pearls...]      │
└──────────────────────┘
```

## Responsive Behavior

### Desktop (>1024px)
- 3 columns visible
- Left sidebar: Fixed 280px
- Main content: Flexible, max 900px
- Right sidebar: Fixed 320px, sticky

### Tablet (768px - 1024px)
- Left sidebar: Visible (280px)
- Main content: Flexible
- Right sidebar: Hidden, accessible via button/drawer

### Mobile (<768px)
- Single column layout
- **Left sidebar:** Slide-in overlay/drawer from left
  - Triggered by hamburger menu button in header
  - Swipe left or tap backdrop to close
  - Width: ~280px, full height
- **Main content:** Full width when sidebars hidden
- **Right sidebar:** Modal popup (centered, doesn't navigate)
  - Triggered by "Clinical Pearls" button in header
  - Tap backdrop or X to close
  - Width: ~90% screen, max-height: 80vh
  - Contains Quick/Deep Learning toggle

## Color Scheme

- **Active Section:** Blue-600 (#2563EB) - vertical line and highlight
- **Completed Step:** Green-600 (#10B981) - checkmark
- **Current Step:** Blue-600 (#2563EB) - filled circle
- **Pending Step:** Gray-400 (#9CA3AF) - empty circle
- **Alert Box:** Orange-500 (#F59E0B) - warning background
- **Critical Alert:** Red-500 (#EF4444) - critical warnings

## Interaction Patterns

1. **Scroll Spy:** As user scrolls, active section highlighted in left sidebar
2. **Click Navigation:** Click step in sidebar → smooth scroll to section
3. **Section Completion:** Click "Mark Complete & Continue" → next section unlocks
4. **Quick Tools:** Click tool → opens calculator/modal (preserves context)
5. **Clinical Pearls:** Context-aware, updates based on current section

## Key Differences from Current Design

| Current | New (Wikipedia Style) |
|---------|----------------------|
| Collapsible cards | Inline sections |
| Bottom drawer | Left sidebar grid |
| Single column | 3-column layout |
| Progress bar at top | Step list in sidebar |
| Sequential unlock | Scroll-based + completion |
| No right sidebar | Clinical pearls sidebar |

## Preserved Elements

✅ Existing navbar from `Layout.tsx`
✅ Existing header from `Layout.tsx`
✅ Dark mode support
✅ All existing functionality
✅ Component logic (reused, UI adapted)

---

**This artifact serves as the visual reference for the redesign implementation.**
