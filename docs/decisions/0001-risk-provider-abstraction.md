# ADR-0001: RiskProvider abstraction

Date: 2026-06-23  
Status: accepted

## Context

DecisionDesk must demonstrate integration patterns common in fraud and credit-risk operations without coupling UI components to a specific vendor API or to Next.js route handlers. Analyst screens need cases, detail, and decision submission through a stable contract.

## Decision

Introduce a `RiskProvider` interface with three synchronous methods: `listCases`, `getCase`, and `submitDecision`. The demo ships with `MockRiskProvider` that calls internal `/api/*` routes. Case summary streaming remains a separate hook and API route because streaming transport differs from CRUD.

## Alternatives considered

- **Direct `fetch` in components** — rejected; spreads URL and error handling across UI.
- **TanStack Query as the abstraction** — rejected; query hooks are client-side; provider stays testable and swappable on server and client.
- **Summary inside RiskProvider** — rejected; streaming lifecycle and caching differ from list/detail/mutate.

## Consequences

+ UI and features depend on a narrow interface; swap mock for HTTP implementation without refactors.
+ API routes can evolve (pagination, auth) behind the provider.
- Two integration paths to document (provider + summary stream).
- Extra thin layer versus direct fetch in hooks.

## References

- [architecture/ARCHITECTURE.md](../architecture/ARCHITECTURE.md)
- `src/services/risk-provider/`
