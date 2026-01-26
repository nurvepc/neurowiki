# Neurowiki.ai - Project Structure

**Last Updated:** 2026-01-19  
**Framework:** React 19.2.3 + Vite 6.2.0 + TypeScript 5.8.2  
**Build Tool:** Vite  
**Routing:** React Router DOM 7.11.0

---

## Root Directory Tree

```
neurowiki/
├── components/              # Root-level shared components
│   ├── DisclaimerModal.tsx
│   ├── Layout.tsx           # Main layout wrapper (CRITICAL - DO NOT MODIFY)
│   ├── LearningPearl.tsx
│   ├── MarkdownRenderer.tsx
│   ├── NihssItemRow.tsx
│   ├── NihssPearl.tsx
│   └── ToolManagerModal.tsx
│
├── data/                    # Static content data
│   ├── guideContent.ts      # All guide articles and trials content
│   └── toolContent.ts       # Calculator/tool definitions
│
├── docs/                    # Documentation
│   ├── CALCULATOR_GUIDELINES.md
│   ├── design_audit.md
│   ├── design_system.md
│   ├── FEEDBACK_SETUP.md
│   └── INTERLINKING_REPORT.md
│
├── functions/               # Netlify serverless functions
│   └── api/
│       └── feedback.ts      # Feedback form submission handler
│
├── hooks/                   # Root-level custom hooks
│   └── useFavorites.ts
│
├── internalLinks/           # Internal linking system
│   ├── autoLink.tsx         # Auto-linking component
│   ├── backlinks.ts         # Backlink generation
│   └── registry.ts          # Link registry
│
├── pages/                   # Page components (top-level routes)
│   ├── Calculators.tsx     # /calculators - Tool listing page
│   ├── ElanPathway.tsx     # /calculators/elan-pathway
│   ├── EvtPathway.tsx      # /calculators/evt-pathway
│   ├── GCAPathway.tsx      # /calculators/gca-pathway
│   ├── Home.tsx            # / - Homepage
│   ├── MigrainePathway.tsx # /calculators/migraine-pathway
│   ├── NihssCalculator.tsx # /calculators/nihss
│   ├── ResidentGuide.tsx   # /guide - Guide landing & article renderer
│   ├── StatusEpilepticusPathway.tsx
│   ├── TrialsPage.tsx      # /trials - Trials landing page
│   └── Wiki.tsx            # /wiki/:topic - Legacy wiki route
│
├── public/                  # Static assets (served as-is)
│   ├── _redirects          # Netlify redirects
│   ├── og-image.png         # Open Graph default image
│   ├── robots.txt
│   └── sitemap.xml
│
├── services/                # External service integrations
│   └── gemini.ts           # Google Gemini API client
│
├── src/                     # Source code (main application)
│   ├── App.tsx             # Root component + routing
│   ├── components/         # Reusable UI components
│   │   ├── article/        # Article-specific components
│   │   │   ├── ArticleLayout.tsx
│   │   │   ├── Callouts.tsx
│   │   │   ├── Paragraph.tsx
│   │   │   ├── Section.tsx
│   │   │   ├── Term.tsx
│   │   │   ├── Trial.tsx
│   │   │   └── index.ts
│   │   ├── CalculatorResultButton.tsx
│   │   ├── clinical/       # Clinical-specific components
│   │   ├── CollapsibleSection.tsx
│   │   ├── ComingSoon.tsx
│   │   ├── DisclaimerModal.tsx
│   │   ├── FeedbackButton.tsx
│   │   ├── FeedbackModal.tsx
│   │   ├── PublishGate.tsx  # Content gating component
│   │   ├── SelectionCard.tsx
│   │   ├── Seo.tsx         # SEO metadata component
│   │   └── index.ts
│   ├── config/
│   │   └── contentStatus.ts # Content publication status
│   ├── contexts/
│   │   └── DarkModeContext.tsx # Dark mode state management
│   ├── hooks/
│   │   ├── useCalculatorAnalytics.ts
│   │   └── useNavigationSource.ts
│   ├── pages/
│   │   ├── Calculators.tsx
│   │   └── guide/          # Individual guide articles
│   │       ├── AcuteStrokeMgmt.tsx
│   │       ├── AlteredMentalStatus.tsx
│   │       ├── Gbs.tsx
│   │       ├── HeadacheWorkup.tsx
│   │       ├── IchManagement.tsx
│   │       ├── IvTpa.tsx
│   │       ├── Meningitis.tsx
│   │       ├── MultipleSclerosis.tsx
│   │       ├── MyastheniaGravis.tsx
│   │       ├── SeizureWorkup.tsx
│   │       ├── StatusEpilepticus.tsx
│   │       ├── StrokeBasics.tsx
│   │       ├── Thrombectomy.tsx
│   │       ├── Vertigo.tsx
│   │       └── WeaknessWorkup.tsx
│   ├── seo/
│   │   ├── legacyHashRedirect.ts
│   │   ├── routeMeta.ts    # Route metadata definitions
│   │   └── sitemapRoutes.ts
│   └── utils/
│       ├── analytics.ts
│       └── legacyHashRedirect.ts
│
├── utils/                   # Root-level utilities
│   └── nihssShortcuts.ts
│
├── index.css                # Global styles + Tailwind imports
├── index.html               # HTML entry point
├── index.tsx                # React entry point
├── metadata.json            # Site metadata
├── package.json
├── tailwind.config.js       # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
├── types.ts                 # Global TypeScript types
└── vite.config.ts           # Vite build configuration
```

---

## Key Directories Explained

### `/components` (Root Level)
**Purpose:** Shared components used across the entire application  
**Critical Component:** `Layout.tsx` - Main application layout wrapper. **DO NOT MODIFY** without understanding full routing structure.

**Key Files:**
- `Layout.tsx` - Handles sidebar navigation, header, mobile navigation, dark mode toggle, search functionality
- `ToolManagerModal.tsx` - Manages pinned tools in sidebar
- `DisclaimerModal.tsx` - Legal disclaimer modal

### `/pages` (Root Level)
**Purpose:** Top-level page components that correspond to routes  
**Routing Pattern:** Each file maps to a route in `src/App.tsx`

**Key Pages:**
- `Home.tsx` → `/` - Landing page
- `Calculators.tsx` → `/calculators` - Tool listing with filters
- `ResidentGuide.tsx` → `/guide` and `/guide/:topicId` - Guide articles
- `TrialsPage.tsx` → `/trials` - Clinical trials landing page

### `/src/components`
**Purpose:** Reusable UI components organized by feature  
**Structure:**
- `article/` - Components for rendering article content (markdown, sections, callouts)
- `clinical/` - Clinical-specific UI components
- Root level - General-purpose components (buttons, modals, cards)

### `/src/pages/guide`
**Purpose:** Individual guide article components  
**Pattern:** Each file is a standalone article component wrapped by `PublishGate`

### `/data`
**Purpose:** Static content data (not fetched from API)  
**Key Files:**
- `guideContent.ts` - All guide articles and trials content (large file, ~1000+ lines)
- `toolContent.ts` - Calculator/tool metadata and definitions

### `/public`
**Purpose:** Static assets served directly (no processing)  
**Files:**
- `_redirects` - Netlify redirect rules
- `og-image.png` - Default Open Graph image
- `robots.txt`, `sitemap.xml` - SEO files

### `/functions/api`
**Purpose:** Netlify serverless functions  
**Current Functions:**
- `feedback.ts` - Handles feedback form submissions

### `/src/contexts`
**Purpose:** React Context providers  
**Current Contexts:**
- `DarkModeContext.tsx` - Manages dark/light mode state globally

### `/src/hooks`
**Purpose:** Custom React hooks  
**Hooks:**
- `useCalculatorAnalytics.ts` - Tracks calculator usage
- `useNavigationSource.ts` - Tracks navigation source (from=guide, etc.)

### `/src/seo`
**Purpose:** SEO-related utilities and metadata  
**Files:**
- `routeMeta.ts` - Route metadata definitions
- `sitemapRoutes.ts` - Sitemap generation
- `legacyHashRedirect.ts` - Legacy URL redirect handling

---

## External Dependencies

### Production Dependencies
| Package | Version | Purpose |
|---------|---------|---------|
| `react` | ^19.2.3 | UI framework |
| `react-dom` | ^19.2.3 | React DOM renderer |
| `react-router-dom` | ^7.11.0 | Client-side routing |
| `react-markdown` | ^10.1.0 | Markdown rendering |
| `lucide-react` | ^0.562.0 | Icon library |
| `@google/genai` | ^1.34.0 | Google Gemini AI API client |
| `resend` | ^6.8.0 | Email service (for feedback) |

### Development Dependencies
| Package | Version | Purpose |
|---------|---------|---------|
| `vite` | ^6.2.0 | Build tool and dev server |
| `@vitejs/plugin-react` | ^5.0.0 | Vite React plugin |
| `typescript` | ~5.8.2 | Type checking |
| `tailwindcss` | ^4.1.18 | Utility-first CSS framework |
| `autoprefixer` | ^10.4.23 | CSS vendor prefixing |
| `postcss` | ^8.5.6 | CSS processing |
| `@types/node` | ^22.14.0 | Node.js type definitions |
| `@netlify/functions` | ^5.1.2 | Netlify serverless functions |

---

## Build & Development

### Scripts (from package.json)
- `npm run dev` - Start Vite dev server (port 3000)
- `npm run build` - Production build (outputs to `/dist`)
- `npm run preview` - Preview production build

### Build Output
- **Output Directory:** `/dist`
- **Entry Point:** `index.html`
- **Asset Handling:** Vite handles bundling, code splitting, and asset optimization

### Environment Variables
- `GEMINI_API_KEY` - Google Gemini API key (used in `services/gemini.ts`)
- Loaded via Vite's `loadEnv` in `vite.config.ts`

---

## Architecture Notes

### Routing Structure
- **Router:** React Router DOM (BrowserRouter)
- **Layout:** All routes wrapped in `<Layout>` component
- **Route Protection:** `PublishGate` component wraps protected content
- **Legacy Support:** Hash-based URLs redirected via `handleLegacyHashRedirect()`

### State Management
- **Global State:** React Context (`DarkModeContext`)
- **Local Storage:** Used for:
  - Dark mode preference (`neurowiki-dark-mode`)
  - Favorites (`neurowiki-favorites`)
  - Sidebar tools (`neurowiki-sidebar-tools`)

### Styling Approach
- **Framework:** Tailwind CSS 4.1.18
- **Dark Mode:** Class-based (`darkMode: 'class'`)
- **Custom Colors:** Extended Tailwind theme with `neuro`, `teal`, `jet`, `surface` color palettes
- **Responsive:** Mobile-first approach with `md:` breakpoints

### Content Management
- **Static Content:** All content in `/data/guideContent.ts` (not CMS-driven)
- **Markdown:** Articles rendered via `react-markdown`
- **Internal Linking:** Custom auto-linking system in `/internalLinks`

---

## Critical Files (DO NOT MODIFY Without Understanding)

1. **`components/Layout.tsx`** - Main layout, navigation, sidebar logic
2. **`src/App.tsx`** - Routing configuration
3. **`data/guideContent.ts`** - All content data
4. **`src/contexts/DarkModeContext.tsx`** - Dark mode state management
5. **`vite.config.ts`** - Build configuration

---

## File Naming Conventions

- **Components:** PascalCase (e.g., `Layout.tsx`, `FeedbackButton.tsx`)
- **Pages:** PascalCase (e.g., `Home.tsx`, `ResidentGuide.tsx`)
- **Utilities:** camelCase (e.g., `analytics.ts`, `legacyHashRedirect.ts`)
- **Data Files:** camelCase (e.g., `guideContent.ts`, `toolContent.ts`)
- **Config Files:** kebab-case or camelCase (e.g., `vite.config.ts`, `tailwind.config.js`)

---

## Import Path Aliases

Configured in `tsconfig.json` and `vite.config.ts`:
- `@/*` → `./*` (root directory)

Example: `import { useDarkMode } from '@/src/contexts/DarkModeContext'`
