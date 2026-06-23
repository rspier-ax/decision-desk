# DecisionDesk

> Fictional risk-review workspace for exploring frontend architecture, operational decision workflows, auditability, and responsible integration of automated analysis.

DecisionDesk is a console used by analysts to review applications flagged by an automated fraud and credit-risk system. All people, accounts, and metrics are fictional demo data.

## Problem

Operational teams need a single place to inspect flagged applications, understand contributing risk signals, record decisions with justification, and maintain an audit trail. DecisionDesk models that workflow without coupling the UI to a specific vendor API.

## Main workflow

1. Analyst opens the review dashboard and filters the decision queue.
2. Analyst opens a case and reviews identity data, risk signals, and event history.
3. Analyst generates a structured case summary (simulated streaming).
4. Analyst approves, rejects, or escalates with required justification.
5. The system appends the action to the audit timeline.

## Structure

```
decision-desk/
├── src/
│   ├── app/                 # Next.js App Router pages + API routes
│   ├── components/          # Presentational UI by domain area
│   ├── features/            # Hooks and feature composition
│   ├── services/risk-provider/  # Provider abstraction + mock client
│   ├── schemas/             # Zod validation
│   └── mocks/               # Fictional demo data
├── docs/                    # Architecture and engineering standards
└── e2e/                     # Playwright critical path
```

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run typecheck` | TypeScript strict check |
| `npm run lint` | ESLint |
| `npm run test` | Vitest unit/component tests |
| `npm run test:e2e` | Playwright E2E |

## Architecture overview

- **UI** — React components and feature hooks; no direct vendor API calls.
- **Domain** — Typed models in `src/services/risk-provider/types.ts`, validated with Zod.
- **Integration** — `RiskProvider` interface; `MockRiskProvider` calls Next.js API routes backed by an in-memory store.

TanStack Query manages remote state (cases, metrics, mutations). Case summary streaming uses a dedicated SSE route, separate from the synchronous provider methods.

See [docs/README.md](./docs/README.md) for full documentation.

## Test strategy

- **Vitest + RTL** — schemas, queue filters, decision form validation, summary streaming UI.
- **Playwright** — dashboard → case → summary → approve with justification → audit entry.

## Trade-offs

| Choice | Rationale |
|--------|-----------|
| Mock API + in-memory store | Deployable demo without DB; realistic client/server split |
| RiskProvider abstraction | Swap mocks for real decisioning APIs without UI refactors |
| No auth in demo | Focus on analyst workflow; production would use OIDC/SAML |
| Simulated summary stream | Demonstrates progressive loading without paid LLM API |

## Known limitations

- Data resets on server cold start (Vercel serverless).
- Single hardcoded analyst identity (`analyst.jdoe`).
- No persistence, RBAC, or real fraud engine integration.

## Production considerations

- Replace `MockRiskProvider` with an HTTP implementation against internal APIs.
- Persist cases and append-only audit log in operational database.
- Authenticate analysts; bind `analystId` from session claims.
- Plug a real summary provider behind the same structured response contract.

## Documentation

| Document | Content |
|----------|---------|
| [docs/README.md](./docs/README.md) | Documentation index |
| [docs/architecture/ARCHITECTURE.md](./docs/architecture/ARCHITECTURE.md) | Stack, boundaries, trade-offs |
| [docs/frontend-standards.md](./docs/frontend-standards.md) | Component and testing standards |
| [docs/ai-assisted-development.md](./docs/ai-assisted-development.md) | AI-assisted engineering practice |
| [docs/decisions/0001-risk-provider-abstraction.md](./docs/decisions/0001-risk-provider-abstraction.md) | ADR: RiskProvider |
