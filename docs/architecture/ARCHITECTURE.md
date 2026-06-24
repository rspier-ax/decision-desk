# ARCHITECTURE.md — DecisionDesk

## Stack

| Layer | Technology | Why |
|-------|------------|-----|
| Framework | Next.js 16 App Router | File-based routes, API routes, deploy on Vercel |
| UI | React 19 + TypeScript strict | Typed operational UI |
| Styling | Tailwind CSS v4 | Compact enterprise layout without component library lock-in |
| Remote state | TanStack Query | Cache, retry, mutation invalidation for queue and case detail |
| Forms | React Hook Form + Zod | Validated decision input with field errors |
| Tests | Vitest, RTL, Playwright | Unit/component + one critical E2E path |
| Data (demo) | Mock API routes + in-memory store | Realistic client/server split without database |

## Boundaries

```
[Pages app/*]           → route params, metadata, error boundaries
[Features features/*]   → TanStack Query hooks, form wiring, page composition
[Components components/*] → props-in UI, loading/empty/error slots
[Services services/*]   → RiskProvider contract, HTTP client
[API app/api/*]         → mock persistence, filtering, SSE summary
[Schemas schemas/*]     → Zod at API boundary and forms
```

Components must not call `fetch` directly. Features use `riskProvider` or dedicated stream hooks.

## Remote-state strategy

- **Queries:** `useCases`, `useCaseDetail`, `useDashboardMetrics` with stable query keys in `src/lib/query-keys.ts`.
- **Mutations:** `useSubmitDecision` invalidates case, queue, and metrics on success.
- **Streaming:** `useCaseSummaryStream` consumes SSE from `/api/cases/[id]/summary`; not part of `RiskProvider` because transport and lifecycle differ from CRUD.

## Error-handling strategy

- Route-level `error.tsx` for unexpected failures.
- Section-level error states with retry for queue, metrics, and summary.
- API routes return structured `{ error }` with appropriate HTTP status.
- `?simulate=summary_error` on summary route for partial failure testing.

## Auditability

- Every decision appends an `AuditEntry` and `TimelineEvent` in the mock store.
- Audit timeline is append-only in the UI (no edit/delete).
- Justification is required and validated (minimum 10 characters).

## Replacing mocks with real APIs

1. Implement `HttpRiskProvider` with the same interface as `MockRiskProvider`.
2. Point methods at internal decisioning REST/GraphQL endpoints.
3. Keep Zod schemas at the boundary to validate external payloads.
4. Add auth headers from session middleware.
5. Replace in-memory store with operational database; audit log as append-only table.

## Authentication (production)

- OIDC/SAML at edge or Next.js middleware.
- Session carries analyst ID and roles (reviewer, supervisor).
- API routes reject unauthenticated mutations.

## Trade-offs for demo delivery

- In-memory server store with **client hydration**: `DemoProvider` restores versioned snapshots from `localStorage` on boot (`decision-desk-demo:v2`). Deterministic scenario seeds; no random data generation.
- Hand-rolled UI primitives: full control over density; more a11y work than a component library.
- Simulated summary stream: no external LLM cost; provider interface documented for swap-in.

## References

- [decisions/0001-risk-provider-abstraction.md](../decisions/0001-risk-provider-abstraction.md)
- [decisions/0002-demo-session-persistence.md](../decisions/0002-demo-session-persistence.md)
- [frontend-standards.md](../frontend-standards.md)
