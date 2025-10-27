# React-Admin Agent Context

React-admin is a comprehensive frontend framework for building B2B and admin applications on top of REST/GraphQL APIs, using TypeScript, React, and Material UI. It's an open-source project maintained by Marmelab that provides a complete solution for B2B applications with data-driven interfaces.

## Architecture & Design Patterns

### Key Principles

- Designed for Single-Page Application (SPA) architecture
- Provider-based abstraction for data fetching, auth, and i18n
- "Batteries included but removable" - everything is replaceable
- User Experience and Developer Experience are equally important
- Backward compatibility prioritized over new features
- Composition over Configuration - Use React patterns, not custom DSLs
- Minimal API Surface - If it can be done in React, don't add to core
- Standing on Giants' Shoulders - Use best-in-class libraries, don't reinvent the wheel

### Provider Pattern

React-admin uses adapters called "providers" for external integrations:

```typescript
// Data Provider - abstracts API calls
dataProvider.getList('posts', {
    pagination: { page: 1, perPage: 5 },
    sort: { field: 'title', order: 'ASC' },
    filter: { author_id: 12 }
})

// Auth Provider - handles authentication
authProvider.checkAuth()
authProvider.login({ username, password })
authProvider.getPermissions()

// i18n Provider - manages translations
i18nProvider.translate('ra.action.save')
```

### Hook-Based API

All functionality exposed through hooks following React patterns:

```typescript
// Data hooks
const { data, isLoading } = useGetList('posts', {
    pagination: { page: 1, perPage: 10 }
});

// State management hooks
const [filters, setFilters] = useFilterState();
const [page, setPage] = usePaginationState();

// Auth hooks
const { permissions } = usePermissions();
const canAccess = useCanAccess({ resource: 'posts', action: 'edit' });
```

### Headless Core

The `ra-core` package contains all logic without UI. UI components are in separate packages like `ra-ui-materialui`. This allows:

- Custom UIs using core hooks and controllers
- Swapping UI libraries without changing core logic

### Controller-View Separation

- Controllers in `ra-core/src/controller/` handle business logic
- Views in `ra-ui-materialui/src/` handle rendering
- Controllers provide data and callbacks via hooks

### Context: Pull, Don’t Push

Communication between components can be challenging, especially in large React applications, where passing props down several levels can become cumbersome. React-admin addresses this issue using a pull model, where components expose props to their descendants via a context, and descendants can consume these props using custom hooks.

Whenever a react-admin component fetches data or defines a callback, it creates a context and places the data and callback in it.

## Codebase Organization

### Monorepo Structure

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

### Key ra-core Directories

- `src/auth/` - Authentication and authorization (54 files)
- `src/controller/` - CRUD controllers and state management
- `src/dataProvider/` - Data fetching and caching logic (70 files)
- `src/form/` - Form handling (31 files)
- `src/routing/` - Navigation and routing (26 files)
- `src/i18n/` - Internationalization (30 files)

### Package Dependencies

- **Core**: React 18.3+, TypeScript 5.8+, lodash 4.17+, inflection 3.0+
- **Routing**: React Router 6.28+
- **Data**: TanStack Query 5.90+ (React Query)
- **Forms**: React Hook Form 7.53+
- **UI Components**: Material UI 5.16+
- **Testing**: Jest 29.5+, Testing Library, Storybook, Cypress

## Development Practices

### TypeScript Requirements

- **Strict mode enabled** - no implicit any
- **Complete type exports** - all public APIs must be typed
- **Generic types** for flexibility in data providers and resources
- **JSDoc comments** for better IDE support

```typescript
// GOOD - Properly typed with generics
export const useGetOne = <RecordType extends RaRecord = any>(
    resource: string,
    options?: UseGetOneOptions<RecordType>
): UseGetOneResult<RecordType> => { ... }

// BAD - Using any without constraint
export const useGetOne = (resource: any, options?: any): any => { ... }
```

### Component Patterns

1. **Composition over configuration** - Use React composition patterns
2. **Smart defaults** - Components should work out-of-the-box
3. **Controlled and uncontrolled** modes supported
4. **Props pass-through** - Spread additional props to root element

```jsx
// Component composition example
export const MyField = ({ source, ...props }) => {
    const record = useRecordContext();
    return (
        <TextField
            {...props}  // Pass through all additional props
            value={record?.[source]}
        />
    );
};
```

### File Organization
- **Feature-based structure** within packages (not type-based)
- **Co-location** - Tests (`.spec.tsx`) and stories (`.stories.tsx`) next to components
- **Index exports** - Each directory has an index.ts exporting public API
- **Flat structure** within features - avoid unnecessary nesting

### Documentation

Every new feature or API change must be documented. The documentation consists of Markdown files located in the `/docs/` directory and built with Jekyll, one file per component or hook.

All documentation files must include:

- A brief description of the component or hook
- Usage examples
- List of props or parameters (required props first, then in alphabetical order)
- Detailed usage for each prop/parameter (in alphabetical order)
- Recipes and advanced usage examples if applicable

Headless hooks and components (the ones in `ra-core`) are also documented in the `/docs_headless/` directory.

### Pre-commit Hooks

- Automatic test execution for modified files
- Prettier formatting check
- ESLint validation
- TypeScript compilation


### Development Workflow
```bash
# Initial setup
make install         # Install all dependencies

# After making changes
make build           # Build packages (TypeScript compilation)
make test            # run unit and e2e tests

# Before pushing changes
make lint           # Check code quality
make prettier       # Format code
```

### Pull Request Process

1. **Target branch**: `next` for features, `master` for bug fixes or documentation changes
2. **Required checks**:
   - All tests passing (`make test`)
   - Linting clean (`make lint`)
   - Prettier formatted (`make prettier`)
   - TypeScript compiles (`yarn typecheck`)

3. **Commit Messages**: Clear, descriptive messages focusing on "why"
   ```
   fix: Prevent duplicate API calls in useGetList hook
   feat: Add support for custom row actions in Datagrid
   docs: Clarify dataProvider response format
   ```

4. **Documentation**: Update relevant docs for API changes
5. **Title**: Start with a verb (Add / Fix / Update / Remove), prefix with `[Doc]` or `[TypeScript]` if the change only concerns doc or types. 

### Common Make Commands
```bash
make                # Show all available commands
make install        # Install dependencies
make build          # Build all packages (CJS + ESM)
make test           # Run all tests
make lint           # Check code quality
make prettier       # Format code
make run-simple     # Run simple example
make run-demo       # Run demo application
```

### Performance Considerations

- Use `React.memo()` for expensive components
- Leverage `useMemo()` and `useCallback()` appropriately
- Use `useEvent()` (an internal hook) for memoized event handlers
- Implement pagination for large datasets
- Use query caching via React Query

### Accessibility

- Follow WCAG guidelines
- Ensure keyboard navigation works
- Provide proper ARIA labels
- Test with screen readers

### Browser Support
- Modern browsers only (Chrome, Firefox, Safari, Edge)
- No IE11 support
- ES5 compilation target for compatibility

## Misc

- **Don't use `React.cloneElement()`** - it breaks composition
- **Don't inspect children** - violates React patterns (exception: Datagrid)
- **Don't add comments** when code is self-explanatory 
- **Don't add features** achievable in a few lines with pure React
- **Don't skip tests** - they run automatically on commit
- **Don't force push** to main/master branches

## Testing Requirements

All developments must include tests to ensure code quality and prevent regressions.

### Storybook

- **Location**: Stories alongside components as `*.stories.tsx`
- **Coverage**: All components must have stories demonstrating usage for all props
- **Mocking**: Use jest mocks sparingly, prefer integration tests
- **Data**: Use mock data providers (e.g., FakeRest) for stories. Make realistic data scenarios as the stories are also used for screenshots and visual testing.

### Unit & Integration Testing (Jest)

- **Location**: Tests alongside source files as `*.spec.tsx`
- **Test Cases**: Reuse the component's stories as test cases
- **Assertions**: Use testing-library to render and assert on elements. Don't test implementation details or HTML attributes, use assertions based on user interactions and visible output. 
- **Commands**:
  ```bash
  make test-unit         # Run all unit and functional tests
  npx jest [pattern]     # Run specific tests
  ```

### E2E Testing (Cypress)

Kept minimal to critical user paths due to maintenance overhead.

- **Location**: `cypress/` directory
- **Target**: Simple example app (`examples/simple/`)
- **Coverage**: Critical user paths and interactions
- **Commands**:

  ```bash
  make test-e2e          # Run in CI mode
  # or for local testing with GUI:
  make run-simple        # Start test app with vite
  make test-e2e-local    # Run e2e tests with GUI
  ```

### Static Analysis

```bash
make lint               # ESLint checks
make prettier           # Prettier formatting
make build              # TypeScript type checking
```