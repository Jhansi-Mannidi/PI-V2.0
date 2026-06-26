# Modal to Page Navigation Conversion Guide

## Successfully Completed

✅ **Risk Capture Modal → `/risk/capture` page**
- Professional full-page form with responsive design
- Light/dark mode support
- Mobile-friendly layout with proper back button
- Demonstrates the pattern for all remaining conversions

## Pattern & Methodology

### Quick Conversion Steps for Each Modal

1. **Create new page** at `/app/[section]/[action]/page.tsx`
2. **Move modal form code** into page component
3. **Wrap in layout** with sticky header (back button) + motion animations
4. **Replace button** in parent page with `<Link href="/[section]/[action]">`
5. **Remove modal state** from parent (`useState`, modal render)
6. **Test** on mobile & desktop, both light/dark modes

### Directory Structure Example
```
/risk
  /page.tsx (updated - uses Link, no modal state)
  /capture
    /page.tsx (new - full-page form)
```

### Design Requirements
- **Header**: Sticky top with back button, title, description
- **Content**: Max-width 2xl, py-8, responsive grid layouts
- **Fields**: h-10 inputs, text-sm, border-line, focus:ring-2 focus:ring-[accent]/50
- **Actions**: Flex gap-3, Cancel/Submit buttons at bottom
- **Motion**: Fade in + slight Y transform (200ms ease)

## Remaining Modals (10 pages)

| Page | Modal | Route | Lines | Status |
|------|-------|-------|-------|--------|
| Change Orders | Decision capture | `/change-orders/[id]/decide` | 1223 | TODO |
| Approval Pipeline | Approval dialog | `/approval-pipeline/[id]/decide` | 873 | TODO |
| Termsheet | Term entry | `/termsheet/new` | 847 | TODO |
| Orchestration | Settings | `/orchestration/configure` | 749 | TODO |
| Planning | Plan creation | `/planning/new` | 559 | TODO |
| Reports | Export dialog | `/reports/generate` | 547 | TODO |
| Milestones | Gate decision | `/milestones/[id]/decide` | 504 | TODO |
| SLA Tracker | Config | `/sla/configure` | 457 | TODO |

## Each conversion takes ~30-60 minutes following the established pattern

Apply the same approach used for Risk Capture to all remaining pages.
