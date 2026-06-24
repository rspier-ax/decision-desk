# ADR 0002: Demo session persistence

## Status

Accepted

## Context

DecisionDesk is a fictional demo console. Portfolio demonstrations require:

- Deterministic scenario datasets (not random generation)
- Session mutations (decisions, summaries, incoming cases) that survive refresh
- A reset path back to scenario baseline

The mock API uses an in-memory server store. Browser refresh clears server memory on cold start unless the client rehydrates.

## Decision

1. **Versioned client snapshot** — persist `DemoSessionState` in `localStorage` under `decision-desk-demo:v1`, validated with Zod on read.
2. **Hydrate on boot** — `DemoProvider` reads localStorage and `PUT /api/demo/session` before enabling data queries.
3. **Immutable seeds** — scenario modules export frozen datasets; runtime always works on deep clones via `structuredClone`.
4. **Persist after mutations** — decisions and completed summaries trigger `GET /api/demo/session` → localStorage write.
5. **Simulation settings** — latency, summary availability, and partial data failure live in session state and are applied in API routes only (demo popover).

## Consequences

- Cold server starts are safe when the client hydrates on every full page load.
- No global state library required; TanStack Query + DemoProvider suffice.
- Future schema changes increment the storage key version and invalidate old snapshots.

## References

- [ARCHITECTURE.md](../architecture/ARCHITECTURE.md)
- [0001-risk-provider-abstraction.md](./0001-risk-provider-abstraction.md)
