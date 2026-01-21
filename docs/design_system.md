# Neurowiki Design System

**Version:** 1.0  
**Last Updated:** January 2026  
**Based on:** Design Audit Findings

---

## Table of Contents

1. [Typography Scale](#typography-scale)
2. [Spacing System](#spacing-system)
3. [Color Palette](#color-palette)
4. [Component Standards](#component-standards)
5. [Grid & Layout Rules](#grid--layout-rules)
6. [Touch Target Requirements](#touch-target-requirements)
7. [Accessibility Standards](#accessibility-standards)
8. [Content Injection Rules](#content-injection-rules)
9. [Mobile-First Breakpoints](#mobile-first-breakpoints)

---

## Typography Scale

### ✅ DO: Use These Standard Classes

**Headings:**
```tsx
// Page Title (H1) - Main page headings
<h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
  Page Title
</h1>

// Section Title (H2) - Major section headings
<h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
  Section Title
</h2>

// Card Title (H3) - Card and subsection headings
<h3 className="text-xl md:text-2xl font-semibold text-slate-800">
  Card Title
</h3>

// Subsection (H4) - Minor headings
<h4 className="text-lg md:text-xl font-semibold text-slate-800">
  Subsection
</h4>
```

**Body Text:**
```tsx
// Body Large - Emphasized body text
<p className="text-base font-normal text-slate-700 leading-relaxed">
  Body Large Text
</p>

// Body - Default body text
<p className="text-sm md:text-base font-normal text-slate-600 leading-relaxed">
  Default body text
</p>

// Small/Caption - Secondary text, metadata
<p className="text-xs font-normal text-slate-500">
  Small text or caption
</p>
```

**UI Elements:**
```tsx
// Button Text
<button className="text-sm md:text-base font-bold">
  Button Text
</button>

// Label Text
<label className="text-xs font-bold uppercase tracking-wider text-slate-500">
  Label Text
</label>

// Navigation Text
<nav className="text-sm font-medium text-slate-600">
  Navigation Item
</nav>
```

### ❌ DON'T: Avoid These Patterns

```tsx
// ❌ NEVER use arbitrary text sizes below 12px
<span className="text-[10px]">Too Small</span>

// ❌ NEVER use inconsistent heading sizes
<h1 className="text-2xl">Should be text-3xl md:text-4xl</h1>

// ❌ NEVER mix font weights without reason
<h2 className="text-2xl font-black">Use font-bold for consistency</h2>

// ✅ CORRECT: Use standard scale
<span className="text-xs font-bold uppercase tracking-wider">Label</span>
```

### Typography Reference Table

| Element | Mobile | Desktop | Weight | Usage |
|---------|--------|---------|--------|-------|
| Page Title | `text-3xl` (30px) | `text-4xl` (36px) | `font-bold` | Main page headings |
| Section Title | `text-2xl` (24px) | `text-3xl` (30px) | `font-bold` | Section headings |
| Card Title | `text-xl` (20px) | `text-2xl` (24px) | `font-semibold` | Card headings |
| Subsection | `text-lg` (18px) | `text-xl` (20px) | `font-semibold` | Minor headings |
| Body Large | `text-base` (16px) | `text-base` (16px) | `font-normal` | Emphasized body |
| Body | `text-sm` (14px) | `text-base` (16px) | `font-normal` | Default body |
| Small/Caption | `text-xs` (12px) | `text-xs` (12px) | `font-normal` | Secondary text |
| Button | `text-sm` (14px) | `text-base` (16px) | `font-bold` | Button text |
| Label | `text-xs` (12px) | `text-xs` (12px) | `font-bold` | Form labels |

**Minimum Text Size:** `text-xs` (12px) - This is the absolute minimum. Never use smaller.

---

## Spacing System

### Container Padding

```tsx
// ✅ Cards - Standard padding
<div className="p-4 md:p-6 bg-white rounded-2xl">
  Card Content
</div>

// ✅ Sections - Page sections
<section className="p-6 md:p-8">
  Section Content
</section>

// ✅ Modals - Modal content
<div className="p-6 md:p-8">
  Modal Content
</div>

// ✅ Content with Fixed Bottom Bars (Mobile)
<div className="pb-40 md:pb-8">
  {/* Content that needs space above fixed action bar */}
</div>
```

### Element Spacing

```tsx
// ✅ Tight Spacing - Related items
<div className="space-y-2">
  Related Items
</div>

// ✅ Normal Spacing - Default spacing
<div className="space-y-4">
  Default Spacing
</div>

// ✅ Relaxed Spacing - Section spacing
<div className="space-y-6">
  Section Items
</div>

// ✅ Loose Spacing - Page sections
<div className="space-y-8 md:space-y-10">
  Page Sections
</div>
```

### Grid Gaps

```tsx
// ✅ Tight Grid - Dense layouts
<div className="grid grid-cols-2 gap-2">
  Dense Grid
</div>

// ✅ Normal Grid - Default grids
<div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
  Default Grid
</div>

// ✅ Relaxed Grid - Spacious grids
<div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
  Spacious Grid
</div>
```

### Spacing Reference Table

| Element | Mobile | Desktop | Usage |
|---------|--------|---------|-------|
| Card Padding | `p-4` (16px) | `p-6` (24px) | Cards, modals |
| Section Padding | `p-6` (24px) | `p-8` (32px) | Page sections |
| Tight Spacing | `space-y-2` (8px) | `space-y-2` (8px) | Related items |
| Normal Spacing | `space-y-4` (16px) | `space-y-4` (16px) | Default spacing |
| Relaxed Spacing | `space-y-6` (24px) | `space-y-6` (24px) | Section spacing |
| Loose Spacing | `space-y-8` (32px) | `space-y-10` (40px) | Page sections |
| Bottom Padding (Fixed Bars) | `pb-40` (160px) | `pb-8` (32px) | Content above fixed bars |
| Grid Gap (Normal) | `gap-3` (12px) | `gap-4` (16px) | Default grids |
| Grid Gap (Relaxed) | `gap-4` (16px) | `gap-6` (24px) | Spacious grids |

---

## Color Palette

### ✅ DO: Use Approved Colors

**Primary (Neuro Blue):**
```tsx
// Primary Actions
<button className="bg-neuro-600 hover:bg-neuro-700 text-white">
  Primary Button
</button>

// Primary Backgrounds
<div className="bg-neuro-50 border-neuro-100">
  Primary Background
</div>

// Primary Text
<span className="text-neuro-600">Primary Text</span>
```

**Semantic Colors:**
```tsx
// Success
<div className="bg-emerald-50 text-emerald-600 border-emerald-100">
  Success Message
</div>

// Warning
<div className="bg-amber-50 text-amber-600 border-amber-100">
  Warning Message
</div>

// Danger
<div className="bg-red-50 text-red-600 border-red-100">
  Error Message
</div>
```

**Neutral (Slate):**
```tsx
// Text Colors
<p className="text-slate-900">Primary Text</p>
<p className="text-slate-700">Body Text</p>
<p className="text-slate-600">Secondary Text</p>
<p className="text-slate-500">Muted Text</p>
<p className="text-slate-400">Disabled Text</p>

// Backgrounds
<div className="bg-slate-50">Light Background</div>
<div className="bg-slate-100">Subtle Background</div>
<div className="bg-slate-900 text-white">Dark Background</div>
```

### ❌ DON'T: Avoid These Colors

```tsx
// ❌ NEVER use blue-* colors (use neuro-* instead)
<button className="bg-blue-500">Use neuro-500</button>

// ❌ NEVER use gray-* colors (use slate-* instead)
<p className="text-gray-600">Use slate-600</p>

// ✅ CORRECT: Use approved palette
<button className="bg-neuro-500 text-white">Correct</button>
<p className="text-slate-600">Correct</p>
```

### Color Reference Table

| Purpose | Color | Classes | Usage |
|---------|-------|---------|-------|
| Primary Action | Neuro Blue | `bg-neuro-600`, `text-neuro-600` | Buttons, links, highlights |
| Primary Background | Neuro Light | `bg-neuro-50`, `border-neuro-100` | Card backgrounds, sections |
| Success | Emerald | `bg-emerald-50`, `text-emerald-600` | Success messages, positive states |
| Warning | Amber | `bg-amber-50`, `text-amber-600` | Warnings, caution states |
| Danger | Red | `bg-red-50`, `text-red-600` | Errors, critical states |
| Primary Text | Slate Dark | `text-slate-900` | Headings, important text |
| Body Text | Slate Medium | `text-slate-700` | Default body text |
| Secondary Text | Slate Light | `text-slate-600` | Secondary content |
| Muted Text | Slate Muted | `text-slate-500` | Captions, metadata |
| Disabled | Slate Disabled | `text-slate-400` | Disabled states |

**Full Neuro Palette:**
- `neuro-50` through `neuro-900` (defined in `tailwind.config.js`)

---

## Component Standards

### Buttons

**Primary Button:**
```tsx
// ✅ Standard Primary Button
<button className="
  px-6 py-3 
  bg-neuro-600 hover:bg-neuro-700 
  text-white 
  font-bold 
  rounded-xl 
  shadow-lg shadow-neuro-200 
  transition-all 
  transform active:scale-95 
  touch-manipulation
  min-h-[44px]
  focus-visible:ring-2 focus-visible:ring-neuro-500 focus-visible:outline-none
">
  Primary Action
</button>
```

**Secondary Button:**
```tsx
// ✅ Secondary Button
<button className="
  px-6 py-3 
  bg-white hover:bg-slate-50 
  text-slate-700 
  font-bold 
  border-2 border-slate-200 hover:border-slate-300
  rounded-xl 
  transition-all 
  transform active:scale-95 
  touch-manipulation
  min-h-[44px]
  focus-visible:ring-2 focus-visible:ring-neuro-500 focus-visible:outline-none
">
  Secondary Action
</button>
```

**Ghost Button:**
```tsx
// ✅ Ghost Button
<button className="
  px-4 py-2 
  text-slate-600 hover:text-slate-800 
  hover:bg-slate-100 
  font-medium 
  rounded-lg 
  transition-colors 
  touch-manipulation
  min-h-[44px]
  focus-visible:ring-2 focus-visible:ring-neuro-500 focus-visible:outline-none
">
  Ghost Action
</button>
```

**Icon Button:**
```tsx
// ✅ Icon Button (minimum 44px touch target)
<button className="
  p-3 
  text-slate-500 hover:text-slate-700 
  hover:bg-slate-100 
  rounded-full 
  transition-colors 
  touch-manipulation
  min-h-[44px] min-w-[44px]
  focus-visible:ring-2 focus-visible:ring-neuro-500 focus-visible:outline-none
">
  <Icon size={20} />
</button>
```

**Disabled Button:**
```tsx
// ✅ Disabled Button
<button 
  disabled
  className="
    px-6 py-3 
    bg-gray-300 
    text-gray-500 
    font-bold 
    rounded-xl 
    cursor-not-allowed
    min-h-[44px]
  "
>
  Disabled
</button>
```

### Cards

```tsx
// ✅ Standard Card
<div className="
  bg-white 
  p-4 md:p-6 
  rounded-2xl 
  border border-gray-100 
  shadow-sm 
  hover:shadow-lg 
  hover:border-neuro-200 
  transition-all
">
  Card Content
</div>

// ✅ Card with Header
<div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
  <div className="bg-neuro-50 p-4 md:p-6 border-b border-neuro-100">
    <h3 className="text-xl md:text-2xl font-semibold text-slate-800">Card Title</h3>
  </div>
  <div className="p-4 md:p-6">
    Card Content
  </div>
</div>
```

### Input Fields

```tsx
// ✅ Text Input
<input 
  type="text"
  className="
    w-full 
    px-4 py-3 
    border border-gray-200 
    rounded-xl 
    bg-gray-50/50 
    placeholder-gray-400 
    focus:outline-none 
    focus:bg-white 
    focus:ring-2 focus:ring-neuro-500/20 
    focus:border-neuro-500 
    text-base 
    font-medium 
    text-slate-800
    transition-all
    min-h-[44px]
  "
  placeholder="Enter text..."
/>

// ✅ Search Input
<div className="relative">
  <Search className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400" />
  <input 
    type="search"
    className="
      w-full 
      pl-11 pr-4 py-3 
      border border-gray-200 
      rounded-xl 
      bg-gray-50/50 
      placeholder-gray-400 
      focus:outline-none 
      focus:bg-white 
      focus:ring-2 focus:ring-neuro-500/20 
      focus:border-neuro-500 
      text-base 
      font-medium 
      text-slate-800
      transition-all
      min-h-[44px]
    "
    placeholder="Search..."
  />
</div>
```

### Modals

```tsx
// ✅ Modal Structure
<div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-slate-900/60 backdrop-blur-sm">
  <div className="
    bg-white 
    rounded-2xl 
    shadow-2xl 
    max-w-lg 
    w-full 
    overflow-hidden 
    border border-slate-100
  ">
    {/* Header */}
    <div className="bg-neuro-50 p-6 border-b border-neuro-100">
      <h2 className="text-2xl font-bold text-slate-900">Modal Title</h2>
    </div>
    
    {/* Content */}
    <div className="p-6 md:p-8 space-y-4">
      Modal Content
    </div>
    
    {/* Footer */}
    <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row gap-3 justify-end">
      <button>Cancel</button>
      <button>Confirm</button>
    </div>
  </div>
</div>
```

### Selection Cards

```tsx
// ✅ Selection Card (for pathways/forms)
<button className="
  w-full 
  text-left 
  p-5 
  rounded-2xl 
  border-2 
  transition-all 
  duration-200 
  active:scale-[0.99] 
  touch-manipulation
  min-h-[44px]
  focus-visible:ring-2 focus-visible:ring-neuro-500 focus-visible:outline-none
  ${selected 
    ? 'bg-neuro-50 border-neuro-500 text-neuro-900' 
    : 'bg-white border-gray-100 hover:border-gray-200 hover:bg-gray-50 text-slate-700'
  }
">
  <span className="block text-lg font-bold">Option Title</span>
  {description && (
    <span className="text-sm mt-1.5 block leading-relaxed opacity-90">
      Description
    </span>
  )}
</button>
```

---

## Grid & Layout Rules

### Mobile-First Grid System

```tsx
// ✅ Single Column (Mobile) → 2 Columns (Tablet) → 3 Columns (Desktop)
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
  Grid Items
</div>

// ✅ Single Column (Mobile) → 2 Columns (Desktop)
<div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
  Grid Items
</div>

// ✅ Always Single Column
<div className="space-y-4">
  Stacked Items
</div>
```

### Layout Breakpoints

| Breakpoint | Width | Usage |
|------------|-------|-------|
| Mobile (default) | < 768px | Single column, full width |
| Tablet (`md:`) | ≥ 768px | 2 columns, adjusted padding |
| Desktop (`lg:`) | ≥ 1024px | 3 columns, full spacing |

### Common Layout Patterns

**Page Container:**
```tsx
// ✅ Standard Page Layout
<main className="flex-1 overflow-y-auto bg-slate-50/50 p-4 md:p-8 scroll-smooth pb-40 md:pb-8">
  <div className="max-w-7xl mx-auto">
    {children}
  </div>
</main>
```

**Calculator/Pathway Layout:**
```tsx
// ✅ Calculator Layout (with fixed bottom bar)
<div className="max-w-3xl mx-auto pb-40 md:pb-20">
  {/* Content */}
  
  {/* Fixed Action Bar */}
  <div className="fixed bottom-[4.5rem] md:static left-0 right-0 bg-white/95 backdrop-blur md:bg-transparent p-4 md:p-0 border-t md:border-0 z-30">
    Action Buttons
  </div>
</div>
```

**Card Grid:**
```tsx
// ✅ Category/Calculator Grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
  {items.map(item => (
    <Link key={item.id} className="block bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-lg hover:border-neuro-200 transition-all">
      {item.content}
    </Link>
  ))}
</div>
```

---

## Touch Target Requirements

### Minimum Size Rules

**All Interactive Elements MUST:**
- Have minimum height of 44px: `min-h-[44px]`
- Have minimum width of 44px (for icon buttons): `min-w-[44px]`
- Include `touch-manipulation` class
- Include `active:scale-95` for visual feedback

### ✅ DO: Correct Touch Targets

```tsx
// ✅ Button with proper touch target
<button className="
  px-6 py-3 
  min-h-[44px]
  touch-manipulation
  active:scale-95
">
  Button Text
</button>

// ✅ Icon Button with proper touch target
<button className="
  p-3 
  min-h-[44px] min-w-[44px]
  touch-manipulation
  active:scale-95
">
  <Icon size={20} />
</button>

// ✅ Link with proper touch target
<Link className="
  px-4 py-2.5 
  min-h-[44px]
  touch-manipulation
  active:scale-95
">
  Link Text
</Link>
```

### ❌ DON'T: Insufficient Touch Targets

```tsx
// ❌ Too small - only 32px
<button className="p-2">
  <Icon size={20} />
</button>

// ❌ Too small - only 40px height
<button className="px-4 py-2">
  Button
</button>

// ✅ CORRECT: Minimum 44px
<button className="p-3 min-h-[44px] min-w-[44px] touch-manipulation">
  <Icon size={20} />
</button>
```

### Touch Target Reference

| Element Type | Minimum Size | Recommended Classes |
|--------------|--------------|---------------------|
| Button | 44x44px | `px-6 py-3 min-h-[44px]` |
| Icon Button | 44x44px | `p-3 min-h-[44px] min-w-[44px]` |
| Link | 44px height | `px-4 py-2.5 min-h-[44px]` |
| Input | 44px height | `py-3 min-h-[44px]` |
| Selection Card | 44px height | `p-5 min-h-[44px]` |

**Always Include:**
- `touch-manipulation` - Improves touch response
- `active:scale-95` - Visual feedback on tap

---

## Accessibility Standards

### Text Size Requirements

**Minimum Text Size:** `text-xs` (12px)
- ❌ **NEVER** use `text-[10px]` or any size below 12px
- ✅ **ALWAYS** use `text-xs` as the absolute minimum

### Color Contrast

All text/background combinations must meet WCAG 2.1 Level AA:
- Normal text: 4.5:1 contrast ratio
- Large text (18px+): 3:1 contrast ratio

**Approved Combinations:**
```tsx
// ✅ High Contrast
<p className="text-slate-900 bg-white">Primary Text</p>
<p className="text-slate-700 bg-white">Body Text</p>
<p className="text-white bg-neuro-600">Button Text</p>

// ❌ Low Contrast (Avoid)
<p className="text-slate-400 bg-slate-50">Too Low</p>
```

### Focus States

**All Interactive Elements MUST have visible focus indicators:**

```tsx
// ✅ Standard Focus State
<button className="
  focus-visible:ring-2 
  focus-visible:ring-neuro-500 
  focus-visible:outline-none
">
  Button
</button>

// ✅ Input Focus State
<input className="
  focus:outline-none 
  focus:ring-2 
  focus:ring-neuro-500/20 
  focus:border-neuro-500
" />
```

### Keyboard Navigation

- All interactive elements must be keyboard accessible
- Tab order should be logical
- Skip links should be provided for long pages
- Modals must trap focus

### ARIA Labels

```tsx
// ✅ Icon-only buttons MUST have aria-label
<button 
  aria-label="Close modal"
  className="p-3 min-h-[44px] min-w-[44px]"
>
  <X size={20} />
</button>

// ✅ Form inputs MUST have labels
<label htmlFor="email" className="text-xs font-bold uppercase tracking-wider">
  Email
</label>
<input id="email" type="email" />
```

---

## Content Injection Rules

### ⚠️ CRITICAL: All New Pages MUST Follow This Structure

When creating new pages (manually or via AI), use this exact template:

```tsx
// ✅ REQUIRED: Standard Page Template
import React from 'react';

const NewPage: React.FC = () => {
  return (
    <div className="space-y-8 md:space-y-10">
      {/* Header Section */}
      <header className="p-4 md:p-6">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
          Page Title
        </h1>
        <p className="text-sm md:text-base text-slate-600 mt-2">
          Page description or subtitle
        </p>
      </header>

      {/* Content Sections */}
      <section className="p-4 md:p-6 space-y-4">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
          Section Title
        </h2>
        <p className="text-sm md:text-base font-normal text-slate-700 leading-relaxed">
          Section content goes here.
        </p>
      </section>

      {/* Cards Grid (if needed) */}
      <section className="p-4 md:p-6">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
          Cards Section
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Card items */}
        </div>
      </section>
    </div>
  );
};

export default NewPage;
```

### Calculator/Pathway Page Template

```tsx
// ✅ REQUIRED: Calculator/Pathway Template
import React from 'react';

const CalculatorPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto pb-40 md:pb-20">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
          Calculator Name
        </h1>
        <p className="text-sm md:text-base text-slate-600 mt-2">
          Calculator description
        </p>
      </header>

      {/* Content */}
      <div className="space-y-6">
        {/* Calculator content */}
      </div>

      {/* Fixed Action Bar (Mobile) */}
      <div className="
        fixed 
        bottom-[4.5rem] 
        md:static 
        left-0 
        right-0 
        bg-white/95 
        backdrop-blur 
        md:bg-transparent 
        p-4 
        md:p-0 
        border-t 
        md:border-0 
        z-30
        shadow-[0_-4px_10px_rgba(0,0,0,0.05)] 
        md:shadow-none
      ">
        <div className="flex gap-3">
          <button className="flex-1 md:flex-none px-8 py-3 bg-neuro-600 text-white rounded-xl font-bold min-h-[44px] touch-manipulation">
            Action
          </button>
        </div>
      </div>
    </div>
  );
};

export default CalculatorPage;
```

### Required Wrapper Components

**Every page MUST be wrapped in Layout:**
```tsx
// ✅ Correct: App.tsx structure
<Router>
  <Layout>
    <Routes>
      <Route path="/" element={<Home />} />
      {/* Other routes */}
    </Routes>
  </Layout>
</Router>
```

**Content MUST respect mobile bottom nav:**
```tsx
// ✅ Correct: Main content area
<main className="flex-1 overflow-y-auto bg-slate-50/50 p-4 md:p-8 pb-40 md:pb-8">
  {/* Page content */}
</main>
```

### Typography Class Requirements

**When adding new content, use these classes:**

```tsx
// ✅ Headings
<h1 className="text-3xl md:text-4xl font-bold text-slate-900">Title</h1>
<h2 className="text-2xl md:text-3xl font-bold text-slate-900">Section</h2>
<h3 className="text-xl md:text-2xl font-semibold text-slate-800">Subsection</h3>

// ✅ Body Text
<p className="text-sm md:text-base font-normal text-slate-700 leading-relaxed">
  Body text
</p>

// ✅ Lists
<ul className="space-y-2 text-sm md:text-base text-slate-700">
  <li>List item</li>
</ul>

// ✅ Code/Technical Text
<code className="text-xs font-mono bg-slate-100 px-2 py-1 rounded">
  Code
</code>
```

### Mobile-First Patterns

**Always design mobile-first, then enhance for desktop:**

```tsx
// ✅ Mobile-First Pattern
<div className="
  flex flex-col          // Mobile: Stack
  md:flex-row            // Desktop: Row
  gap-3                  // Mobile: Small gap
  md:gap-6               // Desktop: Large gap
  p-4                    // Mobile: Small padding
  md:p-6                 // Desktop: Large padding
">
  Content
</div>

// ✅ Responsive Text
<h1 className="
  text-3xl               // Mobile: Smaller
  md:text-4xl            // Desktop: Larger
  font-bold
">
  Title
</h1>

// ✅ Responsive Grid
<div className="
  grid 
  grid-cols-1            // Mobile: 1 column
  md:grid-cols-2         // Tablet: 2 columns
  lg:grid-cols-3         // Desktop: 3 columns
  gap-4                  // Mobile: Small gap
  md:gap-6               // Desktop: Large gap
">
  Grid Items
</div>
```

---

## Mobile-First Breakpoints

### Tailwind Breakpoints

| Breakpoint | Width | Usage |
|------------|-------|-------|
| `sm:` | ≥ 640px | Rarely used - prefer `md:` |
| `md:` | ≥ 768px | **Primary breakpoint** - Tablet and up |
| `lg:` | ≥ 1024px | Desktop - 3+ column grids |
| `xl:` | ≥ 1280px | Large desktop - rarely needed |

### Breakpoint Strategy

**Default (Mobile):**
- Single column layouts
- Compact spacing (`p-4`, `gap-3`)
- Smaller text sizes (`text-3xl`, `text-sm`)

**`md:` Breakpoint (Tablet/Desktop):**
- Multi-column grids (`md:grid-cols-2`)
- Increased spacing (`md:p-6`, `md:gap-4`)
- Larger text (`md:text-4xl`, `md:text-base`)

**`lg:` Breakpoint (Desktop):**
- 3+ column grids (`lg:grid-cols-3`)
- Maximum spacing (`lg:gap-6`)
- Full feature set

### Common Breakpoint Patterns

```tsx
// ✅ Standard Responsive Pattern
<div className="
  text-3xl md:text-4xl        // Text scaling
  p-4 md:p-6                  // Padding scaling
  grid-cols-1 md:grid-cols-2  // Grid scaling
  gap-3 md:gap-4              // Gap scaling
">
  Content
</div>

// ✅ Hide/Show Pattern
<div className="hidden md:block">
  Desktop Only
</div>
<div className="md:hidden">
  Mobile Only
</div>
```

---

## Quick Reference Checklist

### Before Creating Any New Component:

- [ ] Uses approved typography classes (no arbitrary sizes)
- [ ] Minimum text size is `text-xs` (12px)
- [ ] Touch targets are minimum 44px (`min-h-[44px]`)
- [ ] Includes `touch-manipulation` and `active:scale-95`
- [ ] Uses approved colors (neuro-*, slate-*, semantic colors)
- [ ] Has proper focus states (`focus-visible:ring-2`)
- [ ] Follows spacing system (`p-4 md:p-6`, `gap-3 md:gap-4`)
- [ ] Mobile-first responsive design
- [ ] Proper ARIA labels for icon-only buttons
- [ ] Meets WCAG contrast requirements

### Before Creating Any New Page:

- [ ] Wrapped in Layout component
- [ ] Uses standard page template structure
- [ ] Has proper bottom padding if fixed bars exist (`pb-40 md:pb-8`)
- [ ] Follows typography scale for headings
- [ ] Uses responsive grid patterns
- [ ] Tested on mobile viewport (< 768px)

---

## Design Token Reference

### Copy-Paste Ready Classes

**Typography:**
```tsx
// Headings
"text-3xl md:text-4xl font-bold text-slate-900 tracking-tight"  // H1
"text-2xl md:text-3xl font-bold text-slate-900 tracking-tight" // H2
"text-xl md:text-2xl font-semibold text-slate-800"              // H3
"text-lg md:text-xl font-semibold text-slate-800"              // H4

// Body
"text-sm md:text-base font-normal text-slate-700 leading-relaxed" // Body
"text-xs font-normal text-slate-500"                              // Caption
```

**Spacing:**
```tsx
// Containers
"p-4 md:p-6"        // Cards
"p-6 md:p-8"        // Sections
"pb-40 md:pb-8"     // Content with fixed bars

// Gaps
"gap-3 md:gap-4"    // Normal
"gap-4 md:gap-6"    // Relaxed
"space-y-4"         // Normal spacing
"space-y-6"         // Relaxed spacing
"space-y-8 md:space-y-10" // Loose spacing
```

**Colors:**
```tsx
// Primary
"bg-neuro-600 hover:bg-neuro-700 text-white"
"bg-neuro-50 border-neuro-100 text-neuro-900"
"text-neuro-600"

// Semantic
"bg-emerald-50 text-emerald-600 border-emerald-100" // Success
"bg-amber-50 text-amber-600 border-amber-100"        // Warning
"bg-red-50 text-red-600 border-red-100"              // Danger

// Neutral
"text-slate-900"  // Primary text
"text-slate-700"   // Body text
"text-slate-600"   // Secondary
"text-slate-500"   // Muted
"bg-slate-50"      // Light background
```

**Interactive:**
```tsx
// Buttons
"px-6 py-3 bg-neuro-600 hover:bg-neuro-700 text-white font-bold rounded-xl shadow-lg transition-all transform active:scale-95 touch-manipulation min-h-[44px] focus-visible:ring-2 focus-visible:ring-neuro-500 focus-visible:outline-none"

// Icon Buttons
"p-3 min-h-[44px] min-w-[44px] touch-manipulation active:scale-95 focus-visible:ring-2 focus-visible:ring-neuro-500 focus-visible:outline-none"
```

---

## Enforcement Rules for AI/Developers

### When Generating New Code:

1. **Typography:** Always use the typography scale - never arbitrary sizes
2. **Spacing:** Always use the spacing system - never arbitrary padding
3. **Colors:** Always use approved colors - never `blue-*` or `gray-*`
4. **Touch Targets:** Always include `min-h-[44px]` and `touch-manipulation`
5. **Mobile-First:** Always design for mobile first, then enhance with `md:` breakpoints
6. **Accessibility:** Always include focus states and ARIA labels
7. **Structure:** Always follow the page template for new pages

### Code Review Checklist:

- [ ] No `text-[10px]` or smaller
- [ ] No `blue-*` or `gray-*` colors
- [ ] All buttons have `min-h-[44px]`
- [ ] All interactive elements have `touch-manipulation`
- [ ] All interactive elements have focus states
- [ ] Spacing follows the system (`p-4 md:p-6`, etc.)
- [ ] Typography follows the scale
- [ ] Mobile-first responsive design
- [ ] Proper ARIA labels where needed

---

## Version History

- **v1.0** (January 2026): Initial design system based on design audit findings

---

**End of Design System**
