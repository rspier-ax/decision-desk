# Frontend standards

## Component ownership

- **`components/`** — presentational, props-in. Group by domain: `decision-queue`, `risk-summary`, `case-summary`, `audit-timeline`, `ui`.
- **`features/`** — hooks, form wiring, page-level composition.
- **`app/`** — routes, metadata, error boundaries only.

Keep components under ~150 lines. Split when a file owns more than one visual section.

## State management

| State type | Where |
|------------|-------|
| Remote data | TanStack Query in `features/*/hooks` |
| Form input | React Hook Form + Zod |
| UI ephemeral (filters, modals) | `useState` in feature or list component |
| Global | QueryClient provider only — no Redux/Zustand |

Do not fetch inside presentational components.

## Accessibility

- Semantic HTML: `main`, `nav`, `table`, `fieldset`, `label`.
- Skip link to `#main-content`.
- Visible `:focus-visible` outlines on interactive elements.
- `aria-live="polite"` on case summary during streaming.
- Confirm dialog: `role="dialog"`, `aria-modal`, labelled title.
- Form errors: `role="alert"`, associate with fields via `aria-describedby`.

## Loading, empty, error

Every data-bound section must handle:

- **Loading** — skeleton or status text with `role="status"`.
- **Empty** — explain why and how to adjust (filters).
- **Error** — message + retry action.

## Abstraction criteria

Create a shared primitive or hook only when:

- The pattern appears 3+ times with identical behavior, or
- A boundary requires it (RiskProvider, Zod schema).

Avoid generic wrappers (`MagicCard`, `SmartPanel`) and premature utility layers.

## Testing expectations

| Area | Tool | Minimum |
|------|------|---------|
| Schemas | Vitest | Valid + invalid payloads |
| Forms | RTL | Validation messages |
| Queue filters | Vitest | Filter logic on mock store |
| Summary | RTL | Stream populates fields |
| Critical path | Playwright | Dashboard → case → summary → decision |

Run `npm run test` before merging. E2E required when workflow changes.

## Pull-request checklist

- [ ] Typecheck and lint pass
- [ ] Unit tests added or updated for changed behavior
- [ ] Loading / empty / error states preserved
- [ ] No fictional PII styled as real; demo label visible
- [ ] Labels use operational language (Case Summary, not AI Assistant)
- [ ] Living docs updated if architecture or workflow changed
