# Mobile Design Specifications for Stroke Basics

## Mobile Layout Behavior

### Left Sidebar (Mobile)
**Trigger:** Hamburger menu button in header (or dedicated "Menu" button)
**Behavior:** 
- Slides in from left side as overlay
- Backdrop (dark overlay) appears behind
- Swipe left to close OR tap backdrop to close
- Full height overlay
- Width: ~280px (matches desktop collapsed width)

**Components in Overlay:**
1. Stroke Timer (compact)
2. Protocol Steps Navigation
3. Quick Tools Grid

**Animation:**
- Slide-in: `transform: translateX(-100%)` → `translateX(0)`
- Duration: 0.3s ease-out
- Backdrop fade-in: `opacity: 0` → `opacity: 0.5`

### Right Sidebar (Mobile)
**Trigger:** "Clinical Pearls" button in header (or dedicated button)
**Behavior:**
- Modal popup (centered, doesn't navigate away)
- Backdrop (dark overlay) appears behind
- Tap backdrop or X button to close
- Scrollable content within modal
- Width: ~90% of screen width
- Max height: ~80vh

**Modal Content:**
- Header: "Clinical Pearls" with X close button
- Toggle: Quick Learning vs Deep Learning
- Scrollable content area with:
  - Trial summaries
  - Guidelines links
  - Images/diagrams
  - Educational content

**Animation:**
- Fade-in + scale: `opacity: 0, scale: 0.95` → `opacity: 1, scale: 1`
- Duration: 0.2s ease-out

## Mobile Header Additions

### Left Side
- Hamburger menu icon (existing or new) → Opens left sidebar overlay

### Right Side
- Clinical Pearls button (book icon) → Opens right sidebar modal
- Existing search/notifications remain

## Touch Interactions

### Left Sidebar Overlay
- **Open:** Tap hamburger menu
- **Close:** 
  - Swipe left on sidebar
  - Tap backdrop
  - Tap X button (if added)

### Right Sidebar Modal
- **Open:** Tap "Clinical Pearls" button
- **Close:**
  - Tap backdrop
  - Tap X button in modal header
  - Swipe down (optional gesture)

## Responsive Breakpoints

- **Mobile:** < 768px
  - Single column
  - Sidebars as overlays/modals
  - Full-width main content

- **Tablet:** 768px - 1024px
  - Left sidebar: Collapsible (can be visible or hidden)
  - Right sidebar: Modal popup
  - Main content: Flexible width

- **Desktop:** > 1024px
  - 3-column layout
  - Left sidebar: Collapsible
  - Right sidebar: Always visible, collapsible

## Implementation Notes

1. **Left Sidebar Overlay:**
   - Use `fixed` positioning
   - `z-index: 50` (above main content, below modals)
   - Backdrop: `fixed inset-0 bg-black/50 z-40`

2. **Right Sidebar Modal:**
   - Use `fixed` positioning, centered
   - `z-index: 60` (above everything)
   - Backdrop: `fixed inset-0 bg-black/50 z-50`

3. **Prevent Body Scroll:**
   - When overlay/modal open, add `overflow: hidden` to body
   - Remove on close

4. **Accessibility:**
   - Focus trap in modals
   - ARIA labels for buttons
   - Keyboard navigation support
