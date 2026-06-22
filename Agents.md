# React-Admin Agent Context

React-admin is a comprehensive frontend framework for building B2B and admin applications on top of REST/GraphQL APIs, using TypeScript, React, and Material UI. It's an open-source project maintained by Marmelab that provides a complete solution for B2B applications with data-driven interfaces.

## Design Principles

- Designed for Single-Page Application (SPA) architecture
- Backward compatibility over new features — avoid breaking changes
- Minimal API surface — if it can be done in a few lines of React, don't add it to core
- Provider pattern — data fetching, auth, and i18n are abstracted behind swappable provider adapters (`dataProvider`, `authProvider`, `i18nProvider`)
- Headless core — `ra-core` contains all logic without UI; `ra-ui-materialui` provides the Material UI layer. This separation is intentional — don't couple logic to UI
- Controller-view separation — controllers in `ra-core/src/controller/` expose business logic via hooks; views in `ra-ui-materialui/src/` handle rendering
- Context: pull, don't push — components expose data to descendants via context + custom hooks, not prop drilling. Every component that fetches data or defines callbacks creates a context for it
- `useEvent()` internal hook — use this for memoized event handlers instead of `useCallback`

## Anti-Patterns

- No `React.cloneElement()` — it breaks composition
- No children inspection — violates React patterns (exception: Datagrid)
- No features achievable in pure React — keep the API surface small
- No comments when code is self-explanatory
- No dead code — trust your preconditions. Don't guard against conditions that prior code already prevents
- DRY — don't duplicate knowledge. Coincidental code similarity is not duplication. Only deduplicate when the same decision or fact is expressed in multiple places. Code that looks alike but could evolve independently should stay separate

## Codebase Organization

```
react-admin/
├── packages/              # Lerna-managed packages
│   ├── ra-core/          # Core logic, hooks, controllers
│   ├── ra-ui-materialui/ # Material UI components
│   ├── react-admin/      # Main distribution package
│   ├── ra-data-*/        # Data provider adapters
│   ├── ra-i18n-*/        # i18n providers
│   └── ra-language-*/    # Translation packages
├── examples/             # Example applications
│   ├── simple/          # E2E test app
│   ├── demo/            # Full e-commerce demo
│   ├── crm/             # CRM application
│   └── tutorial/        # Tutorial app
├── cypress/             # E2E test configuration
├── docs/                # Jekyll documentation
├── docs_headless/       # Astro + Starlight documentation for headless components
└── scripts/             # Build scripts
```

## Package Dependencies

- **Core**: React 18.3+, TypeScript 5.8+, lodash 4.17+, inflection 3.0+
- **Routing**: React Router 6.28+
- **Data**: TanStack Query 5.90+ (React Query)
- **Forms**: React Hook Form 7.53+
- **UI Components**: Material UI 5.16+
- **Testing**: Jest 29.5+, Testing Library, Storybook, Cypress

## Testing

All changes must include tests.

- Stories: every component needs `*.stories.tsx` covering all props. Use FakeRest for mock data. Make data realistic — stories are used for screenshots and visual testing
- Unit/integration tests: `*.spec.tsx` files should reuse the component's stories as test cases. Assert on user-visible output (text, interactions), not implementation details or HTML attributes
- E2E (Cypress): kept minimal, targeting `examples/simple/`. Only for critical user paths

## Documentation

Every new feature or API change must be documented.

- `/docs/` (Jekyll) — one Markdown file per component or hook. Each file must include: description, usage examples, props/parameters list (required first, then alphabetical), detailed usage per prop, and recipes if applicable
- `/docs_headless/` (Astro + Starlight) — documents headless hooks and components from `ra-core`

## Pull Requests

- Target branch: `next` for features, `master` for bug fixes or documentation
- Title: start with a verb (Add / Fix / Update / Remove). Prefix with `[Doc]` or `[TypeScript]` if the change only concerns docs or types
- Commit messages: conventional commits focusing on "why"
  ```
  fix: Prevent duplicate API calls in useGetList hook
  feat: Add support for custom row actions in Datagrid
  docs: Clarify dataProvider response format
  ```

## Static Analysis

```bash
make lint               # ESLint checks
make typecheck          # TypeScript type checking
make prettier           # Prettier formatting
```
