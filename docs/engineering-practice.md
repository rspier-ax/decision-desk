# Engineering practice

How we implement and review changes on DecisionDesk.

## Implementation order

1. Types and Zod schemas (if the domain model changes)
2. Mock store and API routes
3. Provider or hooks (`features/*/hooks`)
4. Presentational components
5. Tests at the layer that changed

Prefer extending existing files over parallel implementations.

## Before proposing changes

State explicitly:

- What exists today in the relevant area
- What will be reused vs added
- Which files will change

Do not add a new service, hook, or component if an equivalent already covers the use case.

## Review standards

Changes that typically require revision:

- Fetch calls inside `components/` instead of `features/` or `RiskProvider`
- Case summary rendered as chat bubbles or a free-form text area
- Missing loading, empty, or error states on new data-bound UI
- Monolithic page files owning multiple unrelated sections
- API or schema changes without tests or ADR when architectural

## Manual verification

After substantive UI or workflow changes:

```bash
npm run typecheck && npm run lint && npm run test
```

Smoke the analyst path in the browser: dashboard → filter queue → open case → generate summary → record decision → confirm audit entry updated.

## Tests expected by change type

| Change | Minimum |
|--------|---------|
| Schema / validation | Vitest unit test |
| Form behavior | RTL test |
| Queue or filter logic | Vitest on store or component |
| Summary streaming | RTL with mocked stream |
| End-to-end workflow | Playwright |

## Security and data

- Mocks use fictional identities only; no real PII.
- No API keys in the repo; summary generation is mocked server-side.
- Do not log full case payloads in production code paths.

## Documentation

Update living docs (`architecture/ARCHITECTURE.md`, `frontend-standards.md`) only when behavior or boundaries change. Task-specific UX belongs in the issue or PR description, not in AGENTS.md.
