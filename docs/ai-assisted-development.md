# AI-assisted development

This document describes a repeatable practice for using AI coding tools on DecisionDesk. It is an engineering process note — not product branding.

## Tasks delegated to AI

- Scaffold Next.js project structure and config files.
- Generate Zod schemas mirroring domain types.
- Draft mock case dataset with realistic fictional data.
- Implement presentational components from explicit section hierarchy.
- Write initial Vitest and Playwright test skeletons.
- Draft architecture and standards documentation from outlined bullets.

## Context provided

- Full domain spec: analyst workflow, case detail section order, operational language map.
- Visual guardrails: no AI-SaaS aesthetic, enterprise density, table-first layout.
- Stack constraints: Next.js App Router, TanStack Query, RiskProvider abstraction.
- Collectors-box doc patterns for ADRs and documentation index.

## Code rejected and why

- **Chat-style summary UI** — replaced with structured panel (executive summary, signals, gaps, action).
- **Purple gradient / glass cards** — rejected; flat borders and slate neutrals only.
- **Generic AI labels** ("AI Assistant", "Ask AI") — renamed to operational terms.
- **Direct fetch in components** — rejected; routed through features + provider.
- **Monolithic page files** — split into section components per plan hierarchy.

## Manual verification

- Run `npm run typecheck`, `npm run lint`, `npm run test` after each step.
- Click-through: filter queue, open case, generate summary, submit decision, verify audit entry.
- Grep for generator branding: Cursor, v0, Lovable, "Made with", sparkle icons.
- Review case detail section order matches spec.
- Confirm justification validation and confirm dialog before mutation.

## Tests required before accepting changes

- Schema tests for decision input minimum length.
- Decision form validation test.
- Queue filter unit tests.
- Summary streaming component test.
- Playwright E2E for approve flow.

## Security and sensitive data

- All applicant data is fictional; no real PII in mocks or docs.
- Do not commit API keys; summary provider is mocked.
- Production doc describes auth and secret handling; not implemented in demo.
- Reject AI suggestions that log full case payloads to console in production code paths.

## Repeatable workflow for other developers

1. Write or paste the section spec and acceptance criteria first.
2. Implement one layer at a time: types → API → hooks → components.
3. Run tests after each layer; reject diffs that skip error states.
4. Review UI in browser for density and labelling before merging.
5. Update living docs only when behavior changes.
