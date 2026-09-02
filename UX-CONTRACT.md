# UX contract

## Canonical owners

- `app/page.tsx` owns the application shell and route-level state.
- `components/OpportunityWorkspace.tsx` owns search, selection, staging, and review.
- `components/ui.tsx` owns buttons, badges, progress, and the confirmation dialog.
- `hooks/useWebMCP.ts` owns tool registration and lifecycle cleanup.
- `lib/repository.ts` owns persistence and demo fallback behavior.

## Flow ledger

| Operation | Pending | Success | Failure | Recovery |
| --- | --- | --- | --- | --- |
| Search | Stable list | Filtered ledger | Existing data remains | Clear or change query |
| Check eligibility | In-place progress | Requirement evidence | Score omitted | Retry selection |
| Stage application | Button busy | Review panel opens | Selection preserved | Retry stage |
| Submit application | Confirmation required | Status becomes submitted | Draft remains ready | Retry submission |

## Privacy and consent

The MVP stores synthetic demo data locally unless Supabase environment values
are configured. Agents may stage a draft but cannot provide human consent. The
final submission dialog names the opportunity and consequence, focuses Cancel,
closes on Escape, and restores focus.

## Accessibility and responsive behavior

Target WCAG 2.2 AA. All actions use native controls, keyboard focus remains
visible, status updates use a live region, and the three-column workspace
reflows to one column below 900 px. Reduced motion disables transitions.
