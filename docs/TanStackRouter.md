---
layout: default
title: "TanStack Router Integration"
---

# TanStack Router Integration

React-admin supports [TanStack Router](https://tanstack.com/router/latest) as an alternative to react-router. This allows you to use react-admin in a TanStack Start application.

## Installation

To use TanStack Router with react-admin, install the required packages:

```bash
npm install @tanstack/react-router @tanstack/history
# or
yarn add @tanstack/react-router @tanstack/history
```

These packages are optional peer dependencies of `ra-core`, so they won't be installed automatically.

## Configuration

To use TanStack Router, pass the `tanStackRouterProvider` to the `<Admin>` component:

```tsx
import { Admin, Resource, ListGuesser, tanStackRouterProvider } from 'react-admin';
import { dataProvider } from './dataProvider';

const App = () => (
    <Admin
        dataProvider={dataProvider}
        routerProvider={tanStackRouterProvider}
    >
        <Resource name="posts" list={ListGuesser} />
        <Resource name="comments" list={ListGuesser} />
    </Admin>
);

export default App;
```

That's it! React-admin will now use TanStack Router for all routing operations.

## Standalone Mode

When using `tanStackRouterProvider` without an existing TanStack Router, react-admin creates its own router automatically. This is called **standalone mode**.

In standalone mode, react-admin:

- Creates a TanStack Router with hash-based history (URLs like `/#/posts`)
- Handles all route matching internally
- Manages navigation and history

This is the simplest setup and requires no additional configuration.

```tsx
// Standalone mode - react-admin creates the router
import { Admin, Resource, tanStackRouterProvider } from 'react-admin';

const App = () => (
    <Admin
        dataProvider={dataProvider}
        routerProvider={tanStackRouterProvider}
    >
        <Resource name="posts" list={PostList} />
    </Admin>
);
```

## Embedded Mode

If your application already uses TanStack Router, you can embed react-admin inside it. React-admin detects the existing router context and uses it instead of creating its own.

```tsx
import * as React from 'react';
import {
    createRouter,
    createRootRoute,
    createRoute,
    RouterProvider,
    Outlet,
    Link,
} from '@tanstack/react-router';
import { createHashHistory } from '@tanstack/history';
import { Admin, Resource, tanStackRouterProvider } from 'react-admin';
import { dataProvider } from './dataProvider';
import { PostList, PostEdit } from './posts';

// Define your routes
const rootRoute = createRootRoute({
    component: () => (
        <div>
            <nav>
                <Link to="/">Home</Link>
                <Link to="/admin">Admin</Link>
            </nav>
            <Outlet />
        </div>
    ),
});

const homeRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: () => <div>Welcome to my app!</div>,
});

// Mount react-admin at /admin
const adminRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/admin',
    component: () => (
        <Admin
            dataProvider={dataProvider}
            routerProvider={tanStackRouterProvider}
            basename="/admin"
        >
            <Resource name="posts" list={PostList} edit={PostEdit} />
        </Admin>
    ),
});

const routeTree = rootRoute.addChildren([homeRoute, adminRoute]);

const router = createRouter({
    routeTree,
    history: createHashHistory(),
});

const App = () => <RouterProvider router={router} />;

export default App;
```

**Important**: When embedding react-admin, set the `basename` prop to match the path where react-admin is mounted. In the example above, react-admin is mounted at `/admin`, so `basename="/admin"`.

## Custom Routes

Custom routes work the same way as with react-router. You can use `<CustomRoutes>` to add custom pages:

```tsx
import { Admin, Resource, CustomRoutes, tanStackRouterProvider } from 'react-admin';

const { Route } = tanStackRouterProvider;

const App = () => (
    <Admin
        dataProvider={dataProvider}
        routerProvider={tanStackRouterProvider}
    >
        <CustomRoutes>
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<Profile />} />
        </CustomRoutes>
        <CustomRoutes noLayout>
            <Route path="/public" element={<PublicPage />} />
        </CustomRoutes>
        <Resource name="posts" list={PostList} />
    </Admin>
);
```

## Using Router Hooks

When using TanStack Router, import routing hooks from `react-admin` instead of directly from TanStack Router:

```tsx
// Recommended - router-agnostic
import { useNavigate, useLocation, useParams } from 'react-admin';
```

The hooks from `react-admin` work with both react-router and TanStack Router, making your code portable:

```tsx
import { useNavigate, useLocation, useParams } from 'react-admin';

const MyComponent = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams();

    const handleClick = () => {
        navigate('/posts');
        // or navigate(-1) to go back
        // or navigate({ pathname: '/posts', search: '?filter=active' })
    };

    return (
        <div>
            <p>Current path: {location.pathname}</p>
            <p>Record ID: {id}</p>
            <button onClick={handleClick}>Go to Posts</button>
        </div>
    );
};
```

## Navigation Blocking

TanStack Router supports navigation blocking out of the box. The `warnWhenUnsavedChanges` feature in react-admin forms works automatically:

```tsx
import { Edit, SimpleForm, TextInput } from 'react-admin';

const PostEdit = () => (
    <Edit>
        <SimpleForm warnWhenUnsavedChanges>
            <TextInput source="title" />
            <TextInput source="body" multiline />
        </SimpleForm>
    </Edit>
);
```

Unlike react-router (which requires a Data Router for blocking to work), TanStack Router always supports navigation blocking.

## Linking Between Pages

Use the `LinkBase` component from `react-admin` for router-agnostic links:

```tsx
import { LinkBase } from 'react-admin';

const Dashboard = () => (
    <div>
        <h1>Dashboard</h1>
        <LinkBase to="/posts">View all posts</LinkBase>
        <LinkBase to="/posts/create">Create a new post</LinkBase>
        <LinkBase to="/posts/123/show">View post #123</LinkBase>
    </div>
);
```

Or use `useCreatePath` for dynamic paths:

```tsx
import { LinkBase, useCreatePath } from 'react-admin';

const Dashboard = () => {
    const createPath = useCreatePath();
    return (
        <div>
            <LinkBase to={createPath({ resource: 'posts', type: 'list' })}>
                Posts
            </LinkBase>
            <LinkBase to={createPath({ resource: 'posts', type: 'create' })}>
                Create Post
            </LinkBase>
            <LinkBase to={createPath({ resource: 'posts', type: 'show', id: 123 })}>
                Post #123
            </LinkBase>
        </div>
    );
};
```

## Limitations

The TanStack Router adapter has some limitations compared to native TanStack Router usage:

### Type Safety

TanStack Router's main feature is compile-time type safety based on route definitions. The react-admin adapter doesn't provide this level of type safety because react-admin generates routes dynamically from `<Resource>` components.

### Search Params

TanStack Router treats search params as typed objects with validation. The adapter uses string-based search (`?key=value`) for compatibility with react-admin's list filters.

### Route Loaders

TanStack Router's data loading features (`loader`, `beforeLoad`) are not used by the adapter. React-admin handles data loading through its own `dataProvider` system.

### File-Based Routing

TanStack Router supports file-based routing similar to Next.js. This feature is not compatible with react-admin's declarative `<Resource>` approach.
