# Drawer-Based Body Navigation Pattern

This guide explains how to convert modal dialogs to drawer-based navigation that keeps the app shell (header, sidebar) visible.

## Pattern Overview

Instead of full-page navigation (`Link href="/path"`), use state-driven drawer overlays:
- Header and sidebar remain visible
- Drawer content changes based on page state
- Back button closes drawer, returns to previous state
- Professional, mobile-friendly UX

## Implementation Steps

### 1. Create Component State
```tsx
const [showCaptureDrawer, setShowCaptureDrawer] = useState(false)
```

### 2. Update Button Click Handler
```tsx
// Before (full page navigation)
<Link href="/risk/capture">
  <Button>Capture Risk</Button>
</Link>

// After (drawer state)
<Button onClick={() => setShowCaptureDrawer(true)}>
  Capture Risk
</Button>
```

### 3. Add Form Component with Props
```tsx
<FormComponent 
  open={showCaptureDrawer} 
  onClose={() => setShowCaptureDrawer(false)} 
/>
```

### 4. Form Component Uses Dialog/Drawer
```tsx
export function FormComponent({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        {/* Form content */}
      </DialogContent>
    </Dialog>
  )
}
```

## Files to Update

### Phase 1 (High Impact)
- [ ] Change Orders - `app/change-orders/page.tsx`
- [ ] Approval Pipeline - `app/approval-pipeline/page.tsx`
- [ ] Termsheet - `app/termsheet/page.tsx`
- [ ] Orchestration - `app/orchestration/page.tsx`

### Phase 2 (Medium Impact)
- [ ] Planning - `app/planning/page.tsx`
- [ ] Reports - `app/reports/page.tsx`
- [ ] Milestones - `app/milestones/page.tsx`
- [ ] SLA Tracker - `app/sla/page.tsx`

### Phase 3 (Audit Ecosystem)
- [ ] Controls Audit Schedule pages
- [ ] Risk Audit Schedule pages
- [ ] Compliance Audit Schedule pages

## Checklist Per Page

For each page conversion:
1. [ ] Identify all useState calls that manage modals
2. [ ] Keep useState for drawer/form states
3. [ ] Remove `Link` to modal page routes
4. [ ] Update button onClick to toggle drawer state
5. [ ] Add drawer component with `open` and `onClose` props
6. [ ] Delete the `/[page]/[action]/page.tsx` route file
7. [ ] Test in browser - drawer opens/closes, app shell remains visible
8. [ ] Verify mobile responsive on 375px viewport
9. [ ] Check light/dark mode rendering

## Benefits

✓ Header and sidebar always visible - improved context
✓ Faster perceived performance - no full page reload
✓ Better mobile UX - drawer slides in from side
✓ Bookmarkable workflows - state in component, not URL
✓ Professional interaction model - similar to enterprise apps

## Example: Risk Capture

**Before:**
- Click button → navigate to `/risk/capture` → full page load with AppShell
- No sidebar context while filling form
- URL changes

**After:**
- Click button → drawer opens over risk page
- Sidebar and header remain visible
- Dialog overlay handles form interaction
- Same URL context
