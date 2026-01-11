# Routing Abstraction Layer

This directory contains react-admin's router abstraction layer, which enables using different routing libraries (react-router, TanStack Router, etc.) without changing application code.

## Architecture

### Provider Pattern

The abstraction uses a Provider pattern similar to `dataProvider` and `authProvider`:

```tsx
// Default: react-router (no configuration needed)
<Admin dataProvider={dataProvider}>
  <Resource name="posts" list={PostList} />
</Admin>

// Alternative: TanStack Router
import { tanStackRouterProvider } from 'react-admin';

<Admin dataProvider={dataProvider} routerProvider={tanStackRouterProvider}>
  <Resource name="posts" list={PostList} />
</Admin>
```

### Key Components

```
RouterProviderContext
    │
    ├── RouterProvider (interface)
    │   ├── Hooks: useLocation, useNavigate, useParams, useBlocker, useMatch, etc.
    │   ├── Components: Link, Navigate, Route, Routes, Outlet
    │   └── Utilities: matchPath, RouterWrapper
    │
    ├── reactRouterProvider (default implementation)
    │
    └── tanStackRouterProvider (alternative implementation)
```

### Context Flow

```
Admin Component
  └─ AdminRouter (basename setup)
       └─ RouterWrapper (creates router if not in context)
            └─ RouterProviderContext.Provider
                 └─ Application components
                      └─ Hooks delegate to provider via useRouterProvider()
```

## The RouterProvider Interface

The `RouterProvider` interface defines all routing primitives react-admin needs:

### Hooks

| Hook | Description | react-router equivalent |
|------|-------------|------------------------|
| `useLocation()` | Returns current location object | `useLocation()` |
| `useNavigate()` | Returns navigation function | `useNavigate()` |
| `useParams()` | Returns URL parameters | `useParams()` |
| `useBlocker()` | Blocks navigation (unsaved changes) | `useBlocker()` |
| `useMatch()` | Matches current location to pattern | `useMatch()` |
| `useInRouterContext()` | Checks if inside router | `useInRouterContext()` |
| `useCanBlock()` | Checks if blocking is supported | N/A (data router check) |

### Components

| Component | Description | react-router equivalent |
|-----------|-------------|------------------------|
| `Link` | Navigation link | `<Link>` |
| `Navigate` | Declarative redirect | `<Navigate>` |
| `Route` | Route definition | `<Route>` |
| `Routes` | Routes container | `<Routes>` |
| `Outlet` | Nested route outlet | `<Outlet>` |

### Utilities

| Utility | Description |
|---------|-------------|
| `matchPath()` | Match a pattern against a pathname |
| `RouterWrapper` | Creates router if not in context |

## Implementing a New Router Adapter

To add support for a new routing library, implement the `RouterProvider` interface:

```typescript
import type { RouterProvider } from './RouterProvider';

export const myRouterProvider: RouterProvider = {
    // Hooks
    useLocation: () => { /* ... */ },
    useNavigate: () => { /* ... */ },
    useParams: () => { /* ... */ },
    useBlocker: (shouldBlock) => { /* ... */ },
    useMatch: (pattern) => { /* ... */ },
    useInRouterContext: () => { /* ... */ },
    useCanBlock: () => { /* ... */ },

    // Components
    Link: MyLink,
    Navigate: MyNavigate,
    Route: MyRoute,
    Routes: MyRoutes,
    Outlet: MyOutlet,

    // Utilities
    matchPath: (pattern, pathname) => { /* ... */ },
    RouterWrapper: MyRouterWrapper,
};
```

### Key Implementation Details

1. **RouterWrapper must support two modes**:
   - **Standalone mode**: Create a router when none exists
   - **Embedded mode**: Pass through when already in a router context

2. **Route/Routes translation**: If your router uses configuration-based routing (like TanStack Router), implement a translation layer that accepts JSX-based `<Route>` elements.

3. **Duck-typing for Route detection**: The Routes component should use duck-typing to detect Route elements, not strict type checking. This allows users to import Route from react-router-dom.

```typescript
// Good: duck-typing
const isRouteElement = (child) => {
    return child.props.path !== undefined ||
           child.props.index !== undefined ||
           child.props.element !== undefined;
};

// Bad: strict type checking (breaks with react-router's Route)
const isRouteElement = (child) => child.type === Route;
```

## Backward Compatibility

The abstraction maintains full backward compatibility with react-admin's existing routing behavior (react-router based):

1. **Default provider**: `reactRouterProvider` is the default, so existing apps work without changes
2. **Import from react-admin**: Hooks like `useNavigate`, `useLocation`, `useParams` can be imported from `react-admin`
3. **react-router imports still work**: Users can still import directly from react-router-dom if they prefer

## Key Files Reference

| File | Purpose |
|------|---------|
| `RouterProvider.ts` | The interface contract all adapters must implement |
| `RouterProviderContext.tsx` | Context and `useRouterProvider` hook |
| `adapters/reactRouterProvider.tsx` | Default implementation using react-router |
| `adapters/tanStackRouterProvider.tsx` | Alternative implementation using TanStack Router |
| `AdminRouter.tsx` | High-level component that sets up routing for Admin |
