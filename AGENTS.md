# DecisionDesk — Agent Guide

Read **`docs/README.md`** before changing code.

## What this product is

DecisionDesk is a **fictional risk-review console** for analysts reviewing flagged applications. Demo data only — see "Demo environment" label in the shell.

It is **not** a production fraud platform, a chat product, or a template landing page.

## Stack (fixed)

| Concern | Choice |
|---------|--------|
| Framework | Next.js App Router + TypeScript strict |
| Styling | Tailwind CSS v4 — enterprise density, no purple AI aesthetic |
| Remote state | TanStack Query |
| Forms | React Hook Form + Zod |
| Integration | `RiskProvider` interface + mock API routes |
| Tests | Vitest, RTL, Playwright |

## Key documents

- `docs/README.md` — documentation index
- `docs/architecture/ARCHITECTURE.md` — boundaries and trade-offs
- `docs/frontend-standards.md` — component, a11y, testing rules
- `docs/WORKFLOW.md` — branch naming (`rspier/<type>/<description>`)
- `docs/decisions/` — ADRs

## Non-negotiable rules

- Operational language: "Case Summary", "Generate summary" — not "AI Assistant".
- No generator branding in UI, README badges, or metadata.
- Loading, empty, and error states on every data-bound screen.
- Required justification on decisions; confirm before submit.
- Do not fetch inside presentational components.

## Repo layout

```
src/app/           pages + API routes
src/components/    presentational UI
src/features/      hooks + feature composition
src/services/      RiskProvider
src/mocks/         fictional demo data
src/schemas/       Zod
```
