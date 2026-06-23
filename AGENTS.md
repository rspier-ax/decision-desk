# DecisionDesk

Read **`docs/README.md`** for architecture, standards, and ADRs.

## Product

Fictional **risk-review console** for analysts working flagged applications (fraud / credit-risk). Demo data only — shell shows **Demo environment**.

Workflow: dashboard → queue → case detail → structured case summary → decision with justification → append-only audit trail.

## Stack

- Next.js App Router, React, TypeScript strict
- Tailwind CSS v4
- TanStack Query, React Hook Form, Zod
- Vitest, React Testing Library, Playwright

## Structure

```
src/app/           routes, API handlers, error boundaries
src/components/    presentational UI
src/features/      hooks, forms, page composition
src/services/      RiskProvider contract + client
src/schemas/       Zod (mirrors domain types)
src/mocks/         fictional data; store used by API routes only
docs/              detailed architecture and standards
```

## Domain boundaries

**RiskProvider** (`src/services/risk-provider/`) — synchronous case operations:

- `listCases`, `getCase`, `submitDecision`

UI and features call the provider (or its hooks); do not fetch vendor APIs from components.

**Case summary** — separate integration:

- `POST /api/cases/[id]/summary` (SSE)
- Hook: `src/features/cases/hooks/use-case-summary-stream.ts`
- Structured panel, not a chat UI. Do not add streaming to `RiskProvider` without a new ADR.

**Types** — `src/services/risk-provider/types.ts` is canonical; validate at boundaries with `src/schemas/`.

**Persistence (demo)** — in-memory store in `src/mocks/store.ts`, accessed only from `src/app/api/`.

## Quality expectations

- Loading, empty, and error states on data-bound UI; retry when recoverable.
- Decisions require justification and confirmation; audit history is append-only.
- Read existing code before adding services, hooks, or components.
- Contract or schema changes need tests; architectural shifts need an ADR in `docs/decisions/`.

## Validation

```bash
npm run typecheck
npm run lint
npm run test
npm run test:e2e
npm run build
```

Playwright: `npx playwright install chromium` on first run.

## Further reading

| Document | Topic |
|----------|--------|
| [docs/architecture/ARCHITECTURE.md](./docs/architecture/ARCHITECTURE.md) | Boundaries, remote state, errors |
| [docs/frontend-standards.md](./docs/frontend-standards.md) | Components, a11y, testing |
| [docs/WORKFLOW.md](./docs/WORKFLOW.md) | Branches and PRs |
| [docs/engineering-practice.md](./docs/engineering-practice.md) | Implementation order |
| [docs/decisions/](./docs/decisions/) | ADRs |

Area-specific rules may live in `.cursor/rules/` as the project grows.
